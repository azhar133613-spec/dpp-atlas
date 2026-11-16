// Run:  node clean9.js   (from the dpp-atlas folder)
const fs=require('fs');
const p='app/[locale]/page.tsx';
let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak10',t);
function rep(a,b){const n=t.split(a).length-1;console.log(n+'x  '+a.slice(0,50));t=t.split(a).join(b);}
rep('>ALIGNED WITH:</span>','>RULES AND STANDARDS REFERENCED:</span>');
rep('>EU ESPR Compliance Assessed</div>','>EU ESPR self-assessment only. Not a certificate.</div>');
rep('Secure Your Factory\'s EU Future Today','Start Your Readiness Check Today');
rep('আজই আপনার কারখানার EU ভবিষ্যৎ নিশ্চিত করুন','আজই আপনার প্রস্তুতির তালিকা তৈরি শুরু করুন');
rep('>Verify</a>','>Report Lookup</a>\n<a href={"/"+loc+"/rules"} style={{color:"#64748b", textDecoration:"none", fontSize:"0.875rem"}}>Rules</a>');
fs.writeFileSync(p,t);
console.log('done');
