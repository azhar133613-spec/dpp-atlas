const fs = require('fs');
const path = require('path');

function check(label, fn) {
  try {
    const r = fn();
    console.log((r ? '✅' : '❌') + '  ' + label + (typeof r === 'string' ? ' — ' + r : ''));
  } catch (e) {
    console.log('❌  ' + label + ' — ERROR: ' + e.message);
  }
}

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

console.log('=== AUTH (Task 9) ===');
check('login page exists', () => fs.existsSync('app/[locale]/login/page.tsx') || fs.existsSync('app/[locale]/login/page.jsx'));
check('login page references Supabase auth', () => {
  const c = readIfExists('app/[locale]/login/page.tsx');
  return c && /supabase\.auth\.(signIn|signUp|signInWithOAuth)/.test(c);
});
check('dashboard page exists', () => fs.existsSync('app/[locale]/dashboard/page.tsx'));
check('dashboard references recharts', () => {
  const c = readIfExists('app/[locale]/dashboard/page.tsx');
  return c && c.includes('recharts');
});

console.log('');
console.log('=== MULTILINGUAL (Task 5) ===');
check('i18next config exists', () => fs.existsSync('next-i18next.config.js') || fs.existsSync('i18n.config.js'));
check('locale JSON files exist', () => fs.existsSync('public/locales/en/common.json') && fs.existsSync('public/locales/bn/common.json'));
check('any Google Translate API reference in codebase', () => {
  try {
    const { execSync } = require('child_process');
    const out = execSync('grep -rl "translate.googleapis\\|GOOGLE_TRANSLATE" app lib 2>/dev/null || true').toString();
    return out.trim().length > 0 ? out.trim().split('\n').join(', ') : false;
  } catch { return false; }
});

console.log('');
console.log('=== SEO (Task 12) ===');
check('sitemap.xml or sitemap.ts exists', () => fs.existsSync('app/sitemap.ts') || fs.existsSync('app/sitemap.xml') || fs.existsSync('public/sitemap.xml'));
check('robots.txt or robots.ts exists', () => fs.existsSync('app/robots.ts') || fs.existsSync('public/robots.txt'));
check('DPP page has JSON-LD structured data', () => {
  const c = readIfExists('app/dpp/[gtin]/page.tsx') || readIfExists('app/[locale]/dpp/[gtin]/page.tsx');
  return c && (c.includes('application/ld+json') || c.includes('schema.org'));
});

console.log('');
console.log('=== AUTOMATION (Task 11) ===');
check('email notification code exists (Resend)', () => {
  try {
    const { execSync } = require('child_process');
    const out = execSync('grep -rl "resend\\|RESEND_API_KEY" app lib 2>/dev/null || true').toString();
    return out.trim().length > 0 ? out.trim().split('\n').join(', ') : false;
  } catch { return false; }
});

console.log('');
console.log('=== SUPABASE CLIENT ===');
check('lib/supabase.ts exists', () => fs.existsSync('lib/supabase.ts') || fs.existsSync('lib/supabase.js'));
check('save-assessment API route exists', () => fs.existsSync('app/api/v1/save-assessment/route.ts'));

console.log('');
console.log('=== ENV VARS PRESENT (names only, not values) ===');
const envContent = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : null;
if (envContent) {
  const keys = envContent.split('\n').filter(l => l.includes('=')).map(l => l.split('=')[0].trim()).filter(Boolean);
  console.log('Found keys:', keys.join(', '));
} else {
  console.log('❌  .env.local not found (or not readable from this location)');
}