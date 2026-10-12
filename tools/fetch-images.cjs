#!/usr/bin/env node
/* Fetch two more manufacturer product shots for each third-party SKU.
   Node 20 + the Playwright module; Chrome does the fetching and the pixel work.

   Usage:
     node tools/fetch-images.cjs --dry            # status, final URL and candidate count per product
     node tools/fetch-images.cjs [--only <slug>]  # download, filter, stage into the scratchpad

   It never writes into assets/products/ (the optimizer would convert and delete whatever it finds there);
   candidates land in OUT with a candidates.json beside them, for the contact sheet and the eyeball pass.
   House-brand products are skipped by brand, never by trusting the map. */

const fs = require('fs'), path = require('path');
const pw = require('/Users/ibrahimfneich/.nvm/versions/node/v16.20.2/lib/node_modules/playwright');

const ROOT = path.join(__dirname, '..');
const OUT = process.env.FETCH_OUT || path.join(require('os').tmpdir(), 'ampline-fetch');
const DRY = process.argv.includes('--dry');
const ONLY = (process.argv.indexOf('--only') >= 0) ? process.argv[process.argv.indexOf('--only') + 1] : null;
const STRICT = !process.argv.includes('--loose'); // default: drop page chrome and anything without this model's token
const SOURCES = process.argv.includes('--sources'); // rewrite assets/products/SOURCES.md from the ledger
const WANT = 2;            // two more per product, after the existing -1
const MIN_SIDE = 800;      // under this, skip
const GOOD_SIDE = 1000;    // at or above this, preferred
const DUP_DIST = 6;        // Hamming distance on a 64-bit average hash

