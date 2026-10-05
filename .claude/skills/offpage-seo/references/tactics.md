# Off-Page SEO Tactics — Prioritized

Ordered by (impact × speed) ÷ risk for small/local service businesses. Work top-down; don't start Tier 3 before Tier 1 is done.

Legend — **Auto** = Claude Code does it. **Human** = a person must do/approve it.

---

## Tier 1 — Foundation & protection (do first, every site)

### 1. Backlink baseline & risk review
- **Why:** You can't prioritize without knowing referring domains, anchors, and trend vs. competitors.
- **Endpoints:** `backlinks/summary`, `referring_domains`, `anchors`, `timeseries_new_lost_summary`, `bulk_ranks`.
- **Auto:** Pull data, compare to competitors, flag over-optimized anchors and spammy patterns.
- **Human:** Confirm competitor list; check Search Console for manual actions before any disavow talk.
- **KPI:** Referring domains, DataForSEO rank, new vs. lost per month.

### 2. Google Business Profile optimization (local only)
- **Why:** For local businesses GBP is the biggest off-site ranking and conversion surface.
- **Endpoints:** `business_data/google/my_business_info`, SERP local pack / Maps.
- **Auto:** Gap report vs. top 3 map-pack competitors: categories, services, photos, description, hours, review count/rating, posts.
- **Human:** Make the edits in GBP; only list truthful categories/services.
- **KPI:** Map-pack position for core terms, GBP completeness.

### 3. Citation & NAP consistency (local only)
- **Why:** Consistent name/address/phone across major directories reinforces the entity for Google and AI answers.
- **Endpoints:** `business_data/business_listings/search`, SERP checks for `"business name" + phone`.
- **Auto:** Find existing listings, record NAP as found, mark mismatches/duplicates, list missing core sites (Bing Places, Apple Business Connect, Facebook, Yelp, BBB, industry/local directories).
- **Human:** Claim/fix listings. Quality over volume — skip bulk-directory blasts.
- **KPI:** % of core citations accurate; duplicates resolved.

### 4. Review generation & response system
- **Why:** Review count, recency, and replies drive local rankings and trust.
- **Endpoints:** `business_data/google/reviews` (task-based), competitor review counts.
- **Auto:** Review velocity vs. competitors; draft reply templates; draft a compliant ask-every-customer message.
- **Human:** Send asks to all real customers (no gating, no incentives); post replies.
- **KPI:** New reviews/month, avg rating, reply rate.

## Tier 2 — Quick wins (weeks 2–6)

### 5. Broken backlink reclamation
- **Why:** Links already earned but pointing at dead URLs — fastest link equity recovery.
- **Endpoints:** `backlinks/backlinks` filtered to broken targets; `backlinks/domain_pages` for status codes.
- **Auto:** Build 301 redirect map to the closest relevant live page; implement in repo/hosting after approval.
- **Human:** Approve redirect map.
- **KPI:** Broken backlinks reclaimed.

### 6. Unlinked brand mention reclamation
- **Why:** Sites already talk about the brand; asking for a link is a warm, high-acceptance request. Mentions also feed AI visibility.
- **Endpoints:** `content_analysis/search` (brand variants), minus pages already linking.
- **Auto:** List mentions with URL, context, sentiment; draft polite link requests.
- **Human:** Approve and send.
- **KPI:** Mentions converted to links.

### 7. Competitor link gap
- **Why:** Domains linking to 2+ competitors are proven, relevant, and likely to link again.
- **Endpoints:** `backlinks/domain_intersection` (competitors as targets, client excluded), `page_intersection` for exact pages.
- **Auto:** Score, filter spam, classify link type, note which tactic earned the competitor's link.
- **Human:** Pick which prospects to pursue.
- **KPI:** Gap prospects contacted / won.

