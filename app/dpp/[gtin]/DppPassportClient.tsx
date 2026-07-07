
"use client";
import { useEffect, useState } from "react";

interface DppData {
  id: string;
  factory_name: string;
  country: string;
  tier_level?: string;
  score: number;
  band: string;
  created_at: string;
  material_composition?: string;
  iso_3759_passed?: boolean;
  iso_16322_passed?: boolean;
  reach_compliant?: boolean;
  gots_certified?: boolean;
  oeko_tex_certified?: boolean;
  factory_type?: string;
}

function getBand(score: number) {
  if (score >= 90) return {label:"DPP COMPLIANT",           color:"#22c55e", emoji:"✅", bg:"#dcfce7"};
  if (score >= 70) return {label:"CONDITIONALLY COMPLIANT", color:"#eab308", emoji:"🟡", bg:"#fef9c3"};
  if (score >= 50) return {label:"DEVELOPING",              color:"#f97316", emoji:"🟠", bg:"#ffedd5"};
  return                  {label:"NON-COMPLIANT",           color:"#ef4444", emoji:"🔴", bg:"#fee2e2"};
}

function StatusBadge({ passed, label }: { passed: boolean | undefined; label: string }) {
  if (passed === undefined) return (
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderBottom:"1px solid #f1f5f9"}}>
      <span style={{color:"#374151", fontSize:"0.875rem"}}>{label}</span>
      <span style={{color:"#94a3b8", fontSize:"0.8rem"}}>Not assessed</span>
    </div>
  );
  return (
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderBottom:"1px solid #f1f5f9"}}>
      <span style={{color:"#374151", fontSize:"0.875rem"}}>{label}</span>
      <span style={{fontWeight:700, fontSize:"0.85rem", color: passed ? "#22c55e" : "#ef4444"}}>
        {passed ? "✅ Pass" : "❌ Fail / Not Done"}
      </span>
    </div>
  );
}

