// Run:  node clean5.js   (from the dpp-atlas folder)
const fs=require('fs');
const p='app/[locale]/page.tsx';
let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak5',t);
const R=[
['Custom questions per factory type. Instant verification badge for buyers.','Self-reported readiness check in Bangla and English. Not a certificate.'],
['Free assessment. AI report. Verification badge. No credit card.','Free self-assessment. AI report. No credit card.'],
['Free Textile EU ESPR Compliance Tool','Free Textile EU ESPR Self-Assessment Tool'],
];
for(const [a,b] of R){const n=t.split(a).length-1;console.log(n+'x  '+a.slice(0,55));t=t.split(a).join(b);}
fs.writeFileSync(p,t);
console.log('done');
