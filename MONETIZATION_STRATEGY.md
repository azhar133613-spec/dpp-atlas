# DPP ATLAS — Free Monetization Strategy
## Phase 2 Revenue Plan: Micro-Pricing for Zero-to-Revenue

---

## OVERVIEW

DPP Atlas is free at MVP stage. Phase 2 introduces micro-pricing  
targeted specifically at the Bangladesh garment industry's price sensitivity.

**Currency**: BDT (Bangladeshi Taka) for South Asian users.  
**Conversion note** (as of 2024): ৳99 ≈ $0.90 USD — accessible to factory owners.  
**Principle**: The free tier NEVER loses functionality. Paid features add value, not gatekeeping.

---

## FREE TIER (Always Free — Never Remove)

| Feature | Limit | Purpose |
|---|---|---|
| DPP Assessments | 3 per factory/month | Encourage habit formation |
| AI Report | Rule-based fallback | Always usable, AI is the upgrade |
| Score + Band | Unlimited | Core value proposition |
| Public DPP Passport | 1 active | Buyers can always scan |
| Dashboard | Full history | Data lock-in keeps users |
| Voice Input | Unlimited | Accessibility must stay free |
| Bengali/English | Unlimited | Language access must stay free |

---

## PHASE 2A: MICRO-CREDIT SYSTEM (Month 3–6)

### Product: Assessment Credits

**How it works:**
Users buy credit packs to unlock premium features per assessment.  
Credits are purchased once and never expire — no subscription pressure.

### Credit Pack Pricing (BDT)

| Pack | Credits | Price (BDT) | Price (USD) | Best For |
|---|---|---|---|---|
| Starter | 5 credits | ৳299 | ~$2.70 | First-time buyers |
| Factory | 20 credits | ৳999 | ~$9.10 | Regular factories |
| Growth | 60 credits | ৳2,499 | ~$22.70 | Active exporters |
| Enterprise | 200 credits | ৳6,999 | ~$63.60 | BGMEA members |

### Credit Costs Per Feature

| Premium Feature | Credits | Free Equivalent |
|---|---|---|
| Gemini AI Report (full) | 2 credits | Rule-based fallback |
| Buyer PDF — Branded | 3 credits | Plain text report |
| 4th+ assessment/month | 1 credit | 3/month free |
| Priority AI (< 3 sec) | 1 credit | Standard 10–15 sec |
| Report sharing link (custom domain) | 1 credit | dpp-atlas.vercel.app/dpp/... |

### Implementation (Supabase)