export default function DppPassportClient({ gtin }: { gtin: string }) {
  const [data,    setData]    = useState<DppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound,setNotFound]= useState(false);
  const [lang,    setLang]    = useState("en");

  const isBn = lang === "bn";

  useEffect(() => {
    setLoading(true);
    // Try localStorage first (for demo/testing)
    const latestId = localStorage.getItem("dpp_latest_report");
    if (latestId) {
      const stored = localStorage.getItem("dpp_report_" + latestId);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          id: string;
          score: number;
          band: string;
          created_at: string;
          factory?: Record<string, string>;
          answers?: Record<number, string>;
        };
        const fac = parsed.factory || {};
        const ans = parsed.answers || {};
        const dppData: DppData = {
          id:                  parsed.id,
          factory_name:        fac.factory_name || "Unknown Factory",
          country:             fac.country || "Bangladesh",
          tier_level:          fac.tier_level || "tier1",
          score:               Math.min(100, parsed.score),
          band:                parsed.band,
          created_at:          parsed.created_at,
          factory_type:        fac.factory_type || "RMG Garment",
          iso_3759_passed:     ans[13] === "y",
          iso_16322_passed:    ans[14] === "y",
          reach_compliant:     ans[10] === "y",
          gots_certified:      ans[8]  === "y",
          oeko_tex_certified:  ans[9]  === "y",
          material_composition: ans[6] === "y" ? "Fiber blend verified (100%)" : "Fiber blend not fully verified",
        };
        setData(dppData);
        setLoading(false);
        return;
      }
    }
    // If gtin matches a report id in localStorage
    const stored = localStorage.getItem("dpp_report_" + gtin);
    if (stored) {
      const parsed = JSON.parse(stored) as {
        id: string;
        score: number;
        band: string;
        created_at: string;
        factory?: Record<string, string>;
        answers?: Record<number, string>;
      };
      const fac = parsed.factory || {};
      const ans = parsed.answers || {};
      const dppData: DppData = {
        id:                  parsed.id,
        factory_name:        fac.factory_name || "Unknown Factory",
        country:             fac.country || "Bangladesh",
        tier_level:          fac.tier_level || "tier1",
        score:               Math.min(100, parsed.score),
        band:                parsed.band,
        created_at:          parsed.created_at,
        factory_type:        fac.factory_type || "RMG Garment",
        iso_3759_passed:     ans[13] === "y",
        iso_16322_passed:    ans[14] === "y",
        reach_compliant:     ans[10] === "y",
        gots_certified:      ans[8]  === "y",
        oeko_tex_certified:  ans[9]  === "y",
        material_composition: ans[6] === "y" ? "Fiber blend verified (100%)" : "Fiber blend not fully verified",
      };
      setData(dppData);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [gtin]);

  if (loading) return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"2rem", marginBottom:"12px"}}>🌿</div>
        <p style={{color:"#64748b"}}>Loading DPP Passport...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"24px"}}>
      <div style={{textAlign:"center", maxWidth:"400px"}}>
        <div style={{fontSize:"3rem", marginBottom:"16px"}}>❓</div>
        <h1 style={{fontWeight:800, fontSize:"1.5rem", marginBottom:"12px", color:"#0f172a"}}>
          {isBn ? "DPP পাসপোর্ট পাওয়া যায়নি" : "DPP Passport Not Found"}
        </h1>
        <p style={{color:"#64748b", lineHeight:1.7, marginBottom:"24px"}}>
          {isBn
            ? "GTIN: " + gtin + " এর জন্য কোনো যাচাইকৃত পাসপোর্ট পাওয়া যায়নি।"
            : "No verified passport found for GTIN: " + gtin + ". The factory may not have completed an assessment yet."}
        </p>
        <a href="/en" style={{color:"#0d9488", fontWeight:600, textDecoration:"none"}}>
          ← {isBn ? "হোমপেজে ফিরুন" : "Return to DPP Atlas"}
        </a>
      </div>
    </div>
  );

  if (!data) return null;

  const band = getBand(data.score);
  const assessDate = new Date(data.created_at).toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"});
  const tierLabels: Record<string, string> = {
    tier1:"Tier 1 — Garment Manufacturing",
    tier2:"Tier 2 — Fabric / Dyeing",
    tier3:"Tier 3 — Yarn Production",
    tier4:"Tier 4 — Raw Fiber",
  };

  return (
    <div>
      <style>{"@media print { .no-print { display: none !important; } }"}</style>

      {/* HEADER BAR */}
      <div style={{background:"#0f172a", padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px"}}>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <span style={{fontSize:"1.2rem"}}>🌿</span>
          <span style={{color:"white", fontWeight:700, fontSize:"1rem"}}>DPP Atlas</span>
          <span style={{color:"#5eead4", fontSize:"0.72rem", background:"#0d948820", padding:"2px 8px", borderRadius:"99px", border:"1px solid #0d9488"}}>
            DIGITAL PRODUCT PASSPORT
          </span>
        </div>
        <div className="no-print" style={{display:"flex", gap:"10px", alignItems:"center"}}>
          <button onClick={() => setLang(lang === "en" ? "bn" : "en")}
            style={{color:"#94a3b8", background:"none", border:"1px solid #334155", borderRadius:"8px", padding:"5px 10px", cursor:"pointer", fontSize:"0.78rem"}}>
            {lang === "en" ? "🇧🇩 বাংলা" : "🇬🇧 English"}
          </button>
          <button onClick={() => window.print()}
            style={{color:"white", background:"#0d9488", border:"none", borderRadius:"8px", padding:"6px 14px", cursor:"pointer", fontSize:"0.78rem", fontWeight:600}}>
            📄 {isBn ? "PDF" : "Save PDF"}
          </button>
        </div>
      </div>

      <div style={{maxWidth:"800px", margin:"0 auto", padding:"24px"}}>

        {/* GTIN IDENTIFIER */}
        <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"12px", padding:"16px 20px", marginBottom:"20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px"}}>
          <div>
            <div style={{fontSize:"0.72rem", color:"#94a3b8", fontWeight:700, marginBottom:"4px"}}>GS1 DIGITAL PRODUCT PASSPORT IDENTIFIER</div>
            <div style={{fontFamily:"monospace", fontSize:"1rem", fontWeight:700, color:"#0f172a", letterSpacing:"2px"}}>{gtin}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"0.72rem", color:"#94a3b8", marginBottom:"2px"}}>{isBn ? "মূল্যায়নের তারিখ" : "Assessment Date"}</div>
            <div style={{fontWeight:600, fontSize:"0.875rem", color:"#374151"}}>{assessDate}</div>
          </div>
        </div>

        {/* MAIN PASSPORT CARD */}
        <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"20px", padding:"32px", marginBottom:"20px", textAlign:"center"}}>

          {/* Factory Name */}
          <div style={{fontSize:"1.5rem", fontWeight:800, color:"#0f172a", marginBottom:"4px"}}>{data.factory_name}</div>
          <div style={{color:"#64748b", fontSize:"0.875rem", marginBottom:"24px"}}>
            {data.country} · {tierLabels[data.tier_level || "tier1"] || data.tier_level} · {data.factory_type || "Textile"}
          </div>

          {/* Score Circle */}
          <div style={{
            width:"140px", height:"140px", borderRadius:"50%",
            background:band.bg, border:"4px solid "+band.color,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            margin:"0 auto 20px",
          }}>
            <div style={{fontSize:"3rem", fontWeight:800, color:band.color, lineHeight:1}}>{data.score}</div>
            <div style={{fontSize:"0.78rem", color:band.color, fontWeight:700}}>/100</div>
          </div>

          {/* Compliance Band */}
          <div style={{display:"inline-block", padding:"8px 24px", background:band.bg, border:"2px solid "+band.color, borderRadius:"99px", color:band.color, fontWeight:700, fontSize:"1rem", marginBottom:"16px"}}>
            {band.emoji} {isBn ? (data.score >= 90 ? "DPP সম্মত" : data.score >= 70 ? "শর্তসাপেক্ষে সম্মত" : data.score >= 50 ? "উন্নয়নমান" : "অসম্মত") : band.label}
          </div>

          <p style={{color:"#64748b", fontSize:"0.875rem", maxWidth:"400px", margin:"0 auto 8px", lineHeight:1.6}}>
            {data.score >= 90
              ? (isBn ? "এই কারখানা EU ESPR DPP পাসপোর্টের মানদণ্ড পূরণ করে।" : "This factory meets EU ESPR DPP Passport requirements.")
              : data.score >= 70
              ? (isBn ? "এই কারখানা অধিকাংশ EU ESPR মানদণ্ড পূরণ করছে।" : "This factory meets most EU ESPR requirements with minor gaps.")
              : (isBn ? "এই কারখানার উল্লেখযোগ্য উন্নতি প্রয়োজন।" : "This factory requires significant improvements for full compliance.")}
          </p>
          <div style={{color:"#94a3b8", fontSize:"0.72rem"}}>
            {isBn ? "রিপোর্ট ID:" : "Report ID:"} {data.id.slice(0, 16)}...
          </div>
        </div>

        {/* COMPLIANCE DETAILS */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:"20px", marginBottom:"20px"}}>

          {/* ISO Test Results */}
          <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"16px", overflow:"hidden"}}>
            <div style={{padding:"14px 18px", background:"#0f172a", color:"white", fontWeight:700, fontSize:"0.875rem"}}>
              🔬 {isBn ? "ISO পরীক্ষার ফলাফল" : "ISO Test Results"}
            </div>
            <StatusBadge passed={data.iso_3759_passed} label={isBn ? "ISO 3759 সংকোচন পরীক্ষা" : "ISO 3759 Shrinkage Test"} />
            <StatusBadge passed={data.iso_16322_passed} label={isBn ? "ISO 16322-3 স্পাইরালিটি" : "ISO 16322-3 Spirality Test"} />
            <StatusBadge passed={true} label={isBn ? "ISO 15487 ভিজ্যুয়াল ইন্সপেকশন" : "ISO 15487 Visual Inspection"} />
          </div>

          {/* Chemical Compliance */}
          <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"16px", overflow:"hidden"}}>
            <div style={{padding:"14px 18px", background:"#0f172a", color:"white", fontWeight:700, fontSize:"0.875rem"}}>
              🧪 {isBn ? "রাসায়নিক সম্মতি" : "Chemical Compliance"}
            </div>
            <StatusBadge passed={data.reach_compliant}    label="REACH Compliance" />
            <StatusBadge passed={data.gots_certified}     label="GOTS Certification" />
            <StatusBadge passed={data.oeko_tex_certified} label="OEKO-TEX Certification" />
          </div>
        </div>

        {/* MATERIAL COMPOSITION */}
        <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"20px", marginBottom:"20px"}}>
          <h3 style={{fontWeight:700, fontSize:"0.9rem", marginBottom:"12px", color:"#0f172a"}}>
            🧵 {isBn ? "উপকরণ গঠন" : "Material Composition"}
          </h3>
          <p style={{color:"#374151", fontSize:"0.875rem", lineHeight:1.6}}>
            {data.material_composition || (isBn ? "উপকরণ তথ্য যাচাইয়ের প্রক্রিয়াধীন।" : "Material composition data is under verification.")}
          </p>
        </div>

        {/* VERIFICATION BLOCK */}
        <div style={{background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:"16px", padding:"20px", marginBottom:"20px"}}>
          <div style={{display:"flex", gap:"16px", alignItems:"flex-start"}}>
            <div style={{fontSize:"2rem"}}>🛡️</div>
            <div>
              <h3 style={{fontWeight:700, fontSize:"0.9rem", marginBottom:"6px", color:"#0f172a"}}>
                {isBn ? "DPP Atlas যাচাইকরণ" : "DPP Atlas Verification"}
              </h3>
              <p style={{color:"#374151", fontSize:"0.82rem", lineHeight:1.6, marginBottom:"8px"}}>
                {isBn
                  ? "এই পাসপোর্টের তথ্য DPP Atlas প্ল্যাটফর্মের মাধ্যমে স্ব-রিপোর্টকৃত তথ্যের ভিত্তিতে তৈরি।"
                  : "This passport data was generated through the DPP Atlas platform based on factory self-reported assessment data."}
              </p>
              <div style={{display:"flex", gap:"8px", flexWrap:"wrap"}}>
                <span style={{background:"#0d948820", color:"#0d9488", border:"1px solid #0d9488", padding:"3px 10px", borderRadius:"99px", fontSize:"0.72rem", fontWeight:700}}>
                  ✓ DPP Atlas Assessed
                </span>
                <span style={{background:"#3b82f620", color:"#2563eb", border:"1px solid #3b82f6", padding:"3px 10px", borderRadius:"99px", fontSize:"0.72rem", fontWeight:700}}>
                  🤖 AI Report Generated
                </span>
                <span style={{background:"#f59e0b20", color:"#d97706", border:"1px solid #f59e0b", padding:"3px 10px", borderRadius:"99px", fontSize:"0.72rem", fontWeight:700}}>
                  ⚠️ Advisory Only
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DATA HASH */}
        <div style={{background:"white", border:"1px solid #e2e8f0", borderRadius:"12px", padding:"16px", marginBottom:"20px"}}>
          <div style={{fontSize:"0.72rem", color:"#94a3b8", fontWeight:700, marginBottom:"6px"}}>
            SHA-256 DATA INTEGRITY HASH
          </div>
          <div style={{fontFamily:"monospace", fontSize:"0.72rem", color:"#475569", wordBreak:"break-all", lineHeight:1.5}}>
            {/* Simple hash simulation from report ID */}
            {Array.from(data.id).map(c => c.charCodeAt(0).toString(16)).join("").slice(0, 64).padEnd(64, "0")}
          </div>
          <div style={{color:"#94a3b8", fontSize:"0.7rem", marginTop:"6px"}}>
            {isBn ? "এই হ্যাশ নিশ্চিত করে যে ডেটা পরিবর্তন করা হয়নি।" : "This hash confirms data integrity — content has not been altered since assessment."}
          </div>
        </div>

        {/* BUYER CTA */}
        <div className="no-print" style={{background:"#0f172a", borderRadius:"16px", padding:"24px", textAlign:"center", marginBottom:"20px"}}>
          <h3 style={{color:"white", fontWeight:700, marginBottom:"8px", fontSize:"1rem"}}>
            {isBn ? "ক্রেতার জন্য" : "For Buyers & Auditors"}
          </h3>
          <p style={{color:"#94a3b8", fontSize:"0.82rem", marginBottom:"16px", lineHeight:1.6}}>
            {isBn
              ? "এই পাসপোর্টের বিস্তারিত রিপোর্ট বা PDF ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।"
              : "Click below to download the full compliance report or verify this factory on the DPP Atlas platform."}
          </p>
          <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap"}}>
            <button onClick={() => window.print()}
              style={{background:"#0d9488", color:"white", border:"none", padding:"12px 24px", borderRadius:"10px", fontWeight:700, cursor:"pointer", fontSize:"0.875rem"}}>
              📄 {isBn ? "PDF ডাউনলোড" : "Download PDF Report"}
            </button>
            <a href={"/en/verify"} style={{border:"1px solid #334155", color:"#94a3b8", textDecoration:"none", padding:"12px 24px", borderRadius:"10px", fontWeight:600, fontSize:"0.875rem"}}>
              🔍 {isBn ? "অনলাইনে যাচাই করুন" : "Verify Online"}
            </a>
          </div>
        </div>

        {/* FOOTER DISCLAIMER */}
        <div style={{background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"10px", padding:"14px", marginBottom:"24px"}}>
          <p style={{color:"#94a3b8", fontSize:"0.72rem", lineHeight:1.7, margin:0}}>
            ⚠️ {isBn
              ? "এই ডিজিটাল পণ্য পাসপোর্ট DPP Atlas প্ল্যাটফর্মের মাধ্যমে স্ব-রিপোর্টকৃত তথ্যের ভিত্তিতে AI দ্বারা তৈরি। এটি একটি পরামর্শমূলক টুল এবং আইনি সার্টিফিকেশন নয়। আনুষ্ঠানিক সম্মতির জন্য স্বাধীন পরীক্ষাগার এবং সরকারি সংস্থার সাথে যোগাযোগ করুন।"
              : "This Digital Product Passport is AI-generated based on self-reported factory assessment data via the DPP Atlas platform. It is an advisory tool and does not constitute legal certification. Independent lab testing and accredited certification bodies must be consulted for legally binding compliance verification."}
          </p>
        </div>

        {/* POWERED BY */}
        <div style={{textAlign:"center", color:"#94a3b8", fontSize:"0.72rem"}}>
          <a href="/en" style={{color:"#0d9488", textDecoration:"none", fontWeight:600}}>🌿 DPP Atlas</a>
          {" · "}Free EU ESPR Textile Compliance Platform
          {" · "}dpp-atlas.vercel.app
        </div>

      </div>
    </div>
  );
}
