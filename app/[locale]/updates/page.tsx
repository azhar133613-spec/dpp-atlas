import type { Metadata } from "next";
import { BASE_CSS, Header, Footer } from "../_ui/chrome";
import { FEEDS, getFeed } from "./feed";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "bn"
    ? { title: "আপডেট", description: "টেক্সটাইল DPP সংক্রান্ত ইইউ নিয়মের সাম্প্রতিক পরিবর্তন, অফিসিয়াল উৎসের লিংকসহ।" }
    : { title: "Updates", description: "Recent changes in EU rules relevant to textile DPP, each with a link to the official source." };
}

type Item = { date: string; dateBn: string; title: string; titleBn: string; body: string; bodyBn: string; src: string; href: string; srcBn: string };

const ITEMS: Item[] = [
  {
    date: "20 July 2026", dateBn: "২০ জুলাই ২০২৬",
    title: "EU DPP Registry launched", titleBn: "ইইউ DPP রেজিস্ট্রি চালু",
    body: "The Commission launched the DPP Registry. Economic operators must register each passport. The first implementation deadline given is 18 February 2027. Textiles are named as a covered product group, but the page describes no textile-specific duty.",
    bodyBn: "কমিশন DPP রেজিস্ট্রি চালু করেছে। অর্থনৈতিক অপারেটরদের প্রতিটি পাসপোর্ট নিবন্ধন করতে হবে। দেওয়া প্রথম সময়সীমা ১৮ ফেব্রুয়ারি ২০২৭। টেক্সটাইল কভার করা পণ্যগোষ্ঠীর তালিকায় আছে, কিন্তু পাতাটিতে টেক্সটাইলের জন্য আলাদা কোনো দায়িত্বের কথা নেই।",
    src: "European Commission news item", srcBn: "ইউরোপীয় কমিশনের সংবাদ",
    href: "https://single-market-economy.ec.europa.eu/news/digital-product-passport-registry-now-live-2026-07-20_en",
  },
  {
    date: "Checked 22 November 2026", dateBn: "যাচাই: ২২ নভেম্বর ২০২৬",
    title: "Textile rules are not final yet", titleBn: "টেক্সটাইলের নিয়ম এখনও চূড়ান্ত নয়",
    body: "The textile delegated act has not been adopted. The Commission’s textile page lists Q4 2027 as the planned adoption date and says timelines may change. The exact data requirements are not fixed; the JRC technical study supports the work. Treat every data list, including ours, as preparation.",
    bodyBn: "টেক্সটাইলের ডেলিগেটেড অ্যাক্ট এখনও গ্রহণ করা হয়নি। কমিশনের টেক্সটাইল পাতায় ২০২৭ সালের চতুর্থ প্রান্তিক পরিকল্পিত সময় হিসেবে আছে, এবং বলা আছে সময়সূচি বদলাতে পারে। ডেটার চূড়ান্ত চাহিদা ঠিক হয়নি; JRC-র প্রযুক্তিগত সমীক্ষা এই কাজে সহায়তা করছে। আমাদের তালিকাসহ সব ডেটা তালিকাকে প্রস্তুতির অংশ হিসেবে দেখুন।",
    src: "European Commission, textile and apparel DPP page", srcBn: "ইউরোপীয় কমিশন, টেক্সটাইল ও অ্যাপারেল DPP পাতা",
    href: "https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/textile-apparel_en",
  },
  {
    date: "19 July 2026", dateBn: "১৯ জুলাই ২০২৬",
    title: "Ban on destroying unsold clothes and shoes applies", titleBn: "অবিক্রীত পোশাক ও জুতা ধ্বংসের নিষেধাজ্ঞা কার্যকর",
    body: "Large companies may not destroy unsold clothes, clothing accessories and footwear, except in limited cases such as unsafe, damaged or counterfeit items. Medium-sized companies follow from 2030. Those relying on an exemption must keep proof, publish annual reports and keep records for five years. This is mainly a brand and retailer duty; ask your buyer how it affects stock and returns.",
    bodyBn: "বড় কোম্পানি অবিক্রীত পোশাক, পোশাকের আনুষঙ্গিক ও জুতা ধ্বংস করতে পারবে না, শুধু সীমিত ক্ষেত্র ছাড়া, যেমন অনিরাপদ, ক্ষতিগ্রস্ত বা জাল পণ্য। মাঝারি কোম্পানির জন্য ২০৩০ থেকে। যারা ছাড়ের ওপর নির্ভর করবে তাদের প্রমাণ রাখতে হবে, বার্ষিক রিপোর্ট প্রকাশ করতে হবে এবং পাঁচ বছর নথি রাখতে হবে। এটি মূলত ব্র্যান্ড ও খুচরা বিক্রেতার দায়িত্ব; স্টক ও ফেরতের ওপর প্রভাব সম্পর্কে ক্রেতাকে জিজ্ঞেস করুন।",
    src: "European Commission, environment news, 17 July 2026", srcBn: "ইউরোপীয় কমিশন, পরিবেশ সংবাদ, ১৭ জুলাই ২০২৬",
    href: "https://environment.ec.europa.eu/news/ban-destruction-unsold-clothes-and-shoes-enters-application-2026-07-17_en",
  },
  {
    date: "14–15 July 2026", dateBn: "১৪–১৫ জুলাই ২০২৬",
    title: "Harmonised standards for DPPs: Implementing Decision (EU) 2026/1736", titleBn: "DPP-র সমন্বিত স্ট্যান্ডার্ড: বাস্তবায়ন সিদ্ধান্ত (ইইউ) 2026/1736",
    body: "The decision is dated 14 July 2026 and entered into force on 15 July 2026. We have not reviewed the list of standards or their legal effect yet.",
    bodyBn: "সিদ্ধান্তটির তারিখ ১৪ জুলাই ২০২৬ এবং এটি ১৫ জুলাই ২০২৬ থেকে কার্যকর। স্ট্যান্ডার্ডের তালিকা ও আইনগত প্রভাব আমরা এখনও পর্যালোচনা করিনি।",
    src: "EUR-Lex", srcBn: "EUR-Lex",
    href: "https://eur-lex.europa.eu/eli/dec_impl/2026/1736/oj",
  },
  {
    date: "Not yet reviewed", dateBn: "এখনও পর্যালোচনা হয়নি",
    title: "Registry rules: Implementing Regulation (EU) 2026/1778", titleBn: "রেজিস্ট্রির নিয়ম: বাস্তবায়ন রেগুলেশন (ইইউ) 2026/1778",
    body: "This regulation covers the DPP registry. We have not read its contents yet, so nothing on this site relies on it.",
    bodyBn: "এই রেগুলেশন DPP রেজিস্ট্রি নিয়ে। আমরা এর বিষয়বস্তু এখনও পড়িনি, তাই এই সাইটের কোনো কিছু এর ওপর নির্ভর করে না।",
    src: "EUR-Lex", srcBn: "EUR-Lex",
    href: "https://eur-lex.europa.eu/eli/reg_impl/2026/1778/oj",
  },
];

