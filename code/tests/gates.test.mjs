// Tests for the Node page gates and the stock photo fetcher. Run from the repo root:
//     node --test code/tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { placeholderHits, patternHits, internalLinks, checkPageDone, visibleText } from "../check_page_done.mjs";
import {
  sentenceCount, longParagraphs, gapWithoutVisual, longestTextRun, rhythmFailures, routesFromApp, stripTags, isBlogPost, wordCount,
} from "../check_page_rhythm.mjs";
import { cleanRoute } from "../_route.mjs";
import { slugify, writeManifest, manifestRow, searchPexels, searchOpenverse, loadEnv, MANIFEST } from "../fetch_stock_photos.mjs";

// ---------- check_page_done ----------

test("done: flags template frames, shaped placeholders and instruction text, and passes a clean page", () => {
  assert.deepEqual(placeholderHits("<p>We replaced 40 units. Call (801) 555-0142.</p>"), []);
  assert.ok(placeholderHits("<p>JOB PHOTO</p>").includes("JOB PHOTO"));
  assert.ok(patternHits("<p>Lorem ipsum dolor</p>").includes("lorem ipsum"));
  assert.ok(patternHits("<p>Serving Your City since 2001</p>").includes("Your X template phrase"));
  assert.ok(patternHits("<p>Call (555) 123-4567</p>").includes("555 phone number"));
  assert.ok(patternHits("<p>TODO: add proof</p>").includes("literal TODO/placeholder marker"));
  assert.ok(patternHits("<p>Replace with your real number</p>").includes("instruction text left on page"));
  assert.ok(patternHits("<p>From $0 per month</p>").includes("zeroed-out price ($0, From $000)"));
  assert.ok(patternHits("<p>Email me@example.com</p>").includes("example email domain"));
  assert.ok(patternHits('<input placeholder="yyyy-mm-dd">').includes("template date placeholder in a form field"));
});

test("done: scripts and styles are not read as page text (JSON-LD and CSS can contain anything)", () => {
  const html = '<script type="application/ld+json">{"email":"x@example.com","note":"TODO"}</script><style>.a{content:"Lorem"}</style><p>Real copy.</p>';
  assert.deepEqual(patternHits(html), []);
  assert.ok(!visibleText(html).includes("Lorem"));
});

test("done: the owner's real footer tagline is not a template phrase", () => {
  assert.deepEqual(patternHits("<p>Costing Your Business Revenue</p>"), []);
});

test("done: finds each internal link once, drops fragments and queries, ignores external links", () => {
  const html = '<a href="/about/">a</a><a href="/about/#x">b</a><a href="/contact/?x=1">c</a><a href="https://example.org/z">d</a><a href="/about/">e</a>';
  assert.deepEqual(internalLinks(html), ["/about/", "/contact/"]);
  assert.deepEqual(internalLinks('<a href="//cdn.example.org/x">protocol-relative is external</a>'), []);
  assert.deepEqual(internalLinks('<a href="/#top">home</a>'), ["/"]);
});

