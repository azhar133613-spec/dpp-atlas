
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DPP Atlas — Free Textile EU ESPR Compliance Tool",
    template: "%s | DPP Atlas"
  },
  description: "Free AI-powered EU ESPR Digital Product Passport assessment for textile factories. Get instant compliance scores, AI roadmaps, and verified badges.",
  keywords: ["DPP", "textile compliance", "EU ESPR", "Bangladesh garment", "digital product passport", "ISO 3759", "REACH compliance"],
  authors: [{ name: "DPP Atlas" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "DPP Atlas",
    title: "DPP Atlas — Free Textile EU ESPR Compliance Tool",
    description: "AI-powered Digital Product Passport assessment for Bangladesh textile factories.",
    url: "https://dpp-atlas.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPP Atlas — Free Textile EU Compliance",
    description: "AI-powered DPP assessment for textile factories.",
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
