const fs = require('fs');
fs.mkdirSync('app/[locale]/assess', {recursive:true});
fs.writeFileSync('app/[locale]/assess/page.tsx', `
"use client";
import { useState } from "react";

const CATS = [
  {id:1, name:"Factory Identity & Registration",    max:20},
  {id:2, name:"Material Composition & Traceability", max:25},
  {id:3, name:"Chemical Compliance",                max:20},
  {id:4, name:"Physical Testing & Durability",       max:20},
  {id:5, name:"Circularity & Sustainability",        max:15},
];

const QS = [
  // CAT 1
  {id:1,  cat:1, q:"Does your factory have an official GS1 Global Location Number (GLN)?",
    opts:[{l:"Yes",v:"y",s:5},{l:"In Progress",v:"p",s:2},{l:"No",v:"n",s:0}]},
  {id:2,  cat:1, q:"Is your factory registered under your country's official textile regulatory authority?",
    opts:[{l:"Yes",v:"y",s:5},{l:"No",v:"n",s:0}]},
  {id:3,  cat:1, q:"What is your Supply Chain Tier Level?",
    opts:[{l:"Tier 1 - Garment",v:"t1",s:0},{l:"Tier 2 - Fabric/Dye",v:"t2",s:0},{l:"Tier 3 - Yarn",v:"t3",s:0},{l:"Tier 4 - Raw Fiber",v:"t4",s:0}], info:true},
  {id:4,  cat:1, q:"Does your factory have a verified corporate tax identification number (TIN/BIN)?",
    opts:[{l:"Yes",v:"y",s:5},{l:"No",v:"n",s:0}]},
  {id:5,  cat:1, q:"Is your factory geographic location verified on an official business registry?",
    opts:[{l:"Yes",v:"y",s:5},{l:"No",v:"n",s:0}]},
  // CAT 2
  {id:6,  cat:2, q:"Can you provide an exact fiber blend percentage totaling 100%? (e.g. 70% cotton, 30% polyester)",
    opts:[{l:"Yes, verified",v:"y",s:8},{l:"Approximate only",v:"p",s:3},{l:"No",v:"n",s:0}]},
  {id:7,  cat:2, q:"Are all fiber sources traceable to their country/region of origin?",
    opts:[{l:"Fully traced",v:"y",s:7},{l:"Partially traced",v:"p",s:3},{l:"Not traced",v:"n",s:0}]},
  {id:8,  cat:2, q:"Do you hold a valid GOTS (Global Organic Textile Standard) certification?",
    opts:[{l:"Yes, current",v:"y",s:5},{l:"Expired",v:"p",s:2},{l:"No",v:"n",s:0}]},
  {id:9,  cat:2, q:"Do you hold a valid OEKO-TEX certification for your primary materials?",
    opts:[{l:"Yes, current",v:"y",s:5},{l:"Expired",v:"p",s:2},{l:"No",v:"n",s:0}]},
  // CAT 3
  {id:10, cat:3, q:"Has your facility completed a REACH (EU Chemical Regulation) compliance audit?",
    opts:[{l:"Yes, documented",v:"y",s:7},{l:"In progress",v:"p",s:3},{l:"No",v:"n",s:0}]},
  {id:11, cat:3, q:"Are Substances of Very High Concern (SVHC) logged and disclosed in your material data sheets?",
    opts:[{l:"Fully disclosed",v:"y",s:7},{l:"Partial",v:"p",s:3},{l:"No",v:"n",s:0}]},
  {id:12, cat:3, q:"Do your dye processes meet RoHS chemical restriction requirements?",
    opts:[{l:"Yes, verified",v:"y",s:6},{l:"Unverified",v:"p",s:2},{l:"No",v:"n",s:0}]},
  // CAT 4
  {id:13, cat:4, q:"Has your fabric undergone ISO 3759 dimensional stability (shrinkage) testing?",
    opts:[{l:"Passed",v:"y",s:7},{l:"Failed",v:"n",s:0},{l:"Not tested",v:"x",s:0}]},
  {id:14, cat:4, q:"Have you completed ISO 16322-3 spirality (twisting) testing on your fabric?",
    opts:[{l:"Passed",v:"y",s:7},{l:"Failed",v:"n",s:0},{l:"Not tested",v:"x",s:0}]},
  {id:15, cat:4, q:"Has ISO 15487 visual inspection testing been conducted?",
    opts:[{l:"Passed",v:"y",s:6},{l:"Failed",v:"n",s:0},{l:"Not conducted",v:"x",s:0}]},
  // CAT 5
  {id:16, cat:5, q:"Does your product include end-of-life recycling instructions for the consumer?",
    opts:[{l:"Yes",v:"y",s:5},{l:"Partial",v:"p",s:2},{l:"No",v:"n",s:0}]},
  {id:17, cat:5, q:"Have you calculated the carbon footprint per kg of textile produced?",
    opts:[{l:"Yes, documented",v:"y",s:5},{l:"Estimate only",v:"p",s:2},{l:"No",v:"n",s:0}]},
  {id:18, cat:5, q:"Does your facility have a water consumption reduction program in place?",
    opts:[{l:"Yes, documented",v:"y",s:5},{l:"Informal only",v:"p",s:2},{l:"No",v:"n",s:0}]},
];

function calcScore(ans: Record<number,string>) {
  let t = 0;
  QS.forEach(q => { const o = q.opts.find(o => o.v === ans[q.id]); if(o) t += o.s; });
  return Math.round((t / 100) * 100);
}

function getBand(s: number) {
  if(s >= 90) return {label:"DPP COMPLIANT",          color:"#22c55e", emoji:"✅", desc:"Your factory is ready for an EU DPP Passport."};
  if(s >= 70) return {label:"CONDITIONALLY COMPLIANT", color:"#eab308", emoji:"🟡", desc:"Minor gaps remain. Follow the roadmap below."};
  if(s >= 50) return {label:"DEVELOPING",              color:"#f97316", emoji:"🟠", desc:"Significant improvements needed before DPP issuance."};
  return             {label:"NON-COMPLIANT",           color:"#ef4444", emoji:"🔴", desc:"Critical action required immediately."};
}

const TIPS: Record<number,string> = {
  1:  "Register at gs1.org/services/gln for a free GLN. EU buyers require this for full traceability.",
  2:  "Register with BGMEA (Bangladesh) or your national textile authority to obtain official status.",
  4:  "Obtain a verified TIN/BIN from your country's National Board of Revenue.",
  5:  "Submit factory location to your national business registry portal.",
  6:  "Work with your yarn/fabric supplier to obtain certified fiber composition test reports.",
  7:  "Implement a supply chain traceability system — start with documenting country of origin for each fiber.",
  8:  "Apply for GOTS certification at global-standard.org. Cost varies but improves buyer confidence.",
  9:  "Apply for OEKO-TEX STANDARD 100 at oeko-tex.com. Basic certification available for small factories.",
  10: "Commission a REACH compliance audit from an EU-approved laboratory or testing body.",
  11: "Create Material Safety Data Sheets (MSDS) for all chemicals used. Disclose all SVHC substances.",
  12: "Switch to RoHS-compliant dyes. Contact your dye supplier for RoHS compliance certification.",
  13: "Send fabric samples to a BGMEA-approved lab for ISO 3759 shrinkage testing. Budget: ~$50-150 per test.",
  14: "ISO 16322-3 spirality test required for knitwear. Contact SGS, Bureau Veritas, or Intertek in Bangladesh.",
  15: "ISO 15487 visual inspection is low-cost. Any accredited lab in Dhaka can conduct this test.",
  16: "Add recycling symbols and end-of-life instructions to all garment labels. Required by EU from 2027.",
  17: "Use the free Textile Exchange Carbon Calculator to estimate your textile carbon footprint.",
  18: "Install water meters on all production lines. Document monthly consumption and set reduction targets.",
};

export default function AssessPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<number,string>>({});
  const [done, setDone]       = useState(false);
  const [reportId, setReportId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cat     = CATS[step - 1];
  const catQs   = QS.filter(q => q.cat === step);
  const answered = catQs.every(q => q.info || answers[q.id] !== undefined);
  const progress = step === 0 ? 0 : Math.round((step / CATS.length) * 100);

  const submit = () => {
    setSubmitting(true);
    const score  = calcScore(answers);
    const band   = getBand(score);
    const id     = Date.now().toString();
    const factory = JSON.parse(localStorage.getItem("dpp_factory") || '{"factory_name":"My Factory","country":"Bangladesh"}');
    const failed  = QS.filter(q => !q.info && answers[q.id] !== undefined && q.opts.find(o => o.v === answers[q.id])?.s === 0);
    const report  = {
      id, score, band: band.emoji+" "+band.label,
      answers, factory,
      failed_ids: failed.map(q => q.id),
      tips: failed.map(q => ({q: q.q, tip: TIPS[q.id] || "Review this area and consult an accredited auditor."})),
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("dpp_report_" + id, JSON.stringify(report));
    localStorage.setItem("dpp_latest_report", id);
    setReportId(id);
    setTimeout(() => { window.location.href = "/" + loc + "/report/" + id; }, 600);
  };

  // INTRO SCREEN
  if(step === 0) return (
    <main style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,sans-serif", padding:"24px"}}>
      <nav style={{display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:"800px", margin:"0 auto 40px"}}>
        <a href={"/"+loc} style={{color:"#0d9488", fontWeight:700, fontSize:"1.1rem", textDecoration:"none"}}>🌿 DPP Atlas</a>
      </nav>
      <div style={{maxWidth:"680px", margin:"0 auto", textAlign:"center"}}>
        <div style={{fontSize:"3rem", marginBottom:"16px"}}>📋</div>
        <h1 style={{fontSize:"2rem", fontWeight:800, marginBottom:"12px", color:"#0f172a"}}>
          {isBn ? "DPP কমপ্লায়েন্স মূল্যায়ন" : "DPP Compliance Assessment"}
        </h1>
        <p style={{color:"#64748b", lineHeight:1.7, marginBottom:"32px", maxWidth:"520px", margin:"0 auto 32px"}}>
          {isBn
            ? "এই মূল্যায়নে 5টি বিভাগে 18টি প্রশ্ন রয়েছে। সৎভাবে উত্তর দিন — AI তাৎক্ষণিক উন্নতির রোডম্যাপ তৈরি করবে।"
            : "This assessment covers 5 compliance categories with 18 questions. Answer honestly — AI generates your improvement roadmap instantly."}
        </p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"12px", marginBottom:"32px", maxWidth:"680px", margin:"0 auto 32px"}}>
          {CATS.map(c => (
            <div key={c.id} style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"10px", padding:"14px", textAlign:"left"}}>
              <div style={{color:"#0d9488", fontWeight:700, fontSize:"0.72rem", marginBottom:"4px"}}>CATEGORY {c.id}</div>
              <div style={{fontWeight:600, fontSize:"0.82rem", color:"#0f172a", marginBottom:"4px"}}>{c.name}</div>
              <div style={{color:"#94a3b8", fontSize:"0.72rem"}}>{c.max} points · {QS.filter(q=>q.cat===c.id).length} questions</div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(1)}
          style={{background:"#0d9488", color:"white", border:"none", padding:"16px 40px", borderRadius:"12px", fontWeight:700, fontSize:"1.1rem", cursor:"pointer"}}>
          {isBn ? "🚀 মূল্যায়ন শুরু করুন" : "🚀 Start Assessment"}
        </button>
        <p style={{color:"#94a3b8", fontSize:"0.78rem", marginTop:"16px"}}>
          {isBn ? "আনুমানিক সময়: ১০-১৫ মিনিট" : "Estimated time: 10-15 minutes"}
        </p>
      </div>
    </main>
  );

  // SUBMITTING
  if(submitting) return (
    <main style={{minHeight:"100vh", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem", marginBottom:"16px"}}>⚙️</div>
        <p style={{color:"#0f172a", fontSize:"1.2rem", fontWeight:600}}>
          {isBn ? "আপনার রিপোর্ট তৈরি হচ্ছে..." : "Generating your compliance report..."}
        </p>
        <p style={{color:"#64748b", fontSize:"0.875rem", marginTop:"8px"}}>
          {isBn ? "AI রোডম্যাপ বিশ্লেষণ করছে" : "AI is analyzing your responses"}
        </p>
      </div>
    </main>
  );

  // QUESTION SCREEN
  return (
    <main style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,sans-serif", padding:"24px"}}>
      <div style={{maxWidth:"720px", margin:"0 auto"}}>

        {/* Header */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
          <a href={"/"+loc} style={{color:"#0d9488", textDecoration:"none", fontWeight:700, fontSize:"1rem"}}>🌿 DPP Atlas</a>
          <span style={{color:"#64748b", fontSize:"0.875rem", fontWeight:500}}>
            {isBn ? "ধাপ" : "Step"} {step}/{CATS.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{height:"6px", background:"#e2e8f0", borderRadius:"3px", marginBottom:"28px"}}>
          <div style={{height:"100%", background:"#0d9488", borderRadius:"3px", width:progress+"%", transition:"width 0.4s"}} />
        </div>

        {/* Category Header */}
        <div style={{marginBottom:"24px"}}>
          <span style={{background:"#f0fdfa", color:"#0d9488", border:"1px solid #99f6e4", padding:"4px 12px", borderRadius:"99px", fontSize:"0.75rem", fontWeight:700}}>
            CATEGORY {step}/{CATS.length} · {cat.max} POINTS
          </span>
          <h2 style={{fontSize:"1.4rem", fontWeight:800, color:"#0f172a", marginTop:"10px", marginBottom:"4px"}}>
            {cat.name}
          </h2>
          <p style={{color:"#64748b", fontSize:"0.875rem"}}>
            {catQs.filter(q=>!q.info).length} {isBn ? "টি প্রশ্ন" : "questions in this section"}
          </p>
        </div>

        {/* Questions */}
        <div style={{display:"grid", gap:"20px", marginBottom:"28px"}}>
          {catQs.map((q, qi) => (
            <div key={q.id} style={{
              background:"white",
              border:"1.5px solid "+(answers[q.id] !== undefined ? "#0d9488" : "#e2e8f0"),
              borderRadius:"14px",
              padding:"20px",
              transition:"border-color 0.2s"
            }}>
              {q.info && (
                <span style={{background:"#fef9c3", color:"#854d0e", padding:"2px 8px", borderRadius:"6px", fontSize:"0.7rem", fontWeight:700, display:"inline-block", marginBottom:"8px"}}>
                  ℹ️ INFORMATIONAL — No score impact
                </span>
              )}
              <p style={{color:"#0f172a", fontWeight:600, marginBottom:"14px", lineHeight:1.5, fontSize:"0.95rem"}}>
                <span style={{color:"#0d9488", fontWeight:800}}>{qi+1}. </span>
                {q.q}
                {!q.info && (
                  <span style={{color:"#94a3b8", fontWeight:400, fontSize:"0.78rem", marginLeft:"8px"}}>
                    (max {Math.max(...q.opts.map(o=>o.s))} pts)
                  </span>
                )}
              </p>
              <div style={{display:"grid", gap:"8px"}}>
                {q.opts.map(opt => (
                  <label key={opt.v} style={{
                    display:"flex", alignItems:"center", gap:"10px",
                    padding:"10px 14px",
                    background: answers[q.id]===opt.v ? "#f0fdfa" : "#f8fafc",
                    border:"1px solid "+(answers[q.id]===opt.v ? "#0d9488" : "#e2e8f0"),
                    borderRadius:"8px",
                    cursor:"pointer",
                    transition:"all 0.15s"
                  }}>
                    <input type="radio" name={"q"+q.id} value={opt.v}
                      checked={answers[q.id]===opt.v}
                      onChange={() => setAnswers({...answers, [q.id]: opt.v})}
                      style={{accentColor:"#0d9488"}}
                    />
                    <span style={{color:"#0f172a", fontSize:"0.875rem", flex:1}}>{opt.l}</span>
                    {!q.info && opt.s > 0 && (
                      <span style={{color:"#0d9488", fontSize:"0.75rem", fontWeight:700, background:"#f0fdfa", padding:"2px 8px", borderRadius:"6px"}}>
                        +{opt.s} pts
                      </span>
                    )}
                    {!q.info && opt.s === 0 && (
                      <span style={{color:"#94a3b8", fontSize:"0.7rem"}}>0 pts</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{display:"flex", gap:"12px"}}>
          {step > 1 && (
            <button onClick={() => setStep(step-1)}
              style={{padding:"13px 24px", background:"white", color:"#64748b", border:"1px solid #e2e8f0", borderRadius:"10px", cursor:"pointer", fontWeight:600, fontSize:"0.9rem"}}>
              {isBn ? "← পূর্ববর্তী" : "← Previous"}
            </button>
          )}
          <button onClick={() => step < CATS.length ? setStep(step+1) : submit()}
            disabled={!answered}
            style={{
              flex:1, padding:"13px",
              background: answered ? "#0d9488" : "#e2e8f0",
              color: answered ? "white" : "#94a3b8",
              border:"none", borderRadius:"10px",
              fontWeight:700, fontSize:"0.95rem",
              cursor: answered ? "pointer" : "not-allowed"
            }}>
            {step === CATS.length
              ? (isBn ? "✅ জমা দিন ও রিপোর্ট দেখুন" : "✅ Submit & View Report")
              : (isBn ? "পরবর্তী →" : "Next →")
            }
          </button>
        </div>

        {!answered && (
          <p style={{color:"#94a3b8", fontSize:"0.78rem", textAlign:"center", marginTop:"10px"}}>
            {isBn ? "পরবর্তী ধাপে যেতে সকল প্রশ্নের উত্তর দিন" : "Answer all questions to continue"}
          </p>
        )}
      </div>
    </main>
  );
}
`, 'utf8');

console.log('OK: app/[locale]/assess/page.tsx written');
console.log('DONE — run: git add . && git commit -m "Task 3: Full assessment engine" && git push');