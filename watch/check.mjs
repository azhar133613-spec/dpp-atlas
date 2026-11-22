// Source watcher. No dependencies. Node 20+.
// Fetches each page in sources.json, hashes its main text, compares with state.json.
// Writes watch/report.md when something changed or failed repeatedly. Never edits the site.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const DIR = new URL(".", import.meta.url).pathname;
const STATE_FILE = process.env.WATCH_STATE || DIR + "state.json";
const SOURCES_FILE = process.env.WATCH_SOURCES || DIR + "sources.json";
const REPORT_FILE = process.env.WATCH_REPORT || DIR + "report.md";
const FAIL_LIMIT = 3;
const UA = "DPP-Atlas-source-watcher/1.0 (student project; https://dpp-atlas.vercel.app)";

export function mainText(html) {
  let h = html;
  const m = h.match(/<main[\s\S]*?<\/main>/i);
  if (m) h = m[0];
  h = h.replace(/<(script|style|noscript|nav|header|footer|svg)[\s\S]*?<\/\1>/gi, " ")
       .replace(/<!--[\s\S]*?-->/g, " ")
       .replace(/<[^>]+>/g, " ")
       .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
       .replace(/\s+/g, " ").trim();
  return h;
}
const hash = (s) => createHash("sha256").update(s).digest("hex");

async function main() {
  const sources = JSON.parse(readFileSync(SOURCES_FILE, "utf8"));
  const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, "utf8")) : {};
  const now = new Date().toISOString();
  const changed = [], failing = [], baseline = [];

  for (const s of sources) {
    const prev = state[s.id] || { fails: 0 };
    try {
      const res = await fetch(s.url, { headers: { "User-Agent": UA, "Accept": "text/html" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = mainText(await res.text());
      if (text.length < 200) throw new Error("page text too short (" + text.length + " chars), likely blocked or empty");
      const h = hash(text);
      if (!prev.hash) baseline.push(s);
      else if (prev.hash !== h) changed.push(s);
      state[s.id] = { hash: h, fails: 0, checked: now, changedAt: prev.hash && prev.hash !== h ? now : prev.changedAt };
    } catch (e) {
      const fails = (prev.fails || 0) + 1;
      state[s.id] = { ...prev, fails, lastError: String(e.message || e), checked: now };
      if (fails === FAIL_LIMIT) failing.push({ ...s, error: String(e.message || e) });
    }
  }

  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");

  const lines = [];
  if (changed.length) {
    lines.push("## Pages whose main text changed", "");
    for (const s of changed) lines.push(`- **${s.name}** — ${s.url}\n  Why we watch it: ${s.why}`);
    lines.push("", "Open each page, read what changed, then update the Rules and Updates pages by hand and cite the page. A change can also be a small edit that does not matter.", "");
  }
  if (failing.length) {
    lines.push(`## Pages that failed ${FAIL_LIMIT} checks in a row`, "");
    for (const s of failing) lines.push(`- **${s.name}** — ${s.url}\n  Error: ${s.error}`);
    lines.push("", "Check these by hand. Some sites block automated requests, so a failure does not mean the page changed.", "");
  }
  if (lines.length) {
    writeFileSync(REPORT_FILE, "Checked on " + now + "\n\n" + lines.join("\n"));
    console.log("REPORT WRITTEN");
  } else console.log("No changes." + (baseline.length ? " Baseline set for " + baseline.length + " page(s)." : ""));
}
if (process.argv[1] && process.argv[1].endsWith("check.mjs")) main();
