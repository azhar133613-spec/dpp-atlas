
import { Metadata } from "next";
import DppPassportClient from "./DppPassportClient";

export async function generateMetadata({ params }: { params: { gtin: string } }): Promise<Metadata> {
  return {
    title: "Digital Product Passport: " + params.gtin + " | DPP Atlas",
    description: "EU ESPR Digital Product Passport — Self-reported textile readiness data. Not a certificate.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Textile DPP Passport: " + params.gtin,
      description: "Self-reported EU ESPR readiness data. Not a certificate.",
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
