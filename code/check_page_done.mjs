#!/usr/bin/env node
// Single-page exit gate for /service-page and /blog-post. Node port of check_page_done.py, no Python needed.
//
//     node code/check_page_done.mjs /blog/some-post [--port 3000] [--base http://localhost:3000]
//
// Fails on: a non-200 response, any surviving placeholder frame label, any template string, any dead
// internal link on the page. The command loops until this passes.
import { pathToFileURL } from "node:url";
import { cleanRoute } from "./_route.mjs";

export const STRINGS = [
  "JOB PHOTO", "PORTRAIT", "CREW", "BEFORE - THE OLD UNIT", "AFTER - NEW INSTALL",
  "FINISHED INSTALL", "FINISHED JOB", "SIGNATURE FRAME", "US, WORKING", "DETAIL SHOT",
  "Service one", "Service two", "Customer name", "Client name", "Area one",
  "From $000", "$000", "Your City", "(555) 010-0199", "(555) 555-5555",
  "Business Name", "Month 2026", "Project · location", "Choose one",
  "yourbusiness", "Licence #000000", "Engagement one", "Publication",
];

// Shape-based patterns: catch placeholders nobody thought to list.
export const PLACEHOLDER_PATTERNS = [
  [/\b0{2,}[,+]|\b0,000\b/, "zeroed-out number (00+, 0,000)"],
  [/\$0[,0]*\b|\bFrom \$0/, "zeroed-out price ($0, From $000)"],
  [/\(555\) ?\d{3}/, "555 phone number"],
  [/\b[Ll]orem\b|\bipsum\b/, "lorem ipsum"],
  [/TODO|FIXME|PLACEHOLDER|placeholder/, "literal TODO/placeholder marker"],
  [/Add your real|Replace with|Fill this in|goes here\b/, "instruction text left on page"],
  [/Your (City|Business|Name|Trade)\b/, "Your X template phrase"],
  [/\bExample\b/, "the word Example"],
  [/@(example|yourbusiness)\./, "example email domain"],
  [/\b00 Month\b|\byyyy-mm-dd\b/, "template date placeholder in a form field"],
];

/** The visible text of a page plus form-field text, with scripts and styles removed. */
export function visibleText(html) {
  const noScripts = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const attrs = [...noScripts.matchAll(/(?:placeholder|value|aria-label)="([^"]*)"/g)].map((m) => m[1]).join(" ");
  // The owner's real site tagline (footer), not a template phrase.
  return (noScripts.replace(/<[^>]+>/g, " ") + " " + attrs).replace("Costing Your Business Revenue", "");
}

export function patternHits(html) {
  const text = visibleText(html);
  return PLACEHOLDER_PATTERNS.filter(([re]) => re.test(text)).map(([, label]) => label);
}

export function placeholderHits(html) {
  return [...STRINGS.filter((t) => html.includes(t)), ...patternHits(html)];
}

/**
 * Internal links on the page: href="/path", once each, in order, with any #fragment or ?query dropped.
 * (The Python original only matched plain /path links, so a link with a fragment or query was never checked.)
 */
export function internalLinks(html) {
  const paths = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1].split(/[#?]/)[0]).filter((p) => p.startsWith("/") && !p.startsWith("//"));
  return [...new Set(paths)].sort();
}

async function fetchPage(base, route) {
  try {
    const res = await fetch(base + route, { signal: AbortSignal.timeout(30000) });
    return { status: res.status, html: res.status === 200 ? await res.text() : "" };
  } catch (e) {
    return { status: 0, html: String(e) };
  }
}

/** Runs the gate for one route against a running site. Returns the list of failures (empty = pass). */
export async function checkPageDone(base, route) {
  const failures = [];
  const { status, html } = await fetchPage(base, route);
  if (status !== 200) return { status, failures: [`${route} -> ${status}`] };

  const hits = placeholderHits(html);
  if (hits.length) failures.push("placeholders/frames still present: " + hits.slice(0, 8).join(", "));

  for (const href of internalLinks(html)) {
    const r = await fetchPage(base, href);
    if (r.status !== 200) failures.push(`dead link on page: ${href} -> ${r.status}`);
  }
  return { status, failures };
}

function argValue(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function main() {
  const argv = process.argv.slice(2);
  const rawRoute = argv.find((a, i) => !a.startsWith("--") && !["--port", "--base"].includes(argv[i - 1]));
  const route = cleanRoute(rawRoute);
  if (!route) { console.error("usage: node code/check_page_done.mjs /route [--port 3000] [--base http://localhost:3000]"); return 2; }
  const base = (argValue(argv, "--base") ?? `http://localhost:${argValue(argv, "--port") ?? "3000"}`).replace(/\/$/, "");

  const { status, failures } = await checkPageDone(base, route);
  if (status !== 200) { console.log(`FAIL ${route} -> ${status}`); return 1; }
  if (failures.length) {
    console.log(`PAGE NOT DONE  ${route}`);
    for (const f of failures) console.log("  -", f);
    console.log("\nFix and re-run. The command does not finish until this passes.");
    return 1;
  }
  console.log(`PASS  ${route} - renders, no placeholders, no dead links.`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // exitCode, not process.exit(): force-exiting while fetch connections are closing can abort Node on Windows.
  main().then((code) => { process.exitCode = code; });
}
