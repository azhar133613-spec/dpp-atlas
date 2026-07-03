
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
