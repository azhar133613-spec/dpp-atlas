-- ═══════════════════════════════════════════════════════════════
-- DPP ATLAS — Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- Execute all statements in order.
-- ═══════════════════════════════════════════════════════════════

-- ── ENABLE UUID EXTENSION ─────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── TABLE 1: FACTORIES ────────────────────────────────────────
-- Stores factory enrollment data. One factory per user account.
CREATE TABLE IF NOT EXISTS public.factories (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  factory_name        TEXT NOT NULL,
  gln_location        VARCHAR(13),          -- GS1 Global Location Number (13 digits)
  country             TEXT NOT NULL,
  tier_level          TEXT NOT NULL CHECK (tier_level IN ('tier1', 'tier2', 'tier3', 'tier4')),
  contact_person      TEXT NOT NULL,
  contact_email       TEXT NOT NULL,
  contact_phone       TEXT,
  address             TEXT,
  language_preference TEXT NOT NULL DEFAULT 'bn' CHECK (language_preference IN ('bn', 'en')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One factory per user account at MVP
  UNIQUE (user_id)
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_factories_user_id ON public.factories(user_id);

-- ── TABLE 2: ASSESSMENTS ──────────────────────────────────────
-- Stores each compliance assessment submission.
-- IMMUTABLE once created (per CONSTRAINT 6).
CREATE TABLE IF NOT EXISTS public.assessments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id        UUID NOT NULL REFERENCES public.factories(id) ON DELETE CASCADE,
  session_data      JSONB NOT NULL,           -- All answers: { questionId: answerValue }
  compliance_score  SMALLINT NOT NULL         -- 0–100
                    CHECK (compliance_score >= 0 AND compliance_score <= 100),
  score_breakdown   JSONB NOT NULL,           -- Category breakdown array
  language_used     TEXT NOT NULL DEFAULT 'bn' CHECK (language_used IN ('bn', 'en')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- NOTE: No updated_at — assessments are immutable by design
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_assessments_factory_id ON public.assessments(factory_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);

-- ── TABLE 3: DPP PASSPORTS ────────────────────────────────────
-- Stores the public-facing Digital Product Passport data.
-- Linked 1:1 to an assessment.
CREATE TABLE IF NOT EXISTS public.dpp_passports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id       UUID NOT NULL UNIQUE REFERENCES public.assessments(id) ON DELETE CASCADE,
  gtin_code           VARCHAR(14) NOT NULL UNIQUE,  -- GS1 GTIN-14
  material_composition TEXT NOT NULL,               -- e.g. "70% Cotton, 30% Polyester"
  iso_3759_passed     BOOLEAN,                      -- NULL = not tested
  iso_16322_passed    BOOLEAN,                      -- NULL = not tested
  iso_15487_passed    BOOLEAN,                      -- NULL = not tested
  reach_compliant     BOOLEAN,
  gots_certified      BOOLEAN,
  oeko_tex_certified  BOOLEAN,
  data_hash           VARCHAR(64) NOT NULL,          -- SHA-256 of assessment_data
  public_url          TEXT NOT NULL UNIQUE,          -- The scannable URL
  qr_image_url        TEXT,                         -- Supabase Storage URL for QR
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast GTIN lookups (QR code scans)
CREATE INDEX IF NOT EXISTS idx_dpp_passports_gtin ON public.dpp_passports(gtin_code);
CREATE INDEX IF NOT EXISTS idx_dpp_passports_assessment ON public.dpp_passports(assessment_id);

-- ── TABLE 4: AI REPORTS ───────────────────────────────────────
-- Stores the AI-generated improvement reports.
-- Linked 1:1 to an assessment.
CREATE TABLE IF NOT EXISTS public.ai_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   UUID NOT NULL UNIQUE REFERENCES public.assessments(id) ON DELETE CASCADE,
  ai_provider     TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
  report_content  TEXT NOT NULL,            -- Raw AI response text
  improvement_tips JSONB NOT NULL,          -- Structured report: AiReportContent type
  used_fallback   BOOLEAN NOT NULL DEFAULT FALSE,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_assessment ON public.ai_reports(assessment_id);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Every table has RLS enabled.
-- Users can ONLY access their own factory's data.
-- DPP passports are publicly readable (for QR scans).
-- ═══════════════════════════════════════════════════════════════

-- ── ENABLE RLS ON ALL TABLES ──────────────────────────────────
ALTER TABLE public.factories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dpp_passports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports     ENABLE ROW LEVEL SECURITY;

-- ── FACTORIES POLICIES ────────────────────────────────────────

-- Factory owners can view ONLY their own factory
CREATE POLICY "factories_select_own"
  ON public.factories FOR SELECT
  USING (auth.uid() = user_id);

-- Factory owners can create their own factory record
CREATE POLICY "factories_insert_own"
  ON public.factories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Factory owners can update their own factory (profile edits)
CREATE POLICY "factories_update_own"
  ON public.factories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── ASSESSMENTS POLICIES ──────────────────────────────────────

-- Users can view assessments for their own factory only
CREATE POLICY "assessments_select_own"
  ON public.assessments FOR SELECT
  USING (
    factory_id IN (
      SELECT id FROM public.factories WHERE user_id = auth.uid()
    )
  );

-- Users can insert assessments for their own factory
CREATE POLICY "assessments_insert_own"
  ON public.assessments FOR INSERT
  WITH CHECK (
    factory_id IN (
      SELECT id FROM public.factories WHERE user_id = auth.uid()
    )
  );

-- NO UPDATE policy on assessments — they are immutable (CONSTRAINT 6)
-- NO DELETE policy — historical data must be preserved

-- ── DPP PASSPORTS POLICIES ────────────────────────────────────

-- PUBLIC READ: Anyone can scan a DPP passport QR code — no login required
CREATE POLICY "dpp_passports_public_read"
  ON public.dpp_passports FOR SELECT
  USING (true);

-- Only factory owners (via their assessments) can insert DPP passports
CREATE POLICY "dpp_passports_insert_own"
  ON public.dpp_passports FOR INSERT
  WITH CHECK (
    assessment_id IN (
      SELECT a.id FROM public.assessments a
      JOIN public.factories f ON a.factory_id = f.id
      WHERE f.user_id = auth.uid()
    )
  );

-- ── AI REPORTS POLICIES ───────────────────────────────────────

-- Users can view AI reports for their own assessments
CREATE POLICY "ai_reports_select_own"
  ON public.ai_reports FOR SELECT
  USING (
    assessment_id IN (
      SELECT a.id FROM public.assessments a
      JOIN public.factories f ON a.factory_id = f.id
      WHERE f.user_id = auth.uid()
    )
  );

-- System (via service role) can insert AI reports
-- This works because the API routes use the service role key
CREATE POLICY "ai_reports_insert_service"
  ON public.ai_reports FOR INSERT
  WITH CHECK (true); -- Service role bypasses RLS anyway

-- ═══════════════════════════════════════════════════════════════
-- SUPABASE STORAGE BUCKET
-- For QR code images — public read, authenticated write
-- Run this separately in Supabase Dashboard > Storage
-- ═══════════════════════════════════════════════════════════════

-- NOTE: Storage buckets must be created in the Dashboard UI, not SQL.
-- Go to: Storage > New Bucket
-- Name: dpp-assets
-- Public: YES (for QR code URLs to work without auth)
-- File size limit: 5MB
-- Allowed MIME types: image/png, image/jpeg, application/pdf

-- ═══════════════════════════════════════════════════════════════
-- HELPER FUNCTION: Update updated_at timestamp
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to factories table
CREATE TRIGGER factories_set_updated_at
  BEFORE UPDATE ON public.factories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- USEFUL QUERIES FOR MONITORING (Admin use only)
-- ═══════════════════════════════════════════════════════════════

-- Count assessments by compliance band
-- SELECT
--   CASE
--     WHEN compliance_score >= 90 THEN 'COMPLIANT'
--     WHEN compliance_score >= 70 THEN 'CONDITIONALLY_COMPLIANT'
--     WHEN compliance_score >= 50 THEN 'DEVELOPING'
--     ELSE 'NON_COMPLIANT'
--   END as band,
--   COUNT(*) as count,
--   ROUND(AVG(compliance_score), 1) as avg_score
-- FROM public.assessments
-- GROUP BY band
-- ORDER BY count DESC;

-- Average score by country
-- SELECT f.country, ROUND(AVG(a.compliance_score), 1) as avg_score, COUNT(*) as factory_count
-- FROM public.assessments a
-- JOIN public.factories f ON a.factory_id = f.id
-- GROUP BY f.country
-- ORDER BY avg_score DESC;
