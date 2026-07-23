const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

console.log("=== 1. CONFIG CHECK ===");
const jsExists = fs.existsSync(path.join(projectRoot, 'next.config.js'));
const tsExists = fs.existsSync(path.join(projectRoot, 'next.config.ts'));
console.log(`next.config.js : ${jsExists ? 'EXISTS' : 'MISSING'}`);
console.log(`next.config.ts : ${tsExists ? 'EXISTS' : 'MISSING'}`);

console.log("\n=== 2. REPORT PAGE FEATURE CHECK ===");
const reportPath = path.join(projectRoot, 'app', '[locale]', 'report', '[id]', 'page.tsx');
if (fs.existsSync(reportPath)) {
  const content = fs.readFileSync(reportPath, 'utf8');
  console.log(`File size: ${content.length} characters`);
  console.log(`Has Supabase import/save: ${content.includes('supabase') || content.includes('createClient')}`);
  console.log(`Has QR code image/API: ${content.includes('qrserver.com') || content.includes('QRCode') || content.includes('qr')}`);
  console.log(`Has Print/PDF button: ${content.includes('window.print') || content.includes('PDF') || content.includes('pdf')}`);
} else {
  console.log("report/[id]/page.tsx NOT FOUND");
}

console.log("\n=== 3. ASSESS PAGE CHECK ===");
const assessPath = path.join(projectRoot, 'app', '[locale]', 'assess', 'page.tsx');
if (fs.existsSync(assessPath)) {
  const content = fs.readFileSync(assessPath, 'utf8');
  console.log(`File size: ${content.length} characters`);
  console.log(`Has custom/factory questions: ${content.includes('facility') || content.includes('textile') || content.includes('factory') || content.includes('traceability')}`);
} else {
  console.log("assess/page.tsx NOT FOUND");
}
