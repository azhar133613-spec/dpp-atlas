const fs = require('fs');

fs.mkdirSync('app/[locale]/verify', { recursive: true });

fs.writeFileSync('app/[locale]/verify/page.tsx',
`"use client";
import { useState } from "react";
export default function VerifyPage({ params }) {
  const loc = params.locale;
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const verify = () => {
    const data = localStorage.getItem("dpp_report_" + id);
    if (data) setResult(JSON.parse(data));
    else setNotFound(true);
  };
  const color = result ? (result.score>=90?"#22c55e":result.score>=70?"#eab308":result.score>=50?"#f97316":"#ef4444") : "#0d9488";
  return (
    <main style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"sans-serif",padding:"32px"}}>
      <a href={"/"+loc} style={{color:"#0d9488",fontWeight:700,textDecoration:"none",display:"block",marginBottom:"40px"}}>
        back to DPP Atlas
      </a>
      <div style={{maxWidth:"560px",margin:"0 auto"}}>
        <h1 style={{fontSize:"1.75rem",fontWeight:800,marginBottom:"24px",color:"#0f172a"}}>
          Factory Verification Check
        </h1>
        <div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>
          <input value={id} onChange={e=>setId(e.target.value)}
            placeholder="Enter Report ID"
            style={{flex:1,padding:"12px 16px",border:"1px solid #e2e8f0",borderRadius:"10px",fontSize:"0.95rem"}}
          />
          <button onClick={verify}
            style={{padding:"12px 20px",background:"#0d9488",color:"white",border:"none",borderRadius:"10px",fontWeight:700,cursor:"pointer"}}>
            Verify
          </button>
        </div>
        {notFound && <p style={{color:"#dc2626",fontWeight:600}}>No record found for this ID.</p>}
        {result && (
          <div style={{background:"white",border:"2px solid "+color,borderRadius:"14px",padding:"24px",textAlign:"center"}}>
            <div style={{fontSize:"3rem",fontWeight:800,color:color,marginBottom:"8px"}}>{result.score}/100</div>
            <div style={{fontWeight:700,color:color,marginBottom:"16px"}}>
              {result.score>=90?"DPP COMPLIANT":result.score>=70?"CONDITIONALLY COMPLIANT":result.score>=50?"DEVELOPING":"NON-COMPLIANT"}
            </div>
            <div style={{textAlign:"left",fontSize:"0.875rem",lineHeight:1.8}}>
              <div><strong>Factory:</strong> {result.factory?.factory_name}</div>
              <div><strong>Country:</strong> {result.factory?.country}</div>
              <div><strong>Date:</strong> {new Date(result.created_at).toLocaleDateString()}</div>
              <div><strong>Report ID:</strong> {result.id}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
`, 'utf8');

console.log('OK: verify/page.tsx written');
console.log('DONE');