#!/usr/bin/env node
// Fails a page that reads as a wall of text. Node port of check_page_rhythm.py, no Python needed.
//
//     node code/check_page_rhythm.mjs                       # every route that has a page.tsx
//     node code/check_page_rhythm.mjs /blog/some-post       # one route
//     add --port 3000 or --base http://localhost:3000 if the dev server is elsewhere
//
// Layout is the one thing nothing else polices: a post can have every required section and still ship
// as thousands of pixels of unbroken paragraphs. Instructions get skipped. This does not.
import { readdirSync, existsSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { cleanRoute } from "./_route.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const MAX_TEXT_RUN = 2;        // consecutive TEXT blocks before it is a wall
export const MAX_SENTENCES = 4;       // per paragraph
export const WORDS_PER_MINUTE = 230;
export const TOC_MINUTES = 6;         // a post this long needs jump links
export const WORDS_PER_VISUAL = 350;  // body stretch allowed without something to look at

// Things a reader LOOKS at. A bordered div of grey text is not one of them.
export const VISUAL_TAGS = ["<img", "<svg", "<video", "<iframe", "<table", "<form", "<ol", "<figure"];

export function stripTags(html) {
  return html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ");
}

export function bodyHtml(html) {
  const m = /<main[^>]*>([\s\S]*)<\/main>/i.exec(html);
  return m ? m[1] : html;
}

const words = (text) => text.split(/\s+/).filter(Boolean);
export const wordCount = (html) => words(stripTags(html)).length;
export const sentenceCount = (text) => text.trim().split(/[.!?]+(?:\s|$)/).filter((s) => s.trim()).length;

/**
 * Walk the top-level sections in order and count TEXT blocks in a row. A block counts as VISUAL only if it
 * actually contains something to look at, which is why this reads the rendered HTML rather than trusting
 * component names.
 */
export function longestTextRun(body) {
  const chunks = body.split(/(?=<(?:section|aside|figure|form|table|div class="[^"]*block)\b)/i);
  let run = 0;
  let worst = 0;
  for (const chunk of chunks) {
    if (!stripTags(chunk).trim()) continue;
    if (VISUAL_TAGS.some((tag) => chunk.toLowerCase().includes(tag))) run = 0;
    else { run++; worst = Math.max(worst, run); }
  }
  return worst;
}

/** Longest stretch of words with nothing to look at in between. Splits on whole opening tags, so tag attributes are never counted as words. */
export function gapWithoutVisual(body) {
  const pieces = body.split(/<(?:img|svg|video|iframe|table|figure|form)\b[^>]*>/i);
  return Math.max(0, ...pieces.map((p) => words(stripTags(p)).length));
}

export function longParagraphs(body) {
  const bad = [];
  for (const m of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = stripTags(m[1]).trim();
    if (sentenceCount(text) > MAX_SENTENCES) bad.push(text.slice(0, 80) + "...");
  }
  return bad;
}

/** A blog post route is /blog/<something>, not the /blog index. */
export const isBlogPost = (route) => /^\/blog\/[^/]+/.test(route);
export const isServicePage = (route) => /^\/services\/[^/]+/.test(route);

/** All the rhythm failures for one page's HTML. Pure: it takes the HTML, not a URL. */
export function rhythmFailures(route, html) {
  const body = bodyHtml(html);
  const failures = [];
  const wc = wordCount(body);
  const minutes = wc / WORDS_PER_MINUTE;
  const lower = body.toLowerCase();

  if (!lower.includes("<img") && !lower.includes("<svg")) failures.push("no images at all - every page needs at least one photograph");
  else if (!lower.includes("<img")) failures.push("no photographs (icons only) - see the /build-website Images ladder");

  const run = longestTextRun(body);
  if (run > MAX_TEXT_RUN) failures.push(`${run} text-only blocks in a row (max ${MAX_TEXT_RUN}) - break it with a visual block`);

  const gap = gapWithoutVisual(body);
  if (gap > WORDS_PER_VISUAL) failures.push(`${gap} words with nothing to look at (max ${WORDS_PER_VISUAL})`);

  const paras = longParagraphs(body);
  if (paras.length) failures.push(`${paras.length} paragraph(s) over ${MAX_SENTENCES} sentences, first: "${paras[0]}"`);

  if (isBlogPost(route) && minutes > TOC_MINUTES && !lower.includes("on this page")) {
    failures.push(`${Math.round(minutes)}-minute read with no table of contents (required over ${TOC_MINUTES})`);
  }
  if (isServicePage(route)) {
    if (!lower.includes("<form")) failures.push("no form - a money page with no lead capture is not a money page");
    const text = stripTags(body).toLowerCase();
    if (text.includes("no results") || text.includes("not published here yet")) {
      failures.push("a section apologises for having no proof - show the best true material instead");
    }
  }
  return { failures, words: wc, minutes };
}

/** Every static route that has a page.tsx, minus the ones nobody optimises. Dynamic [segments] are skipped. */
export function routesFromApp() {
  const app = join(ROOT, "website", "app");
  if (!existsSync(app)) return [];
  const skip = new Set(["thank-you", "privacy-policy", "terms", "not-found", "blog"]);
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "page.tsx") {
        const parts = relative(app, dir).split(sep).filter(Boolean);
        if (parts.some((p) => skip.has(p) || p.startsWith("["))) continue;
        found.push("/" + parts.join("/"));
      }
    }
  };
  walk(app);
  return found.sort();
}

async function fetchHtml(base, route) {
  try {
    const res = await fetch(base + route, { signal: AbortSignal.timeout(30000) });
    return await res.text();
  } catch (e) {
    throw new Error(`Could not reach ${base}${route} (${e.message}).\nStart the dev server first: cd website && npm run dev`);
  }
}

function argValue(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function main() {
  const argv = process.argv.slice(2);
  const base = (argValue(argv, "--base") ?? `http://localhost:${argValue(argv, "--port") ?? "3000"}`).replace(/\/$/, "");
  const routes = argv.filter((a, i) => !a.startsWith("--") && !["--port", "--base"].includes(argv[i - 1])).map(cleanRoute);
  const targets = routes.length ? routes : routesFromApp();
  if (!targets.length) { console.error("No routes found. Run from the repo root with website/app present."); return 2; }

  let failed = 0;
  for (const route of targets) {
    let html;
    try { html = await fetchHtml(base, route); } catch (e) { console.error(e.message); return 2; }
    const { failures, words: wc, minutes } = rhythmFailures(route, html);
    const head = `${route}  (${wc} words, ${Math.round(minutes)} min)`;
    if (failures.length) {
      failed++;
      console.log(`\nFAIL  ${head}`);
      for (const f of failures) console.log(`      - ${f}`);
    } else console.log(`PASS  ${head}`);
  }
  if (failed) {
    console.log(`\nPAGE RHYTHM FAILED on ${failed} page(s).\nThese pages do not get shown to the owner until they pass.`);
    return 1;
  }
  console.log(`\nAll ${targets.length} page(s) passed.`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // exitCode, not process.exit(): force-exiting while fetch connections are closing can abort Node on Windows.
  main().then((code) => { process.exitCode = code; });
}
