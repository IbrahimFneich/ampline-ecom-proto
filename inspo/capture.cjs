// Inspo capture: home + first product page per site, desktop + mobile, fold + full, plus DOM facts per site.
// Run: node capture.cjs   (node 20; playwright from the node16 global modules). capture-pdp.cjs reuses the helpers.
const { chromium, devices } = require('/Users/ibrahimfneich/.nvm/versions/node/v16.20.2/lib/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const ROOT = __dirname;
const SITES = [
  ['porodo', 'https://www.porodo.net/'], ['greenlion', 'https://www.greenlion.net/'], ['bavin', 'https://www.bavin.ph/'],
  ['anker', 'https://www.anker.com/'], ['powerology', 'https://www.powerology.me/'], ['belkin', 'https://www.belkin.com/'],
  ['baseus', 'https://www.baseus.com/'], ['ugreen', 'https://www.ugreen.com/'],
];
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const log = (...a) => { const s = a.join(' '); console.log(s); fs.appendFileSync(path.join(ROOT, 'capture.log'), s + '\n'); };
const ctxOpts = label => label === 'mobile'
  ? { ...devices['iPhone 13'], deviceScaleFactor: 1, locale: 'en-US' }
  : { viewport: { width: 1440, height: 900 }, userAgent: UA, locale: 'en-US', deviceScaleFactor: 1 };
async function launch() {
  try { const b = await chromium.launch({ channel: 'chrome' }); log('using chrome channel'); return b; }
  catch { const b = await chromium.launch(); log('using bundled chromium'); return b; }
}
async function settle(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch {}
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(1500);
}
async function shot(page, file, full) {
  try { await page.screenshot({ path: file, fullPage: full }); }
  catch (e) {
    try { await page.screenshot({ path: file, clip: { x: 0, y: 0, width: page.viewportSize().width, height: 12000 } }); }
    catch (e2) { log('  shot fail', path.basename(file), e2.message.split('\n')[0]); }
  }
}
const FACTS = () => {
  const cs = el => el ? getComputedStyle(el) : null;
  const txt = el => (el && el.textContent || '').replace(/\s+/g, ' ').trim();
  const header = document.querySelector('header') || document.querySelector('[class*="header"]');
  const h1 = document.querySelector('h1');
  const btn = document.querySelector('button[class*="primary"], a[class*="primary"], a[class*="btn"], button[class*="btn"], button[type="submit"]');
  const navLinks = [...document.querySelectorAll('header nav a, header a, nav a')].map(txt).filter(t => t && t.length < 28);
  const priceRe = /(?:\$|€|£|AED|SAR|QAR|KWD|BHD|OMR|₱|PHP|USD|LBP)\s?\d[\d,.]*|\d[\d,.]*\s?(?:AED|SAR|QAR|KWD|BHD|OMR|PHP|USD|LBP)/g;
  const prices = ((document.body.innerText || '').match(priceRe) || []);
  const productLinks = [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /\/(products?|p|item)\/[^/?#]+/.test(h)))];
  return {
    title: document.title, lang: document.documentElement.lang, dir: document.documentElement.dir || 'ltr',
    h1: txt(h1), nav: [...new Set(navLinks)].slice(0, 25),
    fonts: { body: cs(document.body).fontFamily, h1: h1 ? cs(h1).fontFamily : null, button: btn ? cs(btn).fontFamily : null },
    colors: {
      bodyBg: cs(document.body).backgroundColor, headerBg: header ? cs(header).backgroundColor : null, headerColor: header ? cs(header).color : null,
      buttonBg: btn ? cs(btn).backgroundColor : null, buttonColor: btn ? cs(btn).color : null, buttonRadius: btn ? cs(btn).borderRadius : null, buttonText: txt(btn),
    },
    priceCount: prices.length, priceSamples: [...new Set(prices)].slice(0, 8),
    productLinkCount: productLinks.length, firstProductLinks: productLinks.slice(0, 5),
    hasSearch: !!document.querySelector('input[type="search"], input[name="q"], input[placeholder*="earch"]'),
    pageHeight: document.documentElement.scrollHeight,
    generator: (document.querySelector('meta[name="generator"]') || {}).content || null,
    shopify: !!(window.Shopify || document.querySelector('script[src*="shopify"]')),
  };
};
module.exports = { ROOT, SITES, UA, log, ctxOpts, launch, settle, shot, FACTS };

if (require.main === module) (async () => {
  const browser = await launch();
  for (const [name, url] of SITES) {
    const dir = path.join(ROOT, name); fs.mkdirSync(dir, { recursive: true });
    const facts = { site: name, url, capturedAt: new Date().toISOString() };
    for (const label of ['desktop', 'mobile']) {
      const ctx = await browser.newContext(ctxOpts(label));
      const page = await ctx.newPage();
      try {
        await settle(page, url);
        await shot(page, path.join(dir, `home-${label}-fold.png`), false);
        await shot(page, path.join(dir, `home-${label}.png`), true);
        if (label === 'desktop') facts.home = await page.evaluate(FACTS);
        log(name, label, 'home ok');
      } catch (e) {
        const m = e.message.split('\n')[0]; log(name, label, 'FAIL', m);
        facts.error = (facts.error || []).concat(`${label}: ${m}`);
      }
      await ctx.close();
    }
    fs.writeFileSync(path.join(dir, 'facts.json'), JSON.stringify(facts, null, 2));
  }
  await browser.close(); log('DONE');
})();
