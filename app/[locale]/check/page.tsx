"use client";
import { useEffect, useState } from "react";
import { FIELDS } from "./fields";
import type { Field } from "./fields";
import { BASE_CSS, Header, Footer } from "../_ui/chrome";

type Mark = { status: string; name: string; note: string };
type Saved = { product: string; marks: Record<number, Mark> };

const KEY = "dpp_check_v1";
const STATUS = [
  { v: "have", en: "Have it", bn: "আছে" },
  { v: "partial", en: "Partly have", bn: "আংশিক আছে" },
  { v: "missing", en: "Missing", bn: "নেই" },
  { v: "nobody", en: "Nobody owns it", bn: "কেউ দায়িত্বে নেই" },
  { v: "brand", en: "Only the brand/buyer has it", bn: "শুধু ব্র্যান্ড/ক্রেতার কাছে" },
  { v: "supplier", en: "A supplier holds it (fabric, trims, chemicals)", bn: "সরবরাহকারীর কাছে (কাপড়, ট্রিমস, কেমিক্যাল)" },
];

const CAT_BN: Record<string, string> = {
  "Identification": "পরিচয়",
  "Producer": "উৎপাদক",
  "Material": "উপাদান",
  "Mechanical": "যান্ত্রিক",
  "Chemical": "রাসায়নিক",
  "Circularity": "সার্কুলারিটি ও পুনর্ব্যবহার",
  "Other EU law": "অন্যান্য ইইউ আইন",
  "Footprint": "ফুটপ্রিন্ট",
  "Instructions": "নির্দেশনা",
  "Beyond DPP data (buyer / other rules)": "DPP ডেটার বাইরে (ক্রেতা / অন্য নিয়ম)",
  "Data governance and buyer readiness": "ডেটা ব্যবস্থাপনা ও ক্রেতার জন্য প্রস্তুতি",
};
const GRAN_BN: Record<string, string> = {
  "Batch": "ব্যাচ", "Model": "মডেল", "Company": "কোম্পানি", "Item (voluntary)": "আইটেম (ঐচ্ছিক)",
  "Batch / Model": "ব্যাচ / মডেল", "Company / supply chain": "কোম্পানি / সাপ্লাই চেইন",
};
const READY_BN: Record<string, string> = {
  "Very high": "অতি উচ্চ", "High": "উচ্চ", "High / Medium": "উচ্চ / মাঝারি", "Medium": "মাঝারি",
  "Medium/low": "মাঝারি / নিম্ন", "Medium (new)": "মাঝারি (নতুন)", "Medium (definitions differ)": "মাঝারি (সংজ্ঞা ভিন্ন)",
  "Low": "নিম্ন", "Very low": "অতি নিম্ন", "Not assessed in JRC draft": "JRC খসড়ায় মূল্যায়ন নেই",
  "Under consideration in the Textile Labelling revision": "টেক্সটাইল লেবেলিং সংশোধনে বিবেচনাধীন",
};

const isNobodyOwner = (f: Field) => f.ownerEn.toUpperCase().startsWith("NOBODY");
const isBrandOwner = (f: Field) => f.ownerEn.startsWith("Brand");

