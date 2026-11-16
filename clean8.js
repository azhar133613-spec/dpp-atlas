// Run:  node clean8.js   (from the dpp-atlas folder)
const fs=require('fs');
function fix(p,R){
 let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak8',t);
 for(const [a,b] of R){const n=t.split(a).length-1;console.log(n+'x  '+p.split(/[\\/]/).slice(-2).join('/')+'  '+a.slice(0,40));t=t.split(a).join(b);}
 fs.writeFileSync(p,t);
}
fix('app/dpp/[gtin]/DppPassportClient.tsx',[
['এই কারখানা অধিকাংশ EU ESPR মানদণ্ড পূরণ করছে।','স্ব-রিপোর্টকৃত তথ্যে কিছু ফাঁক আছে। এটি সনদ নয়।'],
['This factory meets most EU ESPR requirements with minor gaps.','Self-reported answers show minor gaps. This is not a certificate.'],
['এই কারখানার উল্লেখযোগ্য উন্নতি প্রয়োজন।','স্ব-রিপোর্টকৃত তথ্যে উল্লেখযোগ্য ফাঁক আছে। এটি সনদ নয়।'],
['This factory requires significant improvements for full compliance.','Self-reported answers show significant gaps. This is not a certificate.'],
]);
fix('app/[locale]/page.tsx',[
['>OFFICIAL VERIFICATION</p>','>SHARE WITH BUYERS</p>'],
['Score 70+ and earn an official DPP Atlas Verification Badge. Buyers scan QR to verify instantly.','Share your self-assessment report with buyers. This is not a certificate.'],
['✅ QR-scannable — instant buyer verification','✅ QR-scannable link to your report'],
]);
fix('app/[locale]/report/[id]/page.tsx',[
['এই Report ID দিয়ে EU ক্রেতারা তাৎক্ষণিক যাচাই করতে পারবেন।','এই Report ID দিয়ে ক্রেতারা রিপোর্ট খুঁজে দেখতে পারবেন। তথ্য স্ব-রিপোর্টকৃত, যাচাইকৃত নয়।'],
['EU buyers can instantly verify using this Report ID.','Buyers can look up this report using this Report ID. The data is self-reported, not verified.'],
['marginBottom:"6px"}}>🏆</div>','marginBottom:"6px"}}>📋</div>'],
]);
console.log('done');
