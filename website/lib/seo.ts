// Head tags and schema for every page. Facts only, all from site.config.ts.
import type { Metadata } from "next";
import { site } from "./site.config";

const OG_IMAGE = { url: "/images/og.png", width: 1200, height: 630, alt: "Soto Growth Systems logo" };

export function pageMeta({ title, description, path, noindex }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, type: "website", locale: "en_US", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

const ORG_ID = `${site.url}/#organization`;
const FOUNDER_ID = `${site.url}/about-rich/#rich-soto`;

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/images/logo.png`,
  image: `${site.url}/images/og.png`,
  telephone: site.phone,
  email: site.email,
  foundingDate: site.founded,
  address: { "@type": "PostalAddress", addressLocality: "Provo", addressRegion: "UT", addressCountry: "US" },
  founder: { "@id": FOUNDER_ID },
};

export const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Rich Soto",
  jobTitle: "Founder",
  url: `${site.url}/about-rich/`,
  worksFor: { "@id": ORG_ID },
  sameAs: ["https://provoseopros.com/"],
};

export function serviceSchema(name: string, description: string, path: string, price?: number, priceNote?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${site.url}${path}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "United States" },
    ...(price
      ? { offers: { "@type": "Offer", price: String(price), priceCurrency: "USD", description: priceNote, url: `${site.url}${path}` } }
      : {}),
  };
}

export function breadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name, item: `${site.url}${path}` },
    ],
  };
}
