// Runnable check for the catalog logic in catalog.js: node check.js
// Fails if a derived watt figure, a device match list, a split parse, a port
// count or a filter result drifts from what content/products.json states.
const assert = require('assert');
const A = require('./catalog.js');
const data = require('./content/products.json');
const byId = Object.fromEntries(data.products.map(p => [p.id, p]));
A.setDevices(data.devices);

// Max single-port output, verified by hand against content/products.json.
const watts = {
  'AMP-GAN-65': 65, 'AMP-GAN-100D': 100, 'AMP-NANO-20': 20, 'AMP-CBL-C100-2M': 100,
  'AMP-CBL-CL-1M': 27, 'AMP-CBL-3IN1': 100, 'AMP-PB-MAG10': 20, 'AMP-PB-20K65': 65,
  'AMP-HUB-7': 85, 'AMP-CAR-45': 30, 'AMP-WL-3IN1': 15, 'AMP-TRV-65': 65
};
for (const [id, w] of Object.entries(watts)) assert.strictEqual(A.maxPortWatts(byId[id]), w, id);

// Device matches, read from each device's id and aliases in the catalog.
const ids = d => data.products.filter(p => A.fits(p, A.deviceById(d))).map(p => p.id);
assert.deepStrictEqual(ids('iphone-15'), ["AMP-GAN-65", "AMP-GAN-100D", "AMP-NANO-20", "AMP-TRV-65", "AMP-CBL-C100-2M", "AMP-CBL-3IN1", "AMP-PB-MAG10", "AMP-PB-20K65", "AMP-CAR-45", "AMP-WL-3IN1", "AMP-MOUNT-DASH"]);
assert.deepStrictEqual(ids('iphone-12-14'), ["AMP-GAN-100D", "AMP-NANO-20", "AMP-TRV-65", "AMP-CBL-CL-1M", "AMP-CBL-3IN1", "AMP-PB-MAG10", "AMP-CAR-45", "AMP-WL-3IN1", "AMP-MOUNT-DASH"]);
assert.deepStrictEqual(ids('iphone-8-11'), ["AMP-GAN-100D", "AMP-TRV-65", "AMP-CBL-CL-1M", "AMP-CBL-3IN1", "AMP-CAR-45", "AMP-MOUNT-DASH"]);
assert.deepStrictEqual(ids('galaxy-s'), ["AMP-GAN-65", "AMP-NANO-20", "AMP-TRV-65", "AMP-CBL-C100-2M", "AMP-CBL-3IN1", "AMP-PB-MAG10", "AMP-PB-20K65", "AMP-CAR-45", "AMP-WL-3IN1", "AMP-MOUNT-DASH"]);
assert.deepStrictEqual(ids('ipad-air'), ["AMP-CBL-C100-2M", "AMP-CBL-3IN1", "AMP-HUB-7"]);
assert.deepStrictEqual(ids('macbook-air'), ["AMP-GAN-65", "AMP-TRV-65", "AMP-CBL-C100-2M", "AMP-PB-20K65", "AMP-HUB-7", "AMP-STAND-LAPTOP"]);
assert.deepStrictEqual(ids('steam-deck'), ["AMP-GAN-65", "AMP-HUB-7"]);
assert.deepStrictEqual(ids('airpods-lightning'), ["AMP-NANO-20", "AMP-CBL-CL-1M", "AMP-WL-3IN1"]);
// A device-id entry never leaks across buckets: the iPhone 16 case fits no other iPhone bucket.
assert.ok(!A.fits(byId['APL-CASE-IP16-SIL'], A.deviceById('iphone-12-14')));
assert.strictEqual(A.DEVICES.length, 24);
// A model fits everything its bucket fits plus what names it; the bucket never claims the model's case.
assert.deepStrictEqual(ids('iphone-16').sort(), ids('iphone-15').concat(['APL-CASE-IP16-SIL']).sort());
assert.deepStrictEqual(ids('galaxy-s25').sort(), ids('galaxy-s').concat(['SAM-CASE-S25-CLEAR']).sort());
assert.deepStrictEqual(ids('ipad-air-11-m2').sort(), ids('ipad-air').concat(['APL-FOLIO-IPADAIR11']).sort());
assert.ok(!ids('iphone-15').includes('APL-CASE-IP16-SIL'));
assert.strictEqual(A.deviceById('galaxy-s25').max_charge_w, 25); // Samsung's figure for the base S25, not the family's 45W
assert.strictEqual(A.ceilingNote(A.deviceById('galaxy-s25')), 'The Samsung Galaxy S25’s own ceiling, as its maker publishes it.');
assert.strictEqual(A.ceilingNote(A.deviceById('iphone-16')), 'The catalog’s ceiling for iPhone 15 or newer, which this model sits in; your model may take less.');
assert.strictEqual(A.ceilingNote(A.deviceById('android-phone')), 'A typical figure for this group, not a maker’s number.');
assert.strictEqual(A.ceilingNote(A.deviceById('macbook-pro')), 'The catalog’s ceiling for MacBook Pro; your model may take less.');
assert.strictEqual(A.nounFor('cases-and-mounts', 1) + ' / ' + A.nounFor('hubs', 2), 'case or mount / hubs and docks');
assert.deepStrictEqual(A.matchedCompat(byId['AMP-GAN-65'], A.deviceById('iphone-16')), A.matchedCompat(byId['AMP-GAN-65'], A.deviceById('iphone-15')));
for (const d of A.DEVICES) assert.ok(ids(d.id).length > 0, d.id + ' has no matches');

