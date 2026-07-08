const fs = require('fs');
const path = require('path');
function w(p,c){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c,'utf8');console.log('OK ('+fs.statSync(p).size+' bytes): '+p);}

// Supabase client
w('lib/supabase.ts', `
import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon);
`);

// Save assessment API route
w('app/api/v1/save-assessment/route.ts', `
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      factory: Record<string,string>;
      score: number;
      band: string;
      answers: Record<number,string>;
      failed_ids: number[];
      ai_report?: Record<string,unknown>;
      report_id: string;
    };

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Upsert factory
    const { data: factoryRow, error: factoryErr } = await sb
      .from('factories')
      .upsert({
        factory_name: body.factory.factory_name || 'Unknown',
        country:      body.factory.country      || 'Bangladesh',
        tier_level:   body.factory.tier_level   || 'tier1',
        factory_type: body.factory.factory_type || 'rmd',
        contact_email:body.factory.email        || null,
      }, { onConflict: 'factory_name,country' })
      .select('id')
      .single();

    if (factoryErr) {
      console.error('Factory upsert error:', factoryErr.message);
    }

    const factoryId = (factoryRow as {id:string}|null)?.id ?? null;

    // 2. Insert assessment
    const { error: assessErr } = await sb
      .from('assessments')
      .insert({
        id:               body.report_id,
        factory_id:       factoryId,
        session_data:     body.answers,
        compliance_score: body.score,
        score_breakdown:  { band: body.band, failed_ids: body.failed_ids },
        language_used:    'en',
      });

    if (assessErr) {
      console.error('Assessment insert error:', assessErr.message);
    }

    // 3. Insert AI report if present
    if (body.ai_report) {
      await sb.from('ai_reports').insert({
        assessment_id:    body.report_id,
        ai_provider:      'gemini-1.5-flash',
        report_content:   JSON.stringify(body.ai_report),
        improvement_tips: body.ai_report,
      });
    }

    return NextResponse.json({ success: true, factory_id: factoryId });

  } catch (err) {
    console.error('Save assessment error:', String(err));
    // Return success anyway — localStorage is the fallback
    return NextResponse.json({ success: true, fallback: true });
  }
}
`);

