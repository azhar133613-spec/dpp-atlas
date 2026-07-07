
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dpp-atlas.vercel.app";
  return [
    { url: base + "/en",          lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: base + "/bn",          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: base + "/en/enroll",   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/en/assess",   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/en/login",    lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: base + "/en/verify",   lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