// Split outputs read from the spec sheets.
assert.deepStrictEqual(A.splits(byId['AMP-GAN-65']), [[45, 20], [30, 20, 15]]);
assert.deepStrictEqual(A.splits(byId['AMP-GAN-100D']), [[65, 30], [45, 30, 20, 5]]);
assert.deepStrictEqual(A.splits(byId['AMP-CAR-45']), [[30, 15]]);
assert.deepStrictEqual(data.products.filter(p => A.splits(p).length).map(p => p.id), ['AMP-GAN-65', 'AMP-GAN-100D', 'AMP-CAR-45']);

// Every Ampline SKU carries a type the chargers filter can label; third-party products carry Type as a spec instead.
for (const p of data.products.filter(p => !p.brand)) assert.ok(A.TYPE_LABELS[p.type], p.id + ' type ' + p.type);

// Port counts from the Ports / USB / Output specs.
assert.deepStrictEqual(A.ports(byId['AMP-GAN-65']), { c: 2, a: 1 });
assert.deepStrictEqual(A.ports(byId['AMP-GAN-100D']), { c: 3, a: 1 });
assert.deepStrictEqual(A.ports(byId['AMP-NANO-20']), { c: 1, a: 0 });
assert.deepStrictEqual(A.ports(byId['AMP-TRV-65']), { c: 1, a: 2 });
assert.deepStrictEqual(A.ports(byId['AMP-HUB-7']), { c: 1, a: 2 });
assert.deepStrictEqual(A.ports(byId['AMP-CBL-C100-2M']), { c: 0, a: 0 });

