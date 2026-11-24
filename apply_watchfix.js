const fs=require("fs");const p=".github/workflows/watch-sources.yml";
if(!fs.existsSync(p)){console.log("STOP: run inside dpp-atlas. Do NOT push.");process.exit(1)}
let s=fs.readFileSync(p,"utf8").replace(/\r\n/g,"\n");
if(s.includes("deploymentEnabled")){console.log("Already applied.");process.exit(0)}
const a="          git add state.json\n";
if(s.split(a).length!==2){console.log("STOP: workflow is not the expected version. Do NOT push.");process.exit(1)}
s=s.replace(a,"          echo '{\"git\":{\"deploymentEnabled\":false}}' > vercel.json\n          git add state.json vercel.json\n");
fs.writeFileSync(p,s);console.log("Done. Now: git add . / git commit / git push, one at a time.");
