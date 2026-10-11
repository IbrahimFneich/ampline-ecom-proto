// Product-page capture driven by pdp-targets.json: { site: { url } | { listing, pattern, keyword? } }.
// Resolves one product URL per site (direct, or first same-host link on the listing matching pattern, keyword preferred),
// captures pdp-{desktop,mobile}{-fold,}.png and merges pdpUrl + pdp facts into <site>/facts.json.
const fs = require('fs'); const path = require('path');
const { ROOT, log, ctxOpts, launch, settle, shot, FACTS } = require('./capture.cjs');
const targets = JSON.parse(fs.readFileSync(path.join(ROOT, 'pdp-targets.json'), 'utf8'));
const only = process.argv.slice(2);

async function resolve(page, t) {
  if (t.url) return t.url;
  await settle(page, t.listing);
  const host = new URL(t.listing).hostname.replace(/^www\./, '');
  const re = new RegExp(t.pattern); const kw = t.keyword ? new RegExp(t.keyword, 'i') : null;
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ href: a.href, text: (a.textContent || '').replace(/\s+/g, ' ').trim() })));
  const cands = links.filter(l => { try { const u = new URL(l.href); return u.hostname.replace(/^www\./, '') === host && re.test(u.pathname); } catch { return false; } });
  const pick = (kw && cands.find(l => kw.test(l.href) || kw.test(l.text))) || cands[0];
  log('  candidates', cands.length, 'picked', pick ? pick.href : 'none');
  return pick ? pick.href.split('?')[0] : null;
}

(async () => {
  const browser = await launch();
  for (const [name, t] of Object.entries(targets)) {
    if (only.length && !only.includes(name)) continue;
    const dir = path.join(ROOT, name); fs.mkdirSync(dir, { recursive: true });
    const fp = path.join(dir, 'facts.json');
    const facts = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : { site: name };
    let pdp = null;
    for (const label of ['desktop', 'mobile']) {
      const ctx = await browser.newContext(ctxOpts(label));
      const page = await ctx.newPage();
      try {
        if (!pdp) pdp = await resolve(page, t);
        if (!pdp) { log(name, 'no product url resolved'); break; }
        await settle(page, pdp);
        await shot(page, path.join(dir, `pdp-${label}-fold.png`), false);
        await shot(page, path.join(dir, `pdp-${label}.png`), true);
        if (label === 'desktop') { facts.pdpUrl = pdp; facts.pdp = await page.evaluate(FACTS); }
        log(name, label, 'pdp ok', pdp);
      } catch (e) {
        const m = e.message.split('\n')[0]; log(name, label, 'PDP FAIL', m);
        facts.pdpError = (facts.pdpError || []).concat(`${label}: ${m}`);
      }
      await ctx.close();
    }
    fs.writeFileSync(fp, JSON.stringify(facts, null, 2));
  }
  await browser.close(); log('PDP DONE');
})();
