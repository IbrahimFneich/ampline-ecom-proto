/* Ampline — shared catalog logic and page helpers. Vanilla JS, no build step.
   The pure functions above the export guard are checked by check.js; everything
   below it touches the DOM and is shared by index.html and the shop pages. */
(function () {
  'use strict';

  /* ---------- Catalog truth ---------- */

  // Device families the picker offers. A compat entry matches a device when it
  // contains one `inc` token and none of the `exc` tokens. Tokens are lower-case
  // substrings of the catalog's own compat strings; a token prefixed with "="
  // must equal the whole entry (e.g. "=phones" for the catalog's bare "Phones").
  // Devices come from content/products.json (devices[]): id, name, family, connector,
  // max_charge_w and aliases, the prose compat strings the original SKUs use.
  // setDevices() is called once the catalog loads; check.js calls it directly.
  var DEVICES = [];
  var FAMILIES = [
    { id: 'iphone', name: 'iPhone' }, { id: 'android', name: 'Android' }, { id: 'ipad', name: 'iPad' },
    { id: 'mac', name: 'Mac' }, { id: 'windows-laptop', name: 'Windows laptop' },
    { id: 'switch-steam-deck', name: 'Switch & Steam Deck' }, { id: 'watch-earbuds', name: 'Watch & earbuds' }
  ];
  function setDevices(list) { DEVICES.length = 0; list.forEach(function (d) { DEVICES.push(d); }); return DEVICES; }
  function deviceById(id) { return DEVICES.find(function (d) { return d.id === id; }) || null; }
  function deviceGroups() {
    return FAMILIES.map(function (f) {
      return { id: f.id, name: f.name, devices: DEVICES.filter(function (d) { return d.family === f.id; }) };
    }).filter(function (g) { return g.devices.length; });
  }

  // The sentence under a device's charge figure: a model with its own published figure says so, a model
  // without one names the bucket it sits in, a catch-all bucket admits it is a typical figure.
  function ceilingNote(d) {
    var parent = d.parent ? deviceById(d.parent) : null;
    if (/^Other\b/.test(d.name)) return 'A typical figure for this group, not a maker\u2019s number.';
    if (parent && d.max_charge_w !== parent.max_charge_w) return 'The ' + d.name + '\u2019s own ceiling, as its maker publishes it.';
    return 'The catalog\u2019s ceiling for ' + (parent || d).name + (parent ? ', which this model sits in' : '') + '; your model may take less.';
  }
  // Category nouns for counts: "1 case or mount", "3 cables".
  var NOUNS = {
    all: ['product', 'products'], chargers: ['charger', 'chargers'], cables: ['cable', 'cables'], 'power-banks': ['power bank', 'power banks'],
    hubs: ['hub or dock', 'hubs and docks'], car: ['car charger', 'car chargers'], wireless: ['wireless charger', 'wireless chargers'],
    phones: ['phone', 'phones'], laptops: ['laptop', 'laptops'], tablets: ['tablet', 'tablets'], audio: ['audio product', 'audio products'],
    wearables: ['wearable', 'wearables'], gaming: ['gaming product', 'gaming products'], networking: ['networking product', 'networking products'],
    'smart-home': ['smart home device', 'smart home devices'], 'cases-and-mounts': ['case or mount', 'cases and mounts']
  };
  function nounFor(slug, n) { var pair = NOUNS[slug] || ['product', 'products']; return n === 1 ? pair[0] : pair[1]; }

  // Spec labels that carry an output figure, in priority order.
  var OUTPUT_LABELS = ['Max output', 'Output', 'Phone', 'Wired', 'Wireless', 'Power', 'Tips'];

  // A compat entry fits a device when it is that device's id or one of its aliases
  // (the prose strings the original SKUs use, recorded on the device itself).
  function entryFits(c, device) { return c === device.id || device.aliases.indexOf(c) >= 0; }
  // A model (a device with a parent) fits everything its family bucket fits, plus what names the model itself.
  function fits(product, device) {
    if (!device) return false;
    return (product.compat || []).some(function (c) { return entryFits(c, device); }) || (!!device.parent && fits(product, deviceById(device.parent)));
  }
  function matchedCompat(product, device) {
    var own = (product.compat || []).filter(function (c) { return entryFits(c, device); });
    return own.length || !device.parent ? own : matchedCompat(product, deviceById(device.parent));
  }

  function spec(product, labels) {
    for (var i = 0; i < labels.length; i++) {
      var s = product.specs.find(function (x) { return x.label === labels[i]; });
      if (s) return s;
    }
    return null;
  }

  // Watt figures in a spec value. "Wh" is energy, not power, and "(45W total)"
  // is a sum, not a port, so both are skipped. "(85W to host)" is the figure
  // the connected device actually receives, so it wins when present.
  function wattsIn(value) {
    var host = /(\d+(?:\.\d+)?)\s?W to host/i.exec(value);
    if (host) return [parseFloat(host[1])];
    var out = [], re = /(\d+(?:\.\d+)?)\s?W(?![a-z])(?!\s*total)/gi, m;
    while ((m = re.exec(value))) out.push(parseFloat(m[1]));
    return out;
  }

  // The most watts one port can deliver, read from the first output-bearing spec.
  function maxPortWatts(product) {
    for (var i = 0; i < OUTPUT_LABELS.length; i++) {
      var s = spec(product, [OUTPUT_LABELS[i]]);
      if (s) {
        var w = wattsIn(s.value);
        if (w.length) return Math.max.apply(null, w);
      }
    }
    return null;
  }

  // Shared-output scenarios, e.g. "45W + 20W, or 30W + 20W + 15W" -> [[45,20],[30,20,15]].
  function splits(product) {
    var out = [];
    product.specs.forEach(function (s) {
      if (s.value.indexOf('+') < 0) return;
      s.value.split(/,\s*or\s+/i).forEach(function (part) {
        if (part.indexOf('+') < 0) return;
        var w = wattsIn(part);
        if (w.length > 1) out.push(w);
      });
    });
    return out;
  }

  // Port counts, e.g. "2x USB-C PD 3.0, 1x USB-A" -> { c: 2, a: 1 }. A port named
  // without a count ("65W USB-C + 2x USB-A") counts once.
  function ports(product) {
    var s = spec(product, ['Ports', 'USB', 'Output', 'Wired']);
    if (!s) return { c: 0, a: 0 };
    var c = /(\d+)\s*x\s*USB-C/i.exec(s.value), a = /(\d+)\s*x\s*USB-A/i.exec(s.value);
    return {
      c: c ? +c[1] : (/USB-C/i.test(s.value) ? 1 : 0),
      a: a ? +a[1] : (/USB-A/i.test(s.value) ? 1 : 0)
    };
  }

  /* ---------- Filters (category pages) ---------- */

  var WATT_BANDS = [
    { id: '0-30', label: 'Up to 30W', test: function (p) { return maxPortWatts(p) <= 30; } },
    { id: '31-65', label: '31 to 65W', test: function (p) { var w = maxPortWatts(p); return w > 30 && w <= 65; } },
    { id: '66-up', label: '66W and up', test: function (p) { return maxPortWatts(p) > 65; } }
  ];
  var PORT_OPTS = [
    { id: 'c2', label: 'Two or more USB-C', test: function (p) { return ports(p).c >= 2; } },
    { id: 'a1', label: 'Has USB-A', test: function (p) { return ports(p).a >= 1; } },
    { id: 'one', label: 'Single port', test: function (p) { var o = ports(p); return o.c + o.a === 1; } }
  ];
  var PRICE_BANDS = [
    { id: 'u20', label: 'Under $20', test: function (p) { return p.price < 20; } },
    { id: '20-50', label: '$20 to $50', test: function (p) { return p.price >= 20 && p.price <= 50; } },
    { id: 'o50', label: 'Over $50', test: function (p) { return p.price > 50; } }
  ];
  var TYPE_LABELS = {
    wall: 'Wall', desktop: 'Desktop', travel: 'Travel adapter', 'usb-c': 'USB-C', lightning: 'Lightning',
    '3-in-1': '3-in-1', magnetic: 'Magnetic', laptop: 'Laptop', hub: 'Hub', car: 'Car', stand: 'Stand'
  };
  var OPTS = { w: WATT_BANDS, ports: PORT_OPTS, price: PRICE_BANDS };

  /* ---------- Facets: filter groups read from each category's facets ---------- */

  function slugify(v) { return String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function specVal(p, label) { var s = spec(p, [label]); return s ? s.value : null; }
  function categoryOf(p, categories) { return (categories || []).find(function (c) { return c.slug === p.category; }); }

  // A product's value(s) for a facet label, normalised to something worth filtering on:
  // a screen size, a storage figure, a chip maker, a Wi-Fi generation, a yes or no, a connectivity token.
  function facetValues(p, label, categories) {
    var v, m;
    if (label === 'Brand') return [p.brand || 'Ampline'];
    if (label === 'Group') { var c = categoryOf(p, categories); return c ? [c.group] : []; }
    if (label === 'Type') {
      if (p.type) return [TYPE_LABELS[p.type] || p.type];
      v = specVal(p, 'Type'); return v ? [v] : [];
    }
    v = specVal(p, label);
    if (v == null) return [];
    switch (label) {
      case 'Screen': m = /(\d+(?:\.\d+)?)-inch/.exec(v); return [m ? m[1] + '-inch' : v];
      case 'Memory': case 'Storage': case 'Capacity': m = /([\d,.]+\s*(?:GB|TB|mAh))/i.exec(v); return [m ? m[1] : v];
      case 'Processor': return [v.split(/\s+/)[0]];
      case 'Wi-Fi standard': m = /Wi-Fi \d/.exec(v); return [m ? m[0] : v];
      case 'Noise cancelling': return [/^yes/i.test(v) ? 'Yes' : 'No'];
      case 'Connectivity': return v.split(/,\s*/).map(function (x) { return x.replace(/\s*\(.*\)/, '').replace(/^(Wi-Fi|Bluetooth|GPS)\b.*/i, '$1').trim(); });
      case 'Length': m = /^(\d+(?:\.\d+)?\s*m)\b/.exec(v); return [m ? m[1] : v];
      default: return [v];
    }
  }
  function naturalCompare(a, b) {
    var na = parseFloat(String(a).replace(/,/g, '')), nb = parseFloat(String(b).replace(/,/g, ''));
    if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
    return String(a).localeCompare(String(b));
  }
  // The options a facet offers within a pool: price bands, port options and watt bands are fixed
  // vocabularies; everything else is the distinct normalised values the pool actually carries.
  // Price bands follow the pool: a charger list and a laptop list need different thresholds.
  function priceBands(pool) {
    var max = Math.max.apply(null, pool.map(function (p) { return p.price; }).concat([0]));
    var t = max <= 100 ? [20, 50] : max <= 400 ? [50, 150] : max <= 1500 ? [300, 800] : [500, 1500];
    var fmt = function (n) { return '$' + n.toLocaleString('en-US'); };
    return [
      { id: 'p1', label: 'Under ' + fmt(t[0]), test: function (p) { return p.price < t[0]; } },
      { id: 'p2', label: fmt(t[0]) + ' to ' + fmt(t[1]), test: function (p) { return p.price >= t[0] && p.price <= t[1]; } },
      { id: 'p3', label: 'Over ' + fmt(t[1]), test: function (p) { return p.price > t[1]; } }
    ];
  }
  // Coverage and battery specs mix units ("Up to 18 h", "Up to 13 days", "Adds up to 150 m²", "Up to 10 devices"),
  // so they filter by band rather than by raw value; a product without a parseable figure sits in no band.
  function coverageM2(p) { var v = specVal(p, 'Coverage'), m = v && /(\d+)\s*m²/.exec(v); return m ? parseInt(m[1], 10) : null; }
  function batteryHours(p) {
    var v = specVal(p, 'Battery'), m = v && /(\d+(?:\.\d+)?)\s*(h|hours?|days?)\b/i.exec(v);
    return m ? parseFloat(m[1]) * (/^d/i.test(m[2]) ? 24 : 1) : null;
  }
  var COVERAGE_BANDS = [
    { id: 'c1', label: 'Up to 200 m²', test: function (p) { var n = coverageM2(p); return n != null && n <= 200; } },
    { id: 'c2', label: 'Over 200 m²', test: function (p) { var n = coverageM2(p); return n != null && n > 200; } }
  ];
  var BATTERY_BANDS = [
    { id: 'b1', label: 'Under a day', test: function (p) { var h = batteryHours(p); return h != null && h < 24; } },
    { id: 'b2', label: '1 to 3 days', test: function (p) { var h = batteryHours(p); return h != null && h >= 24 && h <= 72; } },
    { id: 'b3', label: 'Over 3 days', test: function (p) { var h = batteryHours(p); return h > 72; } }
  ];
  var GROUP_ORDER = ['Devices', 'Accessories', 'Power'];
  function facetOptions(label, pool, categories) {
    if (label === 'Price') return priceBands(pool);
    if (label === 'Coverage') return COVERAGE_BANDS;
    if (label === 'Battery') return BATTERY_BANDS;
    if (label === 'Ports') return PORT_OPTS;
    if (OUTPUT_LABELS.indexOf(label) >= 0) return WATT_BANDS;
    var seen = {}, out = [];
    pool.forEach(function (p) {
      facetValues(p, label, categories).forEach(function (val) {
        var id = slugify(val);
        if (!seen[id]) {
          seen[id] = true;
          out.push({ id: id, label: val, test: function (q) { return facetValues(q, label, categories).indexOf(val) >= 0; } });
        }
      });
    });
    return out.sort(function (a, b) {
      if (label === 'Group') return GROUP_ORDER.indexOf(a.label) - GROUP_ORDER.indexOf(b.label); // the nav order, not A to Z
      return naturalCompare(a.label, b.label);
    });
  }
  function legendFor(label) { return OUTPUT_LABELS.indexOf(label) >= 0 ? 'Max output per port' : label; }

  // Search: every token of q must appear in the product's name, brand, category name, badges or spec values.
  /* Search. The query and the haystack share one normalisation, so "type-c", "usb c", "powerbank" and "65 w"
     meet "USB-C", "Power Bank" and "65W". A device name, a family word or an in-range model number in the query
     ("iphone 16", "iphone 13", "macbook", "android") becomes a fit test: the product fits that device, or names it. */
  var SYNONYMS = [
    [/\b(?:type|usb)[\s-]?c\b/g, 'usb-c'], [/\bpower\s*banks?\b/g, 'powerbank'], [/\bmag\s+safe\b/g, 'magsafe'],
    [/(\d),(\d{3})\b/g, '$1$2'], [/\b(\d+)\s+(w|gb|tb|mah|mm|m|hz)\b/g, '$1$2']
  ];
  function normalise(s) {
    s = String(s || '').toLowerCase();
    SYNONYMS.forEach(function (r) { s = s.replace(r[0], r[1]); });
    return s;
  }
  var FAMILY_WORDS = { iphone: ['iphone'], android: ['android'], ipad: ['ipad'], mac: ['mac', 'macbook'], 'windows-laptop': ['windows laptop'] };
  var phraseCache = null, parsedCache = { q: null, out: null };
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  // Every phrase a shopper might type for a device: the family word, the device name, the name without its
  // parenthetical or maker prefix, and for "N to M" / "N or newer" buckets a numeric range on the leading word.
  function devicePhrases() {
    if (phraseCache && phraseCache.n === DEVICES.length) return phraseCache.list;
    var list = [];
    Object.keys(FAMILY_WORDS).forEach(function (fam) {
      var devs = DEVICES.filter(function (d) { return d.family === fam; });
      if (devs.length) FAMILY_WORDS[fam].forEach(function (w) { list.push({ phrase: w, devices: devs }); });
    });
    DEVICES.forEach(function (d) {
      var full = normalise(d.name), bare = full.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
      var forms = [full, bare, bare.replace(/^(?:samsung|google|dell|nintendo)\s+/, '')];
      var range = bare.match(/^([a-z]+)\s+(\d+)\s+(?:to\s+(\d+)|or newer)$/);
      forms.forEach(function (f) {
        if (f && !list.some(function (x) { return x.phrase === f; })) list.push({ phrase: f, devices: [d] });
      });
      if (range) list.push({ phrase: null, word: range[1], lo: +range[2], hi: range[3] ? +range[3] : Infinity, devices: [d] });
    });
    phraseCache = { n: DEVICES.length, list: list };
    return list;
  }
  // -> { tokens: [...remaining words], device: { phrase, devices } | null }. The longest device phrase wins; an exact name beats a range.
  function parseQuery(q) {
    var s = normalise(String(q || '').slice(0, 120)).replace(/[“”"']/g, ' ').replace(/\s+/g, ' ').trim();
    if (parsedCache.q === s) return parsedCache.out;
    var padded = ' ' + s + ' ', best = null;
    devicePhrases().forEach(function (x) {
      var m = null;
      if (x.phrase) { if (padded.indexOf(' ' + x.phrase + ' ') >= 0) m = { text: x.phrase, exact: true }; }
      else {
        var r = new RegExp(' ' + escapeRe(x.word) + ' (\\d+) ').exec(padded);
        if (r && +r[1] >= x.lo && +r[1] <= x.hi) m = { text: x.word + ' ' + r[1], exact: false };
      }
      if (m && (!best || m.text.length > best.text.length || (m.text.length === best.text.length && m.exact && !best.exact))) best = { text: m.text, exact: m.exact, devices: x.devices };
    });
    var rest = best ? padded.replace(' ' + best.text + ' ', ' ') : padded;
    var out = { tokens: rest.trim().split(' ').filter(Boolean), device: best ? { phrase: best.text, devices: best.devices } : null };
    parsedCache = { q: s, out: out };
    return out;
  }
  function hayOf(p, categories) {
    var c = categoryOf(p, categories);
    return normalise([p.name, p.brand || 'Ampline', c ? c.name : '', p.short].concat(p.badges, p.specs.map(function (s) { return s.label + ' ' + s.value; })).join(' '));
  }
  // A bare number matches a whole number ("7" finds Wi-Fi 7, not Watch7 or 7040 mAh; "16" finds "iPhone 16, 128 GB"); words match anywhere.
  function tokenIn(hay, t) {
    if (!/^\d+$/.test(t)) return hay.indexOf(t) >= 0;
    return new RegExp('(^|[^a-z0-9.,])' + t + '(?=$|[^a-z0-9.,]|,(?!\\d{3}))').test(hay);
  }
  function matchesQuery(p, q, categories) {
    var parsed = parseQuery(q);
    if (!parsed.tokens.length && !parsed.device) return true;
    var hay = hayOf(p, categories);
    if (parsed.device && hay.indexOf(parsed.device.phrase) < 0 && !parsed.device.devices.some(function (d) { return fits(p, d); })) return false;
    return parsed.tokens.every(function (t) { return tokenIn(hay, t); });
  }
  // Featured order under a search: a product named by the query outranks one that only carries it in a spec;
  // a category hit breaks ties, so "case" lists cases before earbuds whose charging case is in the name.
  function searchRank(p, q, categories) {
    var parsed = parseQuery(q), toks = parsed.tokens.concat(parsed.device ? [parsed.device.phrase] : []);
    if (!toks.length) return 0;
    var c = categoryOf(p, categories), name = normalise(p.name), cat = normalise(c ? c.name : '');
    var inName = toks.filter(function (t) { return tokenIn(name, t); }).length, inCat = toks.filter(function (t) { return tokenIn(cat, t); }).length;
    return inName * 2 + inCat;
  }

  // f = { device: id|null, q: '', facets: { <label>: [optionIds] } }; defs = [{ label, opts }].
  // Within a facet selections are OR, across facets AND. `over` swaps one facet's selection
  // (or the device, label 'device'), which is how would-be counts are computed.
  function passes(p, f, defs, over, categories) {
    var device = over && over.group === 'device' ? (over.ids[0] || null) : f.device;
    if (device) {
      var d = deviceById(device);
      if (d && !fits(p, d)) return false;
    }
    if (f.q && !matchesQuery(p, f.q, categories)) return false;
    return defs.every(function (def) {
      var ids = over && over.group === def.label ? over.ids : (f.facets[def.label] || []);
      return !ids.length || def.opts.some(function (o) { return ids.indexOf(o.id) >= 0 && o.test(p); });
    });
  }

  // Outer dimensions from the "Size" spec, e.g. "52 x 48 x 30 mm, 112 g" -> { w, h, d, g }.
  function dimensions(product) {
    var s = spec(product, ['Size']);
    var m = s && /(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*mm(?:,\s*(\d+)\s*g)?/i.exec(s.value);
    return m ? { w: +m[1], h: +m[2], d: +m[3], g: m[4] ? +m[4] : null } : null;
  }

  // Region plug variants, read from the "Plug" spec ("Foldable UK / EU / US (region variants)").
  function variants(product) {
    var s = spec(product, ['Plug']);
    var regions = s ? (s.value.match(/\b(UK|EU|US|AU)\b/g) || []) : [];
    return regions.length > 1 ? regions : []; // one region is a fact, not a choice
  }

  // The one honest upsell: a charger whose box holds no cable pairs with the
  // strongest in-stock cable. Anything else has no bundle.
  function bundleFor(product, products) {
    if (product.category !== 'chargers') return null;
    if (product.in_box.some(function (x) { return /cable/i.test(x); })) return null;
    return products.filter(function (q) { return q.category === 'cables' && q.stock !== 'out_of_stock'; })
      .sort(function (a, b) { return maxPortWatts(b) - maxPortWatts(a); })[0] || null;
  }

  // Variant groups the buy box offers: the plug region from the Plug spec, then the catalog's
  // variants object (color, storage, pack). Every option shares the SKU's one synthetic price.
  var VARIANT_LEGENDS = { plug: 'Plug region', color: 'Colour', storage: 'Storage', pack: 'Pack' };
  function variantGroups(product) {
    var groups = [], regions = variants(product);
    if (regions.length) groups.push({ key: 'plug', legend: VARIANT_LEGENDS.plug, opts: regions.map(function (r) { return r + ' plug'; }) });
    Object.keys(product.variants || {}).forEach(function (k) {
      var opts = product.variants[k];
      if (opts && opts.length > 1) groups.push({ key: k, legend: VARIANT_LEGENDS[k] || k.charAt(0).toUpperCase() + k.slice(1), opts: opts }); // one option is a fact, not a choice
    });
    return groups;
  }
  // The preselected option is the one the SKU already is: the tier or pack in its name or Storage spec, else the first.
  function defaultVariant(product, group) {
    var hay = (product.name + ' ' + ((spec(product, ['Storage']) || { value: '' }).value)).toLowerCase();
    return group.opts.find(function (o) { return hay.indexOf(String(o).toLowerCase()) >= 0; }) || group.opts[0];
  }
  // A name that carries a tier ("iPhone 16, 128 GB", "Tapo P100, 2-pack") follows the chosen storage or pack,
  // so a cart line never says 128 GB over a 256 GB choice. The last GB/TB figure is the storage tier (memory comes first).
  function variantName(product, label) {
    var name = product.name, parts = String(label || '').split(' · ');
    parts.forEach(function (v) {
      var tier = /^\d+\s*(GB|TB)$/i.test(v), pack = /^\d+-pack$/i.test(v);
      if (tier) { var all = name.match(/\d+\s*(GB|TB)/gi) || []; if (all.length) { var i = name.lastIndexOf(all[all.length - 1]); name = name.slice(0, i) + v + name.slice(i + all[all.length - 1].length); } }
      if (pack && /\d+-pack/i.test(name)) name = name.replace(/\d+-pack/i, v);
    });
    return name;
  }
  // "Complete your setup": the Ampline accessories and power products the catalog lists for the device a product is.
  function setupFor(product, products) {
    var d = deviceById(product.device);
    return d ? products.filter(function (q) { return (!q.brand || q.brand === 'Ampline') && q.id !== product.id && fits(q, d); }) : [];
  }

  var SORTS = {
    featured: null,
    'price-asc': function (a, b) { return a.price - b.price; },
    'price-desc': function (a, b) { return b.price - a.price; },
    'watts-desc': function (a, b) { return maxPortWatts(b) - maxPortWatts(a); },
    'rating-desc': function (a, b) { return b.rating.value - a.rating.value; }
  };

  var Ampline = {
    DEVICES: DEVICES, FAMILIES: FAMILIES, setDevices: setDevices, deviceById: deviceById, deviceGroups: deviceGroups,
    fits: fits, maxPortWatts: maxPortWatts, splits: splits, ports: ports,
    WATT_BANDS: WATT_BANDS, PORT_OPTS: PORT_OPTS, PRICE_BANDS: PRICE_BANDS, TYPE_LABELS: TYPE_LABELS,
    passes: passes, SORTS: SORTS, variants: variants, bundleFor: bundleFor, matchedCompat: matchedCompat,
    dimensions: dimensions, spec: spec, facetValues: facetValues, facetOptions: facetOptions, legendFor: legendFor,
    matchesQuery: matchesQuery, parseQuery: parseQuery, searchRank: searchRank, slugify: slugify, priceBands: priceBands, money: money, variantGroups: variantGroups, setupFor: setupFor, variantName: variantName, defaultVariant: defaultVariant, ceilingNote: ceilingNote, nounFor: nounFor
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Ampline;
  if (typeof document === 'undefined') return;
  window.Ampline = Ampline;

  /* ---------- Shared page helpers ---------- */

  var FIG = {
    'AMP-GAN-65': 'fig-wall', 'AMP-GAN-100D': 'fig-desk', 'AMP-NANO-20': 'fig-nano',
    'AMP-CBL-C100-2M': 'fig-cable-c', 'AMP-CBL-CL-1M': 'fig-cable-l', 'AMP-CBL-3IN1': 'fig-cable-3',
    'AMP-PB-MAG10': 'fig-bank-mag', 'AMP-PB-20K65': 'fig-bank-lap', 'AMP-HUB-7': 'fig-hub',
    'AMP-CAR-45': 'fig-car', 'AMP-WL-3IN1': 'fig-stand', 'AMP-TRV-65': 'fig-travel'
  };
  // Third-party products have no figure of their own; their category's line art stands in.
  var FIG_CAT = {
    phones: 'fig-phone', laptops: 'fig-laptop', tablets: 'fig-tablet', audio: 'fig-headphones', wearables: 'fig-watch',
    gaming: 'fig-controller', networking: 'fig-router', 'smart-home': 'fig-plug', 'cases-and-mounts': 'fig-case'
  };
  function figFor(p) {
    if (FIG[p.id]) return FIG[p.id];
    if (p.category === 'cases-and-mounts') {
      var t = (spec(p, ['Type']) || { value: '' }).value.toLowerCase();
      if (/stand/.test(t)) return 'fig-lstand';
      if (/folio|tablet/.test(t)) return 'fig-folio';
      if (/mount/.test(t)) return 'fig-mount';
    }
    return FIG_CAT[p.category] || 'fig-case';
  }
  // The two facts a listing card leads with when a product delivers no power: its first two facets.
  function facetLine(p) {
    var cat = state.categories.find(function (c) { return c.slug === p.category; });
    var labels = (cat && cat.facets || []).filter(function (f) { return f !== 'Brand' && f !== 'Price'; }).slice(0, 2);
    return labels.map(function (l) {
      var s = p.specs.find(function (x) { return x.label === l; });
      if (!s) return null;
      var low = s.value.toLowerCase(); // "Yes, adaptive" reads as "Noise cancelling", "No" as "No noise cancelling"
      return /^yes\b/.test(low) ? l : /^no\b/.test(low) ? 'No ' + l.toLowerCase() : s.value;
    }).filter(Boolean).join(' · ');
  }
  var HOT_BADGES = ['Best seller', 'New'];
  var STOCK = {
    in_stock: ['', 'In stock'],
    low_stock: ['stock--low', 'Low stock'],
    out_of_stock: ['stock--out', 'Out of stock']
  };
  var CART_KEY = 'ampline.cart';
  // Pages that exist in the prototype. Unbuilt destinations render as marked
  // placeholders, never as links to a 404.
  // Scroll rows: the markup and the prev/next controls shared by home's featured rows and the product page's setup row.
  function rowMarkup(id, tilesHtml) {
    return '<div class="rowwrap"><button type="button" class="rowbtn rowbtn--prev" data-row-step="-1" aria-label="Scroll back"><svg aria-hidden="true"><use href="#i-chevron"/></svg></button>' +
      '<div class="row" id="' + id + '">' + tilesHtml + '</div>' +
      '<button type="button" class="rowbtn rowbtn--next" data-row-step="1" aria-label="Scroll forward"><svg aria-hidden="true"><use href="#i-chevron"/></svg></button></div>';
  }
  function syncRows() {
    document.querySelectorAll('.rowwrap').forEach(function (w) {
      var row = w.querySelector('.row'), max = row.scrollWidth - row.clientWidth - 1;
      w.querySelector('.rowbtn--prev').hidden = row.scrollLeft <= 0;
      w.querySelector('.rowbtn--next').hidden = row.scrollLeft >= max;
    });
  }
  document.addEventListener('scroll', function (e) { if (e.target.classList && e.target.classList.contains('row')) syncRows(); }, true);
  window.addEventListener('resize', syncRows);
  document.addEventListener('click', function (e) {
    var step = e.target.closest('[data-row-step]');
    if (!step) return;
    var row = step.parentNode.querySelector('.row');
    row.scrollBy({ left: row.clientWidth * 0.9 * (+step.dataset.rowStep), behavior: 'smooth' });
  });

  var ROUTES = {
    product: ["gan-65w-3-port-charger", "gan-100w-desktop-charger", "nano-20w-usb-c-charger", "universal-travel-adapter-65w", "usb-c-100w-braided-cable-2m", "usb-c-to-lightning-mfi-cable-1m", "3-in-1-100w-cable", "magnetic-10000mah-power-bank", "20000mah-65w-laptop-power-bank", "7-in-1-usb-c-hub", "45w-dual-port-car-charger", "3-in-1-wireless-charging-stand", "apple-iphone-16-128gb", "apple-iphone-15-128gb", "samsung-galaxy-s25-256gb", "samsung-galaxy-s25-ultra-512gb", "samsung-galaxy-a56-128gb", "google-pixel-9-128gb", "apple-macbook-air-13-m3", "apple-macbook-pro-16-m4-pro", "lenovo-ideapad-slim-5-15", "lenovo-thinkpad-x1-carbon-gen-12", "samsung-galaxy-book4-15", "apple-ipad-10th-gen-64gb", "apple-ipad-air-11-m2-128gb", "apple-ipad-pro-11-m4-256gb", "samsung-galaxy-tab-s9-fe-128gb", "samsung-galaxy-tab-a9-plus-64gb", "sony-wh-1000xm5", "sony-wf-1000xm5", "apple-airpods-pro-2-usb-c", "samsung-galaxy-buds3", "sony-srs-xb100", "apple-watch-series-10-42mm", "apple-watch-se-2nd-gen-40mm", "samsung-galaxy-watch7-40mm", "samsung-galaxy-fit3", "google-pixel-watch-3-41mm", "sony-playstation-5-slim-1tb", "sony-dualsense-wireless-controller", "nintendo-switch-oled", "logitech-g435-lightspeed", "logitech-g502-x", "tp-link-deco-x50-3-pack", "tp-link-archer-ax55", "tp-link-archer-be230", "tp-link-re605x", "tp-link-m7350-4g-mobile-wifi", "tp-link-tapo-p100-2-pack", "tp-link-tapo-c210", "tp-link-tapo-l530e", "google-nest-mini-2nd-gen", "apple-homepod-mini", "apple-iphone-16-silicone-case-magsafe", "samsung-galaxy-s25-clear-case", "ampline-magnetic-dash-mount", "ampline-aluminium-laptop-stand", "apple-smart-folio-ipad-air-11"],
    shop: ['all', 'chargers', 'cables', 'power-banks', 'hubs', 'car', 'wireless', 'phones', 'laptops', 'tablets', 'audio', 'wearables', 'gaming', 'networking', 'smart-home', 'cases-and-mounts']
  };
  function productHref(p, base, query) {
    return ROUTES.product.indexOf(p.slug) >= 0 ? (base || '') + 'product/' + p.slug + '.html' + (query || '') : null;
  }
  var state = { products: [], categories: [] };

  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function money(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  // Keep hyphenated tokens (USB-C, 3-Port) on one line in tile names.
  // Hyphenated tokens and "figure unit" pairs (24 GB, 2 m, 42 mm) never break across lines.
  function nb(text) { return esc(text).replace(/\S+-\S+/g, '<span class="nb">$&</span>').replace(/\b(\d[\d,.]*) (GB|TB|mAh|mm|m|W|Hz)\b/g, '<span class="nb">$1 $2</span>'); }
  // Pages show one sentence per product: the catalog's second sentences can
  // carry charge-time claims the surface briefs forbid on listing pages.
  function firstSentence(text) { return (/^.*?[.!?](?=\s|$)/.exec(text) || [text])[0]; }
  function byId(id) { return state.products.find(function (p) { return p.id === id; }); }
  function keyParts(key) { var i = key.indexOf('|'); return i < 0 ? [key, ''] : [key.slice(0, i), key.slice(i + 1)]; }

  /* Cart drawer, shared by every page: a native dialog injected once, lines
     with quantity and remove, a subtotal, an empty state, and a checkout that
     stubs to a thank-you panel. Items live in localStorage under one key. */
  var AREAS = ['Beirut', 'Jounieh', 'Byblos', 'Tripoli', 'Saida', 'Tyre', 'Zahle', 'Baabda', 'Aley', 'Batroun', 'Jdeideh', 'Dbayeh', 'Nabatieh', 'Broummana', 'Elsewhere in Lebanon'];
  var MINUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>';
  var PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12M12 6v12"/></svg>';
  var items = (function () { try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { return {}; } })();
  var base = document.body.dataset.base || '';
  var dialog = null, done = null;

  function lines() {
    return Object.keys(items).filter(function (k) { return items[k] > 0 && byId(keyParts(k)[0]); }).map(function (k) {
      var parts = keyParts(k), p = byId(parts[0]);
      var variant = /^(UK|EU|US|AU)$/.test(parts[1]) ? parts[1] + ' plug' : parts[1]; // keys written before variants carried their own label
      return { key: k, p: p, variant: variant, name: variantName(p, variant), n: items[k], total: items[k] * p.price };
    });
  }

  var cart = {
    items: items,
    add: function (id, n) { items[id] = (items[id] || 0) + (n || 1); cart.save(); },
    remove: function (id) { delete items[id]; cart.save(); },
    change: function (id, delta) { items[id] = (items[id] || 0) + delta; if (items[id] <= 0) delete items[id]; cart.save(); },
    has: function (id) { return Object.keys(items).some(function (k) { return keyParts(k)[0] === id && items[k] > 0; }); },
    save: function () {
      try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* private mode: the cart lives for the page */ }
      cart.render();
      document.dispatchEvent(new CustomEvent('ampline:cart'));
    },
    open: function () { done = null; cart.render(); if (dialog && !dialog.open) dialog.showModal(); },
    close: function () { if (dialog && dialog.open) dialog.close(); },
    checkout: function (details) {
      var ls = lines();
      if (!ls.length) return;
      var total = ls.reduce(function (a, l) { return a + l.total; }, 0), now = new Date().toISOString(), id = nextOrderId();
      var order = { id: id, placed_at: now, status: 'new', payment: details.payment, source: 'storefront',
        customer: { name: details.name, phone: details.phone, city: details.area, area: '', address: '' },
        lines: ls.map(function (l) { return { id: l.p.id, name: l.name, variant: l.variant || '', qty: l.n, price: l.p.price }; }),
        subtotal: Math.round(total * 100) / 100, total: Math.round(total * 100) / 100, history: [{ status: 'new', at: now }], cancel_reason: null };
      done = { id: id, recorded: recordOrder(order), payment: details.payment, lines: ls, total: total };
      Object.keys(items).forEach(function (k) { delete items[k]; });
      cart.save();
    },
    render: function () {
      var prev = focusedControl();
      cart.paint();
      restoreFocus(prev);
    },
    paint: function () {
      var ls = lines(), n = ls.reduce(function (a, l) { return a + l.n; }, 0);
      var badge = $('#cart-n');
      if (badge) {
        badge.textContent = n; badge.dataset.n = n;
        $('#cart-btn').setAttribute('aria-label', 'Cart, ' + n + (n === 1 ? ' item' : ' items'));
      }
      if (!dialog) return;
      var subtotal = ls.reduce(function (a, l) { return a + l.total; }, 0);
      $('#drawer-count').textContent = n ? n + (n === 1 ? ' item' : ' items') : '';
      var body = $('#cart-body'), foot = $('#cart-foot');
      if (done) {
        body.innerHTML = '<div class="thanks">' +
          '<span class="mini thanks__mini" aria-hidden="true"><i style="--pct:0"></i></span>' +
          '<h3 tabindex="-1">Thank you.</h3>' +
          '<p><b>Order ' + esc(done.id) + '</b>' + (done.payment === 'cod' ? ', cash on delivery.' : ', by card.') + ' This prototype stops before payment: nothing was charged and nothing ships.' + (done.recorded ? ' The shop sees it in the admin as New.' : '') + '</p>' +
          '<ul class="thanks__lines">' + done.lines.map(function (l) {
            return '<li><span>' + esc(l.name) + (l.variant ? ' · ' + esc(l.variant) : '') + ' <span class="nb">× ' + l.n + '</span></span><span>' + money(l.total) + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="drawer__sub"><span>Total <span class="syn">synthetic</span></span><b>' + money(done.total) + '</b></p>' +
          '<button type="button" class="btn" data-cart-close>Keep browsing</button>' +
        '</div>';
        foot.hidden = true;
        return;
      }
      if (!ls.length) {
        body.innerHTML = '<div class="empty drawer__empty">' +
          '<span class="mini" aria-hidden="true"><i style="--pct:0"></i></span>' +
          '<h3>Nothing in the cart yet.</h3>' +
          '<p>Add something and it waits here, on this device.</p>' +
          (/\/shop\//.test(location.pathname)
            ? '<button type="button" class="btn btn--ghost" data-cart-close>Back to the list</button>'
            : '<a class="btn btn--ghost" href="' + base + 'shop/all.html">Browse all products</a>') +
        '</div>';
        foot.hidden = true;
        return;
      }
      body.innerHTML = '<ul class="lines">' + ls.map(function (l) {
        return '<li class="line">' +
          '<span class="line__fig" aria-hidden="true"><svg><use href="#' + figFor(l.p) + '"/></svg></span>' +
          '<div class="line__main"><b class="line__name">' + nb(l.name) + '</b>' +
            (l.variant ? '<small>' + esc(l.variant) + '</small>' : '') +
            '<span class="line__price">' + money(l.p.price) + ' each <span class="syn">synthetic</span></span></div>' +
          '<div class="line__qty" role="group" aria-label="Quantity of ' + esc(l.name + (l.variant ? ', ' + l.variant : '')) + '">' +
            '<button type="button" class="qty" data-qty="' + esc(l.key) + '" data-delta="-1" aria-label="One fewer">' + MINUS + '</button>' +
            '<output>' + l.n + '</output>' +
            '<button type="button" class="qty" data-qty="' + esc(l.key) + '" data-delta="1" aria-label="One more">' + PLUS + '</button>' +
          '</div>' +
          '<b class="line__total">' + money(l.total) + '</b>' +
          '<button type="button" class="line__rm" data-remove="' + esc(l.key) + '" aria-label="Remove ' + esc(l.name + (l.variant ? ', ' + l.variant : '')) + '"><svg aria-hidden="true"><use href="#i-x"/></svg></button>' +
        '</li>';
      }).join('') + '</ul>';
      foot.hidden = false;
      foot.innerHTML = '<p class="drawer__sub" aria-live="polite"><span>Subtotal <span class="syn">synthetic</span></span><b>' + money(subtotal) + '</b></p>' +
        '<p class="drawer__note">Delivery across Lebanon in 1 to 3 days · card or cash on delivery</p>' +
        '<form class="co" id="checkout-form" novalidate>' +
          '<label class="co__f"><span class="vh">Your name</span><input type="text" name="name" placeholder="Your name" required autocomplete="name" maxlength="60"></label>' +
          '<label class="co__f"><span class="vh">Phone</span><input type="tel" name="phone" placeholder="Phone, e.g. 03 123 456" required autocomplete="tel" inputmode="tel" maxlength="24"></label>' +
          '<label class="co__f select"><span class="vh">Area</span><select name="area" required><option value="">Where to deliver</option>' + AREAS.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('') + '</select><svg aria-hidden="true"><use href="#i-chevron"/></svg></label>' +
          '<div class="co__pay" role="radiogroup" aria-label="Payment"><input type="radio" class="vh" name="payment" id="pay-cod" value="cod" checked><label class="chip" for="pay-cod">Cash on delivery</label><input type="radio" class="vh" name="payment" id="pay-card" value="card"><label class="chip" for="pay-card">Card</label></div>' +
          '<p class="co__err" id="co-err" role="alert" hidden></p>' +
          '<button type="submit" class="btn btn--big" data-checkout>Checkout</button>' +
        '</form>';
    }
  };

  // The drawer re-renders with innerHTML, so the focused control is remembered
  // by what it does and refocused on its replacement; a vanished control hands
  // focus to the nearest sensible place (next line, the heading, the thanks title).
  function focusedControl() {
    var el = document.activeElement;
    if (!dialog || !dialog.contains(el)) return null;
    var line = el.closest('.line'), index = line ? Array.prototype.indexOf.call(line.parentNode.children, line) : -1;
    if (el.dataset.qty) return { kind: 'qty', key: el.dataset.qty, delta: el.dataset.delta, index: index };
    if (el.dataset.remove) return { kind: 'remove', index: index };
    if (el.hasAttribute('data-checkout')) return { kind: 'checkout' };
    return null;
  }
  function restoreFocus(prev) {
    if (!prev) return;
    var el = null;
    if (prev.kind === 'checkout') el = dialog.querySelector('.thanks h3') || dialog.querySelector('[data-checkout]');
    else if (prev.kind === 'qty') el = dialog.querySelector('[data-qty="' + prev.key.replace(/"/g, '\\"') + '"][data-delta="' + prev.delta + '"]');
    if (!el) {
      var rows = dialog.querySelectorAll('.line');
      var row = rows[Math.min(prev.index, rows.length - 1)];
      el = row ? row.querySelector('.line__rm') : dialog.querySelector('#cart-title');
      if (el && el.id === 'cart-title') el.setAttribute('tabindex', '-1');
    }
    if (el) el.focus();
  }

  function mountDrawer() {
    if (dialog || !$('#cart-btn')) return;
    document.body.insertAdjacentHTML('beforeend',
      '<dialog class="drawer" id="cart" aria-labelledby="cart-title">' +
        '<div class="drawer__head"><h2 id="cart-title">Cart <span class="drawer__count" id="drawer-count"></span></h2>' +
        '<button type="button" class="iconbtn" data-cart-close aria-label="Close cart"><svg aria-hidden="true"><use href="#i-x"/></svg></button></div>' +
        '<div class="drawer__body" id="cart-body"></div>' +
        '<div class="drawer__foot" id="cart-foot" hidden></div>' +
      '</dialog>');
    dialog = $('#cart');
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { done = null; });
    // The thank-you battery fills once, after the panel is painted.
    new MutationObserver(function () {
      var fill = dialog.querySelector('.thanks__mini i[style*="--pct:0"]');
      if (fill) requestAnimationFrame(function () { fill.style.setProperty('--pct', 1); });
    }).observe(dialog, { childList: true, subtree: true });
    $('#cart-btn').addEventListener('click', cart.open);
  }

  /* Product tile, the same component on every page. `base` prefixes relative links. */
  var WATT_CAP = { cables: 'W through the cable', hubs: 'W to the laptop' }; // the product page's captions, in tile form
  // `opts.fit` true marks the tile "Fits", false dims it (a device is chosen and this one does not fit); `opts.cat` shows the category line.
  function tile(p, i, base, query, opts) {
    base = base || ''; opts = opts || {};
    var w = maxPortWatts(p), st = STOCK[p.stock] || STOCK.in_stock, out = p.stock === 'out_of_stock';
    var hotBadge = p.badges.filter(function (b) { return HOT_BADGES.indexOf(b) >= 0; })[0]; // one headline badge rides the well's corner
    var badges = p.badges.filter(function (b) { return b !== hotBadge; }).map(function (b) { return '<span class="tag">' + esc(b) + '</span>'; }).join('');
    var c = categoryOf(p, state.categories), saving = p.compare_at && p.compare_at > p.price ? p.compare_at - p.price : 0;
    var href = productHref(p, base, query);
    var inCart = cart.has(p.id), choose = !!href && !out && variantGroups(p).length > 0; // colour, storage, plug or pack: pick it on the product page
    return '<article class="tile' + (out ? ' tile--out' : '') + (opts.fit === false ? ' tile--dim' : '') + '" style="--i:' + i + '">' +
      (href ? '<a class="tile__fig" href="' + href + '" aria-label="' + esc(p.name) + '">' : '<div class="tile__fig">') +
        (hotBadge ? '<span class="tile__badge tile__badge--hot">' + esc(hotBadge) + '</span>' : '') +
        (opts.fit === true ? '<span class="tile__fit"><svg aria-hidden="true"><use href="#i-check"/></svg>Fits</span>' : '') +
        '<svg aria-hidden="true"><use href="#' + figFor(p) + '"/></svg>' +
        // The catalog's first image path, shown over the drawing when the file exists; a missing file removes itself.
        ((p.images || [])[0] ? '<img class="tile__photo" src="' + esc((base || '') + p.images[0]) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
        (href ? '</a>' : '</div>') +
      (!opts.cat ? '<div class="chipsrow">' + badges + '</div>' : '') + /* the home's category line replaces the tag row */
      (opts.cat && c ? '<p class="tile__cat">' + esc(c.name) + '</p>' : '') +
      '<h3>' + (href ? '<a href="' + href + '">' + nb(p.name) + '</a>' : nb(p.name)) + '</h3>' +
      (p.brand && !opts.cat ? '<p class="tile__brand">' + esc(p.brand) + '</p>' : '') +
      '<p class="tile__short">' + esc(firstSentence(p.short)) + '</p>' +
      (w !== null
        ? '<div class="watts"><b>' + w + '</b><span>' + (WATT_CAP[p.category] || 'W max per port') + '</span></div>' +
          '<span class="mini" aria-hidden="true"><i style="--pct:' + Math.min(1, w / 100) + '"></i></span>'
        : '<p class="tile__facts">' + nb(facetLine(p) || (p.specs[0] ? p.specs[0].value : '')) + '</p>') +
      '<div class="price"><b>' + money(p.price) + '</b>' + (p.compare_at ? '<s>' + money(p.compare_at) + '</s>' : '') + (saving ? '<span class="save">Save ' + money(saving).replace(/\.00$/, '') + '</span>' : '') + '<span class="syn">synthetic</span></div>' +
      '<div class="meta"><span class="stock ' + st[0] + '">' + st[1] + '</span>' + (p.rating && p.rating.count ? '<span class="rating"><svg aria-hidden="true"><use href="#i-star"/></svg>' + p.rating.value.toFixed(1) + ' <span>(' + p.rating.count + ')</span></span>' : '') + '</div>' +
      (choose
        ? '<a class="btn' + (inCart ? ' btn--added' : '') + '" href="' + href + '" data-choose="' + p.id + '">' + (inCart ? '<svg aria-hidden="true"><use href="#i-check"/></svg>In cart' : 'Choose options') + '</a>'
        : '<button type="button" class="btn' + (inCart ? ' btn--added' : '') + '" data-add="' + p.id + '"' + (out ? ' disabled' : '') + '>' +
          (out ? 'Out of stock' : inCart ? '<svg aria-hidden="true"><use href="#i-check"/></svg>In cart' : 'Add to cart') +
        '</button>') +
    '</article>';
  }

  /* Catalog load; `base` is the page's path back to the project root. */
  /* The admin (admin/) keeps its edits in one localStorage key; the storefront layers them over the files,
     so a price, a stock state, a renamed category or an added product shows here on the next load. */
  var ADMIN_KEY = 'ampline:admin:v1';
  function adminOverlay() { try { return JSON.parse(localStorage.getItem(ADMIN_KEY)) || null; } catch (e) { return null; } }
  function applyOverlay(data, ov) {
    if (!ov) return data;
    var pp = ov.products || {}, cr = (ov.categories || {}).renamed || {}, dr = (ov.devices || {}).renamed || {};
    data.products = data.products.map(function (p) { return pp[p.id] ? Object.assign({}, p, pp[p.id]) : p; }).concat(ov.added || []);
    data.categories = data.categories.map(function (c) { return cr[c.slug] ? Object.assign({}, c, { name: cr[c.slug] }) : c; }).concat((ov.categories || {}).added || []);
    data.devices = (data.devices || []).map(function (d) { return dr[d.id] ? Object.assign({}, d, { name: dr[d.id] }) : d; }).concat((ov.devices || {}).added || []);
    return data;
  }
  // A storefront checkout becomes an order the admin lists, in the same key, status New.
  function recordOrder(order) {
    try {
      var ov = adminOverlay() || { orders: {}, placed: [], products: {}, added: [], categories: { renamed: {}, added: [] }, devices: { renamed: {}, added: [] }, settings: {} };
      ov.placed = ov.placed || []; ov.placed.push(order); localStorage.setItem(ADMIN_KEY, JSON.stringify(ov));
      return true;
    } catch (e) { return false; }
  }
  function nextOrderId() { var ov = adminOverlay(); return 'W-' + (1001 + ((ov && ov.placed) ? ov.placed.length : 0)); }
  function load(base) {
    return fetch((base || '') + 'content/products.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        data = applyOverlay(data, adminOverlay());
        state.products = data.products;
        state.categories = data.categories;
        setDevices(data.devices || []);
        cart.render();
        return data;
      });
  }
  function loadError() {
    return '<p class="notice">The catalog did not load. Open this page through a local web server (for example <code>npx serve</code>) so <code>content/products.json</code> can be read.</p>';
  }

  /* Shared events: add to cart, line quantity and removal, checkout, drawer close. */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add && !add.disabled) {
      cart.add(add.dataset.add);
      add.classList.add('btn--added');
      add.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>Added';
      clearTimeout(add._t);
      add._t = setTimeout(function () { add.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>In cart'; }, 1400);
      return;
    }
    var rm = e.target.closest('[data-remove]');
    if (rm) { cart.remove(rm.dataset.remove); return; }
    var qty = e.target.closest('[data-qty]');
    if (qty) { cart.change(qty.dataset.qty, +qty.dataset.delta); return; }
    if (e.target.closest('[data-checkout]')) {
      e.preventDefault();
      var form = $('#checkout-form'), err = $('#co-err');
      var d = form ? { name: form.name.value.trim(), phone: form.phone.value.trim(), area: form.area.value, payment: (form.querySelector('[name=payment]:checked') || {}).value || 'cod' } : null;
      var missing = !d ? [] : [!d.name && 'your name', !d.phone && 'a phone number', !d.area && 'an area'].filter(Boolean);
      if (missing.length) { err.textContent = 'Add ' + missing.join(', ') + ' so the shop can reach you.'; err.hidden = false; form.querySelector(!d.name ? '[name=name]' : !d.phone ? '[name=phone]' : '[name=area]').focus(); return; }
      cart.checkout(d); return;
    }
    if (e.target.closest('[data-cart-close]')) cart.close();
  });
  mountDrawer();

  /* Footer "Shop" list: links for built pages, marked placeholders for the rest. */
  function shopLinks(categories, base, current) {
    var unbuilt = 0;
    var items = categories.map(function (c) {
      if (ROUTES.shop.indexOf(c.slug) >= 0) return '<li><a href="' + base + 'shop/' + c.slug + '.html"' + (c.slug === current ? ' aria-current="page"' : '') + '>' + esc(c.name) + '</a></li>';
      unbuilt++;
      return '<li><span class="soon">' + esc(c.name) + '</span></li>';
    });
    if (unbuilt) items.push('<li><span class="ph">' + unbuilt + (unbuilt === 1 ? ' page' : ' pages') + ' not built</span></li>');
    return items.join('');
  }

  // Count a figure up to its value; instant under reduced motion.
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countTo(el, to) {
    var from = parseFloat(el.textContent) || 0;
    if (reduced || from === to) { el.textContent = to; return; }
    var t0 = performance.now(), dur = 700;
    function step(t) {
      var k = Math.min(1, (t - t0) / dur);
      k = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * k);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  Ampline.countTo = countTo;
  Ampline.FIG = FIG;
  Ampline.figFor = figFor;
  Ampline.ROUTES = ROUTES;
  Ampline.productHref = productHref;
  Ampline.shopLinks = shopLinks;
  /* The category circles: one sideways row, a photo for a category that has one (its best seller's), the drawn
     figure for the house categories; photo categories lead. `query` carries the chosen device into each listing. */
  function catRow(base, query, current) {
    base = base || ''; query = query || '';
    var cats = state.categories, order = cats.filter(function (c) { return c.group === 'Devices'; }).concat(cats.filter(function (c) { return c.group !== 'Devices'; }));
    return order.map(function (c) {
      var list = state.products.filter(function (p) { return p.category === c.slug; }).sort(function (a, b) {
        var ha = a.badges.some(function (x) { return HOT_BADGES.indexOf(x) >= 0; }), hb = b.badges.some(function (x) { return HOT_BADGES.indexOf(x) >= 0; });
        return (hb - ha) || (b.rating.count - a.rating.count);
      });
      var photo = list.map(function (p) { return (p.images || [])[0]; }).filter(Boolean)[0], lead = list[0];
      var built = ROUTES.shop.indexOf(c.slug) >= 0;
      var art = photo ? '<img src="' + esc(base + photo) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : (lead ? '<svg aria-hidden="true"><use href="#' + figFor(lead) + '"/></svg>' : '');
      return '<a href="' + esc(built ? base + 'shop/' + c.slug + '.html' + query : base + 'shop/all.html?group=' + c.group.toLowerCase()) + '"' + (current === c.slug ? ' aria-current="page"' : '') + '><span class="o">' + art + '</span><span>' + esc(c.name) + '</span></a>';
    }).join('');
  }
  Ampline.catRow = catRow;
  Ampline.rowMarkup = rowMarkup;
  Ampline.syncRows = syncRows;
  Ampline.variantGroups = variantGroups;
  Ampline.setupFor = setupFor;
  Ampline.variantName = variantName;
  Ampline.defaultVariant = defaultVariant;
  Ampline.ceilingNote = ceilingNote;
  Ampline.nounFor = nounFor;
  Ampline.state = state;
  Ampline.cart = cart;
  Ampline.tile = tile;
  Ampline.load = load;
  Ampline.loadError = loadError;
  Ampline.esc = esc;
  Ampline.money = money;
  Ampline.byId = byId;
  Ampline.$ = $;
})();
