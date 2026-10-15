# NovaReach site

Personal marketing site for Michael Sowden (NovaReach), Christchurch NZ. Plain static HTML on GitHub Pages: pushing to `main` publishes to novareachmarketing.com. There's no framework or package manager, and `.nojekyll` turns off GitHub's Jekyll processing, so files are served exactly as committed. Don't delete it: without it, any `{{` in the repo breaks the deploy. The only tooling is Python 3 standard library scripts.

## Writing anything for the site

Follow `docs/voice-guide.md` and run `python3 scripts/check_copy.py <file>` (or `--text "..."`) until it reports 0 errors.

## Blog

- `data/posts.json` is the source of truth for the post list.
- `python3 scripts/build.py` regenerates the blog index cards and filter tags (`blog.html`), the homepage "latest writing" card and Writing section (`index.html`, between the `<!-- LATEST -->` and `<!-- WRITING -->` markers), `sitemap.xml`, and any post that has a `content/<slug>.html` source (rendered through `templates/post.html`).
- Don't hand-edit anything between the build markers. Edit `data/posts.json` and rebuild.
- Older posts in `blog-posts/` without a `content/` source are hand-built pages and are left as they are.
- To publish a new post, follow `docs/weekly-post.md`.

## Homepage

`index.html` keeps its styles inline in `<style>`. The services picker uses `.leaks .leak` and the hero funnel uses `.f-row.leak`, so keep selectors scoped to avoid clashes.
