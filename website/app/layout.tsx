import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "./_components/JsonLd";
import { businessSchema, founderSchema } from "@/lib/seo";
import { site } from "@/lib/site.config";
import "./globals.css";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Font rules read at build time and inlined, so no stylesheet request holds the page.
const fontCss = readFileSync(join(process.cwd(), "app", "fonts.css"), "utf8");

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <style dangerouslySetInnerHTML={{ __html: fontCss }} />
        {/* SGS rank tracker: page views only (path, referrer, screen width), no cookies. */}
        <script defer src="https://sgs-rank-tracker.vercel.app/t.js" data-site="-UT66iPIFrb1"></script>
      </head>
      <body>
        <JsonLd data={[businessSchema, founderSchema]} />
        {children}
        {/* Vercel Web Analytics: visitor counts, no cookies. */}
        <Analytics />
      </body>
    </html>
  );
}
