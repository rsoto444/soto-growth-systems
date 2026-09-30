# DataForSEO Endpoint Reference (off-page)

Base URL: `https://api.dataforseo.com/v3/` · Auth: HTTP Basic (API login/password) · POST with a JSON array of task objects.

**Verify before first use each session:** paths, parameters and field names change. Check docs.dataforseo.com or the MCP tool schema. Items marked (verify) were not confirmed when this skill was written.

## Backlinks API (Live, ~2s)
| Use | Path | Key params |
|---|---|---|
| Profile overview | `backlinks/summary/live` | `target`, `include_subdomains` |
| Individual links | `backlinks/backlinks/live` | `target`, `mode`, `filters`, `order_by`, `limit` |
| Referring domains | `backlinks/referring_domains/live` | `target`, `order_by: ["rank,desc"]`, `limit` |
| Anchors | `backlinks/anchors/live` | `target`, `limit` |
| Pages on target by links | `backlinks/domain_pages/live` | `target` (domain only) |
| Backlink competitors | `backlinks/competitors/live` | `target` |
| Link gap (domains) | `backlinks/domain_intersection/live` | `targets: {"1": comp1, "2": comp2}`, `exclude_targets: [client]`, `exclude_internal_backlinks: true` |
| Link gap (pages) | `backlinks/page_intersection/live` | same shape as above |
| New/lost trend | `backlinks/timeseries_new_lost_summary/live` (verify) | `target`, `date_from`, `date_to` |
| Bulk rank / RDs / spam | `backlinks/bulk_ranks/live`, `bulk_referring_domains/live`, `bulk_spam_score/live` | `targets` (up to 1,000) |

Broken backlinks: use `backlinks/backlinks/live` with a filter on the broken-link field (verify field name, e.g. `is_broken`).
Rank metric = DataForSEO's PageRank-style authority score (their equivalent of DR).

## Content Analysis API (Live)
| Use | Path |
|---|---|
| Brand/keyword mentions | `content_analysis/search/live` — `keyword`, `search_mode`, `filters`, `limit` (≤1,000) |
| Mention sentiment summary | `content_analysis/sentiment_analysis/live` (verify) |

## Business Data API
| Use | Path |
|---|---|
| GBP details | `business_data/google/my_business_info/live` (or `task_post`) — `keyword` (business name + city), `location_name` |
| Google reviews | `business_data/google/reviews/task_post` → `task_get` (task-based) |
| Listings search | `business_data/business_listings/search/live` (verify) |

## SERP & Labs
| Use | Path |
|---|---|
| Organic SERP / prospecting searches | `serp/google/organic/live/advanced` |
| Local pack / Maps | `serp/google/maps/live/advanced` |
| Organic competitors | `dataforseo_labs/google/competitors_domain/live` |

## AI Optimization (requires monthly commitment)
| Use | Path |
|---|---|
| LLM mentions (AI Overviews, ChatGPT) | `ai_optimization/llm_mentions/...` (verify exact paths in docs) |

## MCP setup (Claude Code)
```bash
claude mcp add dataforseo \
  --env DATAFORSEO_USERNAME=your_api_login \
  --env DATAFORSEO_PASSWORD=your_api_password \
  -- npx -y dataforseo-mcp-server
```
The official MCP exposes SERP, Keywords, Labs, Backlinks, On-Page, Business Data, and Domain Analytics. Content Analysis and LLM Mentions may need the REST fallback (`scripts/dfs.py`).

## Verified on provoseopros.com (Wednesday 30 September 2026)
- Worked: `backlinks/summary/live`, `referring_domains/live`, `anchors/live`, `backlinks/live` with filter `["is_broken","=",true]`, `domain_pages/live`, `bulk_ranks/live`, `bulk_referring_domains/live`, `domain_intersection/live` (`intersection_mode: "partial"`), `business_data/google/my_business_info/live`, `serp/google/organic/live/regular`.
- Failed: `timeseries_new_lost_summary/live` rejected `date_from` ("Invalid Field"). Check the docs for the right parameter before the next monthly run.
- Spam filter used: `backlinks_spam_score >= 30` marked 194 of 213 referring domains as spam.
- Credentials in this repo's `.env` are `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`; `scripts/dfs.py` accepts either name.
