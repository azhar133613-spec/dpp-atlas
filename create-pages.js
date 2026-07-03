const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  const size = fs.statSync(filePath).size;
  console.log(`OK (${size} bytes): ${filePath}`);
}

// LOGIN PAGE
write('app/[locale]/login/page.tsx', `
"use client";
import { useState } from "react";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isErr, setIsErr] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const endpoint = mode === "signup"
        ? URL + "/auth/v1/signup"
        : URL + "/auth/v1/token?grant_type=password";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": KEY || "" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || "Error");
      if (mode === "signup") {
        setIsErr(false);
        setMsg("Check your email for a confirmation link!");
      } else {
        localStorage.setItem("dpp_session", JSON.stringify(data));
        window.location.href = "/" + params.locale + "/dashboard";
      }
    } catch (err: any) {
      setIsErr(true);
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: "100%", padding: "12px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "white", fontSize: "0.95rem", boxSizing: "border-box" as const };

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href={"/" + params.locale} style={{ color: "#14b8a6", fontSize: "1.25rem", fontWeight: 700, textDecoration: "none" }}>🌿 DPP Atlas</a>
          <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginTop: "16px" }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
        </div>
        <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", border: "1px solid #334155" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "#94a3b8", fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" style={inp} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ color: "#94a3b8", fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minimum 6 characters" style={inp} />
            </div>
            {msg && (
              <div style={{ padding: "12px", borderRadius: "10px", marginBottom: "20px", background: isErr ? "#ef444420" : "#22c55e20", border: "1px solid " + (isErr ? "#ef4444" : "#22c55e"), color: isErr ? "#fca5a5" : "#86efac", fontSize: "0.875rem" }}>
                {msg}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "#0d9488", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(""); }} style={{ background: "none", border: "none", color: "#14b8a6", cursor: "pointer", fontSize: "0.875rem" }}>
              {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <a href={"/" + params.locale} style={{ color: "#64748b", fontSize: "0.875rem", textDecoration: "none" }}>← Back to home</a>
        </div>
      </div>
    </main>
  );
}
`);

// ENROLL PAGE
write('app/[locale]/enroll/page.tsx', `
"use client";
import { useState } from "react";

export default function EnrollPage({ params }: { params: { locale: string } }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ factory_name: "", contact_name: "", email: "", country: "Bangladesh", tier_level: "tier1", address: "", workers: "", product_type: "" });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const factory = { ...form, id: Date.now().toString(), created_at: new Date().toISOString() };
    localStorage.setItem("dpp_factory", JSON.stringify(factory));
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
  };

  if (done) return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>✅</div>
        <h2 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, marginBottom: "12px" }}>Factory Registered!</h2>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>{form.factory_name} registered successfully.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={"/" + params.locale + "/assess"} style={{ background: "#0d9488", color: "white", textDecoration: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700 }}>Start Assessment</a>
          <a href={"/" + params.locale + "/dashboard"} style={{ border: "1px solid #334155", color: "#94a3b8", textDecoration: "none", padding: "14px 28px", borderRadius: "12px" }}>Go to Dashboard</a>
        </div>
      </div>
    </main>
  );

  const inp = { width: "100%", padding: "12px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "white", fontSize: "0.95rem", boxSizing: "border-box" as const };
  const lbl = { color: "#94a3b8", fontSize: "0.875rem", display: "block", marginBottom: "8px" };

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", padding: "24px", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "700px", margin: "0 auto 32px" }}>
        <a href={"/" + params.locale} style={{ color: "#14b8a6", fontWeight: 700, fontSize: "1.25rem", textDecoration: "none" }}>🌿 DPP Atlas</a>
        <a href={"/" + params.locale + "/login"} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem" }}>Login</a>
      </nav>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, marginBottom: "8px" }}>🏭 Register Your Factory</h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>Register and start your free DPP compliance assessment.</p>
        <form onSubmit={submit} style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", border: "1px solid #334155" }}>
          <div style={{ display: "grid", gap: "20px" }}>
            <div><label style={lbl}>Factory Name *</label><input name="factory_name" value={form.factory_name} onChange={set} required placeholder="ABC Textile Mills Ltd." style={inp} /></div>
            <div><label style={lbl}>Contact Person *</label><input name="contact_name" value={form.contact_name} onChange={set} required placeholder="Your full name" style={inp} /></div>
            <div><label style={lbl}>Email *</label><input name="email" type="email" value={form.email} onChange={set} required placeholder="factory@example.com" style={inp} /></div>
            <div><label style={lbl}>Factory Address</label><input name="address" value={form.address} onChange={set} placeholder="Full address" style={inp} /></div>
            <div><label style={lbl}>Number of Workers</label><input name="workers" type="number" value={form.workers} onChange={set} placeholder="500" style={inp} /></div>
            <div><label style={lbl}>Main Product Type</label><input name="product_type" value={form.product_type} onChange={set} placeholder="e.g. Knitwear, Woven Shirts" style={inp} /></div>
            <div>
              <label style={lbl}>Supply Chain Tier *</label>
              <select name="tier_level" value={form.tier_level} onChange={set} style={inp}>
                <option value="tier1">Tier 1 - Garment Manufacturing</option>
                <option value="tier2">Tier 2 - Fabric / Dyeing</option>
                <option value="tier3">Tier 3 - Yarn Production</option>
                <option value="tier4">Tier 4 - Raw Fiber</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Country *</label>
              <select name="country" value={form.country} onChange={set} style={inp}>
                {["Bangladesh","India","Pakistan","Sri Lanka","Vietnam","Cambodia","Indonesia","Turkey","China","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "28px", padding: "16px", background: "#0d9488", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "Registering..." : "✅ Register Factory"}
          </button>
        </form>
      </div>
    </main>
  );
}
`);

