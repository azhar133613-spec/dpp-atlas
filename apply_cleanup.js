// DPP Atlas: remove ALL old scored features and clutter. Run in the dpp-atlas folder:  node apply_cleanup.js
// Safety: it first tries to create a git tag "before-cleanup" so everything can be restored.
const fs = require("fs"), path = require("path"), cp = require("child_process");
const P = (...a) => path.join(...a);
const CHECK = P("app", "[locale]", "check", "page.tsx"), RULES = P("app", "[locale]", "rules", "page.tsx");
const LAND = P("app", "[locale]", "page.tsx"), CHROME = P("app", "[locale]", "_ui", "chrome.tsx");
for (const f of [CHECK, RULES, LAND, CHROME]) if (!fs.existsSync(f)) { console.log("STOP: not found: " + f + ". Run inside dpp-atlas."); process.exit(1); }
if (fs.existsSync("README.md") && fs.readFileSync("README.md", "utf8").includes("Not an official EU") && !fs.existsSync(P("app", "[locale]", "assess"))) { console.log("Already applied. Nothing to do."); process.exit(0); }
if (!fs.readFileSync(CHECK, "utf8").includes("ck-card") || !fs.readFileSync(RULES, "utf8").includes("ru-card")) {
  console.log("STOP: the new Data Check / Rules pages are not in place. Nothing changed."); process.exit(1);
}
try { cp.execSync("git tag before-cleanup", { stdio: "ignore" }); console.log("Safety tag created: before-cleanup (restore with: git checkout before-cleanup -- .)"); }
catch (e) { console.log("Note: safety tag not created (already exists or git not available). Git history still holds the old files."); }

// 1. delete old features
const DIRS = [
  P("app", "[locale]", "assess"), P("app", "[locale]", "enroll"), P("app", "[locale]", "login"), P("app", "[locale]", "dashboard"),
  P("app", "[locale]", "report"), P("app", "[locale]", "verify"), P("app", "dpp"), P("app", "api"), "lib", "types",
];
const FILES = [
  P("app", "[locale]", "page.tsx.bak2"), "schema.sql", "rules_page.tsx", "README.md.bak",
  "DEPLOYMENT_CHECKLIST.md", "MONETIZATION_STRATEGY.md", "LIVE_DEPLOYMENT_GUIDE.md",
  "add_beyond.js", "add_check.js", "add_rules.js", "align_and_govern.js", "assess.js", "auth-qr.js", "check-remaining-tasks.js",
  "clean2.js", "clean3.js", "clean4.js", "clean5.js", "clean6.js", "clean7.js", "clean8.js", "clean9.js", "clean_site.js",
  "context.txt", "context2.txt", "create-pages.js", "demote_assess.js", "diagnose-live-state.js", "factory-questions-fix.js",
  "fix-all.js", "fix2.js", "fix3.js", "fix4.js", "fixbuild.js", "fq.js", "gemini.js", "masterfix.js", "patch-assess-final.js",
  "patch-login.js", "patch-report.js", "pdf.js", "remaining.js", "scan.txt", "scan_bn.txt", "scan_misleading.js",
  "supabase-tasks.js", "task10.js", "upgrade.js", "voice.js", "voice2.js", "voice3.js", "write-assess.js",
  "apply_redesign.js", "apply_restyle.js", "apply_retire.js",
];
let removed = 0;
for (const d of DIRS) if (fs.existsSync(d)) { fs.rmSync(d, { recursive: true, force: true }); console.log("removed folder: " + d); removed++; }
for (const f of FILES) if (fs.existsSync(f)) { fs.rmSync(f, { force: true }); removed++; }
console.log("removed items: " + removed);