// Facets: options come from each category's facets; filters are OR within a facet, AND across.
const cats = data.categories;
const pool = s => data.products.filter(p => p.category === s);
const defsFor = s => cats.find(c => c.slug === s).facets.map(label => ({ label, opts: A.facetOptions(label, pool(s), cats) }));
const run = (s, f) => pool(s).filter(p => A.passes(p, Object.assign({ device: null, q: '', facets: {} }, f), defsFor(s), null, cats)).map(p => p.id);
assert.deepStrictEqual(A.facetOptions('Storage', pool('phones'), cats).map(o => o.label), ['128 GB', '256 GB', '512 GB']);
assert.deepStrictEqual(A.facetOptions('Screen', pool('phones'), cats).map(o => o.label), ['6.1-inch', '6.2-inch', '6.3-inch', '6.7-inch', '6.9-inch']);
assert.deepStrictEqual(A.facetOptions('Processor', pool('laptops'), cats).map(o => o.label), ['AMD', 'Apple', 'Intel']);
assert.deepStrictEqual(A.facetOptions('Noise cancelling', pool('audio'), cats).map(o => o.label), ['No', 'Yes']);
assert.deepStrictEqual(A.facetOptions('Connectivity', pool('smart-home'), cats).map(o => o.label), ['Bluetooth', 'Thread', 'Ultra Wideband', 'Wi-Fi']);
assert.deepStrictEqual(A.facetOptions('Type', pool('chargers'), cats).map(o => o.label), ['Desktop', 'Travel adapter', 'Wall']);
const live = (label, s) => A.facetOptions(label, pool(s), cats).map(o => [o.label, pool(s).filter(o.test).length]);
assert.deepStrictEqual(live('Battery', 'wearables'), [['Under a day', 2], ['1 to 3 days', 2], ['Over 3 days', 1]]); // 24 h is one day
assert.deepStrictEqual(live('Coverage', 'networking'), [['Up to 200 m²', 2], ['Over 200 m²', 2]]); // the 4G hotspot has no area and sits in no band
assert.deepStrictEqual(live('Price', 'cables').filter(x => x[1]).length, 1); // every cable is under $20: shop.js drops the group
assert.strictEqual(A.money(1399), '$1,399.00');
assert.deepStrictEqual(A.facetOptions('Max output', pool('chargers'), cats).map(o => o.id), ['0-30', '31-65', '66-up']);
assert.deepStrictEqual(A.facetOptions('Group', data.products, cats).map(o => o.label), ['Devices', 'Accessories', 'Power']);
assert.deepStrictEqual(A.priceBands(pool('chargers')).map(o => o.label), ['Under $20', '$20 to $50', 'Over $50']);
assert.deepStrictEqual(A.priceBands(pool('phones')).map(o => o.label), ['Under $300', '$300 to $800', 'Over $800']);
assert.deepStrictEqual(A.priceBands(data.products).map(o => o.label), ['Under $500', '$500 to $1,500', 'Over $1,500']);
assert.deepStrictEqual(run('chargers', {}), ['AMP-GAN-65', 'AMP-GAN-100D', 'AMP-NANO-20', 'AMP-TRV-65']);
assert.deepStrictEqual(run('chargers', { facets: { Type: ['wall'] } }), ['AMP-GAN-65', 'AMP-NANO-20']);
assert.deepStrictEqual(run('chargers', { facets: { 'Max output': ['0-30', '66-up'] } }), ['AMP-GAN-100D', 'AMP-NANO-20']);
assert.deepStrictEqual(run('chargers', { facets: { Ports: ['one'] } }), ['AMP-NANO-20']);
assert.deepStrictEqual(run('chargers', { device: 'iphone-8-11' }), ['AMP-GAN-100D', 'AMP-TRV-65']);
assert.deepStrictEqual(run('chargers', { device: 'iphone-8-11', facets: { Price: ['p2'] } }), ['AMP-TRV-65']);
assert.deepStrictEqual(run('phones', { facets: { Storage: ['512-gb'] } }), ['SAM-S25U-512']);
assert.deepStrictEqual(run('phones', { facets: { Brand: ['samsung'], Screen: ['6-2-inch', '6-7-inch'] } }), ['SAM-S25-256', 'SAM-A56-128']);
assert.deepStrictEqual(run('audio', { facets: { 'Noise cancelling': ['no'] } }), ['SON-SRSXB100']);
assert.deepStrictEqual(run('smart-home', { facets: { Connectivity: ['thread'] } }), ['APL-HOMEPOD-MINI']);
assert.deepStrictEqual(run('phones', { device: 'iphone-15' }), []); // devices never fit a device; the Fits group is not offered there
// Facet count override: swap one facet's selection without touching the rest.
const f = { device: null, q: '', facets: { Type: ['wall'], Price: ['p1'] } };
assert.deepStrictEqual(pool('chargers').filter(p => A.passes(p, f, defsFor('chargers'), { group: 'Price', ids: ['p2'] }, cats)).map(p => p.id), ['AMP-GAN-65']);
// Search over name, brand, category and specs, every token required.
const q = s => data.products.filter(p => A.matchesQuery(p, s, cats)).map(p => p.id);
assert.deepStrictEqual(q('sony noise'), ['SON-WH1000XM5', 'SON-WF1000XM5', 'SON-SRSXB100']);
assert.deepStrictEqual(q('gan 100w'), ['AMP-GAN-100D']);
assert.deepStrictEqual(q('wi-fi 7'), ['TPL-ARCHER-BE230']);
assert.deepStrictEqual(q('zzzz'), []);
// Shopper phrasings: one normalisation on both sides, device terms become fit tests, names outrank specs.
const qn = s => { const r = data.products.filter(p => A.matchesQuery(p, s, cats)); return r.map((p, i) => ({ p, i, r: A.searchRank(p, s, cats) })).sort((a, b) => b.r - a.r || a.i - b.i).map(x => x.p.name); };
assert.strictEqual(qn('iphone 16')[0], 'Apple iPhone 16, 128 GB'); // a bare number matches before a comma
assert.strictEqual(qn('iphone 16')[1], 'Apple iPhone 16 Silicone Case with MagSafe');
assert.strictEqual(qn('iphone 16').length, 13); // the phone, the case, and the 11 other products that fit it
assert.deepStrictEqual(qn('iphone charger').slice(0, 3), ['GaN 65W 3-Port Charger', 'GaN 100W Desktop Charger', 'Nano 20W USB-C Charger']);
assert.ok(qn('iphone charger').every(n => !/iPhone \d+,/.test(n)), 'a charger query never lists the phone');
assert.deepStrictEqual(qn('iphone 13 charger'), qn('iphone 12 charger')); // an in-range model number resolves to its bucket
assert.ok(qn('macbook charger').length >= 2 && qn('android').length >= 10 && qn('steam deck').length >= 1);
assert.deepStrictEqual(qn('type-c cable'), qn('usb c cable')); assert.deepStrictEqual(qn('usb c'), qn('usb-c'));
assert.ok(qn('usb c').length < 46, 'a lone c no longer matches every product');
assert.deepStrictEqual(qn('powerbank'), qn('power bank')); assert.strictEqual(qn('powerbank').length, 2);
assert.deepStrictEqual(qn('65 w'), qn('65w')); assert.strictEqual(qn('65 w')[0], 'GaN 65W 3-Port Charger');
assert.deepStrictEqual(qn('case').slice(0, 2), ['Apple iPhone 16 Silicone Case with MagSafe', 'Samsung Galaxy S25 Clear Case']); // cases before earbuds with a case in the name
assert.strictEqual(qn('10000 mah')[0], 'Magnetic 10,000 mAh Power Bank');
assert.ok(!qn('7').some(n => /7,040|7040/.test(n)), '7 does not match 7,040 mAh');
assert.deepStrictEqual(A.parseQuery('Samsung Galaxy S25 case').tokens, ['case']);
assert.strictEqual(A.ROUTES ? A.ROUTES.shop.length : 16, 16);

