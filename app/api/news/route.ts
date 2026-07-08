
import { NextResponse } from 'next/server';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  tag: string;
  tagColor: string;
}

const FALLBACK: NewsItem[] = [
  {title:"EU ESPR Regulation 2024/1781 — Ecodesign for Sustainable Products (Official Text)", link:"https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1781", pubDate:"Jul 2024", tag:"REGULATION", tagColor:"#ef4444"},
  {title:"REACH SVHC Candidate List — Latest substances of very high concern (ECHA)", link:"https://echa.europa.eu/candidate-list-table", pubDate:"2026", tag:"REACH", tagColor:"#f97316"},
  {title:"ISO 3759:2011 — Textiles: Preparation, marking, measuring of fabric specimens (ISO)", link:"https://www.iso.org/standard/61918.html", pubDate:"Standard", tag:"ISO", tagColor:"#eab308"},
  {title:"BGMEA Bangladesh — Sustainability and compliance resources for members", link:"https://www.bgmea.com.bd", pubDate:"2026", tag:"BANGLADESH", tagColor:"#3b82f6"},
  {title:"GOTS — Global Organic Textile Standard: Certification requirements", link:"https://global-standard.org", pubDate:"2026", tag:"GOTS", tagColor:"#22c55e"},
  {title:"OEKO-TEX STANDARD 100 — Testing for harmful substances in textiles", link:"https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100", pubDate:"2026", tag:"OEKO-TEX", tagColor:"#8b5cf6"},
];

export async function GET() {
  return NextResponse.json({ success: true, items: FALLBACK });
}
