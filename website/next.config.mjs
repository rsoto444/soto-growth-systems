import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

// Old WordPress addresses and their new homes.
const wpRedirects = JSON.parse(readFileSync(new URL("./lib/redirects.json", import.meta.url), "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Match the old WordPress addresses exactly (they all end in "/").
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  async redirects() {
    return wpRedirects.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
