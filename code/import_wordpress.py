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
    ("contact",
     'href="/#enquiry-form"',
     'href="#enquiry-form"',
     "Go to Form button pointed at the homepage instead of this page's form"),
    ("contact",
     "<!-- FLUENT_FORM_SHORTCODE -->",
     "<!-- SGS_ENQUIRY_FORM -->",
     "The form WordPress never built; the site fills this spot with the enquiry form"),
    ("privacy-policy",
     '<h2 class="sgs-h2">7. Information Sharing</h2>',
     '<h2 class="sgs-h2">SMS/Text Messaging</h2>\n      <p class="sgs-p">If you opt in to receive text messages from Soto Growth Systems, we collect your mobile number and use it only to send the messages you agreed to receive. Message frequency varies. Message and data rates may apply. You can opt out at any time by replying STOP, or reply HELP for help.</p>\n\n      <p class="sgs-p">No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.</p>\n\n      <h2 class="sgs-h2">7. Information Sharing</h2>',
     "Owner-supplied SMS wording for toll-free verification, 28 September 2026"),
    ("terms-of-use",
     '<h2 class="sgs-h2">15. Contact</h2>',
     '<h2 class="sgs-h2">SMS Program Terms</h2>\n      <p class="sgs-p">Program: Soto Growth Systems marketing and informational text messages.</p>\n      <p class="sgs-p">By opting in, you agree to receive recurring text messages from Soto Growth Systems, including offers, resources, and appointment-related updates. Consent is not a condition of purchase.</p>\n      <p class="sgs-p">Message frequency varies. Message and data rates may apply.</p>\n      <p class="sgs-p">Reply STOP to cancel at any time. Reply HELP for help, or contact us through <a href="/contact/">sotogrowthsystems.com/contact</a>.</p>\n      <p class="sgs-p">Carriers are not liable for delayed or undelivered messages.</p>\n\n      <h2 class="sgs-h2">15. Contact</h2>',
     "Owner-supplied SMS wording for toll-free verification, 28 September 2026"),
    ("privacy-policy",
     "Last updated: June 3, 2026",
     "Last updated: September 28, 2026",
     "SMS section added; owner approved the new date"),
    ("terms-of-use",
     "Last updated: June 3, 2026",
     "Last updated: September 28, 2026",
     "SMS section added; owner approved the new date"),
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
