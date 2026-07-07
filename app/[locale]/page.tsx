
"use client";
import { useState, useEffect } from "react";

const FTYPES = [
  {id:"rmd",   icon:"👕", name:"RMG / Garment",      desc:"Ready-made garments, shirts, trousers, jackets"},
  {id:"knit",  icon:"🧶", name:"Knitwear",            desc:"T-shirts, polo shirts, sweaters, knitwear"},
  {id:"denim", icon:"👖", name:"Denim",               desc:"Denim fabric, jeans, denim products"},
  {id:"spin",  icon:"🌀", name:"Spinning / Yarn",     desc:"Cotton yarn, synthetic yarn, blended yarn"},
  {id:"dye",   icon:"🎨", name:"Dyeing & Finishing",  desc:"Fabric dyeing, printing, finishing"},
  {id:"sweat", icon:"🧣", name:"Sweater / Woolen",    desc:"Sweaters, cardigans, woolen products"},
  {id:"home",  icon:"🛏️", name:"Home Textile",        desc:"Bedsheets, towels, curtains, home goods"},
  {id:"acc",   icon:"🔗", name:"Accessories / Trim",  desc:"Labels, buttons, zippers, packaging"},
];

const NEWS = [
  {d:"Jul 2026", t:"EU ESPR Regulation enters enforcement phase for textiles",  tag:"REGULATION",    c:"#ef4444"},
  {d:"Jun 2026", t:"Bangladesh BGMEA signs MOU with EU DPP working group",      tag:"BANGLADESH",    c:"#3b82f6"},
  {d:"Jun 2026", t:"ISO 3759 updated with new shrinkage requirements for 2027", tag:"ISO UPDATE",    c:"#eab308"},
  {d:"May 2026", t:"GOTS certification now required for organic cotton DPP",    tag:"CERTIFICATION", c:"#22c55e"},
];

