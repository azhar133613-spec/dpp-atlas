import type { Metadata } from "next";
import { BASE_CSS, Header, Footer } from "../_ui/chrome";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "bn"
    ? { title: "আমাদের সম্পর্কে ও তথ্য যাচাই", description: "DPP Atlas কী, কী নয়, এবং আমরা কীভাবে সূত্র যাচাই করি।" }
    : { title: "About and how we check sources", description: "What DPP Atlas is, what it is not, and how we check sources." };
}

const CSS = `.ab li{margin-bottom:10px;color:#334155}.ab ul{padding-left:20px;margin:12px 0 22px}.ab p{color:#334155}`;
const REPO = "https://github.com/azhar133613-spec/dpp-atlas";

export default function AboutPage({ params }: { params: { locale: string } }) {
  const loc: "en" | "bn" = params.locale === "bn" ? "bn" : "en";
  const bn = loc === "bn";
  return (
    <div className="dl" lang={loc}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + CSS }} />
      <Header loc={loc} path="/about" current="about" />
      <main id="main" className="dl-main">
        <div className="dl-wrap dl-narrow ab">
          <h1>{bn ? "আমাদের সম্পর্কে ও তথ্য যাচাই" : "About and how we check sources"}</h1>
          <p className="dl-lead">
            {bn ? "সর্বশেষ হালনাগাদ: ২৩ নভেম্বর ২০২৬।" : "Last updated 23 November 2026."}
          </p>

          <h2>{bn ? "DPP Atlas কী" : "What DPP Atlas is"}</h2>
          <p>
            {bn
              ? "DPP Atlas একটি বিনামূল্যের শিক্ষার্থী প্রকল্প। বাংলাদেশের পোশাক ও টেক্সটাইল কারখানাকে ইউরোপীয় ইউনিয়নের ডিজিটাল প্রোডাক্ট পাসপোর্ট (DPP) তথ্যের অনুরোধের জন্য প্রস্তুত হতে সাহায্য করা এর লক্ষ্য। এটি দেখায় কোন তথ্য কার কাছে থাকে এবং কোথায় ফাঁক আছে।"
              : "DPP Atlas is a free student project. It helps Bangladeshi garment and textile factories get ready for EU Digital Product Passport (DPP) data requests. It shows who holds each data point and where the gaps are."}
          </p>

          <h2>{bn ? "যা এটি নয়" : "What it is not"}</h2>
          <ul>
            <li>{bn ? "এটি সরকারি, প্রকাশিত বা যাচাইকৃত ওয়েবসাইট নয়।" : "It is not an official, published or verified website."}</li>
            <li>{bn ? "এটি আইনি পরামর্শ বা সনদ নয়। এটি কাউকে “ইইউ-সম্মত” ঘোষণা করে না।" : "It is not legal advice or a certificate. It does not declare anyone “EU-compliant”."}</li>
            <li>{bn ? "এটি এখনও কোনো বাস্তব কারখানায় পরীক্ষা করা হয়নি।" : "It has not yet been tested in a real factory."}</li>
            <li>{bn ? "টেক্সটাইলের জন্য ইইউর নির্দিষ্ট নিয়ম এখনও চূড়ান্ত হয়নি। তাই এই টুল প্রস্তুতির জন্য, সম্মতির প্রমাণের জন্য নয়।" : "The EU’s textile-specific rules are not final yet. So this tool is for preparation, not proof of compliance."}</li>
          </ul>

          <h2>{bn ? "আমরা কীভাবে সূত্র যাচাই করি" : "How we check sources"}</h2>
          <ul>
            <li>{bn ? "আমরা শুধু সরকারি বা আন্তর্জাতিক উৎস ব্যবহার করি, যেমন ইউরোপীয় কমিশনের পাতা ও EUR-Lex। প্রতিটি দাবির সঙ্গে উৎস দেওয়া থাকে।" : "We use official sources, such as European Commission pages and EUR-Lex. Each claim carries its source."}</li>
            <li>{bn ? "“নিয়ম ও স্ট্যান্ডার্ড” পাতায় প্রতিটি সারির পাশে অবস্থা লেখা থাকে: যাচাই করা, সীমিত পর্যালোচনা, বা এখনও যাচাই হয়নি।" : "On the Rules page, each row is marked checked, limited review, or not yet reviewed."}</li>
            <li>{bn ? "ইউরোপীয় কমিশনের তিনটি পাতা একটি স্বয়ংক্রিয় পরীক্ষা সপ্তাহে একবার দেখে। কিছু বদলালে আমরা জানতে পারি। তারপর একজন মানুষ পাতাটি পড়ে আপডেট করে। স্বয়ংক্রিয় পরীক্ষা নিজে থেকে সাইট বদলায় না।" : "An automated check reads three European Commission pages once a week and flags changes. A person then reads the page and updates the site. The automated check never edits the site itself."}</li>
            <li>{bn ? "EUR-Lex-এর আইনের পাতাগুলো স্বয়ংক্রিয়ভাবে পড়া যায় না। সেগুলো আমরা হাতে দেখি, মোটামুটি মাসে একবার।" : "The EUR-Lex law pages cannot be read automatically. We check those by hand, about once a month."}</li>
            <li>{bn ? "যা যাচাই করা যায়নি, তা আমরা যাচাইকৃত বলি না। আপডেট পাতায় “সর্বশেষ দেখা” তারিখ দেওয়া থাকে।" : "What we cannot verify, we do not call verified. The Updates page shows a “last checked” date."}</li>
          </ul>

          <h2>{bn ? "ভুল পেলে" : "If you find a mistake"}</h2>
          <p>
            {bn ? "এখনও কোনো সার্বজনীন ইমেইল ঠিকানা নেই। ভুল জানাতে GitHub-এ একটি ইস্যু খুলুন: " : "There is no public email address yet. To report a mistake, open an issue on GitHub: "}
            <a href={REPO + "/issues"}>{REPO.replace("https://", "") + "/issues"}</a>
            {bn ? "। প্রমাণ হিসেবে সরকারি সূত্রের লিংক দিলে দ্রুত ঠিক করা যায়।" : ". A link to an official source helps us fix it faster."}
          </p>

          <h2>{bn ? "উন্মুক্ত কোড" : "Open code"}</h2>
          <p>
            {bn ? "এই সাইটের কোড সবার জন্য খোলা: " : "The code for this site is public: "}
            <a href={REPO}>{REPO.replace("https://", "")}</a>
          </p>
        </div>
      </main>
      <Footer loc={loc} />
    </div>
  );
}
