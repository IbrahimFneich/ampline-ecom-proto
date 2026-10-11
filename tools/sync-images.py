#!/usr/bin/env python3
"""Point every catalog image path at the file that exists in assets/products/ (jpg or png), cap each
image at 1400 px on its long side with sips, and print what is covered. Run after adding or replacing images."""
import json, os, subprocess, glob
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(root, 'content', 'products.json')
data = json.load(open(path))
have = {os.path.splitext(os.path.basename(f))[0]: os.path.relpath(f, root) for f in glob.glob(os.path.join(root, 'assets', 'products', '*.*')) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))}
covered, missing = [], []
for p in data['products']:
    files = []
    for n in range(1, 6):
        key = p['slug'] + '-' + str(n)
        if key in have:
            f = have[key]
            out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', os.path.join(root, f)], capture_output=True, text=True).stdout
            dims = [int(l.split(':')[1]) for l in out.splitlines() if l.strip().startswith('pixel')]  # the path line may itself contain 'pixel'
            if dims and max(dims) > 1400:
                subprocess.run(['sips', '-Z', '1400', os.path.join(root, f)], capture_output=True)
            files.append(f)
    if files:
        p['images'] = files
        covered.append(p['id'])
    else:
        p['images'] = []  # nothing on disk: no request is made, the drawing stands; drop <slug>-1.jpg|png in and rerun
        missing.append(p['id'])
data['_meta']['images_note'] = 'assets/products/<slug>-<n>.jpg|png; every path listed here exists on disk (tools/sync-images.py), a product with no file lists none and draws line art'
json.dump(data, open(path, 'w'), indent=2, ensure_ascii=False); open(path, 'a').write('\n')
print('images on disk for', len(covered), 'products; none for', len(missing), ':', ' '.join(missing))