/* The manufacturer's own product page per SKU. One entry per third-party slug. */
const MAP = {
  // Apple
  'apple-iphone-16-128gb': 'https://www.apple.com/shop/buy-iphone/iphone-16',
  'apple-iphone-15-128gb': 'https://www.apple.com/shop/buy-iphone/iphone-15',
  'apple-macbook-air-13-m3': 'https://www.apple.com/shop/buy-mac/macbook-air/13-inch',
  'apple-macbook-pro-16-m4-pro': 'https://www.apple.com/shop/buy-mac/macbook-pro/16-inch',
  'apple-ipad-10th-gen-64gb': 'https://www.apple.com/shop/buy-ipad/ipad',
  'apple-ipad-air-11-m2-128gb': 'https://www.apple.com/shop/buy-ipad/ipad-air',
  'apple-ipad-pro-11-m4-256gb': 'https://www.apple.com/shop/buy-ipad/ipad-pro',
  'apple-airpods-pro-2-usb-c': 'https://www.apple.com/airpods-pro/',
  'apple-watch-series-10-42mm': 'https://www.apple.com/shop/buy-watch/apple-watch',
  'apple-watch-se-2nd-gen-40mm': 'https://www.apple.com/shop/buy-watch/apple-watch-se',
  'apple-homepod-mini': 'https://www.apple.com/shop/buy-homepod/homepod-mini',
  'apple-iphone-16-silicone-case-magsafe': 'https://www.apple.com/shop/iphone/iphone-accessories/cases-protection',
  'apple-smart-folio-ipad-air-11': 'https://www.apple.com/shop/ipad/ipad-accessories',
  // Samsung
  'samsung-galaxy-s25-256gb': 'https://www.samsung.com/us/smartphones/galaxy-s25/buy/',
  'samsung-galaxy-s25-ultra-512gb': 'https://www.samsung.com/us/smartphones/galaxy-s25-ultra/buy/',
  'samsung-galaxy-a56-128gb': 'https://www.samsung.com/us/smartphones/galaxy-a56-5g/',
  'samsung-galaxy-book4-15': 'https://www.samsung.com/us/computing/galaxy-books/galaxy-book4/',
  'samsung-galaxy-tab-s9-fe-128gb': 'https://www.samsung.com/us/tablets/galaxy-tab-s9-fe/',
  'samsung-galaxy-tab-a9-plus-64gb': 'https://www.samsung.com/us/tablets/galaxy-tab-a9-plus/',
  'samsung-galaxy-buds3': 'https://www.samsung.com/us/mobile-audio/galaxy-buds3/',
  'samsung-galaxy-watch7-40mm': 'https://www.samsung.com/us/watches/galaxy-watch7/',
  'samsung-galaxy-fit3': 'https://www.samsung.com/us/watches/galaxy-fit3/',
  'samsung-galaxy-s25-clear-case': 'https://www.samsung.com/us/mobile/mobile-accessories/phones/galaxy-s25-clear-case-transparent-ef-qs931ctegus/',
  // Google
  'google-pixel-9-128gb': 'https://store.google.com/product/pixel_9',
  'google-pixel-watch-3-41mm': 'https://store.google.com/product/pixel_watch_3',
  'google-nest-mini-2nd-gen': 'https://store.google.com/product/nest_mini',
  // Lenovo
  'lenovo-ideapad-slim-5-15': 'https://www.lenovo.com/us/en/p/laptops/ideapad/ideapad-slim-series/lenovo-ideapad-slim-5-gen-9-15-inch-amd/len101i0051',
  'lenovo-thinkpad-x1-carbon-gen-12': 'https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadx1/thinkpad-x1-carbon-gen-12-(14-inch-intel)/len101t0077',
  // Sony
  'sony-wh-1000xm5': 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b',
  'sony-wf-1000xm5': 'https://electronics.sony.com/audio/headphones/truly-wireless/p/wf1000xm5-b',
  'sony-srs-xb100': 'https://electronics.sony.com/audio/wireless-speakers/all-wireless-speakers/p/srsxb100-b',
  'sony-playstation-5-slim-1tb': 'https://www.playstation.com/en-us/ps5/',
  'sony-dualsense-wireless-controller': 'https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/',
  // Nintendo
  'nintendo-switch-oled': 'https://www.nintendo.com/us/store/products/nintendo-switch-oled-model-white-set/',
  // Logitech
  'logitech-g435-lightspeed': 'https://www.logitechg.com/en-us/shop/p/g435-wireless-bluetooth-gaming-headset',
  'logitech-g502-x': 'https://www.logitechg.com/en-us/shop/p/g502-x-corded-gaming-mouse',
  // TP-Link
  'tp-link-deco-x50-3-pack': 'https://www.tp-link.com/us/home-networking/deco/deco-x50/',
  'tp-link-archer-ax55': 'https://www.tp-link.com/us/home-networking/wifi-router/archer-ax55/',
  'tp-link-archer-be230': 'https://www.tp-link.com/us/home-networking/wifi-router/archer-be230/',
  'tp-link-re605x': 'https://www.tp-link.com/us/home-networking/range-extender/re605x/',
  'tp-link-m7350-4g-mobile-wifi': 'https://www.tp-link.com/us/home-networking/mifi/m7350/',
  'tp-link-tapo-p100-2-pack': 'https://www.tapo.com/us/product/smart-plug/tapo-p100/',
  'tp-link-tapo-c210': 'https://www.tapo.com/us/product/smart-camera/tapo-c210/',
  'tp-link-tapo-l530e': 'https://www.tapo.com/us/product/smart-light-bulb/tapo-l530e/'
};

/* One skip list, read from tools/image-sources.json so the fetch and SOURCES.md can never disagree:
   a maker page that does not serve this exact model, a block, or a page whose art never passed review. */
const SKIP = (() => {
  const out = {};
  try {
    JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'image-sources.json'), 'utf8')).skipped.forEach(x => { out[x.slug] = x.why; });
  } catch (e) { /* no ledger yet: nothing is skipped */ }
  return out;
})();

/* Tokens that must appear in a candidate's URL or alt text under --strict, so a page's header art,
   its menu or a neighbouring product cannot be mistaken for this one. */