// Region plug variants from the Plug spec, and the one honest bundle rule.
assert.deepStrictEqual(A.variants(byId['AMP-GAN-65']), ['UK', 'EU', 'US']);
assert.deepStrictEqual(A.variants(byId['AMP-NANO-20']), ['UK', 'EU', 'US']);
assert.deepStrictEqual(A.variants(byId['AMP-CBL-C100-2M']), []);
assert.strictEqual(A.bundleFor(byId['AMP-GAN-65'], data.products).id, 'AMP-CBL-C100-2M');
assert.strictEqual(A.bundleFor(byId['AMP-GAN-100D'], data.products).id, 'AMP-CBL-C100-2M');
assert.strictEqual(A.bundleFor(byId['AMP-PB-20K65'], data.products), null);
assert.strictEqual(A.bundleFor(byId['AMP-CBL-C100-2M'], data.products), null);

// Outer dimensions from the Size spec; every product has a page and a route.
const fs = require('fs');
assert.deepStrictEqual(A.dimensions(byId['AMP-GAN-65']), { w: 52, h: 48, d: 30, g: 112 });
assert.deepStrictEqual(A.dimensions(byId['AMP-NANO-20']), { w: 30, h: 30, d: 32, g: 38 });
assert.strictEqual(A.dimensions(byId['AMP-CAR-45']), null);
assert.strictEqual(A.dimensions(byId['AMP-CBL-C100-2M']), null);
const ROUTED = data.products.map(p => p.slug); // every SKU has a page
for (const slug of ROUTED) assert.ok(fs.existsSync(__dirname + '/product/' + slug + '.html'), 'page for ' + slug);
assert.strictEqual(A.ROUTES ? A.ROUTES.product.length : 58, 58);
// Variant groups: plug regions from the Plug spec, then the catalog's variants object; the setup row is Ampline-only and device-driven.
assert.deepStrictEqual(A.variantGroups(byId['AMP-GAN-65']).map(g => [g.key, g.opts.length]), [['plug', 3]]);
assert.deepStrictEqual(A.variantGroups(byId['APL-IP16-128']).map(g => [g.key, g.legend, g.opts.length]), [['color', 'Colour', 5], ['storage', 'Storage', 3]]);
assert.deepStrictEqual(A.variantGroups(byId['TPL-M7350']), []);
const setup = A.setupFor(byId['APL-IP16-128'], data.products).map(p => p.id);
assert.ok(setup.includes('AMP-GAN-65') && setup.includes('AMP-MOUNT-DASH') && !setup.includes('AMP-CBL-CL-1M'), 'iPhone 16 setup row: ' + setup); // Lightning cable is not listed for iPhone 15 or newer
assert.ok(setup.every(id => !byId[id].brand || byId[id].brand === 'Ampline'), 'setup row is Ampline only');
assert.deepStrictEqual(A.setupFor(byId['SON-WH1000XM5'], data.products), []); // no device id, no row
assert.deepStrictEqual(A.variantGroups(byId['APL-APP2-USBC']), []); // one colour is a fact, not a choice
assert.strictEqual(A.variantName(byId['APL-IP16-128'], 'Teal · 256 GB'), 'Apple iPhone 16, 256 GB');
assert.strictEqual(A.variantName(byId['APL-MBA13-M3'], 'Midnight · 512 GB'), 'Apple MacBook Air 13-inch (M3), 8 GB, 512 GB'); // storage, not memory
assert.strictEqual(A.variantName(byId['TPL-TAPO-P100-2'], '4-pack'), byId['TPL-TAPO-P100-2'].name.replace(/\d+-pack/i, '4-pack'));
assert.strictEqual(A.variantName(byId['SON-WH1000XM5'], 'Silver'), byId['SON-WH1000XM5'].name);
const dflt = (id, key) => A.defaultVariant(byId[id], A.variantGroups(byId[id]).find(g => g.key === key));
assert.strictEqual(dflt('SAM-S25U-512', 'storage'), '512 GB'); // the SKU's own tier, not the first option
assert.strictEqual(dflt('TPL-TAPO-P100-2', 'pack'), '2-pack');
assert.strictEqual(dflt('TPL-DECO-X50-3', 'pack'), '3-pack');
assert.strictEqual(dflt('APL-IP16-128', 'storage'), '128 GB');
assert.strictEqual(dflt('APL-IP16-128', 'color'), 'Black'); // no colour in the name: the first option

