const fs = require('fs');
const path = require('path');

function w(p, c) {
  fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p, c, 'utf8');
  console.log('OK (' + fs.statSync(p).size + ' bytes): ' + p);
}

// ── TASK 6: VOICE INPUT + LIVE NEWS + FIXES ──────────────────

// 1. Updated assess page with voice input on every question
w('app/[locale]/assess/page.tsx', `
"use client";
import { useState, useEffect, useRef } from "react";

interface Question {
  id: number;
  cat: number;
  q: string;
  qBn: string;
  opts: { l: string; lBn: string; v: string; s: number }[];
  info?: boolean;
}

const CATS = [
  {id:1, name:"Factory Identity & Registration",     nameBn:"কারখানা পরিচয়",          max:20},
  {id:2, name:"Material Composition & Traceability", nameBn:"উপকরণ গঠন ও ট্রেসেবিলিটি", max:25},
  {id:3, name:"Chemical Compliance",                 nameBn:"রাসায়নিক সম্মতি",          max:20},
  {id:4, name:"Physical Testing & Durability",       nameBn:"শারীরিক পরীক্ষা",           max:20},
  {id:5, name:"Circularity & Sustainability",        nameBn:"পুনর্ব্যবহার ও টেকসইতা",     max:15},
];

const QS: Question[] = [
  {id:1,  cat:1, q:"Does your factory have an official GS1 Global Location Number (GLN)?",                      qBn:"আপনার কারখানার কি GS1 GLN নম্বর আছে?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"In Progress",lBn:"প্রক্রিয়াধীন",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:2,  cat:1, q:"Is your factory registered under your country's official textile regulatory authority?",     qBn:"আপনার কারখানা কি সরকারি কর্তৃপক্ষে নিবন্ধিত?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:3,  cat:1, q:"What is your Supply Chain Tier Level? (Informational only)",                               qBn:"আপনার সাপ্লাই চেইন স্তর কী? (তথ্যমূলক)",
    opts:[{l:"Tier 1 - Garment",lBn:"Tier 1 - গার্মেন্ট",v:"t1",s:0},{l:"Tier 2 - Fabric/Dye",lBn:"Tier 2 - ফ্যাব্রিক",v:"t2",s:0},{l:"Tier 3 - Yarn",lBn:"Tier 3 - সুতা",v:"t3",s:0},{l:"Tier 4 - Raw Fiber",lBn:"Tier 4 - কাঁচামাল",v:"t4",s:0}], info:true},
  {id:4,  cat:1, q:"Does your factory have a verified corporate tax identification number (TIN/BIN)?",           qBn:"আপনার কারখানার কি যাচাইকৃত TIN/BIN নম্বর আছে?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:5,  cat:1, q:"Is your factory geographic location verified on an official business registry?",             qBn:"আপনার কারখানার অবস্থান কি সরকারি রেজিস্ট্রিতে যাচাইকৃত?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:6,  cat:2, q:"Can you provide an exact fiber blend percentage totaling 100%?",                             qBn:"আপনি কি সঠিক ফাইবার মিশ্রণের শতাংশ (মোট ১০০%) দিতে পারেন?",
    opts:[{l:"Yes, verified",lBn:"হ্যাঁ, যাচাইকৃত",v:"y",s:8},{l:"Approximate only",lBn:"আনুমানিক",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:7,  cat:2, q:"Are all fiber sources traceable to their country/region of origin?",                        qBn:"সব ফাইবার উৎস কি উৎপত্তির দেশে ট্রেস করা যায়?",
    opts:[{l:"Fully traced",lBn:"সম্পূর্ণ",v:"y",s:7},{l:"Partially",lBn:"আংশিক",v:"p",s:3},{l:"Not traced",lBn:"না",v:"n",s:0}]},
  {id:8,  cat:2, q:"Do you hold a valid GOTS (Global Organic Textile Standard) certification?",                 qBn:"আপনার কি বৈধ GOTS সার্টিফিকেট আছে?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ, বর্তমান",v:"y",s:5},{l:"Expired",lBn:"মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:9,  cat:2, q:"Do you hold a valid OEKO-TEX certification for your primary materials?",                    qBn:"আপনার কি বৈধ OEKO-TEX সার্টিফিকেট আছে?",
    opts:[{l:"Yes, current",lBn:"হ্যাঁ, বর্তমান",v:"y",s:5},{l:"Expired",lBn:"মেয়াদোত্তীর্ণ",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:10, cat:3, q:"Has your facility completed a REACH (EU Chemical Regulation) compliance audit?",            qBn:"আপনার কারখানা কি REACH অডিট সম্পন্ন করেছে?",
    opts:[{l:"Yes, documented",lBn:"হ্যাঁ, নথিভুক্ত",v:"y",s:7},{l:"In progress",lBn:"প্রক্রিয়াধীন",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:11, cat:3, q:"Are Substances of Very High Concern (SVHC) logged and disclosed in material data sheets?",  qBn:"SVHC পদার্থ কি লগ ও প্রকাশ করা হয়েছে?",
    opts:[{l:"Fully disclosed",lBn:"সম্পূর্ণ প্রকাশিত",v:"y",s:7},{l:"Partial",lBn:"আংশিক",v:"p",s:3},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:12, cat:3, q:"Do your dye processes meet RoHS chemical restriction requirements?",                         qBn:"আপনার রং প্রক্রিয়া কি RoHS নিষেধাজ্ঞা পূরণ করে?",
    opts:[{l:"Yes, verified",lBn:"হ্যাঁ, যাচাইকৃত",v:"y",s:6},{l:"Unverified",lBn:"অযাচাইকৃত",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:13, cat:4, q:"Has your fabric undergone ISO 3759 dimensional stability (shrinkage) testing?",             qBn:"আপনার কাপড় কি ISO 3759 সংকোচন পরীক্ষায় উত্তীর্ণ হয়েছে?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"পরীক্ষা হয়নি",v:"x",s:0}]},
  {id:14, cat:4, q:"Have you completed ISO 16322-3 spirality (twisting) testing on your fabric?",               qBn:"আপনি কি ISO 16322-3 স্পাইরালিটি পরীক্ষা সম্পন্ন করেছেন?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:7},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not tested",lBn:"পরীক্ষা হয়নি",v:"x",s:0}]},
  {id:15, cat:4, q:"Has ISO 15487 visual inspection testing been conducted?",                                   qBn:"ISO 15487 ভিজ্যুয়াল ইন্সপেকশন পরীক্ষা কি হয়েছে?",
    opts:[{l:"Passed",lBn:"উত্তীর্ণ",v:"y",s:6},{l:"Failed",lBn:"অনুত্তীর্ণ",v:"n",s:0},{l:"Not conducted",lBn:"পরীক্ষা হয়নি",v:"x",s:0}]},
  {id:16, cat:5, q:"Does your product include end-of-life recycling instructions for the consumer?",            qBn:"আপনার পণ্যে কি পুনর্ব্যবহারের নির্দেশনা আছে?",
    opts:[{l:"Yes",lBn:"হ্যাঁ",v:"y",s:5},{l:"Partial",lBn:"আংশিক",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:17, cat:5, q:"Have you calculated the carbon footprint per kg of textile produced?",                     qBn:"আপনি কি প্রতি কেজিতে কার্বন ফুটপ্রিন্ট হিসাব করেছেন?",
    opts:[{l:"Yes, documented",lBn:"হ্যাঁ, নথিভুক্ত",v:"y",s:5},{l:"Estimate only",lBn:"আনুমানিক",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
  {id:18, cat:5, q:"Does your facility have a water consumption reduction program in place?",                   qBn:"আপনার কারখানায় কি পানি সংরক্ষণ কর্মসূচি আছে?",
    opts:[{l:"Yes, documented",lBn:"হ্যাঁ, নথিভুক্ত",v:"y",s:5},{l:"Informal only",lBn:"অনানুষ্ঠানিক",v:"p",s:2},{l:"No",lBn:"না",v:"n",s:0}]},
];

function calcScore(ans: Record<number, string>): number {
  let total = 0;
  QS.forEach(q => {
    const opt = q.opts.find(o => o.v === ans[q.id]);
    if (opt) total += opt.s;
  });
  return Math.min(100, Math.round((total / 100) * 100));
}

// Voice Input Hook
function useVoice(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const w = window as any;
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const start = (lang: string) => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = lang === "bn" ? "bn-BD" : "en-US";
    r.continuous = false;
    r.interimResults = false;
    r.onstart  = () => setListening(true);
    r.onend    = () => setListening(false);
    r.onerror  = () => setListening(false);
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      onResult(t);
    };
    r.start();
    recogRef.current = r;
  };

  const stop = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  return { listening, supported, start, stop };
}

export default function AssessPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;

  const [step,      setStep]      = useState(0);
  const [answers,   setAnswers]   = useState<Record<number, string>>({});
  const [submitting,setSubmit]    = useState(false);
  const [voiceNote, setVoiceNote] = useState<Record<number, string>>({});
  const [activeVoiceQ, setActiveVoiceQ] = useState<number | null>(null);

  const cat   = CATS[step - 1];
  const catQs = QS.filter(q => q.cat === step);
  const done  = catQs.every(q => q.info || answers[q.id] !== undefined);
  const pct   = step === 0 ? 0 : Math.round((step / CATS.length) * 100);

  const { listening, supported, start, stop } = useVoice((text) => {
    if (activeVoiceQ !== null) {
      setVoiceNote(prev => ({...prev, [activeVoiceQ]: text}));
    }
  });

  const handleSubmit = () => {
    setSubmit(true);
    const score    = calcScore(answers);
    const rid      = Date.now().toString();
    const factory  = JSON.parse(localStorage.getItem("dpp_factory") || '{"factory_name":"My Factory","country":"Bangladesh"}');
    const failedIds = QS.filter(q => !q.info && answers[q.id] !== undefined && q.opts.find(o => o.v === answers[q.id])?.s === 0).map(q => q.id);
    const report   = {
      id:rid, score,
      band: score>=90?"✅ DPP COMPLIANT":score>=70?"🟡 CONDITIONALLY COMPLIANT":score>=50?"🟠 DEVELOPING":"🔴 NON-COMPLIANT",
      answers, factory, failed_ids:failedIds,
      voice_notes: voiceNote,
      created_at:new Date().toISOString()
    };
    localStorage.setItem("dpp_report_"+rid, JSON.stringify(report));
    localStorage.setItem("dpp_latest_report", rid);
    setTimeout(() => { window.location.href = "/"+loc+"/report/"+rid; }, 600);
  };

  if (step === 0) return (
    <main style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,sans-serif", padding:"24px", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{maxWidth:"680px", width:"100%", textAlign:"center"}}>
        <div style={{fontSize:"3rem", marginBottom:"16px"}}>📋</div>
        <h1 style={{fontSize:"2rem", fontWeight:800, marginBottom:"12px", color:"#0f172a"}}>
          {isBn ? "DPP কমপ্লায়েন্স মূল্যায়ন" : "DPP Compliance Assessment"}
        </h1>
        <p style={{color:"#64748b", lineHeight:1.7, marginBottom:"24px", maxWidth:"520px", margin:"0 auto 24px"}}>
          {isBn ? "৫টি বিভাগে ১৮টি প্রশ্ন। সৎভাবে উত্তর দিন।" : "18 questions across 5 categories. Answer honestly for an accurate result."}
        </p>

        {supported && (
          <div style={{background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:"10px", padding:"12px 16px", marginBottom:"24px", fontSize:"0.82rem", color:"#0f766e", display:"inline-flex", gap:"8px", alignItems:"center"}}>
            🎤 {isBn ? "ভয়েস ইনপুট সমর্থিত — প্রতিটি প্রশ্নে মাইক বাটন ব্যবহার করুন" : "Voice input supported — use the mic button on each question"}
          </div>
        )}

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"12px", marginBottom:"32px"}}>
          {CATS.map(c => (
            <div key={c.id} style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"10px", padding:"14px", textAlign:"left"}}>
              <div style={{color:"#0d9488", fontWeight:700, fontSize:"0.72rem", marginBottom:"4px"}}>CAT {c.id}</div>
              <div style={{fontWeight:600, fontSize:"0.82rem", color:"#0f172a", marginBottom:"4px"}}>{isBn ? (c as any).nameBn || c.name : c.name}</div>
              <div style={{color:"#94a3b8", fontSize:"0.72rem"}}>{c.max} pts</div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(1)}
          style={{background:"#0d9488", color:"white", border:"none", padding:"16px 40px", borderRadius:"12px", fontWeight:700, fontSize:"1.1rem", cursor:"pointer"}}>
          {isBn ? "🚀 মূল্যায়ন শুরু করুন" : "🚀 Start Assessment"}
        </button>
        <p style={{color:"#94a3b8", fontSize:"0.78rem", marginTop:"12px"}}>~10-15 {isBn ? "মিনিট" : "minutes"}</p>
      </div>
    </main>
  );

  if (submitting) return (
    <main style={{minHeight:"100vh", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem", marginBottom:"16px"}}>⚙️</div>
        <p style={{color:"#0f172a", fontSize:"1.2rem", fontWeight:600}}>
          {isBn ? "রিপোর্ট তৈরি হচ্ছে..." : "Generating your compliance report..."}
        </p>
      </div>
    </main>
  );

  return (
    <main style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,sans-serif", padding:"24px"}}>
      <div style={{maxWidth:"720px", margin:"0 auto"}}>

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
          <a href={"/"+loc} style={{color:"#0d9488", textDecoration:"none", fontWeight:700}}>🌿 DPP Atlas</a>
          <span style={{color:"#64748b", fontSize:"0.875rem"}}>
            {isBn ? "ধাপ" : "Step"} {step}/{CATS.length}
          </span>
        </div>

        <div style={{height:"6px", background:"#e2e8f0", borderRadius:"3px", marginBottom:"28px"}}>
          <div style={{height:"100%", background:"#0d9488", borderRadius:"3px", width:pct+"%", transition:"width 0.4s"}} />
        </div>

        <div style={{marginBottom:"24px"}}>
          <span style={{background:"#f0fdfa", color:"#0d9488", border:"1px solid #99f6e4", padding:"4px 12px", borderRadius:"99px", fontSize:"0.75rem", fontWeight:700}}>
            {isBn ? "বিভাগ" : "CATEGORY"} {step}/{CATS.length} · {cat.max} {isBn ? "পয়েন্ট" : "POINTS"}
          </span>
          <h2 style={{fontSize:"1.4rem", fontWeight:800, color:"#0f172a", marginTop:"10px", marginBottom:"4px"}}>
            {isBn ? (cat as any).nameBn || cat.name : cat.name}
          </h2>
        </div>

        {/* Voice not supported warning */}
        {!supported && (
          <div style={{background:"#fef3c7", border:"1px solid #fbbf24", borderRadius:"8px", padding:"10px 14px", marginBottom:"20px", fontSize:"0.8rem", color:"#92400e"}}>
            🎤 {isBn ? "ভয়েস ইনপুটের জন্য Chrome বা Edge ব্রাউজার ব্যবহার করুন।" : "Voice input requires Chrome or Edge browser for best experience."}
          </div>
        )}

        <div style={{display:"grid", gap:"20px", marginBottom:"28px"}}>
          {catQs.map((q, qi) => (
            <div key={q.id} style={{background:"white", border:"1.5px solid "+(answers[q.id] !== undefined ? "#0d9488" : "#e2e8f0"), borderRadius:"14px", padding:"20px"}}>
              {q.info && (
                <span style={{background:"#fef9c3", color:"#854d0e", padding:"2px 8px", borderRadius:"6px", fontSize:"0.7rem", fontWeight:700, display:"inline-block", marginBottom:"8px"}}>
                  ℹ️ {isBn ? "তথ্যমূলক — কোনো স্কোর নেই" : "INFORMATIONAL — No score impact"}
                </span>
              )}

              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px", marginBottom:"14px"}}>
                <p style={{color:"#0f172a", fontWeight:600, lineHeight:1.5, fontSize:"0.95rem", margin:0, flex:1}}>
                  <span style={{color:"#0d9488", fontWeight:800}}>{qi+1}. </span>
                  {isBn ? q.qBn : q.q}
                  {!q.info && (
                    <span style={{color:"#94a3b8", fontWeight:400, fontSize:"0.78rem", marginLeft:"8px"}}>
                      (max {Math.max(...q.opts.map(o=>o.s))} pts)
                    </span>
                  )}
                </p>

                {/* VOICE INPUT BUTTON */}
                {supported && (
                  <button
                    onClick={() => {
                      if (listening && activeVoiceQ === q.id) {
                        stop();
                        setActiveVoiceQ(null);
                      } else {
                        setActiveVoiceQ(q.id);
                        start(loc);
                      }
                    }}
                    title={isBn ? "ভয়েস ইনপুট" : "Voice input"}
                    style={{
                      minWidth:"36px", height:"36px",
                      border:"1px solid "+(listening && activeVoiceQ===q.id ? "#ef4444" : "#e2e8f0"),
                      borderRadius:"50%",
                      background: listening && activeVoiceQ===q.id ? "#fee2e2" : "#f8fafc",
                      cursor:"pointer",
                      fontSize:"1rem",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0,
                      animation: listening && activeVoiceQ===q.id ? "pulse 1s infinite" : "none"
                    }}>
                    {listening && activeVoiceQ===q.id ? "⏹️" : "🎤"}
                  </button>
                )}
              </div>

              {/* Voice transcript note */}
              {voiceNote[q.id] && (
                <div style={{background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:"8px", padding:"8px 12px", marginBottom:"10px", fontSize:"0.8rem", color:"#0f766e"}}>
                  🎤 {isBn ? "রেকর্ডকৃত:" : "Recorded:"} {voiceNote[q.id]}
                  <button onClick={() => setVoiceNote(prev => { const n={...prev}; delete n[q.id]; return n; })}
                    style={{background:"none", border:"none", color:"#94a3b8", cursor:"pointer", marginLeft:"8px", fontSize:"0.75rem"}}>
                    ✕
                  </button>
                </div>
              )}

              {/* Voice listening indicator */}
              {listening && activeVoiceQ===q.id && (
                <div style={{background:"#fee2e2", border:"1px solid #fecaca", borderRadius:"8px", padding:"8px 12px", marginBottom:"10px", fontSize:"0.8rem", color:"#dc2626", display:"flex", alignItems:"center", gap:"6px"}}>
                  <span style={{animation:"pulse 1s infinite", display:"inline-block", width:"8px", height:"8px", background:"#ef4444", borderRadius:"50%"}}></span>
                  {isBn ? "শুনছি... বাংলায় বা ইংরেজিতে বলুন" : "Listening... speak in Bengali or English"}
                </div>
              )}

              <div style={{display:"grid", gap:"8px"}}>
                {q.opts.map(opt => (
                  <label key={opt.v} style={{display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:answers[q.id]===opt.v?"#f0fdfa":"#f8fafc", border:"1px solid "+(answers[q.id]===opt.v?"#0d9488":"#e2e8f0"), borderRadius:"8px", cursor:"pointer"}}>
                    <input type="radio" name={"q"+q.id} value={opt.v} checked={answers[q.id]===opt.v}
                      onChange={() => setAnswers({...answers, [q.id]:opt.v})}
                      style={{accentColor:"#0d9488"}}
                    />
                    <span style={{color:"#0f172a", fontSize:"0.875rem", flex:1}}>{isBn ? opt.lBn : opt.l}</span>
                    {!q.info && opt.s > 0 && (
                      <span style={{color:"#0d9488", fontSize:"0.75rem", fontWeight:700, background:"#f0fdfa", padding:"2px 8px", borderRadius:"6px"}}>+{opt.s}</span>
                    )}
                    {!q.info && opt.s === 0 && opt.v !== "t1" && opt.v !== "t2" && opt.v !== "t3" && opt.v !== "t4" && (
                      <span style={{color:"#94a3b8", fontSize:"0.7rem"}}>0 pts</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"flex", gap:"12px"}}>
          {step > 1 && (
            <button onClick={() => setStep(step-1)}
              style={{padding:"13px 24px", background:"white", color:"#64748b", border:"1px solid #e2e8f0", borderRadius:"10px", cursor:"pointer", fontWeight:600}}>
              {isBn ? "← পূর্ববর্তী" : "← Previous"}
            </button>
          )}
          <button onClick={() => step < CATS.length ? setStep(step+1) : handleSubmit()}
            disabled={!done}
            style={{flex:1, padding:"13px", background:done?"#0d9488":"#e2e8f0", color:done?"white":"#94a3b8", border:"none", borderRadius:"10px", fontWeight:700, fontSize:"0.95rem", cursor:done?"pointer":"not-allowed"}}>
            {step === CATS.length ? (isBn?"✅ জমা দিন":"✅ Submit & View Report") : (isBn?"পরবর্তী →":"Next →")}
          </button>
        </div>

        {!done && (
          <p style={{color:"#94a3b8", fontSize:"0.78rem", textAlign:"center", marginTop:"10px"}}>
            {isBn ? "সকল প্রশ্নের উত্তর দিন" : "Answer all questions to continue"}
          </p>
        )}
      </div>

      <style>{"@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }"}</style>
    </main>
  );
}
`);

