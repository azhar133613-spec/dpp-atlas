import type { Metadata } from "next";
import { BASE_CSS, Header, Footer } from "../_ui/chrome";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "bn"
    ? { title: "DPP কী: সংক্ষেপে", description: "ডিজিটাল প্রোডাক্ট পাসপোর্ট কী, কীভাবে কাজ করে, এবং টেক্সটাইলের অবস্থা: ইউরোপীয় কমিশনের পাতা থেকে।" }
    : { title: "What is a DPP: the short version", description: "What a Digital Product Passport is, how it works and where textiles stand, taken from the European Commission's page." };
}

const SRC = "https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en";
const TEXTILE = "https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/textile-apparel_en";

type Sec = { h: string; hBn: string; p: string; pBn: string; href: string; src: string; srcBn: string };
const SECS: Sec[] = [
  {
    h: "What a DPP is", hBn: "DPP কী",
    p: "The Commission describes a Digital Product Passport as a digital container for products, components and materials. It stores information that supports sustainability, circularity and legal compliance.",
    pBn: "কমিশন ডিজিটাল প্রোডাক্ট পাসপোর্টকে পণ্য, উপাদান ও উপকরণের জন্য একটি ডিজিটাল ধারক হিসেবে বর্ণনা করেছে। এতে টেকসইতা, বৃত্তাকার অর্থনীতি ও আইনি সম্মতিতে সহায়ক তথ্য থাকে।",
    href: SRC, src: "European Commission, DPP page", srcBn: "ইউরোপীয় কমিশন, DPP পাতা",
  },
  {
    h: "What it may hold", hBn: "এতে কী থাকতে পারে",
    p: "Depending on the product group, it may include a product’s safety, origin, materials and repairability. The complete product information is stored by the economic operator or a DPP service provider.",
    pBn: "পণ্যগোষ্ঠী অনুযায়ী এতে পণ্যের নিরাপত্তা, উৎস, উপকরণ ও মেরামতযোগ্যতার তথ্য থাকতে পারে। পূর্ণ তথ্য রাখে অর্থনৈতিক অপারেটর বা DPP সেবাদাতা।",
    href: SRC, src: "European Commission, DPP page", srcBn: "ইউরোপীয় কমিশন, DPP পাতা",
  },
  {
    h: "How people reach it", hBn: "কীভাবে দেখা যায়",
    p: "A digital data carrier, such as a QR code, links the physical product to its DPP. By scanning it, different users can access the information relevant to them. Access rights are managed under the applicable EU legislation.",
    pBn: "QR কোডের মতো একটি ডিজিটাল ডেটা ক্যারিয়ার ভৌত পণ্যকে তার DPP-র সাথে যুক্ত করে। স্ক্যান করলে বিভিন্ন ব্যবহারকারী নিজের প্রাসঙ্গিক তথ্য দেখতে পারে। কে কী দেখতে পাবে তা প্রযোজ্য ইইউ আইনে ঠিক হয়।",
    href: SRC, src: "European Commission, DPP page", srcBn: "ইউরোপীয় কমিশন, DPP পাতা",
  },
  {
    h: "The DPP Registry", hBn: "DPP রেজিস্ট্রি",
    p: "The Registry is the EU database that supports the DPP system. It stores a unique identifier for each product and the mandatory registration data set by the applicable legal act. After a product is registered, the Registry generates a unique URI for its DPP. The Commission says the Registry has been live since 20 July 2026.",
    pBn: "রেজিস্ট্রি হলো DPP ব্যবস্থার সহায়ক ইইউ ডেটাবেস। এতে প্রতিটি পণ্যের অনন্য শনাক্তকারী এবং প্রযোজ্য আইনি অ্যাক্টে নির্ধারিত বাধ্যতামূলক নিবন্ধন তথ্য থাকে। পণ্য নিবন্ধিত হলে রেজিস্ট্রি তার DPP-র জন্য একটি অনন্য URI তৈরি করে। কমিশন বলছে রেজিস্ট্রি ২০ জুলাই ২০২৬ থেকে চালু।",
    href: SRC, src: "European Commission, DPP page", srcBn: "ইউরোপীয় কমিশন, DPP পাতা",
  },
  {
    h: "What businesses must do", hBn: "ব্যবসাকে কী করতে হবে",
    p: "Economic operators must gather the product information the applicable EU legislation requires, create the DPP and register it with the required registration data. Products manufactured in the EU must be registered before they are placed on the market. After a delegated act for a product group is adopted, operators have a transition period of at least 18 months.",
    pBn: "অর্থনৈতিক অপারেটরদের প্রযোজ্য ইইউ আইনে চাওয়া পণ্যের তথ্য সংগ্রহ করতে হবে, DPP তৈরি করতে হবে এবং প্রয়োজনীয় নিবন্ধন তথ্যসহ নিবন্ধন করতে হবে। ইইউতে তৈরি পণ্য বাজারে আনার আগে নিবন্ধিত হতে হবে। কোনো পণ্যগোষ্ঠীর ডেলিগেটেড অ্যাক্ট গৃহীত হওয়ার পর অপারেটরদের অন্তত ১৮ মাসের উত্তরণকাল থাকবে।",
    href: SRC, src: "European Commission, DPP page", srcBn: "ইউরোপীয় কমিশন, DPP পাতা",
  },
  {
    h: "The legal basis", hBn: "আইনি ভিত্তি",
    p: "The Commission names the Ecodesign for Sustainable Products Regulation (ESPR), Regulation (EU) 2024/1781, as the legal basis.",
    pBn: "কমিশন আইনি ভিত্তি হিসেবে টেকসই পণ্যের জন্য ইকোডিজাইন রেগুলেশন (ESPR), রেগুলেশন (ইইউ) 2024/1781-এর নাম দিয়েছে।",
    href: SRC, src: "European Commission, DPP page", srcBn: "ইউরোপীয় কমিশন, DPP পাতা",
  },
  {
    h: "Where textiles stand", hBn: "টেক্সটাইলের অবস্থা",
    p: "Textile and apparel is among the priority product groups for DPPs. The textile rules are not final: the Commission’s pages list adoption of the delegated acts for textiles in 2027 (Q3–Q4 on the DPP page, Q4 on the textile page), as an indicative timeline that may change. Nobody can yet be called “compliant” for textiles. That is why DPP Atlas is about preparation.",
    pBn: "টেক্সটাইল ও অ্যাপারেল DPP-র অগ্রাধিকার পণ্যগোষ্ঠীর একটি। টেক্সটাইলের নিয়ম চূড়ান্ত নয়: কমিশনের পাতায় টেক্সটাইলের ডেলিগেটেড অ্যাক্ট গ্রহণ ২০২৭ সালে ধরা আছে (DPP পাতায় তৃতীয়–চতুর্থ প্রান্তিক, টেক্সটাইল পাতায় চতুর্থ প্রান্তিক), যা ইঙ্গিতমূলক সময়সূচি এবং বদলাতে পারে। তাই টেক্সটাইলে এখনও কাউকে “সম্মত” বলা যায় না। এজন্যই DPP Atlas প্রস্তুতির জন্য।",
    href: TEXTILE, src: "European Commission, textile and apparel DPP page", srcBn: "ইউরোপীয় কমিশন, টেক্সটাইল ও অ্যাপারেল DPP পাতা",
  },
];

