// DPP Atlas: retire passport pages, relabel old scored pages, hide Log in from the main menu.
// Nothing is deleted. Run in the dpp-atlas folder:  node apply_retire.js
const fs = require("fs"), path = require("path");
const P = (...a) => path.join(...a);
const DPP = P("app", "dpp", "[gtin]", "page.tsx"), REPORT = P("app", "[locale]", "report", "[id]", "page.tsx");
const DASH = P("app", "[locale]", "dashboard", "page.tsx"), VERIFY = P("app", "[locale]", "verify", "page.tsx");
const LAND = P("app", "[locale]", "page.tsx"), CHROME = P("app", "[locale]", "_ui", "chrome.tsx"), SITEMAP = P("app", "sitemap.ts");
for (const f of [DPP, REPORT, DASH, VERIFY, LAND, CHROME, SITEMAP]) if (!fs.existsSync(f)) { console.log("STOP: not found: " + f + " (run inside dpp-atlas, after apply_restyle.js)."); process.exit(1); }
if (fs.readFileSync(DPP, "utf8").includes("has been retired")) { console.log("Already applied. Nothing to do."); process.exit(0); }
fs.mkdirSync("_backup_redesign", { recursive: true });
for (const [f, n] of [[DPP, "dpp-page"], [REPORT, "report-page"], [DASH, "dashboard-page"], [VERIFY, "verify-page"], [LAND, "landing-page-2"], [CHROME, "chrome"], [SITEMAP, "sitemap"]])
  fs.copyFileSync(f, P("_backup_redesign", n + ".bak"));
let problems = 0;
function edit(file, pairs) {
  let s = fs.readFileSync(file, "utf8");
  for (const [a, b] of pairs) {
    const n = s.split(a).length - 1;
    console.log((n === 1 ? "1x " : n + "x ??") + " " + file.slice(-26) + "  " + a.slice(0, 48).replace(/\n/g, " "));
    if (n === 1) s = s.replace(a, () => b); else problems++;
  }
  fs.writeFileSync(file, s, "utf8");
}

