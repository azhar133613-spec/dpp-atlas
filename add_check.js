// Run:  node add_check.js   (from the dpp-atlas folder)
const fs=require('fs'),path=require('path');
const dir='app/[locale]/check';
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'page.tsx'),fs.readFileSync('check_page.tsx','utf8'));
fs.writeFileSync(path.join(dir,'fields.ts'),fs.readFileSync('check_fields.ts','utf8'));
console.log('created '+dir+'/page.tsx and fields.ts');
const p='app/[locale]/page.tsx';
let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak12',t);
const a='>Rules</a>';
const n=t.split(a).length-1; console.log(n+'x  nav Rules link');
t=t.split(a).join('>Rules</a>\n<a href={"/"+loc+"/check"} style={{color:"#0d9488", textDecoration:"none", fontSize:"0.875rem", fontWeight:700}}>Data Check</a>');
fs.writeFileSync(p,t);
console.log('done');