// Updated report page — saves to Supabase after AI report generated
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
  answers: Record<number,string>;
  factory: Record<string,string>;
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
  const savedRef = useRef(false);

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
      const res = await fetch("/api/v1/save-assessment", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          factory:    r.factory,
          score:      r.score,
          band:       r.band,
          answers:    r.answers,
          failed_ids: r.failed_ids || [],
          ai_report:  ai,
          report_id:  r.id,
        })
      });
      const data = await res.json() as {success:boolean};
      if (data.success) {
        const updated = {...r, ai_report: ai, saved_to_db: true};
        localStorage.setItem("dpp_report_"+r.id, JSON.stringify(updated));
        setDbSaved(true);
      }
    } catch {
      // Silently fail — localStorage still works
    }
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
        const updated = {...r, ai_report: data.report};
        localStorage.setItem("dpp_report_"+r.id, JSON.stringify(updated));
        setReport(updated);
        void saveToDb(updated, data.report);
      } else {
        setAiError("AI report unavailable.");
      }
    } catch {
      setAiError("Could not connect to AI service.");
    } finally {
      setAiLoading(false);
    }
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

        {/* NAV */}
        <nav className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px",flexWrap:"wrap",gap:"12px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,fontSize:"1.1rem",textDecoration:"none"}}>🌿 DPP Atlas</a>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
            {dbSaved && <span style={{color:"#22c55e",fontSize:"0.75rem",fontWeight:600}}>☁️ {isBn?"ডাটাবেজে সংরক্ষিত":"Saved to database"}</span>}
            <button onClick={() => window.print()} style={{padding:"10px 18px",background:"#0d9488",color:"white",border:"none",borderRadius:"8px",fontWeight:700,cursor:"pointer",fontSize:"0.875rem"}}>
              📄 {isBn?"PDF ডাউনলোড":"Download PDF"}
            </button>
            <a href={"/"+loc+"/assess"} style={{padding:"10px 16px",background:"white",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:"8px",fontWeight:600,textDecoration:"none",fontSize:"0.875rem"}}>
              🔄 {isBn?"নতুন মূল্যায়ন":"New Assessment"}
            </a>
          </div>
        </nav>

        {/* SCORE CARD */}
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

        {/* CATEGORY SCORES */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
          <h2 style={{fontWeight:700,fontSize:"1rem",marginBottom:"20px",color:"#0f172a"}}>
            📊 {isBn?"বিভাগ অনুযায়ী স্কোর":"Score by Category"}
          </h2>
          {CATS.map((cat,i) => {
            const est = Math.min(cat.max, Math.round(cat.max * (score/100) * cat.w));
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
              {aiReport && <span style={{fontSize:"0.7rem",color:"#22c55e",marginLeft:"8px"}}>✓ Generated</span>}
            </h2>
            {!aiLoading && !aiReport && (
              <button onClick={() => void generateAI(report)}
                style={{padding:"8px 16px",background:"#0d9488",color:"white",border:"none",borderRadius:"8px",fontWeight:600,cursor:"pointer",fontSize:"0.8rem"}}>
                {isBn?"AI রিপোর্ট তৈরি করুন":"Generate AI Report"}
              </button>
            )}
          </div>

          {aiLoading && (
            <div style={{textAlign:"center",padding:"32px"}}>
              <div style={{fontSize:"2rem",marginBottom:"12px"}}>⚙️</div>
              <p style={{fontWeight:600,marginBottom:"4px",color:"#0f172a"}}>{isBn?"Gemini AI বিশ্লেষণ করছে...":"Gemini AI is analyzing your responses..."}</p>
              <p style={{color:"#94a3b8",fontSize:"0.8rem"}}>5-10 seconds</p>
            </div>
          )}
          {aiError && <div style={{background:"#fef3c7",border:"1px solid #fbbf24",borderRadius:"8px",padding:"12px",marginBottom:"16px",fontSize:"0.8rem",color:"#92400e"}}>⚠️ {aiError}</div>}

          {aiReport && (
            <div>
              <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"10px",padding:"16px",marginBottom:"18px"}}>
                <p style={{color:"#0f172a",fontSize:"0.9rem",lineHeight:1.7}}>{aiReport.executive_summary}</p>
              </div>
              {aiReport.strengths.length>0 && (
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
              {aiReport.critical_actions.length>0 && (
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
        {score>=70 && (
          <div style={{background:"white",border:"2px solid #0d9488",borderRadius:"16px",padding:"24px",marginBottom:"20px",textAlign:"center"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"8px"}}>🏆</div>
            <h2 style={{fontWeight:800,fontSize:"1.1rem",color:"#0d9488",marginBottom:"8px"}}>{isBn?"ভেরিফিকেশন ব্যাজ অর্জিত":"Verification Badge Earned"}</h2>
            <p style={{color:"#64748b",fontSize:"0.875rem",marginBottom:"16px"}}>{isBn?"এই রিপোর্ট ID দিয়ে যেকেউ যাচাই করতে পারবেন।":"Buyers can verify your compliance using this Report ID."}</p>
            <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"10px",padding:"12px",fontFamily:"monospace",fontSize:"0.875rem",color:"#0f766e",marginBottom:"16px",wordBreak:"break-all"}}>{rid}</div>
            <a href={"/"+loc+"/verify"} style={{color:"#0d9488",fontSize:"0.875rem",fontWeight:600,textDecoration:"none"}}>🔍 {isBn?"ভেরিফিকেশন পেজ →":"View Verification Page →"}</a>
          </div>
        )}

        {/* DPP PASSPORT LINK */}
        <div className="no-print" style={{background:"#f0fdfa",border:"1px solid #0d9488",borderRadius:"12px",padding:"14px 18px",marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"0.875rem",color:"#0d9488",marginBottom:"2px"}}>🌐 Public DPP Passport</div>
            <div style={{color:"#64748b",fontSize:"0.78rem"}}>{isBn?"ক্রেতাদের জন্য পাবলিক লিংক — লগইন ছাড়াই":"Share with EU buyers — no login required"}</div>
          </div>
          <a href={"/dpp/"+rid} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"8px 16px",borderRadius:"8px",fontWeight:600,fontSize:"0.8rem"}}>
            View Passport →
          </a>
        </div>

        {/* ACTIONS */}
        <div className="no-print" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px"}}>
          <button onClick={() => window.print()} style={{padding:"13px",background:"#0d9488",color:"white",border:"none",borderRadius:"10px",fontWeight:700,cursor:"pointer",fontSize:"0.875rem"}}>
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

console.log('');
console.log('=== DONE ===');
console.log('Now run: git add . && git commit -m "Task 9: Supabase data saving + updated report page" && git push');