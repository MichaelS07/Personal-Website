import os
import re

def minify_css(text: str) -> str:
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s*([{}:;,])\s*', r'\1', text)
    text = re.sub(r';}', '}', text)
    return text.strip()


def minify_js(text: str) -> str:
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    text = re.sub(r'//.*', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

TEMPLATE_DIR = os.path.join('src', 'templates')
PAGES_DIR = os.path.join('src', 'pages')
OUTPUT_DIR = '.'

with open(os.path.join(TEMPLATE_DIR, 'header.html')) as f:
    header_template = f.read()
with open(os.path.join(TEMPLATE_DIR, 'footer.html')) as f:
    footer_template = f.read()

title_re = re.compile(r'<!--title:\s*(.*?)-->')

for filename in os.listdir(PAGES_DIR):
    if not filename.endswith('.html'):
        continue
    path = os.path.join(PAGES_DIR, filename)
    with open(path) as f:
        content = f.read()

    m = title_re.match(content)
    title = m.group(1).strip() if m else 'E-commerce Consultant'
    if m:
        content = content[m.end():].lstrip('\n')

    page = header_template.replace('{{title}}', title) + '\n' + content + '\n' + footer_template
    with open(os.path.join(OUTPUT_DIR, filename), 'w') as out:
        out.write(page)

# Minify assets
css_path = os.path.join('css', 'styles.css')
with open(css_path) as f:
    css_min = minify_css(f.read())
with open(os.path.join('css', 'styles.min.css'), 'w') as f:
    f.write(css_min)

js_path = os.path.join('js', 'main.js')
with open(js_path) as f:
    js_min = minify_js(f.read())
with open(os.path.join('js', 'main.min.js'), 'w') as f:
    f.write(js_min)

print('Built pages:', ', '.join([f for f in os.listdir(PAGES_DIR) if f.endswith('.html')]))
