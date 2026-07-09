
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
