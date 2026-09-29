# Audit: sotogrowthsystems.com · Tuesday 29 September 2026 · 15 pages

### [ ] 1. Build the keyword map · no page targets a search buyers make

553 of your 716 Google clicks in 3 months came from people typing "soto growth systems". No page ranks for a buying search yet, so the site only reaches people who already know you. Every fix below helps, but this is the bottleneck.

**Who:** me, with /keyword-research. Needs your DataForSEO login (it lives only on the Provo project's computer) or Semrush API units
**Time:** 30 min
**Changes:** writes keyword-map.md. No site files touched.

### [ ] 2. Rewrite 14 titles and 11 descriptions · 8 descriptions cut off mid-sentence

About Rich (2,188 views, 2% clicked) and Soto Growth OS (2,048 views, 1.2% clicked) show in Google constantly but rarely win the click. "growth leak assessment" sits at position 2 with 0 clicks from 33 searches. Drafts are in the report for your veto.

**Who:** me, in your code
**Time:** 20 min
**Changes:** titles and descriptions only. No body copy touched.

### [ ] 3. Fix the dead link and the lost addresses · Google still sends people to 4 of them

/book-assessment/ got 182 Google views last quarter and now shows "not found". Resources still links to it. /sitemap_index.xml and /feed/ are old WordPress addresses Google still asks for.

**Who:** me, in your code
**Time:** 10 min
**Changes:** one link on Resources, 3 permanent redirects. Nothing removed.

### [ ] 4. Describe your offers to Google · 8 offer pages have no offer schema

Google and AI tools get your business details but not what you sell or the starting price, which WordPress's SEO plugin used to provide.

**Who:** me, in your code
**Time:** 20 min
**Changes:** adds hidden Service schema with your published prices. No visible change.

### [ ] 5. Speed up the homepage · 2.6s to show on a phone (lab), target under 2.5s

The Google Fonts file holds every page for about 0.3 seconds, and the logo is sent at 3 times the size it shows.

**Who:** me, in your code
**Time:** 20 min
**Changes:** fonts served from your site, smaller logo. Same fonts, same look.

### [ ] 6. Make the footer link visible as a link · fails accessibility on every page

"Provo SEO Pros" in the footer is the same colour as the text around it, so it doesn't look clickable.

**Who:** me, in your code
**Time:** 5 min
**Changes:** underlines one footer link. No words changed.

### [ ] 7. Give the Guided Implementation page a clean address · its URL says "draft"

/growth-os-implementation-draft-v2/ looks unfinished to buyers and Google, and its title clashes with /growth-os-implementation/. Suggested: /growth-os-guided-implementation/ with a permanent redirect from the old one.

**Who:** me, in your code, only with your yes
**Time:** 10 min
**Changes:** new address plus a redirect. Needs your approval.

### [ ] 8. Your call: link colour on the dark navy sections · 3.6:1, needs 4.5:1

Blue #2563EB links on navy #0B1220 fail contrast on the offer pages. A lighter blue, #60A5FA, passes at 7.4:1, plus an underline so links still stand out from the grey text. It's your design, so I won't change it without a yes.

**Who:** you decide, I change it
**Time:** 5 min
**Changes:** link colour and underline in the dark sections only.

### [ ] 9. Send me your social profile links · Google can't connect SGS to you anywhere else

Your business schema lists no profiles (LinkedIn, Facebook, YouTube and so on). Paste the SGS and Rich Soto profile links you want connected.

**Who:** you, paste the links here
**Time:** 2 min
**Changes:** none until you send them.

### [ ] 10. Tell me if SGS has a Google Business Profile · the local layer is waiting

If yes, paste Edit profile > About, Edit services and Edit products. If SGS serves clients nationally with no listing, say so and the layer is marked "not a local business".

**Who:** you
**Time:** 2 min
**Changes:** none to the site.

### [ ] 11. Answer the "is it legit" and job searches · people are asking and the site says nothing

Searches like "soto growth systems reviews", "is it legit", "do they pay well" and "setter" land on your site. There are no reviews and no careers information, so Google shows other sites' answers.

**Who:** you decide. Careers and candidate pages are outside this job.
**Time:** a decision
**Changes:** none from this audit.

### [ ] 12. Add proof when you have it · 0 of 5 proof touches on every page

No reviews, results, case studies or photos yet, which is accurate. First real review or client result goes to /seo-optimization proof.

**Who:** you, when it exists
**Time:** later
**Changes:** none until then.

## Waived

- **Lighthouse "errors in the console", every page · crawler artifact.** The errors are this test machine failing its own certificate check on outside scripts (fonts, rank tracker) and a Vercel analytics file that only exists on the live host. Evidence: "net::ERR_CERT_AUTHORITY_INVALID" in the log; the same pages load clean in a normal browser. Re-check next run.

## AI-surface baseline · not run yet

Needs a person to ask ChatGPT, Perplexity and Google AI Mode your money questions. First baseline comes after the keyword map names those questions.

## What this audit did NOT measure · 29 September 2026

- **Semrush Site Health, backlinks, referring domains, authority score:** skipped. Semrush has no API units. Closes by adding units at semrush.com/mcp-access.
- **Competitor benchmark:** skipped. Needs 3 named competitors or a money keyword to find them. Closes after item 1.
- **Keyword checks (8 per page):** graded as not met, because no keyword map exists. Closes with item 1.
- **Speed:** lab data only, mobile, 1 run each on 3 pages (home, Growth OS Blueprint, Contact), local production build. Google has no real-visitor speed data yet ("not enough usage data").
- **Search Console:** measured, but the data is from the old WordPress site (pages last updated 20 September, searches to 27 September).
- **Local and Business Profile:** waiting on item 10.
- **Thin content:** not graded. Needs the top-3 word counts for each page's keyword, which come with item 1.
- **Live AI test:** not run. See the baseline above.
