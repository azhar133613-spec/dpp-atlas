import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules & Standards | DPP Atlas",
  description: "Rules and standards related to textile Digital Product Passports, with sources and confidence. Not legal advice.",
};

type Row = {
  name: string;
  type: string;
  typeBn: string;
  what: string;
  source: string;
  status: "checked" | "limited" | "unverified";
};

const ROWS: Row[] = [
  { name: "EU ESPR – Regulation (EU) 2024/1781", type: "EU law", typeBn: "ইইউ আইন", what: "Framework for ecodesign and the Digital Product Passport. Product-specific rules come in later delegated acts; apparel is a named priority. No textile delegated act confirmed.", source: "JRC draft; Commission ESPR working plan page", status: "checked" },
  { name: "Textile Labelling Regulation (EU) No 1007/2011", type: "EU law", typeBn: "ইইউ আইন", what: "Fibre composition names and percentages are mandatory. Care, origin and size are under consideration for revision.", source: "JRC draft, Table 3", status: "checked" },
  { name: "REACH – Regulation (EC) No 1907/2006, Article 33", type: "EU law", typeBn: "ইইউ আইন", what: "Presence of substances of very high concern above 0.1% w/w must be communicated to recipients of the article.", source: "JRC draft, Table 3", status: "checked" },
  { name: "Empowering Consumers Directive (EU) 2024/825", type: "EU law", typeBn: "ইইউ আইন", what: "Commercial durability guarantee labelling and after-sales information. Mostly a brand matter.", source: "JRC draft, Table 3", status: "checked" },
  { name: "CSRD (EU) 2022/2464 and CSDDD (EU) 2024/1760", type: "EU law (company level)", typeBn: "ইইউ আইন (কোম্পানি পর্যায়)", what: "Company-level reporting and due-diligence duties for very large companies. Thresholds are as stated in the draft and may have changed.", source: "JRC draft, Table 3", status: "limited" },
  { name: "Waste Framework Directive revision – Directive (EU) 2025/1892", type: "EU law", typeBn: "ইইউ আইন", what: "Introduces common EU extended producer responsibility rules for textiles. In force since 16 October 2025. Detailed duties not reviewed here.", source: "European Commission textiles transition page", status: "limited" },
  { name: "Forced Labour Regulation (EU) 2024/3015", type: "EU law", typeBn: "ইইউ আইন", what: "Bans products made with forced labour on the EU market. Applies from 14 December 2027. General, not textile-specific.", source: "European Parliament Legislative Observatory", status: "checked" },
  { name: "EU Ecolabel for textiles (Decision 2014/350/EU)", type: "Voluntary scheme", typeBn: "ঐচ্ছিক স্কিম", what: "Ecological criteria including restricted substances, dimensional stability and colour fastness.", source: "JRC draft", status: "checked" },
  { name: "French AGEC law 2020-105; Finnish sorting rules", type: "National law", typeBn: "জাতীয় আইন", what: "Eco-score (voluntary unless environmental claims are made) and Triman sorting instructions in France; sorting instructions in Finland.", source: "JRC draft", status: "checked" },
  { name: "GS1 GTIN / GLN; ISO/IEC 15459-6; prEN 18219", type: "Identifier standards", typeBn: "আইডি স্ট্যান্ডার্ড", what: "Product, batch and item identifiers (GTIN plus lot or serial) and facility identifiers (GLN) used in the DPP data model.", source: "JRC draft", status: "checked" },
  { name: "ISO 3759, ISO 16322-3, ISO 15487", type: "Test methods (not laws)", typeBn: "টেস্ট পদ্ধতি (আইন নয়)", what: "Dimensional change, spirality and visual inspection. The JRC draft treats results as robustness data.", source: "JRC draft", status: "checked" },
  { name: "ISO 21600:2019", type: "Standard", typeBn: "স্ট্যান্ডার্ড", what: "Referenced for the care-instructions data point.", source: "JRC draft, Table 7", status: "checked" },
  { name: "ISO 14021:2016, ISO 14024, ISO 22059:2020", type: "Standards", typeBn: "স্ট্যান্ডার্ড", what: "Self-declared environmental claims and recycled-content definitions; Type I ecolabels; commercial guarantee duration.", source: "JRC draft", status: "checked" },
  { name: "PEFCR for Apparel and Footwear", type: "Footprint method", typeBn: "ফুটপ্রিন্ট পদ্ধতি", what: "Product environmental footprint rules. The draft says footprint data is rare and usually calculated at model level.", source: "JRC draft", status: "checked" },
  { name: "OEKO-TEX Standard 100", type: "Voluntary certification", typeBn: "ঐচ্ছিক সনদ", what: "Cited as the most common chemical verification. Pass or fail only.", source: "JRC draft", status: "checked" },
  { name: "GOTS, GRS, RCS, OCS, BCI", type: "Voluntary schemes", typeBn: "ঐচ্ছিক স্কিম", what: "Organic, recycled and sustainable-cotton chain-of-custody schemes. GOTS, GRS, RCS and BCI are named in the draft; OCS appears in its abbreviations.", source: "JRC draft", status: "checked" },
  { name: "ZDHC", type: "Industry programme", typeBn: "শিল্প কর্মসূচি", what: "Mentioned once in the draft as part of chemical compliance data.", source: "JRC draft (one mention)", status: "limited" },
  { name: "BGMEA", type: "Trade association (not a regulation)", typeBn: "ট্রেড অ্যাসোসিয়েশন (আইন নয়)", what: "Bangladesh exporters' association. Not a legal requirement in itself.", source: "Not covered by the JRC draft", status: "unverified" },
  { name: "EU ban on destroying unsold apparel and footwear (ESPR)", type: "EU law", typeBn: "ইইউ আইন", what: "Not verified here. Check the ESPR text before relying on it.", source: "Not checked", status: "unverified" },
  { name: "Bangladesh national rules", type: "National law", typeBn: "জাতীয় আইন", what: "Export registration, tax and labour or safety rules were not checked. Ask BGMEA or a legal adviser.", source: "Not checked", status: "unverified" },
];

