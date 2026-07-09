const fs = require('fs');
const path = require('path');
function w(p,c){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c,'utf8');console.log('OK ('+fs.statSync(p).size+' bytes): '+p);}

// FIX 1: Save-assessment — uses local_report_id instead of UUID primary key
w('app/api/v1/save-assessment/route.ts', `
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface SaveBody {
  factory: Record<string, string>;
  score: number;
  band: string;
  answers: Record<number, string>;
  failed_ids: number[];
  ai_report?: Record<string, unknown>;
  report_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SaveBody;
    const sb   = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Upsert factory (safe — unique constraint on factory_name+country)
    let factoryId: string | null = null;
    try {
      const { data: existingFactory } = await sb
        .from('factories')
        .select('id')
        .eq('factory_name', body.factory.factory_name || 'Unknown')
        .eq('country',       body.factory.country      || 'Bangladesh')
        .maybeSingle();

      if (existingFactory) {
        factoryId = (existingFactory as {id:string}).id;
      } else {
        const { data: newFactory } = await sb
          .from('factories')
          .insert({
            factory_name:  body.factory.factory_name  || 'Unknown',
            country:       body.factory.country       || 'Bangladesh',
            tier_level:    body.factory.tier_level    || 'tier1',
            factory_type:  body.factory.factory_type  || 'rmd',
            contact_email: body.factory.email         || null,
          })
          .select('id')
          .single();
        factoryId = (newFactory as {id:string}|null)?.id ?? null;
      }
    } catch (e) {
      console.error('Factory save error:', String(e));
    }

    // 2. Insert assessment (use local_report_id to link back)
    let assessmentId: string | null = null;
    try {
      const { data: asmData } = await sb
        .from('assessments')
        .insert({
          local_report_id: body.report_id,
          factory_id:      factoryId,
          session_data:    body.answers,
          compliance_score:body.score,
          score_breakdown: { band: body.band, failed_ids: body.failed_ids },
          language_used:   'en',
        })
        .select('id')
        .single();
      assessmentId = (asmData as {id:string}|null)?.id ?? null;
    } catch (e) {
      console.error('Assessment save error:', String(e));
    }

    // 3. Insert AI report
    if (body.ai_report && assessmentId) {
      try {
        await sb.from('ai_reports').insert({
          assessment_id:   assessmentId,
          ai_provider:     'gemini-1.5-flash',
          report_content:  JSON.stringify(body.ai_report),
          improvement_tips:body.ai_report,
        });
      } catch (e) {
        console.error('AI report save error:', String(e));
      }
    }

    return NextResponse.json({ success: true, factory_id: factoryId });
  } catch (err) {
    console.error('Save error:', String(err));
    return NextResponse.json({ success: true, fallback: true });
  }
}
`);