// 1. retired passport page (old client component file is kept, unused)
fs.writeFileSync(DPP, Buffer.from("aW1wb3J0IHR5cGUgeyBNZXRhZGF0YSB9IGZyb20gIm5leHQiOwppbXBvcnQgeyBCQVNFX0NTUyB9IGZyb20gIi4uLy4uL1tsb2NhbGVdL191aS9jaHJvbWUiOwoKZXhwb3J0IGNvbnN0IG1ldGFkYXRhOiBNZXRhZGF0YSA9IHsKICB0aXRsZTogIlRoaXMgcGFnZSBoYXMgYmVlbiByZXRpcmVkIiwKICBkZXNjcmlwdGlvbjogIkRQUCBBdGxhcyBubyBsb25nZXIgc2hvd3MgcGFzc3BvcnQtc3R5bGUgcGFnZXMuIEl0IGRvZXMgbm90IGlzc3VlIHBhc3Nwb3J0cywgY2VydGlmaWNhdGVzIG9yIGF1ZGl0cy4iLAogIHJvYm90czogeyBpbmRleDogZmFsc2UsIGZvbGxvdzogZmFsc2UgfSwKfTsKCmNvbnN0IENTUyA9IGAKLnJ0e21heC13aWR0aDo2NDBweDttYXJnaW46MCBhdXRvO3BhZGRpbmc6NDhweCAyMHB4fQoucnQgaDF7Zm9udC1zaXplOjEuN3JlbX0KLnJ0IHNlY3Rpb257Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1saW5lKTtib3JkZXItcmFkaXVzOjE0cHg7cGFkZGluZzoyMnB4O21hcmdpbi1ib3R0b206MThweDtiYWNrZ3JvdW5kOiNmZmZ9Ci5ydCBwe2NvbG9yOnZhcigtLW11dGVkKTttYXJnaW4tYm90dG9tOjEwcHh9Ci5ydCAuZGwtYnRue21hcmdpbjo2cHggOHB4IDAgMH0KYDsKCmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJldGlyZWRQYXNzcG9ydFBhZ2UoKSB7CiAgcmV0dXJuICgKICAgIDxkaXYgY2xhc3NOYW1lPSJkbCIgc3R5bGU9e3sgYmFja2dyb3VuZDogIiNmNWY3ZjYiIH19PgogICAgICA8c3R5bGUgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBCQVNFX0NTUyArIENTUyB9fSAvPgogICAgICA8bWFpbiBjbGFzc05hbWU9InJ0Ij4KICAgICAgICA8YSBjbGFzc05hbWU9ImRsLWxvZ28iIGhyZWY9Ii9ibiIgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAyNCB9fT48aSBhcmlhLWhpZGRlbj0idHJ1ZSIgLz5EUFAgQXRsYXM8L2E+CgogICAgICAgIDxzZWN0aW9uIGxhbmc9ImJuIj4KICAgICAgICAgIDxoMT7gpo/gpocg4Kaq4Ka+4Kak4Ka+4Kaf4Ka/IOCmrOCmqOCnjeCmpyDgppXgprDgpr4g4Ka54Kav4Ka84KeH4Kab4KeHPC9oMT4KICAgICAgICAgIDxwPkRQUCBBdGxhcy3gpo/gprAg4KaG4KaX4KeH4KawIOCmuOCmguCmuOCnjeCmleCmsOCmo+CnhyDgppXgpr7gprDgppbgpr7gpqjgpr7gprAg4Ka44KeN4KasLeCmsOCmv+CmquCni+CmsOCnjeCmn+CmleCng+CmpCDgpqvgprLgpr7gpqvgprIg4Kaq4Ka+4Ka44Kaq4KeL4Kaw4KeN4Kaf4KeH4KawIOCmp+CmvuCmgeCmmuCnhyDgpqbgp4fgppbgpr7gpqjgp4sg4Ka54Kak4KeL4KWkIERQUCBBdGxhcyDgppXgp4vgpqjgp4sg4Kah4Ka/4Kac4Ka/4Kaf4Ka+4KayIOCmquCnjeCmsOCni+CmoeCmvuCmleCnjeCmnyDgpqrgpr7gprjgpqrgp4vgprDgp43gpp8sIOCmuOCmqOCmpiDgpqzgpr4g4KaF4Kah4Ka/4KafIOCmh+CmuOCnjeCmr+CngSDgppXgprDgp4cg4Kao4Ka+4KWkIOCmk+CmhyDgpqrgpr7gpqTgpr7gprAg4KaV4KeL4Kao4KeLIOCmpOCmpeCnjeCmryDgppXgp4fgpokg4Kav4Ka+4Kaa4Ka+4KaHIOCmleCmsOCnh+CmqOCmv+ClpDwvcD4KICAgICAgICAgIDxwPlFSIOCmleCni+CmoSDgpqbgp4fgppbgp4cg4KaP4KaW4Ka+4Kao4KeHIOCmj+CmuOCnhyDgpqXgpr7gppXgprLgp4cg4Ka44KaC4Ka24KeN4Kay4Ka/4Ka34KeN4KafIOCmleCmvuCmsOCmluCmvuCmqOCmvuCmsCDgppXgpr7gppvgp4cg4Kak4Ka+4Kam4KeH4KawIOCmqOCmpeCmv+CmuOCmuSDgpqrgp43gprDgpq7gpr7gpqPgpq/gp4vgppfgp43gpq8g4Kak4Kal4KeN4KavIOCmuOCmsOCmvuCmuOCmsOCmvyDgpprgpr7gpqjgpaQ8L3A+CiAgICAgICAgICA8YSBjbGFzc05hbWU9ImRsLWJ0biBkbC1idG4tcCIgaHJlZj0iL2JuL2NoZWNrIj7gpqHgp4fgpp/gpr4g4Kaa4KeH4KaVIOCmpuCnh+CmluCngeCmqDwvYT4KICAgICAgICAgIDxhIGNsYXNzTmFtZT0iZGwtYnRuIGRsLWJ0bi1zIiBocmVmPSIvYm4vcnVsZXMiPuCmqOCmv+Cmr+CmvOCmriDgppMg4Ka44KeN4Kaf4KeN4Kav4Ka+4Kao4KeN4Kah4Ka+4Kaw4KeN4KahPC9hPgogICAgICAgIDwvc2VjdGlvbj4KCiAgICAgICAgPHNlY3Rpb24gbGFuZz0iZW4iPgogICAgICAgICAgPGgxPlRoaXMgcGFnZSBoYXMgYmVlbiByZXRpcmVkPC9oMT4KICAgICAgICAgIDxwPkVhcmxpZXIgdmVyc2lvbnMgb2YgRFBQIEF0bGFzIHNob3dlZCBzZWxmLXJlcG9ydGVkIGFzc2Vzc21lbnQgcmVzdWx0cyBpbiBhIHBhc3Nwb3J0LXN0eWxlIHBhZ2UuIERQUCBBdGxhcyBkb2VzIG5vdCBpc3N1ZSBEaWdpdGFsIFByb2R1Y3QgUGFzc3BvcnRzLCBjZXJ0aWZpY2F0ZXMgb3IgYXVkaXRzLCBhbmQgbm90aGluZyBvbiB0aG9zZSBwYWdlcyB3YXMgdmVyaWZpZWQgYnkgYW55b25lLjwvcD4KICAgICAgICAgIDxwPklmIGEgUVIgY29kZSBzZW50IHlvdSBoZXJlLCBhc2sgdGhlIGZhY3RvcnkgZGlyZWN0bHkgZm9yIGRhdGEgaXQgY2FuIGJhY2sgdXAgd2l0aCBkb2N1bWVudHMuPC9wPgogICAgICAgICAgPGEgY2xhc3NOYW1lPSJkbC1idG4gZGwtYnRuLXAiIGhyZWY9Ii9lbi9jaGVjayI+U2VlIHRoZSBEYXRhIENoZWNrPC9hPgogICAgICAgICAgPGEgY2xhc3NOYW1lPSJkbC1idG4gZGwtYnRuLXMiIGhyZWY9Ii9lbi9ydWxlcyI+UnVsZXMgYW5kIHN0YW5kYXJkczwvYT4KICAgICAgICA8L3NlY3Rpb24+CiAgICAgIDwvbWFpbj4KICAgIDwvZGl2PgogICk7Cn0K", "base64").toString("utf8"), "utf8");
console.log("written: " + DPP);

