import type { Metadata } from "next";
import { FIELDS } from "./check/fields";
import PhoneSection from "./_ui/PhoneSection";

type P = { params: { locale: string } };

export function generateMetadata({ params }: P): Metadata {
  const bn = params.locale === "bn";
  return bn
    ? {
        title: "টেক্সটাইল DPP ডেটা চেক — বাংলাদেশের কারখানার জন্য",
        description:
          "ইইউ ডিজিটাল প্রোডাক্ট পাসপোর্ট তথ্যের অনুরোধের আগে জানুন কোন তথ্য কার কাছে আছে। বিনামূল্যের, বাংলা-প্রথম চেকলিস্ট। এটি সনদ বা আইনি পরামর্শ নয়।",
      }
    : {
        title: "Textile DPP data check for Bangladesh factories",
        description:
          "Find out who holds each product data point before an EU buyer asks for Digital Product Passport data. A free, Bangla-first checklist. Not a certificate or legal advice.",
      };
}

const CSS = `
.dl{--ink:#0f172a;--muted:#475569;--line:#e2e8f0;--soft:#f5f7f6;--brand:#0f766e;--brand-d:#115e59;--warn:#b45309;--bad:#b91c1c;--ok:#15803d;--info:#1d4ed8;
font-family:'Hind Siliguri',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased}
.dl *{box-sizing:border-box}
.dl:lang(bn){line-height:1.8}
.dl :where(a){color:inherit}
.dl a:focus-visible,.dl summary:focus-visible{outline:3px solid #0f766e;outline-offset:3px;border-radius:6px}
.dl-skip{position:absolute;left:-9999px;top:8px;background:#fff;padding:8px 12px;border:2px solid var(--brand);z-index:50}
.dl-skip:focus{left:8px}
.dl-wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.dl-nav{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line)}
.dl-nav .dl-wrap{display:flex;align-items:center;gap:20px;height:64px}
.dl-logo{font-weight:700;font-size:1.15rem;text-decoration:none;letter-spacing:-.01em;margin-right:auto;display:flex;align-items:center;gap:8px}
.dl-logo i{display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--brand)}
.dl-links{display:flex;gap:22px;align-items:center}
.dl-links a:not(.dl-btn){text-decoration:none;color:var(--muted);font-size:.95rem}
.dl-links a:not(.dl-btn):hover{color:var(--ink)}
.dl-lang{border:1px solid var(--line);padding:5px 12px;border-radius:8px;text-decoration:none;font-size:.9rem;color:var(--ink)}
.dl-btn{display:inline-block;text-decoration:none;font-weight:600;border-radius:10px;padding:12px 22px;font-size:1rem;border:2px solid var(--brand);line-height:1.3;text-align:center}
.dl-btn-p{background:var(--brand);color:#fff}
.dl-btn-p:hover{background:var(--brand-d);border-color:var(--brand-d)}
.dl-btn-s{background:#fff;color:var(--brand)}
.dl-btn-s:hover{background:var(--soft)}
.dl-nav .dl-btn{padding:8px 16px;font-size:.92rem}
.dl-hero{padding:64px 0 56px;background:linear-gradient(180deg,var(--soft),#fff)}
.dl-hero .dl-wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center}
.dl h1{font-size:2.7rem;line-height:1.15;letter-spacing:-.02em;margin:0 0 18px;font-weight:700}
.dl:lang(bn) h1{line-height:1.4;letter-spacing:0;font-size:2.4rem}
.dl-sub{font-size:1.125rem;color:var(--muted);max-width:60ch;margin:0 0 26px}
.dl-cta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.dl-note{font-size:.92rem;color:var(--muted);margin:0}
.dl-card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 12px 32px rgba(15,23,42,.08);overflow:hidden}
.dl-card-h{padding:14px 18px;border-bottom:1px solid var(--line);font-weight:600;font-size:.95rem;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.dl-card-h span{color:var(--muted);font-weight:400;font-size:.85rem}
.dl-row{padding:14px 18px;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:start}
.dl-row:last-of-type{border-bottom:0}
.dl-row b{font-weight:600;font-size:.95rem;line-height:1.45}
.dl-row small{grid-column:1;color:var(--muted);font-size:.85rem}
.dl-chip{grid-row:1/3;grid-column:2;align-self:center;font-size:.8rem;font-weight:600;padding:3px 10px;border-radius:99px;border:1px solid;white-space:nowrap}
.dl-c-nobody{color:var(--bad);background:#fef2f2;border-color:#fecaca}
.dl-c-have{color:var(--ok);background:#f0fdf4;border-color:#bbf7d0}
.dl-c-partial{color:var(--warn);background:#fffbeb;border-color:#fde68a}
.dl-c-brand{color:var(--info);background:#eff6ff;border-color:#bfdbfe}
.dl-card-f{padding:12px 18px;background:var(--soft);font-size:.85rem;color:var(--muted);border-top:1px solid var(--line)}
.dl-sec{padding:72px 0}
.dl-sec.dl-alt{background:var(--soft)}
.dl h2{font-size:1.95rem;line-height:1.25;letter-spacing:-.01em;margin:0 0 10px;font-weight:700}
.dl:lang(bn) h2{line-height:1.5;letter-spacing:0}
.dl-lead{color:var(--muted);font-size:1.05rem;max-width:62ch;margin:0 0 36px}
.dl h3{font-size:1.1rem;margin:0 0 6px;font-weight:600;line-height:1.4}
.dl :where(p){margin:0}
.dl-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;list-style:none;margin:0;padding:0;counter-reset:s}
.dl-steps li{counter-increment:s;background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px}
.dl-steps li:before{content:counter(s);display:inline-flex;width:30px;height:30px;border-radius:50%;background:var(--brand);color:#fff;font-weight:600;align-items:center;justify-content:center;margin-bottom:12px}
.dl-steps p,.dl-feat p{color:var(--muted);font-size:.98rem}
.dl-feats{display:grid;grid-template-columns:repeat(2,1fr);gap:28px 40px}
.dl-feat{border-top:3px solid var(--brand);padding-top:14px}
.dl-stat{margin-top:36px;padding:18px 22px;border:1px solid var(--line);border-left:4px solid var(--warn);border-radius:10px;background:#fff;color:var(--muted);font-size:.98rem}
.dl-stat strong{color:var(--ink)}
.dl-src{display:flex;flex-wrap:wrap;gap:10px;list-style:none;margin:0 0 20px;padding:0}
.dl-src li{border:1px solid var(--line);background:#fff;border-radius:99px;padding:6px 14px;font-size:.92rem}
.dl-lim{list-style:none;margin:0;padding:0;display:grid;gap:12px;max-width:760px}
.dl-lim li{padding-left:28px;position:relative;color:var(--ink)}
.dl-lim li:before{content:"!";position:absolute;left:0;top:3px;width:20px;height:20px;border-radius:50%;background:#fffbeb;border:1px solid #fde68a;color:var(--warn);font-weight:700;font-size:.8rem;display:flex;align-items:center;justify-content:center;line-height:1}
.dl-end{background:var(--ink);color:#fff;text-align:center;padding:64px 0}
.dl-end h2{color:#fff}
.dl-end p{color:#cbd5e1;margin:0 auto 24px;max-width:56ch}
.dl-end .dl-btn-p{background:#14b8a6;border-color:#14b8a6;color:#042f2e}
.dl-end .dl-btn-p:hover{background:#2dd4bf;border-color:#2dd4bf}
.dl-foot{padding:32px 0;border-top:1px solid var(--line);font-size:.9rem;color:var(--muted)}
.dl-foot .dl-wrap{display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between}
.dl-foot nav{display:flex;flex-wrap:wrap;gap:8px 20px}
.dl-foot a{color:var(--muted)}
@media(max-width:900px){
.dl-hero .dl-wrap{grid-template-columns:1fr;gap:32px}
.dl-steps{grid-template-columns:1fr}
.dl-feats{grid-template-columns:1fr}
}
@media(max-width:760px){
.dl-links a.dl-hide{display:none}
.dl-nav .dl-wrap{gap:10px}
.dl-links{gap:10px}
}
@media(max-width:560px){
.dl h1,.dl:lang(bn) h1{font-size:1.85rem}
.dl h2{font-size:1.5rem}
.dl-hero{padding:36px 0 40px}
.dl-sec{padding:48px 0}
.dl-wrap{padding:0 16px}
.dl-cta .dl-btn{width:100%}
.dl-logo{font-size:1.05rem}
.dl-nav .dl-btn{padding:8px 12px;font-size:.88rem}
.dl-lang{padding:5px 9px}
}
@media(prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
`;

