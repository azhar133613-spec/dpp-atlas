// Run from the dpp-atlas folder:  node clean_site.js
// Replaces misleading wording with honest wording. Backs up every changed file as .bak
const fs=require('fs'),path=require('path');
const R=[
['CONDITIONALLY COMPLIANT','SELF-REPORTED: MINOR GAPS'],
['DPP COMPLIANT','SELF-REPORTED: STRONG'],
['NON-COMPLIANT','SELF-REPORTED: MAJOR GAPS'],
['EU ESPR 2027 Compliance Platform — Free','EU ESPR Digital Product Passport Readiness — Free'],
['"EU ESPR 2027",','"EU ESPR",'],
['Get Compliant in 4 Steps','Get Your Readiness List in 4 Steps'],
['মাত্র ৪টি ধাপে কমপ্লায়েন্ট হন','মাত্র ৪টি ধাপে আপনার প্রস্তুতির তালিকা পান'],
['Earn Verified Badge','Share Your Self-Assessment'],
['ব্যাজ অর্জন করুন','রিপোর্ট শেয়ার করুন'],
['🏆 Get Verified Now','Start Free Self-Check'],
['🏆 ভেরিফিকেশন পান','বিনামূল্যে স্ব-মূল্যায়ন শুরু করুন'],
['DPP VERIFIED','SELF-ASSESSED'],
['Verified by DPP Atlas Platform','Self-reported via DPP Atlas'],
['Verified by DPP Atlas','Self-reported via DPP Atlas'],
['n:"2027",','n:"Draft",'],
['l:"EU DPP Deadline"','l:"EU textile DPP rules"'],
['d:"All textile exports need a DPP"','d:"Still in draft — confirm status with your buyer"'],
['n:"$42B",','n:"—",'],
['l:"BD Export Value at Risk"','l:"Statistic removed"'],
['d:"Without DPP for EU buyers"','d:"Source not verified"'],
['Get ready before 2027.','Start preparing early.'],
['২০২৭ সালের আগে প্রস্তুত হন।','আগে থেকেই প্রস্তুতি শুরু করুন।'],
['ISO 3759 updated with new shrinkage requirements for 2027','Draft EU textile DPP rules are being prepared (JRC preparatory study)'],
['GOTS certification now required for organic cotton DPP','GOTS is voluntary; ask your buyer what they require'],
['Verified textile compliance data for buyers and auditors.','Self-reported textile readiness data. Not a certificate.'],
['Verified EU ESPR compliance data. Scan QR to verify factory compliance status.','Self-reported EU ESPR readiness data. Not a certificate.'],
['Fiber blend verified (100%)','Fiber blend reported as 100%'],
['No verified passport found','No record found'],
['No verified record found for this ID.','No record found for this ID.'],
['কোনো যাচাইকৃত রেকর্ড পাওয়া যায়নি।','কোনো রেকর্ড পাওয়া যায়নি।'],
['SHA-256 DATA INTEGRITY HASH','RECORD REFERENCE (not a security proof)'],
];
let total=0;
function walk(d){for(const f of fs.readdirSync(d)){
 if(['node_modules','.next','.git'].includes(f))continue;
 const p=path.join(d,f),s=fs.statSync(p);
 if(s.isDirectory())walk(p);
 else if(/\.(tsx?)$/.test(f)){
  let t=fs.readFileSync(p,'utf8'),o=t;
  for(const [a,b] of R){ if(t.includes(a)){const n=t.split(a).length-1;t=t.split(a).join(b);total+=n;console.log(n+'x  '+a.slice(0,50)+'  in '+p);} }
  if(t!==o){fs.writeFileSync(p+'.bak',o);fs.writeFileSync(p,t);}
 }}}
walk('.');
console.log('Done. Total replacements: '+total);
