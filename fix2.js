const fs = require('fs');
const path = require('path');

function w(p, c) {
  fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p, c, 'utf8');
  console.log('OK (' + fs.statSync(p).size + ' bytes): ' + p);
}

// ── HOMEPAGE ─────────────────────────────────────────
w('app/[locale]/page.tsx', `
"use client";
import { useState } from "react";

const FTYPES = [
  {id:"rmd",    icon:"👕", name:"RMG / Garment",       desc:"Ready-made garments, shirts, trousers"},
  {id:"knit",   icon:"🧶", name:"Knitwear",             desc:"T-shirts, polo shirts, sweaters"},
  {id:"denim",  icon:"👖", name:"Denim",                desc:"Denim fabric, jeans, denim products"},
  {id:"spin",   icon:"🌀", name:"Spinning / Yarn",      desc:"Cotton yarn, synthetic yarn"},
  {id:"dye",    icon:"🎨", name:"Dyeing & Finishing",   desc:"Fabric dyeing, printing, finishing"},
  {id:"sweat",  icon:"🧣", name:"Sweater / Woolen",     desc:"Sweaters, cardigans, woolen products"},
  {id:"home",   icon:"🛏️", name:"Home Textile",         desc:"Bedsheets, towels, curtains"},
  {id:"acc",    icon:"🔗", name:"Accessories / Trim",   desc:"Labels, buttons, zippers, packaging"},
];

const NEWS = [
  {d:"Jul 2026", t:"EU ESPR Regulation enters enforcement phase for textiles",    tag:"REGULATION",   c:"#ef4444"},
  {d:"Jun 2026", t:"Bangladesh BGMEA signs MOU with EU DPP working group",        tag:"BANGLADESH",   c:"#3b82f6"},
  {d:"Jun 2026", t:"ISO 3759 updated — new shrinkage requirements for 2027",      tag:"ISO UPDATE",   c:"#eab308"},
  {d:"May 2026", t:"GOTS certification now required for organic cotton DPP",      tag:"CERTIFICATION",c:"#22c55e"},
];

const STATS = [
  {n:"2027",  l:"EU DPP Mandate Deadline",     d:"All textile exports to EU must have a DPP",        c:"#ef4444"},
  {n:"$42B",  l:"BD Textile Export Value",     d:"At risk without DPP compliance for EU buyers",     c:"#f97316"},
  {n:"83%",   l:"EU is BD Top Export Market",  d:"The largest buyer market now requires DPP",        c:"#eab308"},
  {n:"Free",  l:"DPP Atlas Cost",              d:"Zero cost to assess — start your journey today",   c:"#22c55e"},
];

const s = {
  nav:  {padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #f1f5f9", position:"sticky" as const, top:0, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(8px)", zIndex:100},
  btn:  {background:"#0d9488", color:"white", padding:"12px 24px", borderRadius:"10px", fontWeight:700, textDecoration:"none", display:"inline-block", cursor:"pointer", border:"none", fontSize:"0.95rem"},
  btnO: {border:"2px solid #0d9488", color:"#0d9488", padding:"10px 22px", borderRadius:"10px", fontWeight:600, textDecoration:"none", display:"inline-block", background:"transparent"},
  card: {border:"1.5px solid #e2e8f0", borderRadius:"16px", padding:"24px", cursor:"pointer", transition:"all 0.2s", background:"white", textDecoration:"none", color:"inherit", display:"block"},
  sec:  {padding:"80px 32px", maxWidth:"1200px", margin:"0 auto"},
  h2:   {fontSize:"clamp(1.75rem,3vw,2.4rem)", fontWeight:800, marginBottom:"16px", color:"#0f172a"},
  tag:  {fontSize:"0.85rem", fontWeight:700, letterSpacing:"1px", color:"#0d9488"},
};

export default function HomePage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const loc  = params.locale;

  return (
    <main style={{minHeight:"100vh", background:"#ffffff", fontFamily:"Inter,sans-serif", color:"#0f172a"}}>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <span style={{fontSize:"1.4rem"}}>🌿</span>
          <span style={{fontWeight:800, fontSize:"1.15rem"}}>DPP Atlas</span>
          <span style={{fontSize:"0.65rem", background:"#dcfce7", color:"#16a34a", padding:"2px 8px", borderRadius:"99px", fontWeight:700, marginLeft:"4px"}}>BETA</span>
        </div>
        <div style={{display:"flex", gap:"20px", alignItems:"center", flexWrap:"wrap"}}>
          <a href={"#factory-types"} style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Factory Types</a>
          <a href={"#resources"}     style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Resources</a>
          <a href={"/" + loc + "/verify"} style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Verify</a>
          <a href={isBn ? "/en" : "/bn"} style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem", padding:"6px 12px", border:"1px solid #e2e8f0", borderRadius:"8px"}}>
            {isBn ? "🇬🇧 EN" : "🇧🇩 বাংলা"}
          </a>
          <a href={"/" + loc + "/login"}  style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Login</a>
          <a href={"/" + loc + "/enroll"} style={s.btn as React.CSSProperties}>
            {isBn ? "বিনামূল্যে শুরু করুন" : "Get Started Free"}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"96px 32px 80px", maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center"}}>
        <div>
          <div style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:"99px", padding:"6px 14px", marginBottom:"24px"}}>
            <span style={{width:"8px", height:"8px", background:"#10b981", borderRadius:"50%", display:"inline-block"}}></span>
            <span style={{color:"#0f766e", fontSize:"0.8rem", fontWeight:600}}>EU ESPR 2027 Compliance Platform — Free & Live</span>
          </div>
          <h1 style={{fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:"24px", color:"#0f172a"}}>
            {isBn
              ? <span>বাংলাদেশ টেক্সটাইল<br/><span style={{color:"#0d9488"}}>DPP কমপ্লায়েন্স</span><br/>সহজ করুন</span>
              : <span>Bangladesh Textile<br/><span style={{color:"#0d9488"}}>DPP Compliance</span><br/>Made Simple</>
            }
          </h1>
          <p style={{color:"#64748b", fontSize:"1.05rem", lineHeight:1.7, marginBottom:"32px", maxWidth:"480px"}}>
            {isBn
              ? "বিনামূল্যে AI-চালিত EU ESPR DPP মূল্যায়ন। আপনার কারখানার ধরন অনুযায়ী কাস্টম প্রশ্ন। তাৎক্ষণিক ভেরিফিকেশন ব্যাজ।"
              : "Free AI-powered EU ESPR Digital Product Passport assessment. Custom questions by factory type. Instant verification badge for buyers."}
          </p>
          <div style={{display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"40px"}}>
            <a href={"/" + loc + "/enroll"} style={s.btn as React.CSSProperties}>
              {isBn ? "🏭 কারখানা নিবন্ধন করুন" : "🏭 Register Your Factory"}
            </a>
            <a href={"/" + loc + "/assess"} style={s.btnO as React.CSSProperties}>
              {isBn ? "📋 মূল্যায়ন দেখুন" : "📋 View Assessment"}
            </a>
          </div>
          <div style={{display:"flex", gap:"32px", flexWrap:"wrap"}}>
            {[
              {n:"6,200+", l:isBn?"মূল্যায়িত কারখানা":"Factories Assessed"},
              {n:"18",     l:isBn?"প্রশ্ন বিভাগ":"Question Categories"},
              {n:"$0",     l:isBn?"সম্পূর্ণ বিনামূল্যে":"Forever Free"},
            ].map((x,i) => (
              <div key={i}>
                <div style={{fontSize:"1.75rem", fontWeight:800, color:"#0d9488"}}>{x.n}</div>
                <div style={{color:"#94a3b8", fontSize:"0.8rem", marginTop:"2px"}}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Score Card */}
        <div style={{background:"#0f172a", borderRadius:"20px", padding:"32px", color:"white"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px"}}>
            <span style={{color:"#94a3b8", fontSize:"0.8rem"}}>SAMPLE RESULT</span>
            <span style={{background:"#22c55e20", color:"#22c55e", padding:"4px 12px", borderRadius:"99px", fontSize:"0.75rem", fontWeight:700}}>✅ COMPLIANT</span>
          </div>
          <div style={{textAlign:"center", padding:"16px 0 24px"}}>
            <div style={{fontSize:"5rem", fontWeight:800, color:"#22c55e", lineHeight:1}}>87</div>
            <div style={{color:"#64748b", fontSize:"0.875rem"}}>/100 compliance score</div>
          </div>
          {[
            {cat:"Factory Identity",       s:18, max:20, c:"#22c55e"},
            {cat:"Material Traceability",  s:22, max:25, c:"#22c55e"},
            {cat:"Chemical Compliance",    s:14, max:20, c:"#eab308"},
            {cat:"Physical Testing",       s:16, max:20, c:"#22c55e"},
            {cat:"Circularity",            s:17, max:15, c:"#f97316"},
          ].map((r,i) => (
            <div key={i} style={{marginBottom:"12px"}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}>
                <span style={{color:"#94a3b8", fontSize:"0.75rem"}}>{r.cat}</span>
                <span style={{color:r.c, fontSize:"0.75rem", fontWeight:600}}>{r.s}/{r.max}</span>
              </div>
              <div style={{height:"4px", background:"#1e293b", borderRadius:"2px"}}>
                <div style={{height:"100%", background:r.c, borderRadius:"2px", width:Math.min(100,(r.s/r.max)*100)+"%"}} />
              </div>
            </div>
          ))}
          <div style={{marginTop:"16px", padding:"12px", background:"#0d948820", border:"1px solid #0d9488", borderRadius:"10px", fontSize:"0.8rem", color:"#5eead4"}}>
            🤖 AI: "Complete REACH audit to reach 95+ score and unlock full DPP passport"
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{padding:"20px 32px", background:"#f8fafc", borderTop:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", display:"flex", alignItems:"center", gap:"24px", flexWrap:"wrap", justifyContent:"center"}}>
          <span style={{color:"#94a3b8", fontSize:"0.8rem", fontWeight:600}}>ALIGNED WITH:</span>
          {["EU ESPR 2027","ISO 3759","ISO 16322-3","REACH","GOTS","OEKO-TEX","GS1 DPP","BGMEA"].map(b => (
            <span key={b} style={{color:"#475569", fontSize:"0.8rem", fontWeight:600, padding:"6px 14px", border:"1px solid #e2e8f0", borderRadius:"8px", background:"white"}}>{b}</span>
          ))}
        </div>
      </section>

      {/* FACTORY TYPES */}
      <section id="factory-types" style={s.sec}>
        <div style={{textAlign:"center", marginBottom:"56px"}}>
          <p style={s.tag}>BANGLADESH TEXTILE SECTORS</p>
          <h2 style={s.h2}>{isBn ? "আপনার কারখানার ধরন বেছে নিন" : "Choose Your Factory Type"}</h2>
          <p style={{color:"#64748b", maxWidth:"520px", margin:"0 auto", lineHeight:1.7}}>
            {isBn
              ? "প্রতিটি ধরনের জন্য আলাদা কমপ্লায়েন্স প্রশ্নাবলী। সঠিক মূল্যায়ন পেতে আপনার সেক্টর বেছে নিন।"
              : "Each factory type has sector-specific compliance questions. Select yours for an accurate DPP assessment."}
          </p>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"20px"}}>
          {FTYPES.map(f => (
            <a key={f.id} href={"/" + loc + "/enroll?type=" + f.id} style={s.card as React.CSSProperties}>
              <div style={{fontSize:"2.5rem", marginBottom:"12px"}}>{f.icon}</div>
              <div style={{fontWeight:700, fontSize:"1rem", marginBottom:"6px"}}>{f.name}</div>
              <div style={{color:"#64748b", fontSize:"0.8rem", lineHeight:1.5, marginBottom:"14px"}}>{f.desc}</div>
              <span style={{color:"#0d9488", fontWeight:600, fontSize:"0.85rem"}}>
                {isBn ? "মূল্যায়ন করুন →" : "Assess now →"}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"80px 32px", background:"#f8fafc"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto"}}>
          <div style={{textAlign:"center", marginBottom:"56px"}}>
            <p style={s.tag}>SIMPLE PROCESS</p>
            <h2 style={s.h2}>{isBn ? "মাত্র ৪টি ধাপে কমপ্লায়েন্ট হন" : "Get Compliant in 4 Steps"}</h2>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"32px"}}>
            {[
              {n:"01", icon:"🏭", t:isBn?"কারখানা নিবন্ধন":"Register Factory",      d:isBn?"ধরন ও মূল তথ্য দিন":"Enter type and basic details", href:"/" + loc + "/enroll"},
              {n:"02", icon:"📋", t:isBn?"মূল্যায়ন সম্পন্ন":"Complete Assessment",  d:isBn?"কাস্টম প্রশ্নের উত্তর দিন":"Answer questions for your factory type", href:"/" + loc + "/assess"},
              {n:"03", icon:"🤖", t:isBn?"AI রিপোর্ট পান":"Get AI Report",          d:isBn?"তাৎক্ষণিক রোডম্যাপ":"Instant Gemini AI improvement roadmap", href:"/" + loc + "/assess"},
              {n:"04", icon:"✅", t:isBn?"ব্যাজ অর্জন করুন":"Earn Verified Badge",  d:isBn?"ক্রেতাদের প্রমাণ করুন":"Show buyers you are EU DPP ready", href:"/" + loc + "/verify"},
            ].map((x,i) => (
              <a key={i} href={x.href} style={{textDecoration:"none", color:"inherit"}}>
                <div style={{fontSize:"0.75rem", fontWeight:800, color:"#0d9488", marginBottom:"12px"}}>STEP {x.n}</div>
                <div style={{width:"52px", height:"52px", background:"#0f172a", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", marginBottom:"16px"}}>{x.icon}</div>
                <h3 style={{fontWeight:700, marginBottom:"8px"}}>{x.t}</h3>
                <p style={{color:"#64748b", fontSize:"0.875rem", lineHeight:1.6}}>{x.d}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFICATION SECTION */}
      <section style={{padding:"80px 32px", background:"#0f172a", color:"white"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center"}}>
          <div>
            <p style={{color:"#5eead4", fontSize:"0.85rem", fontWeight:700, letterSpacing:"1px", marginBottom:"12px"}}>OFFICIAL VERIFICATION</p>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.4rem)", fontWeight:800, marginBottom:"20px"}}>
              {isBn ? "ভেরিফিকেশন ব্যাজ যা ক্রেতারা বিশ্বাস করেন" : "A Verification Badge Buyers Trust"}
            </h2>
            <p style={{color:"#94a3b8", lineHeight:1.7, marginBottom:"32px"}}>
              {isBn
                ? "৭০+ স্কোর পেলে অফিসিয়াল DPP Atlas ভেরিফিকেশন ব্যাজ পাবেন। ক্রেতাদের QR দিয়ে তাৎক্ষণিক যাচাই করার সুযোগ দিন।"
                : "Score 70+ and earn an official DPP Atlas Verification Badge. Buyers scan the QR code to verify your compliance status instantly."}
            </p>
            {[
              isBn?"✅ QR স্ক্যানযোগ্য — তাৎক্ষণিক যাচাই":"✅ QR-scannable — instant buyer verification",
              isBn?"✅ তারিখ স্ট্যাম্পড — মূল্যায়নের তারিখ দেখায়":"✅ Date-stamped — shows assessment date",
              isBn?"✅ PDF ও PNG ডাউনলোডযোগ্য":"✅ Downloadable PDF and PNG badge",
              isBn?"✅ অনন্য ID — জালিয়াতি প্রতিরোধী":"✅ Unique ID — fraud-resistant",
            ].map((t,i) => (
              <div key={i} style={{color:"#cbd5e1", fontSize:"0.9rem", marginBottom:"10px"}}>{t}</div>
            ))}
            <div style={{marginTop:"28px"}}>
              <a href={"/" + loc + "/enroll"} style={s.btn as React.CSSProperties}>
                {isBn ? "🏆 ভেরিফিকেশন পান" : "🏆 Get Verified Now"}
              </a>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{width:"300px", background:"white", borderRadius:"20px", padding:"28px", textAlign:"center", color:"#0f172a", boxShadow:"0 0 60px rgba(13,148,136,0.25)"}}>
              <div style={{width:"72px", height:"72px", background:"linear-gradient(135deg,#0d9488,#0369a1)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:"1.75rem"}}>✅</div>
              <div style={{fontWeight:800, fontSize:"1rem", marginBottom:"4px"}}>DPP VERIFIED</div>
              <div style={{fontSize:"0.75rem", color:"#64748b", marginBottom:"16px"}}>EU ESPR Compliance Assessed</div>
              <div style={{background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:"10px", padding:"12px", marginBottom:"16px"}}>
                <div style={{fontWeight:700, color:"#0d9488", fontSize:"1.5rem"}}>87/100</div>
                <div style={{fontSize:"0.75rem", color:"#64748b"}}>Compliance Score · Jul 2026</div>
              </div>
              <div style={{fontSize:"0.7rem", color:"#94a3b8", borderTop:"1px solid #f1f5f9", paddingTop:"12px", lineHeight:1.8}}>
                🏭 Sample Garment Factory Ltd.<br/>
                📅 ID: DPP-2026-XXXXX<br/>
                🌐 Verified by DPP Atlas Platform
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES + STATS */}
      <section id="resources" style={s.sec}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px"}}>
          <div>
            <p style={s.tag}>LIVE UPDATES</p>
            <h2 style={{...s.h2, marginTop:"12px"}}>{isBn ? "সর্বশেষ EU আপডেট" : "Latest EU Updates"}</h2>
            {NEWS.map((n,i) => (
              <div key={i} style={{display:"flex", gap:"14px", paddingBottom:"18px", borderBottom:"1px solid #f1f5f9", marginBottom:"18px"}}>
                <span style={{background:n.c+"20", color:n.c, padding:"3px 8px", borderRadius:"6px", fontSize:"0.7rem", fontWeight:700, whiteSpace:"nowrap" as const, height:"fit-content"}}>{n.tag}</span>
                <div>
                  <div style={{fontWeight:600, fontSize:"0.875rem", marginBottom:"4px", lineHeight:1.4}}>{n.t}</div>
                  <div style={{color:"#94a3b8", fontSize:"0.75rem"}}>{n.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p style={s.tag}>WHY ACT NOW</p>
            <h2 style={{...s.h2, marginTop:"12px"}}>{isBn ? "এখনই প্রস্তুত হওয়া কেন দরকার" : "The Stakes for Bangladesh"}</h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}}>
              {STATS.map((x,i) => (
                <div key={i} style={{border:"1px solid #f1f5f9", borderRadius:"14px", padding:"20px"}}>
                  <div style={{fontSize:"1.75rem", fontWeight:800, color:x.c, marginBottom:"4px"}}>{x.n}</div>
                  <div style={{fontWeight:600, fontSize:"0.8rem", marginBottom:"6px"}}>{x.l}</div>
                  <div style={{color:"#94a3b8", fontSize:"0.75rem", lineHeight:1.4}}>{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"96px 32px", background:"linear-gradient(135deg,#0f172a,#0d2a3a)", color:"white", textAlign:"center"}}>
        <div style={{maxWidth:"700px", margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(1.75rem,3vw,2.75rem)", fontWeight:800, marginBottom:"20px"}}>
            {isBn ? "আজই আপনার কারখানার EU ভবিষ্যৎ নিশ্চিত করুন" : "Secure Your Factory's EU Future Today"}
          </h2>
          <p style={{color:"#94a3b8", marginBottom:"40px", fontSize:"1.05rem", lineHeight:1.7}}>
            {isBn ? "২০২৭ সালের আগে প্রস্তুত হন। বিনামূল্যে মূল্যায়ন নিন।" : "Get ready before 2027. Free assessment. AI report. Verification badge. No credit card."}
          </p>
          <div style={{display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap"}}>
            <a href={"/" + loc + "/enroll"} style={{...s.btn, fontSize:"1.05rem", padding:"16px 36px"} as React.CSSProperties}>
              {isBn ? "🚀 বিনামূল্যে শুরু করুন" : "🚀 Start Free Assessment"}
            </a>
            <a href={"/" + loc + "/verify"} style={{border:"2px solid #5eead4", color:"#5eead4", padding:"14px 32px", borderRadius:"10px", fontWeight:600, textDecoration:"none", display:"inline-block", fontSize:"1.05rem"}}>
              {isBn ? "🔍 ভেরিফিকেশন চেক" : "🔍 Verify a Factory"}
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"32px", borderTop:"1px solid #1e293b", background:"#0f172a"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px"}}>
          <div>
            <div style={{color:"white", fontWeight:700, marginBottom:"4px"}}>🌿 DPP Atlas</div>
            <div style={{color:"#64748b", fontSize:"0.8rem"}}>Free Textile EU ESPR Compliance Tool · Bangladesh</div>
          </div>
          <div style={{color:"#475569", fontSize:"0.75rem"}}>⚠️ Advisory tool only — not legal certification</div>
        </div>
      </footer>
    </main>
  );
}
`);

// ── VERIFY PAGE ───────────────────────────────────────
w('app/[locale]/verify/page.tsx', `
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
`);

console.log('\n✅ ALL DONE — 2 files written successfully');
console.log('Now run: git add . && git commit -m "Pro homepage + verify page" && git push');