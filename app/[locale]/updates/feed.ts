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
  return out.slice(0, 8);
}

export async function getFeed(): Promise<FeedItem[]> {
  try {
    const res = await fetch(FEEDS[0].url, {
      headers: { "User-Agent": "DPP-Atlas/1.0 (student project; https://dpp-atlas.vercel.app)", Accept: "application/rss+xml, application/xml, text/xml" },
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    return parseFeed(await res.text());
  } catch {
    return [];
  }
}
