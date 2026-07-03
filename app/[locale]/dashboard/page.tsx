
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
