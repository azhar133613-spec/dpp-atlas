const fs = require('fs');
const p = process.argv[2] || 'app/[locale]/login/page.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const before = c.length;

const oldSignup = `        const data = await res.json() as { error?: { message?: string }; id?: string };
        if (!res.ok) throw new Error(data.error?.message || "Signup failed");`;

const newSignup = `        const data = await res.json() as Record<string, unknown>;
        if (!res.ok) throw new Error(
          (data.msg as string) || (data.error_description as string) || (data.error as string) ||
          (data.message as string) || ("Signup failed (" + res.status + "): " + JSON.stringify(data))
        );`;

if (!c.includes(oldSignup)) throw new Error('Signup error-handling block not found — aborting.');
c = c.replace(oldSignup, newSignup);

const oldLogin = `        const data = await res.json() as { error?: { message?: string }; access_token?: string; user?: { id: string } };
        if (!res.ok) throw new Error(data.error?.message || "Login failed");`;

const newLogin = `        const data = await res.json() as Record<string, unknown>;
        if (!res.ok) throw new Error(
          (data.msg as string) || (data.error_description as string) || (data.error as string) ||
          (data.message as string) || ("Login failed (" + res.status + "): " + JSON.stringify(data))
        );`;

if (!c.includes(oldLogin)) throw new Error('Login error-handling block not found — aborting.');
c = c.replace(oldLogin, newLogin);

c = c.replace(
  `localStorage.setItem("dpp_auth_token", data.access_token || "");`,
  `localStorage.setItem("dpp_auth_token", (data.access_token as string) || "");`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched ' + p + ': ' + before + ' -> ' + c.length + ' bytes');
console.log('Login/signup will now show the REAL Supabase error message.');
console.log('DONE.');