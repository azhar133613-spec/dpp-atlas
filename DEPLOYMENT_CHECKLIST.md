# DPP ATLAS — Complete Deployment Checklist
## Zero-Cost Production Deployment Guide

---

## PHASE 1: SUPABASE SETUP (15 minutes)

### Step 1.1 — Create Supabase Project
1. Go to https://supabase.com and create a free account
2. Click "New Project" → name it `dpp-atlas`
3. Choose region closest to Bangladesh: **Singapore (ap-southeast-1)**
4. Save the auto-generated database password securely

### Step 1.2 — Run Database Schema
1. In Supabase dashboard: go to **SQL Editor**
2. Open `/lib/schema.sql` from this project
3. Paste the ENTIRE file content and click **Run**
4. Verify all 4 tables appear in **Table Editor**:
   - `factories` ✓
   - `assessments` ✓
   - `dpp_passports` ✓
   - `ai_reports` ✓

### Step 1.3 — Collect Supabase Credentials
Go to **Settings → API** and copy:
```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```
⚠️ NEVER commit SUPABASE_SERVICE_ROLE_KEY to git.

### Step 1.4 — Enable Supabase Auth Providers
1. Go to **Authentication → Providers**
2. Enable **Email** (already on by default)
3. Enable **Google OAuth**:
   - Create a project at https://console.cloud.google.com
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add Supabase callback URL: `https://[project-id].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### Step 1.5 — Create Supabase Storage Bucket
1. Go to **Storage → New Bucket**
2. Name: `dpp-assets`
3. Set **Public**: YES (QR codes must be publicly accessible)
4. File size limit: 5MB
5. Allowed types: `image/png,image/jpeg,application/pdf`

---

## PHASE 2: GEMINI AI SETUP (5 minutes)

### Step 2.1 — Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key — it starts with `AIza...`
4. Free tier limits: 15 RPM, 1M TPM, 1500 requests/day
   → Supports ~700+ assessments per day on free tier ✅

### Step 2.2 — Test the Key (optional)
```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```
Expect HTTP 200 with a response.

---

## PHASE 3: LOCAL DEVELOPMENT (10 minutes)

### Step 3.1 — Install Dependencies
```bash
cd dpp-atlas
npm install
```

### Step 3.2 — Create Environment File
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and fill in ALL values:
```
NEXT_PUBLIC_SUPABASE_URL=https://[id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
GEMINI_API_KEY=[AIza...]
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=bn
```

### Step 3.3 — Run Development Server
```bash
npm run dev
```
Open http://localhost:3000 — should redirect to http://localhost:3000/bn

### Step 3.4 — Verify Each Route
Test ALL routes before deploying:
- [ ] `/bn` — Landing page loads, Spline fallback shows if no scene URL set
- [ ] `/bn/enroll` — Enrollment form renders, all fields work
- [ ] `/bn/login` — Login form and Google OAuth button visible
- [ ] `/bn/assess` — Redirects to `/bn/enroll` if no factory (correct behaviour)
- [ ] `/bn/dashboard` — Redirects to `/bn/login` if not logged in (correct)
- [ ] `/dpp/00000000000000` — 404 not found (expected for fake GTIN)
- [ ] `/api/v1/save-assessment` — POST with no body returns 400
- [ ] `/sitemap.xml` — Returns XML with at least 2 URLs
- [ ] `/robots.txt` — Returns valid robots content

### Step 3.5 — End-to-End Flow Test
1. Create account at `/bn/login` (use test email)
2. Verify email (check inbox)
3. Enroll a factory at `/bn/enroll`
4. Complete assessment at `/bn/assess`
5. Confirm redirect to `/bn/report/[id]`
6. Check AI report appears (or fallback report)
7. Verify QR code renders with a valid URL
8. Check `/dpp/[gtin]` loads the public passport
9. Try PDF download
10. Check `/bn/dashboard` shows the assessment

---

## PHASE 4: PRODUCTION DEPLOYMENT — VERCEL (Recommended)

### Step 4.1 — Push to GitHub
```bash
git init
echo ".env.local" >> .gitignore
echo "node_modules/" >> .gitignore
echo ".next/" >> .gitignore
git add .
git commit -m "Initial DPP Atlas build"
git remote add origin https://github.com/[your-username]/dpp-atlas.git
git push -u origin main
```

### Step 4.2 — Deploy to Vercel
1. Go to https://vercel.com → "Add New Project"
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. **Root directory**: leave empty (project root)
5. Click **Environment Variables** and add ALL vars from `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   GEMINI_API_KEY
   NEXT_PUBLIC_APP_URL    ← set to your Vercel URL e.g. https://dpp-atlas.vercel.app
   NEXT_PUBLIC_DEFAULT_LOCALE=bn
   ```
6. Click **Deploy**
7. Wait ~2 minutes for build to complete

### Step 4.3 — Update Supabase Auth URLs
After Vercel gives you a production URL:
1. Go to Supabase → **Authentication → URL Configuration**
2. Set **Site URL**: `https://dpp-atlas.vercel.app`
3. Add to **Redirect URLs**: `https://dpp-atlas.vercel.app/**`
4. Update Google OAuth → Authorised redirect URIs to include your production URL