// ASSESS PAGE
write('app/[locale]/assess/page.tsx', `
"use client";
import { useState } from "react";

const CATS = [
  { id: 1, name: "Factory Identity & Registration", max: 20 },
  { id: 2, name: "Material Composition & Traceability", max: 25 },
  { id: 3, name: "Chemical Compliance", max: 20 },
  { id: 4, name: "Physical Testing & Durability", max: 20 },
  { id: 5, name: "Circularity & Sustainability", max: 15 },
];

const QS = [
  { id:1, cat:1, q:"Does your factory have an official GS1 Global Location Number (GLN)?", opts:[{l:"Yes",v:"yes",s:5},{l:"In Progress",v:"partial",s:2},{l:"No",v:"no",s:0}] },
  { id:2, cat:1, q:"Is your factory registered under your country's official textile regulatory authority?", opts:[{l:"Yes",v:"yes",s:5},{l:"No",v:"no",s:0}] },
  { id:3, cat:1, q:"Does your factory have a verified corporate tax identification number (TIN/BIN)?", opts:[{l:"Yes",v:"yes",s:5},{l:"No",v:"no",s:0}] },
  { id:4, cat:1, q:"Is your factory location verified on an official business registry?", opts:[{l:"Yes",v:"yes",s:5},{l:"No",v:"no",s:0}] },
  { id:5, cat:2, q:"Can you provide an exact fiber blend percentage totaling 100%?", opts:[{l:"Yes, verified",v:"yes",s:8},{l:"Approximate only",v:"partial",s:3},{l:"No",v:"no",s:0}] },
  { id:6, cat:2, q:"Are all fiber sources traceable to their country/region of origin?", opts:[{l:"Fully traced",v:"yes",s:7},{l:"Partially",v:"partial",s:3},{l:"Not traced",v:"no",s:0}] },
  { id:7, cat:2, q:"Do you hold a valid GOTS (Global Organic Textile Standard) certification?", opts:[{l:"Yes, current",v:"yes",s:5},{l:"Expired",v:"partial",s:2},{l:"No",v:"no",s:0}] },
  { id:8, cat:2, q:"Do you hold a valid OEKO-TEX certification for your primary materials?", opts:[{l:"Yes, current",v:"yes",s:5},{l:"Expired",v:"partial",s:2},{l:"No",v:"no",s:0}] },
  { id:9, cat:3, q:"Has your facility completed a REACH (EU Chemical Regulation) compliance audit?", opts:[{l:"Yes, documented",v:"yes",s:7},{l:"In progress",v:"partial",s:3},{l:"No",v:"no",s:0}] },
  { id:10, cat:3, q:"Are Substances of Very High Concern (SVHC) logged and disclosed in your material data sheets?", opts:[{l:"Fully disclosed",v:"yes",s:7},{l:"Partial",v:"partial",s:3},{l:"No",v:"no",s:0}] },
  { id:11, cat:3, q:"Do your dye processes meet RoHS chemical restriction requirements?", opts:[{l:"Yes, verified",v:"yes",s:6},{l:"Unverified",v:"partial",s:2},{l:"No",v:"no",s:0}] },
  { id:12, cat:4, q:"Has your fabric undergone ISO 3759 dimensional stability (shrinkage) testing?", opts:[{l:"Passed",v:"yes",s:7},{l:"Failed",v:"no",s:0},{l:"Not tested",v:"notdone",s:0}] },
  { id:13, cat:4, q:"Have you completed ISO 16322-3 spirality (twisting) testing on your fabric?", opts:[{l:"Passed",v:"yes",s:7},{l:"Failed",v:"no",s:0},{l:"Not tested",v:"notdone",s:0}] },
  { id:14, cat:4, q:"Has ISO 15487 visual inspection testing been conducted?", opts:[{l:"Passed",v:"yes",s:6},{l:"Failed",v:"no",s:0},{l:"Not conducted",v:"notdone",s:0}] },
  { id:15, cat:5, q:"Does your product include end-of-life recycling instructions for consumers?", opts:[{l:"Yes",v:"yes",s:5},{l:"Partial",v:"partial",s:2},{l:"No",v:"no",s:0}] },
  { id:16, cat:5, q:"Have you calculated the carbon footprint per kg of textile produced?", opts:[{l:"Yes, documented",v:"yes",s:5},{l:"Estimate only",v:"partial",s:2},{l:"No",v:"no",s:0}] },
  { id:17, cat:5, q:"Does your facility have a water consumption reduction program in place?", opts:[{l:"Yes, documented",v:"yes",s:5},{l:"Informal only",v:"partial",s:2},{l:"No",v:"no",s:0}] },
];

function calcScore(answers: Record<number, string>) {
  let total = 0;
  QS.forEach(q => { const o = q.opts.find(o => o.v === answers[q.id]); if (o) total += o.s; });
  return Math.round((total / 80) * 100);
}

function getBand(score: number) {
  if (score >= 90) return { label: "DPP COMPLIANT", color: "#22c55e", emoji: "✅" };
  if (score >= 70) return { label: "CONDITIONALLY COMPLIANT", color: "#eab308", emoji: "🟡" };
  if (score >= 50) return { label: "DEVELOPING", color: "#f97316", emoji: "🟠" };
  return { label: "NON-COMPLIANT", color: "#ef4444", emoji: "🔴" };
}

export default function AssessPage({ params }: { params: { locale: string } }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentCat = CATS[step - 1];
  const currentQs = QS.filter(q => q.cat === step);
  const allAnswered = currentQs.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    if (step < CATS.length) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      const score = calcScore(answers);
      const band = getBand(score);
      const reportId = Date.now().toString();
      const factory = JSON.parse(localStorage.getItem("dpp_factory") || '{"factory_name":"My Factory"}');
      const report = { id: reportId, score, band: band.emoji + " " + band.label, answers, factory, created_at: new Date().toISOString() };
      localStorage.setItem("dpp_report_" + reportId, JSON.stringify(report));
      localStorage.setItem("dpp_latest_report", reportId);
      setTimeout(() => { window.location.href = "/" + params.locale + "/report/" + reportId; }, 600);
    }
  };

  if (step === 0) return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "600px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>DPP Compliance Assessment</h1>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "32px" }}>
          This assessment covers 5 compliance categories with 17 questions. Answer honestly to receive your AI improvement roadmap.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px", marginBottom: "32px" }}>
          {CATS.map(c => (
            <div key={c.id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "12px", textAlign: "left" }}>
              <div style={{ color: "#14b8a6", fontWeight: 700, fontSize: "0.75rem" }}>CAT {c.id}</div>
              <div style={{ color: "white", fontSize: "0.8rem", marginTop: "4px" }}>{c.name}</div>
              <div style={{ color: "#64748b", fontSize: "0.75rem" }}>{c.max} pts</div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(1)} style={{ background: "#0d9488", color: "white", border: "none", padding: "16px 40px", borderRadius: "16px", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer" }}>
          🚀 Start Assessment
        </button>
      </div>
    </main>
  );

  if (submitting) return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚙️</div>
        <p style={{ color: "white", fontSize: "1.2rem" }}>Generating your compliance report...</p>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <a href={"/" + params.locale} style={{ color: "#14b8a6", textDecoration: "none", fontWeight: 700 }}>🌿 DPP Atlas</a>
          <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Step {step} of {CATS.length}</span>
        </div>
        <div style={{ height: "6px", background: "#1e293b", borderRadius: "3px", marginBottom: "32px" }}>
          <div style={{ height: "100%", background: "#0d9488", borderRadius: "3px", width: (step / CATS.length * 100) + "%" }} />
        </div>
        <h2 style={{ color: "white", fontSize: "1.4rem", fontWeight: 700, marginBottom: "32px" }}>
          Category {step}: {currentCat.name}
        </h2>
        <div style={{ display: "grid", gap: "24px" }}>
          {currentQs.map((q, qi) => (
            <div key={q.id} style={{ background: "#1e293b", border: "1px solid " + (answers[q.id] !== undefined ? "#0d9488" : "#334155"), borderRadius: "16px", padding: "24px" }}>
              <p style={{ color: "white", fontWeight: 600, marginBottom: "16px", lineHeight: 1.5 }}>
                <span style={{ color: "#14b8a6" }}>{qi + 1}. </span>{q.q}
              </p>
              <div style={{ display: "grid", gap: "10px" }}>
                {q.opts.map(opt => (
                  <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: answers[q.id] === opt.v ? "#0d948820" : "#0f172a", border: "1px solid " + (answers[q.id] === opt.v ? "#0d9488" : "#334155"), borderRadius: "10px", cursor: "pointer" }}>
                    <input type="radio" name={"q" + q.id} value={opt.v} checked={answers[q.id] === opt.v} onChange={() => setAnswers({ ...answers, [q.id]: opt.v })} style={{ accentColor: "#0d9488" }} />
                    <span style={{ color: "white", fontSize: "0.9rem" }}>{opt.l}</span>
                    {opt.s > 0 && <span style={{ marginLeft: "auto", color: "#14b8a6", fontSize: "0.8rem", fontWeight: 600 }}>+{opt.s}</span>}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={{ padding: "14px 24px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: "12px", cursor: "pointer", fontWeight: 600 }}>
              ← Previous
            </button>
          )}
          <button onClick={handleNext} disabled={!allAnswered} style={{ flex: 1, padding: "14px", background: allAnswered ? "#0d9488" : "#334155", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: allAnswered ? "pointer" : "not-allowed" }}>
            {step === CATS.length ? "✅ Submit & See Report" : "Next →"}
          </button>
        </div>
        {!allAnswered && <p style={{ color: "#64748b", fontSize: "0.8rem", textAlign: "center", marginTop: "12px" }}>Please answer all questions to continue</p>}
      </div>
    </main>
  );
}
`);

