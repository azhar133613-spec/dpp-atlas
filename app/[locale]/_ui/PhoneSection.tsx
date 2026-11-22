import { InstallButton } from "./Pwa";

const CSS = `
.ph{padding:72px 0}
.ph .dl-wrap{display:grid;grid-template-columns:auto 1fr;gap:40px;align-items:center;max-width:860px}
.ph-qr{background:#fff;border:1px solid var(--line);border-radius:16px;padding:14px;line-height:0}
.ph-qr img{width:168px;height:168px}
.ph h2{margin-bottom:8px}
.ph-note{color:var(--muted);font-size:.95rem;margin-top:10px}
.ph-txt{color:var(--muted);max-width:56ch;margin-bottom:16px}
@media(max-width:560px){.ph{padding:48px 0}.ph .dl-wrap{grid-template-columns:1fr;gap:24px}}
`;

export default function PhoneSection({ loc }: { loc: "en" | "bn" }) {
  const bn = loc === "bn";
  return (
    <section className="ph" aria-labelledby="phone">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="dl-wrap">
        <div className="ph-qr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/qr-dpp-atlas.svg" alt={bn ? "dpp-atlas.vercel.app খোলার QR কোড" : "QR code that opens dpp-atlas.vercel.app"} width={168} height={168} />
        </div>
        <div>
          <h2 id="phone">{bn ? "ফোনে খুলুন, অ্যাপের মতো ব্যবহার করুন" : "Open it on your phone, use it like an app"}</h2>
          <p className="ph-txt">
            {bn
              ? "ফোনের ক্যামেরা দিয়ে QR কোড স্ক্যান করলে এই সাইট খুলবে। চাইলে ফোন, ল্যাপটপ বা ডেস্কটপে অ্যাপ হিসেবে ইনস্টল করুন। একবার খোলা পাতাগুলো ইন্টারনেট ছাড়াও চলে।"
              : "Scan the code with your phone camera to open this site. You can also install it as an app on a phone, laptop or desktop. Pages you have opened once keep working without internet."}
          </p>
          <InstallButton loc={loc} />
        </div>
      </div>
    </section>
  );
}
