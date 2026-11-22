import type { Metadata } from "next";
import { BASE_CSS, Header, Footer } from "../_ui/chrome";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "bn"
    ? { title: "গোপনীয়তা", description: "DPP Atlas কী সংরক্ষণ করে এবং কী করে না।" }
    : { title: "Privacy", description: "What DPP Atlas stores and what it does not." };
}

const CSS = `.pv li{margin-bottom:10px;color:#334155}.pv ul{padding-left:20px;margin:12px 0 22px}`;

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const loc: "en" | "bn" = params.locale === "bn" ? "bn" : "en";
  const bn = loc === "bn";
  return (
    <div className="dl" lang={loc}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + CSS }} />
      <Header loc={loc} path="/privacy" current="privacy" />
      <main id="main" className="dl-main">
        <div className="dl-wrap dl-narrow pv">
          <h1>{bn ? "গোপনীয়তা" : "Privacy"}</h1>
          <p className="dl-lead">
            {bn ? "DPP Atlas একটি শিক্ষার্থী প্রকল্প। সর্বশেষ হালনাগাদ: ২২ নভেম্বর ২০২৬।" : "DPP Atlas is a student project. Last updated 22 November 2026."}
          </p>
          <h2>{bn ? "আমরা যা সংরক্ষণ করি না" : "What we do not store"}</h2>
          <ul>
            <li>{bn ? "ডেটা চেকে আপনি যা লেখেন তা আমাদের সার্ভারে যায় না। কোনো অ্যাকাউন্ট নেই।" : "What you enter in the Data Check does not go to our servers. There are no accounts."}</li>
            <li>{bn ? "উত্তরগুলো শুধু আপনার ডিভাইসের ব্রাউজারে (localStorage) থাকে। “মুছুন” চাপলে বা ব্রাউজারের ডেটা মুছলে সেগুলো চলে যায়।" : "Your answers stay only in your device’s browser (localStorage). The Clear button, or clearing browser data, removes them."}</li>
            <li>{bn ? "CSV ডাউনলোড ও প্রিন্ট আপনার ডিভাইসেই তৈরি হয়।" : "CSV downloads and printing are produced on your device."}</li>
            <li>{bn ? "আমরা বিজ্ঞাপন বা অ্যানালিটিক্স কুকি ব্যবহার করি না।" : "We do not use advertising or analytics cookies."}</li>
          </ul>
          <h2>{bn ? "তবু যা ঘটে" : "What still happens"}</h2>
          <ul>
            <li>{bn ? "সাইটটি Vercel-এ হোস্ট করা। হোস্টিং ও আপনার ইন্টারনেট প্রদানকারী কারিগরি তথ্য, যেমন আইপি ঠিকানা, লগে রাখতে পারে।" : "The site is hosted on Vercel. Hosting and your network provider may process technical data such as your IP address in logs."}</li>
            <li>{bn ? "ফন্ট (Hind Siliguri) Google Fonts থেকে লোড হয়, তাই Google আপনার আইপি ঠিকানা ও ব্রাউজারের তথ্য পেতে পারে।" : "The font (Hind Siliguri) is loaded from Google Fonts, so Google can receive your IP address and browser details."}</li>
            <li>{bn ? "অ্যাপ হিসেবে ইনস্টল করলে বা সাইট খুললে পাতার কপি আপনার ডিভাইসে জমা থাকে, যাতে ইন্টারনেট ছাড়াও চলে।" : "If you install the app or open the site, copies of pages are cached on your device so it works offline."}</li>
          </ul>
          <h2>{bn ? "ভবিষ্যতে" : "In the future"}</h2>
          <p style={{ color: "#334155" }}>
            {bn
              ? "অ্যাকাউন্ট বা সার্ভারে তথ্য সংরক্ষণ যোগ করার আগে এই পাতা হালনাগাদ করা হবে এবং সম্মতি চাওয়া হবে। এটি আইনি পরামর্শ নয়।"
              : "Before accounts or server-side storage are added, this page will be updated and consent will be asked for. This is not legal advice."}
          </p>
        </div>
      </main>
      <Footer loc={loc} />
    </div>
  );
}
