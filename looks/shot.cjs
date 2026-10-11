const { chromium, devices } = require('/Users/ibrahimfneich/.nvm/versions/node/v16.20.2/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const name of ['canon','midnight','box']) {
    for (const [tag, opts] of [['desktop',{viewport:{width:1440,height:900}}],['mobile',{...devices['iPhone 13'], deviceScaleFactor:1}]]) {
      const ctx = await b.newContext(opts); const p = await ctx.newPage();
      const errs=[]; p.on('pageerror', e=>errs.push(e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
      await p.goto('file://' + __dirname + '/' + name + '.html'); await p.waitForTimeout(1500);
      if (tag==='desktop') { await p.click('.chip[data-d="iphone"]'); await p.waitForTimeout(900); await p.screenshot({ path: `${name}-${tag}-iphone.png`, fullPage: false }); await p.click('.chip[data-d="iphone"]'); await p.waitForTimeout(700); }
      await p.screenshot({ path: `${name}-${tag}.png`, fullPage: true });
      console.log(name, tag, 'ok', errs.length ? 'ERRORS: ' + errs.join(' | ') : '');
      await ctx.close();
    }
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
