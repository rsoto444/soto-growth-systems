// The blog. Every post is one entry below, newest anywhere in the array (the pages sort by date).
// /blog-post adds an entry with draft: true; /publish flips it to false.
//
// DRAFTS NEVER GO LIVE. A draft is built and viewable only on localhost and on Vercel preview
// deployments (any branch that is not main). On the production site a draft has no page at all, is not
// linked from the blog, and is not in the sitemap. So a half-written post cannot leak.
//
// `html` is the article body, written to references/blog-post-template.md. It does NOT include the H1:
// the page renders the title. Everything else (breadcrumbs, date, author box, schema) is added by
// the page, never written into `html`.

export type BlogPost = {
  /** The URL is /blog/<slug>/. Lowercase letters, numbers and hyphens only. */
  slug: string;
  /** The H1 and the <title>. */
  title: string;
  /** The meta description, about 150 characters. */
  description: string;
  /** Published date, YYYY-MM-DD. */
  date: string;
  /** Last substantial update, YYYY-MM-DD. */
  updated?: string;
  /** Rough reading time shown under the title. */
  readMinutes?: number;
  /** The article body HTML. */
  html: string;
  /** True until /publish. Drafts exist only on localhost and Vercel previews. */
  draft?: boolean;
};

export const blogPosts: BlogPost[] = [];

// Vercel sets VERCEL_ENV to "production" only on the live site.
export const showDrafts = () => process.env.VERCEL_ENV !== "production";

const byNewest = (a: BlogPost, b: BlogPost) => b.date.localeCompare(a.date);

/** Posts a visitor can see: not drafts. */
export const publishedPosts = () => blogPosts.filter((p) => !p.draft).sort(byNewest);

/** Posts this build should render: published ones everywhere, plus drafts when not on production. */
export const postsForBuild = () => (showDrafts() ? [...blogPosts] : blogPosts.filter((p) => !p.draft)).sort(byNewest);

export const blogPost = (slug: string) => postsForBuild().find((p) => p.slug === slug);
