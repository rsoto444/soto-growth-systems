import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "./_components/JsonLd";
import { businessSchema, founderSchema } from "@/lib/seo";
import { site } from "@/lib/site.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" />
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
