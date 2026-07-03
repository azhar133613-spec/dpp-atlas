
"use client";
import { useState } from "react";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const isBn = params.locale === "bn";
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isErr, setIsErr] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const endpoint = mode === "signup"
        ? URL + "/auth/v1/signup"
        : URL + "/auth/v1/token?grant_type=password";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": KEY || "" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || "Error");
      if (mode === "signup") {
        setIsErr(false);
        setMsg("Check your email for a confirmation link!");
      } else {
        localStorage.setItem("dpp_session", JSON.stringify(data));
        window.location.href = "/" + params.locale + "/dashboard";
      }
    } catch (err: any) {
      setIsErr(true);
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: "100%", padding: "12px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "white", fontSize: "0.95rem", boxSizing: "border-box" as const };

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href={"/" + params.locale} style={{ color: "#14b8a6", fontSize: "1.25rem", fontWeight: 700, textDecoration: "none" }}>🌿 DPP Atlas</a>
          <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginTop: "16px" }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
        </div>
        <div style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", border: "1px solid #334155" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "#94a3b8", fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" style={inp} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ color: "#94a3b8", fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minimum 6 characters" style={inp} />
            </div>
            {msg && (
              <div style={{ padding: "12px", borderRadius: "10px", marginBottom: "20px", background: isErr ? "#ef444420" : "#22c55e20", border: "1px solid " + (isErr ? "#ef4444" : "#22c55e"), color: isErr ? "#fca5a5" : "#86efac", fontSize: "0.875rem" }}>
                {msg}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: "#0d9488", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(""); }} style={{ background: "none", border: "none", color: "#14b8a6", cursor: "pointer", fontSize: "0.875rem" }}>
              {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <a href={"/" + params.locale} style={{ color: "#64748b", fontSize: "0.875rem", textDecoration: "none" }}>← Back to home</a>
        </div>
      </div>
    </main>
  );
}