### Step 4.4 — Update NEXT_PUBLIC_APP_URL
In Vercel dashboard → Settings → Environment Variables:
- Update `NEXT_PUBLIC_APP_URL` to your actual production domain
- Redeploy: `vercel --prod` or push a commit

---

## ALTERNATIVE: NETLIFY DEPLOYMENT

### Netlify-specific steps
1. In Netlify: "New site from Git" → select repo
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add all environment variables (same as Vercel)
5. The `/public/_redirects` file already handles Netlify routing

**Note**: Netlify requires the `@netlify/plugin-nextjs` plugin for App Router:
```bash
npm install --save-dev @netlify/plugin-nextjs
```
Add `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## PHASE 5: POST-DEPLOYMENT CHECKLIST

### SEO (Task 12)
- [ ] Submit `https://your-domain.com/sitemap.xml` to Google Search Console
  → https://search.google.com/search-console
- [ ] Verify ownership via HTML meta tag (Vercel makes this easy)
- [ ] Run Lighthouse audit on `/bn` — target scores:
  - Performance: > 85
  - Accessibility: > 90
  - SEO: > 95
  - Best Practices: > 90

### Security Checks
- [ ] Confirm `.env.local` is in `.gitignore` and NOT in GitHub
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is server-only (never in NEXT_PUBLIC_*)
- [ ] Test RLS: log in as User A, try to access User B's factory data via Supabase
- [ ] Confirm `/api/v1/save-assessment` rejects requests without a valid factory_id

### Performance
- [ ] Spline loads lazily (does not block LCP)
- [ ] Bengali font (`Hind Siliguri`) loads via `next/font` — no layout shift
- [ ] `/dpp/[gtin]` loads in < 2 seconds on 3G (Lighthouse network throttle)
- [ ] All images use `next/image` (none in this project — no issue)

### Monitoring (Free)
- Vercel Analytics: enabled automatically (free tier = 2500 events/month)
- Supabase Dashboard → Logs: monitor API errors
- Set up a free UptimeRobot alert: https://uptimerobot.com
  → Monitor `/api/v1/save-assessment` (POST health check)

---

## PHASE 6: SPLINE 3D SETUP (Optional but recommended)

### Step 6.1 — Create Free Spline Account
1. Go to https://spline.design → Sign up free
2. Free tier allows unlimited public scenes

### Step 6.2 — Create Hero Scene
1. New file → use "Shapes" preset
2. Add a torus/sphere for textile visualization
3. Add particle system → export as "Public Link"
4. Copy the embed URL: `https://prod.spline.design/[scene-id]/scene.splinecode`
5. Replace the URL in `/components/3d/SplineHero.tsx`

### Step 6.3 — Create Factory Dashboard Scene
1. New file → use a box/building shape
2. Add emissive material colour (green/red based on score)
3. Export → copy URL
4. Replace in `/components/3d/SplineFactory.tsx`

**Important**: If you skip this step, the CSS fallback renders automatically. The app works without Spline scenes.

---

## TROUBLESHOOTING

### Build Error: "Cannot find module '@/types'"
```bash
npm run type-check  # see all TypeScript errors
```
Ensure `tsconfig.json` has `"paths": { "@/*": ["./*"] }`

### Supabase RLS Error: "new row violates row-level security policy"
1. Check you are logged in before calling insert
2. Ensure `user_id` in the insert matches `auth.uid()`
3. Re-run the RLS policies in `schema.sql`

### Gemini 429 Error (Rate Limited)
The rule-based fallback activates automatically. Check logs for "using fallback".
Rate limits reset every minute on free tier.

### Bengali Font Not Rendering
Ensure `Hind_Siliguri` is in `app/layout.tsx` font imports and the `font-bengali` CSS variable is set.

### QR Code Shows Wrong URL
Ensure `NEXT_PUBLIC_APP_URL` is set to your production domain (not localhost) before deployment.

---

**Total estimated setup time: 45–60 minutes**
**Ongoing hosting cost: $0/month at MVP scale**
