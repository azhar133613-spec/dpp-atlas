// Fetches official news headlines at request time (cached 6 hours by Next.js).
// Shows only what the source publishes: title, date, link. No rewriting, no summaries.
export type FeedItem = { title: string; link: string; date: string | null };

export const FEEDS = [
  {
    name: "European Commission, Single Market news (filter: DPP)",
    url: "https://single-market-economy.ec.europa.eu/node/2/rss_en?f%5B0%5D=oe_news_title%3Adpp",
    page: "https://single-market-economy.ec.europa.eu/news_en?f%5B0%5D=oe_news_title%3Adpp",
  },
];

// The Commission's own "DPP" filter is loose. Keep only titles that name a topic this site covers.
export const RELEVANT = /\b(digital product passports?|dpp|ecodesign|espr|textiles?|apparel|garments?|clothes|clothing|footwear|shoes|circular economy|extended producer responsibility|forced labour)\b/i;
export const relevant = (items: FeedItem[]) => items.filter((i) => RELEVANT.test(i.title)).slice(0, 8);

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

const tag = (block: string, name: string) => {
  const m = block.match(new RegExp("<" + name + "[^>]*>([\\s\\S]*?)</" + name + ">", "i"));
  return m ? decode(m[1]) : "";
};

export function parseFeed(xml: string): FeedItem[] {
  const out: FeedItem[] = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  for (const b of blocks) {
    const title = tag(b, "title");
    const link = tag(b, "link");
    let host = "";
    try { const u = new URL(link); host = u.protocol === "https:" ? u.hostname : ""; } catch { /* ignore */ }
    if (!title || !(host === "europa.eu" || host.endsWith(".europa.eu"))) continue;
    const d = new Date(tag(b, "pubDate"));
    out.push({ title, link, date: isNaN(d.getTime()) ? null : d.toISOString() });
  }
  out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return out.slice(0, 40);
}

// Fallback: read the news listing page. Every item link ends in -YYYY-MM-DD_en, so the date comes from the link itself.
export function parseListing(html: string, base: string): FeedItem[] {
  const seen = new Set<string>();
  const out: FeedItem[] = [];
  const re = /<a\s[^>]*href="([^"]*\/news\/[^"#?]*?(\d{4}-\d{2}-\d{2})_en)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    let link = "";
    try { const u = new URL(decode(m[1]), base); if (u.protocol === "https:" && (u.hostname === "europa.eu" || u.hostname.endsWith(".europa.eu"))) link = u.toString(); } catch { /* ignore */ }
    const title = decode(m[3]);
    if (!link || title.length < 8 || seen.has(link)) continue;
    seen.add(link);
    out.push({ title, link, date: m[2] + "T00:00:00.000Z" });
  }
  out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return out.slice(0, 40);
}

async function grab(url: string, accept: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DPP-Atlas/1.0; student project; +https://dpp-atlas.vercel.app)", Accept: accept },
    next: { revalidate: 21600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.text();
}

export async function getFeed(): Promise<{ items: FeedItem[]; error: string }> {
  const errs: string[] = [];
  try {
    const items = relevant(parseFeed(await grab(FEEDS[0].url, "application/rss+xml, application/xml, text/xml")));
    if (items.length) return { items, error: "" };
    errs.push("feed: no relevant items");
  } catch (e) { errs.push("feed: " + String((e as Error).message || e)); }
  try {
    const items = relevant(parseListing(await grab(FEEDS[0].page, "text/html"), FEEDS[0].page));
    if (items.length) return { items, error: "" };
    errs.push("page: no relevant items");
  } catch (e) { errs.push("page: " + String((e as Error).message || e)); }
  console.error("DPP updates feed failed:", errs.join(" | "));
  return { items: [], error: errs.join(" | ") };
}
