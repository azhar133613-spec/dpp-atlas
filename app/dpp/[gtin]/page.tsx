import type { Metadata } from "next";
import { BASE_CSS } from "../../[locale]/_ui/chrome";

export const metadata: Metadata = {
  title: "This page has been retired",
  description: "DPP Atlas no longer shows passport-style pages. It does not issue passports, certificates or audits.",
  robots: { index: false, follow: false },
};

const CSS = `
.rt{max-width:640px;margin:0 auto;padding:48px 20px}
.rt h1{font-size:1.7rem}
.rt section{border:1px solid var(--line);border-radius:14px;padding:22px;margin-bottom:18px;background:#fff}
.rt p{color:var(--muted);margin-bottom:10px}
.rt .dl-btn{margin:6px 8px 0 0}
`;

export default function RetiredPassportPage() {
  return (
    <div className="dl" style={{ background: "#f5f7f6" }}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + CSS }} />
      <main className="rt">
        <a className="dl-logo" href="/bn" style={{ marginBottom: 24 }}><i aria-hidden="true" />DPP Atlas</a>

        <section lang="bn">
          <h1>এই পাতাটি বন্ধ করা হয়েছে</h1>
          <p>DPP Atlas-এর আগের সংস্করণে কারখানার স্ব-রিপোর্টকৃত ফলাফল পাসপোর্টের ধাঁচে দেখানো হতো। DPP Atlas কোনো ডিজিটাল প্রোডাক্ট পাসপোর্ট, সনদ বা অডিট ইস্যু করে না। ওই পাতার কোনো তথ্য কেউ যাচাই করেনি।</p>
          <p>QR কোড দেখে এখানে এসে থাকলে সংশ্লিষ্ট কারখানার কাছে তাদের নথিসহ প্রমাণযোগ্য তথ্য সরাসরি চান।</p>
          <a className="dl-btn dl-btn-p" href="/bn/check">ডেটা চেক দেখুন</a>
          <a className="dl-btn dl-btn-s" href="/bn/rules">নিয়ম ও স্ট্যান্ডার্ড</a>
        </section>

        <section lang="en">
          <h1>This page has been retired</h1>
          <p>Earlier versions of DPP Atlas showed self-reported assessment results in a passport-style page. DPP Atlas does not issue Digital Product Passports, certificates or audits, and nothing on those pages was verified by anyone.</p>
          <p>If a QR code sent you here, ask the factory directly for data it can back up with documents.</p>
          <a className="dl-btn dl-btn-p" href="/en/check">See the Data Check</a>
          <a className="dl-btn dl-btn-s" href="/en/rules">Rules and standards</a>
        </section>
      </main>
    </div>
  );
}