const TOKENS = {
  'samsung-galaxy-s25-256gb': ['s25'],
  'samsung-galaxy-s25-ultra-512gb': ['s25-ultra', 's25ultra', 's928', 's25_ultra'],
  'sony-playstation-5-slim-1tb': ['ps5', 'playstation-5', 'playstation5'],
  'logitech-g435-lightspeed': ['g435'],
  'logitech-g502-x': ['g502'],
  'samsung-galaxy-a56-128gb': ['a56'],
  'samsung-galaxy-watch7-40mm': ['watch7', 'watch-7', 'l300', 'l310'],
  'tp-link-tapo-p100-2-pack': ['p100'],
  'tp-link-tapo-c210': ['c210'],
  'tp-link-tapo-l530e': ['l530']
};
// Some CDNs put the size in the path (Cloudinary-style w_115,h_115). Asking the same asset for a
// bigger render is not a workaround, it is the same image at the size the page could have served.
function upsize(u) {
  const out = [u];
  if (/\/w_\d+,h_\d+/.test(u)) out.unshift(u.replace(/\/w_\d+,h_\d+/, '/w_1200,h_1200'));
  else if (/\/w_\d+\//.test(u)) out.unshift(u.replace(/\/w_\d+\//, '/w_1200/'));
  return out;
}

/* ---------- in-page helpers ---------- */

// Every image URL the page offers: img src/srcset/data-src, picture source srcset, og:image, JSON-LD Product.image.
function collectInPage() {
  const out = [];
  const push = (u, from, meta) => { if (u && /^https?:/.test(u)) out.push(Object.assign({ url: u.trim(), from: from, chrome: false, alt: '' }, meta || {})); };
  const widest = (srcset) => {
    const parts = String(srcset).split(',').map(s => s.trim()).filter(Boolean)
      .map(s => { const m = s.match(/^(\S+)(?:\s+(\d+)w)?/); return m ? { u: m[1], w: m[2] ? +m[2] : 0 } : null; }).filter(Boolean);
    return parts.sort((a, b) => b.w - a.w)[0];
  };
  const chromeOf = (el) => !!el.closest('header, nav, footer, [role="banner"], [role="navigation"], [role="contentinfo"], .header, .nav, .footer, .menu, .cookie, .consent');
  document.querySelectorAll('img').forEach(img => {
    const meta = { chrome: chromeOf(img), alt: (img.getAttribute('alt') || '').slice(0, 120) };
    ['src', 'data-src', 'data-original', 'data-lazy-src'].forEach(a => push(img.getAttribute(a), 'img@' + a, meta));
    ['srcset', 'data-srcset'].forEach(a => { const s = img.getAttribute(a); if (s) { const w = widest(s); if (w) push(w.u, 'img@' + a, meta); } });
  });
  document.querySelectorAll('picture source').forEach(s => { const w = widest(s.getAttribute('srcset') || s.getAttribute('data-srcset') || ''); if (w) push(w.u, 'source', { chrome: chromeOf(s) }); });
  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(m => push(m.getAttribute('content'), 'meta'));
  document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
    try {
      const walk = (n) => {
        if (!n) return;
        if (Array.isArray(n)) return n.forEach(walk);
        if (typeof n !== 'object') return;
        if ((n['@type'] === 'Product' || n['@type'] === 'ImageObject') && n.image) {
          [].concat(n.image).forEach(v => push(typeof v === 'string' ? v : (v && v.url), 'ld+json'));
        }
        Object.values(n).forEach(walk);
      };
      walk(JSON.parse(s.textContent));
    } catch (e) { /* malformed block */ }
  });
  // de-duplicate on the path, query stripped: CDNs vary size and format in the query
  const seen = {}, uniq = [];
  out.forEach(c => {
    let key; try { const u = new URL(c.url); key = u.origin + u.pathname; } catch (e) { key = c.url; }
    if (!seen[key]) { seen[key] = 1; uniq.push(c); }
  });
  return uniq;
}

