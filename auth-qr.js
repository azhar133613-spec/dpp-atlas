const fs = require('fs');
const path = require('path');
function w(p,c){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c,'utf8');console.log('OK ('+fs.statSync(p).size+' bytes): '+p);}

// ── 1. REAL LOGIN PAGE WITH SUPABASE AUTH ─────────────────────
w('app/[locale]/login/page.tsx', `
"use client";
import { useState } from "react";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const isBn  = params.locale === "bn";
  const loc   = params.locale;
  const [mode,     setMode]     = useState<"login"|"signup">("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");
  const [isErr,    setIsErr]    = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!SUPA_URL || !SUPA_KEY) throw new Error("Supabase not configured");

      if (mode === "signup") {
        const res  = await fetch(SUPA_URL + "/auth/v1/signup", {
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SUPA_KEY},
          body: JSON.stringify({ email, password })
        });
        const data = await res.json() as { error?: { message?: string }; id?: string };
        if (!res.ok) throw new Error(data.error?.message || "Signup failed");
        setIsErr(false);
        setMsg(isBn
          ? "✅ নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে। ইনবক্স চেক করুন।"
          : "✅ Confirmation email sent. Check your inbox to verify.");
      } else {
        const res  = await fetch(SUPA_URL + "/auth/v1/token?grant_type=password", {
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SUPA_KEY},
          body: JSON.stringify({ email, password })
        });
        const data = await res.json() as { error?: { message?: string }; access_token?: string; user?: { id: string } };
        if (!res.ok) throw new Error(data.error?.message || "Login failed");
        // Store session in localStorage for client-side use
        localStorage.setItem("dpp_auth_token", data.access_token || "");
        localStorage.setItem("dpp_user_email", email);
        window.location.href = "/" + loc + "/dashboard";
      }
    } catch (err) {
      setIsErr(true);
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width:"100%", padding:"12px 16px",
    background:"#f8fafc", border:"1px solid #e2e8f0",
    borderRadius:"10px", color:"#0f172a",
    fontSize:"0.95rem", boxSizing:"border-box", outline:"none"
  };

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:"420px"}}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontSize:"1.4rem",fontWeight:800,textDecoration:"none",display:"block",marginBottom:"8px"}}>
            🌿 DPP Atlas
          </a>
          <h1 style={{color:"#0f172a",fontSize:"1.5rem",fontWeight:700,marginBottom:"4px"}}>
            {mode==="login"?(isBn?"লগইন করুন":"Sign In"):(isBn?"অ্যাকাউন্ট তৈরি করুন":"Create Account")}
          </h1>
          <p style={{color:"#64748b",fontSize:"0.875rem"}}>
            {isBn?"আপনার DPP Atlas অ্যাকাউন্ট":"Your DPP Atlas account"}
          </p>
        </div>

        {/* Benefits banner */}
        <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"12px",padding:"14px 16px",marginBottom:"24px",fontSize:"0.8rem",color:"#0f766e"}}>
          <div style={{fontWeight:700,marginBottom:"6px"}}>
            {isBn?"অ্যাকাউন্টের সুবিধা:":"Benefits of an account:"}
          </div>
          <div>✓ {isBn?"সব মূল্যায়ন সংরক্ষিত থাকে":"All assessments saved permanently"}</div>
          <div>✓ {isBn?"যেকোনো ডিভাইস থেকে অ্যাক্সেস":"Access from any device"}</div>
          <div>✓ {isBn?"স্কোর ট্র্যাকিং ও তুলনা":"Score history and comparison"}</div>
        </div>

        {/* Form */}
        <div style={{background:"white",borderRadius:"16px",padding:"32px",border:"1px solid #e2e8f0",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
          <form onSubmit={handle}>
            <div style={{marginBottom:"18px"}}>
              <label style={{color:"#374151",fontSize:"0.875rem",fontWeight:600,display:"block",marginBottom:"8px"}}>
                {isBn?"ইমেইল":"Email"}
              </label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                required placeholder="factory@example.com" style={inp} />
            </div>
            <div style={{marginBottom:"24px"}}>
              <label style={{color:"#374151",fontSize:"0.875rem",fontWeight:600,display:"block",marginBottom:"8px"}}>
                {isBn?"পাসওয়ার্ড":"Password"}
                {mode==="signup" && <span style={{color:"#94a3b8",fontWeight:400,marginLeft:"6px",fontSize:"0.78rem"}}>(min 6 chars)</span>}
              </label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                required minLength={6} placeholder="••••••••" style={inp} />
            </div>

            {msg && (
              <div style={{background:isErr?"#fef2f2":"#f0fdf4",border:"1px solid "+(isErr?"#fecaca":"#bbf7d0"),borderRadius:"10px",padding:"12px",marginBottom:"18px",color:isErr?"#dc2626":"#16a34a",fontSize:"0.875rem",lineHeight:1.5}}>
                {msg}
              </div>
            )}

            <button type="submit" disabled={loading} style={{width:"100%",padding:"14px",background:loading?"#94a3b8":"#0d9488",color:"white",border:"none",borderRadius:"12px",fontWeight:700,fontSize:"1rem",cursor:loading?"not-allowed":"pointer",transition:"background 0.2s"}}>
              {loading?"⏳ "+( isBn?"অপেক্ষা করুন...":"Please wait...")
                :mode==="login"?(isBn?"লগইন করুন":"Sign In"):(isBn?"অ্যাকাউন্ট তৈরি করুন":"Create Account")}
            </button>
          </form>

          <div style={{textAlign:"center",marginTop:"20px"}}>
            <button onClick={()=>{setMode(m=>m==="login"?"signup":"login");setMsg("");}}
              style={{background:"none",border:"none",color:"#0d9488",cursor:"pointer",fontSize:"0.875rem",fontWeight:500}}>
              {mode==="login"
                ?(isBn?"নতুন ব্যবহারকারী? অ্যাকাউন্ট তৈরি করুন":"New user? Create an account")
                :(isBn?"ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন":"Already have an account? Sign in")}
            </button>
          </div>
        </div>

        {/* Skip login */}
        <div style={{textAlign:"center",marginTop:"20px",display:"flex",justifyContent:"center",gap:"20px"}}>
          <a href={"/"+loc} style={{color:"#94a3b8",fontSize:"0.8rem",textDecoration:"none"}}>
            ← {isBn?"হোমপেজে ফিরুন":"Back to home"}
          </a>
          <span style={{color:"#e2e8f0"}}>·</span>
          <a href={"/"+loc+"/assess"} style={{color:"#0d9488",fontSize:"0.8rem",textDecoration:"none",fontWeight:500}}>
            {isBn?"লগইন ছাড়াই মূল্যায়ন করুন →":"Continue without login →"}
          </a>
        </div>
      </div>
    </main>
  );
}
`);

