// Run:  node clean7.js   (from the dpp-atlas folder)
const fs=require('fs');
function fix(p,R){
 let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak7',t);
 for(const [a,b] of R){const n=t.split(a).length-1;console.log(n+'x  '+p.split(/[\\/]/).slice(-2).join('/')+'  '+a.slice(0,40));t=t.split(a).join(b);}
 fs.writeFileSync(p,t);
}
fix('app/dpp/[gtin]/DppPassportClient.tsx',[
['যাচাইকৃত পাসপোর্ট','রেকর্ড'],
['"DPP সম্মত"','"স্ব-রিপোর্টকৃত: শক্তিশালী"'],
['"শর্তসাপেক্ষে সম্মত"','"স্ব-রিপোর্টকৃত: ছোট ফাঁক"'],
['"অসম্মত"','"স্ব-রিপোর্টকৃত: বড় ফাঁক"'],
['এই কারখানা EU ESPR DPP পাসপোর্টের মানদণ্ড পূরণ করে।','এই ফলাফল কারখানার নিজের দেওয়া তথ্যের ভিত্তিতে; এটি সনদ নয়।'],
['This factory meets EU ESPR DPP Passport requirements.','Based on self-reported answers. This is not a certificate.'],
]);
fix('app/[locale]/page.tsx',[
['ক্রেতাদের প্রমাণ দিন','ক্রেতাদের সাথে শেয়ার করুন'],
['Prove EU DPP readiness to buyers','Share your self-assessment with buyers'],
['ভেরিফিকেশন ব্যাজ যা ক্রেতারা বিশ্বাস করেন','ক্রেতাদের সাথে শেয়ার করার মতো রিপোর্ট'],
['A Verification Badge Buyers Trust','A Report You Can Share With Buyers'],
['৭০+ স্কোর পেলে অফিসিয়াল ভেরিফিকেশন ব্যাজ পাবেন।','আপনার স্ব-মূল্যায়ন রিপোর্ট ক্রেতাদের সাথে শেয়ার করতে পারবেন। এটি সনদ নয়।'],
['"🔍 ভেরিফিকেশন চেক"','"🔍 রিপোর্ট খুঁজুন"'],
['"🔍 Verify a Factory"','"🔍 Look up a Report"'],
]);
fix('app/[locale]/report/[id]/page.tsx',[
['অভিনন্দন! EU ESPR DPP পাসপোর্টের জন্য প্রস্তুত।','আপনার স্ব-মূল্যায়নে উচ্চ প্রস্তুতি দেখা গেছে। এটি সনদ নয়।'],
['Congratulations! Your factory meets EU ESPR requirements.','Your self-assessment shows strong readiness. This is not a certificate.'],
['ভেরিফিকেশন ব্যাজ অর্জিত','স্ব-মূল্যায়ন সম্পন্ন'],
['Verification Badge Earned','Self-Assessment Complete'],
['ভেরিফিকেশন পেজ →','রিপোর্ট পেজ →'],
['Open Verification Page →','Open Report Page →'],
['isBn?"ভেরিফাই":"Verify"','isBn?"রিপোর্ট দেখুন":"View Report"'],
]);
fix('app/[locale]/verify/page.tsx',[
['ফ্যাক্টরি ভেরিফিকেশন চেক','রিপোর্ট খুঁজুন'],
['Factory Verification Check','Report Lookup'],
]);
// dump the lines I could not see in full (twins on following lines)
function ctx(p,a,b){const L=fs.readFileSync(p,'utf8').split('\n');return '== '+p+' lines '+a+'-'+b+'\n'+L.slice(a-1,b).map((l,i)=>(a+i)+': '+l.trim().slice(0,220)).join('\n')+'\n';}
fs.writeFileSync('context.txt',
 ctx('app/dpp/[gtin]/DppPassportClient.tsx',228,238)+
 ctx('app/[locale]/page.tsx',200,212)+
 ctx('app/[locale]/report/[id]/page.tsx',164,170)+
 ctx('app/[locale]/report/[id]/page.tsx',296,303),'utf8');
console.log('done; context.txt written');
