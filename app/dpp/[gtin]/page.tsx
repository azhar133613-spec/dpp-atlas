
import { Metadata } from "next";
import DppPassportClient from "./DppPassportClient";

export async function generateMetadata({ params }: { params: { gtin: string } }): Promise<Metadata> {
  return {
    title: "Digital Product Passport: " + params.gtin + " | DPP Atlas",
    description: "EU ESPR Digital Product Passport — Verified textile compliance data for buyers and auditors.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Textile DPP Passport: " + params.gtin,
      description: "Verified EU ESPR compliance data. Scan QR to verify factory compliance status.",
      type: "website",
    }
  };
}

export default function DppPassportPage({ params }: { params: { gtin: string } }) {
  return (
    <main style={{minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,sans-serif"}}>
      <DppPassportClient gtin={params.gtin} />
    </main>
  );
}
