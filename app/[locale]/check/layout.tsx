import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return params.locale === "bn"
    ? { title: "ডেটা চেক: একটি পণ্য", description: "একটি পণ্যের প্রতিটি DPP তথ্য কার কাছে আছে তা চিহ্নিত করুন এবং দায়িত্ব অনুযায়ী কাজের তালিকা পান। স্কোর নেই।" }
    : { title: "Data Check: one product", description: "Mark who holds each DPP data point for one product and get an action list by owner. No score." };
}

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