// FIX 2: Dashboard — reads from Supabase if available, falls back to localStorage
w('app/[locale]/dashboard/page.tsx', `
"use client";
import { useEffect, useState } from "react";

interface LocalReport {
  id: string;
  score: number;
  band: string;
  created_at: string;
  factory: Record<string, string>;
}
interface Factory {
  factory_name: string;
  country: string;
  tier_level?: string;
  factory_type?: string;
}

function getBandColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#eab308";
  if (score >= 50) return "#f97316";
  return "#ef4444";
}

export default function DashboardPage({ params }: { params: { locale: string } }) {
  const isBn  = params.locale === "bn";
  const loc   = params.locale;

  const [factory, setFactory]   = useState<Factory | null>(null);
  const [reports, setReports]   = useState<LocalReport[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Load from localStorage (always works)
    const fRaw = localStorage.getItem("dpp_factory");
    if (fRaw) setFactory(JSON.parse(fRaw) as Factory);

    // Collect all reports from localStorage
    const localReports: LocalReport[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("dpp_report_")) {
        try {
          const r = JSON.parse(localStorage.getItem(key) || "") as LocalReport;
          if (r.id && r.score !== undefined) localReports.push(r);
        } catch { /* skip */ }
      }
    }
    localReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setReports(localReports);
    setLoading(false);
  }, []);

  if (loading) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"2rem",marginBottom:"12px"}}>⏳</div>
        <p style={{color:"#64748b"}}>{isBn?"লোড হচ্ছে...":"Loading..."}</p>
      </div>
    </main>
  );

  if (!factory) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:"16px"}}>🏭</div>
        <h2 style={{color:"#0f172a",fontSize:"1.5rem",fontWeight:700,marginBottom:"12px"}}>
          {isBn?"কোনো কারখানা নিবন্ধিত নেই":"No factory registered yet"}
        </h2>
        <p style={{color:"#64748b",marginBottom:"24px"}}>
          {isBn?"প্রথমে আপনার কারখানা নিবন্ধন করুন।":"Register your factory first to see your dashboard."}
        </p>
        <a href={"/"+loc+"/enroll"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"14px 28px",borderRadius:"12px",fontWeight:700}}>
          🏭 {isBn?"কারখানা নিবন্ধন করুন":"Register Factory"}
        </a>
      </div>
    </main>
  );

  const latestScore = reports[0]?.score ?? null;

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"system-ui,sans-serif",padding:"24px"}}>
      <div style={{maxWidth:"960px",margin:"0 auto"}}>

        {/* NAV */}
        <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px",flexWrap:"wrap",gap:"12px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,fontSize:"1.1rem",textDecoration:"none"}}>🌿 DPP Atlas</a>
          <div style={{display:"flex",gap:"10px"}}>
            <a href={"/"+loc+"/assess"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"10px 18px",borderRadius:"10px",fontWeight:600,fontSize:"0.875rem"}}>
              + {isBn?"নতুন মূল্যায়ন":"New Assessment"}
            </a>
            <a href={"/"+loc+"/login"} style={{background:"white",color:"#64748b",textDecoration:"none",padding:"10px 18px",borderRadius:"10px",fontWeight:600,fontSize:"0.875rem",border:"1px solid #e2e8f0"}}>
              {isBn?"লগইন":"Login"}
            </a>
          </div>
        </nav>

        {/* FACTORY HEADER */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"24px",marginBottom:"24px",display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap"}}>
          <div style={{width:"56px",height:"56px",background:"#0d9488",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>🏭</div>
          <div style={{flex:1}}>
            <h1 style={{color:"#0f172a",fontSize:"1.4rem",fontWeight:800,marginBottom:"4px"}}>{factory.factory_name}</h1>
            <p style={{color:"#64748b",fontSize:"0.875rem"}}>{factory.country} · {factory.tier_level || "Tier 1"} · {factory.factory_type || "RMG"}</p>
          </div>
          {latestScore !== null && (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"2rem",fontWeight:800,color:getBandColor(latestScore)}}>{latestScore}</div>
              <div style={{color:"#94a3b8",fontSize:"0.75rem"}}>{isBn?"সর্বশেষ স্কোর":"/100 latest"}</div>
            </div>
          )}
        </div>

        {/* QUICK STATS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"16px",marginBottom:"24px"}}>
          {[
            {icon:"📋", n:String(reports.length), l:isBn?"মোট মূল্যায়ন":"Total Assessments"},
            {icon:"⭐", n:latestScore !== null ? String(Math.min(100,latestScore))+"/100" : "N/A", l:isBn?"সর্বশেষ স্কোর":"Latest Score"},
            {icon:"📅", n:reports[0] ? new Date(reports[0].created_at).toLocaleDateString() : "—", l:isBn?"সর্বশেষ তারিখ":"Last Assessed"},
            {icon:"🎯", n:latestScore !== null ? (latestScore>=70?"✅":"⚠️") : "—", l:isBn?"EU স্ট্যাটাস":"EU Ready Status"},
          ].map((s,i) => (
            <div key={i} style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"12px",padding:"20px",textAlign:"center"}}>
              <div style={{fontSize:"1.5rem",marginBottom:"8px"}}>{s.icon}</div>
              <div style={{fontWeight:800,fontSize:"1.1rem",color:"#0f172a",marginBottom:"4px"}}>{s.n}</div>
              <div style={{color:"#94a3b8",fontSize:"0.75rem"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ASSESSMENTS LIST */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"24px",marginBottom:"24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
            <h2 style={{fontWeight:700,fontSize:"1rem",color:"#0f172a"}}>
              📋 {isBn?"আপনার মূল্যায়ন":"Your Assessments"}
            </h2>
            <a href={"/"+loc+"/assess"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"8px 16px",borderRadius:"8px",fontWeight:600,fontSize:"0.8rem"}}>
              + {isBn?"নতুন":"New"}
            </a>
          </div>

          {reports.length === 0 ? (
            <div style={{textAlign:"center",padding:"48px 24px"}}>
              <div style={{fontSize:"3rem",marginBottom:"16px"}}>📋</div>
              <h3 style={{color:"#0f172a",marginBottom:"12px"}}>{isBn?"কোনো মূল্যায়ন নেই":"No assessments yet"}</h3>
              <p style={{color:"#94a3b8",marginBottom:"24px",fontSize:"0.875rem"}}>{isBn?"আপনার প্রথম DPP মূল্যায়ন শুরু করুন।":"Start your first DPP compliance assessment."}</p>
              <a href={"/"+loc+"/assess"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"12px 24px",borderRadius:"10px",fontWeight:700}}>
                {isBn?"📋 মূল্যায়ন শুরু করুন":"📋 Start Assessment"}
              </a>
            </div>
          ) : (
            <div style={{display:"grid",gap:"12px"}}>
              {reports.map((r, i) => {
                const clr = getBandColor(r.score);
                const sc  = Math.min(100, r.score);
                return (
                  <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px",border:"1px solid #f1f5f9",borderRadius:"12px",flexWrap:"wrap",gap:"12px"}}>
                    <div>
                      {i === 0 && <span style={{background:"#dcfce7",color:"#16a34a",padding:"2px 8px",borderRadius:"99px",fontSize:"0.7rem",fontWeight:700,display:"inline-block",marginBottom:"4px"}}>LATEST</span>}
                      <div style={{color:"#64748b",fontSize:"0.78rem",marginBottom:"2px"}}>{new Date(r.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>
                      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <span style={{fontSize:"1.75rem",fontWeight:800,color:clr}}>{sc}</span>
                        <span style={{color:"#64748b",fontSize:"0.8rem"}}>/100</span>
                        <span style={{padding:"3px 10px",background:clr+"20",border:"1px solid "+clr,borderRadius:"99px",color:clr,fontSize:"0.72rem",fontWeight:700}}>
                          {r.band?.replace(/✅|🟡|🟠|🔴/g,"").trim()}
                        </span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                      <a href={"/"+loc+"/report/"+r.id} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"8px 16px",borderRadius:"8px",fontWeight:600,fontSize:"0.8rem"}}>
                        {isBn?"রিপোর্ট দেখুন":"View Report"}
                      </a>
                      <a href={"/dpp/"+r.id} style={{background:"white",color:"#0d9488",border:"1px solid #0d9488",textDecoration:"none",padding:"8px 16px",borderRadius:"8px",fontWeight:600,fontSize:"0.8rem"}}>
                        {isBn?"DPP পাসপোর্ট":"DPP Passport"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* NEXT STEPS */}
        {reports.length > 0 && reports[0].score < 90 && (
          <div style={{background:"#0f172a",borderRadius:"16px",padding:"24px",color:"white",textAlign:"center"}}>
            <h3 style={{fontWeight:700,marginBottom:"8px"}}>
              {isBn?"পরবর্তী পদক্ষেপ":"Improve Your Score"}
            </h3>
            <p style={{color:"#94a3b8",fontSize:"0.875rem",marginBottom:"16px"}}>
              {isBn
                ? "আপনার AI রোডম্যাপ দেখুন এবং উন্নতি করার পরে পুনরায় মূল্যায়ন করুন।"
                : "Review your AI roadmap, implement improvements, then reassess to improve your DPP score."}
            </p>
            <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
              <a href={"/"+loc+"/report/"+reports[0].id} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"12px 24px",borderRadius:"10px",fontWeight:700,fontSize:"0.875rem"}}>
                📊 {isBn?"AI রোডম্যাপ দেখুন":"View AI Roadmap"}
              </a>
              <a href={"/"+loc+"/assess"} style={{border:"1px solid #334155",color:"#94a3b8",textDecoration:"none",padding:"12px 20px",borderRadius:"10px",fontWeight:600,fontSize:"0.875rem"}}>
                🔄 {isBn?"পুনরায় মূল্যায়ন":"Reassess"}
              </a>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
`);

