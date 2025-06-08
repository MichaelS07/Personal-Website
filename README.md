# Personal Website

This repository contains source templates in the `src` folder and the generated static HTML files at the repository root.

## Building

Run `python3 build.py` to regenerate the HTML pages after modifying anything in `src/`. The script combines the header and footer templates with each page's content.

## Viewing

**Always open the HTML files from the repository root** (e.g., `index.html`, `services.html`). The documents inside `src/pages/` are only snippets used by the build script; if you open them directly, they will appear unstyled.
