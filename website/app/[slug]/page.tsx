// Every other page carried over from WordPress, at its original address.
import { notFound } from "next/navigation";
import WpPageView, { wpMetadata } from "../_components/WpPageView";
import { wpPage, wpPages } from "@/lib/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return wpPages.filter((p) => p.path !== "/").map((p) => ({ slug: p.path.split("/")[1] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = wpPage(`/${(await params).slug}/`);
  return p ? wpMetadata(p) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = wpPage(`/${(await params).slug}/`);
  if (!p) notFound();
  return <WpPageView page={p} />;
}
