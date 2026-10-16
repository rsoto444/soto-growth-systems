---
description: One publish-ready blog post - duplicate the template page, research, write in voice
argument-hint: "[keyword, optional - pulls next from keyword-map.md]"
---

**THE VOICE (Soto Growth Systems): straight, clear, warm, direct, coach-like.** This is the recorded voice in `CLAUDE.md` > "My setup" > "Voice", and the template's humour rule is OFF for this site. Concise, professional but not corporate. No jokes, no stage directions, no gimmicks, no forced personality, no joke quota. Plain words a busy owner understands on the first read; specific beats clever. No em dashes. No income or results promises, no fake proof, no pressure, no fake urgency. Before writing, read two of Rich's live pages (for example `/about-rich/` and one service page) and match their tone. Straight zones stay straight and liftable: the quick answer, FAQ answers, tables, prices, proof numbers, the CTA line.

**Read first:** `references/blog-post-retention.md` (the 41 retention rules - subhead every 150-300 words, answer in the first 40-50 words, the mid-text CTA does 47-93% of the work), the voice rule above (quick answers and FAQ stay direct - AI lifts those verbatim), and **`references/hub-spoke-pages.md` when the map row is a pillar or a spoke** - a pillar is a short router with an H2 section per spoke (passage + link inside it, section in the TOC) and it grows a section the same day any new spoke ships; a spoke takes one subtopic deep, never the pillar's head term, and references its pillar by name early.

**⛔ Before writing: check the post does not already exist.** No argument = the next unwritten `## N. Blog post:` row in `keyword-map.md`, lowest N. **But the map row is hand-maintained and drifts - `website/lib/blog-posts.ts` is the authority.** If an entry with that slug is already in `blogPosts`, skip it, move the row to `# Written`, say so in one line, and take the next row instead. Never overwrite an existing post: it may have been hand-edited, optimized, linked or already live, and a rebuild silently destroys all of it. All rows written? Say so and point at `/keyword-research expand`.

## Which keyword

Never ask. The ladder, top to bottom, no stopping:

1. Next unwritten `## N. Blog post:` row in `keyword-map.md`, lowest N, skipping anything in `website-index.md` or already in `lib/blog-posts.ts`
2. Map empty of blog rows? Best "saved for later" keyword under difficulty 40
3. Everything taken? A fresh long-tail variant of the closest cluster

State the pick in one line and build. The ONLY stop: a keyword I typed is already written - show me it, ask update-or-new.

## ⛔ A post is one entry in `website/lib/blog-posts.ts`

There is no page file to copy. Append ONE object to the `blogPosts` array, never edit or remove another:

```ts
{ slug: "what-a-business-management-consultant-does", title: "...", description: "...", date: "YYYY-MM-DD",
  readMinutes: 8, draft: true, html: `...` }
```

- **`draft: true` always.** `/publish` flips it. A draft exists only on localhost and Vercel preview deployments; on the live site it has no page, is not in the blog list, and is not in the sitemap.
- **`slug`**: the keyword-map row's title, slugified (lowercase, hyphens), e.g. the row `## 8. Blog post: What a business management consultant does` is `what-a-business-management-consultant-does`. The page lives at `/blog/<slug>/`. Keep it exact: the site-completeness checks find a written row by this slug.
- **`html` is the article body only.** Do NOT write the H1, the date, the breadcrumb, the author box or any schema: the page adds all of them (title as the H1, BlogPosting + breadcrumb schema with Rich as author, a Rich Soto author box).
- **Classes the page already styles:** `sgsx-quick-answer` (wrap the 40-60 word quick answer), `sgsx-cta` (the bridge CTA block), plus plain `h2`/`h3`, `ul`/`ol`, `table`, `blockquote` and `figure`. Put `id` attributes on H2s and link to them from the "On this page" list. Images go in `/website/public/images/` and are referenced as `/images/...`.
- **One post per run.** Edit only words, images, metadata. Never restyle the page.

## The work

