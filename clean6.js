// Run:  node clean6.js   (from the dpp-atlas folder)
const fs=require('fs'),path=require('path');
// 1) fix the Bangla twin on the landing page
const p='app/[locale]/page.tsx';
let t=fs.readFileSync(p,'utf8'); fs.writeFileSync(p+'.bak6',t);
const a='বিনামূল্যে AI-চালিত EU ESPR DPP মূল্যায়ন। আপনার কারখানার ধরন অনুযায়ী কাস্টম প্রশ্ন। তাৎক্ষণিক ভেরিফিকেশন ব্যাজ।';
const b='বিনামূল্যে AI-চালিত EU ESPR DPP স্ব-মূল্যায়ন। নিজের দেওয়া তথ্যের ভিত্তিতে প্রস্তুতি পর্যালোচনা। এটি কোনো সনদ নয়।';
console.log((t.split(a).length-1)+'x  Bangla hero text');
t=t.split(a).join(b); fs.writeFileSync(p,t);
// 2) scan ALL Bangla strings for the same kinds of claims -> scan_bn.txt (UTF-8)
const terms=/ভেরিফ|ব্যাজ|কমপ্লায়েন্ট|সম্মত|২০২৭|কাস্টম|প্রমাণ|সনদ|পাসপোর্ট|সার্টিফ/;
const out=[];
(function walk(d){for(const f of fs.readdirSync(d)){
 const q=path.join(d,f),s=fs.statSync(q);
 if(s.isDirectory())walk(q);
 else if(/\.tsx?$/.test(f)) fs.readFileSync(q,'utf8').split('\n').forEach((l,i)=>{if(terms.test(l))out.push(q+':'+(i+1)+'  '+l.trim().slice(0,170));});
}})('app');
fs.writeFileSync('scan_bn.txt',out.join('\n'),'utf8');
console.log('scan_bn.txt written: '+out.length+' lines');
