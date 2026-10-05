"""Write keyword-map.md and keyword-map.html for SGS from one data list."""
import html

import pathlib
OUT = str(pathlib.Path(__file__).resolve().parent.parent) + "/"

def diff(kd):
    if kd is None:
        return "difficulty not measured"
    word = "Easy" if kd < 30 else "Medium" if kd < 50 else "Hard"
    return f"{word} ({kd})"

# (number, type, topic, label, check, primary(kw, vol, kd), secondaries[(kw, vol, kd)], also, note, why, existing)
B = [
 (1, "Service page", "Fractional COO", "Standalone", "mixed, money page wins the term",
  ("fractional coo", 1600, 3),
  [("fractional coo services", 390, 0), ("part time coo", 260, 0), ("fractional operations manager", 170, 0), ("outsourced coo", 110, 0)],
  "fractional chief operating officer (720 a month)", None,
  "the biggest buyer term on the map at almost no difficulty, and you already sell it: the Fractional Growth Operator is this role. Retarget the existing page rather than building a second one.",
  "/fractional-growth-operator/"),
 (2, "Service page", "Business consultant for contractors", "Standalone", "mixed, money page wins the term",
  ("construction business consultant", 390, 0),
  [("home service business coach", 110, 11), ("construction business coach", 90, 0), ("hvac business coach", 90, 0), ("business coach for contractors", 70, 0), ("plumbing business coach", 70, 0), ("hvac business consultant", 50, 0), ("plumbing business consultant", 40, 0)],
  "construction business consulting, contractor business coach, hvac business coaching, plumbing business coaching, hvac business consulting",
  "Buyers here also search for a coach. The page says plainly that SGS is a consultant and operator, not a coach, and answers that search honestly.",
  "your lead industry, zero difficulty, and the ranking results are mostly one-person profiles and project consultants, so a focused page for contractor owners has a real opening.",
  None),
 (3, "Service page", "Business growth consultant", "Standalone", "mixed, money page wins the term",
  ("business growth consultant", 720, 0),
  [("growth consultant", 390, 0), ("growth strategy consultant", 390, 0), ("growth strategy consulting firm", 320, 0), ("small business growth consultant", 50, 10)],
  None, None,
  "the plainest description of what SGS does, at zero difficulty. Google currently ranks LinkedIn and Instagram profiles for it, which is an open door for a real service page.",
  None),
 (4, "Service page", "CRM consulting services", "Standalone", "passed",
  ("crm consulting services", 260, 8),
  [("crm system consultant", 210, 0), ("crm cleanup", 40, 0), ("crm setup services", 20, None)],
  "consultant crm", "Narrow family: 3 is everything with this buyer's intent. \"crm consultant\" (590 a month) is bigger, but Google shows job listings and salaries for it.",
  "CRM setup and cleanup is work inside every implementation, and the people searching this are hiring help, not shopping for software.",
  None),
 (5, "Service page", "CRM implementation services", "Standalone", "passed",
  ("crm implementation services", 260, 0),
  [("crm implementation consultant", 50, 2)],
  None, "Narrow family: 1 is everything with this buyer's intent. Google shows a different set of results than page 4, so it is its own page.",
  "same buyer as page 4 at the moment they're ready to install a CRM. Build it after page 4 so the two link to each other.",
  None),
 (6, "Service page", "Business process improvement consultant", "Standalone", "mixed, money page wins the term",
  ("business process improvement consultant", 320, 0),
  [("business process management consultant", 390, 0), ("operational efficiency consultant", 170, 0), ("consultant business process", 170, 0)],
  None, "\"business process management consultant\" has more searches, but Google shows mostly personal profiles for it, so the improvement phrase leads.",
  "SOPs, sales process and follow-up systems all sit under this, and the buyers are owners who know something is broken.",
  None),
 (7, "Service page", "Small business consultant", "Standalone", "mixed, money page wins the term",
  ("small business consultant", 2400, 21),
  [("small business consultant services", 390, 5)],
  "small business consulting, consulting services for small business, small business management consulting (2,400 a month each, same search)",
  "Narrow family: 1 is everything with this buyer's intent. Free government advice centres rank here, so this page has to say clearly who SGS is for ($500K+ owner-led businesses).",
  "big volume, but many searchers want free help. Worth a page, after the sharper ones above.",
  None),
 (8, "Blog post", "What a business management consultant does", "Hub · spokes: 9 · 14 · 18", "passed",
  ("business management consultant", 6600, 18),
  [("what does a management consultant do", 6600, 0), ("what is a business management consultant", 1900, 20), ("what business consultant does", 880, 16), ("business consultant cost", 140, 5), ("how much does a business consultant cost", 110, 8)],
  None, None,
  "the biggest term on the map, and Google treats it as a question, not a hire. It matches your Business Profile category, and it links down to every service page.",
  None),
 (9, "Blog post", "What is a fractional COO", "Spoke · hub: 8 (What a business management consultant does)", "passed",
  ("what is a fractional coo", 390, 0), [], None,
  "Narrow family, verified by a full pull: the fractional COO searches with buyer intent all belong to page 1; this post answers the question and links there.",
  "zero difficulty, and every reader is one step from page 1.",
  None),
 (10, "Blog post", "Sales process stages", "Hub · spokes: 11 · 12 · 19 · 23 · 24 · 27", "passed",
  ("sales process stages", 880, 17),
  [("what is sales process", 390, 11), ("5-step sales process", 170, 1), ("b2b sales process stages", 170, None), ("7 steps in the sales process", 140, 9)],
  "process of sales, seven steps in the sales process",
  None,
  "owners who search this are usually fixing a sales process right now, which is exactly what the Blueprint does.",
  None),
 (11, "Blog post", "What is a sales pipeline", "Spoke · hub: 10 (Sales process stages)", "passed",
  ("what is a sales pipeline", 1000, 15),
  [("sales pipeline stages", 480, 13), ("how to build a sales pipeline", 260, 24), ("what is sales pipeline management", 170, 18)],
  "sales pipeline defined, building a sales pipeline",
  "Narrow family: 3 is everything with this intent. Big software brands rank here, so it's top-of-funnel, not a traffic play.",
  "feeds the CRM and sales process pages with readers who have a pipeline problem.",
  None),
 (12, "Blog post", "Sales process optimization", "Spoke · hub: 10 (Sales process stages)", "passed",
  ("sales process optimization", 260, 6),
  [("automate sales process", 140, 4), ("sales automation process", 140, 18), ("sales process management", 110, 2)],
  "optimize sales process, sales process optimisation",
  "Narrow family: 3 is everything with this intent.",
  "low difficulty, and the reader is already trying to improve their process.",
  None),
 (13, "Blog post", "How to write an SOP", "Standalone", "passed",
  ("how to write an sop", 1300, 19),
  [("sop format", 1300, 8), ("sop writing", 1000, 25), ("sop documents", 1000, 10), ("what is a sop document", 1000, 13)],
  "how to write an sop standard operating procedures",
  None,
  "high volume and SOPs are a named deliverable in the Blueprint. Readers who find writing them hard are Blueprint buyers.",
  None),
 (14, "Blog post", "What an operations consultant does", "Spoke · hub: 8 (What a business management consultant does)", "passed",
  ("operations consultant", 1600, 0),
  [("operations strategy consultant", 260, 0), ("operations consulting firm", 210, 3), ("what is an operations consultant", 110, 0), ("what is operations consulting", 110, 6)],
  "operations consulting, consultant operations (1,600 a month each, same search)",
  None,
  "zero difficulty, and it sits one H2 away from the hub on page 8.",
  None),
 (15, "Blog post", "Revenue operations for owner-led businesses", "Standalone", "passed",
  ("revenue operations", 1600, 8),
  [("what is revenue operations", 720, 5), ("revenue operations consultant", 210, 5), ("revenue operations consulting", 210, 5)],
  None, "Narrow family: 3 is everything with this intent.",
  "RevOps is the big-company name for what the Soto Growth OS does for smaller businesses. Good for AI answers and for linking to the implementation pages.",
  None),
 (16, "Blog post", "How to implement a CRM", "Standalone", "passed",
  ("crm system implementation", 480, 21),
  [("implementation of crm system", 480, 18)],
  None, "Narrow family: 1 is everything with this intent. Google shows how-to guides, so it's a post, not a second CRM service page.",
  "DIY readers who get stuck become CRM consulting clients (pages 4 and 5).",
  None),
 (17, "Blog post", "What is a KPI dashboard", "Standalone", "passed",
  ("what is a kpi dashboard", 480, 19),
  [("sales kpi dashboard", 170, 2)],
  "what is kpi dashboard", "Narrow family: 1 is everything with this intent. \"kpi dashboard\" (5,400 a month) is bigger, but Google treats it as a software search.",
  "last because dashboard vendors dominate it, but KPI visibility is one of the ten Growth Leaks and the post links to it.",
  None),
 (18, "Blog post", "What a business strategy consultant does", "Spoke · hub: 8 (What a business management consultant does)", "passed",
  ("consultant business strategy", 4400, 7),
  [("business strategic consultant", 1300, 17)],
  None, "Narrow family, verified by a full pull: 1 is everything with this intent.",
  "high volume at difficulty 7, and a reader comparing types of consultants is close to hiring one.",
  None),
 (19, "Blog post", "Follow-up email after a sales call", "Spoke · hub: 10 (Sales process stages)", "passed",
  ("follow-up email after sales call", 9900, 21),
  [("sales follow up email format", 1900, 10), ("follow-up sales email subject line", 170, 10)],
  "sales call follow-up email, follow-up email for sales, follow up email subject line sales",
  "Narrow family, verified by a full pull: 2 is everything with this intent.",
  "the biggest new term, and weak follow-up is one of the ten Growth Leaks. Readers who need scripts need a follow-up system.",
  None),
 (20, "Blog post", "What is an SOP in business", "Standalone", "passed",
  ("what is sop in business", 2400, 11),
  [("what does sop stand for in business", 1600, 4), ("what does sop mean in business", 1000, 9)],
  "sop means in business, sop in business, what is an sop in business",
  "\"what is a standard operating procedure\" (22,200 a month) is bigger, but Google mixes in medical and government SOPs, so the business phrasing leads. Links to page 13.",
  "business owners asking this are the ones who don't have SOPs yet, which the Blueprint delivers.",
  None),
 (21, "Blog post", "KPI vs OKR", "Standalone", "passed",
  ("kpi vs okr", 4400, 18),
  [("kpi and okr", 590, 18)],
  "okrs vs kpi",
  "Narrow family: 1 is everything with this intent.",
  "big and easy, and owners setting goals for a team are working on exactly what the Growth OS installs.",
  None),
 (22, "Blog post", "How to scale a business", "Standalone", "passed",
  ("scaling a business", 1300, 18),
  [("what does scaling a business mean", 880, 28)],
  "what does it mean to scale a business",
  "Narrow family: 1 is everything with this intent.",
  "this is the owner-bottleneck searcher: busy, growing, and stuck doing everything. The strongest fit for SGS on the new list.",
  None),
 (23, "Blog post", "Handling objections in sales", "Spoke · hub: 10 (Sales process stages)", "passed",
  ("handling objections in sales", 590, 21),
  [("objections in sales", 480, 7)],
  "overcome objections sales, how to deal with objections in sales, how to overcome objections sales",
  "Narrow family: 1 is everything with this intent.",
  "one stage of the sales process, and hub 10 needs it to cover its topic.",
  None),
 (24, "Blog post", "How to close more sales", "Spoke · hub: 10 (Sales process stages)", "passed",
  ("closing sales deals", 590, 16),
  [("closing methods in sales", 480, 5), ("what is closing in sales", 210, 19)],
  "sales closing the deal",
  "Narrow family: 2 is everything with this intent.",
  "the closing stage of hub 10, at low difficulty.",
  None),
 (25, "Blog post", "Sales KPIs for small business", "Standalone", "passed",
  ("kpi for sales", 880, 16),
  [],
  "what kpi for sales (1,300 a month, same search)",
  "Narrow family: \"sales kpi dashboard\" already belongs to page 17, so it stays there.",
  "KPI visibility is a Growth Leak, and sales numbers are where owners feel it first. Links to page 17.",
  None),
 (26, "Blog post", "CRM best practices", "Standalone", "passed",
  ("best practices crm", 260, 2),
  [],
  None, "Narrow family, verified by a full pull.",
  "easy, and readers whose team ignores the CRM are CRM consulting clients (page 4).",
  None),
 (27, "Blog post", "How to follow up with leads", "Spoke · hub: 10 (Sales process stages)", "passed",
  ("follow up with leads", 210, 4),
  [],
  "follow up lead, follow up on a lead",
  "Narrow family, verified by a full pull: speed to lead waits in saved for later until the site can rank for it.",
  "the follow-up stage of hub 10, and the core of the lead follow-up systems SGS installs.",
  None),
 (28, "Blog post", "Sales pipeline vs sales funnel", "Standalone", "passed",
  ("sales pipeline vs sales funnel", 170, 9),
  [],
  "sales funnel vs sales pipeline, sales pipeline vs funnel",
  "Narrow family. Google shows different results than page 11, so it's its own short post.",
  "small and easy; build it last and link it to page 11.",
  None),
 (29, "Service page", "Business automation services", "Standalone", "mixed, money page wins the term",
  ("business automation services", 480, 0),
  [("business process automation services", 210, 8), ("business automation consultant", 170, 0), ("business automation company", 170, 4), ("business process automation consultant", 170, 0)],
  "business automation service, business automation consultants, business automation consulting, business process automation consulting",
  "Results are scattered (service firms, software guides and a map pack), so secondaries are grouped by buyer wording, not by shared results. Automation here means inside the client's own systems, set up during implementation.",
  "the biggest new hiring search this run found, at zero difficulty, and automation is already part of every implementation level, so the page sells work SGS does today.",
  None),
 (30, "Service page", "GoHighLevel expert", "Standalone", "passed",
  ("gohighlevel expert", 210, 9),
  [("gohighlevel services", 140, 4)],
  "gohighlevel experts, go high level expert, go high level experts, go high level services",
  "Narrow family: 1 is everything with hiring intent. Google shows freelancers selling setup by the hour, so the page says plainly that SGS implements GoHighLevel for owner-led businesses and does not sell hourly setup gigs.",
  "GoHighLevel is the CRM SGS specializes in, both terms are easy, and nobody ranking today offers a full implementation for owner-led businesses.",
  None),
]