// REPORT PAGE
write('app/[locale]/report/[id]/page.tsx', `
"use client";
import { useEffect, useState } from "react";

function getBand(score: number) {
  if (score >= 90) return { label: "DPP COMPLIANT", color: "#22c55e", emoji: "✅" };
  if (score >= 70) return { label: "CONDITIONALLY COMPLIANT", color: "#eab308", emoji: "🟡" };
  if (score >= 50) return { label: "DEVELOPING", color: "#f97316", emoji: "🟠" };
  return { label: "NON-COMPLIANT", color: "#ef4444", emoji: "🔴" };
}

export default function ReportPage({ params }: { params: { locale: string; id: string } }) {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("dpp_report_" + params.id);
    if (data) setReport(JSON.parse(data));
  }, [params.id]);

  if (!report) return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#94a3b8", marginBottom: "16px" }}>Report not found.</p>
        <a href={"/" + params.locale + "/assess"} style={{ color: "#14b8a6" }}>Start a new assessment</a>
      </div>
    </main>
  );

  const band = getBand(report.score);
  const factory = report.factory || {};
  const tips = [
    { icon: "🏭", title: "Obtain GS1 GLN Number", desc: "Register at gs1.org for a free Global Location Number. EU buyers require this for product traceability.", ref: "EU ESPR Art. 9", time: "2 weeks" },
    { icon: "🧪", title: "Complete REACH Audit", desc: "Test for SVHC substances at an EU-approved lab. Create Material Safety Data Sheets for all chemicals.", ref: "REACH Reg. (EC) No 1907/2006", time: "4-6 weeks" },
    { icon: "🔬", title: "Complete ISO Testing", desc: "Contact a BGMEA-approved lab for ISO 3759 shrinkage, ISO 16322-3 spirality, and ISO 15487 visual tests.", ref: "ISO 3759:2011", time: "3-4 weeks" },
    { icon: "♻️", title: "Add Recycling Instructions", desc: "Add recycling symbols and end-of-life instructions to all product labels. Mandatory in EU from 2027.", ref: "EU ESPR Annex I", time: "1 week" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <a href={"/" + params.locale} style={{ color: "#14b8a6", fontWeight: 700, fontSize: "1.25rem", textDecoration: "none" }}>🌿 DPP Atlas</a>
          <a href={"/" + params.locale + "/assess"} style={{ background: "#1e293b", color: "#94a3b8", textDecoration: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "0.875rem" }}>New Assessment</a>
        </nav>
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "20px", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "8px" }}>{factory.factory_name || "Your Factory"} · {new Date(report.created_at).toLocaleDateString()}</p>
          <div style={{ fontSize: "5rem", fontWeight: 800, color: band.color, lineHeight: 1, marginBottom: "8px" }}>
            {report.score}<span style={{ fontSize: "2rem", color: "#64748b" }}>/100</span>
          </div>
          <div style={{ display: "inline-block", padding: "8px 24px", background: band.color + "20", border: "1px solid " + band.color, borderRadius: "999px", color: band.color, fontWeight: 700, fontSize: "1rem", marginBottom: "16px" }}>
            {band.emoji} {band.label}
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "400px", margin: "0 auto" }}>
            {report.score >= 90 ? "Congratulations! Your factory meets EU ESPR DPP requirements." :
             report.score >= 70 ? "Good progress! A few improvements will make you fully compliant." :
             report.score >= 50 ? "Significant improvements needed. Follow the roadmap below." :
             "Critical action required. Take immediate steps using the roadmap below."}
          </p>
        </div>
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px" }}>🤖 AI Improvement Roadmap</h2>
          {tips.map((tip, i) => (
            <div key={i} style={{ border: "1px solid #334155", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "1.5rem" }}>{tip.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ color: "white", fontWeight: 600 }}>{i + 1}. {tip.title}</span>
                    <span style={{ color: "#14b8a6", fontSize: "0.8rem" }}>⏱ {tip.time}</span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "6px", lineHeight: 1.6 }}>{tip.desc}</p>
                  <span style={{ color: "#64748b", fontSize: "0.75rem" }}>📖 {tip.ref}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <p style={{ color: "#64748b", fontSize: "0.75rem", lineHeight: 1.6 }}>
            ⚠️ This report is AI-generated based on self-reported data. It is an advisory tool and does not constitute legal certification. Independent lab testing and official certification bodies must be consulted for legally binding compliance.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => window.print()} style={{ flex: 1, padding: "14px", background: "#0d9488", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
            📄 Print / Save as PDF
          </button>
          <a href={"/" + params.locale + "/dashboard"} style={{ flex: 1, padding: "14px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: "12px", fontWeight: 600, textDecoration: "none", textAlign: "center", display: "block" }}>
            📊 Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
`);

