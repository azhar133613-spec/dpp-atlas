// Run:  node demote_assess.js   (from the dpp-atlas folder)
const fs=require('fs');
function fix(p,R){
 let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak13',t);
 for(const [a,b] of R){const n=t.split(a).length-1;console.log(n+'x  '+p.split('/').slice(-2).join('/')+'  '+a.slice(0,45));t=t.split(a).join(b);}
 fs.writeFileSync(p,t);
}
const BANNER='<div style={{background:"#fef3c7",border:"1px solid #fbbf24",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",fontSize:"0.85rem",color:"#92400e",textAlign:"left"}}>{isBn ? "পুরনো স্কোরভিত্তিক চেক। ০–১০০ স্কোরের কোনো অফিসিয়াল ভিত্তি নেই এবং এটি কমপ্লায়েন্স ফলাফল নয়। বর্তমান পদ্ধতির জন্য ডেটা চেক ব্যবহার করুন।" : "Old scored self-check. The 0–100 score has no official basis and is not a compliance result. For the current method, use the Data Check."}{" "}<a href={"/"+loc+"/check"} style={{color:"#0d9488",fontWeight:700}}>{isBn ? "ডেটা চেক →" : "Data Check →"}</a></div>';
fix('app/[locale]/assess/page.tsx',[
 ['<div style={{fontSize:"3rem",marginBottom:"16px"}}>📋</div>','<div style={{fontSize:"3rem",marginBottom:"16px"}}>📋</div>\n        '+BANNER],
 ['{isBn?"DPP কমপ্লায়েন্স মূল্যায়ন":"DPP Compliance Assessment"}','{isBn?"স্কোরভিত্তিক স্ব-চেক (পুরনো)":"Scored Self-Check (old)"}'],
]);
fix('app/[locale]/page.tsx',[
 ['<a href={"/"+loc+"/assess"} style={{border:"2px solid #0d9488"','<a href={"/"+loc+"/check"} style={{border:"2px solid #0d9488"'],
 ['{isBn ? "📋 মূল্যায়ন দেখুন" : "📋 View Assessment"}','{isBn ? "📋 ডেটা চেক শুরু করুন" : "📋 Start Data Check"}'],
 ['<a href={"/"+loc+"/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"15px 32px"','<a href={"/"+loc+"/check"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"15px 32px"'],
 ['{isBn ? "🚀 বিনামূল্যে শুরু করুন" : "🚀 Start Free Assessment"}','{isBn ? "🚀 ডেটা চেক শুরু করুন" : "🚀 Start Data Check"}'],
 ['<a href={"/"+loc+"/enroll"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"14px 28px", borderRadius:"10px", fontWeight:700, display:"inline-block"}}>','<a href={"/"+loc+"/check"} style={{background:"#0d9488", color:"white", textDecoration:"none", padding:"14px 28px", borderRadius:"10px", fontWeight:700, display:"inline-block"}}>'],
 ['✅ Unique ID — fraud-resistant','✅ Unique report ID'],
 ['✅ অনন্য ID — জালিয়াতি প্রতিরোধী','✅ অনন্য রিপোর্ট ID'],
]);
fix('app/[locale]/enroll/page.tsx',[
 ['href={"/"+loc+"/assess?type="+selType}','href={"/"+loc+"/check"}'],
 ['{isBn?"মূল্যায়ন শুরু করুন":"Start Assessment"}','{isBn?"ডেটা চেক শুরু করুন":"Start Data Check"}'],
 ['Now complete your assessment — takes about 10 minutes.','Now start your data check.'],
 ['এখন মূল্যায়ন শুরু করুন — মাত্র ১০ মিনিট লাগবে।','এখন আপনার ডেটা চেক শুরু করুন।'],
]);
console.log('done');