SAVED = [
 ("Opens up as your site earns authority · 7 keywords", ["speed to lead", "business consulting firms", "what is an sop document", "business management consulting company", "pipeline management", "what is a business kpi", "kpi for business"]),
 ("Too few searches to be worth a page · 13 keywords", ["business consultant utah", "business consulting utah", "business consultant salt lake city", "business coach utah", "how to grow an hvac business", "how to grow a plumbing business", "hvac business growth", "how to grow a roofing business", "sop writing services", "sales process consultant"]),
]
OTHER = [
 ("sales consulting", "the top results are job listings and personal profiles"),
 ("what is a business consultant", "Google shows LinkedIn profiles, not answers"),
 ("construction consulting services", "construction project consultants, a different service"),
 ("business systems consultant", "job listings and salary pages"),
 ("crm consultant", "job listings and salary pages"),
 ("contractor crm", "software shoppers comparing CRM tools"),
 ("kpi dashboard", "people looking for dashboard software"),
 ("business coach for small businesses", "coaching, which SGS does not sell"),
 ("management consultant fees", "random fee documents, not buyers"),
 ("operations management consultant", "personal profiles and job pages"),
 ("what is a business scorecard", "the corporate Balanced Scorecard, a different idea"),
 ("hr onboarding process", "HR teams reading guides, not owners hiring"),
 ("solar companies going out of business", "homeowners worried about their installer, not owners"),
 ("crm for small business", "software shoppers comparing CRM tools"),
 ("how to start an hvac business", "people starting a business, not established owners"),
]

