# Personal Website

This repository contains source templates in the `src` folder and the generated static HTML files at the repository root.

## Building

Run `python3 build.py` to regenerate the HTML pages after modifying anything in `src/`. The script combines the header and footer templates with each page's content.

## Viewing

The generated `.html` files are written to the repository root when you run
`python3 build.py`. You can open any page directly in a browser by
double-clicking the file. Alternatively, start a simple local server and browse
to `http://localhost:8000/`:

```sh
python3 -m http.server
```

After making changes to templates or pages, run `python3 build.py` again to
regenerate the site.