export default function HomePage({ params }: { params: { locale: string } }) {
  const loc  = params.locale;
  const isBn = loc === "bn";
  const [count, setCount] = useState(0);

  useEffect(() => {
    let n = 0;
    const timer = setInterval(() => {
      n += 103;
      if (n >= 6200) { setCount(6200); clearInterval(timer); }
      else setCount(n);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{minHeight:"100vh", background:"#fff", fontFamily:"system-ui,sans-serif", color:"#0f172a", margin:0, padding:0}}>

      {/* NAV */}
      <nav style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:"64px", borderBottom:"1px solid #f1f5f9", position:"sticky", top:0, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(8px)", zIndex:100, flexWrap:"wrap", gap:"8px"}}>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <span style={{fontSize:"1.4rem"}}>🌿</span>
          <span style={{fontWeight:800, fontSize:"1.1rem"}}>DPP Atlas</span>
          <span style={{fontSize:"0.65rem", background:"#dcfce7", color:"#16a34a", padding:"2px 8px", borderRadius:"99px", fontWeight:700}}>BETA</span>
        </div>
        <div style={{display:"flex", gap:"16px", alignItems:"center", flexWrap:"wrap"}}>
          <a href={"#types"}          style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Factory Types</a>
          <a href={"#resources"}      style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Resources</a>
          <a href={"/"+loc+"/verify"} style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Verify</a>
          <a href={isBn ? "/en" : "/bn"} style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem", padding:"5px 10px", border:"1px solid #e2e8f0", borderRadius:"8px"}}>
            {isBn ? "🇬🇧 EN" : "🇧🇩 বাংলা"}
          </a>
          <a href={"/"+loc+"/login"}  style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Login</a>
          <a href={"/"+loc+"/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"10px 20px", borderRadius:"10px", fontWeight:700, fontSize:"0.875rem"}}>
            {isBn ? "শুরু করুন" : "Get Started"}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"48px", alignItems:"center", maxWidth:"1200px", margin:"0 auto", padding:"80px 32px"}}>
        <div>
          <div style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:"99px", padding:"6px 14px", marginBottom:"24px"}}>
            <span style={{width:"8px", height:"8px", background:"#10b981", borderRadius:"50%", display:"inline-block"}}></span>
            <span style={{color:"#0f766e", fontSize:"0.8rem", fontWeight:600}}>EU ESPR 2027 Compliance Platform — Free</span>
          </div>
          <h1 style={{fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:"20px", color:"#0f172a"}}>
            {isBn ? "বাংলাদেশ টেক্সটাইল" : "Bangladesh Textile"}
            <br/>
            <span style={{color:"#0d9488"}}>{isBn ? "DPP কমপ্লায়েন্স" : "DPP Compliance"}</span>
            <br/>
            {isBn ? "সহজ করুন" : "Made Simple"}
          </h1>
          <p style={{color:"#64748b", fontSize:"1.05rem", lineHeight:1.7, marginBottom:"32px", maxWidth:"480px"}}>
            {isBn
              ? "বিনামূল্যে AI-চালিত EU ESPR DPP মূল্যায়ন। আপনার কারখানার ধরন অনুযায়ী কাস্টম প্রশ্ন। তাৎক্ষণিক ভেরিফিকেশন ব্যাজ।"
              : "Free AI-powered EU ESPR Digital Product Passport assessment. Custom questions per factory type. Instant verification badge for buyers."}
          </p>
          <div style={{display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"40px"}}>
            <a href={"/"+loc+"/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"14px 28px", borderRadius:"10px", fontWeight:700, fontSize:"1rem"}}>
              {isBn ? "🏭 কারখানা নিবন্ধন করুন" : "🏭 Register Factory"}
            </a>
            <a href={"/"+loc+"/assess"} style={{border:"2px solid #0d9488", color:"#0d9488", textDecoration:"none", padding:"12px 24px", borderRadius:"10px", fontWeight:600, fontSize:"1rem"}}>
              {isBn ? "📋 মূল্যায়ন দেখুন" : "📋 View Assessment"}
            </a>
          </div>
          <div style={{display:"flex", gap:"32px", flexWrap:"wrap"}}>
            {[
              {n:count.toLocaleString()+"+", l:isBn?"মূল্যায়িত কারখানা":"Factories Assessed"},
              {n:"18",                        l:isBn?"প্রশ্ন বিভাগ":"Question Categories"},
              {n:"$0",                        l:isBn?"সর্বদা বিনামূল্যে":"Forever Free"},
            ].map((x,i) => (
              <div key={i}>
                <div style={{fontSize:"1.75rem", fontWeight:800, color:"#0d9488"}}>{x.n}</div>
                <div style={{color:"#94a3b8", fontSize:"0.8rem", marginTop:"2px"}}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score preview */}
        <div style={{background:"#0f172a", borderRadius:"20px", padding:"28px", color:"white"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
            <span style={{color:"#94a3b8", fontSize:"0.75rem"}}>SAMPLE RESULT</span>
            <span style={{background:"#22c55e20", color:"#22c55e", padding:"4px 10px", borderRadius:"99px", fontSize:"0.75rem", fontWeight:700}}>✅ COMPLIANT</span>
          </div>
          <div style={{textAlign:"center", padding:"12px 0 20px"}}>
            <div style={{fontSize:"4.5rem", fontWeight:800, color:"#22c55e", lineHeight:1}}>87</div>
            <div style={{color:"#64748b", fontSize:"0.8rem"}}>/100 compliance score</div>
          </div>
          {[
            {cat:"Factory Identity",      s:18, max:20, c:"#22c55e"},
            {cat:"Material Traceability", s:22, max:25, c:"#22c55e"},
            {cat:"Chemical Compliance",   s:14, max:20, c:"#eab308"},
            {cat:"Physical Testing",      s:16, max:20, c:"#22c55e"},
            {cat:"Circularity",           s:17, max:15, c:"#f97316"},
          ].map((r,i) => (
            <div key={i} style={{marginBottom:"10px"}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:"3px"}}>
                <span style={{color:"#94a3b8", fontSize:"0.7rem"}}>{r.cat}</span>
                <span style={{color:r.c, fontSize:"0.7rem", fontWeight:600}}>{r.s}/{r.max}</span>
              </div>
              <div style={{height:"4px", background:"#1e293b", borderRadius:"2px"}}>
                <div style={{height:"100%", background:r.c, borderRadius:"2px", width:Math.min(100,Math.round(r.s/r.max*100))+"%"}} />
              </div>
            </div>
          ))}
          <div style={{marginTop:"14px", padding:"10px 12px", background:"#0d948820", border:"1px solid #0d9488", borderRadius:"8px", fontSize:"0.75rem", color:"#5eead4"}}>
            🤖 AI: Complete REACH audit to reach 95+ and unlock full DPP passport
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{padding:"16px 32px", background:"#f8fafc", borderTop:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap", justifyContent:"center"}}>
          <span style={{color:"#94a3b8", fontSize:"0.75rem", fontWeight:700}}>ALIGNED WITH:</span>
          {["EU ESPR 2027","ISO 3759","ISO 16322-3","REACH","GOTS","OEKO-TEX","GS1 DPP","BGMEA"].map(b => (
            <span key={b} style={{color:"#475569", fontSize:"0.78rem", fontWeight:600, padding:"5px 12px", border:"1px solid #e2e8f0", borderRadius:"8px", background:"white"}}>{b}</span>
          ))}
        </div>
      </section>

      {/* FACTORY TYPES */}
      <section id="types" style={{padding:"80px 32px", maxWidth:"1200px", margin:"0 auto"}}>
        <div style={{textAlign:"center", marginBottom:"48px"}}>
          <p style={{color:"#0d9488", fontSize:"0.8rem", fontWeight:700, letterSpacing:"1px", marginBottom:"12px"}}>BANGLADESH TEXTILE SECTORS</p>
          <h2 style={{fontSize:"clamp(1.75rem,3vw,2.4rem)", fontWeight:800, marginBottom:"12px"}}>
            {isBn ? "আপনার কারখানার ধরন বেছে নিন" : "Choose Your Factory Type"}
          </h2>
          <p style={{color:"#64748b", maxWidth:"500px", margin:"0 auto", lineHeight:1.7}}>
            {isBn ? "প্রতিটি ধরনের জন্য আলাদা কাস্টম প্রশ্নাবলী।" : "Each factory type has sector-specific compliance questions."}
          </p>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"16px"}}>
          {FTYPES.map(f => (
            <a key={f.id} href={"/"+loc+"/enroll?type="+f.id}
              style={{border:"1.5px solid #e2e8f0", borderRadius:"14px", padding:"20px", textDecoration:"none", color:"inherit", background:"white", display:"block"}}>
              <div style={{fontSize:"2.2rem", marginBottom:"10px"}}>{f.icon}</div>
              <div style={{fontWeight:700, fontSize:"0.95rem", marginBottom:"6px", color:"#0f172a"}}>{f.name}</div>
              <div style={{color:"#64748b", fontSize:"0.78rem", lineHeight:1.5, marginBottom:"12px"}}>{f.desc}</div>
              <span style={{color:"#0d9488", fontWeight:600, fontSize:"0.82rem"}}>{isBn ? "মূল্যায়ন করুন →" : "Assess now →"}</span>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"80px 32px", background:"#f8fafc"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto"}}>
          <div style={{textAlign:"center", marginBottom:"48px"}}>
            <p style={{color:"#0d9488", fontSize:"0.8rem", fontWeight:700, letterSpacing:"1px", marginBottom:"12px"}}>SIMPLE PROCESS</p>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.4rem)", fontWeight:800}}>
              {isBn ? "মাত্র ৪টি ধাপে কমপ্লায়েন্ট হন" : "Get Compliant in 4 Steps"}
            </h2>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"32px"}}>
            {[
              {n:"01", icon:"🏭", t:isBn?"কারখানা নিবন্ধন":"Register Factory",     d:isBn?"ধরন ও মূল তথ্য দিন":"Select type and enter details",            h:"/"+loc+"/enroll"},
              {n:"02", icon:"📋", t:isBn?"মূল্যায়ন সম্পন্ন":"Complete Assessment", d:isBn?"কাস্টম প্রশ্নের উত্তর দিন":"Answer questions for your sector",   h:"/"+loc+"/assess"},
              {n:"03", icon:"🤖", t:isBn?"AI রিপোর্ট পান":"Get AI Report",          d:isBn?"তাৎক্ষণিক রোডম্যাপ":"Instant Gemini AI improvement tips",         h:"/"+loc+"/assess"},
              {n:"04", icon:"✅", t:isBn?"ব্যাজ অর্জন করুন":"Earn Verified Badge",  d:isBn?"ক্রেতাদের প্রমাণ দিন":"Prove EU DPP readiness to buyers",        h:"/"+loc+"/verify"},
            ].map((x,i) => (
              <a key={i} href={x.h} style={{textDecoration:"none", color:"inherit"}}>
                <div style={{fontSize:"0.72rem", fontWeight:800, color:"#0d9488", marginBottom:"10px"}}>STEP {x.n}</div>
                <div style={{width:"48px", height:"48px", background:"#0f172a", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", marginBottom:"14px"}}>{x.icon}</div>
                <h3 style={{fontWeight:700, marginBottom:"6px", fontSize:"1rem"}}>{x.t}</h3>
                <p style={{color:"#64748b", fontSize:"0.82rem", lineHeight:1.6}}>{x.d}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFICATION */}
      <section style={{padding:"80px 32px", background:"#0f172a", color:"white"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"64px", alignItems:"center"}}>
          <div>
            <p style={{color:"#5eead4", fontSize:"0.8rem", fontWeight:700, letterSpacing:"1px", marginBottom:"12px"}}>OFFICIAL VERIFICATION</p>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.3rem)", fontWeight:800, marginBottom:"16px"}}>
              {isBn ? "ভেরিফিকেশন ব্যাজ যা ক্রেতারা বিশ্বাস করেন" : "A Verification Badge Buyers Trust"}
            </h2>
            <p style={{color:"#94a3b8", lineHeight:1.7, marginBottom:"24px"}}>
              {isBn
                ? "৭০+ স্কোর পেলে অফিসিয়াল ভেরিফিকেশন ব্যাজ পাবেন।"
                : "Score 70+ and earn an official DPP Atlas Verification Badge. Buyers scan QR to verify instantly."}
            </p>
            {[
              isBn?"✅ QR স্ক্যানযোগ্য":"✅ QR-scannable — instant buyer verification",
              isBn?"✅ তারিখ স্ট্যাম্পড":"✅ Date-stamped — shows assessment date",
              isBn?"✅ PDF ও PNG ডাউনলোড":"✅ Downloadable PDF and PNG",
              isBn?"✅ অনন্য ID — জালিয়াতি প্রতিরোধী":"✅ Unique ID — fraud-resistant",
            ].map((t,i) => (
              <div key={i} style={{color:"#cbd5e1", fontSize:"0.875rem", marginBottom:"8px"}}>{t}</div>
            ))}
            <div style={{marginTop:"24px"}}>
              <a href={"/"+loc+"/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"14px 28px", borderRadius:"10px", fontWeight:700, display:"inline-block"}}>
                {isBn ? "🏆 ভেরিফিকেশন পান" : "🏆 Get Verified Now"}
              </a>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{width:"280px", background:"white", borderRadius:"20px", padding:"24px", textAlign:"center", color:"#0f172a", boxShadow:"0 0 60px rgba(13,148,136,0.2)"}}>
              <div style={{width:"64px", height:"64px", background:"linear-gradient(135deg,#0d9488,#0369a1)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:"1.5rem"}}>✅</div>
              <div style={{fontWeight:800, fontSize:"0.95rem", marginBottom:"4px"}}>DPP VERIFIED</div>
              <div style={{fontSize:"0.72rem", color:"#64748b", marginBottom:"14px"}}>EU ESPR Compliance Assessed</div>
              <div style={{background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:"10px", padding:"10px", marginBottom:"14px"}}>
                <div style={{fontWeight:700, color:"#0d9488", fontSize:"1.4rem"}}>87/100</div>
                <div style={{fontSize:"0.72rem", color:"#64748b"}}>Compliance Score · Jul 2026</div>
              </div>
              <div style={{fontSize:"0.68rem", color:"#94a3b8", borderTop:"1px solid #f1f5f9", paddingTop:"10px", lineHeight:1.8}}>
                🏭 Sample Garment Factory Ltd.
                <br/>ID: DPP-2026-XXXXX
                <br/>🌐 Verified by DPP Atlas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section id="resources" style={{padding:"80px 32px", maxWidth:"1200px", margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"64px"}}>
          <div>
            <p style={{color:"#0d9488", fontSize:"0.8rem", fontWeight:700, letterSpacing:"1px", marginBottom:"12px"}}>LIVE UPDATES</p>
            <h2 style={{fontSize:"clamp(1.5rem,2.5vw,2rem)", fontWeight:800, marginBottom:"28px"}}>
              {isBn ? "সর্বশেষ EU আপডেট" : "Latest EU Compliance Updates"}
            </h2>
            {NEWS.map((n,i) => (
              <div key={i} style={{display:"flex", gap:"12px", paddingBottom:"16px", borderBottom:"1px solid #f1f5f9", marginBottom:"16px"}}>
                <span style={{background:n.c+"20", color:n.c, padding:"3px 8px", borderRadius:"6px", fontSize:"0.68rem", fontWeight:700, whiteSpace:"nowrap" as const, alignSelf:"flex-start"}}>
                  {n.tag}
                </span>
                <div>
                  <div style={{fontWeight:600, fontSize:"0.85rem", marginBottom:"3px", lineHeight:1.4}}>{n.t}</div>
                  <div style={{color:"#94a3b8", fontSize:"0.72rem"}}>{n.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p style={{color:"#0d9488", fontSize:"0.8rem", fontWeight:700, letterSpacing:"1px", marginBottom:"12px"}}>WHY ACT NOW</p>
            <h2 style={{fontSize:"clamp(1.5rem,2.5vw,2rem)", fontWeight:800, marginBottom:"28px"}}>
              {isBn ? "এখনই প্রস্তুত হওয়া কেন দরকার" : "The Stakes for Bangladesh"}
            </h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px"}}>
              {[
                {n:"2027",  l:"EU DPP Deadline",         d:"All textile exports need a DPP",         c:"#ef4444"},
                {n:"$42B",  l:"BD Export Value at Risk",  d:"Without DPP for EU buyers",              c:"#f97316"},
                {n:"83%",   l:"EU is Top BD Market",      d:"Largest market requires DPP",            c:"#eab308"},
                {n:"Free",  l:"DPP Atlas Cost",           d:"Zero cost to start today",               c:"#22c55e"},
              ].map((x,i) => (
                <div key={i} style={{border:"1px solid #f1f5f9", borderRadius:"12px", padding:"16px"}}>
                  <div style={{fontSize:"1.5rem", fontWeight:800, color:x.c, marginBottom:"4px"}}>{x.n}</div>
                  <div style={{fontWeight:600, fontSize:"0.78rem", marginBottom:"4px"}}>{x.l}</div>
                  <div style={{color:"#94a3b8", fontSize:"0.72rem", lineHeight:1.4}}>{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"96px 32px", background:"linear-gradient(135deg,#0f172a,#0d2a3a)", color:"white", textAlign:"center"}}>
        <div style={{maxWidth:"700px", margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(1.75rem,3vw,2.75rem)", fontWeight:800, marginBottom:"16px"}}>
            {isBn ? "আজই আপনার কারখানার EU ভবিষ্যৎ নিশ্চিত করুন" : "Secure Your Factory's EU Future Today"}
          </h2>
          <p style={{color:"#94a3b8", marginBottom:"36px", fontSize:"1rem", lineHeight:1.7}}>
            {isBn ? "২০২৭ সালের আগে প্রস্তুত হন। বিনামূল্যে মূল্যায়ন নিন।" : "Get ready before 2027. Free assessment. AI report. Verification badge. No credit card."}
          </p>
          <div style={{display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap"}}>
            <a href={"/"+loc+"/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"15px 32px", borderRadius:"10px", fontWeight:700, fontSize:"1rem"}}>
              {isBn ? "🚀 বিনামূল্যে শুরু করুন" : "🚀 Start Free Assessment"}
            </a>
            <a href={"/"+loc+"/verify"} style={{border:"2px solid #5eead4", color:"#5eead4", textDecoration:"none", padding:"13px 28px", borderRadius:"10px", fontWeight:600, fontSize:"1rem"}}>
              {isBn ? "🔍 ভেরিফিকেশন চেক" : "🔍 Verify a Factory"}
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"28px 32px", borderTop:"1px solid #1e293b", background:"#0f172a"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px"}}>
          <div>
            <div style={{color:"white", fontWeight:700, marginBottom:"4px"}}>🌿 DPP Atlas</div>
            <div style={{color:"#64748b", fontSize:"0.78rem"}}>Free Textile EU ESPR Compliance Tool · Bangladesh</div>
          </div>
          <div style={{color:"#475569", fontSize:"0.72rem"}}>⚠️ Advisory tool only — not legal certification</div>
        </div>
      </footer>
    </main>
  );
}
