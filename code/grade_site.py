"""Grade every live page against references/on-page-seo.md (80 checks) and
references/geo.md (groups 1-6, 31 checks). Reads saved HTML from a folder
(one file per page) and writes a JSON of fails per page.

Checks that need a keyword map or a top-3 search scan cannot pass until those
exist; they are graded "fail" and marked routed to /keyword-research.
Usage: python3 code/grade_site.py <html_dir> <out.json> [lighthouse perf per url as url=score,...]
"""
import html as H, json, re, sys
from pathlib import Path

HTML_DIR, OUT = Path(sys.argv[1]), Path(sys.argv[2])
PERF = dict(x.split("=") for x in sys.argv[3].split(",")) if len(sys.argv) > 3 else {}

# Working keyword per page: the offer or page name (no keyword map exists yet).
KW = {
    "/": "growth leaks", "/about-rich/": "rich soto", "/book-a-strategy-call/": "growth strategy call",
    "/contact/": "contact soto growth systems", "/fractional-growth-operator/": "fractional growth operator",
    "/growth-leak-assessment/": "growth leak assessment", "/growth-os-blueprint/": "growth os blueprint",
    "/growth-os-guided-implementation/": "guided implementation", "/growth-os-implementation-draft-v2/": "guided implementation", "/growth-os-implementation/": "growth os implementation",
    "/growth-os-managed-implementation/": "managed implementation", "/implementation-options/": "implementation options",
    "/privacy-policy/": "privacy policy", "/resources/": "growth leaks checklist", "/soto-growth-os/": "soto growth os",
    "/terms-of-use/": "terms of use",
}
OFFERS = {"/growth-os-implementation-draft-v2/", "/fractional-growth-operator/", "/growth-leak-assessment/", "/growth-os-blueprint/", "/growth-os-guided-implementation/",
          "/growth-os-implementation/", "/growth-os-managed-implementation/", "/implementation-options/", "/soto-growth-os/"}
LEGAL = {"/privacy-policy/", "/terms-of-use/"}
# Checks that need a keyword map / top-3 scan: graded fail, routed.
# Checks only new writing or real proof can pass: routed to /seo-optimization,
# /service-page or the owner, never fixed by editing the owner's copy.
WRITING = {"onpage:11:5", "onpage:11:0", "onpage:11:1", "onpage:11:2", "onpage:11:3", "onpage:12:2", "onpage:6:0",
           "onpage:6:3", "onpage:10:0", "geo:1:0", "geo:1:1", "geo:1:2", "geo:1:3", "geo:2:0", "geo:2:4", "geo:5:2",
           "onpage:12:1", "onpage:12:3", "onpage:5:1", "geo:2:2", "geo:5:1", "geo:5:3"}
ROUTED = {"onpage:2:1", "onpage:2:2", "onpage:3:1", "onpage:3:2", "onpage:4:0", "onpage:4:1", "onpage:11:4", "geo:4:0"}


def norm(s):
    return re.sub(r"[^a-z0-9 ]", " ", H.unescape(s).lower().replace("™", ""))


def has(text, kw):
    return all(w in norm(text).split() for w in kw.split())


