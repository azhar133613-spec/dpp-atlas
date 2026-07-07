
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from EU Official Journal RSS — free, no API key
    const res = await fetch(
      'https://eur-lex.europa.eu/rss/EURLexSearchResult.xml?type=advanced&qid=1&sortOne=RELEVANCE&sortTwo=RELEVANCE',
      { next: { revalidate: 3600 } } // cache 1 hour
    );

    if (!res.ok) throw new Error('RSS fetch failed');

    const xml = await res.text();
    const items: Array<{ title: string; link: string; pubDate: string; tag: string }> = [];

    // Simple XML parsing without external library
    const matches = xml.matchAll(/<item>([sS]*?)</item>/g);
    let count = 0;

    for (const match of matches) {
      if (count >= 4) break;
      const item = match[1];
      const titleMatch = item.match(/<title><![CDATA[(.*?)]]></title>/) || item.match(/<title>(.*?)</title>/);
      const linkMatch  = item.match(/<link>(.*?)</link>/);
      const dateMatch  = item.match(/<pubDate>(.*?)</pubDate>/);

      if (titleMatch && linkMatch) {
        const t = titleMatch[1].trim();
        if (t.toLowerCase().includes('textile') || t.toLowerCase().includes('espr') || t.toLowerCase().includes('ecodesign')) {
          items.push({
            title:   t.slice(0, 120),
            link:    linkMatch[1].trim(),
            pubDate: dateMatch ? new Date(dateMatch[1]).toLocaleDateString('en-GB', {month:'short', year:'numeric'}) : '',
            tag:     'EU OFFICIAL'
          });
          count++;
        }
      }
    }

    // Fallback news if RSS returns nothing relevant
    if (items.length === 0) {
      items.push(
        {title:"EU ESPR Regulation 2024/1781 — Ecodesign for Sustainable Products", link:"https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1781", pubDate:"Jul 2024", tag:"REGULATION"},
        {title:"Bangladesh BGMEA prioritises EU market compliance for 2027", link:"https://www.bgmea.com.bd", pubDate:"2026", tag:"BANGLADESH"},
        {title:"ISO 3759:2011 — Textile dimensional stability test standard", link:"https://www.iso.org/standard/61918.html", pubDate:"Standard", tag:"ISO"},
        {title:"REACH SVHC Candidate List — Latest update", link:"https://echa.europa.eu/candidate-list-table", pubDate:"2026", tag:"REACH"}
      );
    }

    return NextResponse.json({ success: true, items });
  } catch {
    return NextResponse.json({
      success: true,
      items: [
        {title:"EU ESPR Regulation 2024/1781 — Ecodesign for Sustainable Products", link:"https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1781", pubDate:"Jul 2024", tag:"REGULATION"},
        {title:"Bangladesh BGMEA — EU Compliance Resources", link:"https://www.bgmea.com.bd", pubDate:"2026", tag:"BANGLADESH"},
        {title:"ISO 3759:2011 — Textile Shrinkage Test Standard", link:"https://www.iso.org/standard/61918.html", pubDate:"Standard", tag:"ISO"},
        {title:"REACH SVHC Candidate List — ECHA Official", link:"https://echa.europa.eu/candidate-list-table", pubDate:"2026", tag:"REACH"},
      ]
    });
  }
}