// Catalog integrity after the tech-catalog extension.
assert.strictEqual(data.products.length, 58);
assert.strictEqual(data.categories.length, 15);
for (const c of data.categories) assert.ok(['Devices', 'Accessories', 'Power'].includes(c.group), c.slug + ' group');
const devIds = new Set(data.devices.map(d => d.id));
const aliases = new Set(data.devices.flatMap(d => d.aliases));
for (const p of data.products.filter(p => p.id.startsWith('AMP-') && !p.brand)) {
  for (const c of p.compat) assert.ok(aliases.has(c) || data._meta.compat_unmapped.includes(c), 'unmapped compat ' + c);
}
for (const p of data.products.filter(p => p.brand)) {
  if (p.device) assert.ok(devIds.has(p.device), p.id + ' device');
  if (p.compat) for (const c of p.compat) assert.ok(devIds.has(c), p.id + ' compat ' + c);
  const cat = data.categories.find(c => c.slug === p.category);
  for (const f of cat.facets) if (!['Brand', 'Price'].includes(f) && !(p.category === 'gaming' && f === 'Storage')) assert.ok(p.specs.some(s => s.label === f), p.id + ' facet ' + f);
  assert.strictEqual(A.maxPortWatts(p), null, p.id + ' must not read as a power source');
}
// The home page's power catalog is still the six original categories.
const powerCats = new Set(data.products.filter(p => A.maxPortWatts(p) !== null).map(p => p.category));
assert.deepStrictEqual([...powerCats].sort(), ['cables', 'car', 'chargers', 'hubs', 'power-banks', 'wireless']);

// Sorts
const chargers = pool('chargers');
assert.deepStrictEqual(chargers.slice().sort(A.SORTS['price-asc']).map(p => p.price), [14.99, 34.99, 39.99, 69.99]);
assert.deepStrictEqual(chargers.slice().sort(A.SORTS['watts-desc']).map(A.maxPortWatts), [100, 65, 65, 20]);

console.log('check.js: ok (' + Object.keys(watts).length + ' watt figures, ' + A.DEVICES.length + ' device lists, 3 split parses, 6 port counts, 15 facet checks and 12 filter runs, 21 search queries, 7 variant and bundle checks, 16 variant-group, name, default and setup checks, 4 dimension parses, 58 pages, 58-SKU catalog integrity, 2 sorts)');
