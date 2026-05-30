import type { MetadataRoute } from "next";
import { BASE_URL, PUBLIC_PAGES } from "../lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ar", "en"];
  const entries: MetadataRoute.Sitemap = [];

  for (const [path, meta] of Object.entries(PUBLIC_PAGES)) {
    for (const locale of locales) {
      const pagePath = path === "/" ? "" : path;
      entries.push({
        url: `${BASE_URL}/${locale}${pagePath}`,
        lastModified: new Date(),
        changeFrequency: meta.changefreq,
        priority: meta.priority,
      });
    }
  }

  return entries;
}