// 2. menus and footers: no links to removed pages
let problems = 0;
function dropLines(file, expected) {
  const lines = fs.readFileSync(file, "utf8").split("\n"); let n = 0;
  const out = lines.filter((l) => { const hit = /\/(verify|assess|login)"\}>\{t\.(nav\.)?(lookup|scored|login)\}<\/a>/.test(l) || /\{t\.earlier\}/.test(l); if (hit) n++; return !hit; });
  console.log(n + "x  removed old links in " + file.slice(-24) + " (expected " + expected + ")");
  if (n !== expected) problems++;
  fs.writeFileSync(file, out.join("\n"), "utf8");
}
dropLines(CHROME, 5); dropLines(LAND, 5);

// 3. rules page: use what the Commission itself says
function edit(file, pairs) {
  let s = fs.readFileSync(file, "utf8");
  for (const [a, b] of pairs) { const n = s.split(a).length - 1; console.log((n === 1 ? "1x " : n + "x ??") + " rules  " + a.slice(0, 55)); if (n === 1) s = s.replace(a, () => b); else problems++; }
  fs.writeFileSync(file, s, "utf8");
}
edit(RULES, [
  ["apparel is a named priority. No textile delegated act confirmed.", "apparel is a named priority. The Commission’s textile page gives Q4 2027 as the indicative adoption date for the textile delegated act; timelines may change."],
  ["JRC draft; Commission ESPR working plan page\"", "JRC draft; Commission ESPR working plan page; Commission textile and apparel DPP page\""],
  ["টেক্সটাইলের ডেলিগেটেড অ্যাক্ট নিশ্চিত হয়নি।", "কমিশনের টেক্সটাইল পাতায় টেক্সটাইলের ডেলিগেটেড অ্যাক্ট গ্রহণের ইঙ্গিতমূলক সময় ২০২৭ সালের চতুর্থ প্রান্তিক; সময়সূচি বদলাতে পারে।"],
  ["JRC খসড়া; কমিশনের ESPR কর্মপরিকল্পনা পাতা\"", "JRC খসড়া; কমিশনের ESPR কর্মপরিকল্পনা পাতা; কমিশনের টেক্সটাইল ও অ্যাপারেল DPP পাতা\""],
  ["Commission registry for passports, reported live from 20 July 2026. No registration duty for textiles yet: duties arise product group by product group through delegated acts (batteries first, from 18 Feb 2027). Operators are verified with eIDAS-based means.", "Commission registry for passports, launched on 20 July 2026. Economic operators must register each passport in it. It covers ESPR product groups including textiles, but no registration deadline applies to textiles yet: the first deadline is 18 February 2027, for certain large batteries."],
  ["Two secondary sources citing the Commission registry page and EUR-Lex; Commission pages not read here\", whatBn", "European Commission news item, 20 July 2026\", whatBn"],
  ["পাসপোর্টের জন্য কমিশনের রেজিস্ট্রি, ২০ জুলাই ২০২৬ থেকে চালু বলে জানা যায়। টেক্সটাইলের জন্য এখনও নিবন্ধনের বাধ্যবাধকতা নেই: ডেলিগেটেড অ্যাক্টের মাধ্যমে পণ্যগোষ্ঠী ধরে ধরে দায়িত্ব আসে (প্রথমে ব্যাটারি, ১৮ ফেব্রুয়ারি ২০২৭ থেকে)। অপারেটরদের eIDAS-ভিত্তিক পদ্ধতিতে যাচাই করা হয়।", "পাসপোর্টের জন্য কমিশনের রেজিস্ট্রি ২০ জুলাই ২০২৬ তারিখে চালু হয়েছে। অর্থনৈতিক অপারেটরদের প্রতিটি পাসপোর্ট এতে নিবন্ধন করতে হবে। এটি টেক্সটাইলসহ ESPR-এর পণ্যগোষ্ঠী কভার করে, তবে টেক্সটাইলের জন্য এখনও নিবন্ধনের সময়সীমা নেই: প্রথম সময়সীমা ১৮ ফেব্রুয়ারি ২০২৭, কিছু বড় ব্যাটারির জন্য।"],
  ["sourceBn: \"দুটি সেকেন্ডারি সূত্র, যারা কমিশনের রেজিস্ট্রি পাতা ও EUR-Lex উদ্ধৃত করেছে; কমিশনের পাতা এখানে পড়া হয়নি\", status: \"limited\"", "sourceBn: \"ইউরোপীয় কমিশনের সংবাদ, ২০ জুলাই ২০২৬\", status: \"checked\""],
  ["  { name: \"ESPR Article 13 central DPP registry;", "  { name: \"JRC study on DPP content for textile apparel (May 2026)\", type: \"Technical study (not law)\", typeBn: \"টেকনিক্যাল স্টাডি (আইন নয়)\", what: \"Technical study supporting the textile delegated act. The Commission says the binding textile requirements will be defined in the delegated act, not in the study. The study’s data list is a draft and may change.\", whatBn: \"টেক্সটাইল ডেলিগেটেড অ্যাক্টের জন্য সহায়ক টেকনিক্যাল স্টাডি। কমিশন বলছে বাধ্যতামূলক শর্ত ঠিক হবে ডেলিগেটেড অ্যাক্টে, স্টাডিতে নয়। স্টাডির ডেটা-তালিকা খসড়া এবং বদলাতে পারে।\", source: \"European Commission textile and apparel DPP page; publication date (13 May 2026) from a third-party summary\", sourceBn: \"ইউরোপীয় কমিশনের টেক্সটাইল ও অ্যাপারেল DPP পাতা; প্রকাশের তারিখ (১৩ মে ২০২৬) তৃতীয় পক্ষের সারাংশ থেকে\", status: \"checked\" },\n  { name: \"ESPR Article 13 central DPP registry;"],
]);

// 4. honest README
fs.writeFileSync("README.md", Buffer.from("IyBEUFAgQXRsYXMKCkEgZnJlZSwgQmFuZ2xhLWZpcnN0IGRhdGEgY2hlY2sgZm9yIHRleHRpbGUgYW5kIGdhcm1lbnQgZmFjdG9yaWVzIHByZXBhcmluZyBmb3IgRVUgRGlnaXRhbCBQcm9kdWN0IFBhc3Nwb3J0IChEUFApIGRhdGEgcmVxdWVzdHMuCgpMaXZlOiBodHRwczovL2RwcC1hdGxhcy52ZXJjZWwuYXBwCgojIyBXaGF0IGl0IGRvZXMKCkZvciBvbmUgcHJvZHVjdCwgeW91IG1hcmsgZWFjaCBEUFAgZGF0YSBwb2ludCBhczogaGF2ZSBpdCwgcGFydGx5IGhhdmUgaXQsIG1pc3NpbmcsIG5vYm9keSBvd25zIGl0LCBvciBvbmx5IHRoZSBicmFuZC9idXllciBoYXMgaXQuIFRoZSB0b29sIHRoZW4gYnVpbGRzIGFuIGFjdGlvbiBsaXN0IGdyb3VwZWQgYnkgbGlrZWx5IGhvbGRlciAoTWVyY2hhbmRpc2luZywgUUMsIENvbXBsaWFuY2UgYW5kIHNvIG9uKSwgd2hpY2ggeW91IGNhbiBkb3dubG9hZCBhcyBDU1Ygb3IgcHJpbnQuIEV2ZXJ5IGRhdGEgcG9pbnQgc2hvd3MgdGhlIHJ1bGUsIGRyYWZ0IG9yIHN0YW5kYXJkIGl0IGNvbWVzIGZyb20uIFRoZXJlIGlzIG5vIHNjb3JlLgoKQW5zd2VycyBzdGF5IGluIHlvdXIgYnJvd3NlciAobG9jYWxTdG9yYWdlKS4gVGhlcmUgYXJlIG5vIGFjY291bnRzIGFuZCBubyBzZXJ2ZXItc2lkZSBzdG9yYWdlLgoKIyMgV2hhdCBpdCBpcyBub3QKCi0gTm90IGEgY2VydGlmaWNhdGUsIHBhc3Nwb3J0LCBhdWRpdCBvciBsZWdhbCBhZHZpY2UuIE5vdGhpbmcgeW91IGVudGVyIGlzIHZlcmlmaWVkLgotIE5vdCBhbiBvZmZpY2lhbCBFVSwgSlJDLCBCR01FQSBvciBidXllciB0b29sLiBOb3QgYWZmaWxpYXRlZCB3aXRoIGFueSBvZiB0aGVtLgotIFRoZSB0ZXh0aWxlIGRhdGEgbGlzdCBjb21lcyBmcm9tIGEgSlJDIGRyYWZ0IHN0dWR5LiBUaGUgYmluZGluZyBydWxlcyB3aWxsIGNvbWUgZnJvbSB0aGUgQ29tbWlzc2lvbidzIHRleHRpbGUgZGVsZWdhdGVkIGFjdCwgd2hpY2ggdGhlIENvbW1pc3Npb24ncyB0ZXh0aWxlIHBhZ2UgZ2l2ZXMgYXMgUTQgMjAyNyAoaW5kaWNhdGl2ZSkuCi0gIkxpa2VseSBob2xkZXIiIGFuZCAib3V0c2lkZSBjYWxsIiBhcmUgYXNzdW1wdGlvbnMgdG8gYmUgY29uZmlybWVkIGluIGEgcmVhbCBmYWN0b3J5LgoKIyMgU291cmNlcwoKU2VlIHRoZSBSdWxlcyBhbmQgc3RhbmRhcmRzIHBhZ2UgaW4gdGhlIGFwcC4gRWFjaCBzb3VyY2UgaXMgdGFnZ2VkOiBzZWVuIGluIHNvdXJjZSwgbGltaXRlZCBjaGVjaywgb3Igbm90IHZlcmlmaWVkLgoKIyMgUnVuIGxvY2FsbHkKCmBgYApucG0gaW5zdGFsbApucG0gcnVuIGRldgpgYGAKClBhZ2VzOiBgL2JuYCBhbmQgYC9lbmAgKGxhbmRpbmcpLCBgL1tsb2NhbGVdL2NoZWNrYCAoRGF0YSBDaGVjayksIGAvW2xvY2FsZV0vcnVsZXNgIChydWxlcyBhbmQgc3RhbmRhcmRzKS4KCiMjIFN0YXR1cwoKU3R1ZGVudCBwcm9qZWN0LiBDb250ZW50IGxhc3QgcmV2aWV3ZWQgTm92ZW1iZXIgMjAyNi4gTm90IHlldCB0ZXN0ZWQgaW4gYSByZWFsIGZhY3RvcnkuCg==", "base64").toString("utf8"), "utf8");
console.log("written: README.md");

// 5. any leftover references to removed pages?
function walk(d, out = []) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = P(d, e.name); if (e.isDirectory()) walk(p, out); else if (/\.(tsx?|ts)$/.test(e.name)) out.push(p); } return out; }
let left = 0;
for (const f of walk("app")) { const s = fs.readFileSync(f, "utf8"); for (const m of s.matchAll(/["'`]\/?(?:["'` +]*\w*["'` +]*)?\/(assess|enroll|login|dashboard|report|verify|dpp)\b/g)) { console.log("  leftover reference in " + f + ": " + m[0]); left++; } }
console.log(left ? "\nCheck the leftover references above (send them to me)." : "No leftover references to removed pages.");
console.log(problems ? "\n" + problems + " item(s) did not match. Do NOT push. Send me this output." : "\nDone. Next: npm run build, then git add . / git commit -m \"Remove old scored features\" / git push (one at a time).");
