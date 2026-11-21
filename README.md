# DPP Atlas

A free, Bangla-first data check for textile and garment factories preparing for EU Digital Product Passport (DPP) data requests.

Live: https://dpp-atlas.vercel.app

## What it does

For one product, you mark each DPP data point as: have it, partly have it, missing, nobody owns it, or only the brand/buyer has it. The tool then builds an action list grouped by likely holder (Merchandising, QC, Compliance and so on), which you can download as CSV or print. Every data point shows the rule, draft or standard it comes from. There is no score.

Answers stay in your browser (localStorage). There are no accounts and no server-side storage.

## What it is not

- Not a certificate, passport, audit or legal advice. Nothing you enter is verified.
- Not an official EU, JRC, BGMEA or buyer tool. Not affiliated with any of them.
- The textile data list comes from a JRC draft study. The binding rules will come from the Commission's textile delegated act, which the Commission's textile page gives as Q4 2027 (indicative).
- "Likely holder" and "outside call" are assumptions to be confirmed in a real factory.

## Sources

See the Rules and standards page in the app. Each source is tagged: seen in source, limited check, or not verified.

## Run locally

```
npm install
npm run dev
```

Pages: `/bn` and `/en` (landing), `/[locale]/check` (Data Check), `/[locale]/rules` (rules and standards).

## Status

Student project. Content last reviewed November 2026. Not yet tested in a real factory.
