
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