WRITTEN = {1: "/fractional-growth-operator/ · retargeted and live, Tuesday 29 September 2026",
           2: "/construction-business-consultant/ · live, Tuesday 29 September 2026",
           3: "/business-growth-consultant/ · live, Tuesday 29 September 2026",
           4: "/crm-consulting-services/ · live, Tuesday 29 September 2026",
           5: "/crm-implementation-services/ · live, Tuesday 29 September 2026",
           6: "/business-process-improvement-consultant/ · live, Tuesday 29 September 2026",
           7: "/small-business-consultant/ · live, Tuesday 29 September 2026"}
md = []
md.append("# Your keyword map\n")
md.append(f"{len(B) - len(WRITTEN)} pages left to build, in order, and {len(WRITTEN)} written. Every blog post is under difficulty 30, the ceiling for a new site (no authority score measured yet). US search data from DataForSEO, Tuesday 29 September 2026, added to Sunday 4 October 2026.\n")
md.append("---\n")

todo = [b for b in B if b[0] not in WRITTEN]
done = [b for b in B if b[0] in WRITTEN]

def block(b, written=False):
    n, typ, topic, label, check, prim, secs, also, note, why, existing = b
    md.append(f"## {n}. {typ}: {topic}\n")
    md.append(f"**{label.split(' · ')[0]}**" + (f" · {' · '.join(label.split(' · ')[1:])}" if " · " in label else "") + "\n")
    if written:
        md.append(f"**Page:** {WRITTEN[n]}\n")
    elif existing:
        md.append(f"**Already built:** {existing} · retarget it with /seo-optimization, never a second page\n")
    md.append(f"**Google check:** {check}\n")
    md.append("**Primary keyword**")
    w, _, num = diff(prim[2]).partition(" (")
    md.append(f"- {prim[0]} · {prim[1]:,} searches a month · {w} to rank for ({num[:-1]} out of 100)\n")
    if secs:
        md.append("**Secondary keywords**")
        for k, v, d in secs:
            md.append(f"- {k} · {v:,} a month · {diff(d)}")
        md.append("")
    if also:
        md.append(f"**Also ranks for:** {also}\n")
    if note:
        md.append(f"**Note:** {note}\n")
    md.append(f"**Why here:** {why}\n")
    md.append("---\n")

