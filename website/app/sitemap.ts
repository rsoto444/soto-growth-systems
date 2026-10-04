import type { MetadataRoute } from "next";
import { site } from "@/lib/site.config";
import { wpPages } from "@/lib/pages";

export const dynamic = "force-static";

// Every live page. /thank-you/ is left out on purpose (never indexed).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = wpPages.map((p) => ({ url: `${site.url}${p.path}`, lastModified: new Date(), priority: p.path === "/" ? 1 : 0.8 }));
  return [...pages, { url: `${site.url}/growth-leak-score/`, lastModified: new Date(), priority: 0.9 }];
}