const CSS = `
.up-list{display:grid;gap:14px;margin-top:20px}
.up-card{border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;background:#fff}
.up-date{color:#0f766e;font-weight:600;font-size:.9rem;margin-bottom:2px}
.up-card p{color:#334155;font-size:.97rem;margin:6px 0 8px}
.up-src a{color:#0f766e;font-size:.9rem}
.up-auto{margin-top:20px;border:1px dashed #94a3b8;border-radius:12px;padding:14px 18px;background:#f8fafc}
.up-auto h2{font-size:1.05rem;margin:0 0 4px}
.up-auto ul{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:10px}
.up-auto li{font-size:.97rem}
.up-auto small{display:block;color:#475569}
`;

export default async function UpdatesPage({ params }: { params: { locale: string } }) {
  const loc: "en" | "bn" = params.locale === "bn" ? "bn" : "en";
  const bn = loc === "bn";
  const { items: feed, error: feedError } = await getFeed();
  const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(bn ? "bn-BD" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Brussels" }) : "");
  return (
    <div className="dl" lang={loc}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + CSS }} />
      <Header loc={loc} path="/updates" current="updates" />
      <main id="main" className="dl-main">
        <div className="dl-wrap dl-narrow">
          <h1>{bn ? "আপডেট" : "Updates"}</h1>
          <p className="dl-lead">
            {bn
              ? "টেক্সটাইল DPP-সংক্রান্ত ইইউ নিয়মের পরিবর্তন, প্রতিটির সাথে অফিসিয়াল উৎসের লিংক। সর্বশেষ যাচাই: ২২ নভেম্বর ২০২৬। নিচের স্বয়ংক্রিয় তালিকা নিজে নিজে হালনাগাদ হয়; তার পরের নোটগুলো হাতে যাচাই করা। সিদ্ধান্ত নেওয়ার আগে লিংক খুলে মূল উৎস দেখুন।"
              : "Changes in EU rules relevant to textile DPP, each with a link to the official source. Last checked 22 November 2026. The automatic list below updates by itself; the notes after it are checked by hand. Open the source link before you rely on anything."}
          </p>
          <p className="dl-warn">{bn ? "আইনি পরামর্শ নয়।" : "Not legal advice."}</p>
          <section className="up-auto" aria-labelledby="up-auto-h">
            <h2 id="up-auto-h">{bn ? "অফিসিয়াল উৎস থেকে সর্বশেষ (স্বয়ংক্রিয়)" : "Latest from the official source (automatic)"}</h2>
            <p className="dl-warn" style={{ margin: 0 }}>
              {bn
                ? "এই তালিকা নিজে নিজে হালনাগাদ হয় এবং আমরা পড়ে যাচাই করিনি। শুধু সেই খবর দেখানো হয় যার শিরোনামে DPP, ইকোডিজাইন, টেক্সটাইল, পোশাক বা জুতার উল্লেখ আছে; শিরোনাম ইংরেজিতেই থাকে, উৎসের হুবহু। কোনো কিছুর ওপর নির্ভর করার আগে লিংক খুলে পড়ুন।"
                : "This list updates by itself and has not been reviewed by us. Only items whose title mentions DPP, ecodesign, textiles, clothing or footwear are shown, copied exactly from the source, in English. Open the link and read it before you rely on anything."}
            </p>
            {feed.length ? (
              <ul>
                {feed.map((it) => (
                  <li key={it.link}>
                    <a href={it.link} target="_blank" rel="noopener noreferrer">{it.title}</a>
                    <small>{fmt(it.date)}{it.date ? " · " : ""}{FEEDS[0].name}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {bn ? "এই মুহূর্তে তালিকা আনা যায়নি। সরাসরি দেখুন: " : "The list could not be loaded right now. Read it directly: "}
                <a href={FEEDS[0].page} target="_blank" rel="noopener noreferrer">{FEEDS[0].name}</a>
              </p>
            )}
            {!feed.length && feedError && (
              <small style={{ color: "#475569" }}>{bn ? "কারণ (কারিগরি): " : "Reason (technical): "}{feedError}</small>
            )}
          </section>
          <h2 style={{ fontSize: "1.2rem", marginTop: 28 }}>{bn ? "আমাদের যাচাই করা নোট" : "Notes we checked by hand"}</h2>
          <div className="up-list">
            {ITEMS.map((it) => (
              <article key={it.title} className="up-card">
                <div className="up-date">{bn ? it.dateBn : it.date}</div>
                <h2 style={{ fontSize: "1.05rem", margin: 0 }}>{bn ? it.titleBn : it.title}</h2>
                <p>{bn ? it.bodyBn : it.body}</p>
                <div className="up-src">
                  {bn ? "উৎস: " : "Source: "}
                  <a href={it.href} target="_blank" rel="noopener noreferrer">{bn ? it.srcBn : it.src}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer loc={loc} />
    </div>
  );
}