md.append(f"# To build · {len(todo)}\n")
last_type = None
for b in todo:
    if b[1] != last_type:
        md.append(f"# {b[1]}s · {sum(1 for x in todo if x[1] == b[1])}\n")
        last_type = b[1]
    block(b)
md.append(f"# Written · {len(done)}\n")
for b in done:
    block(b, written=True)
md.append("## Keywords saved for later · 35\n")
for head, kws in SAVED:
    md.append(f"**{head}**")
    md.append(" · ".join(kws[:10]))
    md.append((f"+ {len(kws) - 10 + (3 if 'Too few' in head else 0)} more" if 'Too few' in head else "") + "\n")
md.append("**Google shows something else for these · 15 keywords**")
for k, r in OTHER:
    md.append(f"- {k} - {r}")
md.append("")
open(OUT + "keyword-map.md", "w").write("\n".join(md))

# ---- HTML ----
def pill(kd):
    if kd is None:
        return '<span class="na">not measured</span>'
    cls = "e" if kd < 30 else "m" if kd < 50 else "h"
    word = "Easy" if kd < 30 else "Medium" if kd < 50 else "Hard"
    return f'<span class="pill {cls}">{kd}</span> <span class="w">{word}</span>'

rows = []
for n, typ, topic, label, check, prim, secs, also, note, why, existing in B:
    role = html.escape(label)
    rows.append(f'<tr class="p"><td class="n">{n}</td><td><span class="t">{html.escape(typ)}</span><br>{html.escape(topic)}'
                + (f'<br><span class="ex">written: {html.escape(WRITTEN[n])}</span>' if n in WRITTEN else f'<br><span class="ex">already built: {html.escape(existing)}</span>' if existing else "")
                + f'</td><td>{role}</td><td><b>{html.escape(prim[0])}</b></td><td class="r">{prim[1]:,}</td><td>{pill(prim[2])}</td></tr>')
    for k, v, d in secs:
        rows.append(f'<tr class="s"><td></td><td></td><td></td><td><span class="ar">↳</span> {html.escape(k)}</td><td class="r">{v:,}</td><td>{pill(d)}</td></tr>')

