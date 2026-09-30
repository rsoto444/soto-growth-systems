---
name: offpage-seo
description: Runs white-hat off-page SEO for Provo SEO Pros / Soto Growth Systems sites and client sites using DataForSEO data — backlink audits, competitor link gap, broken-link reclamation, unlinked brand mentions, Google Business Profile, citations/NAP, reviews, digital PR and AI/LLM brand visibility. Use this skill whenever the user mentions off-page SEO, backlinks, link building, link gap, referring domains, brand mentions, citations, NAP, local listings, reviews, digital PR, authority, "DR"/domain rank, AI Overview or ChatGPT visibility, or asks to grow rankings for a domain beyond on-page fixes — even if they don't say "off-page".
---

# Off-Page SEO (DataForSEO)

Turn DataForSEO data into a prioritized, human-approved off-page plan for one domain at a time. Claude Code does the research, analysis, prospect lists, fixes on the site itself, and outreach **drafts**. A human approves and sends every outreach message. Claude Code never sends outreach, submits listings, posts reviews, or buys anything.

Read `references/tactics.md` for the full prioritized tactic list (what, why, endpoint, automation, human step, KPI). Read `references/dataforseo-endpoints.md` before the first API call of a session.

## Non-negotiable guardrails

These protect the client's domain and the PSP/SGS brand. If a request conflicts with them, stop and explain.

1. **No link schemes.** Never buy, sell, or exchange links for ranking; no PBNs, link farms, expired-domain redirects to borrow authority, paid guest posts without `rel="sponsored"`, automated link drops, comment/forum spam, or "web 2.0" link networks. These violate Google's spam policies.
2. **No fake signals.** No fake reviews, review gating, incentivized reviews, fake profiles, fake engagement, fake testimonials, or invented credentials. Outreach must never claim results, awards, team size, clients, or data that aren't documented. (PSP is a one-person founder-led business — don't write "our team" copy for PSP.)
3. **No invented personalization.** Every personalized line in an outreach draft must be traceable to a real page/URL in the prospect data. If there's nothing real, use the neutral template.
4. **Human approval gate.** All outreach drafts go to `outreach/drafts/` with status `DRAFT – needs approval`. Never send.
5. **Disavow is rare.** Don't generate a disavow file unless there is a manual action in Search Console or clear evidence the site bought/built manipulative links. Low-quality links alone are normally ignored by Google. Flag, don't disavow.
6. **Don't guess API facts.** If an endpoint path, parameter, or field name is uncertain, check docs.dataforseo.com (or the MCP tool schema) before calling. Never fabricate metrics — every number in a report must come from a saved API response.

## Setup (once per machine)

Preferred: DataForSEO MCP server in Claude Code.

```bash
claude mcp add dataforseo \
  --env DATAFORSEO_USERNAME=your_api_login \
  --env DATAFORSEO_PASSWORD=your_api_password \
  -- npx -y dataforseo-mcp-server
```

Fallback: direct REST with Basic auth (`scripts/dfs.py`), reading `DATAFORSEO_USERNAME` / `DATAFORSEO_PASSWORD` from env. Never write credentials into repo files, reports, or logs.

## Cost control

DataForSEO is pay-as-you-go (per request + per row). Before any run:
- State the planned calls and a rough cost estimate; ask before exceeding **$5 per domain per run** unless the user set a different cap.
- Always pass `limit`; start at 100 rows and expand only if needed.
- Cache every raw response to `offpage/<domain>/raw/<endpoint>_<YYYY-MM-DD>.json` and reuse it within 30 days instead of re-calling.
- LLM Mentions API requires a monthly commitment — confirm it's enabled before calling; if not, skip that module and say so.

## Inputs to collect first