// Measure, judge the background, and hash. Runs on bytes we fetched ourselves, as a data URL, so the canvas stays clean.
async function measureInPage(dataUrl) {
  const img = new Image(); img.src = dataUrl;
  try { await img.decode(); } catch (e) { return { ok: false, why: 'decode failed' }; }
  const w = img.naturalWidth, h = img.naturalHeight;
  if (!w || !h) return { ok: false, why: 'no dimensions' };
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, w, h).data;
  const bgAt = i => d[i + 3] < 10 || (d[i] > 243 && d[i + 1] > 243 && d[i + 2] > 243);
  const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4];
  const cleanBg = corners.every(bgAt);
  // the subject's box, so the hash compares subjects and not the padding each source happens to use
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  const step = Math.max(1, Math.floor(Math.max(w, h) / 600)); // sampling keeps big images fast
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) { const i = (y * w + x) * 4; if (!bgAt(i)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  if (x1 < 0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
  const sw = x1 - x0 + 1, sh = y1 - y0 + 1;
  const hc = document.createElement('canvas'); hc.width = 8; hc.height = 8;
  const hctx = hc.getContext('2d', { willReadFrequently: true });
  hctx.fillStyle = '#fff'; hctx.fillRect(0, 0, 8, 8);
  hctx.drawImage(img, x0, y0, sw, sh, 0, 0, 8, 8);
  const hd = hctx.getImageData(0, 0, 8, 8).data, g = [];
  for (let i = 0; i < 64; i++) g.push(0.299 * hd[i * 4] + 0.587 * hd[i * 4 + 1] + 0.114 * hd[i * 4 + 2]);
  const avg = g.reduce((a, b) => a + b, 0) / 64;
  const hash = g.map(v => (v > avg ? '1' : '0')).join('');
  // a flat tile or a colour swatch has almost no structure: the hash would match everything
  const variance = g.reduce((a, b) => a + (b - avg) * (b - avg), 0) / 64;
  return { ok: true, w: w, h: h, cleanBg: cleanBg, hash: hash, flat: variance < 40, subject: [sw, sh] };
}

// WebP and AVIF come off CDNs constantly; the optimizer only picks up png and jpg.
async function toPngInPage(dataUrl) {
  const img = new Image(); img.src = dataUrl; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  c.getContext('2d').drawImage(img, 0, 0);
  return c.toDataURL('image/png');
}

/* ---------- node side ---------- */

const hamming = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++; return n; };
function kindOf(buf) {
  if (buf.length > 12) {
    if (buf[0] === 0x89 && buf[1] === 0x50) return 'png';
    if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpg';
    if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'webp';
    if (buf.slice(4, 8).toString() === 'ftyp') return 'avif';
    if (buf.slice(0, 5).toString().toLowerCase() === '<?xml' || buf.slice(0, 4).toString() === '<svg') return 'svg';
  }
  return 'other';
}

/* Rewrite assets/products/SOURCES.md from tools/image-sources.json, with a row only for a file that is
   actually on disk; a log that outlives its file would be a lie. */
function writeSources() {
  const led = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'image-sources.json'), 'utf8'));
  const dir = path.join(ROOT, 'assets', 'products');
  const live = Object.keys(led.kept).filter(f => fs.existsSync(path.join(dir, f))).sort();
  const gone = Object.keys(led.kept).filter(f => !fs.existsSync(path.join(dir, f)));
  const L = [];
  L.push('# Image sources', '');
  L.push('Manufacturer product shots for the third-party SKUs, fetched from each maker\u2019s own product page with');
  L.push('`tools/fetch-images.cjs`, trimmed and re-encoded to WebP by `tools/optimize-images.cjs`, and wired into');
  L.push('`content/products.json` by `tools/sync-images.py`. The 14 Ampline SKUs are a fictional house brand with no');
  L.push('real-world photo: they carry no image and draw their line art instead.');
  L.push('');
  L.push('Licensing for client use is the client\u2019s to clear. These are the manufacturers\u2019 own images, shown here to');
  L.push('demonstrate the prototype, not cleared for commercial use.');
  L.push('');
  L.push('## Fetched ' + led.fetched, '');
  L.push(live.length + ' files across ' + new Set(live.map(f => led.kept[f].slug)).size + ' products. Every row below was');
  L.push('checked by eye against the product, and against the generation the page actually sells, before it was kept.');
  L.push('');
  L.push('| File | Product page | Image |', '|:--|:--|:--|');
  live.forEach(f => L.push('| `' + f + '` | ' + led.kept[f].page + ' | ' + led.kept[f].image + ' |'));
  L.push('');
  L.push('## Fetched but not kept', '');
  L.push('Each line is a candidate the fetch downloaded and the review turned away, named by the image it came from:');
  L.push('');
  led.notkept.forEach(x => L.push('- ' + x.slug + ', ' + x.image.split('?')[0].split('/').pop() + ' from ' + x.page + ': ' + x.why));
  if (gone.length) L.push('', 'Logged earlier but no longer on disk: ' + gone.join(', '));
  L.push('');
  L.push('## Products that gained no new image, and why', '');
  L.push('A maker page that does not serve this exact model, a block, art under the size floor, or no clean shot.');
  L.push('None of these was worked around:');
  L.push('');
  (led.skipped || []).forEach(x => L.push('- `' + x.slug + '`: ' + x.why));
  L.push('');
  L.push('The `-1` image of every third-party SKU predates this record. It was sourced the same way on 2026-10-11;');
  L.push('no per-file source URL was logged at the time and none is in the repository\u2019s history.');
  L.push('');
  fs.writeFileSync(path.join(dir, 'SOURCES.md'), L.join('\n'));
  console.log('SOURCES.md: ' + live.length + ' kept rows, ' + led.notkept.length + ' not kept, ' + (led.skipped || []).length + ' not fetched');
}