Add to schema:
```sql
CREATE TABLE credit_balances (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  credits INTEGER NOT NULL DEFAULT 0,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,      -- positive = purchase, negative = spend
  feature TEXT NOT NULL,        -- 'ai_report', 'pdf_branded', etc.
  assessment_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Payment Gateway: SSLCommerz (Bangladesh)
- Free integration for Bangladeshi businesses
- Supports bKash, Nagad, Rocket (mobile money — dominant in BD)
- API: https://developer.sslcommerz.com

```typescript
// /app/api/v1/payment/initiate/route.ts
const sslcommerzPayload = {
  store_id: process.env.SSLCOMMERZ_STORE_ID,
  store_passwd: process.env.SSLCOMMERZ_STORE_PASS,
  total_amount: amount,
  currency: 'BDT',
  tran_id: `DPPATLAS-${Date.now()}`,
  success_url: `${BASE_URL}/api/v1/payment/success`,
  fail_url: `${BASE_URL}/api/v1/payment/fail`,
  cancel_url: `${BASE_URL}/bn/dashboard`,
  cus_name: factoryName,
  cus_email: userEmail,
  product_name: 'DPP Atlas Credits',
}
```

**Alternative for global users**: Stripe (free until revenue, then 2.9% + $0.30/transaction).

---

## PHASE 2B: SUBSCRIPTION TIERS (Month 6–12)

### Monthly Plans (BDT / month)

| Plan | Price BDT | Price USD | Target |
|---|---|---|---|
| Free | ৳0 | $0 | All factories |
| Professional | ৳499/mo | ~$4.50 | Active exporters |
| Business | ৳1,499/mo | ~$13.60 | Multi-line factories |
| Enterprise | ৳4,999/mo | ~$45.50 | Large manufacturers |

### Professional (৳499/mo) Includes:
- Unlimited AI assessments with Gemini
- Unlimited branded buyer PDFs
- Up to 3 factory profiles
- Priority AI report generation (< 5 seconds)
- Score trend analytics (up to 24 months)
- Email report delivery

### Business (৳1,499/mo) Includes:
- Everything in Professional
- Up to 10 factory profiles
- White-label PDF (factory's own logo)
- API access for ERP integration
- Bulk assessment import (CSV upload)
- Dedicated DPP subdomain: `factory-name.dpp-atlas.com`
- Monthly compliance email digest to buyers

### Enterprise (৳4,999/mo) Includes:
- Everything in Business
- Unlimited factory profiles
- Custom regulatory question sets
- BGMEA member verification badge
- ISO lab integration (upload test PDFs → auto-extract results)
- Quarterly compliance review call (video)
- Supabase dedicated project (data isolation)

---

## PHASE 2C: BUYER-SIDE MONETIZATION (Month 9–18)

### Product: Verified Factory Directory

EU brands and compliance officers pay to access:

| Feature | Price |
|---|---|
| Single factory verification report | ৳999 ($9) |
| Monthly factory watchlist (10 factories) | ৳2,999/mo ($27) |
| Verified Supplier Directory access (unlimited) | ৳9,999/mo ($91) |
| API access to DPP data (for ERP/PLM systems) | ৳19,999/mo ($182) |

**Why brands pay:**
- EU ESPR mandates due diligence on suppliers
- DPP Atlas becomes the cheapest verification layer
- Replacing $500/factory social audit costs

### Verification Badge
```
✅ DPP VERIFIED — DPP Atlas | Score: 82/100
   Last verified: January 2025
   GTIN: 00123456789012
