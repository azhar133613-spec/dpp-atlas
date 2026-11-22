const fs=require("fs");
if(!fs.existsSync("watch/sources.json")||!fs.existsSync("watch/check.mjs")){console.log("STOP: run inside dpp-atlas. Do NOT push.");process.exit(1)}
const src=JSON.parse(fs.readFileSync("watch/sources.json","utf8"));
let n=0;for(const s of src){if(s.url.includes("eur-lex.europa.eu")&&!s.manual){s.manual=true;n++}}
fs.writeFileSync("watch/sources.json",JSON.stringify(src,null,2)+"\n");console.log("Marked as check-by-hand:",n);
let c=fs.readFileSync("watch/check.mjs","utf8");
const a="  for (const s of sources) {\n";
if(!c.includes("s.manual")){
 if(c.split(a).length!==2){console.log("STOP: check.mjs not as expected. Do NOT push.");process.exit(1)}
 c=c.replace(a,a+"    if (s.manual) continue; // blocked for scripts: checked by hand, see MANUAL.md\n");
 fs.writeFileSync("watch/check.mjs",c);console.log("check.mjs updated");
}
let m="# Pages to check by hand\n\nThe watcher cannot read these (EUR-Lex returned no text to scripts on 22 Nov 2026). Open each one about once a month and look for a new version, an amendment or a corrigendum. Write the date you checked in the Updates page.\n\n";
for(const s of src.filter(x=>x.manual))m+="- "+s.name+": "+s.url+"\n  Why: "+s.why+"\n";
fs.writeFileSync("watch/MANUAL.md",m);console.log("Wrote watch/MANUAL.md. Now git add . / commit / push, one at a time.");
