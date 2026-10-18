#!/usr/bin/env python3
"""Build the blog from data/posts.json.

What it does:
  1. Renders any post that has a content file (content/<slug>.html) into
     blog-posts/<slug>.html using templates/post.html.
     Posts without a content file are older hand-built pages and are left as they are.
  2. Rebuilds the post cards and filter tags in blog.html.
  3. Rebuilds the homepage "latest writing" card and Writing section in index.html.
  4. Writes sitemap.xml.

Usage:
  python3 scripts/build.py           # build
  python3 scripts/build.py --check   # fail if anything is missing or out of date
"""
import html
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://novareachmarketing.com"
REQUIRED = ["slug", "title", "date", "category", "tags", "excerpt", "image"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"]
TAG_ORDER = ["SEO", "SEM", "Meta", "Email", "CRO", "E-commerce", "Shopify", "Career"]

# Tailwind classes applied to plain HTML in content/<slug>.html, matching the existing posts
CLASSES = {
    "p": "text-base sm:text-lg text-slate-700 leading-relaxed mb-6",
    "h2": "text-2xl font-bold text-slate-900 mt-10 mb-4",
    "h3": "text-xl font-semibold text-slate-900 mt-8 mb-3",
    "ul": "list-disc pl-6 mb-6 text-base sm:text-lg text-slate-700 space-y-2",
    "ol": "list-decimal pl-6 mb-6 text-base sm:text-lg text-slate-700 space-y-2",
    "a": "text-emerald-600 hover:underline",
    "strong": "font-semibold text-slate-900",
    "blockquote": "border-l-4 border-emerald-500 pl-4 italic text-slate-700 mb-6",
}

errors = []


def esc(s):
    return html.escape(s, quote=True)


def d(post):
    return date.fromisoformat(post["date"])


def short_date(post, year=True):
    x = d(post)
    return f"{x.day} {MONTHS[x.month - 1]}" + (f" {x.year}" if year else "")


def long_date(post):
    x = d(post)
    return f"{MONTHS_LONG[x.month - 1]} {x.day}, {x.year}"


def load():
    data = json.loads((ROOT / "data/posts.json").read_text())
    posts = data["posts"]
    seen = set()
    for p in posts:
        for k in REQUIRED:
            if not p.get(k):
                errors.append(f"{p.get('slug', '?')}: missing '{k}'")
        if p["slug"] in seen:
            errors.append(f"duplicate slug {p['slug']}")
        seen.add(p["slug"])
        try:
            d(p)
        except ValueError:
            errors.append(f"{p['slug']}: date must be YYYY-MM-DD")
        if not (ROOT / p["image"]).exists():
            errors.append(f"{p['slug']}: image {p['image']} not found")
        has_page = (ROOT / f"blog-posts/{p['slug']}.html").exists()
        has_src = (ROOT / f"content/{p['slug']}.html").exists()
        if not has_page and not has_src:
            errors.append(f"{p['slug']}: no blog-posts/{p['slug']}.html or content/{p['slug']}.html")
        if has_src:
            for k in ["image_alt", "cta_headline", "cta_text"]:
                if not p.get(k):
                    errors.append(f"{p['slug']}: new posts need '{k}'")
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts


def add_classes(body):
    for tag, cls in CLASSES.items():
        body = re.sub(rf"<{tag}(?=[\s>])(?![^>]*\bclass=)", f'<{tag} class="{cls}"', body)
    return body


def og_image(p):
    """Social platforms don't render SVG, so prefer a PNG card in images/og/ when one exists."""
    png = f"images/og/{p['slug']}.png"
    return png if (ROOT / png).exists() else p["image"]


def post_jsonld(p):
    url = f"{SITE}/blog-posts/{p['slug']}.html"
    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": p["title"],
        "description": p["excerpt"],
        "image": f"{SITE}/{og_image(p)}",
        "datePublished": p["date"],
        "dateModified": p.get("updated", p["date"]),
        "url": url,
        "mainEntityOfPage": url,
        "keywords": ", ".join(p["tags"]),
        "inLanguage": "en-NZ",
        "author": {"@type": "Person", "@id": f"{SITE}/#michael", "name": "Michael Sowden", "url": f"{SITE}/#about"},
        "publisher": {"@type": "Organization", "@id": f"{SITE}/#business", "name": "NovaReach",
                      "logo": {"@type": "ImageObject", "url": f"{SITE}/images/novareach-logo.png"}},
    }
    # Escape "<" so a title can never close the script tag early
    return json.dumps(data, ensure_ascii=False, indent=2).replace("<", "\\u003c")


def render_post(p, template):
    body = (ROOT / f"content/{p['slug']}.html").read_text().strip()
    words = len(re.sub(r"<[^>]+>", " ", body).split())
    chips = "".join(
        '<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium '
        f'bg-slate-100 border border-slate-200 text-slate-700">{esc(t)}</span>'
        for t in p["tags"])
    values = {
        "TITLE": esc(p["title"]),
        "DESCRIPTION": esc(p["excerpt"]),
        "SLUG": p["slug"],
        "IMAGE": p["image"],
        "OG_IMAGE": og_image(p),
        "JSONLD": post_jsonld(p),
        "DATE_ISO": p["date"],
        "IMAGE_ALT": esc(p["image_alt"]),
        "TAG_CHIPS": chips,
        "DATE_LONG": long_date(p),
        "CATEGORY": esc(p["category"]),
        "READ_MIN": str(max(2, round(words / 220))),
        "BODY": "      " + add_classes(body).replace("\n", "\n      "),
        "CTA_HEADLINE": esc(p["cta_headline"]),
        "CTA_TEXT": esc(p["cta_text"]),
    }
    out = template
    for k, v in values.items():
        out = out.replace("{{" + k + "}}", v)
    left = re.findall(r"\{\{\w+\}\}", out)
    if left:
        errors.append(f"{p['slug']}: unfilled placeholders {left}")
    return out


