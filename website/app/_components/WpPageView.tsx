// Renders one page carried over from WordPress: header, the owner's words
// exactly as they were, footer. Embeds (Calendly, GoHighLevel form) get their
// loader script here, because scripts inside page HTML never run.
import Script from "next/script";
import type { Metadata } from "next";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import JsonLd from "./JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";
import type { WpPage } from "@/lib/pages";

export const wpMetadata = (p: WpPage): Metadata => pageMeta({ title: p.title, description: p.description, path: p.path });

export default function WpPageView({ page }: { page: WpPage }) {
  const Body = page.hasMain ? "div" : "main";
  return (
    <>
      {page.path !== "/" && <JsonLd data={breadcrumbSchema(page.name, page.path)} />}
      <SiteHeader />
      <Body className="sgsx-page" dangerouslySetInnerHTML={{ __html: page.html }} />
      <SiteFooter />
      {page.needs.includes("calendly") && <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />}
      {page.needs.includes("ghl-form") && <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />}
    </>
  );
}
