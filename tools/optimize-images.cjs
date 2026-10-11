#!/usr/bin/env node
/* Re-encode every image in assets/products as WebP: trim the empty margin (transparent or near-white),
   pad 3%, cap the long side at 1000 px, quality 0.84, and delete the source. Needs Node 20 and the
   Playwright module (Chrome does the encoding). Run tools/sync-images.py afterwards.
   Usage: node tools/optimize-images.cjs [dir] */
const fs = require('fs'), path = require('path');
const { chromium } = require('/Users/ibrahimfneich/.nvm/versions/node/v16.20.2/lib/node_modules/playwright');
const DIR = path.resolve(process.argv[2] || path.join(__dirname, '..', 'assets', 'products'));
(async () => {
  const files = fs.readdirSync(DIR).filter(f => /\.(png|jpe?g)$/i.test(f));
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage();
  let before = 0, after = 0;
  for (const f of files) {
    const src = path.join(DIR, f), buf = fs.readFileSync(src); before += buf.length;
    const mime = /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
    const out = await page.evaluate(async ({ dataUrl, isPng }) => {
      const img = new Image(); img.src = dataUrl; await img.decode();
      const w = img.naturalWidth, h = img.naturalHeight;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h).data;
      // background test: transparent for PNG, near-white for JPEG (only when all four corners are near-white)
      const bgAt = i => isPng ? d[i + 3] < 10 : (d[i] > 243 && d[i + 1] > 243 && d[i + 2] > 243);
      const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4];
      const trim = isPng || corners.every(bgAt);
      let x0 = 0, y0 = 0, x1 = w - 1, y1 = h - 1;
      if (trim) {
        x0 = w; y0 = h; x1 = -1; y1 = -1;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (!bgAt(i)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
        if (x1 < 0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
      }
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, pad = Math.round(Math.max(bw, bh) * 0.03);
      const sx = Math.max(0, x0 - pad), sy = Math.max(0, y0 - pad), sw = Math.min(w, x1 + pad + 1) - sx, sh = Math.min(h, y1 + pad + 1) - sy;
      const k = Math.min(1, 1000 / Math.max(sw, sh)), ow = Math.round(sw * k), oh = Math.round(sh * k);
      const o = document.createElement('canvas'); o.width = ow; o.height = oh;
      const octx = o.getContext('2d'); octx.imageSmoothingQuality = 'high';
      if (!isPng) { octx.fillStyle = '#fff'; octx.fillRect(0, 0, ow, oh); }
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, ow, oh);
      return { data: o.toDataURL('image/webp', 0.84), ow, oh, trimmed: trim && (bw < w || bh < h) };
    }, { dataUrl: 'data:' + mime + ';base64,' + buf.toString('base64'), isPng: mime === 'image/png' });
    const webp = Buffer.from(out.data.split(',')[1], 'base64');
    const dest = src.replace(/\.(png|jpe?g)$/i, '.webp');
    fs.writeFileSync(dest, webp); fs.unlinkSync(src); after += webp.length;
    console.log(path.basename(dest).padEnd(48), String(out.ow + 'x' + out.oh).padStart(9), String(Math.round(buf.length / 1024) + 'K').padStart(7), '->', String(Math.round(webp.length / 1024) + 'K').padStart(5), out.trimmed ? 'trimmed' : '');
  }
  await browser.close();
  console.log('total', Math.round(before / 1024 / 1024 * 10) / 10 + ' MB ->', Math.round(after / 1024 / 1024 * 10) / 10 + ' MB over', files.length, 'files');
})().catch(e => { console.error(e); process.exit(1); });