function serve(routes) {
  const server = http.createServer((req, res) => {
    const r = routes[req.url];
    if (r === undefined) { res.writeHead(404); res.end("nope"); return; }
    res.writeHead(200, { "content-type": "text/html" });
    res.end(r);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

test("done: against a running site, passes a clean page and reports placeholders, dead links and non-200s", async () => {
  const { server, base } = await serve({
    "/ok/": '<main><h1>Fine</h1><a href="/other/">x</a></main>',
    "/other/": "<main>other</main>",
    "/bad/": '<main><p>TODO fix</p><a href="/missing/">dead</a></main>',
  });
  try {
    assert.deepEqual((await checkPageDone(base, "/ok/")).failures, []);
    const bad = await checkPageDone(base, "/bad/");
    assert.equal(bad.failures.length, 2);
    assert.match(bad.failures[0], /placeholders/);
    assert.match(bad.failures[1], /dead link on page: \/missing\/ -> 404/);
    const gone = await checkPageDone(base, "/nothing/");
    assert.equal(gone.status, 404);
    assert.deepEqual(gone.failures, ["/nothing/ -> 404"]);
  } finally { server.close(); }
});

// ---------- check_page_rhythm ----------

test("rhythm: sentence counting", () => {
  assert.equal(sentenceCount("One. Two! Three? Four."), 4);
  assert.equal(sentenceCount("A single sentence with no end"), 1);
  assert.equal(sentenceCount("   "), 0);
});

test("rhythm: long paragraphs are paragraphs over four sentences", () => {
  const long = "<p>One. Two. Three. Four. Five.</p>";
  const short = "<p>One. Two. Three. Four.</p>";
  assert.equal(longParagraphs(long + short).length, 1);
  assert.equal(longParagraphs(short).length, 0);
});

test("rhythm: the gap counter measures words between visuals", () => {
  const filler = (n) => "<p>" + "word ".repeat(n) + "</p>";
  assert.equal(gapWithoutVisual(filler(100) + "<img src=x>" + filler(300)), 300);
  assert.ok(gapWithoutVisual(filler(500)) >= 500);
});

test("rhythm: text-only blocks in a row", () => {
  const sec = (inner) => `<section>${inner}</section>`;
  const text = sec("<p>just text here</p>");
  const visual = sec('<img src="a.png"><p>caption</p>');
  assert.equal(longestTextRun(text + text + text), 3);
  assert.equal(longestTextRun(text + visual + text + text), 2);
  assert.equal(longestTextRun(visual + visual), 0);
});

const goodPost = () => {
  const para = "<p>A short clear paragraph. It makes one point. That is all.</p>";
  return `<main>${para.repeat(3)}<figure><img src="a.png" alt="a"></figure>${para.repeat(3)}<table><tr><td>x</td></tr></table>${para.repeat(2)}</main>`;
};

test("rhythm: a well-laid-out post passes", () => {
  const { failures } = rhythmFailures("/blog/good", goodPost());
  assert.deepEqual(failures, []);
});

test("rhythm: a wall of text with no images fails on several counts", () => {
  const wall = "<main>" + ("<p>" + "Sentence one. Sentence two. Sentence three. Sentence four. Sentence five. ".repeat(1) + "word ".repeat(80) + "</p>").repeat(12) + "</main>";
  const { failures } = rhythmFailures("/blog/wall", wall);
  assert.ok(failures.some((f) => /no images at all/.test(f)));
  assert.ok(failures.some((f) => /nothing to look at/.test(f)));
  assert.ok(failures.some((f) => /paragraph\(s\) over 4 sentences/.test(f)));
});

test("rhythm: icons without a photograph fail with the photograph message", () => {
  const { failures } = rhythmFailures("/blog/x", '<main><svg></svg><p>Short.</p></main>');
  assert.ok(failures.some((f) => /no photographs \(icons only\)/.test(f)));
});

test("rhythm: a long blog post needs 'On this page', a short one and the index do not", () => {
  const para = "<p>Short sentence. Another one. Done.</p>";
  const img = '<figure><img src="a.png" alt=""></figure>';
  const long = "<main>" + (para.repeat(8) + img).repeat(40) + "</main>"; // well over 6 minutes
  assert.ok(wordCount(long) / 230 > 6);
  assert.ok(rhythmFailures("/blog/long", long).failures.some((f) => /no table of contents/.test(f)));
  assert.ok(!rhythmFailures("/blog/long", long.replace("<main>", "<main><p>On this page</p>")).failures.some((f) => /table of contents/.test(f)));
  assert.ok(!rhythmFailures("/blog/", long).failures.some((f) => /table of contents/.test(f))); // /blog/ is the index
  assert.equal(isBlogPost("/blog/"), false);
  assert.equal(isBlogPost("/blog/some-post/"), true);
});

test("rhythm: a service page needs a form and must not apologise for missing proof", () => {
  const body = goodPost();
  assert.ok(rhythmFailures("/services/x", body).failures.some((f) => /no form/.test(f)));
  assert.ok(rhythmFailures("/services/x", body.replace("<main>", "<main><form></form><p>No results published here yet.</p>")).failures.some((f) => /apologises/.test(f)));
});

test("rhythm: only the <main> content is judged, and scripts are not words", () => {
  const html = `<header>${"word ".repeat(1000)}</header>${goodPost()}<script>${"word ".repeat(1000)}</script>`;
  assert.deepEqual(rhythmFailures("/blog/y", html).failures, []);
  assert.equal(stripTags("<script>x y z</script><p>a b</p>").trim(), "a b");
});

test("rhythm: lists the site's static routes and skips dynamic ones", () => {
  const routes = routesFromApp();
  assert.ok(!routes.includes("/blog")); // the index is a list page, not content; posts are checked by route
  assert.ok(routes.includes("/growth-leak-score"));
  assert.ok(!routes.some((r) => r.includes("[")));
  assert.ok(!routes.includes("/thank-you"));
});

// ---------- fetch_stock_photos ----------

test("photos: slugify makes keyword-shaped file names", () => {
  assert.equal(slugify("Furnace Repair Technician!"), "furnace-repair-technician");
  assert.equal(slugify("   "), "photo");
  assert.equal(slugify("a".repeat(100)).length, 60);
});

test("photos: the manifest keeps earlier rows and adds new ones", () => {
  const dir = mkdtempSync(join(tmpdir(), "stock-"));
  try {
    const a = { file: "a-1.jpg", query: "a", source: "Pexels", credit: "Ann", licence: "L1" };
    const b = { file: "b-1.jpg", query: "b", source: "Openverse", credit: "Bo", licence: "L2" };
    writeManifest(dir, [a]);
    writeManifest(dir, [b]);
    const text = readFileSync(join(dir, MANIFEST), "utf8");
    assert.ok(text.includes(manifestRow(a)));
    assert.ok(text.includes(manifestRow(b)));
    assert.equal((text.match(/^\| File /gm) ?? []).length, 1); // one header, not repeated
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

function stubFetch(handler) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), headers: init.headers ?? {} });
    const body = handler(String(url));
    return { ok: true, status: 200, json: async () => body };
  };
  return calls;
}

test("photos: Pexels results are mapped, with the key sent and a user agent set", async () => {
  const calls = stubFetch(() => ({ photos: [{ src: { large2x: "https://x/y/photo.jpg" }, photographer: "Ann", url: "https://p", alt: "a van" }, { src: {} }] }));
  const r = await searchPexels("hvac van", 3, "KEY123");
  assert.equal(r.length, 1);
  assert.equal(r[0].credit, "Ann");
  assert.equal(r[0].source, "Pexels");
  assert.equal(calls[0].headers.Authorization, "KEY123");
  assert.ok(calls[0].headers["User-Agent"]);
  assert.match(calls[0].url, /query=hvac\+van/);
});

test("photos: Openverse drops trailing words until something matches", async () => {
  const calls = stubFetch((url) => (new URL(url).searchParams.get("q") === "furnace repair" ? { results: [{ url: "https://x/a.jpg", creator: "Zed", license: "by", license_version: "2.0", title: "T" }] } : { results: [] }));
  const r = await searchOpenverse("furnace repair technician", 5);
  assert.equal(r.length, 1);
  assert.equal(r[0].licence, "BY 2.0");
  assert.deepEqual(calls.map((c) => new URL(c.url).searchParams.get("q")), ["furnace repair technician", "furnace repair"]);
});

test("photos: loadEnv reads a .env file but never overrides what is already set", () => {
  const dir = mkdtempSync(join(tmpdir(), "env-"));
  const file = join(dir, ".env");
  try {
    writeFileSync(file, '# comment\nTEST_KEY_ONE="abc"\nTEST_KEY_TWO=def\nTEST_KEY_SET=file\n');
    process.env.TEST_KEY_SET = "already";
    loadEnv(file);
    assert.equal(process.env.TEST_KEY_ONE, "abc");
    assert.equal(process.env.TEST_KEY_TWO, "def");
    assert.equal(process.env.TEST_KEY_SET, "already");
    loadEnv(join(dir, "missing.env")); // a missing file is fine
  } finally { rmSync(dir, { recursive: true, force: true }); delete process.env.TEST_KEY_ONE; delete process.env.TEST_KEY_TWO; delete process.env.TEST_KEY_SET; }
});

test("route cleanup undoes Git Bash's rewriting of arguments that start with a slash", () => {
  assert.equal(cleanRoute("C:/Program Files/Git/blog/my-post/"), "/blog/my-post/");
  assert.equal(cleanRoute("C:\\Program Files\\Git\\blog\\my-post\\"), "/blog/my-post/");
  assert.equal(cleanRoute("C:/Program Files (x86)/Git/services/x"), "/services/x");
  assert.equal(cleanRoute("D:/Tools/Git/blog/a/"), "/blog/a/");
  assert.equal(cleanRoute("C:/Program Files/Git/usr/blog/x"), "/blog/x");
  assert.equal(cleanRoute("/blog/my-post/"), "/blog/my-post/"); // already right: untouched
  assert.equal(cleanRoute("/"), "/");
  assert.equal(cleanRoute(undefined), undefined);
});
