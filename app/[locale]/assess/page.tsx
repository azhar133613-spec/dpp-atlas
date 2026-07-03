
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
