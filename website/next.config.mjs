import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

// Old WordPress addresses and their new homes.
const wpRedirects = JSON.parse(readFileSync(new URL("./lib/redirects.json", import.meta.url), "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Match the old WordPress addresses exactly (they all end in "/").
  trailingSlash: true,
  images: { unoptimized: true },
  // Put the site CSS inside each page instead of a separate file the browser
  // has to wait for (audit, 29 September 2026: about 0.3s faster first paint).
  experimental: { inlineCss: true },
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  async redirects() {
    return wpRedirects.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
