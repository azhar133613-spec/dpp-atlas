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
    { url: base + "/en/updates", lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: base + "/bn/updates", lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: base + "/en/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: base + "/bn/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: base + "/en/about", lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: base + "/bn/about", lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}
