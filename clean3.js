// Run:  node clean3.js   (from the dpp-atlas folder)
const fs=require('fs');
function fix(p,R){
 let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak3',t);
 for(const [a,b] of R){const n=t.split(a).length-1;console.log(n+'x  '+a.slice(0,55));t=t.split(a).join(b);}
 fs.writeFileSync(p,t);
}
fix('app/api/v1/generate-report/route.ts',[
['Your factory has completed the DPP compliance assessment. Based on your self-reported data, we have identified key areas requiring attention to meet EU ESPR 2027 requirements. Please review the critical actions below.','This is a general fallback report shown when the AI service is unavailable. It is NOT based on your specific answers. Please check each item below against your own records and with your buyer.'],
['Your score indicates areas where immediate action is needed to achieve EU Digital Product Passport compliance before the 2027 mandate deadline.','The EU textile Digital Product Passport rules are still being drafted. Your score is a self-reported indication only and does not show legal compliance.'],
['Factory has engaged in the DPP compliance process','Factory has started a DPP self-assessment'],
['issue:"GS1 GLN number not registered"','issue:"GLN status to be confirmed"'],
['Register at gs1.org/services/gln for a free Global Location Number. Mandatory for EU DPP traceability.','Ask GS1 Bangladesh how to obtain a Global Location Number (GLN). GS1 identifiers appear in the draft DPP data model; confirm with your buyer whether they are required.'],
['EU ESPR Regulation Article 9','EU ESPR (draft textile rules; confirm reference)'],
['issue:"REACH audit documentation missing"','issue:"Chemical compliance documents to be confirmed"'],
['Commission a REACH audit from SGS, Bureau Veritas, or Intertek in Bangladesh.','Ask your buyer or an accredited laboratory which chemical compliance documents (for example REACH-related declarations) they need.'],
['issue:"ISO test certifications missing"','issue:"ISO test reports to be confirmed"'],
['Submit fabric samples to a BGMEA-approved lab for ISO 3759 shrinkage and ISO 16322-3 spirality tests.','Locate existing ISO 3759 shrinkage and ISO 16322-3 spirality test reports, or ask an accredited laboratory about testing.'],
['issue:"Recycling instructions missing on labels"','issue:"Recycling instructions to be confirmed"'],
['EU ESPR Annex I','EU ESPR (confirm reference)'],
['This factory has initiated EU ESPR DPP compliance assessment and is actively implementing improvements to meet the 2027 mandate.','This factory has completed a self-reported DPP readiness check. This is not a certificate or verified compliance.'],
]);
fix('app/layout.tsx',[
['Get instant compliance scores, AI roadmaps, and verified badges.','Get a self-reported readiness check and an AI improvement roadmap.'],
]);
console.log('done');
