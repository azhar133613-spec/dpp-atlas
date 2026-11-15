// Run from C:\Users\USER\Downloads\dpp-atlas :  node scan_misleading.js
// Lists every place with misleading wording. Changes NOTHING.
const fs=require('fs'),path=require('path');
const pats=/6,?200|sha-?256|data_hash|verified|compliant|passport ready|\$42|2027|certif|COMPLIANT/i;
function walk(d){for(const f of fs.readdirSync(d)){
 if(['node_modules','.next','.git'].includes(f))continue;
 const p=path.join(d,f),s=fs.statSync(p);
 if(s.isDirectory())walk(p);
 else if(/\.(tsx?|json|md)$/.test(f))fs.readFileSync(p,'utf8').split('\n').forEach((l,i)=>{if(pats.test(l))console.log(p+':'+(i+1)+'  '+l.trim().slice(0,120))})}}
walk('.');