const T = {
  en: {
    skip: "Skip to content",
    nav: { rules: "Rules and standards", lookup: "Report lookup", login: "Log in", check: "Data Check", lang: "বাংলা" },
    h1: "Know who holds each product data point before your buyer asks",
    sub: "A free check for Bangladesh garment and textile factories preparing for EU Digital Product Passport (DPP) data requests. Pick one product, mark each data point, and get an action list by owner: who to ask inside, who to call outside, and what nobody owns.",
    start: "Start the Data Check",
    seeRules: "See the rules behind it",
    free: "Free. No sign-up. Your entries stay in this browser.",
    cardTitle: "One product, four example rows",
    cardTag: "Illustration only. Not data from any factory.",
    likely: "Likely holder",
    noOwner: "No clear owner",
    cardFoot: "The real check lists all data points, each with the rule it comes from.",
    s: { nobody: "Nobody owns it", have: "Have it", partial: "Partly have", brand: "Only the brand has it" },
    howH: "How it works",
    howLead: "It takes one product and a few people from different departments. Work through it in a sitting, then follow the list.",
    steps: [
      ["Pick one product", "Use a style you are making now, so every answer comes from real files and real people."],
      ["Mark every data point", "Have it, partly have it, missing, nobody owns it, or only the brand has it. Add the name of the person who really holds it."],
      ["Work the action list", "Items are grouped by likely holder, such as Merchandising, QC or Compliance. Inside each group, items nobody owns come first. Download it as CSV or print it."],
    ],
    whyH: "What makes it different",
    whyLead: "It is a working list for the factory floor, not a score for a brochure.",
    feats: [
      ["Bangla first", "Every data point, status and next action is available in Bangla and in English."],
      ["Every item shows its rule", "Each data point names the regulation, draft or standard it comes from, so you can check it yourself."],
      ["Finds what nobody owns", "Some data points may sit between departments or only with the buyer. The check shows them as a finding instead of hiding them in a total."],
      ["No score, no certificate", "It gives no pass mark and issues no passport. It gives you a to-do list you can hand to your team."],
    ],
    stat: (n: number, c: number, x: number, y: number) =>
      `In this version: ${n} data points in ${c} groups. We assume ${x} have no clear owner in most factories and ${y} are held by the brand, not the factory. These are our assumptions. Confirm them in your own factory.`,
    srcH: "Where the list comes from",
    srcLead: "Most data points follow a draft data list from the EU Joint Research Centre (JRC). Other items come from the laws below. Each source is tagged on the Rules page as seen in source, limited check, or not verified.",
    src: [
      "ESPR, Regulation (EU) 2024/1781",
      "JRC draft textile data list (not law)",
      "Textile Labelling Regulation (EU) 1007/2011",
      "REACH Article 33",
      "Forced Labour Regulation (EU) 2024/3015",
      "Textile producer responsibility, Directive (EU) 2025/1892",
    ],
    srcLink: "Open the Rules and standards page",
    limH: "What this is not",
    lim: [
      "Not a certificate, passport or audit. DPP Atlas verifies nothing you enter.",
      "The textile data list comes from an EU draft. The final rules may differ.",
      "“Likely holder” and “outside call” are our assumptions. Confirm them in your factory.",
      "Not legal advice. Not affiliated with the European Union or any buyer or brand.",
    ],
    endH: "Start with one product today",
    endP: "Ten honest minutes with one style shows you more than a long report.",
    foot: "DPP Atlas. Content last reviewed November 2026.",
    earlier: "Earlier tools",
    scored: "Scored self-check (old)",
  },
  bn: {
    skip: "মূল অংশে যান",
    nav: { rules: "নিয়ম ও স্ট্যান্ডার্ড", lookup: "রিপোর্ট খুঁজুন", login: "লগ ইন", check: "ডেটা চেক", lang: "English" },
    h1: "ক্রেতা চাওয়ার আগেই জানুন, পণ্যের প্রতিটি তথ্য কার কাছে আছে",
    sub: "ইইউ ডিজিটাল প্রোডাক্ট পাসপোর্ট (DPP) তথ্যের অনুরোধের জন্য প্রস্তুতি নিচ্ছে এমন বাংলাদেশের গার্মেন্টস ও টেক্সটাইল কারখানার জন্য বিনামূল্যের একটি চেক। একটি পণ্য বেছে নিন, প্রতিটি তথ্য চিহ্নিত করুন, আর পান দায়িত্ব অনুযায়ী কাজের তালিকা: ভেতরে কাকে জিজ্ঞেস করবেন, বাইরে কাকে ফোন করবেন, আর কোন তথ্যের কোনো দায়িত্বশীলই নেই।",
    start: "ডেটা চেক শুরু করুন",
    seeRules: "কোন নিয়ম থেকে নেওয়া দেখুন",
    free: "বিনামূল্যে। সাইন-আপ লাগে না। আপনার তথ্য শুধু এই ব্রাউজারেই থাকে।",
    cardTitle: "একটি পণ্য, চারটি উদাহরণ সারি",
    cardTag: "শুধু উদাহরণ। কোনো কারখানার আসল তথ্য নয়।",
    likely: "সম্ভাব্য দায়িত্বশীল",
    noOwner: "কোনো দায়িত্বশীল নেই",
    cardFoot: "আসল চেকে সব তথ্য আছে, প্রতিটির পাশে কোন নিয়ম থেকে নেওয়া তা লেখা।",
    s: { nobody: "কেউ দায়িত্বে নেই", have: "আছে", partial: "আংশিক আছে", brand: "শুধু ব্র্যান্ডের কাছে" },
    howH: "কীভাবে কাজ করে",
    howLead: "একটি পণ্য আর বিভিন্ন বিভাগের কয়েকজন মানুষ লাগবে। একবারে বসে শেষ করুন, তারপর তালিকা ধরে কাজ করুন।",
    steps: [
      ["একটি পণ্য বেছে নিন", "এখন যে স্টাইল তৈরি হচ্ছে সেটি নিন, যাতে প্রতিটি উত্তর বাস্তব ফাইল ও বাস্তব মানুষ থেকে আসে।"],
      ["প্রতিটি তথ্য চিহ্নিত করুন", "আছে, আংশিক আছে, নেই, কেউ দায়িত্বে নেই, বা শুধু ব্র্যান্ডের কাছে আছে। আসলে যিনি রাখেন তাঁর নাম লিখুন।"],
      ["তালিকা ধরে একে একে কাজ করুন", "তথ্যগুলো সম্ভাব্য দায়িত্বশীল অনুযায়ী সাজানো, যেমন মার্চেন্ডাইজিং, কোয়ালিটি বা কমপ্লায়েন্স। প্রতিটি দলের ভেতরে যেগুলোর কেউ দায়িত্বে নেই সেগুলো আগে। CSV ডাউনলোড বা প্রিন্ট করতে পারেন।"],
    ],
    whyH: "কী আলাদা",
    whyLead: "এটি কারখানার কাজের তালিকা, ব্রোশিয়ারের জন্য কোনো স্কোর নয়।",
    feats: [
      ["বাংলা আগে", "প্রতিটি তথ্য, অবস্থা ও পরের কাজ বাংলা ও ইংরেজি দুই ভাষাতেই আছে।"],
      ["প্রতিটি তথ্যের পাশে নিয়ম", "প্রতিটি তথ্যের পাশে লেখা আছে কোন আইন, খসড়া বা স্ট্যান্ডার্ড থেকে নেওয়া, যাতে আপনি নিজে যাচাই করতে পারেন।"],
      ["যার কেউ নেই তা খুঁজে বের করে", "কিছু তথ্য হয়তো বিভাগগুলোর মাঝখানে পড়ে থাকে বা শুধু ক্রেতার কাছে থাকে। মোট নম্বরে লুকিয়ে না রেখে চেকটি সেগুলো আলাদা করে দেখায়।"],
      ["স্কোর নেই, সনদ নেই", "এটি পাস নম্বর দেয় না, কোনো পাসপোর্টও ইস্যু করে না। এটি দেয় এমন একটি কাজের তালিকা যা আপনার দলকে দেওয়া যায়।"],
    ],
    stat: (n: number, c: number, x: number, y: number) =>
      `এই সংস্করণে: ${c}টি দলে ${n}টি তথ্য। আমাদের অনুমান, বেশিরভাগ কারখানায় ${x}টির কোনো স্পষ্ট দায়িত্বশীল নেই এবং ${y}টি কারখানার নয়, ব্র্যান্ডের কাছে থাকে। এগুলো আমাদের অনুমান। আপনার কারখানায় যাচাই করে নিন।`,
    srcH: "তালিকাটি কোথা থেকে নেওয়া",
    srcLead: "বেশিরভাগ তথ্য ইইউ জয়েন্ট রিসার্চ সেন্টারের (JRC) একটি খসড়া তালিকা অনুসরণ করে। বাকিগুলো নিচের আইন থেকে। নিয়ম পাতায় প্রতিটি উৎসে লেখা আছে: উৎসে দেখা হয়েছে, সীমিত যাচাই, বা যাচাই করা হয়নি।",
    src: [
      "ESPR, রেগুলেশন (ইইউ) 2024/1781",
      "JRC টেক্সটাইল তথ্য-তালিকার খসড়া (আইন নয়)",
      "টেক্সটাইল লেবেলিং রেগুলেশন (ইইউ) 1007/2011",
      "REACH ধারা ৩৩",
      "জোরপূর্বক শ্রম রেগুলেশন (ইইউ) 2024/3015",
      "টেক্সটাইল উৎপাদক দায়িত্ব, নির্দেশনা (ইইউ) 2025/1892",
    ],
    srcLink: "নিয়ম ও স্ট্যান্ডার্ড পাতা খুলুন",
    limH: "এটি যা নয়",
    lim: [
      "সনদ, পাসপোর্ট বা অডিট নয়। আপনি যা লিখবেন DPP Atlas তা যাচাই করে না।",
      "টেক্সটাইল তথ্য-তালিকা ইইউর একটি খসড়া থেকে নেওয়া। চূড়ান্ত নিয়ম আলাদা হতে পারে।",
      "“সম্ভাব্য দায়িত্বশীল” ও “বাইরের ফোন” আমাদের অনুমান। আপনার কারখানায় যাচাই করে নিন।",
      "আইনি পরামর্শ নয়। ইউরোপীয় ইউনিয়ন বা কোনো ক্রেতা বা ব্র্যান্ডের সাথে যুক্ত নয়।",
    ],
    endH: "আজই একটি পণ্য দিয়ে শুরু করুন",
    endP: "একটি স্টাইল নিয়ে সৎভাবে দশ মিনিট বসলে লম্বা রিপোর্টের চেয়ে বেশি জানা যায়।",
    foot: "DPP Atlas। বিষয়বস্তু সর্বশেষ পর্যালোচনা: নভেম্বর ২০২৬।",
    earlier: "আগের টুল",
    scored: "স্কোরসহ সেলফ-চেক (পুরোনো)",
  },
};

