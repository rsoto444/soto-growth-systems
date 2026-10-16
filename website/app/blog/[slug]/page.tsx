// One page per post in lib/blog-posts.ts, at /blog/<slug>/. Drafts are built only off production.
import { notFound } from "next/navigation";
import BlogPostView, { blogMetadata } from "../../_components/BlogPostView";
import { blogPost, postsForBuild } from "@/lib/blog-posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return postsForBuild().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = blogPost((await params).slug);
  return post ? blogMetadata(post) : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = blogPost((await params).slug);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}