const LABEL: Record<Row["status"], { en: string; bn: string; color: string; bg: string }> = {
  checked: { en: "Seen in source", bn: "উৎসে পাওয়া গেছে", color: "#166534", bg: "#dcfce7" },
  limited: { en: "Limited check", bn: "সীমিত যাচাই", color: "#854d0e", bg: "#fef9c3" },
  unverified: { en: "NOT verified", bn: "যাচাই করা হয়নি", color: "#991b1b", bg: "#fee2e2" },
};

export default function RulesPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  return (
    <main style={{ minHeight: "100vh", background: "#fff", fontFamily: "system-ui,sans-serif", color: "#0f172a", padding: "24px 16px", maxWidth: "860px", margin: "0 auto" }}>
      <a href={"/" + params.locale} style={{ color: "#0f766e", fontSize: "0.85rem", textDecoration: "none" }}>
        ← {isBn ? "হোম" : "Home"}
      </a>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "12px 0 8px" }}>
        {isBn ? "নিয়ম ও স্ট্যান্ডার্ড" : "Rules and Standards"}
      </h1>
      <p style={{ color: "#475569", lineHeight: 1.6, marginBottom: "8px" }}>
        {isBn
          ? "টেক্সটাইল ডিজিটাল প্রোডাক্ট পাসপোর্ট সংক্রান্ত নিয়ম ও স্ট্যান্ডার্ডের একটি তালিকা। এটি সম্পূর্ণ তালিকা নয় এবং আইনি পরামর্শ নয়। ইইউ টেক্সটাইল DPP নিয়ম এখনও খসড়া পর্যায়ে; বর্তমান অবস্থা আপনার ক্রেতার কাছে নিশ্চিত করুন।"
          : "A list of rules and standards related to textile Digital Product Passports. It is not complete and not legal advice. EU textile DPP rules are still in draft; confirm the current status with your buyer."}
      </p>
      <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "20px" }}>
        {isBn ? "তালিকাভুক্ত হওয়া মানে এই সাইট ওই নিয়ম মেনে চলে বা যাচাই করে—এমন নয়।" : "Being listed does not mean this site complies with, certifies or verifies any of them."}
      </p>
      <div style={{ display: "grid", gap: "12px" }}>
        {ROWS.map((r) => {
          const s = LABEL[r.status];
          return (
            <div key={r.name} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                <strong style={{ fontSize: "0.95rem" }}>{r.name}</strong>
                <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: "99px", fontSize: "0.72rem", fontWeight: 700 }}>
                  {isBn ? s.bn : s.en}
                </span>
              </div>
              <div style={{ color: "#0f766e", fontSize: "0.75rem", fontWeight: 600, marginBottom: "4px" }}>{isBn ? r.typeBn : r.type}</div>
              <div style={{ color: "#334155", fontSize: "0.85rem", lineHeight: 1.55 }}>{r.what}</div>
              <div style={{ color: "#94a3b8", fontSize: "0.72rem", marginTop: "6px" }}>
                {isBn ? "উৎস: " : "Source: "}{r.source}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