export default function Landing({ params }: P) {
  const loc = params.locale === "bn" ? "bn" : "en";
  const isBn = loc === "bn";
  const t = T[loc];

  const total = FIELDS.length;
  const groups = Array.from(new Set(FIELDS.map((f) => f.cat))).length;
  const noOwner = FIELDS.filter((f) => f.ownerEn.toUpperCase().startsWith("NOBODY")).length;
  const brandHeld = FIELDS.filter((f) => f.ownerEn.startsWith("Brand")).length;

  const pick: [number, "partial" | "nobody" | "have" | "brand"][] = [
    [12, "partial"],
    [20, "nobody"],
    [10, "have"],
    [11, "brand"],
  ];
  const rows = pick
    .map(([n, s]) => ({ f: FIELDS.find((x) => x.n === n), s }))
    .filter((r) => r.f);

  return (
    <div className="dl" lang={loc}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="dl-skip" href="#main">{t.skip}</a>

      <header className="dl-nav">
        <div className="dl-wrap">
          <a className="dl-logo" href={"/" + loc}><i aria-hidden="true" />DPP Atlas</a>
          <nav className="dl-links" aria-label="Main">
            <a className="dl-hide" href={"/" + loc + "/rules"}>{t.nav.rules}</a>
            <a className="dl-hide" href={"/" + loc + "/updates"}>{isBn ? "আপডেট" : "Updates"}</a>
                        <a className="dl-lang" href={isBn ? "/en" : "/bn"} lang={isBn ? "en" : "bn"} hrefLang={isBn ? "en" : "bn"}>{t.nav.lang}</a>
            <a className="dl-btn dl-btn-p" href={"/" + loc + "/check"}>{t.nav.check}</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="dl-hero">
          <div className="dl-wrap">
            <div>
              <h1>{t.h1}</h1>
              <p className="dl-sub">{t.sub}</p>
              <div className="dl-cta">
                <a className="dl-btn dl-btn-p" href={"/" + loc + "/check"}>{t.start}</a>
                <a className="dl-btn dl-btn-s" href={"/" + loc + "/rules"}>{t.seeRules}</a>
              </div>
              <p className="dl-note">{t.free}</p>
            </div>

            <div className="dl-card" role="group" aria-label={t.cardTitle}>
              <div className="dl-card-h">{t.cardTitle}<span>{t.cardTag}</span></div>
              {rows.map(({ f, s }) => {
                if (!f) return null;
                const owner = s === "nobody" ? t.noOwner : isBn ? f.ownerBn : f.ownerEn;
                return (
                  <div className="dl-row" key={f.n}>
                    <b>{isBn ? f.bn : f.en}</b>
                    <span className={"dl-chip dl-c-" + s}>{t.s[s]}</span>
                    <small>{t.likely}: {owner}</small>
                  </div>
                );
              })}
              <div className="dl-card-f">{t.cardFoot}</div>
            </div>
          </div>
        </section>

        <section className="dl-sec" aria-labelledby="how">
          <div className="dl-wrap">
            <h2 id="how">{t.howH}</h2>
            <p className="dl-lead">{t.howLead}</p>
            <ol className="dl-steps">
              {t.steps.map((s) => (
                <li key={s[0]}><h3>{s[0]}</h3><p>{s[1]}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="dl-sec dl-alt" aria-labelledby="why">
          <div className="dl-wrap">
            <h2 id="why">{t.whyH}</h2>
            <p className="dl-lead">{t.whyLead}</p>
            <div className="dl-feats">
              {t.feats.map((f) => (
                <div className="dl-feat" key={f[0]}><h3>{f[0]}</h3><p>{f[1]}</p></div>
              ))}
            </div>
            <p className="dl-stat">{t.stat(total, groups, noOwner, brandHeld)}</p>
          </div>
        </section>

        <section className="dl-sec" aria-labelledby="src">
          <div className="dl-wrap">
            <h2 id="src">{t.srcH}</h2>
            <p className="dl-lead">{t.srcLead}</p>
            <ul className="dl-src">
              {t.src.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <a className="dl-btn dl-btn-s" href={"/" + loc + "/rules"}>{t.srcLink}</a>
          </div>
        </section>

        <section className="dl-sec dl-alt" aria-labelledby="lim">
          <div className="dl-wrap">
            <h2 id="lim">{t.limH}</h2>
            <ul className="dl-lim">
              {t.lim.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </section>

        <PhoneSection loc={loc} />

        <section className="dl-end">
          <div className="dl-wrap">
            <h2>{t.endH}</h2>
            <p>{t.endP}</p>
            <a className="dl-btn dl-btn-p" href={"/" + loc + "/check"}>{t.start}</a>
          </div>
        </section>
      </main>

      <footer className="dl-foot">
        <div className="dl-wrap">
          <span>{t.foot}</span>
          <nav aria-label="Footer">
            <a href={"/" + loc + "/check"}>{t.nav.check}</a>
            <a href={"/" + loc + "/rules"}>{t.nav.rules}</a>
            <a href={"/" + loc + "/updates"}>{isBn ? "আপডেট" : "Updates"}</a>
            <a href={"/" + loc + "/privacy"}>{isBn ? "গোপনীয়তা" : "Privacy"}</a>
            <a href={"/" + loc + "/about"}>{isBn ? "আমাদের সম্পর্কে" : "About"}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
