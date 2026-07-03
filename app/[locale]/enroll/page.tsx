
"use client";
import { useState } from "react";

export default function EnrollPage({ params }: { params: { locale: string } }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ factory_name: "", contact_name: "", email: "", country: "Bangladesh", tier_level: "tier1", address: "", workers: "", product_type: "" });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const factory = { ...form, id: Date.now().toString(), created_at: new Date().toISOString() };
    localStorage.setItem("dpp_factory", JSON.stringify(factory));
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
  };

  if (done) return (
    <main style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>✅</div>
        <h2 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, marginBottom: "12px" }}>Factory Registered!</h2>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>{form.factory_name} registered successfully.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={"/" + params.locale + "/assess"} style={{ background: "#0d9488", color: "white", textDecoration: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700 }}>Start Assessment</a>
          <a href={"/" + params.locale + "/dashboard"} style={{ border: "1px solid #334155", color: "#94a3b8", textDecoration: "none", padding: "14px 28px", borderRadius: "12px" }}>Go to Dashboard</a>
        </div>
      </div>
    </main>
  );

  const inp = { width: "100%", padding: "12px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "white", fontSize: "0.95rem", boxSizing: "border-box" as const };
  const lbl = { color: "#94a3b8", fontSize: "0.875rem", display: "block", marginBottom: "8px" };

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", padding: "24px", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "700px", margin: "0 auto 32px" }}>
        <a href={"/" + params.locale} style={{ color: "#14b8a6", fontWeight: 700, fontSize: "1.25rem", textDecoration: "none" }}>🌿 DPP Atlas</a>
        <a href={"/" + params.locale + "/login"} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem" }}>Login</a>
      </nav>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, marginBottom: "8px" }}>🏭 Register Your Factory</h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>Register and start your free DPP compliance assessment.</p>
        <form onSubmit={submit} style={{ background: "#1e293b", borderRadius: "16px", padding: "32px", border: "1px solid #334155" }}>
          <div style={{ display: "grid", gap: "20px" }}>
            <div><label style={lbl}>Factory Name *</label><input name="factory_name" value={form.factory_name} onChange={set} required placeholder="ABC Textile Mills Ltd." style={inp} /></div>
            <div><label style={lbl}>Contact Person *</label><input name="contact_name" value={form.contact_name} onChange={set} required placeholder="Your full name" style={inp} /></div>
            <div><label style={lbl}>Email *</label><input name="email" type="email" value={form.email} onChange={set} required placeholder="factory@example.com" style={inp} /></div>
            <div><label style={lbl}>Factory Address</label><input name="address" value={form.address} onChange={set} placeholder="Full address" style={inp} /></div>
            <div><label style={lbl}>Number of Workers</label><input name="workers" type="number" value={form.workers} onChange={set} placeholder="500" style={inp} /></div>
            <div><label style={lbl}>Main Product Type</label><input name="product_type" value={form.product_type} onChange={set} placeholder="e.g. Knitwear, Woven Shirts" style={inp} /></div>
            <div>
              <label style={lbl}>Supply Chain Tier *</label>
              <select name="tier_level" value={form.tier_level} onChange={set} style={inp}>
                <option value="tier1">Tier 1 - Garment Manufacturing</option>
                <option value="tier2">Tier 2 - Fabric / Dyeing</option>
                <option value="tier3">Tier 3 - Yarn Production</option>
                <option value="tier4">Tier 4 - Raw Fiber</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Country *</label>
              <select name="country" value={form.country} onChange={set} style={inp}>
                {["Bangladesh","India","Pakistan","Sri Lanka","Vietnam","Cambodia","Indonesia","Turkey","China","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "28px", padding: "16px", background: "#0d9488", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "Registering..." : "✅ Register Factory"}
          </button>
        </form>
      </div>
    </main>
  );
}