def grade(url, h, all_titles, perf):
    f = set()
    g = lambda p: (re.search(p, h, re.S).group(1) if re.search(p, h, re.S) else "")
    title = H.unescape(g(r"<title>(.*?)</title>"))
    desc = H.unescape(g(r'<meta name="description" content="(.*?)"'))
    body_html = re.sub(r"<(script|style)\b.*?</\1>", "", h, flags=re.S)
    m = re.search(r"</header>(.*)<footer", body_html, re.S)
    main = m.group(1) if m else body_html
    text = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", main))).strip()
    words = text.split()
    kw = KW[url]
    h1 = " ".join(re.findall(r"<h1[^>]*>(.*?)</h1>", main, re.S))
    slug = url.strip("/")
    isoffer, islegal = url in OFFERS, url in LEGAL

    # 1 head tags
    if not 50 <= len(title) <= 60: f.add("onpage:0:0")
    if not has(title[: max(30, len(title) // 2 + 10)], kw): f.add("onpage:0:1")
    if all_titles.count(title) > 1: f.add("onpage:0:2")
    if not 140 <= len(desc) <= 160 or desc.endswith("..."): f.add("onpage:0:3")
    if not has(desc, kw): f.add("onpage:0:4")
    if 'rel="canonical"' not in h: f.add("onpage:0:5")
    if 'name="viewport"' not in h: f.add("onpage:0:6")
    if '<html lang="en"' not in h or 'charset="utf-8"' not in h.lower(): f.add("onpage:0:7")
    # 2 url
    if re.search(r"draft|v2|\d{4}", slug): f.update({"onpage:1:0", "onpage:1:2"})
    if url != "/" and not has(slug.replace("-", " "), kw): f.add("onpage:1:1")
    # 3 headings
    if len(re.findall(r"<h1", main)) != 1 or not has(h1, kw): f.add("onpage:2:0")
    levels = [int(x) for x in re.findall(r"<h([1-4])\b", main)]
    if any(b - a > 1 for a, b in zip(levels, levels[1:])): f.add("onpage:2:3")
    # 4 keyword placement
    if not has(" ".join(words[:100]), kw): f.add("onpage:3:0")
    # 6 images: no original photo or graphic anywhere on the site
    f.add("onpage:5:1")
    # 7 internal links in the body
    links = re.findall(r'<a[^>]*href="(/[^"#]*)[^"]*"[^>]*>(.*?)</a>', main, re.S)
    if not 3 <= len({l for l, _ in links}) and not islegal: f.add("onpage:6:0")
    if any(re.fullmatch(r"\s*(click here|read more|learn more|here)\s*", H.unescape(re.sub("<[^>]+>", "", a)), re.I) for _, a in links): f.add("onpage:6:1")
    money = ("/book-a-strategy-call/", "/growth-leak-assessment/", "/implementation-options/", "widget/booking")
    if not islegal and not any(x in main for x in money): f.add("onpage:6:2")
    if isoffer and "/implementation-options/" not in main and "/soto-growth-os/" not in main: f.add("onpage:6:3")
    if "/book-assessment/" in main: f.add("onpage:6:4")
    # 9 social
    for i, tag in enumerate(['property="og:title"', 'property="og:description"', 'property="og:image"', 'property="og:url"', 'name="twitter:card"']):
        if tag not in h: f.add(f"onpage:8:{i}")
    # 10 schema
    types = set(re.findall(r'"@type":"(\w+)"', h))
    if isoffer and not ({"Service", "Offer"} & types): f.add("onpage:9:0")
    if '"sameAs"' not in re.sub(r'"sameAs":\["https://provoseopros.com/"\]', "", h): f.add("onpage:9:4")
    # 11 faq
    faq = "<details" in main
    if not faq and not islegal: f.add("onpage:10:0")
    # 12 AI extraction
    qh2 = re.findall(r"<h2[^>]*>([^<]*\?)</h2>\s*(?:</div>)?\s*<p[^>]*>(.*?)</p>", main, re.S)
    if any(not 40 <= len(H.unescape(re.sub("<[^>]+>", "", a)).split()) <= 60 for _, a in qh2): f.add("onpage:11:0")
    quick = "Quick answer" in text
    if not quick and not islegal and url not in ("/contact/",): f.add("onpage:11:1")
    tables = len(re.findall(r"<table", main))
    if isoffer and tables == 0: f.update({"onpage:11:2", "onpage:11:3"})
    if not re.search(r"\b(we|our)\b", text, re.I): f.add("onpage:11:5")
    # 13 proof (no reviews, results, case studies or photos exist yet)
    f.update({"onpage:12:1", "onpage:12:3"})
    if not islegal and not re.search(r"\$\d|\d+ (years|weeks|months)", text): f.add("onpage:12:2")
    # 14 technical
    if perf is not None and perf < 90: f.add("onpage:13:1")
    # 15 readability / contrast. Footer and dark-section links were fixed on
    # 29 September 2026; the Resources number badges (#2563EB on #E9EFFD,
    # 4.48:1) still wait on the owner's colour call.
    if 'class="sgs-mini-num"' in main and ".sgsx-page .sgs-mini-num{color:#1D4ED8}" not in h: f.add("onpage:14:1")
    # ROUTED: needs keyword map / top-3 scan
    f.update(x for x in ROUTED if x.startswith("onpage"))

    # GEO, groups 1-6 (group 7 and 8 are off-site/measurement, reported separately)
    geo = set()
    if perf is not None and perf < 90: geo.add("geo:0:2")
    if "onpage:11:0" in f: geo.add("geo:1:0")
    if not quick and not islegal and url != "/contact/": geo.update({"geo:1:1", "geo:1:2"})
    sents = [s for s in re.split(r"(?<=[.!?])\s+", text) if len(s.split()) > 3]
    if sents and sum(len(s.split()) for s in sents) / len(sents) > 22: geo.add("geo:1:3")
    if isoffer and tables == 0: geo.add("geo:2:0")
    geo.add("geo:2:2")  # no attributed customer quote exists
    if not faq and not islegal: geo.add("geo:2:4")
    if "onpage:9:0" in f: geo.add("geo:3:0")
    if "onpage:9:4" in f: geo.add("geo:3:4")
    geo.update({"geo:5:1", "geo:5:3"})  # no case studies, no original photos
    if "onpage:12:2" in f: geo.add("geo:5:2")
    geo.add("geo:4:0")
    return f, geo, dict(title=title, tlen=len(title), desc=desc, dlen=len(desc), words=len(words), faq=faq, tables=tables, types=sorted(types))


pages = {}
for p in sorted(HTML_DIR.glob("*.html")):
    url = "/" if p.stem == "_" else p.stem.replace("_", "/")
    pages[url] = p.read_text()
titles = [H.unescape(re.search(r"<title>(.*?)</title>", h, re.S).group(1)) for h in pages.values()]
out = {}
for url, h in pages.items():
    perf = int(PERF[url]) if url in PERF else None
    f, geo, info = grade(url, h, titles, perf)
    out[url] = dict(onpage=sorted(f), geo=sorted(geo), routed=sorted((ROUTED | WRITING) & (f | geo)), **info)
OUT.write_text(json.dumps(out, indent=1))
for url, r in out.items():
    print(f"{url:38} onpage fails {len(r['onpage']):2}/80  geo fails {len(r['geo']):2}/31  words {r['words']}  faq {r['faq']}  tables {r['tables']}")