```

This badge can be embedded on factory websites and in brand procurement portals.

---

## PHASE 2D: REPORT CREDIT MARKETPLACE (Month 12+)

### PDF Report Credits — One-Time Purchases

| Report Type | Price BDT | Audience |
|---|---|---|
| Standard Buyer PDF | ৳99 | Factory → Buyer |
| Executive Summary (1-pager) | ৳149 | Board/Investors |
| Full Compliance Dossier (12 pages) | ৳299 | EU Auditors |
| Co-branded (buyer logo + factory) | ৳499 | Major brand deals |
| eIDAS Electronic Seal (legal signing) | ৳999 | EU regulatory submission |

---

## REVENUE PROJECTIONS (Conservative, Year 1)

### Assumptions (based on BGMEA data — ~4,500 export-ready factories in BD)
- Month 3: 500 free users, 50 paying (10% conversion)
- Month 6: 2,000 free users, 200 paying
- Month 12: 8,000 free users, 800 paying

### Monthly Revenue Estimate (Month 12)

| Stream | Users | ARPU (BDT) | Monthly BDT | Monthly USD |
|---|---|---|---|---|
| Professional subscriptions | 400 | ৳499 | ৳199,600 | $1,815 |
| Business subscriptions | 80 | ৳1,499 | ৳119,920 | $1,090 |
| Enterprise subscriptions | 10 | ৳4,999 | ৳49,990 | $454 |
| Credit pack sales | 310 | ৳600 avg | ৳186,000 | $1,691 |
| Buyer directory (EU brands) | 15 | ৳9,999 | ৳149,985 | $1,363 |
| **TOTAL** | | | **৳705,495** | **$6,413** |

**Annual run rate by Month 12: ~$77,000 USD**

This is achievable with zero paid marketing — BGMEA has 4,500 members  
who all need EU DPP compliance by the 2027 ESPR enforcement deadline.

---

## PHASE 3 ROADMAP — ADVANCED FEATURES (Year 2)

### Q1 Year 2: Lab Integration
- Partner with SGS, Bureau Veritas, and Intertek Bangladesh
- Factories upload ISO test PDFs → AI extracts results automatically
- Lab-verified data earns a "Lab Tested" badge on the DPP passport
- Revenue share with lab partners (5% of referral fees)

### Q2 Year 2: Blockchain Immutability
- Migrate `data_hash` to a public blockchain anchor (Polygon — near-zero cost)
- DPP passport hashes anchored on-chain → tamper-proof for EU auditors
- "Blockchain Verified" badge — premium feature (৳9,999 one-time)

### Q3 Year 2: GS1 API Integration
- Direct GLN registration through the DPP Atlas dashboard
- Partnership with GS1 Bangladesh to co-market
- Auto-populate GS1 product data into DPP fields
- Revenue share with GS1 BD on new registrations

### Q4 Year 2: White-Label Platform
- Sell DPP Atlas as a white-label SaaS to:
  - BGMEA (association platform for all members)
  - National Board of Revenue (Bangladesh customs)
  - EU brand compliance departments (internal tool)
- Pricing: ৳500,000–৳2,000,000/year per white-label deal

### Year 3: EU Market Expansion
- Translate platform to German, French, Italian (major EU sourcing markets)
- Target Turkish and Vietnamese textile factories (same compliance need)
- EU office presence for regulatory credibility
- ESPR deadline pressure in 2027 creates massive demand spike

---

## NON-REVENUE: GRANT OPPORTUNITIES

DPP Atlas qualifies for multiple grants that do not dilute equity:

| Grant | Amount | Eligibility |
|---|---|---|
| EU Horizon Europe — Digital Transition | €50,000–€150,000 | Open-source DPP tools |
| IFC SME Financing (World Bank) | $25,000–$100,000 | Sustainable supply chain tools |
| UNDP Bangladesh Digital Fund | $10,000–$50,000 | Tech for Bangladesh SMEs |
| GIZ Sustainable Textiles Program | €30,000–€100,000 | EU-BD trade facilitation |

**Apply simultaneously** — they do not conflict with each other or with commercial revenue.

---

## PROTECTING FREE USER EXPERIENCE (CONSTRAINT 1)

**Rules for Phase 2 that must never be broken:**

1. The 3 free assessments/month limit NEVER reduces below 3
2. Voice input in Bengali NEVER becomes a paid feature
3. Public DPP passport page NEVER requires payment to view
4. Score and compliance band ALWAYS shown free — the information belongs to the factory
5. Fallback AI report ALWAYS generated for free — the rule-based system has no API cost
6. PDF download: one free watermarked version always available

**Framing**: Paid features ADD value (Gemini AI, branded PDFs, priority speed).  
They NEVER REMOVE features that existed in the free tier.

---

## QUICK WINS TO IMPLEMENT FIRST (Week 1 of Phase 2)

1. **Add credit balance UI** to dashboard navbar — shows `💎 12 credits`
2. **Show upgrade prompt** only when Gemini API fails (natural upsell moment)
3. **"Download Branded PDF" button** — grayed out with `৳99` price tag
4. **Email drip campaign** — 3 emails over 7 days after free assessment:
   - Day 1: "Your DPP score is ready" (delivered free)
   - Day 3: "5 EU brands are looking for Tier 1 factories like yours"
   - Day 7: "Upgrade to show buyers your certified DPP report"
5. **BGMEA partnership email** — one email to BGMEA BD could unlock 4,500 potential users

---

*DPP Atlas — Built for the 2027 EU ESPR deadline.*  
*Every Bangladeshi factory needs a DPP. We make it free to start.*