// DASHBOARD PAGE
write('app/[locale]/dashboard/page.tsx', `
"use client";
import { useEffect, useState } from "react";

export default function DashboardPage({ params }: { params: { locale: string } }) {
  const [factory, setFactory] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const f = localStorage.getItem("dpp_factory");
    if (f) setFactory(JSON.parse(f));
    const id = localStorage.getItem("dpp_latest_report");
    if (id) {
      const r = localStorage.getItem("dpp_report_" + id);
      if (r) setReport(JSON.parse(r));
    }
  }, []);

  const color = (s: number) => s >= 90 ? "#22c55e" : s >= 70 ? "#eab308" : s >= 50 ? "#f97316" : "#ef4444";

  if (!factory) return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏭</div>
        <h2 style={{ color: "white", marginBottom: "16px" }}>No factory registered yet</h2>
        <a href={"/" + params.locale + "/enroll"} style={{ background: "#0d9488", color: "white", textDecoration: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700 }}>Register Factory</a>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <a href={"/" + params.locale} style={{ color: "#14b8a6", fontWeight: 700, fontSize: "1.25rem", textDecoration: "none" }}>🌿 DPP Atlas</a>
          <a href={"/" + params.locale + "/assess"} style={{ background: "#0d9488", color: "white", textDecoration: "none", padding: "8px 16px", borderRadius: "10px", fontWeight: 600, fontSize: "0.875rem" }}>+ New Assessment</a>
        </nav>
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "56px", height: "56px", background: "#0d9488", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🏭</div>
            <div>
              <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 700, marginBottom: "4px" }}>{factory.factory_name}</h1>
              <p style={{ color: "#64748b", fontSize: "0.875rem" }}>{factory.country} · {factory.tier_level} {factory.workers ? "· " + factory.workers + " workers" : ""}</p>
            </div>
          </div>
        </div>
        {!report ? (
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
            <h2 style={{ color: "white", marginBottom: "12px" }}>No assessments yet</h2>
            <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Start your first DPP compliance assessment to see your score here.</p>
            <a href={"/" + params.locale + "/assess"} style={{ background: "#0d9488", color: "white", textDecoration: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700 }}>Start Assessment</a>
          </div>
        ) : (
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>Latest Assessment</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "4px" }}>{new Date(report.created_at).toLocaleDateString()}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 800, color: color(report.score) }}>{report.score}</span>
                  <span style={{ color: "#64748b" }}>/100</span>
                  <span style={{ padding: "4px 12px", background: color(report.score) + "20", border: "1px solid " + color(report.score), borderRadius: "999px", color: color(report.score), fontSize: "0.75rem", fontWeight: 600 }}>{report.band}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href={"/" + params.locale + "/report/" + report.id} style={{ background: "#0d9488", color: "white", textDecoration: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 600, fontSize: "0.875rem" }}>View Report</a>
                <a href={"/" + params.locale + "/assess"} style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", textDecoration: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 600, fontSize: "0.875rem" }}>New Assessment</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
`);

console.log('\n=== ALL DONE ===');
console.log('Now run: git add . && git commit -m "All pages fixed via node script" && git push');