def blog_card(p):
    tags = ",".join(p["tags"])
    return (
        f'<article class="post pcard" data-tags="{esc(tags)}"><a href="./blog-posts/{p["slug"]}.html">'
        f'<img class="pc-thumb" src="{p["image"]}" alt="" loading="lazy" />'
        f'<div class="pc-content"><div class="pc-meta">{short_date(p)} · {esc(p["category"])}</div>'
        f'<h2 class="pc-title">{esc(p["title"])}</h2><p class="pc-ex">{esc(p["excerpt"])}</p>'
        f'<div class="pc-foot"><span class="pc-tags">{esc(" · ".join(p["tags"]))}</span>'
        f'<span class="pc-more">Read →</span></div></div></a></article>'
    )


def blog_tags(posts):
    used = {t for p in posts for t in p["tags"]}
    tags = [t for t in TAG_ORDER if t in used] + sorted(used - set(TAG_ORDER))
    btns = '<button data-tag="All" class="tag active">All</button>' + "".join(
        f'<button data-tag="{esc(t)}" class="tag">{esc(t)}</button>' for t in tags)
    return f'<div class="tags">{btns}</div>'


def latest_card(p):
    i = "              "
    return (
        f'{i}<div class="lbl">LATEST WRITING</div>\n'
        f'{i}<div class="meta">{esc(p["tags"][0])} · {short_date(p)}</div>\n'
        f'{i}<h3>{esc(p["title"])}</h3>\n'
        f'{i}<p>{esc(p["excerpt"])}</p>\n'
        f'{i}<div class="foot">\n'
        f'{i}  <span>{esc(" · ".join([p["category"], short_date(p, False)] + [t for t in p["tags"] if t != p["category"]]))}</span>\n'
        f'{i}  <a href="blog-posts/{p["slug"]}.html">Read →</a>\n'
        f'{i}</div>\n'
    )


def writing_section(posts):
    f, rest = posts[0], posts[1:3]
    i = "        "
    out = (
        f'{i}<a class="feat-post" href="blog-posts/{f["slug"]}.html">\n'
        f'{i}  <img class="feat-thumb" src="{f["image"]}" alt="" loading="lazy" />\n'
        f'{i}  <div class="meta">{esc(" · ".join(f["tags"]))} · {short_date(f)} · Latest</div>\n'
        f'{i}  <h3>{esc(f["title"])}</h3>\n'
        f'{i}  <p>{esc(f["excerpt"])}</p>\n'
        f'{i}  <span class="more">Read post →</span>\n'
        f'{i}</a>\n'
        f'{i}<div class="post-list">\n'
    )
    for p in rest:
        out += (
            f'{i}  <a class="post-row" href="blog-posts/{p["slug"]}.html">\n'
            f'{i}    <img class="pr-thumb" src="{p["image"]}" alt="" loading="lazy" />\n'
            f'{i}    <div>\n'
            f'{i}      <div class="meta">{esc(p["tags"][0])} · {short_date(p)}</div>\n'
            f'{i}      <h4>{esc(p["title"])}</h4>\n'
            f'{i}    </div>\n'
            f'{i}  </a>\n'
        )
    out += f'{i}  <a class="post-row post-row-all" href="blog.html">See all writing →</a>\n{i}</div>\n'
    return out


def sitemap(posts):
    urls = [(f"{SITE}/", posts[0]["date"]), (f"{SITE}/blog.html", posts[0]["date"])]
    urls += [(f"{SITE}/blog-posts/{p['slug']}.html", p["date"]) for p in posts]
    body = "".join(f"  <url><loc>{u}</loc><lastmod>{m}</lastmod></url>\n" for u, m in urls)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "</urlset>\n")


def between(text, name, inner, path):
    pat = re.compile(rf"(<!-- {name}:START -->).*?(<!-- {name}:END -->)", re.S)
    if not pat.search(text):
        errors.append(f"{path}: marker {name} not found")
        return text
    return pat.sub(lambda m: m.group(1) + inner + m.group(2), text, count=1)


def main():
    check = "--check" in sys.argv
    posts = load()
    template = (ROOT / "templates/post.html").read_text()
    outputs = {}

    for p in posts:
        if (ROOT / f"content/{p['slug']}.html").exists():
            outputs[f"blog-posts/{p['slug']}.html"] = render_post(p, template)

    blog = (ROOT / "blog.html").read_text()
    blog = between(blog, "TAGS", blog_tags(posts), "blog.html")
    blog = between(blog, "POSTS", "".join(blog_card(p) for p in posts), "blog.html")
    outputs["blog.html"] = blog

    home = (ROOT / "index.html").read_text()
    home = between(home, "LATEST", "\n" + latest_card(posts[0]) + "              ", "index.html")
    home = between(home, "WRITING", "\n" + writing_section(posts) + "        ", "index.html")
    outputs["index.html"] = home
    outputs["sitemap.xml"] = sitemap(posts)

    if errors:
        print("Build failed:\n  " + "\n  ".join(errors))
        sys.exit(1)

    stale = []
    for rel, content in outputs.items():
        path = ROOT / rel
        current = path.read_text() if path.exists() else None
        if current != content:
            stale.append(rel)
            if not check:
                path.write_text(content)
    if check:
        if stale:
            print("Out of date (run python3 scripts/build.py): " + ", ".join(stale))
            sys.exit(1)
        print(f"Up to date. {len(posts)} posts.")
    else:
        print(f"Built {len(posts)} posts. Updated: {', '.join(stale) or 'nothing'}")


if __name__ == "__main__":
    main()
