// Run:  node clean4.js   (from the dpp-atlas folder)
const fs=require('fs');
const p='app/dpp/[gtin]/DppPassportClient.tsx';
let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak4',t);
// 1) fake hash value -> plain record ID
const r1=/\{Array\.from\(data\.id\)\.map\(c => c\.charCodeAt\(0\)\.toString\(16\)\)\.join\(""\)\.slice\(0, 64\)\.padEnd\(64, "0"\)\}/;
console.log((r1.test(t)?1:0)+'x  fake hash value');
t=t.replace(r1,'{data.id}');
// 2) false integrity claim (Bangla + English)
const r2=/\{isBn \? "[^"]*" : "This hash confirms data integrity[^"]*"\}/;
console.log((r2.test(t)?1:0)+'x  integrity claim');
t=t.replace(r2,'{isBn ? "এটি শুধু রেকর্ড আইডি। এটি ডেটা অপরিবর্তিত থাকার প্রমাণ নয়।" : "This is the record ID only. It is not proof that the data is unaltered."}');
fs.writeFileSync(p,t);
console.log('done');
