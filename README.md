# DPP Atlas 🌿
### Free AI-Powered EU ESPR Textile Compliance Assessment Platform

**আপনার টেক্সটাইল কমপ্লায়েন্স পাসপোর্ট** — Your Textile Compliance Passport

---

## What is DPP Atlas?

DPP Atlas is a free, AI-powered web platform that helps textile factories — primarily in Bangladesh — complete a structured **Digital Product Passport (DPP)** compliance assessment under the EU **ESPR (Ecodesign for Sustainable Products Regulation)**.

Factory owners answer 50+ structured questions in Bengali or English (with voice input), then instantly receive:

- ✅ A **compliance score** from 0–100 with a band (COMPLIANT / DEVELOPING / etc.)
- 🤖 An **AI-generated improvement roadmap** powered by Google Gemini 1.5 Flash
- 📋 A **public DPP passport page** (QR-scannable by EU buyers)
- 📄 A **downloadable buyer PDF report** (generated 100% in-browser)
- 📊 A **score trend dashboard** for tracking compliance over time

---

## Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Framework | Next.js 14 App Router + TypeScript | Free |
| Styling | Tailwind CSS | Free |
| Database | Supabase PostgreSQL | Free tier |
| Auth | Supabase Auth (Email + Google OAuth) | Free tier |
| AI Reports | Google Gemini 1.5 Flash API | Free tier (1500 RPD) |
| 3D Visuals | Spline (CSS fallback included) | Free plan |
| PDF Generation | jsPDF + html2canvas (browser-only) | Free |
| QR Codes | qrcode.react | Free |
| State | Zustand | Free |
| Forms | React Hook Form + Zod | Free |
| Charts | Recharts | Free |
| Hosting | Vercel / Netlify | Free tier |

**Total infrastructure cost at MVP: $0/month**

---

## Quick Start

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Gemini API key](https://makersuite.google.com/app/apikey) (free)

### Setup

```bash
# 1. Clone
git clone https://github.com/your-username/dpp-atlas.git
cd dpp-atlas

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Gemini credentials

# 4. Set up database
# Open Supabase SQL Editor and run /lib/schema.sql

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/bn` (Bengali default).

---

## Project Structure

```
dpp-atlas/
├── app/
│   ├── [locale]/              # Bengali + English routes
│   │   ├── page.tsx           # Landing page
│   │   ├── enroll/            # Factory enrollment
│   │   ├── assess/            # 50+ question assessment
│   │   ├── report/[id]/       # AI compliance report
│   │   ├── dashboard/         # Factory owner dashboard
│   │   └── login/             # Supabase auth
│   ├── dpp/[gtin]/            # Public DPP passport (no auth)
│   ├── api/v1/
│   │   ├── save-assessment/   # Saves + triggers AI + DPP generation
│   │   ├── generate-report/   # Standalone AI report regeneration
│   │   └── dpp/[gtin]/        # Public DPP API endpoint
│   ├── sitemap.ts             # Auto-generated XML sitemap
│   └── robots.ts              # Search engine rules
├── components/
│   ├── ui/                    # Shared UI components
│   ├── 3d/                    # Spline 3D components (lazy)
│   └── pdf/                   # PDF generator (browser-only)
├── lib/
│   ├── questions.ts           # 50+ DPP assessment questions
│   ├── scoring.ts             # Compliance scoring engine
│   ├── gemini.ts              # Gemini AI client + fallback
│   ├── supabase.ts            # Browser Supabase client
│   ├── supabase-server.ts     # Server Supabase client
│   ├── schema.sql             # Run in Supabase SQL Editor
│   └── utils.ts               # Shared utilities
├── hooks/
│   ├── useVoiceInput.ts       # Web Speech API (Bengali support)
│   └── useTranslations.ts     # Lightweight i18n hook
├── store/
│   └── index.ts               # Zustand global state
├── types/
│   ├── index.ts               # All TypeScript types
│   └── database.ts            # Supabase schema types
└── public/
    ├── locales/
    │   ├── bn/common.json     # Bengali translations
    │   └── en/common.json     # English translations
    └── _redirects             # Netlify routing fix
```

---

## Regulatory Coverage

The 50+ assessment questions cover:

| Standard | Coverage |
|---|---|
| EU ESPR 2024 | All mandatory DPP data fields |
| GS1 GLN / GTIN | Factory location + product ID |
| ISO 3759 | Dimensional stability (shrinkage) |
| ISO 16322-3 | Spirality (twisting) after washing |
| ISO 15487 | Visual appearance after washing |
| EU REACH | Chemical substance compliance |
| GOTS | Organic textile certification |
| OEKO-TEX STANDARD 100 | Chemical safety in textiles |
| EU CS3D | Supply chain due diligence |
| GHG Protocol | Carbon footprint documentation |

---

## Key Design Constraints

1. **Bengali First** — All UI defaults to Bengali (`bn-BD`). `Hind Siliguri` font loaded via `next/font/google`.
2. **Mobile First** — Minimum viewport: 375px (low-end Android).
3. **Zero Cost** — Every service operates within free tiers.
4. **Immutable Assessments** — Submitted answers cannot be edited (SHA-256 hash verification).
5. **No Greenwashing** — DPP passport only generated when critical fields are present.
6. **AI Honesty** — Every AI report includes a mandatory disclaimer.
7. **Lazy 3D** — Spline scenes load after main content (never blocks LCP).
8. **RHF Only** — All forms use React Hook Form. No uncontrolled inputs.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=          # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # From Supabase project settings
SUPABASE_SERVICE_ROLE_KEY=         # Server-only — never expose to client
GEMINI_API_KEY=                    # From Google AI Studio
NEXT_PUBLIC_APP_URL=               # Your production domain
NEXT_PUBLIC_DEFAULT_LOCALE=bn      # Bengali as default
```

---

## Deployment

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for the complete step-by-step deployment guide covering Supabase, Gemini, Vercel, and Netlify.

---

## Monetization

See [MONETIZATION_STRATEGY.md](./MONETIZATION_STRATEGY.md) for the Phase 2 revenue plan including:
- Credit pack pricing (৳99–৳6,999)
- Subscription tiers (৳499–৳4,999/month)
- EU buyer-side directory revenue
- Grant opportunities (EU Horizon, UNDP, GIZ)
- Year 1 revenue projection: ~$77,000 USD ARR

---

## License

MIT — Free to use, modify, and deploy. Attribution appreciated.

---

*Built for the 2027 EU ESPR enforcement deadline.*  
*Every Bangladeshi textile factory needs a DPP. DPP Atlas makes it free to start.*
