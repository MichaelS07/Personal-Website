# Weekly post playbook

This is the process the Monday scheduled task follows to publish one blog post. A human can follow it too.

The site is plain HTML on GitHub Pages. Pushing to `main` publishes it. Never edit `blog.html` cards, the homepage Writing section or `sitemap.xml` by hand. `scripts/build.py` generates them from `data/posts.json`.

## 1. Pick the topic

1. Read `data/posts.json` to see what's been covered recently. Don't repeat a topic from the last 8 weeks, and don't use the same `category` two weeks running if there's a good alternative.
2. Search for what changed in the last 7–10 days that matters to **NZ and AU ecommerce stores**:
   Google Ads (Search, Performance Max, Shopping, AI Max, bidding), Google Search and core updates, Search Console, GA4 and Tag Manager, Meta Ads, Klaviyo, Shopify checkout and apps.
3. Prefer a change the reader can act on this week. Check the date: if it's a seasonal window (e.g. Q4 prep in Sep–Oct, BFCM in Nov, January sales, EOFY in June for AU), a timely practical post beats a minor product announcement.
4. Confirm every factual claim against a primary source (Google Ads Help, Google Ads & Commerce Blog, Search Central, Meta for Business, Klaviyo docs, Shopify changelog). Link the sources in the post. If you can't verify something, leave it out.

## 2. Write the post

Create `content/<slug>.html`. The slug is lowercase words joined with hyphens, ideally with the month and year (e.g. `pmax-brand-exclusions-november-2026`).

Use plain HTML only: `<p> <h2> <h3> <ul> <ol> <li> <strong> <em> <a> <blockquote>`. No classes, no `<h1>`, no images (the build adds the title, banner and CTA box).

Shape:

- 2–3 short opening paragraphs. Say what changed, who it affects and what's at stake for the reader's store.
- 3–5 `<h2>` sections. Include the specific settings, menu paths, dates and numbers.
- A "What to do this week" `<ol>` checklist near the end.
- A closing paragraph with one link to `https://novareachmarketing.com/#contact` (e.g. "If you want a second set of eyes on…, send me the store.").
- A short "Sources" paragraph or list linking the primary sources.
- 700–1,100 words.

Follow `docs/voice-guide.md`. First person, NZ English, an opinion, no em dashes, no reframes.

## 3. Make the thumbnail

Create `images/blog/<slug>.svg`: a 1200×800 SVG in the house style. Open `images/blog/klaviyo-bfcm-flows-october-before-peak.svg` and copy its approach: a soft emerald-to-slate background, a white rounded board with a drop shadow, simple diagram shapes in the emerald palette (#059669, #10b981, #34d399, #065f46) and slate text (#0f172a, #475569). Show the idea of the post as a simple diagram, with at most one short label line. Give the root `<svg>` a descriptive `aria-label`. Keep it under 15 KB and use no external fonts or images.

## 4. Add it to the manifest

Add an entry at the top of `data/posts.json`:

```json
{
  "slug": "<slug>",
  "title": "Title in Title Case, no em dash",
  "date": "YYYY-MM-DD",
  "category": "Paid Media | SEO | Lifecycle | CRO | Career",
  "tags": ["SEM"],
  "excerpt": "One or two sentences, under 170 characters. Used for the blog card and the meta description.",
  "image": "images/blog/<slug>.svg",
  "image_alt": "What the thumbnail shows",
  "cta_headline": "One line restating the main action",
  "cta_text": "What to send and what you'll reply with, e.g. 'Send the store URL. I'll reply within one business day (Christchurch time) with the three things I'd check first.'"
}
```

`date` is the publish date in NZ time. `tags` must come from: SEO, SEM, Meta, Email, CRO, E-commerce, Shopify, Career.

## 5. Check and build

```bash
python3 scripts/check_copy.py content/<slug>.html
python3 scripts/check_copy.py --text "<title>"
python3 scripts/check_copy.py --text "<excerpt>"
python3 scripts/check_copy.py --text "<cta_headline> <cta_text>"
python3 scripts/build.py
python3 scripts/build.py --check
```

Fix and re-run until the checker shows **0 errors**. Read the warnings and fix any that are real. Then re-read the whole post once against `docs/voice-guide.md` for the patterns the checker can't see (forced threes, "from X to Y", identical list items, hedging).

Open `blog-posts/<slug>.html` and confirm it has the title, date, banner, body and CTA, with no `{{` placeholders left.

## 6. Publish

1. Start from the latest `main`: `git fetch origin main && git checkout -B weekly-post/<slug> origin/main`.
2. Commit only the new and changed files: `content/<slug>.html`, `blog-posts/<slug>.html`, `images/blog/<slug>.svg`, `data/posts.json`, `blog.html`, `index.html`, `sitemap.xml`.
3. Push the branch, open a pull request into `main` titled `Weekly post: <title>`, then squash-merge it.
4. If anything fails (the checker, the build, the push, the merge), don't merge. Leave the PR open (or the branch pushed) and say exactly what failed in the final message.

## 7. Report

End with a short summary: the title, the live URL (`https://novareachmarketing.com/blog-posts/<slug>.html`), the topic in one sentence, and the sources used. Note anything the reader should double-check.
