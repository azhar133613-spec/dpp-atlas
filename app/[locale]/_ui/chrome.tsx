// Shared page frame (header, footer, base styles) for the Data Check and Rules pages.
export const BASE_CSS = `
.dl{--ink:#0f172a;--muted:#475569;--line:#e2e8f0;--soft:#f5f7f6;--brand:#0f766e;--brand-d:#115e59;--warn:#b45309;--bad:#b91c1c;--ok:#15803d;--info:#1d4ed8;
font-family:'Hind Siliguri',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column}
.dl *{box-sizing:border-box}
.dl:lang(bn){line-height:1.8}
.dl :where(a){color:inherit}
.dl a:focus-visible,.dl button:focus-visible,.dl select:focus-visible,.dl input:focus-visible{outline:3px solid #0f766e;outline-offset:2px;border-radius:6px}
.dl-skip{position:absolute;left:-9999px;top:8px;background:#fff;padding:8px 12px;border:2px solid var(--brand);z-index:50}
.dl-skip:focus{left:8px}
.dl-wrap{max-width:1120px;margin:0 auto;padding:0 20px;width:100%}
.dl-narrow{max-width:900px}
.dl-nav{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line)}
.dl-nav .dl-wrap{display:flex;align-items:center;gap:20px;height:64px}
.dl-logo{font-weight:700;font-size:1.15rem;text-decoration:none;letter-spacing:-.01em;margin-right:auto;display:flex;align-items:center;gap:8px}
.dl-logo i{display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--brand)}
.dl-links{display:flex;gap:22px;align-items:center}
.dl-links a:not(.dl-btn){text-decoration:none;color:var(--muted);font-size:.95rem}
.dl-links a:not(.dl-btn):hover{color:var(--ink)}
.dl-links a[aria-current="page"]{color:var(--ink);font-weight:600}
.dl-lang{border:1px solid var(--line);padding:5px 12px;border-radius:8px}
.dl-btn{display:inline-block;text-decoration:none;font-weight:600;border-radius:10px;padding:10px 18px;font-size:.95rem;border:2px solid var(--brand);line-height:1.3;text-align:center;cursor:pointer;font-family:inherit}
.dl a.dl-btn-p,.dl button.dl-btn-p{background:var(--brand);color:#fff}
.dl a.dl-btn-p:hover,.dl button.dl-btn-p:hover{background:var(--brand-d);border-color:var(--brand-d)}
.dl a.dl-btn-s,.dl button.dl-btn-s{background:#fff;color:var(--brand)}
.dl a.dl-btn-s:hover,.dl button.dl-btn-s:hover{background:var(--soft)}
.dl button.dl-btn-d{background:#fff;color:var(--bad);border-color:#fecaca}
.dl-nav .dl-btn{padding:8px 16px;font-size:.92rem}
.dl-main{flex:1;padding:36px 0 56px}
.dl h1{font-size:2rem;line-height:1.2;letter-spacing:-.02em;margin:0 0 12px;font-weight:700}
.dl:lang(bn) h1{line-height:1.45;letter-spacing:0}
.dl h2{font-size:1.2rem;margin:0 0 12px;font-weight:700;line-height:1.4}
.dl h3{font-size:1rem;margin:0;font-weight:600;line-height:1.5}
.dl :where(p){margin:0}
.dl-lead{color:var(--muted);font-size:1.02rem;max-width:68ch;margin-bottom:10px}
.dl-warn{color:var(--warn);font-size:.92rem;max-width:80ch;margin-bottom:18px}
.dl-warn a{color:var(--brand)}
.dl-foot{padding:28px 0;border-top:1px solid var(--line);font-size:.9rem;color:var(--muted)}
.dl-foot .dl-wrap{display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between}
.dl-foot nav{display:flex;flex-wrap:wrap;gap:8px 20px}
.dl-foot a{color:var(--muted)}
@media(max-width:760px){.dl-links a.dl-hide{display:none}.dl-nav .dl-wrap{gap:10px}.dl-links{gap:10px}}
@media(max-width:560px){.dl h1,.dl:lang(bn) h1{font-size:1.65rem}.dl-wrap{padding:0 16px}.dl-logo{font-size:1.05rem}.dl-nav .dl-btn{padding:8px 12px;font-size:.88rem}.dl-lang{padding:5px 9px}.dl-main{padding:24px 0 40px}}
@media print{.dl-nav,.dl-foot,.dl-noprint,.dl-skip{display:none!important}.dl-main{padding:0}}
`;

const L = {
  en: { skip: "Skip to content", rules: "Rules and standards", lookup: "Report lookup", login: "Log in", check: "Data Check", lang: "বাংলা", foot: "DPP Atlas. Content last reviewed November 2026.", earlier: "Earlier tools", scored: "Scored self-check (old)" },
  bn: { skip: "মূল অংশে যান", rules: "নিয়ম ও স্ট্যান্ডার্ড", lookup: "রিপোর্ট খুঁজুন", login: "লগ ইন", check: "ডেটা চেক", lang: "English", foot: "DPP Atlas। বিষয়বস্তু সর্বশেষ পর্যালোচনা: নভেম্বর ২০২৬।", earlier: "আগের টুল", scored: "স্কোরসহ সেলফ-চেক (পুরোনো)" },
};

export function Header({ loc, path, current }: { loc: "en" | "bn"; path: string; current: "check" | "rules" }) {
  const t = L[loc];
  const other = loc === "bn" ? "en" : "bn";
  return (
    <>
      <a className="dl-skip" href="#main">{t.skip}</a>
      <header className="dl-nav">
        <div className="dl-wrap">
          <a className="dl-logo" href={"/" + loc}><i aria-hidden="true" />DPP Atlas</a>
          <nav className="dl-links" aria-label="Main">
            <a className="dl-hide" href={"/" + loc + "/rules"} aria-current={current === "rules" ? "page" : undefined}>{t.rules}</a>
                        <a className="dl-lang" href={"/" + other + path} lang={other} hrefLang={other}>{t.lang}</a>
            <a className="dl-btn dl-btn-p" href={"/" + loc + "/check"} aria-current={current === "check" ? "page" : undefined}>{t.check}</a>
          </nav>
        </div>
      </header>
    </>
  );
}

export function Footer({ loc }: { loc: "en" | "bn" }) {
  const t = L[loc];
  return (
    <footer className="dl-foot">
      <div className="dl-wrap">
        <span>{t.foot}</span>
        <nav aria-label="Footer">
          <a href={"/" + loc + "/check"}>{t.check}</a>
          <a href={"/" + loc + "/rules"}>{t.rules}</a>
        </nav>
      </div>
    </footer>
  );
}
