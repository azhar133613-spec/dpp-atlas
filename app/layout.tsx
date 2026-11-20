
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DPP Atlas — Textile DPP data check for Bangladesh factories",
    template: "%s | DPP Atlas"
  },
  description: "A free, Bangla-first data check for textile factories preparing for EU Digital Product Passport data requests. Not a certificate or legal advice.",
  keywords: ["DPP", "textile compliance", "EU ESPR", "Bangladesh garment", "digital product passport", "ISO 3759", "REACH compliance"],
  authors: [{ name: "DPP Atlas" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "DPP Atlas",
    title: "DPP Atlas — Textile DPP data check for Bangladesh factories",
    description: "Find out who holds each product data point before a buyer asks. Free, Bangla-first.",
    url: "https://dpp-atlas.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPP Atlas — Textile DPP data check",
    description: "A free data check for textile factories preparing for EU DPP requests.",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{margin:0, padding:0}}>{children}</body>
    </html>
  );
}
