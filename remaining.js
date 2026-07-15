const fs = require('fs');
const path = require('path');
function w(p,c){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c,'utf8');console.log('OK ('+fs.statSync(p).size+' bytes): '+p);}

// ── SCORE TREND CHART ON DASHBOARD ───────────────────────────
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

function getBandColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#eab308";
  if (score >= 50) return "#f97316";
  return "#ef4444";
}

function ScoreChart({ reports }: { reports: LocalReport[] }) {
  if (reports.length < 2) return null;
  const maxScore = 100;
  const w = 500, h = 120, pad = 30;
  const pts = reports.slice().reverse();
  const xStep = (w - pad * 2) / (pts.length - 1);

  const points = pts.map((r, i) => ({
    x: pad + i * xStep,
    y: h - pad - ((Math.min(100, r.score) / maxScore) * (h - pad * 2)),
    score: Math.min(100, r.score),
    date: new Date(r.created_at).toLocaleDateString("en-GB", {day:"numeric", month:"short"}),
  }));

  const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + p.x + " " + p.y).join(" ");

  return (
    <div style={{marginTop:"16px"}}>
      <div style={{fontSize:"0.875rem",fontWeight:700,color:"#0f172a",marginBottom:"8px"}}>
        📈 Score Trend
      </div>
      <svg width="100%" viewBox={"0 0 " + w + " " + h} style={{overflow:"visible"}}>
        {/* Grid lines */}
        {[0,25,50,75,100].map(v => {
          const y = h - pad - (v / maxScore) * (h - pad * 2);
          return (
            <g key={v}>
              <line x1={pad} y1={y} x2={w-pad} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={pad-4} y={y+3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}</text>
            </g>
          );
        })}
        {/* Line */}
        <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Area fill */}
        <path d={pathD + " L" + points[points.length-1].x + " " + (h-pad) + " L" + pad + " " + (h-pad) + " Z"}
          fill="#0d948815" />
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill={getBandColor(p.score)} stroke="white" strokeWidth="2" />
            <text x={p.x} y={p.y-10} textAnchor="middle" fontSize="8" fill="#374151" fontWeight="600">{p.score}</text>
            <text x={p.x} y={h-8} textAnchor="middle" fontSize="7" fill="#94a3b8">{p.date}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function DashboardPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;

  const [factory, setFactory]  = useState<Record<string,string> | null>(null);
  const [reports, setReports]  = useState<LocalReport[]>([]);
  const [loading, setLoading]  = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const f = localStorage.getItem("dpp_factory");
    if (f) setFactory(JSON.parse(f) as Record<string,string>);
    const email = localStorage.getItem("dpp_user_email");
    if (email) setUserEmail(email);

    const all: LocalReport[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("dpp_report_")) {
        try {
          const r = JSON.parse(localStorage.getItem(key) || "") as LocalReport;
          if (r.id && r.score !== undefined) all.push(r);
        } catch { /* skip */ }
      }
    }
    all.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setReports(all);
    setLoading(false);
  }, []);

  if (loading) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <p style={{color:"#64748b"}}>Loading...</p>
    </main>
  );

  if (!factory) return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:"16px"}}>🏭</div>
        <h2 style={{color:"#0f172a",fontSize:"1.5rem",fontWeight:700,marginBottom:"12px"}}>
          {isBn?"কোনো কারখানা নিবন্ধিত নেই":"No factory registered yet"}
        </h2>
        <a href={"/"+loc+"/enroll"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"14px 28px",borderRadius:"12px",fontWeight:700}}>
          🏭 {isBn?"কারখানা নিবন্ধন করুন":"Register Factory"}
        </a>
      </div>
    </main>
  );

  const latest = reports[0];
  const latestScore = latest ? Math.min(100, latest.score) : null;
  const avg = reports.length > 0 ? Math.round(reports.reduce((s,r) => s + Math.min(100,r.score), 0) / reports.length) : 0;
  const best = reports.length > 0 ? Math.min(100, Math.max(...reports.map(r => r.score))) : 0;

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"system-ui,sans-serif",padding:"24px"}}>
      <div style={{maxWidth:"960px",margin:"0 auto"}}>

        <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"28px",flexWrap:"wrap",gap:"12px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,fontSize:"1.1rem",textDecoration:"none"}}>🌿 DPP Atlas</a>
          <div style={{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
            {userEmail && <span style={{color:"#64748b",fontSize:"0.8rem"}}>👤 {userEmail}</span>}
            <a href={"/"+loc+"/assess"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"9px 18px",borderRadius:"10px",fontWeight:600,fontSize:"0.875rem"}}>
              + {isBn?"নতুন মূল্যায়ন":"New Assessment"}
            </a>
            <a href={"/"+loc+"/login"} style={{background:"white",color:"#64748b",border:"1px solid #e2e8f0",textDecoration:"none",padding:"9px 14px",borderRadius:"10px",fontWeight:500,fontSize:"0.875rem"}}>
              {isBn?"লগইন":"Login"}
            </a>
          </div>
        </nav>

        {/* FACTORY CARD */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"22px",marginBottom:"20px",display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap"}}>
          <div style={{width:"52px",height:"52px",background:"#0d9488",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>🏭</div>
          <div style={{flex:1}}>
            <h1 style={{color:"#0f172a",fontSize:"1.3rem",fontWeight:800,marginBottom:"3px"}}>{factory.factory_name}</h1>
            <p style={{color:"#64748b",fontSize:"0.8rem"}}>{factory.country} · {factory.tier_level || "Tier 1"} · {factory.factory_type || "RMG"}</p>
          </div>
          {latestScore !== null && (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"2rem",fontWeight:800,color:getBandColor(latestScore)}}>{latestScore}</div>
              <div style={{color:"#94a3b8",fontSize:"0.72rem"}}>{isBn?"সর্বশেষ স্কোর":"Latest /100"}</div>
            </div>
          )}
        </div>

        {/* STATS ROW */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"14px",marginBottom:"20px"}}>
          {[
            {icon:"📋", n:String(reports.length),          l:isBn?"মোট মূল্যায়ন":"Total Assessments"},
            {icon:"⭐", n:latestScore !== null ? latestScore+"/100" : "—", l:isBn?"সর্বশেষ স্কোর":"Latest Score"},
            {icon:"🏆", n:best > 0 ? best+"/100" : "—",   l:isBn?"সর্বোচ্চ স্কোর":"Best Score"},
            {icon:"📊", n:avg > 0  ? avg+"/100"  : "—",   l:isBn?"গড় স্কোর":"Average Score"},
            {icon:"🎯", n:latestScore !== null ? (latestScore>=70?"✅ Ready":"⚠️ Work needed") : "—", l:isBn?"EU স্ট্যাটাস":"EU Status"},
          ].map((s,i) => (
            <div key={i} style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"12px",padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:"1.4rem",marginBottom:"6px"}}>{s.icon}</div>
              <div style={{fontWeight:800,fontSize:"1rem",color:"#0f172a",marginBottom:"3px"}}>{s.n}</div>
              <div style={{color:"#94a3b8",fontSize:"0.72rem"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* CHART + ASSESSMENTS */}
        <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"8px"}}>
            <h2 style={{fontWeight:700,fontSize:"1rem",color:"#0f172a"}}>
              📋 {isBn?"আপনার মূল্যায়ন ইতিহাস":"Assessment History"}
            </h2>
            <a href={"/"+loc+"/assess"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"7px 14px",borderRadius:"8px",fontWeight:600,fontSize:"0.78rem"}}>
              + {isBn?"নতুন":"New"}
            </a>
          </div>

          {/* TREND CHART */}
          <ScoreChart reports={reports} />

          {reports.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px 24px"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"12px"}}>📋</div>
              <h3 style={{color:"#0f172a",marginBottom:"10px",fontSize:"1rem"}}>{isBn?"কোনো মূল্যায়ন নেই":"No assessments yet"}</h3>
              <p style={{color:"#94a3b8",marginBottom:"20px",fontSize:"0.82rem"}}>{isBn?"আপনার প্রথম DPP মূল্যায়ন শুরু করুন।":"Complete your first DPP assessment."}</p>
              <a href={"/"+loc+"/assess"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"12px 24px",borderRadius:"10px",fontWeight:700,fontSize:"0.875rem"}}>
                📋 {isBn?"শুরু করুন":"Start Assessment"}
              </a>
            </div>
          ) : (
            <div style={{display:"grid",gap:"10px",marginTop:"16px"}}>
              {reports.map((r,i) => {
                const sc  = Math.min(100, r.score);
                const clr = getBandColor(sc);
                return (
                  <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px",border:"1px solid #f1f5f9",borderRadius:"12px",flexWrap:"wrap",gap:"10px",background: i===0?"#f0fdfa":"white"}}>
                    <div>
                      {i===0 && <span style={{background:"#dcfce7",color:"#16a34a",padding:"2px 8px",borderRadius:"99px",fontSize:"0.68rem",fontWeight:700,display:"inline-block",marginBottom:"3px"}}>LATEST</span>}
                      <div style={{color:"#64748b",fontSize:"0.75rem",marginBottom:"2px"}}>
                        {new Date(r.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <span style={{fontSize:"1.5rem",fontWeight:800,color:clr}}>{sc}</span>
                        <span style={{color:"#64748b",fontSize:"0.78rem"}}>/100</span>
                        <span style={{padding:"3px 8px",background:clr+"20",border:"1px solid "+clr,borderRadius:"99px",color:clr,fontSize:"0.68rem",fontWeight:700}}>
                          {r.band?.replace(/✅|🟡|🟠|🔴/g,"").trim()}
                        </span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                      <a href={"/"+loc+"/report/"+r.id} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"7px 14px",borderRadius:"8px",fontWeight:600,fontSize:"0.78rem"}}>
                        {isBn?"রিপোর্ট":"Report"}
                      </a>
                      <a href={"/dpp/"+r.id} style={{background:"white",color:"#0d9488",border:"1px solid #0d9488",textDecoration:"none",padding:"7px 14px",borderRadius:"8px",fontWeight:600,fontSize:"0.78rem"}}>
                        DPP
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* NEXT STEPS CARD */}
        {reports.length > 0 && (latest ? Math.min(100,latest.score) : 0) < 90 && (
          <div style={{background:"#0f172a",borderRadius:"16px",padding:"22px",color:"white",textAlign:"center"}}>
            <h3 style={{fontWeight:700,marginBottom:"8px",fontSize:"1rem"}}>
              {isBn?"স্কোর উন্নত করুন":"Improve Your Score"}
            </h3>
            <p style={{color:"#94a3b8",fontSize:"0.82rem",marginBottom:"16px"}}>
              {isBn?"AI রোডম্যাপ অনুসরণ করুন এবং পুনরায় মূল্যায়ন করুন।":"Follow your AI roadmap, implement improvements, then reassess."}
            </p>
            <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
              {latest && (
                <a href={"/"+loc+"/report/"+latest.id} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"10px 20px",borderRadius:"10px",fontWeight:700,fontSize:"0.82rem"}}>
                  📊 {isBn?"AI রোডম্যাপ দেখুন":"View AI Roadmap"}
                </a>
              )}
              <a href={"/"+loc+"/assess"} style={{border:"1px solid #334155",color:"#94a3b8",textDecoration:"none",padding:"10px 16px",borderRadius:"10px",fontWeight:500,fontSize:"0.82rem"}}>
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

// ── EMAIL NOTIFICATION API (Resend free tier) ─────────────────
w('app/api/v1/send-email/route.ts', `
import { NextRequest, NextResponse } from 'next/server';

interface EmailBody {
  to: string;
  factory_name: string;
  score: number;
  band: string;
  report_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as EmailBody;
    const RESEND_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_KEY) {
      return NextResponse.json({ success: false, reason: "No Resend key" });
    }

    const scoreColor = body.score >= 90 ? "#22c55e" : body.score >= 70 ? "#eab308" : body.score >= 50 ? "#f97316" : "#ef4444";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dpp-atlas.vercel.app";

    const html = [
      '<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">',
      '<div style="background:#0f172a;padding:24px;text-align:center;">',
      '<h1 style="color:#14b8a6;margin:0;font-size:1.4rem;">🌿 DPP Atlas</h1>',
      '<p style="color:#94a3b8;margin:8px 0 0;font-size:0.85rem;">EU ESPR Textile Compliance Platform</p>',
      '</div>',
      '<div style="padding:32px;">',
      '<h2 style="color:#0f172a;margin-bottom:8px;">Assessment Complete</h2>',
      '<p style="color:#64748b;">Dear <strong>' + body.factory_name + '</strong>,</p>',
      '<p style="color:#64748b;">Your DPP compliance assessment has been completed. Here is your result:</p>',
      '<div style="text-align:center;padding:24px;background:#f8fafc;border-radius:12px;margin:20px 0;">',
      '<div style="font-size:3.5rem;font-weight:800;color:' + scoreColor + ';">' + Math.min(100,body.score) + '</div>',
      '<div style="color:#64748b;font-size:0.9rem;">/100 Compliance Score</div>',
      '<div style="margin-top:8px;font-weight:700;color:' + scoreColor + ';">' + body.band + '</div>',
      '</div>',
      '<div style="margin:20px 0;">',
      '<a href="' + appUrl + '/en/report/' + body.report_id + '" style="background:#0d9488;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">',
      '📄 View Full AI Report',
      '</a>',
      '</div>',
      '<p style="color:#94a3b8;font-size:0.78rem;margin-top:24px;padding-top:16px;border-top:1px solid #f1f5f9;">',
      'Report ID: ' + body.report_id + '<br/>',
      'This report is AI-generated based on self-reported data. Not a legal certificate.',
      '</p>',
      '</div>',
      '</div>',
    ].join('');

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + RESEND_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "DPP Atlas <reports@dpp-atlas.vercel.app>",
        to: [body.to],
        subject: "Your DPP Compliance Report — " + body.factory_name + " — Score: " + Math.min(100,body.score) + "/100",
        html: html
      })
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ success: false, reason: err });
    }
  } catch (err) {
    console.error("Email error:", String(err));
    return NextResponse.json({ success: false });
  }
}
`);

console.log('');
console.log('=== DONE ===');
console.log('Now run: git add . && git commit -m "Score trend chart + email notification API" && git push');