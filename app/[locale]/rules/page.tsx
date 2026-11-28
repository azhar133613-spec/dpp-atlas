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
  { name: "EU ESPR – Regulation (EU) 2024/1781", type: "EU law", typeBn: "ইইউ আইন", what: "Framework for ecodesign and the Digital Product Passport. Product-specific rules come in later delegated acts; apparel is a named priority. The Commission’s textile page gives Q4 2027 as the indicative adoption date for the textile delegated act; timelines may change.", source: "JRC draft; Commission ESPR working plan page; Commission textile and apparel DPP page", whatBn: "ইকোডিজাইন ও ডিজিটাল প্রোডাক্ট পাসপোর্টের কাঠামো। পণ্যভিত্তিক নিয়ম পরে ডেলিগেটেড অ্যাক্টে আসে; পোশাক একটি নির্ধারিত অগ্রাধিকার। কমিশনের টেক্সটাইল পাতায় টেক্সটাইলের ডেলিগেটেড অ্যাক্ট গ্রহণের ইঙ্গিতমূলক সময় ২০২৭ সালের চতুর্থ প্রান্তিক; সময়সূচি বদলাতে পারে।", sourceBn: "JRC খসড়া; কমিশনের ESPR কর্মপরিকল্পনা পাতা; কমিশনের টেক্সটাইল ও অ্যাপারেল DPP পাতা", status: "checked" },
  { name: "JRC study on DPP content for textile apparel (May 2026)", type: "Technical study (not law)", typeBn: "টেকনিক্যাল স্টাডি (আইন নয়)", what: "Technical study supporting the textile delegated act. The Commission says the binding textile requirements will be defined in the delegated act, not in the study. The study’s data list is a draft and may change.", whatBn: "টেক্সটাইল ডেলিগেটেড অ্যাক্টের জন্য সহায়ক টেকনিক্যাল স্টাডি। কমিশন বলছে বাধ্যতামূলক শর্ত ঠিক হবে ডেলিগেটেড অ্যাক্টে, স্টাডিতে নয়। স্টাডির ডেটা-তালিকা খসড়া এবং বদলাতে পারে।", source: "European Commission textile and apparel DPP page; publication date (13 May 2026) from a third-party summary", sourceBn: "ইউরোপীয় কমিশনের টেক্সটাইল ও অ্যাপারেল DPP পাতা; প্রকাশের তারিখ (১৩ মে ২০২৬) তৃতীয় পক্ষের সারাংশ থেকে", status: "checked" },
  { name: "ESPR Article 13 central DPP registry; Implementing Regulation (EU) 2026/1778", type: "EU law", typeBn: "ইইউ আইন", what: "Commission registry for passports, launched on 20 July 2026. Economic operators must register each passport in it. It covers ESPR product groups including textiles, but no registration deadline applies to textiles yet: the first deadline is 18 February 2027, for certain large batteries.", source: "European Commission news item, 20 July 2026", whatBn: "পাসপোর্টের জন্য কমিশনের রেজিস্ট্রি ২০ জুলাই ২০২৬ তারিখে চালু হয়েছে। অর্থনৈতিক অপারেটরদের প্রতিটি পাসপোর্ট এতে নিবন্ধন করতে হবে। এটি টেক্সটাইলসহ ESPR-এর পণ্যগোষ্ঠী কভার করে, তবে টেক্সটাইলের জন্য এখনও নিবন্ধনের সময়সীমা নেই: প্রথম সময়সীমা ১৮ ফেব্রুয়ারি ২০২৭, কিছু বড় ব্যাটারির জন্য।", sourceBn: "ইউরোপীয় কমিশনের সংবাদ, ২০ জুলাই ২০২৬", status: "checked" },
  { name: "Commission Implementing Decision (EU) 2026/1736: harmonised standards for digital product passports", type: "EU implementing decision", typeBn: "ইইউ বাস্তবায়ন সিদ্ধান্ত", what: "Dated 14 July 2026 and in force from 15 July 2026. The list of standards and their legal effect were not reviewed here.", source: "EUR-Lex (excerpt page)", whatBn: "তারিখ ১৪ জুলাই ২০২৬, কার্যকর ১৫ জুলাই ২০২৬ থেকে। স্ট্যান্ডার্ডের তালিকা ও আইনগত প্রভাব এখানে পর্যালোচনা করা হয়নি।", sourceBn: "EUR-Lex (সারাংশ পাতা)", status: "limited" },
  { name: "Textile Labelling Regulation (EU) No 1007/2011", type: "EU law", typeBn: "ইইউ আইন", what: "Fibre composition names and percentages are mandatory. Care, origin and size are under consideration for revision.", source: "JRC draft, Table 3", whatBn: "তন্তুর নাম ও শতাংশ উল্লেখ বাধ্যতামূলক। যত্ন, উৎস ও সাইজের তথ্য সংশোধনের বিবেচনায় আছে।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "checked" },
  { name: "REACH – Regulation (EC) No 1907/2006, Article 33", type: "EU law", typeBn: "ইইউ আইন", what: "Presence of substances of very high concern above 0.1% w/w must be communicated to recipients of the article.", source: "JRC draft, Table 3", whatBn: "০.১% w/w-এর বেশি অতি উদ্বেগজনক পদার্থ (SVHC) থাকলে পণ্যের গ্রহীতাকে তা জানাতে হবে।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "checked" },
  { name: "Empowering Consumers Directive (EU) 2024/825", type: "EU law", typeBn: "ইইউ আইন", what: "Commercial durability guarantee labelling and after-sales information. Mostly a brand matter.", source: "JRC draft, Table 3", whatBn: "বাণিজ্যিক টেকসই-গ্যারান্টির লেবেলিং ও বিক্রয়োত্তর তথ্য। মূলত ব্র্যান্ডের বিষয়।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "checked" },
  { name: "CSRD (EU) 2022/2464 and CSDDD (EU) 2024/1760", type: "EU law (company level)", typeBn: "ইইউ আইন (কোম্পানি পর্যায়)", what: "Company-level reporting and due-diligence duties for very large companies. Thresholds are as stated in the draft and may have changed.", source: "JRC draft, Table 3", whatBn: "অনেক বড় কোম্পানির জন্য কোম্পানি-পর্যায়ের রিপোর্টিং ও ডিউ ডিলিজেন্স দায়িত্ব। সীমা খসড়ায় যেমন বলা আছে তেমন; পরে বদলে থাকতে পারে।", sourceBn: "JRC খসড়া, টেবিল ৩", status: "limited" },
  { name: "Waste Framework Directive revision – Directive (EU) 2025/1892", type: "EU law", typeBn: "ইইউ আইন", what: "Introduces common EU extended producer responsibility rules for textiles. In force since 16 October 2025. Detailed duties not reviewed here.", source: "European Commission textiles transition page", whatBn: "টেক্সটাইলের জন্য ইইউ-জুড়ে অভিন্ন উৎপাদক-দায়িত্ব (EPR) নিয়ম চালু করে। ১৬ অক্টোবর ২০২৫ থেকে কার্যকর। বিস্তারিত দায়িত্ব এখানে পর্যালোচনা করা হয়নি।", sourceBn: "ইউরোপীয় কমিশনের টেক্সটাইল ট্রানজিশন পাতা", status: "limited" },
  { name: "Forced Labour Regulation (EU) 2024/3015", type: "EU law", typeBn: "ইইউ আইন", what: "Bans products made with forced labour on the EU market. Applies from 14 December 2027. General, not textile-specific.", source: "European Parliament Legislative Observatory", whatBn: "জোরপূর্বক শ্রমে তৈরি পণ্য ইইউ বাজারে নিষিদ্ধ। ১৪ ডিসেম্বর ২০২৭ থেকে প্রযোজ্য। এটি সাধারণ নিয়ম, শুধু টেক্সটাইলের জন্য নয়।", sourceBn: "ইউরোপীয় পার্লামেন্টের Legislative Observatory", status: "checked" },
  { name: "EU Ecolabel for textiles (Decision 2014/350/EU)", type: "Voluntary scheme", typeBn: "ঐচ্ছিক স্কিম", what: "Ecological criteria including restricted substances, dimensional stability and colour fastness.", source: "JRC draft", whatBn: "নিষিদ্ধ বা সীমিত পদার্থ, মাত্রিক স্থিতিশীলতা ও রঙের স্থায়িত্বসহ পরিবেশগত মানদণ্ড।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "French AGEC law 2020-105; Finnish sorting rules", type: "National law", typeBn: "জাতীয় আইন", what: "Eco-score (voluntary unless environmental claims are made) and Triman sorting instructions in France; sorting instructions in Finland.", source: "JRC draft", whatBn: "ফ্রান্সে ইকো-স্কোর (পরিবেশগত দাবি না করলে ঐচ্ছিক) ও Triman বাছাই-নির্দেশনা; ফিনল্যান্ডে বাছাই-নির্দেশনা।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "GS1 GTIN / GLN; ISO/IEC 15459-6; prEN 18219", type: "Identifier standards", typeBn: "আইডি স্ট্যান্ডার্ড", what: "Product, batch and item identifiers (GTIN plus lot or serial) and facility identifiers (GLN) used in the DPP data model. ISO/IEC 15459-6:2007 is shown as withdrawn on ISO’s page; a 2014 edition exists but we did not open its page.", source: "JRC draft", whatBn: "ডিপিপি ডেটা মডেলে ব্যবহৃত পণ্য, ব্যাচ ও আইটেম আইডি (GTIN সাথে লট বা সিরিয়াল) এবং স্থাপনার আইডি (GLN)। ISO/IEC 15459-6:2007 ISO-র পাতায় প্রত্যাহৃত দেখানো আছে; ২০১৪ সালের সংস্করণ আছে, তবে তার পাতা আমরা খুলিনি।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "ISO 3759, ISO 16322-3, ISO 15487", type: "Test methods (not laws)", typeBn: "টেস্ট পদ্ধতি (আইন নয়)", what: "Dimensional change, spirality and visual inspection. The JRC draft treats results as robustness data.", source: "JRC draft", whatBn: "মাত্রিক পরিবর্তন, স্পাইরালিটি ও দৃশ্যমান পরিদর্শন। JRC খসড়া ফলাফলগুলোকে মজবুতির (robustness) তথ্য হিসেবে দেখে।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "ISO 21600:2019", type: "Standard", typeBn: "স্ট্যান্ডার্ড", what: "Referenced for the care-instructions data point. We could not find a standard with this number on iso.org, so the number may be a mistake in the source. The care-labelling code standard we did find is ISO 3758:2023 (linked below).", source: "JRC draft, Table 7", whatBn: "যত্ন-নির্দেশনার ডেটা পয়েন্টে উল্লেখ করা হয়েছে। iso.org-এ এই নম্বরের কোনো স্ট্যান্ডার্ড আমরা খুঁজে পাইনি; তাই নম্বরটি উৎসে ভুল থাকতে পারে। যত্ন-লেবেল কোডের যে স্ট্যান্ডার্ড পেয়েছি তা ISO 3758:2023 (নিচে লিংক)।", sourceBn: "JRC খসড়া, টেবিল ৭", status: "checked" },
  { name: "ISO 14021:2016, ISO 14024, ISO 22059:2020", type: "Standards", typeBn: "স্ট্যান্ডার্ড", what: "Self-declared environmental claims and recycled-content definitions; Type I ecolabels; commercial guarantee duration. ISO has published ISO 14021:2026 and lists ISO 14024:2018 as withdrawn (replaced by a 2026 edition), so the editions named in the draft may be out of date.", source: "JRC draft", whatBn: "স্ব-ঘোষিত পরিবেশগত দাবি ও রিসাইকেলড-উপাদানের সংজ্ঞা; টাইপ I ইকোলেবেল; বাণিজ্যিক গ্যারান্টির মেয়াদ। ISO ISO 14021:2026 প্রকাশ করেছে এবং ISO 14024:2018 প্রত্যাহৃত (২০২৬ সংস্করণ দ্বারা প্রতিস্থাপিত) দেখাচ্ছে; তাই খসড়ায় উল্লেখিত সংস্করণ পুরনো হতে পারে।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "PEFCR for Apparel and Footwear", type: "Footprint method", typeBn: "ফুটপ্রিন্ট পদ্ধতি", what: "Product environmental footprint rules. The draft says footprint data is rare and usually calculated at model level.", source: "JRC draft", whatBn: "পণ্যের পরিবেশগত ফুটপ্রিন্টের নিয়ম। খসড়া বলছে ফুটপ্রিন্ট ডেটা বিরল এবং সাধারণত মডেল পর্যায়ে হিসাব করা হয়।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "OEKO-TEX Standard 100", type: "Voluntary certification", typeBn: "ঐচ্ছিক সনদ", what: "Cited as the most common chemical verification. Pass or fail only.", source: "JRC draft", whatBn: "সবচেয়ে প্রচলিত রাসায়নিক যাচাই হিসেবে উল্লেখিত। শুধু পাস বা ফেল।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "GOTS, GRS, RCS, OCS, BCI", type: "Voluntary schemes", typeBn: "ঐচ্ছিক স্কিম", what: "Organic, recycled and sustainable-cotton chain-of-custody schemes. GOTS, GRS, RCS and BCI are named in the draft; OCS appears in its abbreviations.", source: "JRC draft", whatBn: "জৈব, রিসাইকেলড ও টেকসই-তুলার চেইন-অব-কাস্টডি স্কিম। খসড়ায় GOTS, GRS, RCS ও BCI নাম ধরে আছে; OCS শুধু সংক্ষিপ্ত রূপের তালিকায়।", sourceBn: "JRC খসড়া", status: "checked" },
  { name: "ZDHC", type: "Industry programme", typeBn: "শিল্প কর্মসূচি", what: "Mentioned once in the draft as part of chemical compliance data.", source: "JRC draft (one mention)", whatBn: "রাসায়নিক সম্মতির ডেটার অংশ হিসেবে খসড়ায় একবার উল্লেখ আছে।", sourceBn: "JRC খসড়া (একবার উল্লেখ)", status: "limited" },
  { name: "BGMEA", type: "Trade association (not a regulation)", typeBn: "ট্রেড অ্যাসোসিয়েশন (আইন নয়)", what: "Bangladesh exporters' association. Not a legal requirement in itself.", source: "Not covered by the JRC draft", whatBn: "বাংলাদেশের রপ্তানিকারকদের সংগঠন। নিজে কোনো আইনি বাধ্যবাধকতা নয়।", sourceBn: "JRC খসড়ায় নেই", status: "unverified" },
  { name: "EU ban on destroying unsold clothes, clothing accessories and footwear (ESPR)", type: "EU law", typeBn: "ইইউ আইন", what: "Applies to large companies from 19 July 2026; medium-sized companies follow from 2030. Destruction is allowed only in limited cases such as unsafe, damaged or counterfeit items. Companies relying on an exemption must keep proof, publish annual reports and keep records for five years. Mainly a brand and retailer duty. The page read does not give the article number.", source: "European Commission, environment news, 17 July 2026", whatBn: "বড় কোম্পানির জন্য ১৯ জুলাই ২০২৬ থেকে কার্যকর; মাঝারি কোম্পানির জন্য ২০৩০ থেকে। ধ্বংস শুধু সীমিত ক্ষেত্রে অনুমোদিত, যেমন অনিরাপদ, ক্ষতিগ্রস্ত বা জাল পণ্য। ছাড়ের ওপর নির্ভর করলে প্রমাণ রাখতে হবে, বার্ষিক রিপোর্ট প্রকাশ করতে হবে এবং পাঁচ বছর নথি রাখতে হবে। মূলত ব্র্যান্ড ও খুচরা বিক্রেতার দায়িত্ব। পড়া পাতায় ধারার নম্বর দেওয়া নেই।", sourceBn: "ইউরোপীয় কমিশন, পরিবেশ সংবাদ, ১৭ জুলাই ২০২৬", status: "checked" },
  { name: "Bangladesh national rules", type: "National law", typeBn: "জাতীয় আইন", what: "Export registration, tax and labour or safety rules were not checked. Ask BGMEA or a legal adviser.", source: "Not checked", whatBn: "রপ্তানি নিবন্ধন, কর এবং শ্রম বা নিরাপত্তা নিয়ম যাচাই করা হয়নি। BGMEA বা আইনজীবীকে জিজ্ঞেস করুন।", sourceBn: "যাচাই করা হয়নি", status: "unverified" },
];

type Link = { href: string; label: string; labelBn: string };
const LINKS: Record<string, Link[]> = {
 "EU ESPR": [
  {
   "href": "https://eur-lex.europa.eu/eli/reg/2024/1781/oj",
   "label": "EUR-Lex: official text",
   "labelBn": "EUR-Lex: অফিসিয়াল পাঠ"
  },
  {
   "href": "https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/textile-apparel_en",
   "label": "European Commission: textile and apparel DPP",
   "labelBn": "ইউরোপীয় কমিশন: টেক্সটাইল ও অ্যাপারেল DPP"
  }
 ],
 "JRC study": [
  {
   "href": "https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/textile-apparel_en",
   "label": "European Commission: textile and apparel DPP (links to the JRC study)",
   "labelBn": "ইউরোপীয় কমিশন: টেক্সটাইল ও অ্যাপারেল DPP (JRC স্টাডির লিংকসহ)"
  }
 ],
 "ESPR Article 13": [
  {
   "href": "https://eur-lex.europa.eu/eli/reg_impl/2026/1778/oj",
   "label": "EUR-Lex: Regulation 2026/1778",
   "labelBn": "EUR-Lex: রেগুলেশন 2026/1778"
  },
  {
   "href": "https://single-market-economy.ec.europa.eu/news/digital-product-passport-registry-now-live-2026-07-20_en",
   "label": "European Commission: registry now live (20 July 2026)",
   "labelBn": "ইউরোপীয় কমিশন: রেজিস্ট্রি চালু (২০ জুলাই ২০২৬)"
  }
 ],
 "Commission Implementing Decision": [
  {
   "href": "https://eur-lex.europa.eu/eli/dec_impl/2026/1736/oj",
   "label": "EUR-Lex: Decision 2026/1736",
   "labelBn": "EUR-Lex: সিদ্ধান্ত 2026/1736"
  }
 ],
 "Textile Labelling": [
  {
   "href": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1007",
   "label": "EUR-Lex: official text",
   "labelBn": "EUR-Lex: অফিসিয়াল পাঠ"
  }
 ],
 "REACH": [
  {
   "href": "https://environment.ec.europa.eu/Topics/Chemicals/REACH-Regulation_en",
   "label": "European Commission: REACH Regulation",
   "labelBn": "ইউরোপীয় কমিশন: REACH রেগুলেশন"
  },
  {
   "href": "https://single-market-economy.ec.europa.eu/sectors/chemicals/reach/reach-explained_en",
   "label": "European Commission: REACH explained",
   "labelBn": "ইউরোপীয় কমিশন: REACH ব্যাখ্যা"
  }
 ],
 "Empowering": [
  {
   "href": "https://eur-lex.europa.eu/eli/dir/2024/825/oj",
   "label": "EUR-Lex: official text",
   "labelBn": "EUR-Lex: অফিসিয়াল পাঠ"
  }
 ],
 "CSRD": [
  {
   "href": "https://eur-lex.europa.eu/eli/dir/2022/2464",
   "label": "EUR-Lex: CSRD",
   "labelBn": "EUR-Lex: CSRD"
  },
  {
   "href": "https://eur-lex.europa.eu/eli/dir/2024/1760/oj",
   "label": "EUR-Lex: CSDDD",
   "labelBn": "EUR-Lex: CSDDD"
  }
 ],
 "Waste Framework": [
  {
   "href": "https://eur-lex.europa.eu/eli/dir/2025/1892/oj",
   "label": "EUR-Lex: official text",
   "labelBn": "EUR-Lex: অফিসিয়াল পাঠ"
  }
 ],
 "Forced Labour": [
  {
   "href": "https://eur-lex.europa.eu/eli/reg/2024/3015/oj/eng",
   "label": "EUR-Lex: official text",
   "labelBn": "EUR-Lex: অফিসিয়াল পাঠ"
  }
 ],
 "EU Ecolabel": [
  {
   "href": "https://eur-lex.europa.eu/eli/dec/2014/350/oj",
   "label": "EUR-Lex: official text",
   "labelBn": "EUR-Lex: অফিসিয়াল পাঠ"
  }
 ],
 "French AGEC": [
  {
   "href": "https://www.ecologie.gouv.fr/info-tri",
   "label": "French Ministry of Ecology: Info-tri (sorting)",
   "labelBn": "ফরাসি পরিবেশ মন্ত্রণালয়: Info-tri (বাছাই)"
  }
 ],
 "GS1 GTIN": [
  {
   "href": "https://gs1.org/standards/id-keys/gtin",
   "label": "GS1: GTIN",
   "labelBn": "GS1: GTIN"
  },
  {
   "href": "https://GS1.org/id-keys",
   "label": "GS1: identification keys (includes GLN)",
   "labelBn": "GS1: আইডেন্টিফিকেশন কী (GLN সহ)"
  },
  {
   "href": "https://www.iso.org/standard/44149.html",
   "label": "ISO/IEC 15459-6:2007 page (withdrawn edition)",
   "labelBn": "ISO/IEC 15459-6:2007 পাতা (প্রত্যাহৃত সংস্করণ)"
  },
  {
   "href": "https://knowledge.bsigroup.com/products/digital-product-passport-unique-identifiers",
   "label": "BSI: DPP unique identifiers (prEN 18219)",
   "labelBn": "BSI: DPP ইউনিক আইডেন্টিফায়ার (prEN 18219)"
  }
 ],
 "ISO 3759": [
  {
   "href": "https://www.iso.org/standard/57309.html",
   "label": "ISO 3759:2011",
   "labelBn": "ISO 3759:2011"
  },
  {
   "href": "https://www.iso.org/standard/78782.html",
   "label": "ISO 16322-3:2021",
   "labelBn": "ISO 16322-3:2021"
  },
  {
   "href": "https://www.iso.org/standard/67602.html",
   "label": "ISO 15487:2018",
   "labelBn": "ISO 15487:2018"
  }
 ],
 "ISO 21600": [
  {
   "href": "https://www.iso.org/standard/74401.html",
   "label": "ISO 3758:2023 (care labelling code, related)",
   "labelBn": "ISO 3758:2023 (যত্ন-লেবেল কোড, সম্পর্কিত)"
  }
 ],
 "ISO 14021": [
  {
   "href": "https://www.iso.org/standard/87608.html",
   "label": "ISO 14021:2026",
   "labelBn": "ISO 14021:2026"
  },
  {
   "href": "https://www.iso.org/standard/72458.html",
   "label": "ISO 14024:2018 page",
   "labelBn": "ISO 14024:2018 পাতা"
  },
  {
   "href": "https://www.iso.org/standard/72471.html",
   "label": "ISO 22059:2020",
   "labelBn": "ISO 22059:2020"
  }
 ],
 "PEFCR": [
  {
   "href": "https://environment.ec.europa.eu/news/new-eu-rules-measuring-environmental-impact-clothes-and-shoes-2025-06-25_en",
   "label": "European Commission: new PEF rules for clothes and shoes (25 June 2025)",
   "labelBn": "ইউরোপীয় কমিশন: পোশাক ও জুতার নতুন PEF নিয়ম (২৫ জুন ২০২৫)"
  },
  {
   "href": "https://transition-pathways.europa.eu/textiles/legislative-developments/eu-product-environmental-footprint-category-rules-pefcrs-apparel",
   "label": "EU Transition Pathways: PEFCR for apparel",
   "labelBn": "EU Transition Pathways: পোশাকের PEFCR"
  }
 ],
 "OEKO-TEX": [
  {
   "href": "https://oeko-tex.com/en/our-standards/oeko-tex-standard-100",
   "label": "OEKO-TEX: Standard 100",
   "labelBn": "OEKO-TEX: Standard 100"
  }
 ],
 "GOTS, GRS": [
  {
   "href": "https://global-standard.org/the-standard",
   "label": "GOTS: the standard",
   "labelBn": "GOTS: স্ট্যান্ডার্ড"
  },
  {
   "href": "https://textileexchange.org/standards/",
   "label": "Textile Exchange standards (GRS, RCS, OCS)",
   "labelBn": "Textile Exchange স্ট্যান্ডার্ড (GRS, RCS, OCS)"
  },
  {
   "href": "https://bettercotton.org/about-bci/",
   "label": "Better Cotton (BCI)",
   "labelBn": "Better Cotton (BCI)"
  }
 ],
 "ZDHC": [
  {
   "href": "https://www.roadmaptozero.com/about",
   "label": "ZDHC (Roadmap to Zero): about",
   "labelBn": "ZDHC (Roadmap to Zero): পরিচিতি"
  },
  {
   "href": "https://roadmaptozero.com/mrsl",
   "label": "ZDHC MRSL",
   "labelBn": "ZDHC MRSL"
  }
 ],
 "BGMEA": [
  {
   "href": "https://www.bgmea.com.bd/page/aboutus",
   "label": "BGMEA: about us",
   "labelBn": "BGMEA: পরিচিতি"
  }
 ],
 "EU ban on destroying": [
  {
   "href": "https://environment.ec.europa.eu/news/ban-destruction-unsold-clothes-and-shoes-enters-application-2026-07-17_en",
   "label": "European Commission: ban enters application (17 July 2026)",
   "labelBn": "ইউরোপীয় কমিশন: নিষেধাজ্ঞা কার্যকর (১৭ জুলাই ২০২৬)"
  }
 ],
 "Bangladesh national": [
  {
   "href": "https://epb.portal.gov.bd/site/files/2d6a532e-bb4b-40c0-b769-b51ba8c1ef3b/-Law-and-Regulations",
   "label": "Export Promotion Bureau: laws and regulations (not a full list)",
   "labelBn": "রপ্তানি উন্নয়ন ব্যুরো: আইন ও বিধি (সম্পূর্ণ তালিকা নয়)"
  },
  {
   "href": "https://www.bgmea.com.bd/",
   "label": "BGMEA",
   "labelBn": "BGMEA"
  }
 ]
};
function linksFor(name: string): Link[] {
  const k = Object.keys(LINKS).find((p) => name.startsWith(p));
  return k ? LINKS[k] : [];
}

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
.ru-links{margin-top:8px;display:flex;gap:6px 14px;flex-wrap:wrap;font-size:.9rem}
.ru-links a{color:#0f766e;font-weight:600;text-decoration:underline;overflow-wrap:anywhere}
.ru-nolink{color:#64748b;font-size:.84rem;margin-top:8px}
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
          <p className="dl-warn">
            {isBn ? "লিংকগুলো অফিসিয়াল বা স্ট্যান্ডার্ড-সংস্থার সাইটে যায়। কিছু পাতা (যেমন EUR-Lex) আমাদের টুল খুলতে পারেনি, তাই পাতা সরে বা বদলে যেতে পারে। লিংক থাকা মানে নিয়ম যাচাই করা হয়েছে—এমন নয়।" : "Links go to official or standards-body sites. Some pages (such as EUR-Lex) could not be opened by our tools, so they may move or change. A link does not mean we verified the rule."}
          </p>
          <div className="ru-legend" aria-label={isBn ? "চিহ্নের অর্থ" : "Legend"}>
            {(["checked", "limited", "unverified"] as const).map((k) => (
              <span key={k} className={"ru-chip " + LABEL[k].cls}>{isBn ? LABEL[k].bn : LABEL[k].en}</span>
            ))}
          </div>
          <div className="ru-list">
            {ROWS.map((r) => {
              const s = LABEL[r.status];
              const ls = linksFor(r.name);
              return (
                <article key={r.name} className="ru-card">
                  <div className="ru-top">
                    <h2 style={{ fontSize: "1rem", margin: 0 }}>{r.name}</h2>
                    <span className={"ru-chip " + s.cls}>{isBn ? s.bn : s.en}</span>
                  </div>
                  <div className="ru-type">{isBn ? r.typeBn : r.type}</div>
                  <p className="ru-what">{isBn ? r.whatBn : r.what}</p>
                  <p className="ru-src">{isBn ? "উৎস: " : "Source: "}{isBn ? r.sourceBn : r.source}</p>
                  {ls.length > 0 ? (
                    <p className="ru-links">
                      {ls.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                          {isBn ? l.labelBn : l.label} ↗
                        </a>
                      ))}
                    </p>
                  ) : (
                    <p className="ru-nolink">{isBn ? "এই সারির জন্য অফিসিয়াল লিংক পাওয়া যায়নি।" : "No official link found for this row."}</p>
                  )}
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