// ── 2. REPORT PAGE WITH QR CODE ───────────────────────────────
w('app/[locale]/report/[id]/page.tsx', `
"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface AiAction {
  priority: number;
  category: string;
  issue: string;
  fix_action: string;
  timeline: string;
  regulatory_reference: string;
}
interface AiReport {
  executive_summary: string;
  strengths: string[];
  critical_actions: AiAction[];
  buyer_ready_statement?: string;
  next_assessment_date?: string;
  disclaimer: string;
}
interface Report {
  id: string;
  score: number;
  band: string;
  answers: Record<number, string>;
  factory: Record<string, string>;
  failed_ids: number[];
  created_at: string;
  ai_report?: AiReport;
  saved_to_db?: boolean;
}

function getBand(score: number) {
  if (score >= 90) return {label:"DPP COMPLIANT",           color:"#22c55e", emoji:"✅", bg:"#dcfce7"};
  if (score >= 70) return {label:"CONDITIONALLY COMPLIANT", color:"#eab308", emoji:"🟡", bg:"#fef9c3"};
  if (score >= 50) return {label:"DEVELOPING",              color:"#f97316", emoji:"🟠", bg:"#ffedd5"};
  return                  {label:"NON-COMPLIANT",           color:"#ef4444", emoji:"🔴", bg:"#fee2e2"};
}

const CATS = [
  {name:"Factory Identity & Registration",     max:20, w:0.85},
  {name:"Material Composition & Traceability", max:25, w:0.90},
  {name:"Chemical Compliance",                 max:20, w:0.75},
  {name:"Physical Testing & Durability",       max:20, w:0.80},
  {name:"Circularity & Sustainability",        max:15, w:0.70},
];

export default function ReportPage({ params }: { params: { locale: string; id: string } }) {
  const isBn     = params.locale === "bn";
  const loc      = params.locale;
  const savedRef = useRef<boolean>(false);

  const [report,    setReport]    = useState<Report | null>(null);
  const [aiReport,  setAiReport]  = useState<AiReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError,   setAiError]   = useState("");
  const [dbSaved,   setDbSaved]   = useState(false);
  const [qrUrl,     setQrUrl]     = useState("");

  useEffect(() => {
    const data = localStorage.getItem("dpp_report_" + params.id);
    if (data) {
      const r = JSON.parse(data) as Report;
      setReport(r);
      // Generate QR URL pointing to public DPP passport page
      const passportUrl = window.location.origin + "/dpp/" + r.id;
      setQrUrl("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(passportUrl));
      if (r.ai_report) {
        setAiReport(r.ai_report);
        if (r.saved_to_db) setDbSaved(true);
        else void saveToDb(r, r.ai_report);
      } else {
        void generateAI(r);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const saveToDb = async (r: Report, ai: AiReport) => {
    if (savedRef.current || r.saved_to_db) return;
    savedRef.current = true;
    try {
      const res  = await fetch("/api/v1/save-assessment", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({factory:r.factory, score:r.score, band:r.band, answers:r.answers, failed_ids:r.failed_ids||[], ai_report:ai, report_id:r.id})
      });
      const data = await res.json() as {success:boolean};
      if (data.success) {
        const updated = {...r, ai_report:ai, saved_to_db:true};
        localStorage.setItem("dpp_report_"+r.id, JSON.stringify(updated));
        setDbSaved(true);
      }
    } catch { /* silent fallback */ }
  };

  const generateAI = async (r: Report) => {
    setAiLoading(true); setAiError("");
    try {
      const res  = await fetch("/api/v1/generate-report", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({factory:r.factory, score:r.score, answers:r.answers, failed_ids:r.failed_ids||[]})
      });
      const data = await res.json() as {success:boolean; report:AiReport};
      if (data.success) {
        setAiReport(data.report);
        const updated = {...r, ai_report:data.report};
        localStorage.setItem("dpp_report_"+r.id, JSON.stringify(updated));
        setReport(updated);
        void saveToDb(updated, data.report);
      } else { setAiError("AI report unavailable."); }
    } catch { setAiError("Could not connect to AI."); }
    finally  { setAiLoading(false); }
  };

  if (!report) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <p style={{color:"#64748b",marginBottom:"16px"}}>Loading report...</p>
        <a href={"/"+loc+"/assess"} style={{color:"#0d9488"}}>Start a new assessment</a>
      </div>
    </main>
  );

  const score   = Math.min(100, report.score);
  const band    = getBand(score);
  const factory = report.factory || {};
  const rid     = report.id;
  const passportUrl = typeof window !== "undefined" ? window.location.origin + "/dpp/" + rid : "";

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"system-ui,sans-serif",padding:"24px"}}>
      <style>{"@media print{.no-print{display:none!important}.print-show{display:block!important}}"}</style>
      <div style={{maxWidth:"860px",margin:"0 auto"}}>

        {/* NAV */}
        <nav className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px",flexWrap:"wrap",gap:"12px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,fontSize:"1.1rem",textDecoration:"none"}}>🌿 DPP Atlas</a>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
            {dbSaved && <span style={{color:"#22c55e",fontSize:"0.75rem",fontWeight:600}}>☁️ {isBn?"সংরক্ষিত":"Saved to cloud"}</span>}
            <button onClick={()=>window.print()} style={{padding:"10px 18px",background:"#0d9488",color:"white",border:"none",borderRadius:"8px",fontWeight:700,cursor:"pointer",fontSize:"0.875rem"}}>
              📄 {isBn?"PDF ডাউনলোড":"Download PDF"}
            </button>
            <a href={"/"+loc+"/assess"} style={{padding:"10px 16px",background:"white",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:"8px",fontWeight:600,textDecoration:"none",fontSize:"0.875rem"}}>
              🔄 {isBn?"নতুন মূল্যায়ন":"New Assessment"}
            </a>
          </div>
        </nav>

        {/* SCORE CARD + QR */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"20px",padding:"40px",marginBottom:"20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"32px",alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <p style={{color:"#64748b",fontSize:"0.8rem",marginBottom:"8px"}}>
                {factory.factory_name||"Your Factory"} · {new Date(report.created_at).toLocaleDateString()} · ID: {rid.slice(0,8)}...
              </p>
              <div style={{fontSize:"5rem",fontWeight:800,color:band.color,lineHeight:1,marginBottom:"8px"}}>
                {score}<span style={{fontSize:"1.75rem",color:"#94a3b8"}}>/100</span>
              </div>
              <div style={{display:"inline-block",padding:"8px 24px",background:band.bg,border:"2px solid "+band.color,borderRadius:"99px",color:band.color,fontWeight:700,fontSize:"1rem",marginBottom:"12px"}}>
                {band.emoji} {band.label}
              </div>
              <p style={{color:"#64748b",fontSize:"0.875rem",maxWidth:"360px",margin:"0 auto",lineHeight:1.6}}>
                {score>=90?(isBn?"অভিনন্দন! EU ESPR DPP পাসপোর্টের জন্য প্রস্তুত।":"Congratulations! Your factory meets EU ESPR requirements.")
                :score>=70?(isBn?"ভালো অগ্রগতি। কিছু উন্নতি প্রয়োজন।":"Good progress. Key improvements needed.")
                :score>=50?(isBn?"উল্লেখযোগ্য উন্নতি প্রয়োজন।":"Significant improvements needed.")
                :(isBn?"জরুরি পদক্ষেপ প্রয়োজন।":"Critical action required.")}
              </p>
            </div>

            {/* QR CODE */}
            {qrUrl && (
              <div style={{textAlign:"center",flexShrink:0}}>
                <div style={{border:"2px solid #e2e8f0",borderRadius:"12px",padding:"12px",background:"white",display:"inline-block"}}>
                  <img src={qrUrl} alt="DPP Passport QR Code" width={120} height={120} style={{display:"block"}} />
                </div>
                <div style={{color:"#64748b",fontSize:"0.68rem",marginTop:"6px",maxWidth:"120px"}}>
                  {isBn?"QR স্ক্যান করুন — পাবলিক DPP পাসপোর্ট":"Scan QR — Public DPP Passport"}
                </div>
                <a href={passportUrl} style={{color:"#0d9488",fontSize:"0.7rem",display:"block",marginTop:"4px",textDecoration:"none",fontWeight:600}}>
                  {isBn?"পাসপোর্ট দেখুন →":"View Passport →"}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* CATEGORY SCORES */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
          <h2 style={{fontWeight:700,fontSize:"1rem",marginBottom:"20px",color:"#0f172a"}}>
            📊 {isBn?"বিভাগ অনুযায়ী স্কোর":"Score by Category"}
          </h2>
          {CATS.map((cat,i) => {
            const est = Math.min(cat.max, Math.round(cat.max*(score/100)*cat.w));
            const pct = Math.round(est/cat.max*100);
            const clr = pct>=80?"#22c55e":pct>=60?"#eab308":"#ef4444";
            return (
              <div key={i} style={{marginBottom:"14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                  <span style={{fontSize:"0.875rem",color:"#374151",fontWeight:500}}>{cat.name}</span>
                  <span style={{fontSize:"0.875rem",color:clr,fontWeight:700}}>{est}/{cat.max}</span>
                </div>
                <div style={{height:"8px",background:"#f1f5f9",borderRadius:"4px"}}>
                  <div style={{height:"100%",background:clr,borderRadius:"4px",width:pct+"%"}} />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI REPORT */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
            <h2 style={{fontWeight:700,fontSize:"1rem",color:"#0f172a"}}>
              🤖 {isBn?"AI উন্নতির রোডম্যাপ":"AI Improvement Roadmap"}
              {aiReport && <span style={{fontSize:"0.7rem",color:"#22c55e",marginLeft:"8px"}}>✓ Powered by Gemini</span>}
            </h2>
            {!aiLoading && !aiReport && (
              <button onClick={()=>void generateAI(report)} style={{padding:"8px 16px",background:"#0d9488",color:"white",border:"none",borderRadius:"8px",fontWeight:600,cursor:"pointer",fontSize:"0.8rem"}}>
                {isBn?"AI রিপোর্ট তৈরি করুন":"Generate AI Report"}
              </button>
            )}
          </div>

          {aiLoading && (
            <div style={{textAlign:"center",padding:"32px"}}>
              <div style={{fontSize:"2rem",marginBottom:"12px"}}>⚙️</div>
              <p style={{fontWeight:600,color:"#0f172a",marginBottom:"4px"}}>{isBn?"Gemini AI বিশ্লেষণ করছে...":"Gemini AI analyzing responses..."}</p>
              <p style={{color:"#94a3b8",fontSize:"0.8rem"}}>5-10 seconds</p>
            </div>
          )}
          {aiError && (
            <div style={{background:"#fef3c7",border:"1px solid #fbbf24",borderRadius:"8px",padding:"12px",marginBottom:"16px",fontSize:"0.8rem",color:"#92400e"}}>
              ⚠️ {aiError}
            </div>
          )}

          {aiReport && (
            <div>
              <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"10px",padding:"16px",marginBottom:"18px"}}>
                <p style={{color:"#0f172a",fontSize:"0.9rem",lineHeight:1.7}}>{aiReport.executive_summary}</p>
              </div>
              {aiReport.strengths.length > 0 && (
                <div style={{marginBottom:"18px"}}>
                  <h3 style={{fontWeight:700,fontSize:"0.875rem",marginBottom:"10px"}}>✅ {isBn?"শক্তিশালী দিক":"Your Strengths"}</h3>
                  {aiReport.strengths.map((s,i) => (
                    <div key={i} style={{display:"flex",gap:"8px",marginBottom:"6px"}}>
                      <span style={{color:"#22c55e",flexShrink:0}}>✓</span>
                      <span style={{color:"#374151",fontSize:"0.875rem"}}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {aiReport.critical_actions.length > 0 && (
                <div style={{marginBottom:"18px"}}>
                  <h3 style={{fontWeight:700,fontSize:"0.875rem",marginBottom:"12px"}}>🎯 {isBn?"অগ্রাধিকার কর্মপরিকল্পনা":"Priority Action Plan"}</h3>
                  {aiReport.critical_actions.map((a,i) => (
                    <div key={i} style={{border:"1px solid #e2e8f0",borderRadius:"10px",padding:"14px",marginBottom:"10px"}}>
                      <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                        <div style={{minWidth:"26px",height:"26px",background:"#0f172a",color:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.75rem",flexShrink:0}}>
                          {a.priority}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"6px",marginBottom:"5px"}}>
                            <span style={{fontWeight:700,fontSize:"0.875rem",color:"#0f172a"}}>{a.issue}</span>
                            <span style={{color:"#0d9488",fontSize:"0.75rem",fontWeight:600,background:"#f0fdfa",padding:"2px 8px",borderRadius:"6px"}}>⏱ {a.timeline}</span>
                          </div>
                          <p style={{color:"#374151",fontSize:"0.8rem",lineHeight:1.6,marginBottom:"4px"}}>{a.fix_action}</p>
                          <span style={{color:"#94a3b8",fontSize:"0.72rem"}}>📖 {a.regulatory_reference}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {aiReport.buyer_ready_statement && (
                <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"8px",padding:"14px",marginBottom:"14px"}}>
                  <p style={{color:"#1d4ed8",fontSize:"0.78rem",fontWeight:700,marginBottom:"4px"}}>📢 {isBn?"ক্রেতাদের জন্য বিবৃতি":"Statement for EU Buyers"}</p>
                  <p style={{color:"#1e3a8a",fontSize:"0.875rem",lineHeight:1.6}}>{aiReport.buyer_ready_statement}</p>
                </div>
              )}
              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"10px"}}>
                <p style={{color:"#94a3b8",fontSize:"0.72rem",lineHeight:1.6}}>⚠️ {aiReport.disclaimer}</p>
              </div>
            </div>
          )}
        </div>

        {/* VERIFICATION BADGE */}
        {score >= 70 && (
          <div style={{background:"white",border:"2px solid #0d9488",borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"20px",alignItems:"center"}}>
              <div>
                <div style={{fontSize:"1.5rem",marginBottom:"6px"}}>🏆</div>
                <h2 style={{fontWeight:800,fontSize:"1rem",color:"#0d9488",marginBottom:"6px"}}>{isBn?"ভেরিফিকেশন ব্যাজ অর্জিত":"Verification Badge Earned"}</h2>
                <p style={{color:"#64748b",fontSize:"0.82rem",marginBottom:"12px"}}>{isBn?"এই Report ID দিয়ে EU ক্রেতারা তাৎক্ষণিক যাচাই করতে পারবেন।":"EU buyers can instantly verify using this Report ID."}</p>
                <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"8px",padding:"10px",fontFamily:"monospace",fontSize:"0.82rem",color:"#0f766e",marginBottom:"12px",wordBreak:"break-all"}}>{rid}</div>
                <a href={"/"+loc+"/verify"} style={{color:"#0d9488",fontSize:"0.875rem",fontWeight:600,textDecoration:"none"}}>🔍 {isBn?"ভেরিফিকেশন পেজ →":"Open Verification Page →"}</a>
              </div>
              {qrUrl && (
                <div style={{textAlign:"center",flexShrink:0}}>
                  <img src={qrUrl} alt="Verification QR" width={100} height={100} style={{border:"2px solid #e2e8f0",borderRadius:"10px",display:"block"}} />
                  <div style={{color:"#94a3b8",fontSize:"0.65rem",marginTop:"4px"}}>Scan to verify</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DPP PASSPORT LINK */}
        <div className="no-print" style={{background:"#f0fdfa",border:"1px solid #0d9488",borderRadius:"12px",padding:"14px 18px",marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"0.875rem",color:"#0d9488",marginBottom:"2px"}}>🌐 {isBn?"পাবলিক DPP পাসপোর্ট":"Public DPP Passport"}</div>
            <div style={{color:"#64748b",fontSize:"0.78rem"}}>{isBn?"EU ক্রেতাদের সাথে শেয়ার করুন — কোনো লগইন দরকার নেই":"Share with EU buyers — no login required"}</div>
          </div>
          <a href={"/dpp/"+rid} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"8px 16px",borderRadius:"8px",fontWeight:600,fontSize:"0.8rem"}}>
            {isBn?"পাসপোর্ট দেখুন →":"View Passport →"}
          </a>
        </div>

        {/* ACTION BUTTONS */}
        <div className="no-print" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px"}}>
          <button onClick={()=>window.print()} style={{padding:"13px",background:"#0d9488",color:"white",border:"none",borderRadius:"10px",fontWeight:700,cursor:"pointer",fontSize:"0.875rem"}}>
            📄 {isBn?"PDF ডাউনলোড":"Download PDF"}
          </button>
          <a href={"/"+loc+"/dashboard"} style={{padding:"13px",background:"white",color:"#374151",border:"1px solid #e2e8f0",borderRadius:"10px",fontWeight:600,textDecoration:"none",textAlign:"center" as const,fontSize:"0.875rem"}}>
            📊 {isBn?"ড্যাশবোর্ড":"Dashboard"}
          </a>
          <a href={"/"+loc+"/verify"}    style={{padding:"13px",background:"white",color:"#374151",border:"1px solid #e2e8f0",borderRadius:"10px",fontWeight:600,textDecoration:"none",textAlign:"center" as const,fontSize:"0.875rem"}}>
            🔍 {isBn?"ভেরিফাই":"Verify"}
          </a>
          <a href={"/"+loc+"/assess"}    style={{padding:"13px",background:"white",color:"#374151",border:"1px solid #e2e8f0",borderRadius:"10px",fontWeight:600,textDecoration:"none",textAlign:"center" as const,fontSize:"0.875rem"}}>
            🔄 {isBn?"নতুন মূল্যায়ন":"New Assessment"}
          </a>
        </div>

      </div>
    </main>
  );
}
`);