page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Keyword map · Soto Growth Systems</title>
<style>
body{{margin:0;background:#f5f4ed;color:#1f1e1d;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}}
.wrap{{max-width:1100px;margin:0 auto;padding:40px 16px}}
h1{{font-family:Georgia,serif;font-weight:400;font-size:34px;margin:0 0 6px}}
.sub{{color:#6b6a65;margin:0 0 24px}}
.card{{background:#faf9f5;border:1px solid #e6e3d9;border-radius:16px;box-shadow:0 8px 30px rgba(31,30,29,.06);overflow-x:auto}}
table{{border-collapse:collapse;width:100%;min-width:760px;font-size:14px}}
th{{text-align:left;font:600 11px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#6b6a65;padding:14px 12px;border-bottom:1px solid #e6e3d9}}
td{{padding:10px 12px;border-bottom:1px solid #eeebe2;vertical-align:top}}
tr.p td{{background:#eeece3}}
td.n{{font-family:Georgia,serif;font-size:20px;color:#1f1e1d}}
.t{{font:600 11px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#d97757}}
.ex{{font:12px ui-monospace,monospace;color:#6b6a65}}
tr.s td{{color:#4a4945}}
.ar{{color:#9b9990;margin-right:4px}}
.r{{text-align:right;font-family:ui-monospace,monospace}}
.pill{{display:inline-block;min-width:26px;text-align:center;border-radius:999px;padding:1px 8px;font:600 12px ui-monospace,monospace}}
.pill.e{{background:#dcefdc;color:#1f6b2a}}.pill.m{{background:#f6e7c8;color:#8a5a00}}.pill.h{{background:#f6d5cc;color:#9c2f16}}
.w,.na{{color:#6b6a65;font-size:12px}}
</style></head><body><div class="wrap">
<h1>Keyword map</h1>
<p class="sub">Soto Growth Systems · 30 pages in build order, 7 written · US searches a month from DataForSEO · Tuesday 29 September 2026</p>
<div class="card"><table><thead><tr><th>#</th><th>Page type and topic</th><th>Role</th><th>Keyword</th><th class="r">Searches a month</th><th>Difficulty (out of 100)</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table></div></div></body></html>"""
open(OUT + "keyword-map.html", "w").write(page)
print("written", len(B), "blocks")
