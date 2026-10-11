#!/usr/bin/env python3
"""Write shop/<slug>.html for every category in content/products.json plus shop/all.html,
from tools/shop-template.html. Each page carries only its title, meta description, data-category,
breadcrumb text, h1 and blurb fallback; shop.js renders the rest. Run again when categories change."""
import html, json, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(root, 'content', 'products.json')))
template = open(os.path.join(root, 'tools', 'shop-template.html')).read()
os.makedirs(os.path.join(root, 'shop'), exist_ok=True)
pages = [('all', 'All products', 'Search by name, brand or spec, or start from what you own',
          'Every Ampline product: phones, laptops, tablets, audio, wearables, gaming, networking, smart home, accessories and power, searchable by name, brand and spec.')]
for c in data['categories']:
    pages.append((c['slug'], c['name'], c['blurb'], c['name'] + ': ' + c['blurb'] + '. Filter by ' + ', '.join(f.lower() for f in c['facets']) + '.'))
for slug, name, blurb, desc in pages:
    page = (template.replace('{{SLUG}}', slug).replace('{{NAME}}', html.escape(name))
            .replace('{{BLURB}}', html.escape(blurb) + '.')
            .replace('{{DESCRIPTION}}', html.escape(desc, quote=True)))
    open(os.path.join(root, 'shop', slug + '.html'), 'w').write(page)
    print('wrote shop/' + slug + '.html')