// ── 3. NEXT CONFIG — allow QR image domain ────────────────────
w('next.config.ts', `
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
    ],
  },
};

export default nextConfig;
`);

// ── 4. ENROLL PAGE — links to login after registration ────────
w('app/[locale]/enroll/page.tsx', `
"use client";
import { useState } from "react";

const FTYPES = [
  {id:"rmd",   icon:"👕", name:"RMG / Garment Manufacturing"},
  {id:"knit",  icon:"🧶", name:"Knitwear Manufacturing"},
  {id:"denim", icon:"👖", name:"Denim Manufacturing"},
  {id:"spin",  icon:"🌀", name:"Spinning / Yarn Production"},
  {id:"dye",   icon:"🎨", name:"Dyeing & Finishing"},
  {id:"sweat", icon:"🧣", name:"Sweater / Woolen Products"},
  {id:"home",  icon:"🛏️", name:"Home Textiles"},
  {id:"acc",   icon:"🔗", name:"Accessories & Trim"},
];

export default function EnrollPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;
  const [step,    setStep]    = useState(1);
  const [selType, setSelType] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [form, setForm] = useState({
    factory_name:"", contact_name:"", email:"",
    country:"Bangladesh", tier_level:"tier1", address:"", workers:"", product_type:""
  });

  const set = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(prev => ({...prev, [e.target.name]: e.target.value}));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const factory = {...form, factory_type:selType, id:Date.now().toString(), created_at:new Date().toISOString()};
    localStorage.setItem("dpp_factory", JSON.stringify(factory));
    setTimeout(() => { setLoading(false); setDone(true); }, 700);
  };

  if (done) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center",maxWidth:"500px"}}>
        <div style={{fontSize:"4rem",marginBottom:"16px"}}>✅</div>
        <h2 style={{fontSize:"1.75rem",fontWeight:800,marginBottom:"12px",color:"#0f172a"}}>
          {isBn?"নিবন্ধন সফল!":"Factory Registered!"}
        </h2>
        <p style={{color:"#64748b",marginBottom:"8px"}}>
          <strong>{form.factory_name}</strong> {isBn?"সফলভাবে নিবন্ধিত হয়েছে।":"has been registered successfully."}
        </p>
        <p style={{color:"#94a3b8",fontSize:"0.875rem",marginBottom:"32px"}}>
          {isBn?"এখন মূল্যায়ন শুরু করুন — মাত্র ১০ মিনিট লাগবে।":"Now complete your assessment — takes about 10 minutes."}
        </p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href={"/"+loc+"/assess?type="+selType} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"14px 28px",borderRadius:"12px",fontWeight:700}}>
            📋 {isBn?"মূল্যায়ন শুরু করুন":"Start Assessment"}
          </a>
          <a href={"/"+loc+"/login"} style={{border:"1px solid #e2e8f0",color:"#64748b",textDecoration:"none",padding:"14px 20px",borderRadius:"12px",fontWeight:500,fontSize:"0.875rem"}}>
            {isBn?"অ্যাকাউন্ট তৈরি করুন":"Create Account"}
          </a>
        </div>
      </div>
    </main>
  );

  const inp: React.CSSProperties = {width:"100%",padding:"12px 16px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"10px",color:"#0f172a",fontSize:"0.95rem",boxSizing:"border-box",outline:"none"};
  const lbl: React.CSSProperties = {color:"#374151",fontSize:"0.875rem",fontWeight:600,display:"block",marginBottom:"8px"};

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",padding:"24px",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:"800px",margin:"0 auto 32px"}}>
        <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,fontSize:"1.25rem",textDecoration:"none"}}>🌿 DPP Atlas</a>
        <a href={"/"+loc+"/login"} style={{color:"#64748b",textDecoration:"none",fontSize:"0.875rem"}}>
          {isBn?"লগইন":"Login"}
        </a>
      </nav>

      {step === 1 && (
        <div style={{maxWidth:"800px",margin:"0 auto"}}>
          <h1 style={{fontSize:"1.75rem",fontWeight:800,marginBottom:"8px",color:"#0f172a"}}>
            {isBn?"আপনার কারখানার ধরন বেছে নিন":"Select Your Factory Type"}
          </h1>
          <p style={{color:"#64748b",marginBottom:"32px"}}>
            {isBn?"সঠিক ধরন বেছে নিলে কাস্টম প্রশ্নাবলী পাবেন।":"Select your type to get customized compliance questions."}
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"16px",marginBottom:"32px"}}>
            {FTYPES.map(f => (
              <button key={f.id} onClick={()=>setSelType(f.id)}
                style={{border:"2px solid "+(selType===f.id?"#0d9488":"#e2e8f0"),background:selType===f.id?"#f0fdfa":"white",borderRadius:"12px",padding:"20px 16px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                <div style={{fontSize:"2rem",marginBottom:"8px"}}>{f.icon}</div>
                <div style={{fontWeight:600,fontSize:"0.875rem",color:"#0f172a"}}>{f.name}</div>
              </button>
            ))}
          </div>
          <button onClick={()=>setStep(2)} disabled={!selType}
            style={{padding:"14px 32px",background:selType?"#0d9488":"#e2e8f0",color:selType?"white":"#94a3b8",border:"none",borderRadius:"12px",fontWeight:700,fontSize:"1rem",cursor:selType?"pointer":"not-allowed"}}>
            {isBn?"পরবর্তী: কারখানার তথ্য →":"Next: Factory Details →"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
          <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",marginBottom:"24px",fontSize:"0.875rem"}}>
            ← {isBn?"ফিরে যান":"Back"}
          </button>
          <h1 style={{fontSize:"1.75rem",fontWeight:800,marginBottom:"8px",color:"#0f172a"}}>
            {FTYPES.find(f=>f.id===selType)?.icon} {isBn?"কারখানার তথ্য":"Factory Details"}
          </h1>
          <p style={{color:"#64748b",marginBottom:"32px"}}>
            Type: <strong>{FTYPES.find(f=>f.id===selType)?.name}</strong>
          </p>
          <form onSubmit={submit} style={{background:"white",borderRadius:"16px",padding:"32px",border:"1px solid #e2e8f0"}}>
            <div style={{display:"grid",gap:"20px"}}>
              <div><label style={lbl}>{isBn?"কারখানার নাম *":"Factory Name *"}</label><input name="factory_name" value={form.factory_name} onChange={set} required placeholder="ABC Textile Mills Ltd." style={inp} /></div>
              <div><label style={lbl}>{isBn?"যোগাযোগকারীর নাম *":"Contact Person *"}</label><input name="contact_name" value={form.contact_name} onChange={set} required placeholder={isBn?"আপনার পূর্ণ নাম":"Your full name"} style={inp} /></div>
              <div><label style={lbl}>{isBn?"ইমেইল *":"Email *"}</label><input name="email" type="email" value={form.email} onChange={set} required placeholder="factory@example.com" style={inp} /></div>
              <div><label style={lbl}>{isBn?"ঠিকানা":"Factory Address"}</label><input name="address" value={form.address} onChange={set} placeholder={isBn?"পূর্ণ ঠিকানা":"Full address"} style={inp} /></div>
              <div><label style={lbl}>{isBn?"কর্মীর সংখ্যা":"Number of Workers"}</label><input name="workers" type="number" value={form.workers} onChange={set} placeholder="500" style={inp} /></div>
              <div>
                <label style={lbl}>{isBn?"সরবরাহ শৃঙ্খলের স্তর *":"Supply Chain Tier *"}</label>
                <select name="tier_level" value={form.tier_level} onChange={set} style={inp}>
                  <option value="tier1">Tier 1 — Garment Manufacturing</option>
                  <option value="tier2">Tier 2 — Fabric / Dyeing</option>
                  <option value="tier3">Tier 3 — Yarn Production</option>
                  <option value="tier4">Tier 4 — Raw Fiber</option>
                </select>
              </div>
              <div>
                <label style={lbl}>{isBn?"দেশ *":"Country *"}</label>
                <select name="country" value={form.country} onChange={set} style={inp}>
                  {["Bangladesh","India","Pakistan","Sri Lanka","Vietnam","Cambodia","Indonesia","Turkey","China","Other"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{width:"100%",marginTop:"28px",padding:"16px",background:loading?"#94a3b8":"#0d9488",color:"white",border:"none",borderRadius:"12px",fontWeight:700,fontSize:"1rem",cursor:loading?"not-allowed":"pointer"}}>
              {loading?(isBn?"নিবন্ধন হচ্ছে...":"Registering..."):(isBn?"✅ কারখানা নিবন্ধন করুন":"✅ Register Factory")}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
`);

console.log('');
console.log('=== ALL 4 FILES WRITTEN ===');
console.log('');
console.log('Now run: git add . && git commit -m "Auth login + QR code on report + enroll fix" && git push');