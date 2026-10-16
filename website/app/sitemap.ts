import type { MetadataRoute } from "next";
import { site } from "@/lib/site.config";
import { wpPages } from "@/lib/pages";
import { publishedPosts } from "@/lib/blog-posts";

export const dynamic = "force-static";

// Every live page. /thank-you/ is left out on purpose (never indexed).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = wpPages.map((p) => ({ url: `${site.url}${p.path}`, lastModified: new Date(), priority: p.path === "/" ? 1 : 0.8 }));
  const posts = publishedPosts();
  // The blog index and posts appear only when there is a published post. Drafts never do.
  const blog = posts.length
    ? [
        { url: `${site.url}/blog/`, lastModified: new Date(`${posts[0].updated ?? posts[0].date}T12:00:00`), priority: 0.7 },
        ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}/`, lastModified: new Date(`${p.updated ?? p.date}T12:00:00`), priority: 0.6 })),
      ]
    : [];
  return [...pages, { url: `${site.url}/growth-leak-score/`, lastModified: new Date(), priority: 0.9 }, ...blog];
}