Ask only for what's missing:
1. Target domain (and whether it's a PSP/SGS own site or a client).
2. Business type: local service (has GBP) or non-local.
3. 3–5 real competitors (or permission to pull them from DataForSEO Labs `competitors_domain`).
4. Brand name variants (for mention search) and exact NAP (name, address, phone) as it should appear.
5. Location/market (for local SERP and GBP lookups).
6. Budget cap if different from default.

## Workflow

Work through phases in order. Save everything under `offpage/<domain>/`.

**Phase 1 — Baseline (always)**
- `backlinks/summary` → rank, backlinks, referring domains, spam score, broken backlinks count.
- `backlinks/referring_domains` (sorted by rank) and `backlinks/anchors`.
- `backlinks/timeseries_new_lost_summary` for the last 12 months.
- Competitors: same summary for each via `backlinks/bulk_ranks` + `bulk_referring_domains`.
- Output `baseline.md`: where the domain stands vs. competitors, anchor-text health (flag if exact-match commercial anchors look over-optimized), and any obvious risk patterns. Flag risk; don't disavow.

**Phase 2 — Protect & reclaim (quick wins)**
- Broken backlinks: find backlinks pointing to URLs on the target that return 4xx. If the site repo is available, propose a 301 map to the closest relevant live page (`fixes/redirects.csv`); implement only after approval.
- Unlinked mentions: `content_analysis/search` for brand variants, exclude pages already in the backlink set → `prospects/unlinked-mentions.csv`.
- Local (if applicable): `business_data/google/my_business_info` for the target + competitors; compare categories, review count/rating, completeness → `local/gbp-gap.md`. Audit citation NAP consistency with `business_data/business_listings/search` and SERP checks → `local/citations.csv` (source, NAP as found, match/mismatch, fix needed).

**Phase 3 — Gap & prospects**
- `backlinks/domain_intersection` with competitors as targets and the client in `exclude_targets` → domains linking to 2+ competitors but not the client.
- Score each prospect (see scoring below), drop spammy/irrelevant ones, classify by link type (local org, directory/citation, resource page, editorial, podcast, partner/supplier, association).
- Output `prospects/link-gap.csv` sorted by score, with the specific competitor page that earned the link and the realistic tactic to earn an equivalent.

**Phase 4 — Authority plan**
- Pick 1–2 digital PR / linkable-asset ideas grounded in real data the business actually has (no invented stats).
- Build lists for journalist-request platforms, podcasts, and resource pages from SERP API searches (e.g., `"<topic>" + "resources"`, `"<industry>" podcast guest`).
- Draft outreach (see rules below) into `outreach/drafts/`.

**Phase 5 — AI/LLM visibility (if enabled)**
- LLM Mentions API: how often the brand vs. competitors is mentioned/cited in AI Overviews and ChatGPT for money queries; which third-party sources AI cites.
- Those cited sources become priority prospects (lists, directories, review sites, forums) in `prospects/ai-sources.csv`.

**Phase 6 — Report & tracking**
- Write `report.md` (plain English, business impact first) and `action-plan.md` with owner and next action per item.
- Append a dated snapshot row to `tracking.csv` (referring domains, rank, new/lost links, reviews, mention count) so month-over-month progress is measurable.

## Prospect scoring (0–100)

| Factor | Weight | Signal |
|---|---|---|
| Topical/local relevance | 35 | Same industry, same city/region, or serves same customer |
| Links to multiple competitors | 20 | Intersection count from domain_intersection |
| Authority | 20 | DataForSEO rank of referring domain |
| Real site / low spam | 15 | Low spam score, real content, real traffic |
| Achievability | 10 | Has contact path, accepts contributions/listings |

Discard anything with high spam score, obvious link-selling pages ("write for us – $"), or irrelevant topics regardless of authority.

## Outreach draft rules

- Short: 60–120 words, one clear ask, one question at a time.
- Reference only real, verifiable details (the page URL you found).
- Offer value to the recipient (fix for their broken link, a useful resource, an expert quote) — never payment for a link.
- Truthful sender identity (real name, real business). No fake urgency, no guarantees.
- Include a plain opt-out line for cold emails.
- Save as `outreach/drafts/<prospect-domain>.md` with: prospect URL, why they're relevant, the draft, status `DRAFT – needs approval`.

## Output folder

```
offpage/<domain>/
  raw/            cached API JSON
  baseline.md
  local/          gbp-gap.md, citations.csv
  prospects/      link-gap.csv, unlinked-mentions.csv, ai-sources.csv
  fixes/          redirects.csv
  outreach/drafts/
  report.md
  action-plan.md
  tracking.csv
```

## Final check before handing back

- Every metric traceable to a saved raw response?
- Any tactic that could violate Google's spam policies or the guardrails above? Remove it.
- Every outreach item still marked DRAFT?
- Costs stayed under the cap?
- Does `action-plan.md` give one clear next action per item with an owner?
