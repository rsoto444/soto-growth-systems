// Renders one page carried over from WordPress: header, the owner's words
// exactly as they were, footer. GoHighLevel embeds (form, calendar) get their
// loader script here, because scripts inside page HTML never run.
import Script from "next/script";
import type { Metadata } from "next";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import JsonLd from "./JsonLd";
import { pageMeta, breadcrumbSchema, serviceSchema } from "@/lib/seo";
import { offerSchemaByPath } from "@/lib/offers";
import type { WpPage } from "@/lib/pages";
import { enquiryFormHtml } from "@/lib/enquiry-form";

export const wpMetadata = (p: WpPage): Metadata => pageMeta({ title: p.title, description: p.description, path: p.path });

export default function WpPageView({ page }: { page: WpPage }) {
  const Body = page.hasMain ? "div" : "main";
  const offer = offerSchemaByPath[page.path];
  // The Contact page marks where its enquiry form goes.
  const html = page.html.replace("<!-- SGS_ENQUIRY_FORM -->", enquiryFormHtml);
  return (
    <>
      {page.path !== "/" && <JsonLd data={breadcrumbSchema(page.name, page.path)} />}
      {offer && <JsonLd data={serviceSchema(offer.name, page.description, page.path, offer.price, offer.priceNote)} />}
      <SiteHeader />
      <Body className="sgsx-page" dangerouslySetInnerHTML={{ __html: html }} />
      <SiteFooter />
      {page.needs.includes("ghl-form") && <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />}
    </>
  );
}