1. **Spec:** top 3 organic results - word count, H2 outline, tables, FAQs. Target = their average ±20%, plus THE GAPS.
2. **Research, 50+ sources:** parallel sub-agents across ranking articles, YouTube transcripts, Reddit, studies, expert quotes - and MY numbers - ask me for real results, reviews and credentials before writing, and use only what I give you. Original data is the citation lever. **`references/examples/research-dossier-example.md` is what the gathered material should look like before you write a word** - match its shape, never its content. WordPress lane: `references/examples/wordpress-blog-example.md` is the finished post.
3. **Buyer:** name the ONE person this post is for in a sentence - who they are, what they fear, what they typed into Google - and write to them.
4. **Write INTO `references/blog-post-template.md`'s skeleton** - quick answer → proof line → main table → cluster H2s → field section → FAQ → bridge CTA → author box. Write it STRAIGHT and correct first. Never a disclaimer about proof you don't have - write from what IS true.
5. **The voice pass - a separate, full pass.** Read the draft line by line against the voice above: straight, clear, warm, direct, coach-like. A busy owner should understand every sentence the first time. This is a line-by-line edit, not a find-and-replace.
   - **Sweep BOTTOM-UP: last section first, intro last.** Drafts fatigue: the writing copies its own recent output, so the back half goes generic and padded. Working from the end gives the tired sections the freshest attention.
   - **The floor: every H2 opens with its direct answer in the first sentence,** then one concrete example, number or real story Rich supplied. A section with no concrete detail is not done.
   - **The density check:** no paragraph over four sentences, no sentence over about 25 words, no filler openers ("In today's fast-paced world"), no hype words, no stacked adjectives. Cut anything that does not help the owner decide or act.
   - **Every stat carries a live external link to its source.** An attribution with no link ("per industry data", "Semrush-cited") is not a citation. If the source can't be found and linked, the stat doesn't ship - swap it for one that verifies. Degrade, never decorate.
6. **Images:** hero + one visual per ~350 words. Ladder: real → `node code/fetch_stock_photos.mjs "[query]" --count 8` (overfetch: pool 2-3x the slots, pick the best per slot, never a photo already used on the site) → none. Look at each. **People photos go where people belong:** body images show the work, the tools, the result - not stock faces. A face appears only in the author box (the real author) or beside a real quoted person, never as decoration.
7. **On-page while writing:** `references/on-page-seo.md`; 2-3 title/meta variants per `references/meta-info.md`.

## Gates, then register

Both gates need the site running: `cd website && npm run dev` (drafts show locally). They are Node scripts, so there is nothing else to install.

```
node code/check_page_rhythm.mjs /blog/[slug]/
node code/check_page_done.mjs /blog/[slug]/
```

**The loop rule: the gate decides when you're done, not you.** Run the gate → fix every failure → run it again. Repeat until it passes. Do not report progress instead of finishing, do not ask permission to keep fixing, do not stop because a fix is tedious (37 routes to build means 37 routes get built), and never present a failing site with an explanation attached. The ONLY reasons to stop early: you need a value only I have (a key, a webhook, a photo), or a real decision is mine to make. Everything else, you finish.

Fix and re-run until both pass - never show a failing draft with an explanation, and never declare a score. Then screenshot at 1440px and 390px and LOOK at both - no horizontal overflow, no table spilling off a phone screen, images scaling intact. Then: save as draft, verify every internal link target exists, append to `website-index.md`, MOVE the whole map row into `# Written` in `keyword-map.md`, keeping its number - never add a `Status:` field. **Publishing a Soto post is a separate, approved step, never part of this command.** When I say a draft is approved: (1) set `draft: false` and the final `date`; (2) re-run both gates against `npm run dev`; (3) `git add website/lib/blog-posts.ts website/public/images keyword-map.md website-index.md`, commit, and push to `main` ONLY after I say "publish" (Vercel then deploys the live site); (4) once the deploy is Ready, run `node code/check_page_done.mjs /blog/[slug]/ --base https://sotogrowthsystems.com` and `curl` the page to confirm it is live, indexable (no `noindex`), and in `/sitemap.xml`. The first published post also turns on the Blog menu link and the blog index. `/publish` is not used for Soto: its site gate is written for a `/services` structure this site does not have.


**The `/blog` index builds itself** from `lib/blog-posts.ts` (newest first, published posts only on the live site), so there is no index entry to add. The "Blog" menu link and the sitemap entries appear on their own once the first post is published.