const CSS = `
.ck-sum{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}
.ck-pill{padding:4px 12px;border-radius:99px;font-weight:600;font-size:.85rem;border:1px solid}
.ck-p-nobody{color:#b91c1c;background:#fef2f2;border-color:#fecaca}
.ck-p-missing{color:#92400e;background:#fffbeb;border-color:#fde68a}
.ck-p-partial{color:#9a3412;background:#fff7ed;border-color:#fed7aa}
.ck-p-brand{color:#1d4ed8;background:#eff6ff;border-color:#bfdbfe}.ck-p-supplier{color:#6d28d9;background:#f5f3ff;border-color:#ddd6fe}
.ck-p-have{color:#15803d;background:#f0fdf4;border-color:#bbf7d0}
.ck-p-unset{color:#475569;background:#f1f5f9;border-color:#e2e8f0}
.ck-in{padding:10px 12px;border-radius:10px;border:1px solid #94a3b8;font-size:.95rem;font-family:inherit;background:#fff;color:#0f172a;min-width:0}
.ck-prod{width:100%}
.ck-bar{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 22px;align-items:center}
.ck-tabs{display:inline-flex;border:2px solid #0f766e;border-radius:10px;overflow:hidden}
.ck-tabs button{border:0;background:#fff;color:#0f766e;padding:9px 16px;font-weight:600;font-size:.95rem;cursor:pointer;font-family:inherit}
.ck-tabs button[aria-pressed="true"]{background:#0f766e;color:#fff}
.ck-cat{margin:0 0 26px}
.ck-cat h2{color:#0f766e;border-bottom:2px solid #e2e8f0;padding-bottom:6px}
.ck-card{border:1px solid #e2e8f0;border-left-width:4px;border-radius:12px;padding:14px 16px;margin-bottom:12px;background:#fff}
.ck-s-nobody{border-left-color:#b91c1c}.ck-s-missing{border-left-color:#d97706}.ck-s-partial{border-left-color:#ea580c}.ck-s-brand{border-left-color:#1d4ed8}.ck-s-supplier{border-left-color:#6d28d9}.ck-s-have{border-left-color:#15803d}
.ck-t{font-weight:600;margin-bottom:6px}
.ck-rule{font-size:.88rem;color:#0f766e;margin-bottom:4px}
.ck-meta{font-size:.82rem;color:#64748b;margin-bottom:8px}
.ck-who{font-size:.9rem;color:#334155;margin-bottom:10px}
.ck-fields{display:flex;gap:8px;flex-wrap:wrap}
.ck-fields select{flex:0 1 230px}
.ck-fields input.n{flex:1 1 160px}
.ck-fields input.t{flex:2 1 220px}
.ck-grp{border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin-bottom:14px}
.ck-grp h2{margin-bottom:6px}
.ck-grp h2 span{color:#64748b;font-weight:500}
.ck-it{border-top:1px solid #f1f5f9;padding:10px 0;font-size:.95rem}
.ck-it:first-of-type{border-top:0}
.ck-act{color:#334155}
.ck-conf{color:#15803d;font-size:.88rem}
.ck-ref{color:#64748b;font-size:.82rem}
.ck-note{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin-top:14px;font-size:.92rem;color:#334155}
.ck-empty{border:1px dashed #94a3b8;border-radius:12px;padding:20px;color:#475569}
`;