// 2. old report page: no QR to the retired page, no passport block, clear banner on top
let r = fs.readFileSync(REPORT, "utf8");
const q = r.match(/setQrUrl\("https:\/\/api\.qrserver[^;]*;/);
if (q) { r = r.replace(q[0], 'setQrUrl("");'); console.log("1x report: QR link removed"); } else { console.log("0x ?? report: QR line not found"); problems++; }
const i1 = r.indexOf("{/* DPP PASSPORT LINK */}"), i2 = r.indexOf("{/* ACTION BUTTONS */}");
if (i1 > 0 && i2 > i1) { r = r.slice(0, i1) + r.slice(i2); console.log("1x report: passport link block removed"); } else { console.log("0x ?? report: passport block not found"); problems++; }
fs.writeFileSync(REPORT, r, "utf8");
const BANNER = (w) => '<div role="note" style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",color:"#92400e",fontSize:"0.85rem",lineHeight:1.6,maxWidth:"' + w + '",marginLeft:"auto",marginRight:"auto"}}>{isBn?"পুরোনো স্কোরসহ রিপোর্ট। এটি কারখানার নিজের দেওয়া তথ্য থেকে তৈরি। এটি সনদ, পাসপোর্ট বা অডিট নয়, এবং কেউ এটি যাচাই করেনি। বর্তমান পদ্ধতি দেখুন: ডেটা চেক।":"Old scored report. Built from the factory’s own answers. It is not a certificate, passport or audit, and nobody has verified it. See the current approach: the Data Check."} <a href={"/"+loc+"/check"} style={{color:"#0f766e",fontWeight:600}}>{isBn?"ডেটা চেক":"Data Check"}</a></div>';
edit(REPORT, [['<div style={{maxWidth:"860px",margin:"0 auto"}}>', '<div style={{maxWidth:"860px",margin:"0 auto"}}>\n        ' + BANNER("860px")]]);
edit(DASH, [['<div style={{maxWidth:"960px",margin:"0 auto"}}>', '<div style={{maxWidth:"960px",margin:"0 auto"}}>\n        ' + BANNER("960px")]]);

// 3. old lookup page wording
edit(VERIFY, [
  ['{isBn?"রিপোর্ট খুঁজুন":"Report Lookup"}', '{isBn?"পুরোনো রিপোর্ট খুঁজুন":"Old Report Lookup"}'],
  ['{isBn?"একটি কারখানার DPP Atlas স্ট্যাটাস যাচাই করুন।":"Verify a factory\'s DPP compliance status using their Report ID."}', '{isBn?"রিপোর্ট ID দিয়ে একটি পুরোনো, স্ব-রিপোর্টকৃত রিপোর্ট খুঁজুন। এটি যাচাই বা সনদ নয়।":"Find an old self-reported report by its Report ID. This is not a verification or a certificate."}'],
]);

// 4. hide Log in from the main menu, keep it in the footer
edit(LAND, [
  ['<a className="dl-hide" href={"/" + loc + "/login"}>{t.nav.login}</a>\n', ''],
  ['<a href={"/" + loc + "/assess"}>{t.scored}</a>', '<a href={"/" + loc + "/assess"}>{t.scored}</a>\n            <a href={"/" + loc + "/login"}>{t.nav.login}</a>'],
]);
edit(CHROME, [
  ['<a className="dl-hide" href={"/" + loc + "/login"}>{t.login}</a>\n', ''],
  ['<a href={"/" + loc + "/assess"}>{t.scored}</a>', '<a href={"/" + loc + "/assess"}>{t.scored}</a>\n          <a href={"/" + loc + "/login"}>{t.login}</a>'],
]);

// 5. sitemap: only pages that match the current approach
fs.writeFileSync(SITEMAP, `import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dpp-atlas.vercel.app";
  const now = new Date();
  return [
    { url: base + "/en", lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: base + "/bn", lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: base + "/en/check", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/bn/check", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/en/rules", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/bn/rules", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
`, "utf8");
console.log("written: app/sitemap.ts");

// 6. keep old pages out of search results
const NOINDEX = 'import type { Metadata } from "next";\n\nexport const metadata: Metadata = { robots: { index: false, follow: false } };\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <>{children}</>;\n}\n';
for (const d of [["assess"], ["enroll"], ["login"], ["dashboard"], ["verify"], ["report", "[id]"]]) {
  const f = P("app", "[locale]", ...d, "layout.tsx");
  if (fs.existsSync(f)) { console.log("skipped (layout exists): " + f); continue; }
  fs.writeFileSync(f, NOINDEX, "utf8"); console.log("written: " + f);
}

if (problems) console.log("\n" + problems + " item(s) did not match. Do NOT push. Send me this output.");
else console.log("\nDone. Next: npm run build, then git add . / git commit -m \"Retire passport pages, relabel old pages\" / git push (one at a time).");
