import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dpp-atlas.vercel.app";
  const now = new Date();
  return [
    { url: base + "/en", lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: base + "/bn", lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: base + "/en/check", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/bn/check", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/en/rules", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/bn/rules", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
