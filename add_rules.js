// Run:  node add_rules.js   (from the dpp-atlas folder)
const fs=require('fs'),path=require('path');
// 1) create the page
const dir='app/[locale]/rules';
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'page.tsx'),fs.readFileSync('rules_page.tsx','utf8'));
console.log('created '+dir+'/page.tsx');
// 2) patch landing page
const p='app/[locale]/page.tsx';
let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak9',t);
function rep(a,b){const n=t.split(a).length-1;console.log(n+'x  '+a.slice(0,50));t=t.split(a).join(b);}
rep('"GS1 DPP","BGMEA"]','"GS1 DPP","BGMEA (trade body)"]');
rep('Free Textile EU ESPR Self-Assessment Tool','Free Textile EU ESPR Self-Assessment Tool · <a href={"/"+loc+"/rules"} style={{color:"#0d9488"}}>{isBn?"নিয়ম ও স্ট্যান্ডার্ড":"Rules and standards"}</a>');
fs.writeFileSync(p,t);
// 3) show every line that says "aligned" (so the label can be fixed with its Bangla twin)
const out=[];
t.split('\n').forEach((l,i)=>{if(/align/i.test(l)){out.push((i+1)+': '+l.trim().slice(0,200));
  for(let k=1;k<=3;k++)out.push((i+1+k)+': '+(t.split('\n')[i+k]||'').trim().slice(0,200));out.push('--');}});
fs.writeFileSync('context2.txt',out.join('\n'),'utf8');
console.log('context2.txt written ('+out.length+' lines)');
