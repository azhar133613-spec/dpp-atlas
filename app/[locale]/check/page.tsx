"use client";
import { useEffect, useState } from "react";
import { FIELDS } from "./fields";

type Mark = { status: string; name: string; note: string };
type Saved = { product: string; marks: Record<number, Mark> };

const KEY = "dpp_check_v1";
const STATUS = [
  { v: "have", en: "Have it", bn: "আছে" },
  { v: "partial", en: "Partly have", bn: "আংশিক আছে" },
  { v: "missing", en: "Missing", bn: "নেই" },
  { v: "nobody", en: "Nobody owns it", bn: "কেউ দায়িত্বে নেই" },
  { v: "brand", en: "Only the brand/buyer has it", bn: "শুধু ব্র্যান্ড/ক্রেতার কাছে" },
];

export default function CheckPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const [product, setProduct] = useState("");
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const [view, setView] = useState<"check" | "actions">("check");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        setProduct(s.product || "");
        setMarks(s.marks || {});
      }
    } catch { /* ignore */ }
  }, []);

  function persist(p: string, m: Record<number, Mark>) {
    try { localStorage.setItem(KEY, JSON.stringify({ product: p, marks: m })); } catch { /* ignore */ }
  }
  function setMark(n: number, patch: Partial<Mark>) {
    setMarks((prev) => {
      const cur: Mark = prev[n] || { status: "", name: "", note: "" };
      const next = { ...prev, [n]: { ...cur, ...patch } };
      persist(product, next);
      return next;
    });
  }
  function setProd(p: string) {
    setProduct(p);
    persist(p, marks);
  }
  function clearAll() {
    if (typeof window !== "undefined" && !window.confirm(isBn ? "সব তথ্য মুছে ফেলবেন?" : "Clear everything you entered?")) return;
    setProduct(""); setMarks({});
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  }

  const st = (n: number) => marks[n]?.status || "";
  const count = (s: string) => FIELDS.filter((f) => st(f.n) === s).length;
  const unset = FIELDS.filter((f) => !st(f.n)).length;

  function action(n: number): string {
    const f = FIELDS.find((x) => x.n === n);
    if (!f) return "";
    const owner = isBn ? f.ownerBn : f.ownerEn;
    const out = isBn ? f.outBn : f.outEn;
    const s = st(n);
    if (s === "have") return isBn ? "কপি সংগ্রহ করে পণ্যের ফাইলে রাখুন" : "Get a copy and keep it in the product file";
    if (s === "partial") return (isBn ? "ফাঁক পূরণ করুন: " : "Close the gap with: ") + owner + (isBn ? " · বাইরে ফোন: " : " · Outside call: ") + out;
    if (s === "missing") return (isBn ? "কে তৈরি করতে পারে খুঁজুন · বাইরে ফোন: " : "Find who can create it · Outside call: ") + out;
    if (s === "nobody") return (isBn ? "মূল ফলাফল: এই সপ্তাহে একজন দায়িত্বশীল ঠিক করুন · বাইরে ফোন: " : "FINDING: assign an owner this week · Outside call: ") + out;
    if (s === "brand") return (isBn ? "ব্র্যান্ড/ক্রেতার কাছ থেকে চান: " : "Request from the brand/buyer: ") + out;
    return (isBn ? "জিজ্ঞেস করুন: " : "Ask: ") + owner + (isBn ? " — তথ্যটি আছে কি?" : " — does it exist?");
  }

  function exportCsv() {
    const esc = (v: string) => '"' + v.replace(/"/g, '""') + '"';
    const head = ["#", "Category", "Data point", "Status", "Owner confirmed", "Notes", "Rule / standard", "Next action"];
    const lines = [head.map(esc).join(",")];
    FIELDS.forEach((f) => {
      const m = marks[f.n] || { status: "", name: "", note: "" };
      lines.push([String(f.n), f.cat, f.en, m.status, m.name, m.note, f.rule, action(f.n)].map(esc).join(","));
    });
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dpp_data_check.csv";
    a.click();
  }

  const wrap: React.CSSProperties = { minHeight: "100vh", background: "#fff", fontFamily: "system-ui,sans-serif", color: "#0f172a", padding: "24px 16px", maxWidth: "900px", margin: "0 auto" };
  const pill = (bg: string, color: string): React.CSSProperties => ({ background: bg, color, padding: "4px 10px", borderRadius: "99px", fontWeight: 700, fontSize: "0.78rem" });
  const box: React.CSSProperties = { padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" };

  const cats: string[] = [];
  FIELDS.forEach((f) => { if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });

  const owners: string[] = [];
  FIELDS.forEach((f) => { const o = isBn ? f.ownerBn : f.ownerEn; if (owners.indexOf(o) < 0) owners.push(o); });
  const order = ["nobody", "missing", "partial", "brand", "", "have"];
  const rank = (n: number) => order.indexOf(st(n));

  return (
    <main style={wrap}>
      <a href={"/" + params.locale} style={{ color: "#0f766e", fontSize: "0.85rem", textDecoration: "none" }}>← {isBn ? "হোম" : "Home"}</a>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "12px 0 6px" }}>{isBn ? "DPP ডেটা চেক: একটি পণ্য" : "DPP data check: one product"}</h1>
      <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "6px" }}>
        {isBn
          ? "একটি চলমান পণ্য বেছে নিন। প্রতিটি ডেটা পয়েন্টের জন্য দেখুন: তথ্যটি কি আছে, কার কাছে আছে, বাইরে কাকে ফোন করতে হবে। স্কোর নেই। উদ্দেশ্য সোমবারের কাজের তালিকা।"
          : "Pick one current product. For each data point, mark whether it exists, who holds it and who you would have to call outside. There is no score. The goal is a list you can work through on Monday."}
      </p>
      <p style={{ color: "#b45309", fontSize: "0.8rem", marginBottom: "14px" }}>
        {isBn
          ? "বেশিরভাগ ডেটা পয়েন্ট ও প্রস্তুতির মাত্রা ইইউ JRC খসড়া থেকে; “DPP ডেটার বাইরে” অংশ অন্য নিয়ম থেকে। ‘সম্ভাব্য দায়িত্বশীল’ ও ‘বাইরের ফোন’ আমাদের অনুমান। খসড়া এখনও আইন নয়। আইনি পরামর্শ নয়।"
          : "Most data points and readiness come from the EU JRC draft, which is not law. The “Beyond DPP data” group comes from other rules (see Rules and standards). “Likely holder” and “outside call” are our assumptions. Not legal advice."}{" "}
        <a href={"/" + params.locale + "/rules"} style={{ color: "#0d9488" }}>{isBn ? "নিয়ম ও স্ট্যান্ডার্ড" : "Rules and standards"}</a>
      </p>

      <input type="text" value={product} onChange={(e) => setProd(e.target.value)} placeholder={isBn ? "পণ্য / স্টাইল নম্বর (একটি)" : "Product / style number (one)"} style={{ ...box, width: "100%", boxSizing: "border-box", marginBottom: "14px" }} />

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        <span style={pill("#fee2e2", "#991b1b")}>{isBn ? "কেউ দায়িত্বে নেই: " : "Nobody owns: "}{count("nobody")}</span>
        <span style={pill("#fef9c3", "#854d0e")}>{isBn ? "নেই: " : "Missing: "}{count("missing")}</span>
        <span style={pill("#ffedd5", "#9a3412")}>{isBn ? "আংশিক: " : "Partial: "}{count("partial")}</span>
        <span style={pill("#e0e7ff", "#3730a3")}>{isBn ? "ব্র্যান্ডের কাছে: " : "Brand only: "}{count("brand")}</span>
        <span style={pill("#dcfce7", "#166534")}>{isBn ? "আছে: " : "Have: "}{count("have")}</span>
        <span style={pill("#f1f5f9", "#475569")}>{isBn ? "বাকি: " : "Not marked: "}{unset}</span>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
        <button onClick={() => setView("check")} style={{ ...box, background: view === "check" ? "#0d9488" : "#fff", color: view === "check" ? "#fff" : "#334155", cursor: "pointer", fontWeight: 600 }}>{isBn ? "চেক করুন" : "Check"}</button>
        <button onClick={() => setView("actions")} style={{ ...box, background: view === "actions" ? "#0d9488" : "#fff", color: view === "actions" ? "#fff" : "#334155", cursor: "pointer", fontWeight: 600 }}>{isBn ? "সোমবারের তালিকা" : "Monday list"}</button>
        <button onClick={exportCsv} style={{ ...box, background: "#fff", cursor: "pointer" }}>{isBn ? "CSV ডাউনলোড" : "Download CSV"}</button>
        <button onClick={() => window.print()} style={{ ...box, background: "#fff", cursor: "pointer" }}>{isBn ? "প্রিন্ট" : "Print"}</button>
        <button onClick={clearAll} style={{ ...box, background: "#fff", color: "#991b1b", cursor: "pointer" }}>{isBn ? "মুছুন" : "Clear"}</button>
      </div>

      {view === "check" && cats.map((c) => (
        <section key={c} style={{ marginBottom: "18px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f766e", margin: "0 0 8px" }}>{c}</h2>
          {FIELDS.filter((f) => f.cat === c).map((f) => {
            const m = marks[f.n] || { status: "", name: "", note: "" };
            return (
              <div key={f.n} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px", marginBottom: "10px" }}>
                <div style={{ fontWeight: 600, fontSize: "0.92rem", marginBottom: "4px" }}>{f.n}. {isBn ? f.bn : f.en}</div>
                <div style={{ fontSize: "0.74rem", color: "#0f766e", marginBottom: "4px" }}>{isBn ? "নিয়ম/স্ট্যান্ডার্ড: " : "Rule / standard: "}{f.rule}</div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: "6px" }}>
                  {/^T[0-9]/.test(f.ref) ? "JRC " + f.ref : f.ref} · {f.gran} · {isBn ? "প্রস্তুতি: " : "readiness: "}{f.ready}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#334155", marginBottom: "8px" }}>
                  {isBn ? "সম্ভাব্য দায়িত্বশীল (অনুমান): " : "Likely holder (assumed): "}<strong>{isBn ? f.ownerBn : f.ownerEn}</strong>
                  {" · "}{isBn ? "বাইরে ফোন (অনুমান): " : "Outside call (assumed): "}<strong>{isBn ? f.outBn : f.outEn}</strong>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <select value={m.status} onChange={(e) => setMark(f.n, { status: e.target.value })} style={box}>
                    <option value="">{isBn ? "— চিহ্নিত করুন —" : "— mark —"}</option>
                    {STATUS.map((s) => <option key={s.v} value={s.v}>{isBn ? s.bn : s.en}</option>)}
                  </select>
                  <input type="text" value={m.name} onChange={(e) => setMark(f.n, { name: e.target.value })} placeholder={isBn ? "আসল দায়িত্বশীলের নাম" : "Who really holds it (name)"} style={{ ...box, flex: "1 1 150px" }} />
                  <input type="text" value={m.note} onChange={(e) => setMark(f.n, { note: e.target.value })} placeholder={isBn ? "নোট (কোথায় রাখা: কাগজ/এক্সেল/ERP)" : "Note (where kept: paper / Excel / ERP)"} style={{ ...box, flex: "2 1 200px" }} />
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {view === "actions" && owners.map((o) => {
        const items = FIELDS.filter((f) => (isBn ? f.ownerBn : f.ownerEn) === o && st(f.n) !== "have").sort((a, b) => rank(a.n) - rank(b.n));
        if (items.length === 0) return null;
        return (
          <section key={o} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "0 0 8px" }}>{o} <span style={{ color: "#94a3b8", fontWeight: 500 }}>({items.length})</span></h2>
            {items.map((f) => (
              <div key={f.n} style={{ borderTop: "1px solid #f1f5f9", padding: "8px 0", fontSize: "0.85rem" }}>
                <div style={{ fontWeight: 600 }}>{f.n}. {isBn ? f.bn : f.en}{st(f.n) === "nobody" ? " ⚠" : ""}</div>
                <div style={{ color: "#334155" }}>{action(f.n)}</div>
                {marks[f.n]?.name ? <div style={{ color: "#166534", fontSize: "0.78rem" }}>{isBn ? "আসল মালিক: " : "Confirmed owner: "}{marks[f.n].name}</div> : null}
                <div style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{f.rule}</div>
              </div>
            ))}
          </section>
        );
      })}

      <section style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px", marginTop: "10px", fontSize: "0.8rem", color: "#334155", lineHeight: 1.7 }}>
        <strong>{isBn ? "ডেটা পয়েন্টের বাইরেও ক্রেতা জিজ্ঞেস করতে পারেন: " : "Buyers may also ask beyond these data points: "}</strong>
        {isBn
          ? "জোরপূর্বক শ্রম নিষেধাজ্ঞা (ইইউ 2024/3015, ১৪ ডিসেম্বর ২০২৭ থেকে) এবং টেক্সটাইল উৎপাদক দায়িত্ব (নির্দেশনা (ইইউ) 2025/1892)। আপনার ক্রেতার কাছে নিশ্চিত করুন।"
          : "forced-labour due diligence (Regulation (EU) 2024/3015, from 14 Dec 2027) and textile producer responsibility (Directive (EU) 2025/1892). Confirm with your buyer."}
      </section>
      <p style={{ color: "#94a3b8", fontSize: "0.72rem", marginTop: "10px" }}>
        {isBn ? "আপনার উত্তর শুধু এই ব্রাউজারে সংরক্ষিত থাকে।" : "Your entries are saved only in this browser."}
      </p>
    </main>
  );
}
