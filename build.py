import os
import re

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

print('Built pages:', ', '.join([f for f in os.listdir(PAGES_DIR) if f.endswith('.html')]))
