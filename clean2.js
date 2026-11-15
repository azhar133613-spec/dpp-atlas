const fs=require('fs');
const p='app/[locale]/page.tsx';
let t=fs.readFileSync(p,'utf8');
fs.writeFileSync(p+'.bak2',t);
function rep(a,b){const n=t.split(a).length-1;console.log(n+'x  '+a.slice(0,50));t=t.split(a).join(b);}
rep('COMPLIANT</span>','EXAMPLE ONLY</span>');
rep('/100 compliance score','/100 example only — not real data');
const re=/\{n:count\.toLocaleString\(\)\+"\+",[^}]*\}/;
console.log((re.test(t)?1:0)+'x  counter tile');
t=t.replace(re,'{n:"Pilot", l:isBn?"পরীক্ষামূলক সংস্করণ":"Pilot version"}');
fs.writeFileSync(p,t);
console.log('done');