### 8. Local relationship links
- **Why:** Chambers of commerce, associations, sponsorships, suppliers, partners, local news — highly relevant and hard for competitors to copy.
- **Endpoints:** SERP searches (`"<city>" chamber of commerce members`, `"<city>" sponsors`), link gap results filtered to local domains.
- **Auto:** Prospect list with the real relationship angle for each.
- **Human:** Only pursue real relationships (actual memberships, actual sponsorships, actual partners). Paid sponsorship links should be `rel="sponsored"` where required.
- **KPI:** Local referring domains added.

## Tier 3 — Authority builders (ongoing)

### 9. Digital PR / linkable data assets
- **Why:** Original data, local studies, and tools earn editorial links at scale.
- **Endpoints:** SERP API / Content Analysis to find which angles earn coverage in the niche.
- **Auto:** Propose asset ideas using only data the business truly has (or public data with sources); draft pitch.
- **Human:** Approve asset, supply real data, send pitches.
- **KPI:** Editorial links, press mentions.

### 10. Expert source requests (journalist-request platforms)
- **Why:** Quotes in real publications = authoritative links and E-E-A-T signals.
- **Auto:** Draft expert answers grounded in the founder's real experience.
- **Human:** Submit under their real name; only claim real credentials.
- **KPI:** Quotes published.

### 11. Podcast guesting
- **Why:** Show-notes links + brand authority; one good appearance can beat several guest posts.
- **Endpoints:** SERP searches for niche podcasts accepting guests.
- **Auto:** Prospect list, episode-relevant pitch drafts.
- **Human:** Pitch and record.
- **KPI:** Appearances, links from show notes.

### 12. Resource-page & broken-link building on other sites
- **Why:** Offer a genuinely useful page as a replacement/addition on curated resource lists.
- **Endpoints:** SERP (`"<topic>" resources`, `inurl:links`), `backlinks/backlinks` on candidate pages.
- **Auto:** Find lists, check for dead links, draft helpful notes.
- **Human:** Approve/send. Only pitch when the page is truly a fit.
- **KPI:** Resource links won.

### 13. Guest contributions (editorial only)
- **Why:** Real bylines on relevant sites build expertise signals.
- **Auto:** Find relevant editorial sites via link gap/SERP, outline pitches.
- **Human:** Write/approve. **Never** pay for placement or use "sponsored post" farms; no scaled guest-post programs.
- **KPI:** Bylines on relevant sites.

## Tier 4 — AI search & brand visibility

### 14. LLM / AI Overview mention tracking
- **Why:** Brand mentions and third-party presence influence whether ChatGPT, Perplexity and AI Overviews mention the business.
- **Endpoints:** AI Optimization — LLM Mentions (requires DataForSEO monthly commitment).
- **Auto:** Brand vs. competitor mention/citation share for money queries; list the sources AI cites → prospect list.
- **Human:** Pursue listings/features on those cited sources.
- **KPI:** AI mention share over time.

### 15. Consistent entity across profiles
- **Why:** Same name, description, services, and links on LinkedIn, Facebook, directories, and review sites helps search engines and LLMs connect the entity.
- **Auto:** Audit profile consistency, draft truthful bios.
- **Human:** Update profiles.

### 16. Authentic community participation
- **Why:** Helpful answers on Reddit, niche forums, and LinkedIn build brand mentions AI systems pick up.
- **Auto:** Find threads where the business has real expertise; draft helpful (non-promotional) answers.
- **Human:** Post from real accounts, follow each community's rules, disclose affiliation. No self-promo spam, no sockpuppets.

## Monthly monitoring (all sites)

- `timeseries_new_lost_summary` + `referring_domains` new since last snapshot.
- Lost high-value links → attempt recovery.
- Append row to `tracking.csv`; summarize change in 3–5 plain-English lines.

---

## Do NOT do (spam-policy or brand risk)

Buying links · PBNs · link exchanges at scale · expired-domain redirects for authority · automated comment/forum/profile links · bulk directory submissions · social bookmarking / web 2.0 networks · article spinning · parasite/site-reputation-abuse placements · fake or incentivized reviews · review gating · fake profiles or engagement · disavowing without a real reason · any outreach claiming results, awards, or clients that aren't documented.