export default function CheckPage({ params }: { params: { locale: string } }) {
  const loc: "en" | "bn" = params.locale === "bn" ? "bn" : "en";
  const isBn = loc === "bn";
  const [product, setProduct] = useState("");
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const [view, setView] = useState<"check" | "actions">("check");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        setProduct(s.product || "");
        setMarks(s.marks || {});
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify({ product, marks })); } catch { /* ignore */ }
  }, [loaded, product, marks]);

  function setMark(n: number, patch: Partial<Mark>) {
    setMarks((prev) => {
      const cur: Mark = prev[n] || { status: "", name: "", note: "" };
      return { ...prev, [n]: { ...cur, ...patch } };
    });
  }
  function clearAll() {
    if (typeof window !== "undefined" && !window.confirm(isBn ? "সব তথ্য মুছে ফেলবেন?" : "Clear everything you entered?")) return;
    setProduct(""); setMarks({});
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  }

  const st = (n: number) => marks[n]?.status || "";
  const count = (s: string) => FIELDS.filter((f) => st(f.n) === s).length;
  const unset = FIELDS.filter((f) => !st(f.n)).length;

  const catLabel = (c: string) => (isBn ? CAT_BN[c] || c : c);
  const ownerLabel = (f: Field) => {
    if (isNobodyOwner(f)) return isBn ? "কোনো দায়িত্বশীল নেই (সম্ভবত)" : "No clear owner (likely)";
    return isBn ? f.ownerBn : f.ownerEn;
  };
  const outLabel = (f: Field) => (isBn ? f.outBn : f.outEn);

  function action(f: Field): string {
    const owner = ownerLabel(f);
    const out = outLabel(f);
    const s = st(f.n);
    if (s === "have") return isBn ? "কপি সংগ্রহ করে পণ্যের ফাইলে রাখুন" : "Get a copy and keep it in the product file";
    if (s === "partial") return (isBn ? "ফাঁক পূরণ করুন: " : "Close the gap with: ") + owner + (isBn ? " · বাইরে ফোন: " : " · Outside call: ") + out;
    if (s === "missing") return (isBn ? "কে তৈরি করতে পারে খুঁজুন · বাইরে ফোন: " : "Find who can create it · Outside call: ") + out;
    if (s === "nobody") return (isBn ? "মূল ফলাফল: এই সপ্তাহে একজন দায়িত্বশীল ঠিক করুন · বাইরে ফোন: " : "FINDING: assign an owner this week · Outside call: ") + out;
    if (s === "brand") return (isBn ? "ব্র্যান্ড/ক্রেতার কাছ থেকে চান: " : "Request from the brand/buyer: ") + out;
    if (s === "supplier") return isBn ? "সরবরাহকারীর কাছ থেকে লিখিতভাবে চান। সরবরাহকারীর নাম ও নথির নাম নোটে লিখে রাখুন।" : "Request it from the supplier in writing. Note the supplier’s name and the document in the Note box.";
    if (isNobodyOwner(f)) return isBn ? "সম্ভবত কেউ দায়িত্বে নেই। খোঁজ নিন: কে এটি রাখে? তারপর এখানে চিহ্নিত করুন।" : "Probably nobody owns this. Ask around: who keeps it? Then mark it here.";
    if (isBrandOwner(f)) return (isBn ? "ব্র্যান্ড/ক্রেতার কাছে চান: " : "Ask the brand/buyer: ") + out;
    return (isBn ? "জিজ্ঞেস করুন " : "Ask ") + owner + (isBn ? ": তথ্যটি আছে কি?" : ": does it exist?");
  }

  function exportCsv() {
    const esc = (v: string) => '"' + v.replace(/"/g, '""') + '"';
    const head = ["#", "Category", "Data point", "Status", "Owner confirmed", "Notes", "Rule / standard", "Next action"];
    const lines = [head.map(esc).join(",")];
    FIELDS.forEach((f) => {
      const m = marks[f.n] || { status: "", name: "", note: "" };
      const label = STATUS.find((x) => x.v === m.status)?.en || "";
      lines.push([String(f.n), f.cat, f.en, label, m.name, m.note, f.rule, action(f)].map(esc).join(","));
    });
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dpp_data_check.csv";
    a.click();
  }

  const cats: string[] = [];
  FIELDS.forEach((f) => { if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });

  const owners: string[] = [];
  FIELDS.filter(isNobodyOwner).forEach((f) => { const o = ownerLabel(f); if (owners.indexOf(o) < 0) owners.push(o); });
  FIELDS.forEach((f) => { const o = ownerLabel(f); if (owners.indexOf(o) < 0) owners.push(o); });
  const order = ["nobody", "missing", "partial", "brand", "supplier", "", "have"];
  const rank = (n: number) => order.indexOf(st(n));

  const groups = owners
    .map((o) => ({ o, items: FIELDS.filter((f) => ownerLabel(f) === o && st(f.n) !== "have").sort((a, b) => rank(a.n) - rank(b.n)) }))
    .filter((g) => g.items.length > 0);

  const T = isBn
    ? {
        h1: "DPP ডেটা চেক: একটি পণ্য",
        lead: "একটি চলমান পণ্য বেছে নিন। প্রতিটি ডেটা পয়েন্টের জন্য দেখুন: তথ্যটি কি আছে, কার কাছে আছে, বাইরে কাকে ফোন করতে হবে। স্কোর নেই। উদ্দেশ্য: দায়িত্ব অনুযায়ী একটি কাজের তালিকা।",
        warn: "বেশিরভাগ ডেটা পয়েন্ট ও প্রস্তুতির মাত্রা ইইউ JRC খসড়া থেকে; “DPP ডেটার বাইরে” অংশ অন্য নিয়ম থেকে। ‘সম্ভাব্য দায়িত্বশীল’ ও ‘বাইরের ফোন’ আমাদের অনুমান। খসড়া এখনও আইন নয়। আইনি পরামর্শ নয়।",
        rules: "নিয়ম ও স্ট্যান্ডার্ড",
        prodPh: "পণ্য / স্টাইল নম্বর (একটি)",
        prodLabel: "পণ্য বা স্টাইল নম্বর",
        pills: { nobody: "কেউ দায়িত্বে নেই", missing: "নেই", partial: "আংশিক", brand: "ব্র্যান্ডের কাছে", supplier: "সরবরাহকারীর কাছে", have: "আছে", unset: "বাকি" },
        tabCheck: "তথ্যের তালিকা",
        tabAct: "দায়িত্ব অনুযায়ী কাজের তালিকা",
        csv: "CSV ডাউনলোড", print: "প্রিন্ট", clear: "মুছুন",
        ruleL: "নিয়ম/স্ট্যান্ডার্ড: ", ready: "প্রস্তুতি: ",
        likely: "সম্ভাব্য দায়িত্বশীল (অনুমান): ", outside: "বাইরে ফোন (অনুমান): ",
        mark: "— চিহ্নিত করুন —", name: "আসল দায়িত্বশীলের নাম", note: "নোট (কোথায় রাখা: কাগজ/এক্সেল/ERP)",
        statusL: "অবস্থা", nameL: "দায়িত্বশীলের নাম", noteL: "নোট",
        confirmed: "আসল মালিক: ",
        empty: "সব তথ্য ‘আছে’ চিহ্নিত। প্রতিটির কপি পণ্যের ফাইলে রাখুন।",
        beyondH: "ডেটা পয়েন্টের বাইরেও ক্রেতা জিজ্ঞেস করতে পারেন: ",
        beyond: "জোরপূর্বক শ্রম নিষেধাজ্ঞা (ইইউ 2024/3015, ১৪ ডিসেম্বর ২০২৭ থেকে) এবং টেক্সটাইল উৎপাদক দায়িত্ব (নির্দেশনা (ইইউ) 2025/1892)। আপনার ক্রেতার কাছে নিশ্চিত করুন।",
        saved: "আপনার উত্তর শুধু এই ব্রাউজারে সংরক্ষিত থাকে।",
      }
    : {
        h1: "DPP data check: one product",
        lead: "Pick one current product. For each data point, mark whether it exists, who holds it and who you would have to call outside. There is no score. The goal is an action list grouped by owner.",
        warn: "Most data points and readiness come from the EU JRC draft, which is not law. The “Beyond DPP data” group comes from other rules (see Rules and standards). “Likely holder” and “outside call” are our assumptions. Not legal advice.",
        rules: "Rules and standards",
        prodPh: "Product / style number (one)",
        prodLabel: "Product or style number",
        pills: { nobody: "Nobody owns", missing: "Missing", partial: "Partial", brand: "Brand only", supplier: "Supplier", have: "Have", unset: "Not marked" },
        tabCheck: "Data points",
        tabAct: "Action list by owner",
        csv: "Download CSV", print: "Print", clear: "Clear",
        ruleL: "Rule / standard: ", ready: "readiness: ",
        likely: "Likely holder (assumed): ", outside: "Outside call (assumed): ",
        mark: "— mark —", name: "Who really holds it (name)", note: "Note (where kept: paper / Excel / ERP)",
        statusL: "Status", nameL: "Name of the person who holds it", noteL: "Note",
        confirmed: "Confirmed owner: ",
        empty: "Every data point is marked ‘Have it’. Keep a copy of each in the product file.",
        beyondH: "Buyers may also ask beyond these data points: ",
        beyond: "forced-labour due diligence (Regulation (EU) 2024/3015, from 14 Dec 2027) and textile producer responsibility (Directive (EU) 2025/1892). Confirm with your buyer.",
        saved: "Your entries are saved only in this browser.",
      };

  return (
    <div className="dl" lang={loc}>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + CSS }} />
      <Header loc={loc} path="/check" current="check" />
      <main id="main" className="dl-main">
        <div className="dl-wrap dl-narrow">
          <h1>{T.h1}</h1>
          <p className="dl-lead">{T.lead}</p>
          <p className="dl-warn">{T.warn} <a href={"/" + loc + "/rules"}>{T.rules}</a></p>

          <label htmlFor="prod" className="dl-noprint" style={{ position: "absolute", left: -9999 }}>{T.prodLabel}</label>
          <input id="prod" type="text" className="ck-in ck-prod" value={product} onChange={(e) => setProduct(e.target.value)} placeholder={T.prodPh} />

          <div className="ck-sum" aria-label="Summary">
            <span className="ck-pill ck-p-nobody">{T.pills.nobody}: {count("nobody")}</span>
            <span className="ck-pill ck-p-missing">{T.pills.missing}: {count("missing")}</span>
            <span className="ck-pill ck-p-partial">{T.pills.partial}: {count("partial")}</span>
            <span className="ck-pill ck-p-brand">{T.pills.brand}: {count("brand")}</span>
            <span className="ck-pill ck-p-supplier">{T.pills.supplier}: {count("supplier")}</span>
            <span className="ck-pill ck-p-have">{T.pills.have}: {count("have")}</span>
            <span className="ck-pill ck-p-unset">{T.pills.unset}: {unset}</span>
          </div>

          <div className="ck-bar dl-noprint">
            <div className="ck-tabs" role="group" aria-label="View">
              <button type="button" aria-pressed={view === "check"} onClick={() => setView("check")}>{T.tabCheck}</button>
              <button type="button" aria-pressed={view === "actions"} onClick={() => setView("actions")}>{T.tabAct}</button>
            </div>
            <button type="button" className="dl-btn dl-btn-s" onClick={exportCsv}>{T.csv}</button>
            <button type="button" className="dl-btn dl-btn-s" onClick={() => window.print()}>{T.print}</button>
            <button type="button" className="dl-btn dl-btn-d" onClick={clearAll}>{T.clear}</button>
          </div>

          {view === "check" && cats.map((c) => (
            <section key={c} className="ck-cat">
              <h2>{catLabel(c)}</h2>
              {FIELDS.filter((f) => f.cat === c).map((f) => {
                const m = marks[f.n] || { status: "", name: "", note: "" };
                const title = f.n + ". " + (isBn ? f.bn : f.en);
                return (
                  <div key={f.n} className={"ck-card" + (m.status ? " ck-s-" + m.status : "")}>
                    <div className="ck-t">{title}</div>
                    <div className="ck-rule">{T.ruleL}{f.rule}</div>
                    <div className="ck-meta">
                      {/^T[0-9]/.test(f.ref) ? "JRC " + f.ref : f.ref} · {isBn ? GRAN_BN[f.gran] || f.gran : f.gran} · {T.ready}{isBn ? READY_BN[f.ready] || f.ready : f.ready}
                    </div>
                    <div className="ck-who">
                      {T.likely}<strong>{ownerLabel(f)}</strong>{" · "}{T.outside}<strong>{outLabel(f)}</strong>
                    </div>
                    <div className="ck-fields">
                      <select className="ck-in" aria-label={T.statusL + ": " + title} value={m.status} onChange={(e) => setMark(f.n, { status: e.target.value })}>
                        <option value="">{T.mark}</option>
                        {STATUS.map((s) => <option key={s.v} value={s.v}>{isBn ? s.bn : s.en}</option>)}
                      </select>
                      <input type="text" className="ck-in n" aria-label={T.nameL + ": " + title} value={m.name} onChange={(e) => setMark(f.n, { name: e.target.value })} placeholder={T.name} />
                      <input type="text" className="ck-in t" aria-label={T.noteL + ": " + title} value={m.note} onChange={(e) => setMark(f.n, { note: e.target.value })} placeholder={T.note} />
                    </div>
                  </div>
                );
              })}
            </section>
          ))}

          {view === "actions" && (groups.length === 0 ? <p className="ck-empty">{T.empty}</p> : groups.map((g) => (
            <section key={g.o} className="ck-grp">
              <h2>{g.o} <span>({g.items.length})</span></h2>
              {g.items.map((f) => (
                <div key={f.n} className="ck-it">
                  <div style={{ fontWeight: 600 }}>{f.n}. {isBn ? f.bn : f.en}{st(f.n) === "nobody" ? " ⚠" : ""}</div>
                  <div className="ck-act">{action(f)}</div>
                  {marks[f.n]?.name ? <div className="ck-conf">{T.confirmed}{marks[f.n].name}</div> : null}
                  <div className="ck-ref">{f.rule}</div>
                </div>
              ))}
            </section>
          )))}

          <section className="ck-note">
            <strong>{T.beyondH}</strong>{T.beyond}
          </section>
          <p className="ck-ref" style={{ marginTop: 12 }}>{T.saved}</p>
        </div>
      </main>
      <Footer loc={loc} />
    </div>
  );
}
