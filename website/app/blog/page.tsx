// The blog index: one entry per post, newest first. It is kept out of search results until there is at least
// one published post, and the "Blog" menu link only appears once there is one too (see SiteHeader).
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";
import JsonLd from "../_components/JsonLd";
import { pageMeta, blogIndexSchema } from "@/lib/seo";
import { postsForBuild, publishedPosts } from "@/lib/blog-posts";
import { postPath } from "../_components/BlogPostView";

export const metadata = pageMeta({
  title: "Blog | Soto Growth Systems",
  description: "Plain advice for owner-led businesses on sales, follow-up, CRM, KPIs and the systems that let the business grow without the owner in every step.",
  path: "/blog/",
  noindex: publishedPosts().length === 0,
});

const fmt = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogIndex() {
  const posts = postsForBuild();
  return (
    <>
      <JsonLd data={blogIndexSchema()} />
      <SiteHeader />
      <main className="sgsx-post-wrap">
        <div className="sgsx-post">
          <p className="sgsx-post-meta">The blog</p>
          <h1>Growth systems for owner-led businesses</h1>
          <p>Plain advice on sales, follow-up, CRM, KPIs and the systems that let a business keep growing without the owner in every step.</p>
          {posts.length === 0 ? (
            <p>The first articles are on the way.</p>
          ) : (
            <ul className="sgsx-post-list">
              {posts.map((p) => (
                <li key={p.slug}>
                  <h2><a href={postPath(p)}>{p.title}</a>{p.draft && <span className="sgsx-post-tag">Draft</span>}</h2>
                  <p>{p.description}</p>
                  <p className="sgsx-post-meta"><time dateTime={p.date}>{fmt(p.date)}</time></p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
