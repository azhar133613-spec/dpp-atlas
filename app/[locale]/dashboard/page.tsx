"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
        {[0,25,50,75,100].map(v => {
          const y = h - pad - (v / maxScore) * (h - pad * 2);
          return (
            <g key={v}>
              <line x1={pad} y1={y} x2={w-pad} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={pad-4} y={y+3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}</text>
            </g>
          );
        })}
        <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathD + " L" + points[points.length-1].x + " " + (h-pad) + " L" + pad + " " + (h-pad) + " Z"}
          fill="#0d948815" />
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

async function fetchFromSupabase(token: string): Promise<{ factory: Record<string,string> | null; reports: LocalReport[] } | null> {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: userData } = await sb.auth.getUser(token);
    const userId = userData?.user?.id;
    if (!userId) return null;

    const { data: factoryRow } = await sb.from("factories").select("*").eq("user_id", userId).maybeSingle();
    if (!factoryRow) return { factory: null, reports: [] };

    const { data: assessmentRows } = await sb
      .from("assessments")
      .select("id, local_report_id, compliance_score, score_breakdown, created_at")
      .eq("factory_id", (factoryRow as {id:string}).id)
      .order("created_at", { ascending: false });

    const reports: LocalReport[] = (assessmentRows || []).map((a: Record<string, unknown>) => ({
      id: (a.local_report_id as string) || (a.id as string),
      score: (a.compliance_score as number) ?? 0,
      band: ((a.score_breakdown as Record<string,unknown>)?.band as string) || "",
      created_at: a.created_at as string,
      factory: factoryRow as Record<string,string>,
    }));

    return { factory: factoryRow as Record<string,string>, reports };
  } catch (e) {
    console.error("Supabase dashboard fetch error:", String(e));
    return null;
  }
}

export default function DashboardPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;

  const [factory, setFactory]     = useState<Record<string,string> | null>(null);
  const [reports, setReports]     = useState<LocalReport[]>([]);
  const [loading, setLoading]     = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [synced, setSynced]       = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("dpp_auth_token");
      const email = localStorage.getItem("dpp_user_email");
      if (email) setUserEmail(email);

      if (token) {
        const remote = await fetchFromSupabase(token);
        if (remote) {
          setFactory(remote.factory);
          setReports(remote.reports);
          setSynced(true);
          setLoading(false);
          return;
        }
        // token existed but fetch failed (expired session, network, etc.) — fall through to local view
      }

      // Not logged in, or remote fetch failed: existing localStorage behavior, unchanged
      const f = localStorage.getItem("dpp_factory");
      if (f) setFactory(JSON.parse(f) as Record<string,string>);

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
      setSynced(false);
      setLoading(false);
    };
    load();
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
        <div role="note" style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",color:"#92400e",fontSize:"0.85rem",lineHeight:1.6,maxWidth:"960px",marginLeft:"auto",marginRight:"auto"}}>{isBn?"পুরোনো স্কোরসহ রিপোর্ট। এটি কারখানার নিজের দেওয়া তথ্য থেকে তৈরি। এটি সনদ, পাসপোর্ট বা অডিট নয়, এবং কেউ এটি যাচাই করেনি। বর্তমান পদ্ধতি দেখুন: ডেটা চেক।":"Old scored report. Built from the factory’s own answers. It is not a certificate, passport or audit, and nobody has verified it. See the current approach: the Data Check."} <a href={"/"+loc+"/check"} style={{color:"#0f766e",fontWeight:600}}>{isBn?"ডেটা চেক":"Data Check"}</a></div>

        <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,fontSize:"1.1rem",textDecoration:"none"}}>🌿 DPP Atlas</a>
          <div style={{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
            {userEmail && <span style={{color:"#64748b",fontSize:"0.8rem"}}>👤 {userEmail}</span>}
            <a href={"/"+loc+"/check"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"9px 18px",borderRadius:"10px",fontWeight:600,fontSize:"0.875rem"}}>
              + {isBn?"নতুন ডেটা চেক":"New Data Check"}
            </a>
            {!synced && (
              <a href={"/"+loc+"/login"} style={{background:"white",color:"#64748b",border:"1px solid #e2e8f0",textDecoration:"none",padding:"9px 14px",borderRadius:"10px",fontWeight:500,fontSize:"0.875rem"}}>
                {isBn?"লগইন":"Login"}
              </a>
            )}
          </div>
        </nav>

        {/* SYNC STATUS BANNER */}
        <div style={{
          background: synced ? "#f0fdfa" : "#fffbeb",
          border: "1px solid " + (synced ? "#99f6e4" : "#fde68a"),
          borderRadius: "10px", padding: "10px 16px", marginBottom: "20px",
          fontSize: "0.8rem", color: synced ? "#0f766e" : "#92400e",
          display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"
        }}>
          {synced
            ? <>☁️ {isBn?"সিঙ্ক করা হয়েছে — যেকোনো ডিভাইস থেকে অ্যাক্সেসযোগ্য":"Synced to your account — accessible from any device"}</>
            : <>💾 {isBn?"শুধু এই ব্রাউজারে সংরক্ষিত। ":"Saved to this browser only. "}
                <a href={"/"+loc+"/login"} style={{color:"#92400e",fontWeight:700,textDecoration:"underline"}}>
                  {isBn?"লগইন করে সব ডিভাইসে সংরক্ষণ করুন":"Log in to save across all devices"}
                </a>
              </>
          }
        </div>

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
            {icon:"📋", n:String(reports.length),          l:isBn?"পুরনো স্কোরভিত্তিক রিপোর্ট":"Old scored reports"},
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
              📋 {isBn?"পুরনো স্কোরভিত্তিক রিপোর্টের ইতিহাস":"Old scored report history"}
            </h2>
            <a href={"/"+loc+"/check"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"7px 14px",borderRadius:"8px",fontWeight:600,fontSize:"0.78rem"}}>
              + {isBn?"নতুন":"New"}
            </a>
          </div>

          <ScoreChart reports={reports} />

          {reports.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px 24px"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"12px"}}>📋</div>
              <h3 style={{color:"#0f172a",marginBottom:"10px",fontSize:"1rem"}}>{isBn?"কোনো পুরনো রিপোর্ট নেই":"No old scored reports"}</h3>
              <p style={{color:"#94a3b8",marginBottom:"20px",fontSize:"0.82rem"}}>{isBn?"আপনার প্রথম ডেটা চেক শুরু করুন।":"Start your first Data Check."}</p>
              <a href={"/"+loc+"/check"} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"12px 24px",borderRadius:"10px",fontWeight:700,fontSize:"0.875rem"}}>
                📋 {isBn?"ডেটা চেক শুরু করুন":"Start Data Check"}
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
              {isBn?"কাজের তালিকা ধরে এগোন, তারপর আবার ডেটা চেক করুন।":"Work through your action list, then run the Data Check again."}
            </p>
            <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
              {latest && (
                <a href={"/"+loc+"/report/"+latest.id} style={{background:"#0d9488",color:"white",textDecoration:"none",padding:"10px 20px",borderRadius:"10px",fontWeight:700,fontSize:"0.82rem"}}>
                  📊 {isBn?"AI রোডম্যাপ দেখুন":"View AI Roadmap"}
                </a>
              )}
              <a href={"/"+loc+"/check"} style={{border:"1px solid #334155",color:"#94a3b8",textDecoration:"none",padding:"10px 16px",borderRadius:"10px",fontWeight:500,fontSize:"0.82rem"}}>
                🔄 {isBn?"আবার ডেটা চেক":"Run Data Check again"}
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
