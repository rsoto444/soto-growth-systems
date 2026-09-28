"""Turn the WordPress export into website/lib/wp-pages.json.

Words are copied exactly. The only changes are listed in CHANGES below, each
one approved by the owner, and every change must match exactly once or the
script stops. Run: python3 code/import_wordpress.py path/to/export.xml
"""
import html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOME_ID = "6"  # the page WordPress served at "/"
OUT = ROOT / "website" / "lib" / "wp-pages.json"

# (page slug, old text, new text, why)
CHANGES = [
    ("fractional-growth-operator",
     "Scope, cadence, and price are confirmed on a",
     "It starts at $5,500 per month with a 6-month minimum and no setup fee. Scope and cadence are confirmed on a",
     "Owner set the price on 28 September 2026"),
    ("fractional-growth-operator",
     "Fractional Growth Operator™ pricing is not published and is confirmed only after scope, cadence, and deliverables are agreed.",
     "Fractional Growth Operator™ starts at $5,500 per month with a 6-month minimum and no setup fee. Final pricing is confirmed after scope, cadence, and deliverables are agreed.",
     "Owner set the price on 28 September 2026"),
    ("about-rich",
     "business growth systems.</p>",
     "business growth systems.</p><p>Rich founded <a href=\"https://provoseopros.com/\">Provo SEO Pros</a> in 2001 and still runs it today, helping owner-led businesses get found online. Soto Growth Systems works alongside it on the other half of the problem: turning those leads into booked calls and steady revenue with a system that doesn't depend on the owner.</p>",
     "Owner approved this paragraph on 28 September 2026"),
    ("resources",
     "https://link.provoseopros.com/widget/form/N8UId4BuC3fa2010iD7a",
     "https://api.leadconnectorhq.com/widget/form/N8UId4BuC3fa2010iD7a",
     "Same SGS form, neutral address instead of the Provo-branded one"),
]


def field(item, pattern):
    m = re.search(pattern, item, re.S)
    return m.group(1) if m else ""


def text_of(fragment):
    t = re.sub(r"<(style|script)\b.*?</\1>", " ", fragment, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).strip()


def fallback_description(content):
    # First real paragraph of the page, cut at a word boundary.
    for p in re.findall(r"<p\b[^>]*>(.*?)</p>", content, re.S):
        t = text_of(p)
        if len(t) > 80:
            if len(t) <= 158:
                return t
            return t[:155].rsplit(" ", 1)[0].rstrip(",;:") + "..."
    return ""


def main(xml_path):
    xml = Path(xml_path).read_text(encoding="utf-8")
    pages = []
    for item in re.findall(r"<item>(.*?)</item>", xml, re.S):
        if field(item, r"<wp:post_type><!\[CDATA\[(\w+)") != "page":
            continue
        if field(item, r"<wp:status><!\[CDATA\[(\w+)") != "publish":
            continue
        pid = field(item, r"<wp:post_id>(\d+)")
        slug = field(item, r"<wp:post_name><!\[CDATA\[(.*?)\]")
        title = html.unescape(field(item, r"<title><!\[CDATA\[(.*?)\]\]>"))
        content = field(item, r"<content:encoded><!\[CDATA\[(.*?)\]\]></content:encoded>")
        meta = dict(re.findall(r"<wp:meta_key><!\[CDATA\[(.*?)\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]></wp:meta_value>", item, re.S))
        seo_title = meta.get("rank_math_title") or meta.get("XAGIO_SEO_TITLE") or ""
        seo_desc = meta.get("rank_math_description") or meta.get("XAGIO_SEO_DESCRIPTION") or ""

        content = re.sub(r"<!-- /?wp:html -->", "", content).strip()
        needs = []
        if "assets.calendly.com" in content:
            needs.append("calendly")
        if "form_embed.js" in content:
            needs.append("ghl-form")
        # Loader scripts are added by the page component; JSON-LD stays in place.
        content = re.sub(r"<script(?![^>]*application/ld\+json)[^>]*>\s*</script>", "", content)

        for cslug, old, new, _ in CHANGES:
            if cslug == slug:
                n = content.count(old)
                if n != 1:
                    sys.exit(f"{slug}: expected 1 match for change, found {n}: {old[:60]}")
                content = content.replace(old, new)

        path = "/" if pid == HOME_ID else f"/{slug}/"
        pages.append({
            "path": path,
            "oldPath": f"/{slug}/" if pid == HOME_ID else None,
            "title": seo_title or f"{title} | Soto Growth Systems",
            "description": seo_desc or fallback_description(content),
            "name": title.split(" | ")[0],
            "date": field(item, r"<wp:post_date><!\[CDATA\[(\d{4}-\d\d-\d\d)"),
            "needs": needs,
            "hasMain": "<main" in content,
            "html": content,
        })
    pages.sort(key=lambda p: p["path"])
    OUT.write_text(json.dumps(pages, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(pages)} pages written to {OUT.relative_to(ROOT)}")
    for p in pages:
        print(f"  {p['path']:45} {p['title'][:70]}")


if __name__ == "__main__":
    main(sys.argv[1])