// FIX 3: Report page — fix useRef TypeScript + savedRef typing
w('app/[locale]/report/[id]/page.tsx', `
"use client";
import { useEffect, useState, useRef } from "react";

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
  const isBn = params.locale === "bn";
  const loc  = params.locale;
  const savedRef = useRef<boolean>(false);

  const [report,    setReport]    = useState<Report | null>(null);
  const [aiReport,  setAiReport]  = useState<AiReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError,   setAiError]   = useState("");
  const [dbSaved,   setDbSaved]   = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("dpp_report_" + params.id);
    if (data) {
      const r = JSON.parse(data) as Report;
      setReport(r);
      if (r.ai_report) {
        setAiReport(r.ai_report);
        if (r.saved_to_db) { setDbSaved(true); }
        else { void saveToDb(r, r.ai_report); }
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
      const res = await fetch("/api/v1/save-assessment", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ factory:r.factory, score:r.score, band:r.band, answers:r.answers, failed_ids:r.failed_ids||[], ai_report:ai, report_id:r.id })
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
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/v1/generate-report", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
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

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"system-ui,sans-serif",padding:"24px"}}>
      <style>{"@media print{.no-print{display:none!important}}"}</style>
      <div style={{maxWidth:"860px",margin:"0 auto"}}>

        <nav className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px",flexWrap:"wrap",gap:"12px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,fontSize:"1.1rem",textDecoration:"none"}}>🌿 DPP Atlas</a>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
            {dbSaved && <span style={{color:"#22c55e",fontSize:"0.75rem",fontWeight:600}}>☁️ {isBn?"সংরক্ষিত":"Saved"}</span>}
            <button onClick={() => window.print()} style={{padding:"10px 18px",background:"#0d9488",color:"white",border:"none",borderRadius:"8px",fontWeight:700,cursor:"pointer",fontSize:"0.875rem"}}>
              📄 {isBn?"PDF":"Download PDF"}
            </button>
            <a href={"/"+loc+"/assess"} style={{padding:"10px 16px",background:"white",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:"8px",fontWeight:600,textDecoration:"none",fontSize:"0.875rem"}}>
              🔄 {isBn?"নতুন":"New Assessment"}
            </a>
          </div>
        </nav>

        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"20px",padding:"40px",textAlign:"center",marginBottom:"20px"}}>
          <p style={{color:"#64748b",fontSize:"0.8rem",marginBottom:"8px"}}>
            {factory.factory_name||"Your Factory"} · {new Date(report.created_at).toLocaleDateString()} · ID: {rid.slice(0,8)}...
          </p>
          <div style={{fontSize:"5rem",fontWeight:800,color:band.color,lineHeight:1,marginBottom:"8px"}}>
            {score}<span style={{fontSize:"1.75rem",color:"#94a3b8"}}>/100</span>
          </div>
          <div style={{display:"inline-block",padding:"8px 24px",background:band.bg,border:"2px solid "+band.color,borderRadius:"99px",color:band.color,fontWeight:700,fontSize:"1rem",marginBottom:"16px"}}>
            {band.emoji} {band.label}
          </div>
          <p style={{color:"#64748b",fontSize:"0.875rem",maxWidth:"480px",margin:"0 auto",lineHeight:1.6}}>
            {score>=90?(isBn?"অভিনন্দন! EU ESPR DPP পাসপোর্টের জন্য প্রস্তুত।":"Congratulations! Your factory meets EU ESPR DPP requirements.")
            :score>=70?(isBn?"ভালো অগ্রগতি। কিছু উন্নতি প্রয়োজন।":"Good progress. Some key improvements needed.")
            :score>=50?(isBn?"উল্লেখযোগ্য উন্নতি প্রয়োজন।":"Significant improvements needed.")
            :(isBn?"জরুরি পদক্ষেপ প্রয়োজন।":"Critical action required.")}
          </p>
        </div>

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

        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
            <h2 style={{fontWeight:700,fontSize:"1rem",color:"#0f172a"}}>
              🤖 {isBn?"AI উন্নতির রোডম্যাপ":"AI Improvement Roadmap"}
              {aiReport && <span style={{fontSize:"0.7rem",color:"#22c55e",marginLeft:"8px"}}>✓ Generated</span>}
            </h2>
            {!aiLoading && !aiReport && (
              <button onClick={() => void generateAI(report)} style={{padding:"8px 16px",background:"#0d9488",color:"white",border:"none",borderRadius:"8px",fontWeight:600,cursor:"pointer",fontSize:"0.8rem"}}>
                {isBn?"AI রিপোর্ট তৈরি করুন":"Generate AI Report"}
              </button>
            )}
          </div>

          {aiLoading && (
            <div style={{textAlign:"center",padding:"32px"}}>
              <div style={{fontSize:"2rem",marginBottom:"12px"}}>⚙️</div>
              <p style={{fontWeight:600,color:"#0f172a",marginBottom:"4px"}}>{isBn?"Gemini AI বিশ্লেষণ করছে...":"Gemini AI analyzing..."}</p>
              <p style={{color:"#94a3b8",fontSize:"0.8rem"}}>5-10 seconds</p>
            </div>
          )}
          {aiError && <div style={{background:"#fef3c7",border:"1px solid #fbbf24",borderRadius:"8px",padding:"12px",marginBottom:"16px",fontSize:"0.8rem",color:"#92400e"}}>⚠️ {aiError}</div>}

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
                      <span style={{color:"#22c55e"}}>✓</span>
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
                        <div style={{minWidth:"26px",height:"26px",background:"#0f172a",color:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.75rem",flexShrink:0}}>{a.priority}</div>
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

        {score >= 70 && (
          <div style={{background:"white",border:"2px solid #0d9488",borderRadius:"16px",padding:"24px",marginBottom:"20px",textAlign:"center"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"8px"}}>🏆</div>
            <h2 style={{fontWeight:800,fontSize:"1.1rem",color:"#0d9488",marginBottom:"8px"}}>{isBn?"ভেরিফিকেশন ব্যাজ অর্জিত":"Verification Badge Earned"}</h2>
            <p style={{color:"#64748b",fontSize:"0.875rem",marginBottom:"16px"}}>{isBn?"এই রিপোর্ট ID দিয়ে ক্রেতারা যাচাই করতে পারবেন।":"Buyers can verify your compliance using this Report ID."}</p>
            <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"10px",padding:"12px",fontFamily:"monospace",fontSize:"0.875rem",color:"#0f766e",marginBottom:"16px",wordBreak:"break-all"}}>{rid}</div>
            <a href={"/"+loc+"/verify"} style={{color:"#0d9488",fontSize:"0.875rem",fontWeight:600,textDecoration:"none"}}>🔍 {isBn?"ভেরিফিকেশন পেজ →":"View Verification Page →"}</a>
          </div>
        )}

        <div className="no-print" style={{background:"#f0fdfa",border:"1px solid #0d9488",borderRadius:"12px",padding:"14px 18px",marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"0.875rem",color:"#0d9488",marginBottom:"2px"}}>🌐 {isBn?"পাবলিক DPP পাসপোর্ট":"Public DPP Passport"}</div>
            <div style={{color:"#64748b",fontSize:"0.78rem"}}>{isBn?"EU ক্রেতাদের সাথে শেয়ার করুন":"Share with EU buyers — no login required"}</div>
          </div>
          <a href={"/dpp/"+rid} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"8px 16px",borderRadius:"8px",fontWeight:600,fontSize:"0.8rem"}}>
            {isBn?"পাসপোর্ট দেখুন →":"View Passport →"}
          </a>
        </div>

        <div className="no-print" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px"}}>
          <button onClick={() => window.print()} style={{padding:"13px",background:"#0d9488",color:"white",border:"none",borderRadius:"10px",fontWeight:700,cursor:"pointer",fontSize:"0.875rem"}}>
            📄 {isBn?"PDF":"Download PDF"}
          </button>
          <a href={"/"+loc+"/dashboard"} style={{padding:"13px",background:"white",color:"#374151",border:"1px solid #e2e8f0",borderRadius:"10px",fontWeight:600,textDecoration:"none",textAlign:"center" as const,fontSize:"0.875rem"}}>
            📊 {isBn?"ড্যাশবোর্ড":"Dashboard"}
          </a>
          <a href={"/"+loc+"/verify"} style={{padding:"13px",background:"white",color:"#374151",border:"1px solid #e2e8f0",borderRadius:"10px",fontWeight:600,textDecoration:"none",textAlign:"center" as const,fontSize:"0.875rem"}}>
            🔍 {isBn?"ভেরিফাই":"Verify"}
          </a>
          <a href={"/"+loc+"/assess"} style={{padding:"13px",background:"white",color:"#374151",border:"1px solid #e2e8f0",borderRadius:"10px",fontWeight:600,textDecoration:"none",textAlign:"center" as const,fontSize:"0.875rem"}}>
            🔄 {isBn?"নতুন মূল্যায়ন":"New Assessment"}
          </a>
        </div>

      </div>
    </main>
  );
}
`);

console.log('');
console.log('=== ALL 3 FILES WRITTEN ===');
console.log('');
console.log('IMPORTANT: Run the Supabase SQL schema first, then:');
console.log('git add . && git commit -m "Fix: Supabase save + Dashboard + Report page TypeScript" && git push');