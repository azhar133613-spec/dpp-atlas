const fs = require('fs');
const p = process.argv[2] || 'app/[locale]/report/[id]/page.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const before = c.length;

const oldBlock = `  const saveToDb = async (r: Report, ai: AiReport) => {
    if (savedRef.current || r.saved_to_db) return;
    savedRef.current = true;
    try {
      const res  = await fetch("/api/v1/save-assessment", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({factory:r.factory, score:r.score, band:r.band, answers:r.answers, failed_ids:r.failed_ids||[], ai_report:ai, report_id:r.id})
      });
      const data = await res.json() as {success:boolean};
      if (data.success) {
        const updated = {...r, ai_report:ai, saved_to_db:true};
        localStorage.setItem("dpp_report_"+r.id, JSON.stringify(updated));
        setDbSaved(true);
      }
    } catch { /* silent fallback */ }
  };`;

if (!c.includes(oldBlock)) {
  throw new Error('Could not find the exact saveToDb block — the file may have changed since it was reviewed. Aborting rather than guessing.');
}

const newBlock = `  const saveToDb = async (r: Report, ai: AiReport) => {
    if (savedRef.current || r.saved_to_db) return;
    savedRef.current = true;
    try {
      const token = localStorage.getItem("dpp_auth_token");
      const headers: Record<string,string> = {"Content-Type":"application/json"};
      if (token) headers["Authorization"] = "Bearer " + token;
      const res  = await fetch("/api/v1/save-assessment", {
        method:"POST", headers,
        body: JSON.stringify({factory:r.factory, score:r.score, band:r.band, answers:r.answers, failed_ids:r.failed_ids||[], ai_report:ai, report_id:r.id})
      });
      const data = await res.json() as {success:boolean; synced?:boolean};
      if (data.success) {
        const updated = {...r, ai_report:ai, saved_to_db:true};
        localStorage.setItem("dpp_report_"+r.id, JSON.stringify(updated));
        setDbSaved(true);
      }
    } catch { /* silent fallback */ }
  };`;

c = c.replace(oldBlock, newBlock);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched ' + p + ': ' + before + ' -> ' + c.length + ' bytes');
console.log('Added Authorization header attachment to saveToDb().');
console.log('DONE.');