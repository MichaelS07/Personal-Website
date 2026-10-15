#!/usr/bin/env python3
"""Check writing against docs/anti-ai-language-guide.md.

Checks visible text only (tags, scripts and styles are ignored).
Errors (exit code 1): em dashes, semicolons in prose, banned words and phrases,
"this isn't X, it's Y" reframes, paragraphs over three sentences.
Warnings: missing contractions, very long sentences.

Usage:
  python3 scripts/check_copy.py content/my-post.html [more files...]
  python3 scripts/check_copy.py --text "A title or excerpt to check"
"""
import html
import re
import sys

BANNED_WORDS = """delve delves delving leverage leverages leveraging leveraged utilise utilises utilize utilizes
harness harnessing streamline streamlines streamlined facilitate facilitates empower empowers empowering
elevate elevates elevating embark embarking unleash unleashes bolster bolsters ignite ignites foster fosters
fostering spearhead spearheads underpin underpins underscore underscores resonate resonates surpass surpasses
showcase showcases boast boasts robust seamless seamlessly cutting-edge innovative groundbreaking
transformative comprehensive holistic synergistic multifaceted meticulous meticulously compelling pivotal
game-changing game-changer best-in-class world-class state-of-the-art bespoke granular scalable crucial
intricate unparalleled vibrant commendable tapestry landscape landscapes realm synergy synergies paradigm
interplay underpinnings testament ecosystem cadence bandwidth learnings value-add actionable findings
furthermore moreover additionally ultimately""".split()
# Words that are only banned in their metaphorical sense: flag for a human look
SOFT_WORDS = ["navigate", "navigating", "align", "aligned", "aligning", "pivot", "pivoting", "stakeholders", "potential"]
BANNED_PHRASES = [
    "in today's", "in an era of", "in a world where", "it's no secret", "it goes without saying",
    "it's worth noting", "it is worth noting", "it's important to note", "it is important to note",
    "needless to say", "let's dive", "dive in", "deep dive", "deep-dive", "let's unpack", "let's break this down",
    "without further ado", "picture this", "imagine a world", "that being said", "with that in mind",
    "on the flip side", "by the same token", "in light of this", "at its core", "at the end of the day",
    "in conclusion", "to summarize", "to summarise", "in summary", "the bottom line", "all in all",
    "the key takeaway", "tip of the iceberg", "only time will tell", "the possibilities are endless",
    "watch this space", "exciting times", "game changer", "the future is bright", "unlocking potential",
    "unlock", "the sky's the limit", "next level", "pushing the boundaries", "raising the bar",
    "on a mission to", "passionate about", "pain points", "actionable insights", "thought leadership",
]
REFRAMES = [
    r"\b(?:it|this|that)(?:'s| is) not\b[^.?!]{0,80}[.;,]\s*(?:it|this|that)(?:'s| is)\b",
    r"\b(?:isn't|is not|wasn't|aren't)\b[^.?!]{0,60}\.\s+(?:It|This|That)(?:'s| is)\b",
    r"\bit's not about\b",
    r"\bnot just\b[^.?!]{0,60}\bbut\b",
    r"\bnot only\b[^.?!]{0,60}\bbut\b",
]
UNCONTRACTED = r"\b(do not|does not|did not|cannot|will not|is not|are not|it is|they are|you are|we are|that is|there is)\b(?=\s+\w)"

TAG = re.compile(r"<script\b.*?</script>|<style\b.*?</style>|<[^>]+>", re.S | re.I)


def visible_blocks(raw):
    """Split HTML into text blocks (one per paragraph-ish element)."""
    raw = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", " ", raw, flags=re.S | re.I)
    raw = re.sub(r"</?(?:p|h[1-6]|li|blockquote|div|section|td|th)\b[^>]*>", "\n\n", raw, flags=re.I)
    text = html.unescape(TAG.sub("", raw))
    return [" ".join(b.split()) for b in re.split(r"\n\s*\n", text) if b.strip()]


def check(blocks, label):
    errs, warns = [], []
    for b in blocks:
        low = b.lower()
        snip = b if len(b) < 110 else b[:107] + "..."
        if "—" in b:
            errs.append(f"em dash: {snip}")
        if re.search(r"[A-Za-z0-9)\]\"'”’]; ", b):
            errs.append(f"semicolon: {snip}")
        for w in BANNED_WORDS:
            if re.search(rf"\b{re.escape(w)}\b", low):
                errs.append(f"banned word '{w}': {snip}")
        for w in SOFT_WORDS:
            if re.search(rf"\b{re.escape(w)}\b", low):
                warns.append(f"check '{w}' isn't used as a metaphor: {snip}")
        for ph in BANNED_PHRASES:
            if ph in low:
                errs.append(f"banned phrase '{ph}': {snip}")
        for rx in REFRAMES:
            if re.search(rx, b, re.I):
                errs.append(f"reframe ('not X, it's Y'): {snip}")
                break
        sentences = [s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z0-9“\"‘'])", b) if len(s.split()) > 2]
        if len(sentences) > 3:
            errs.append(f"paragraph has {len(sentences)} sentences (max 3): {snip}")
        for s in sentences:
            if len(s.split()) > 38:
                warns.append(f"long sentence ({len(s.split())} words): {s[:90]}...")
        m = re.search(UNCONTRACTED, b, re.I)
        if m:
            warns.append(f"use a contraction for '{m.group(1)}': {snip}")
    print(f"\n{label}: {len(errs)} error(s), {len(warns)} warning(s)")
    for e in errs:
        print("  ERROR  " + e)
    for w in warns:
        print("  warn   " + w)
    return len(errs)


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(2)
    total = 0
    if args[0] == "--text":
        total += check([" ".join(args[1:])], "text")
    else:
        for f in args:
            total += check(visible_blocks(open(f).read()), f)
    sys.exit(1 if total else 0)


if __name__ == "__main__":
    main()
