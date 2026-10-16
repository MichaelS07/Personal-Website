---
format: 1920x1080
duration: 10m
message: "Rising CPC is a symptom, not a diagnosis: find which of six causes is driving it, then fix that one thing."
arc: Hook → Promise → Reframe → Mechanism → 6 Causes (symptom · where to check · fix) → Checklist → CTA
audience: Business owners and junior PPC managers running their own Google Ads accounts
mode: collaborative
---

Shared frame template for the cause scenes (5–10): a top-left chip
`CAUSE 0N / 06`, the cause title in Space Grotesk, a mock Google Ads panel as the
focal element, and a mono "WHERE TO CHECK" breadcrumb pinned bottom-left
(e.g. `Insights & reports › Auction insights`). Each cause scene runs three beats
synced to the VO: symptom → where to check (UI panel + highlight) → fix (fix card
slides in on the right). Captions sit on a rail at the bottom of every frame.

## Frame 1: Hook (0-29s)

- act: Hook
- status: outline
- src: compositions/frames/01-hook.html
- duration: 29s
- poster: 14
- transition_in: cut
- blueprint: dataviz-countup
- scene: Mock Google Ads overview card; Avg. CPC counts $2.10 → $2.95, a rose +40% badge stamps on, the line chart climbs. Closes on "It's a symptom."
- voiceover: "Your cost per click was two dollars ten last month. This month it's two ninety-five..."

Cold open on the number every advertiser dreads. The hero metric is the CPC tile;
the second focal point is the rising trend line. Last beat: kinetic type
"Not the problem. A symptom."

## Frame 2: The plan (29-57s)

- act: Hook
- status: outline
- src: compositions/frames/02-plan.html
- duration: 28s
- poster: 20
- transition_in: crossfade
- blueprint: spatial-pan-stations
- scene: A four-station road map lights up in turn: 1 Is it a problem? → 2 How CPC is set → 3 Six causes → 4 15-min checklist.
- voiceover: "Here's the plan. First, we check whether it's even a problem..."

The value claim lands here: you'll leave with a repeatable diagnosis.

## Frame 3: Is it actually a problem? (57-111s)

- act: Reframe
- status: outline
- src: compositions/frames/03-problem.html
- duration: 54s
- poster: 40
- transition_in: crossfade
- blueprint: comparison-split
- scene: Three metric tiles: Avg. CPC $2.10→$2.95 (rose, up), Conv. rate 4%→6% (emerald, up), CPA $52.50→$49.17 (emerald, down). A verdict bar: "Check CPA & ROAS first."
- voiceover: "Step one. Before you touch anything, look past CPC..."

Reframes the panic: CPC alone says nothing about profit.

## Frame 4: How CPC is actually set (111-174s)

- act: Mechanism
- status: outline
- src: compositions/frames/04-formula.html
- duration: 63s
- poster: 45
- transition_in: crossfade
- blueprint: dataviz-countup (rules: bar build + formula assemble)
- scene: Auction ladder of three advertisers (Bid × QS = Ad Rank bars), then the formula assembles: Actual CPC = Ad Rank below ÷ Your QS + $0.01. Three lever tags light up: Competition, Quality Score, Your bidding.
- voiceover: "Every time someone searches, Google runs an auction..."

The mental model the whole video hangs on. The three lever tags return as
colour-coded labels on every cause scene.

## Frame 5: Cause 1, more competition (174-234s)

- act: Six causes
- status: outline
- src: compositions/frames/05-competition.html
- duration: 60s
- poster: 30
- transition_in: crossfade
- blueprint: cursor-ui-demo
- lever: Competition
- scene: Mock Auction insights table; a new competitor row slides in, overlap rate 20% → 60% flagged rose. Fix card: improve QS, win by segment, protect brand.
- voiceover: "Cause number one. More competition..."

## Frame 6: Cause 2, Quality Score dropped (234-296s)

- act: Six causes
- status: outline
- src: compositions/frames/06-quality-score.html
- duration: 62s
- poster: 30
- transition_in: crossfade
- blueprint: cursor-ui-demo
- lever: Quality Score
- scene: Keywords table with QS, Exp. CTR, Ad relevance, Landing page columns; "Below average" chips flash rose. Three fix rows map each component to its fix.
- voiceover: "Cause number two. Your Quality Score dropped..."

## Frame 7: Cause 3, your own bidding (296-353s)

- act: Six causes
- status: outline
- src: compositions/frames/07-bidding.html
- duration: 57s
- poster: 30
- transition_in: crossfade
- blueprint: cursor-ui-demo
- lever: Your bidding
- scene: Change history feed; three entries highlight in turn (budget +50% on Max conversions, tCPA $40→$60, switch to Target impression share). Bid strategy status pill reads "Learning". Fix card: small 15–20% steps.
- voiceover: "Cause number three. Your own bidding..."

## Frame 8: Cause 4, broad match drift (353-403s)

- act: Six causes
- status: outline
- src: compositions/frames/08-search-terms.html
- duration: 50s
- poster: 25
- transition_in: crossfade
- blueprint: cursor-ui-demo
- lever: Competition + Your bidding
- scene: Keyword "running shoes" (broad) fans out into a search terms list sorted by cost; "nike pegasus 41 sale" and others flag rose; one row gets "Add as negative".
- voiceover: "Cause number four. Your keywords are matching expensive searches..."

## Frame 9: Cause 5, seasonality (403-441s)

- act: Six causes
- status: outline
- src: compositions/frames/09-seasonality.html
- duration: 38s
- poster: 22
- transition_in: crossfade
- blueprint: dataviz-countup
- lever: Competition
- scene: Two-year CPC line chart; both Novembers spike +30%. Compare toggle "vs same period last year". Fix card: plan, shift budget to margin, judge on ROAS.
- voiceover: "Cause number five. Seasonality..."

## Frame 10: Cause 6, broken conversion tracking (441-493s)

- act: Six causes
- status: outline
- src: compositions/frames/10-tracking.html
- duration: 52s
- poster: 35
- transition_in: crossfade
- blueprint: comparison-split
- lever: Your bidding
- scene: A purchase tag fires twice (two pulses); split panel Google Ads "40 purchases" vs Shopify "20 orders", the mismatch flagged. Fix card: fix tag, dedupe, primary = real outcomes.
- voiceover: "Cause number six. And this one catches a lot of people..."

## Frame 11: The 15-minute checklist (493-534s)

- act: Checklist
- status: outline
- src: compositions/frames/11-checklist.html
- duration: 41s
- poster: 38
- transition_in: crossfade
- blueprint: agent-progress-theater
- scene: A 15-minute timer rail; eight checklist rows tick in order with their minute ranges. Designed to be screenshot-able.
- voiceover: "So, next time your CPC jumps, run this checklist..."

## Frame 12: Recap and outro (534-560s)

- act: Close
- status: outline
- src: compositions/frames/12-outro.html
- duration: 26s
- poster: 18
- transition_in: crossfade
- blueprint: logo-assemble-lockup
- scene: The three levers recap, then NovaReach logo lockup, "Next week: Performance Max", Subscribe button.
- voiceover: "Remember: CPC is a symptom..."
