
"use client";
import { useState } from "react";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const isBn  = params.locale === "bn";
  const loc   = params.locale;
  const [mode,     setMode]     = useState<"login"|"signup">("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");
  const [isErr,    setIsErr]    = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!SUPA_URL || !SUPA_KEY) throw new Error("Supabase not configured");

      if (mode === "signup") {
        const res  = await fetch(SUPA_URL + "/auth/v1/signup", {
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SUPA_KEY},
          body: JSON.stringify({ email, password })
        });
        const data = await res.json() as { error?: { message?: string }; id?: string };
        if (!res.ok) throw new Error(data.error?.message || "Signup failed");
        setIsErr(false);
        setMsg(isBn
          ? "✅ নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে। ইনবক্স চেক করুন।"
          : "✅ Confirmation email sent. Check your inbox to verify.");
      } else {
        const res  = await fetch(SUPA_URL + "/auth/v1/token?grant_type=password", {
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SUPA_KEY},
          body: JSON.stringify({ email, password })
        });
        const data = await res.json() as { error?: { message?: string }; access_token?: string; user?: { id: string } };
        if (!res.ok) throw new Error(data.error?.message || "Login failed");
        // Store session in localStorage for client-side use
        localStorage.setItem("dpp_auth_token", data.access_token || "");
        localStorage.setItem("dpp_user_email", email);
        window.location.href = "/" + loc + "/dashboard";
      }
    } catch (err) {
      setIsErr(true);
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width:"100%", padding:"12px 16px",
    background:"#f8fafc", border:"1px solid #e2e8f0",
    borderRadius:"10px", color:"#0f172a",
    fontSize:"0.95rem", boxSizing:"border-box", outline:"none"
  };

  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:"420px"}}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <a href={"/"+loc} style={{color:"#0d9488",fontSize:"1.4rem",fontWeight:800,textDecoration:"none",display:"block",marginBottom:"8px"}}>
            🌿 DPP Atlas
          </a>
          <h1 style={{color:"#0f172a",fontSize:"1.5rem",fontWeight:700,marginBottom:"4px"}}>
            {mode==="login"?(isBn?"লগইন করুন":"Sign In"):(isBn?"অ্যাকাউন্ট তৈরি করুন":"Create Account")}
          </h1>
          <p style={{color:"#64748b",fontSize:"0.875rem"}}>
            {isBn?"আপনার DPP Atlas অ্যাকাউন্ট":"Your DPP Atlas account"}
          </p>
        </div>

        {/* Benefits banner */}
        <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:"12px",padding:"14px 16px",marginBottom:"24px",fontSize:"0.8rem",color:"#0f766e"}}>
          <div style={{fontWeight:700,marginBottom:"6px"}}>
            {isBn?"অ্যাকাউন্টের সুবিধা:":"Benefits of an account:"}
          </div>
          <div>✓ {isBn?"সব মূল্যায়ন সংরক্ষিত থাকে":"All assessments saved permanently"}</div>
          <div>✓ {isBn?"যেকোনো ডিভাইস থেকে অ্যাক্সেস":"Access from any device"}</div>
          <div>✓ {isBn?"স্কোর ট্র্যাকিং ও তুলনা":"Score history and comparison"}</div>
        </div>

        {/* Form */}
        <div style={{background:"white",borderRadius:"16px",padding:"32px",border:"1px solid #e2e8f0",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
          <form onSubmit={handle}>
            <div style={{marginBottom:"18px"}}>
              <label style={{color:"#374151",fontSize:"0.875rem",fontWeight:600,display:"block",marginBottom:"8px"}}>
                {isBn?"ইমেইল":"Email"}
              </label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                required placeholder="factory@example.com" style={inp} />
            </div>
            <div style={{marginBottom:"24px"}}>
              <label style={{color:"#374151",fontSize:"0.875rem",fontWeight:600,display:"block",marginBottom:"8px"}}>
                {isBn?"পাসওয়ার্ড":"Password"}
                {mode==="signup" && <span style={{color:"#94a3b8",fontWeight:400,marginLeft:"6px",fontSize:"0.78rem"}}>(min 6 chars)</span>}
              </label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                required minLength={6} placeholder="••••••••" style={inp} />
            </div>

            {msg && (
              <div style={{background:isErr?"#fef2f2":"#f0fdf4",border:"1px solid "+(isErr?"#fecaca":"#bbf7d0"),borderRadius:"10px",padding:"12px",marginBottom:"18px",color:isErr?"#dc2626":"#16a34a",fontSize:"0.875rem",lineHeight:1.5}}>
                {msg}
              </div>
            )}

            <button type="submit" disabled={loading} style={{width:"100%",padding:"14px",background:loading?"#94a3b8":"#0d9488",color:"white",border:"none",borderRadius:"12px",fontWeight:700,fontSize:"1rem",cursor:loading?"not-allowed":"pointer",transition:"background 0.2s"}}>
              {loading?"⏳ "+( isBn?"অপেক্ষা করুন...":"Please wait...")
                :mode==="login"?(isBn?"লগইন করুন":"Sign In"):(isBn?"অ্যাকাউন্ট তৈরি করুন":"Create Account")}
            </button>
          </form>

          <div style={{textAlign:"center",marginTop:"20px"}}>
            <button onClick={()=>{setMode(m=>m==="login"?"signup":"login");setMsg("");}}
              style={{background:"none",border:"none",color:"#0d9488",cursor:"pointer",fontSize:"0.875rem",fontWeight:500}}>
              {mode==="login"
                ?(isBn?"নতুন ব্যবহারকারী? অ্যাকাউন্ট তৈরি করুন":"New user? Create an account")
                :(isBn?"ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন":"Already have an account? Sign in")}
            </button>
          </div>
        </div>

        {/* Skip login */}
        <div style={{textAlign:"center",marginTop:"20px",display:"flex",justifyContent:"center",gap:"20px"}}>
          <a href={"/"+loc} style={{color:"#94a3b8",fontSize:"0.8rem",textDecoration:"none"}}>
            ← {isBn?"হোমপেজে ফিরুন":"Back to home"}
          </a>
          <span style={{color:"#e2e8f0"}}>·</span>
          <a href={"/"+loc+"/assess"} style={{color:"#0d9488",fontSize:"0.8rem",textDecoration:"none",fontWeight:500}}>
            {isBn?"লগইন ছাড়াই মূল্যায়ন করুন →":"Continue without login →"}
          </a>
        </div>
      </div>
    </main>
  );
}