(async () => {
  if (SOURCES) return writeSources();
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'products.json'), 'utf8'));
  const third = data.products.filter(p => p.brand && p.brand !== 'Ampline'); // the guard: brand, not the map
  const only = ONLY ? ONLY.split(',') : null;
  const todo = third.filter(p => MAP[p.slug] && (!SKIP[p.slug] || (only && only.indexOf(p.slug) >= 0)) && (!only || only.indexOf(p.slug) >= 0));
  const skipped = third.filter(p => SKIP[p.slug]).map(p => ({ slug: p.slug, why: SKIP[p.slug] }));
  skipped.forEach(s => console.log('SKIP'.padEnd(5), s.slug.padEnd(38), s.why));
  const unmapped = third.filter(p => !MAP[p.slug]).map(p => p.slug);
  if (unmapped.length) console.log('NO URL MAPPED:', unmapped.join(' '));
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await pw.chromium.launch({ channel: 'chrome' }).catch(() => pw.chromium.launch());
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));
  const work = await ctx.newPage(); // a blank page that owns the canvas work
  await work.goto('about:blank');

  const report = [], kept = [];
  for (const p of todo) {
    const url = MAP[p.slug];
    let status = 0, finalUrl = '', cands = [], note = '';
    try {
      const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      status = r ? r.status() : 0;
      finalUrl = page.url();
      await page.waitForTimeout(2500);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2)).catch(() => {});
      await page.waitForTimeout(1500);
      cands = await page.evaluate(collectInPage);
    } catch (e) { note = 'ERR ' + e.message.split('\n')[0].slice(0, 60); }

    if (status >= 400 || note) {
      report.push({ slug: p.slug, status: status, url: url, finalUrl: finalUrl, candidates: 0, note: note || 'blocked ' + status, skipped: true });
      console.log(p.slug.padEnd(40), String(status).padStart(3), (note || 'BLOCKED').slice(0, 50));
      continue;
    }
    if (DRY) {
      const moved = finalUrl.replace(/[?#].*/, '') !== url.replace(/[?#].*/, '');
      report.push({ slug: p.slug, status: status, url: url, finalUrl: finalUrl, candidates: cands.length, redirected: moved });
      console.log(p.slug.padEnd(40), String(status).padStart(3), String(cands.length).padStart(4) + ' cand', moved ? ('-> ' + finalUrl.slice(0, 70)) : '');
      continue;
    }

    /* Existing -1 as the duplicate reference */
    const refPath = path.join(ROOT, 'assets', 'products', p.slug + '-1.webp');
    let refHash = null;
    if (fs.existsSync(refPath)) {
      const m = await work.evaluate(measureInPage, 'data:image/webp;base64,' + fs.readFileSync(refPath).toString('base64'));
      if (m.ok) refHash = m.hash;
    }
    const haveHashes = refHash ? [refHash] : [];
    let saved = 0;
    const tried = [];
    const toks = TOKENS[p.slug] || null;
    for (const c of cands) {
      if (saved >= WANT) break;
      if (STRICT && c.chrome) { tried.push([c.url, 'page chrome']); continue; }
      if (STRICT && toks) {
        const hay = (c.url + ' ' + (c.alt || '')).toLowerCase();
        if (!toks.some(t => hay.includes(t))) { tried.push([c.url, 'no model token']); continue; }
      }
      let buf, got = null;
      for (const cand of upsize(c.url)) {
        try { const res = await ctx.request.get(cand, { timeout: 25000 }); if (res.ok()) { buf = await res.body(); got = cand; break; } } catch (e) { /* try the next form */ }
      }
      if (!buf) { tried.push([c.url, 'fetch failed']); continue; }
      c.url = got;
      const kind = kindOf(buf);
      if (kind === 'svg' || kind === 'other') { tried.push([c.url, kind]); continue; }
      let dataUrl = 'data:image/' + (kind === 'jpg' ? 'jpeg' : kind) + ';base64,' + buf.toString('base64');
      const m = await work.evaluate(measureInPage, dataUrl).catch(() => ({ ok: false, why: 'measure threw' }));
      if (!m.ok) { tried.push([c.url, m.why]); continue; }
      if (Math.max(m.w, m.h) < MIN_SIDE) { tried.push([c.url, 'small ' + m.w + 'x' + m.h]); continue; }
      if (!m.cleanBg) { tried.push([c.url, 'background ' + m.w + 'x' + m.h]); continue; }
      if (m.flat) { tried.push([c.url, 'flat/no subject']); continue; }
      const dup = haveHashes.find(h => hamming(h, m.hash) <= DUP_DIST);
      if (dup) { tried.push([c.url, 'duplicate']); continue; }
      // the optimizer reads png and jpg only
      let ext = kind, outBuf = buf;
      if (kind === 'webp' || kind === 'avif') {
        const png = await work.evaluate(toPngInPage, dataUrl).catch(() => null);
        if (!png) { tried.push([c.url, 'transcode failed']); continue; }
        outBuf = Buffer.from(png.split(',')[1], 'base64'); ext = 'png';
      }
      const n = saved + 2; // -1 exists; these are -2 and -3
      const file = p.slug + '-' + n + '.' + ext;
      fs.writeFileSync(path.join(OUT, file), outBuf);
      haveHashes.push(m.hash); saved++;
      kept.push({ slug: p.slug, file: file, n: n, page: finalUrl || url, image: c.url, from: c.from, w: m.w, h: m.h, good: Math.max(m.w, m.h) >= GOOD_SIDE });
    }
    report.push({ slug: p.slug, status: status, url: url, finalUrl: finalUrl, candidates: cands.length, saved: saved, tried: tried.slice(0, 12) });
    console.log(p.slug.padEnd(40), String(status).padStart(3), String(cands.length).padStart(4) + ' cand', '->', saved + ' saved');
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, DRY ? 'dry.json' : 'candidates.json'), JSON.stringify({ when: new Date().toISOString(), report: report, kept: kept, skipped: skipped }, null, 1));
  console.log('\n' + (DRY ? 'dry run' : 'saved ' + kept.length + ' files') + ' for ' + todo.length + ' products; report in ' + OUT);
})().catch(e => { console.error(e); process.exit(1); });
