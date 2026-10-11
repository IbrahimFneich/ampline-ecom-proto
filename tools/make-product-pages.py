#!/usr/bin/env python3
"""Write product/<slug>.html for every SKU in content/products.json from tools/product-template.html.
Each page carries only its title, meta description, data-slug, breadcrumb text and h1 fallback;
product.js renders everything else from the catalog. Run again whenever the catalog changes."""
import html, json, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(root, 'content', 'products.json')))
cats = {c['slug']: c['name'] for c in data['categories']}
template = open(os.path.join(root, 'tools', 'product-template.html')).read()
os.makedirs(os.path.join(root, 'product'), exist_ok=True)
for p in data['products']:
    first = p['short'].split('. ')[0].rstrip('.')
    specs = ', '.join(s['label'] + ' ' + s['value'] for s in p['specs'][:2])
    page = (template.replace('{{NAME}}', html.escape(p['name']))
            .replace('{{DESCRIPTION}}', html.escape(first + '. ' + specs + '.', quote=True))
            .replace('{{SLUG}}', p['slug'])
            .replace('{{CATEGORY}}', html.escape(cats[p['category']])))
    open(os.path.join(root, 'product', p['slug'] + '.html'), 'w').write(page)
    print('wrote product/' + p['slug'] + '.html')