const CSS = `.lr section{margin-top:22px}.lr h2{font-size:1.15rem;margin:0 0 6px}.lr p{color:#334155;margin:0 0 6px}.lr .lr-src a{color:#0f766e;font-size:.9rem}`;

export default function LearnPage({ params }: { params: { locale: string } }) {
  const loc: "en" | "bn" = params.locale === "bn" ? "bn" : "en";
  const bn = loc === "bn";
  return (
    <div className="dl" lang={loc}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + CSS }} />
      <Header loc={loc} path="/learn" current="learn" />
      <main id="main" className="dl-main">
        <div className="dl-wrap dl-narrow lr">
          <h1>{bn ? "DPP কী: সংক্ষেপে" : "What is a DPP: the short version"}</h1>
          <p className="dl-lead">
            {bn
              ? "প্রতিটি অংশ ইউরোপীয় কমিশনের পাতা থেকে নেওয়া, লিংকসহ। আমরা নিজেদের মত যোগ করিনি। বাংলা অনুবাদ আমাদের নিজের, কোনো পাঠক এখনও যাচাই করেননি।"
              : "Every section comes from a European Commission page, with the link. We have added no opinions of our own. Last checked 25 November 2026."}
          </p>
          <p className="dl-warn">{bn ? "আইনি পরামর্শ নয়। সিদ্ধান্তের আগে মূল পাতা পড়ুন।" : "Not legal advice. Read the source before you rely on it."}</p>
          {SECS.map((s) => (
            <section key={s.h}>
              <h2>{bn ? s.hBn : s.h}</h2>
              <p>{bn ? s.pBn : s.p}</p>
              <div className="lr-src">
                {bn ? "উৎস: " : "Source: "}
                <a href={s.href} target="_blank" rel="noopener noreferrer">{bn ? s.srcBn : s.src}</a>
              </div>
            </section>
          ))}
          <p style={{ marginTop: 28 }}>
            <a className="dl-btn dl-btn-p" href={"/" + loc + "/check"}>{bn ? "ডেটা চেক শুরু করুন" : "Start the Data Check"}</a>
          </p>
        </div>
      </main>
      <Footer loc={loc} />
    </div>
  );
}
