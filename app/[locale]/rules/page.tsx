import type { Metadata } from "next";
import { BASE_CSS, Header, Footer } from "../_ui/chrome";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "bn"
    ? { title: "নিয়ম ও স্ট্যান্ডার্ড", description: "টেক্সটাইল ডিজিটাল প্রোডাক্ট পাসপোর্ট সংক্রান্ত নিয়ম ও স্ট্যান্ডার্ড, উৎস ও যাচাইয়ের মাত্রাসহ। আইনি পরামর্শ নয়।" }
    : { title: "Rules and standards", description: "Rules and standards related to textile Digital Product Passports, with sources and confidence. Not legal advice." };
}

type Row = {
  name: string;
  type: string;
  typeBn: string;
  what: string;
  whatBn: string;
  source: string;
  sourceBn: string;
  status: "checked" | "limited" | "unverified";
};

const ROWS: Row[] = [
  { name: "EU ESPR – Regulation (EU) 2024/1781", type: "EU law", typeBn: "ইইউ আইন", what: "Framework for ecodesign and the Digital Product Passport. Product-specific rules come in later delegated acts; apparel is a named priority. No textile delegated act confirmed.", source: "JRC draft; Commission ESPR working plan page", whatBn: "ইকোডিজাইন ও ডিজিটাল প্রোডাক্ট পাসপোর্টের কাঠামো। পণ্যভিত্তিক নিয়ম পরে ডেলিগেটেড অ্যাক্টে আসে; পোশাক একটি নির্ধারিত অগ্রাধিকার। টেক্সটাইলের ডেলিগেটেড অ্যাক্ট নিশ্চিত হয়নি।", sourceBn: "JRC খসড়া; কমিশনের ESPR কর্মপরিকল্পনা পাতা", status: "checked" },
  { name: "ESPR Article 13 central DPP registry; Implementing Regulation (EU) 2026/1778", type: "EU law", typeBn: "ইইউ আইন", what: "Commission registry for passports, reported live from 20 July 2026. No registration duty for textiles yet: duties arise product group by product group through delegated acts (batteries first, from 18 Feb 2027). Operators are verified with eIDAS-based means.", source: "Two secondary sources citing the Commission registry page and EUR-Lex; Commission pages not read here", whatBn: "পাসপোর্টের জন্য কমিশনের রেজিস্ট্রি, ২০ জুলাই ২০২৬ থেকে চালু বলে জানা যায়। টেক্সটাইলের জন্য এখনও নিবন্ধনের বাধ্যবাধকতা নেই: ডেলিগেটেড অ্যাক্টের মাধ্যমে পণ্যগোষ্ঠী ধরে ধরে দায়িত্ব আসে (প্রথমে ব্যাটারি, ১৮ ফেব্রুয়ারি ২০২৭ থেকে)। অপারেটরদের eIDAS-ভিত্তিক পদ্ধতিতে যাচাই করা হয়।", sourceBn: "দুটি সেকেন্ডারি সূত্র, যারা কমিশনের রেজিস্ট্রি পাতা ও EUR-Lex উদ্ধৃত করেছে; কমিশনের পাতা এখানে পড়া হয়নি", status: "limited" },
  { name: "Textile Labelling Regulation (EU) No 1007/2011", type: "EU law", typeBn: "ইইউ আইন", what: "Fibre composition names and percentages are mandatory. Care, origin and size are under consideration for revision.", source: "JRC draft, Table 3", whatBn: "তন্তুর নাম ও শতাংশ উল্লেখ বাধ্যতামূলক। যত্ন, উৎস ও সাইজের তথ্য সংশোধনের বিবেচনায় আছে।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "checked" },
  { name: "REACH – Regulation (EC) No 1907/2006, Article 33", type: "EU law", typeBn: "ইইউ আইন", what: "Presence of substances of very high concern above 0.1% w/w must be communicated to recipients of the article.", source: "JRC draft, Table 3", whatBn: "০.১% w/w-এর বেশি অতি উদ্বেগজনক পদার্থ (SVHC) থাকলে পণ্যের গ্রহীতাকে তা জানাতে হবে।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "checked" },
  { name: "Empowering Consumers Directive (EU) 2024/825", type: "EU law", typeBn: "ইইউ আইন", what: "Commercial durability guarantee labelling and after-sales information. Mostly a brand matter.", source: "JRC draft, Table 3", whatBn: "বাণিজ্যিক টেকসই-গ্যারান্টির লেবেলিং ও বিক্রয়োত্তর তথ্য। মূলত ব্র্যান্ডের বিষয়।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "checked" },
  { name: "CSRD (EU) 2022/2464 and CSDDD (EU) 2024/1760", type: "EU law (company level)", typeBn: "ইইউ আইন (কোম্পানি পর্যায়)", what: "Company-level reporting and due-diligence duties for very large companies. Thresholds are as stated in the draft and may have changed.", source: "JRC draft, Table 3", whatBn: "অনেক বড় কোম্পানির জন্য কোম্পানি-পর্যায়ের রিপোর্টিং ও ডিউ ডিলিজেন্স দায়িত্ব। সীমা খসড়ায় যেমন বলা আছে তেমন; পরে বদলে থাকতে পারে।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "limited" },
  { name: "Waste Framework Directive revision – Directive (EU) 2025/1892", type: "EU law", typeBn: "ইইউ আইন", what: "Introduces common EU extended producer responsibility rules for textiles. In force since 16 October 2025. Detailed duties not reviewed here.", source: "European Commission textiles transition page", whatBn: "টেক্সটাইলের জন্য ইইউ-জুড়ে অভিন্ন উৎপাদক-দায়িত্ব (EPR) নিয়ম চালু করে। ১৬ অক্টোবর ২০২৫ থেকে কার্যকর। বিস্তারিত দায়িত্ব এখানে পর্যালোচনা করা হয়নি।", sourceBn: "ইউরোপীয় কমিশনের টেক্সটাইল ট্রানজিশন পাতা", status: "limited" },
  { name: "Forced Labour Regulation (EU) 2024/3015", type: "EU law", typeBn: "ইইউ আইন", what: "Bans products made with forced labour on the EU market. Applies from 14 December 2027. General, not textile-specific.", source: "European Parliament Legislative Observatory", whatBn: "জোরপূর্বক শ্রমে তৈরি পণ্য ইইউ বাজারে নিষিদ্ধ। ১৪ ডিসেম্বর ২০২৭ থেকে প্রযোজ্য। এটি সাধারণ নিয়ম, শুধু টেক্সটাইলের জন্য নয়।", sourceBn: "ইউরোপীয় পার্লামেন্টের Legislative Observatory", status: "checked" },
  { name: "EU Ecolabel for textiles (Decision 2014/350/EU)", type: "Voluntary scheme", typeBn: "ঐচ্ছিক স্কিম", what: "Ecological criteria including restricted substances, dimensional stability and colour fastness.", source: "JRC draft", whatBn: "নিষিদ্ধ বা সীমিত পদার্থ, মাত্রিক স্থিতিশীলতা ও রঙের স্থায়িত্বসহ পরিবেশগত মানদণ্ড।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "French AGEC law 2020-105; Finnish sorting rules", type: "National law", typeBn: "জাতীয় আইন", what: "Eco-score (voluntary unless environmental claims are made) and Triman sorting instructions in France; sorting instructions in Finland.", source: "JRC draft", whatBn: "ফ্রান্সে ইকো-স্কোর (পরিবেশগত দাবি না করলে ঐচ্ছিক) ও Triman বাছাই-নির্দেশনা; ফিনল্যান্ডে বাছাই-নির্দেশনা।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "GS1 GTIN / GLN; ISO/IEC 15459-6; prEN 18219", type: "Identifier standards", typeBn: "আইডি স্ট্যান্ডার্ড", what: "Product, batch and item identifiers (GTIN plus lot or serial) and facility identifiers (GLN) used in the DPP data model.", source: "JRC draft", whatBn: "ডিপিপি ডেটা মডেলে ব্যবহৃত পণ্য, ব্যাচ ও আইটেম আইডি (GTIN সাথে লট বা সিরিয়াল) এবং স্থাপনার আইডি (GLN)।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "ISO 3759, ISO 16322-3, ISO 15487", type: "Test methods (not laws)", typeBn: "টেস্ট পদ্ধতি (আইন নয়)", what: "Dimensional change, spirality and visual inspection. The JRC draft treats results as robustness data.", source: "JRC draft", whatBn: "মাত্রিক পরিবর্তন, স্পাইরালিটি ও দৃশ্যমান পরিদর্শন। JRC খসড়া ফলাফলগুলোকে মজবুতির (robustness) তথ্য হিসেবে দেখে।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "ISO 21600:2019", type: "Standard", typeBn: "স্ট্যান্ডার্ড", what: "Referenced for the care-instructions data point.", source: "JRC draft, Table 7", whatBn: "যত্ন-নির্দেশনার ডেটা পয়েন্টে উল্লেখ করা হয়েছে।", sourceBn: "JRC খসড়া, টেবিল ৭", status: "checked" },
  { name: "ISO 14021:2016, ISO 14024, ISO 22059:2020", type: "Standards", typeBn: "স্ট্যান্ডার্ড", what: "Self-declared environmental claims and recycled-content definitions; Type I ecolabels; commercial guarantee duration.", source: "JRC draft", whatBn: "স্ব-ঘোষিত পরিবেশগত দাবি ও রিসাইকেলড-উপাদানের সংজ্ঞা; টাইপ I ইকোলেবেল; বাণিজ্যিক গ্যারান্টির মেয়াদ।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "PEFCR for Apparel and Footwear", type: "Footprint method", typeBn: "ফুটপ্রিন্ট পদ্ধতি", what: "Product environmental footprint rules. The draft says footprint data is rare and usually calculated at model level.", source: "JRC draft", whatBn: "পণ্যের পরিবেশগত ফুটপ্রিন্টের নিয়ম। খসড়া বলছে ফুটপ্রিন্ট ডেটা বিরল এবং সাধারণত মডেল পর্যায়ে হিসাব করা হয়।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "OEKO-TEX Standard 100", type: "Voluntary certification", typeBn: "ঐচ্ছিক সনদ", what: "Cited as the most common chemical verification. Pass or fail only.", source: "JRC draft", whatBn: "সবচেয়ে প্রচলিত রাসায়নিক যাচাই হিসেবে উল্লেখিত। শুধু পাস বা ফেল।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "GOTS, GRS, RCS, OCS, BCI", type: "Voluntary schemes", typeBn: "ঐচ্ছিক স্কিম", what: "Organic, recycled and sustainable-cotton chain-of-custody schemes. GOTS, GRS, RCS and BCI are named in the draft; OCS appears in its abbreviations.", source: "JRC draft", whatBn: "জৈব, রিসাইকেলড ও টেকসই-তুলার চেইন-অব-কাস্টডি স্কিম। খসড়ায় GOTS, GRS, RCS ও BCI নাম ধরে আছে; OCS শুধু সংক্ষিপ্ত রূপের তালিকায়।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "ZDHC", type: "Industry programme", typeBn: "শিল্প কর্মসূচি", what: "Mentioned once in the draft as part of chemical compliance data.", source: "JRC draft (one mention)", whatBn: "রাসায়নিক সম্মতির ডেটার অংশ হিসেবে খসড়ায় একবার উল্লেখ আছে।", sourceBn: "JRC খসড়া (একবার উল্লেখ)", status: "limited" },
  { name: "BGMEA", type: "Trade association (not a regulation)", typeBn: "ট্রেড অ্যাসোসিয়েশন (আইন নয়)", what: "Bangladesh exporters' association. Not a legal requirement in itself.", source: "Not covered by the JRC draft", whatBn: "বাংলাদেশের রপ্তানিকারকদের সংগঠন। নিজে কোনো আইনি বাধ্যবাধকতা নয়।", sourceBn: "JRC খসড়ায় নেই", status: "unverified" },
  { name: "EU ban on destroying unsold apparel and footwear (ESPR)", type: "EU law", typeBn: "ইইউ আইন", what: "Not verified here. Check the ESPR text before relying on it.", source: "Not checked", whatBn: "এখানে যাচাই করা হয়নি। নির্ভর করার আগে ESPR-এর মূল পাঠ দেখুন।", sourceBn: "যাচাই করা হয়নি", status: "unverified" },
  { name: "Bangladesh national rules", type: "National law", typeBn: "জাতীয় আইন", what: "Export registration, tax and labour or safety rules were not checked. Ask BGMEA or a legal adviser.", source: "Not checked", whatBn: "রপ্তানি নিবন্ধন, কর এবং শ্রম বা নিরাপত্তা নিয়ম যাচাই করা হয়নি। BGMEA বা আইনজীবীকে জিজ্ঞেস করুন।", sourceBn: "যাচাই করা হয়নি", status: "unverified" },
];

const LABEL: Record<Row["status"], { en: string; bn: string; cls: string }> = {
  checked: { en: "Seen in source", bn: "উৎসে পাওয়া গেছে", cls: "ru-ok" },
  limited: { en: "Limited check", bn: "সীমিত যাচাই", cls: "ru-lim" },
  unverified: { en: "Not verified", bn: "যাচাই করা হয়নি", cls: "ru-no" },
};

const CSS = `
.ru-list{display:grid;gap:12px;margin-top:18px}
.ru-card{border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;background:#fff}
.ru-top{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:4px;align-items:flex-start}
.ru-chip{padding:2px 10px;border-radius:99px;font-size:.82rem;font-weight:600;border:1px solid;white-space:nowrap}
.ru-ok{color:#15803d;background:#f0fdf4;border-color:#bbf7d0}
.ru-lim{color:#92400e;background:#fffbeb;border-color:#fde68a}
.ru-no{color:#b91c1c;background:#fef2f2;border-color:#fecaca}
.ru-type{color:#0f766e;font-size:.88rem;font-weight:600;margin-bottom:4px}
.ru-what{color:#334155;font-size:.95rem}
.ru-src{color:#64748b;font-size:.84rem;margin-top:6px}
.ru-legend{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 0}
`;

export default function RulesPage({ params }: { params: { locale: string } }) {
  const loc: "en" | "bn" = params.locale === "bn" ? "bn" : "en";
  const isBn = loc === "bn";
  return (
    <div className="dl" lang={loc}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + CSS }} />
      <Header loc={loc} path="/rules" current="rules" />
      <main id="main" className="dl-main">
        <div className="dl-wrap dl-narrow">
          <h1>{isBn ? "নিয়ম ও স্ট্যান্ডার্ড" : "Rules and standards"}</h1>
          <p className="dl-lead">
            {isBn
              ? "টেক্সটাইল ডিজিটাল প্রোডাক্ট পাসপোর্ট সংক্রান্ত নিয়ম ও স্ট্যান্ডার্ডের একটি তালিকা। এটি সম্পূর্ণ তালিকা নয় এবং আইনি পরামর্শ নয়। ইইউ টেক্সটাইল DPP নিয়ম এখনও খসড়া পর্যায়ে; বর্তমান অবস্থা আপনার ক্রেতার কাছে নিশ্চিত করুন।"
              : "A list of rules and standards related to textile Digital Product Passports. It is not complete and not legal advice. EU textile DPP rules are still in draft; confirm the current status with your buyer."}
          </p>
          <p className="dl-warn">
            {isBn ? "তালিকাভুক্ত হওয়া মানে এই সাইট ওই নিয়ম মেনে চলে বা যাচাই করে—এমন নয়।" : "Being listed does not mean this site complies with, certifies or verifies any of them."}
          </p>
          <div className="ru-legend" aria-label={isBn ? "চিহ্নের অর্থ" : "Legend"}>
            {(["checked", "limited", "unverified"] as const).map((k) => (
              <span key={k} className={"ru-chip " + LABEL[k].cls}>{isBn ? LABEL[k].bn : LABEL[k].en}</span>
            ))}
          </div>
          <div className="ru-list">
            {ROWS.map((r) => {
              const s = LABEL[r.status];
              return (
                <article key={r.name} className="ru-card">
                  <div className="ru-top">
                    <h2 style={{ fontSize: "1rem", margin: 0 }}>{r.name}</h2>
                    <span className={"ru-chip " + s.cls}>{isBn ? s.bn : s.en}</span>
                  </div>
                  <div className="ru-type">{isBn ? r.typeBn : r.type}</div>
                  <p className="ru-what">{isBn ? r.whatBn : r.what}</p>
                  <p className="ru-src">{isBn ? "উৎস: " : "Source: "}{isBn ? r.sourceBn : r.source}</p>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer loc={loc} />
    </div>
  );
}