// 2. Updated homepage with real EU ESPR RSS news
w('app/api/news/route.ts', `
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from EU Official Journal RSS — free, no API key
    const res = await fetch(
      'https://eur-lex.europa.eu/rss/EURLexSearchResult.xml?type=advanced&qid=1&sortOne=RELEVANCE&sortTwo=RELEVANCE',
      { next: { revalidate: 3600 } } // cache 1 hour
    );

    if (!res.ok) throw new Error('RSS fetch failed');

    const xml = await res.text();
    const items: Array<{ title: string; link: string; pubDate: string; tag: string }> = [];

    // Simple XML parsing without external library
    const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    let count = 0;

    for (const match of matches) {
      if (count >= 4) break;
      const item = match[1];
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
      const linkMatch  = item.match(/<link>(.*?)<\/link>/);
      const dateMatch  = item.match(/<pubDate>(.*?)<\/pubDate>/);

      if (titleMatch && linkMatch) {
        const t = titleMatch[1].trim();
        if (t.toLowerCase().includes('textile') || t.toLowerCase().includes('espr') || t.toLowerCase().includes('ecodesign')) {
          items.push({
            title:   t.slice(0, 120),
            link:    linkMatch[1].trim(),
            pubDate: dateMatch ? new Date(dateMatch[1]).toLocaleDateString('en-GB', {month:'short', year:'numeric'}) : '',
            tag:     'EU OFFICIAL'
          });
          count++;
        }
      }
    }

    // Fallback news if RSS returns nothing relevant
    if (items.length === 0) {
      items.push(
        {title:"EU ESPR Regulation 2024/1781 — Ecodesign for Sustainable Products", link:"https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1781", pubDate:"Jul 2024", tag:"REGULATION"},
        {title:"Bangladesh BGMEA prioritises EU market compliance for 2027", link:"https://www.bgmea.com.bd", pubDate:"2026", tag:"BANGLADESH"},
        {title:"ISO 3759:2011 — Textile dimensional stability test standard", link:"https://www.iso.org/standard/61918.html", pubDate:"Standard", tag:"ISO"},
        {title:"REACH SVHC Candidate List — Latest update", link:"https://echa.europa.eu/candidate-list-table", pubDate:"2026", tag:"REACH"}
      );
    }

    return NextResponse.json({ success: true, items });
  } catch {
    return NextResponse.json({
      success: true,
      items: [
        {title:"EU ESPR Regulation 2024/1781 — Ecodesign for Sustainable Products", link:"https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1781", pubDate:"Jul 2024", tag:"REGULATION"},
        {title:"Bangladesh BGMEA — EU Compliance Resources", link:"https://www.bgmea.com.bd", pubDate:"2026", tag:"BANGLADESH"},
        {title:"ISO 3759:2011 — Textile Shrinkage Test Standard", link:"https://www.iso.org/standard/61918.html", pubDate:"Standard", tag:"ISO"},
        {title:"REACH SVHC Candidate List — ECHA Official", link:"https://echa.europa.eu/candidate-list-table", pubDate:"2026", tag:"REACH"},
      ]
    });
  }
}
`);

console.log('');
console.log('=== ALL TASK 6 FILES WRITTEN ===');
console.log('');
console.log('Now run: git add . && git commit -m "Task 6: Voice input + Bengali questions + live EU news API" && git push');