
"use client";
import { useState } from "react";

function getBand(score: number) {
  if (score >= 90) return {label:"DPP COMPLIANT",           color:"#22c55e", emoji:"✅"};
  if (score >= 70) return {label:"CONDITIONALLY COMPLIANT", color:"#eab308", emoji:"🟡"};
  if (score >= 50) return {label:"DEVELOPING",              color:"#f97316", emoji:"🟠"};
  return              {label:"NON-COMPLIANT",             color:"#ef4444", emoji:"🔴"};
}

export default function VerifyPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const [id, setId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const verify = () => {
    setLoading(true); setNotFound(false); setResult(null);
    setTimeout(() => {
      const data = localStorage.getItem("dpp_report_" + id);
      if (data) setResult(JSON.parse(data));
      else setNotFound(true);
      setLoading(false);
    }, 800);
  };

  return (
    <main style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"sans-serif", padding:"24px"}}>
      <nav style={{display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:"700px", margin:"0 auto 48px"}}>
        <a href={"/" + params.locale} style={{color:"#0d9488", fontWeight:700, fontSize:"1.25rem", textDecoration:"none"}}>🌿 DPP Atlas</a>
        <a href={"/" + params.locale + "/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"8px 16px", borderRadius:"10px", fontWeight:600, fontSize:"0.875rem"}}>
          {isBn ? "নিবন্ধন করুন" : "Register Factory"}
        </a>
      </nav>
      <div style={{maxWidth:"600px", margin:"0 auto"}}>
        <div style={{textAlign:"center", marginBottom:"40px"}}>
          <div style={{fontSize:"3rem", marginBottom:"12px"}}>🔍</div>
          <h1 style={{fontSize:"2rem", fontWeight:800, marginBottom:"12px", color:"#0f172a"}}>
            {isBn ? "ফ্যাক্টরি ভেরিফিকেশন চেক" : "Factory Verification Check"}
          </h1>
          <p style={{color:"#64748b", lineHeight:1.7}}>
            {isBn ? "একটি কারখানার DPP Atlas ভেরিফিকেশন স্ট্যাটাস যাচাই করুন।" : "Verify a factory's DPP compliance status. Enter their Report ID below."}
          </p>
        </div>
        <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"32px", marginBottom:"24px"}}>
          <label style={{color:"#374151", fontSize:"0.875rem", fontWeight:600, display:"block", marginBottom:"8px"}}>
            {isBn ? "রিপোর্ট ID লিখুন" : "Enter Report ID"}
          </label>
          <div style={{display:"flex", gap:"12px"}}>
            <input value={id} onChange={e => setId(e.target.value)}
              placeholder="e.g. 1720000000000"
              style={{flex:1, padding:"12px 16px", border:"1px solid #e2e8f0", borderRadius:"10px", fontSize:"0.95rem", outline:"none"}}
            />
            <button onClick={verify} disabled={!id || loading}
              style={{padding:"12px 20px", background: id ? "#0d9488" : "#e2e8f0", color: id ? "white" : "#94a3b8", border:"none", borderRadius:"10px", fontWeight:700, cursor: id ? "pointer" : "not-allowed"}}>
              {loading ? "..." : (isBn ? "যাচাই" : "Verify")}
            </button>
          </div>
        </div>
        {notFound && (
          <div style={{background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"12px", padding:"24px", textAlign:"center"}}>
            <div style={{fontSize:"2rem", marginBottom:"8px"}}>❌</div>
            <div style={{color:"#dc2626", fontWeight:600}}>
              {isBn ? "কোনো যাচাইকৃত রেকর্ড পাওয়া যায়নি।" : "No verified record found for this ID."}
            </div>
          </div>
        )}
        {result && (() => {
          const band = getBand(result.score);
          const fac = result.factory || {};
          return (
            <div style={{background:"white", border:"2px solid " + band.color, borderRadius:"16px", padding:"32px", textAlign:"center"}}>
              <div style={{fontSize:"3rem", marginBottom:"8px"}}>{band.emoji}</div>
              <div style={{fontWeight:800, fontSize:"1.25rem", color:band.color, marginBottom:"4px"}}>{band.label}</div>
              <div style={{color:"#64748b", fontSize:"0.875rem", marginBottom:"24px"}}>Verified by DPP Atlas Platform</div>
              <div style={{background:"#f8fafc", borderRadius:"12px", padding:"20px", marginBottom:"20px", textAlign:"left"}}>
                <div style={{display:"grid", gap:"10px", fontSize:"0.875rem"}}>
                  <div><strong>Factory:</strong> {fac.factory_name || "N/A"}</div>
                  <div><strong>Country:</strong> {fac.country || "N/A"}</div>
                  <div><strong>Score:</strong> <span style={{color:band.color, fontWeight:700}}>{result.score}/100</span></div>
                  <div><strong>Assessment Date:</strong> {new Date(result.created_at).toLocaleDateString()}</div>
                  <div><strong>Report ID:</strong> {result.id}</div>
                </div>
              </div>
              <p style={{color:"#94a3b8", fontSize:"0.75rem", lineHeight:1.6}}>
                ⚠️ Based on self-reported data. Not a legal certificate. Consult accredited bodies for formal compliance.
              </p>
            </div>
          );
        })()}
      </div>
    </main>
  );
}
