
"use client";
import { useState } from "react";

function getBand(score: number) {
  if (score >= 90) return {label:"DPP COMPLIANT",           color:"#22c55e", emoji:"✅"};
  if (score >= 70) return {label:"CONDITIONALLY COMPLIANT", color:"#eab308", emoji:"🟡"};
  if (score >= 50) return {label:"DEVELOPING",              color:"#f97316", emoji:"🟠"};
  return                  {label:"NON-COMPLIANT",           color:"#ef4444", emoji:"🔴"};
}

export default function VerifyPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;
  const [id,       setId]       = useState("");
  const [result,   setResult]   = useState<Record<string,unknown> | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [notFound, setNotFound] = useState(false);

  const verify = () => {
    setLoading(true); setNotFound(false); setResult(null);
    setTimeout(() => {
      const data = localStorage.getItem("dpp_report_" + id);
      if (data) setResult(JSON.parse(data) as Record<string,unknown>);
      else setNotFound(true);
      setLoading(false);
    }, 800);
  };

  return (
    <main style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,sans-serif", padding:"24px"}}>
      <nav style={{display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:"700px", margin:"0 auto 48px"}}>
        <a href={"/"+loc} style={{color:"#0d9488", fontWeight:700, fontSize:"1.25rem", textDecoration:"none"}}>🌿 DPP Atlas</a>
        <a href={"/"+loc+"/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"8px 16px", borderRadius:"10px", fontWeight:600, fontSize:"0.875rem"}}>
          {isBn?"নিবন্ধন করুন":"Register Factory"}
        </a>
      </nav>
      <div style={{maxWidth:"600px", margin:"0 auto"}}>
        <div style={{textAlign:"center", marginBottom:"36px"}}>
          <div style={{fontSize:"2.5rem", marginBottom:"12px"}}>🔍</div>
          <h1 style={{fontSize:"1.75rem", fontWeight:800, marginBottom:"10px", color:"#0f172a"}}>
            {isBn?"ফ্যাক্টরি ভেরিফিকেশন চেক":"Factory Verification Check"}
          </h1>
          <p style={{color:"#64748b", lineHeight:1.7}}>
            {isBn?"একটি কারখানার DPP Atlas স্ট্যাটাস যাচাই করুন।":"Verify a factory's DPP compliance status using their Report ID."}
          </p>
        </div>
        <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"14px", padding:"28px", marginBottom:"20px"}}>
          <label style={{color:"#374151", fontSize:"0.875rem", fontWeight:600, display:"block", marginBottom:"8px"}}>
            {isBn?"রিপোর্ট ID লিখুন":"Enter Report ID"}
          </label>
          <div style={{display:"flex", gap:"10px"}}>
            <input value={id} onChange={e => setId(e.target.value)}
              placeholder="e.g. 1720000000000"
              style={{flex:1, padding:"11px 14px", border:"1px solid #e2e8f0", borderRadius:"10px", fontSize:"0.95rem", outline:"none"}}
            />
            <button onClick={verify} disabled={!id || loading}
              style={{padding:"11px 18px", background:id?"#0d9488":"#e2e8f0", color:id?"white":"#94a3b8", border:"none", borderRadius:"10px", fontWeight:700, cursor:id?"pointer":"not-allowed"}}>
              {loading?"...":(isBn?"যাচাই":"Verify")}
            </button>
          </div>
        </div>
        {notFound && (
          <div style={{background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"12px", padding:"20px", textAlign:"center"}}>
            <div style={{fontSize:"1.75rem", marginBottom:"8px"}}>❌</div>
            <div style={{color:"#dc2626", fontWeight:600}}>
              {isBn?"কোনো যাচাইকৃত রেকর্ড পাওয়া যায়নি।":"No verified record found for this ID."}
            </div>
          </div>
        )}
        {result && (() => {
          const sc  = typeof result.score === "number" ? result.score : 0;
          const b   = getBand(sc);
          const fac = (result.factory || {}) as Record<string,string>;
          const ca  = typeof result.created_at === "string" ? result.created_at : "";
          return (
            <div style={{background:"white", border:"2px solid "+b.color, borderRadius:"14px", padding:"28px", textAlign:"center"}}>
              <div style={{fontSize:"2.5rem", marginBottom:"8px"}}>{b.emoji}</div>
              <div style={{fontWeight:800, fontSize:"1.1rem", color:b.color, marginBottom:"4px"}}>{b.label}</div>
              <div style={{color:"#64748b", fontSize:"0.8rem", marginBottom:"20px"}}>Verified by DPP Atlas Platform</div>
              <div style={{background:"#f8fafc", borderRadius:"10px", padding:"16px", marginBottom:"16px", textAlign:"left"}}>
                <div style={{display:"grid", gap:"8px", fontSize:"0.875rem"}}>
                  <div><strong>Factory:</strong> {fac.factory_name || "N/A"}</div>
                  <div><strong>Country:</strong> {fac.country || "N/A"}</div>
                  <div><strong>Score:</strong> <span style={{color:b.color, fontWeight:700}}>{sc}/100</span></div>
                  {ca && <div><strong>Date:</strong> {new Date(ca).toLocaleDateString()}</div>}
                  <div><strong>Report ID:</strong> {String(result.id || "")}</div>
                </div>
              </div>
              <p style={{color:"#94a3b8", fontSize:"0.72rem", lineHeight:1.6}}>
                ⚠️ Based on self-reported data. Not a legal certificate. Consult accredited bodies for formal compliance.
              </p>
            </div>
          );
        })()}
      </div>
    </main>
  );
}
