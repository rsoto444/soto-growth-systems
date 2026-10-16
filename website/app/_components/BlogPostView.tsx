// One blog post: header, breadcrumb, title, date, the article body, the author box, footer.
// The body HTML comes from lib/blog-posts.ts and never contains the H1, the date or the author box.
import type { Metadata } from "next";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import JsonLd from "./JsonLd";
import { pageMeta, blogPostingSchema, blogBreadcrumbSchema } from "@/lib/seo";
import type { BlogPost } from "@/lib/blog-posts";

export const postPath = (p: Pick<BlogPost, "slug">) => `/blog/${p.slug}/`;

export const blogMetadata = (p: BlogPost): Metadata =>
  pageMeta({ title: p.title, description: p.description, path: postPath(p), noindex: !!p.draft });

const fmt = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogPostView({ post }: { post: BlogPost }) {
  return (
    <>
      <JsonLd data={[blogPostingSchema(post), blogBreadcrumbSchema(post.title, postPath(post))]} />
      <SiteHeader />
      <main className="sgsx-post-wrap">
        <article className="sgsx-post">
          {post.draft && (
            <p className="sgsx-post-draft" role="note">Draft preview. This post is not published and does not exist on the live site.</p>
          )}
          <nav className="sgsx-post-crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a> / <a href="/blog/">Blog</a>
          </nav>
          <p className="sgsx-post-meta">
            <time dateTime={post.date}>{fmt(post.date)}</time>
            {post.updated && post.updated !== post.date && <> · Updated <time dateTime={post.updated}>{fmt(post.updated)}</time></>}
            {post.readMinutes ? <> · {post.readMinutes} min read</> : null}
          </p>
          <h1>{post.title}</h1>
          <div className="sgsx-post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
          <aside className="sgsx-post-author" aria-label="About the author">
            <p>
              <strong><a href="/about-rich/">Rich Soto</a></strong> founded Soto Growth Systems. He has worked with owner-led businesses since 2001
              through his agency, <a href="https://provoseopros.com" rel="noopener">Provo SEO Pros</a>.
            </p>
          </aside>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
