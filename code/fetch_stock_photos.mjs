#!/usr/bin/env node
// Download industry stock photos into the site, never hotlink them. Node port of fetch_stock_photos.py.
// Used by /build-website and /blog-post when there are no real photos yet.
//
//     node code/fetch_stock_photos.mjs "furnace repair technician" "hvac van" --count 8
//
// The count is deliberately bigger than any page needs: download a pool, look at every photo, place the
// best fit per slot, and delete the rejects (file + its manifest row). Never ship the first result, never
// place the same photo twice.
//
// Source order:
//   1. Pexels    - needs a free PEXELS_API_KEY in .env (30 seconds, no card). Better photos.
//   2. Openverse - no key, no signup. The fallback so this never hard-blocks a build.
//
// Files land in website/public/images/stock/ with descriptive, keyword-shaped filenames, and every one
// gets a line in the manifest recording its query, source, licence and credit.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_OUT = join(REPO, "website", "public", "images", "stock");
export const MANIFEST = "stock-manifest.md";
const TIMEOUT_MS = 30000;
const UA = "seo-blueprint-pro/1.0";

/** Read .env without a dependency. Only fills what is not already set. */
export function loadEnv(envFile = join(REPO, ".env")) {
  if (!existsSync(envFile)) return;
  for (const raw of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

export function slugify(text, limit = 60) {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.slice(0, limit).replace(/-+$/, "") || "photo";
}

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function searchPexels(query, count, apiKey) {
  const url = "https://api.pexels.com/v1/search?" + new URLSearchParams({ query, per_page: String(count), orientation: "landscape" });
  // Pexels rejects requests with no user agent.
  const payload = await getJson(url, { Authorization: apiKey, "User-Agent": UA });
  const results = [];
  for (const photo of payload.photos ?? []) {
    // Ask Pexels for the size we want so nothing has to be resized locally.
    const src = photo.src ?? {};
    const downloadUrl = src.large2x || src.large || src.original;
    if (!downloadUrl) continue;
    results.push({
      url: downloadUrl,
      credit: photo.photographer || "unknown",
      page: photo.url || "",
      licence: "Pexels licence - free commercial use, no attribution required",
      source: "Pexels",
      alt: photo.alt || query,
    });
  }
  return results;
}

export async function searchOpenverse(query, count) {
  // Openverse ANDs every word, so "furnace repair technician" returns nothing while "furnace repair"
  // returns 154. Drop trailing words until something hits.
  const wordsList = query.split(/\s+/).filter(Boolean);
  let payload = { results: [] };
  for (let stop = wordsList.length; stop > 0; stop--) {
    const attempt = wordsList.slice(0, stop).join(" ");
    const url = "https://api.openverse.org/v1/images/?" + new URLSearchParams({ q: attempt, page_size: String(count), license_type: "commercial", aspect_ratio: "wide" });
    payload = await getJson(url, { "User-Agent": UA });
    if (payload.results?.length) {
      if (attempt !== query) console.error(`  (no results for '${query}', used '${attempt}')`);
      break;
    }
  }
  const results = [];
  for (const image of payload.results ?? []) {
    if (!image.url) continue;
    results.push({
      url: image.url,
      credit: image.creator || "unknown",
      page: image.foreign_landing_url || "",
      licence: `${(image.license || "").toUpperCase()} ${image.license_version || ""}`.trim(),
      source: "Openverse",
      alt: image.title || query,
    });
  }
  return results;
}

async function download(photo, dest) {
  const res = await fetch(photo.url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, data);
  return data.length;
}

const MANIFEST_HEADER =
  "# Stock photos\n\n" +
  "Downloaded because no real photos were supplied.\n\n" +
  "**These are placeholders with a decent haircut.** Stock never shows the team, a real job, a before/after, " +
  "or anything a visitor would read as proof of THIS business. Swap each one for a real photo as it arrives, " +
  "then delete its row.\n\n" +
  "| File | Query | Source | Credit | Licence |\n" +
  "|------|-------|--------|--------|--------|\n";

export function manifestRow(row) {
  return `| \`${row.file}\` | ${row.query} | ${row.source} | ${row.credit} | ${row.licence} |`;
}

/** Appends to the manifest, keeping rows that are already there. */
export function writeManifest(outDir, rows) {
  const path = join(outDir, MANIFEST);
  let existing = "";
  if (existsSync(path)) {
    existing = readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.startsWith("| ") && !l.startsWith("| File") && !l.startsWith("|------"))
      .join("\n");
  }
  const body = [existing.trim(), rows.map(manifestRow).join("\n")].filter(Boolean).join("\n");
  writeFileSync(path, MANIFEST_HEADER + body + "\n");
  return path;
}

function parseArgs(argv) {
  const queries = [];
  let count = 8;
  let out = DEFAULT_OUT;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--count") count = Math.max(1, Number(argv[++i]) || 8);
    else if (argv[i] === "--out") out = resolve(argv[++i]);
    else if (!argv[i].startsWith("--")) queries.push(argv[i]);
  }
  return { queries, count, out };
}

async function main() {
  const { queries, count, out } = parseArgs(process.argv.slice(2));
  if (!queries.length) { console.error('usage: node code/fetch_stock_photos.mjs "query" ["query" ...] [--count 8] [--out DIR]'); return 2; }
  loadEnv();
  const apiKey = (process.env.PEXELS_API_KEY ?? "").trim();
  mkdirSync(out, { recursive: true });

  if (!apiKey) {
    console.error(
      "No PEXELS_API_KEY set - falling back to Openverse (no key needed).\n" +
        "Better photos: pexels.com/api > 'Get Started' > copy the key into .env as PEXELS_API_KEY. Free, no card, 30 seconds.\n",
    );
  }

  const rows = [];
  const failures = [];
  for (const query of queries) {
    let photos;
    try {
      photos = apiKey ? await searchPexels(query, count, apiKey) : await searchOpenverse(query, count);
    } catch (e) {
      failures.push(`${query}: search failed (${e.message})`);
      continue;
    }
    if (!photos.length) { failures.push(`${query}: no results`); continue; }

    let index = 0;
    for (const photo of photos) {
      index++;
      let suffix = extname(new URL(photo.url).pathname).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp"].includes(suffix)) suffix = ".jpg";
      const file = `${slugify(query)}-${index}${suffix}`;
      let size;
      try { size = await download(photo, join(out, file)); }
      catch (e) { failures.push(`${query} #${index}: download failed (${e.message})`); continue; }
      rows.push({ file, query, source: photo.source, credit: photo.credit, licence: photo.licence });
      console.log(`  ${file}  (${Math.floor(size / 1024)} KB)  alt: ${photo.alt}`);
    }
  }

  if (rows.length) {
    const manifest = writeManifest(out, rows);
    console.log(`\nDownloaded ${rows.length} photo(s) to ${out}`);
    console.log(`Manifest: ${manifest}`);
    console.log("Reference them as /images/stock/<file> - the files are local, nothing is hotlinked.");
  } else console.error("\nNothing downloaded.");

  if (failures.length) {
    console.error("\nProblems:");
    for (const f of failures) console.error(`  - ${f}`);
  }
  return rows.length ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // exitCode, not process.exit(): force-exiting while fetch connections are closing can abort Node on Windows.
  main().then((code) => { process.exitCode = code; });
}
