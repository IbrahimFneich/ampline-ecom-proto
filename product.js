/* Ampline — product page wiring (product/<slug>.html). Shared logic in catalog.js.
   Everything, the gallery drawings included, renders from content/products.json: accessories and
   power products answer "does it fit" and "what does one port give"; devices show their own charge
   ceiling, their colour and storage choices and the Ampline accessories the catalog lists for them. */
(function () {
  'use strict';

  var A = window.Ampline, $ = A.$, esc = A.esc, money = A.money;
  var SLUG = document.body.dataset.slug, BASE = document.body.dataset.base || '';
  var STOCK = { in_stock: ['', 'In stock'], low_stock: ['stock--low', 'Low stock'], out_of_stock: ['stock--out', 'Out of stock'] };
  var HOT = ['Best seller', 'New'];
  var state = { p: null, bundle: null, device: null, choice: {}, groups: [], withBundle: false, setup: [] };

  function device() { return A.deviceById(state.device); }
  function category() { return A.state.categories.find(function (c) { return c.slug === state.p.category; }); }
  function isDevice() { return category().group === 'Devices'; }
  function fitSpec() { var s = A.spec(state.p, ['Fits']); return s ? s.value : ''; }
  // Newer accessories list device ids in compat; the page names the device, the original SKUs keep their prose.
  function compatName(c) { var d = A.deviceById(c); return d ? d.name : c; }
  function compatNames(list) { return list.map(compatName).join(', '); }
  function readUrl() {
    var q = new URLSearchParams(location.search);
    state.device = A.deviceById(q.get('device')) ? q.get('device') : null;
  }
  function writeUrl() {
    var q = new URLSearchParams(location.search);
    if (state.device) q.set('device', state.device); else q.delete('device');
    var qs = q.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }
  function total() { return state.p.price + (state.withBundle && state.bundle ? state.bundle.price : 0); }
  // The chosen variant, as the cart line and the sticky bar name it: "EU plug", "Teal · 256 GB".
  function choiceLabel() { return state.groups.map(function (g) { return state.choice[g.key]; }).filter(Boolean).join(' · '); }
  function displayName() { return A.variantName(state.p, choiceLabel()); }
  function stars(value) {
    var one = '<svg aria-hidden="true"><use href="#i-star"/></svg>';
    return '<span class="stars" style="--r:' + (value / 5) + '"><span class="stars__off">' + one.repeat(5) + '</span><span class="stars__on">' + one.repeat(5) + '</span></span>';
  }

  /* ---------- Head and buy box ---------- */

  function renderHead() {
    var p = state.p, w = A.maxPortWatts(p), own = !w && A.deviceById(p.device);
    // A catch-all family ("Other USB-C laptop") has no published ceiling to show under a model name.
    var ceiling = own && !/^Other\b/.test(own.name) ? own.max_charge_w : 0, max = Math.max(100, ceiling);
    $('#tags').innerHTML = p.badges.map(function (b) {
      return '<span class="tag' + (HOT.indexOf(b) >= 0 ? ' tag--hot' : '') + '">' + esc(b) + '</span>';
    }).join('');
    $('#name').textContent = p.name;
    $('#crumb-name').textContent = p.name;
    var cat = category();
    $('#crumb-cat').innerHTML = A.ROUTES.shop.indexOf(p.category) >= 0
      ? '<a href="' + BASE + 'shop/' + p.category + '.html">' + esc(cat.name) + '</a>'
      : esc(cat.name);
    $('#short').textContent = p.short;
    $('#rating').innerHTML = stars(p.rating.value) + '<a href="#reviews">' + p.rating.value.toFixed(1) + ' · ' + p.rating.count + ' ratings</a> <span class="syn">synthetic</span>';
    $('#price').innerHTML = '<b>' + money(p.price) + '</b>' + (p.compare_at ? '<s>' + money(p.compare_at) + '</s>' : '') + '<span class="syn">synthetic</span>';
    // The glyph reads a port's max output on power products and accessories that carry one; on a device it
    // reads the device's own published charge ceiling, marked indicative; anything else has no glyph.
    var glyph = $('#wattglyph'), cap = $('#watt-cap'), small = cap.nextElementSibling;
    glyph.hidden = !w && !ceiling;
    if (w) { cap.textContent = WATT_CAP[p.category] || 'Max on one port'; small.textContent = 'Of 100W, read from the spec sheet'; }
    else if (ceiling) { cap.textContent = 'Takes up to'; small.textContent = 'The catalog\u2019s ceiling for ' + own.name + '; this model may take less. Indicative.'; }
    $('#fill').style.setProperty('--pct', Math.min(1, (w || ceiling) / max));
    var scale = document.querySelectorAll('#wattglyph .scale span');
    scale[1].textContent = max / 2; scale[2].textContent = max + 'W';
    A.countTo($('#figure-n'), w || ceiling);
  }

  function renderFit() {
    var p = state.p, d = device(), w = A.maxPortWatts(p), el = $('#fit'), glyph = $('#glyph');
    el.hidden = isDevice(); // a device is not fitted to a device
    if (el.hidden) return;
    var mini = function (pct) { return '<span class="mini" aria-hidden="true"><i style="--pct:' + pct + '"></i></span>'; };
    if (!p.compat.length) { // model-specific cases and folios: the family list is too coarse to claim them
      el.className = 'fitline';
      el.innerHTML = mini(0) + '<span><b>Made for ' + esc(fitSpec()) + '.</b> Check the model before buying.</span>';
      return;
    }
    var ok = d ? A.fits(p, d) : true;
    glyph.classList.toggle('is-dormant', !!d && !ok);
    el.className = 'fitline' + (d ? (ok ? ' fitline--ok' : ' fitline--no') : '');
    if (!d) {
      el.innerHTML = mini(0) + '<span>Listed for ' + esc(compatNames(p.compat)) + '. <a href="#fits">Check your device</a></span>';
      return;
    }
    var watts = w ? ' Up to ' + w + 'W on one port, read from the spec sheet; what the device draws is up to the device.' : '';
    el.innerHTML = mini(ok ? Math.min(1, w / 100) : 0) + (ok
      ? '<span><b>Fits ' + esc(d.name) + '.</b> The catalog lists ' + esc(compatNames(A.matchedCompat(p, d))) + '.' + watts + '</span>'
      : '<span><b>Not listed for ' + esc(d.name) + '.</b> The catalog names ' + esc(compatNames(p.compat)) + '.</span>');
  }

  var VARIANT_NOTES = {
    plug: 'Same price in every region; the catalog lists one.',
    storage: 'Storage tiers share one synthetic price here; tier pricing is left to the client.',
    pack: 'Pack sizes share one synthetic price here; pack pricing is left to the client.'
  };
  function renderVariants() {
    var box = $('#variants');
    box.hidden = !state.groups.length;
    if (box.hidden) return;
    var notes = state.groups.map(function (g) { return VARIANT_NOTES[g.key]; }).filter(Boolean);
    box.innerHTML = state.groups.map(function (g) {
      return '<fieldset class="group variants"><legend>' + esc(g.legend) + '</legend><div class="chipset">' + g.opts.map(function (o, i) {
        var id = 'v-' + g.key + '-' + i;
        return '<input type="radio" class="vh" name="' + esc(g.key) + '" id="' + id + '" value="' + esc(o) + '"' + (o === state.choice[g.key] ? ' checked' : '') + '>' +
          '<label class="chip" for="' + id + '">' + esc(o) + '</label>';
      }).join('') + '</div></fieldset>';
    }).join('') + (notes.length ? '<p class="variants__note">' + notes.join(' ') + '</p>' : '');
  }

  function renderBundle() {
    var b = state.bundle, box = $('#bundle');
    if (!b) { box.hidden = true; return; }
    box.hidden = false;
    $('#bundle-name').textContent = b.name;
    $('#bundle-price').textContent = money(b.price);
    $('#bundle-fig').innerHTML = '<svg aria-hidden="true"><use href="#' + A.figFor(b) + '"/></svg>';
    $('#bundle-cb').checked = state.withBundle;
    $('#total').textContent = money(total());
  }

  function renderCta() {
    var p = state.p, out = p.stock === 'out_of_stock', st = STOCK[p.stock] || STOCK.in_stock, label = choiceLabel();
    document.querySelectorAll('[data-buy]').forEach(function (btn) {
      btn.disabled = out;
      btn.innerHTML = out ? 'Out of stock' : 'Add to cart' + (btn.dataset.buy === 'main' ? ' · ' + money(total()) : '');
    });
    $('#stock').innerHTML = '<span class="stock ' + st[0] + '">' + st[1] + '</span>';
    $('#bar-price').textContent = money(total());
    $('#name').textContent = displayName(); // the h1 follows the chosen tier; title and breadcrumb keep the SKU name
    $('#bar-name').textContent = (label ? label + ' · ' : '') + displayName() + (state.withBundle && state.bundle ? ' + cable' : ''); // the choice leads: the phone bar truncates the tail
  }

  /* ---------- Sections ---------- */

  function renderDelivers() {
    var p = state.p, NAMES = ['Alone', 'Two devices', 'Three devices', 'Four devices'];
    var scen = [[A.maxPortWatts(p)]].concat(A.splits(p)), ports = A.ports(p);
    $('#delivers-section').hidden = A.splits(p).length === 0; // only products whose spec sheet states a shared output
    $('#delivers').innerHTML = scen.map(function (ws) {
      var used = ws.reduce(function (a, b) { return a + b; }, 0);
      return '<div class="scen"><p class="scen__label"><b>' + NAMES[ws.length - 1] + '</b>' + ws.join('W + ') + 'W</p>' +
        '<div class="stack" aria-hidden="true">' + ws.map(function (w) { return '<span class="seg" style="--w:' + w + '">' + w + '</span>'; }).join('') +
        (used < 100 ? '<span class="stack__rest"></span>' : '') + '</div></div>';
    }).join('');
    $('#delivers-sub').textContent = (ports.c + ports.a) + ' ports, ' + ports.c + ' USB-C and ' + ports.a + ' USB-A. Shared outputs are read from the spec sheet; one device alone gets the full ' + A.maxPortWatts(p) + 'W.';
  }

  // "Fits your device?": the device chips for anything with a family compat list; model-specific
  // cases state the one model they are made for; devices have no fit section at all.
  function renderFits() {
    var p = state.p, sec = $('#fits');
    sec.hidden = isDevice();
    $('#foot-fits').hidden = sec.hidden;
    if (sec.hidden) return;
    var chips = $('#fit-chips');
    if (!p.compat.length) {
      chips.hidden = true;
      $('#fits-sub').textContent = 'Made for ' + fitSpec() + '. The store lists devices by family, so this product is not offered under a family chip; check the model before buying.';
      $('#compat-list').innerHTML = '<li>' + esc(fitSpec()) + '</li>';
      return;
    }
    chips.hidden = false;
    chips.innerHTML = A.deviceGroups().map(function (g) {
      return '<div class="chipgroup"><span class="chipgroup__label">' + esc(g.name) + '</span><div class="chipset">' + g.devices.map(function (d) {
        var ok = A.fits(p, d), on = state.device === d.id;
        return '<button type="button" class="chip' + (ok ? '' : ' is-dormant') + '" data-device="' + d.id + '" aria-pressed="' + on + '">' + esc(d.name) + '</button>';
      }).join('') + '</div></div>';
    }).join('');
    $('#compat-list').innerHTML = p.compat.map(function (c) { return '<li>' + esc(compatName(c)) + '</li>'; }).join('');
  }

  // "Complete your setup": on a device page, the Ampline accessories the catalog lists for that device,
  // each tile carrying the device forward so its page opens already answered.
  function renderSetup() {
    var p = state.p, sec = $('#setup'), d = A.deviceById(p.device);
    sec.hidden = !isDevice() || !state.setup.length;
    $('#foot-setup').hidden = sec.hidden;
    if (sec.hidden) return;
    var who = /^Other\b/.test(d.name) ? d.name.replace(/^Other /, '') + 's like this one' : d.name; // "USB-C laptops like this one"
    $('#setup-sub').textContent = state.setup.length + ' Ampline ' + (state.setup.length === 1 ? 'product' : 'products') + ' the catalog lists for ' + who + '. Each page answers the fit for it.';
    $('#setup-row').innerHTML = A.rowMarkup('setup-tiles', state.setup.map(function (q, i) { return A.tile(q, i, BASE, '?device=' + d.id); }).join(''));
    requestAnimationFrame(A.syncRows);
  }

  function renderSpecs() {
    var storage = state.choice.storage; // the Storage row follows the chosen tier
    $('#specs').innerHTML = state.p.specs.map(function (s) {
      var v = s.label === 'Storage' && storage ? s.value.replace(/\d+\s*(GB|TB)/i, storage) : s.value;
      return '<tr><th scope="row">' + esc(s.label) + '</th><td>' + esc(v) + '</td></tr>';
    }).join('');
  }

  function renderBox() {
    var p = state.p, hasCable = p.in_box.some(function (x) { return /cable/i.test(x); });
    $('#box').innerHTML = p.in_box.map(function (x) {
      return '<li><svg aria-hidden="true"><use href="#i-check"/></svg>' + esc(x) + '</li>';
    }).join('');
    $('#box-note').hidden = hasCable || !state.bundle;
  }

  function renderReviews() {
    var r = state.p.rating;
    $('#reviews-agg').innerHTML = '<b class="reviews__n">' + r.value.toFixed(1) + '</b><div>' + stars(r.value) + '<p>' + r.count + ' ratings <span class="syn">synthetic</span></p></div>';
  }

  /* ---------- Gallery, drawn from the catalog ---------- */

  var NOUN = { chargers: 'Charger', cables: 'Cable', 'power-banks': 'Power bank', hubs: 'Hub', car: 'Car charger', wireless: 'Stand', phones: 'Phone', laptops: 'Laptop', tablets: 'Tablet' };
  var WATT_CAP = { cables: 'Max through the cable', hubs: 'Max to the laptop' }; // everything else: max on one port
  var SOURCES = ['chargers', 'power-banks', 'car'];
  // The thumb label is one word: the category's noun, else the last word of the Type spec ("Over-ear headphones" reads "Headphones").
  function noun(p) {
    var t = A.spec(p, ['Type']), last = t && t.value.trim().split(/\s+/).pop();
    return NOUN[p.category] || (last ? last.charAt(0).toUpperCase() + last.slice(1) : 'Product');
  }
  function svgOpen() { return '<svg viewBox="0 0 400 300">'; }
  function strokeAttrs(w) { return 'fill="none" stroke="currentColor" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"'; }
  function label(x, y, str, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 14) + '"' + (o.bold ? ' font-weight="600"' : '') +
      ' fill="' + (o.muted ? 'var(--ink-2)' : 'currentColor') + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.transform ? ' transform="' + o.transform + '"' : '') + '>' + esc(str) + '</text>';
  }

  // Port rows from the Ports / USB / Output spec: USB-C first, then USB-A.
  function portRows(p) {
    var o = A.ports(p), rows = [], w = A.maxPortWatts(p), s = A.spec(p, ['Ports', 'USB', 'Output']);
    var aW = s && (/(\d+(?:\.\d+)?)\s?W\s*USB-A/i.exec(s.value) || /USB-A\s*(\d+(?:\.\d+)?)\s?W/i.exec(s.value));
    var source = SOURCES.indexOf(p.category) >= 0;
    for (var i = 0; i < o.c; i++) rows.push({ kind: 'c', text: i === 0 && source ? 'USB-C · ' + w + 'W alone' : 'USB-C' });
    for (var j = 0; j < o.a; j++) rows.push({ kind: 'a', text: 'USB-A' + (aW ? ' · ' + aW[1] + 'W' : '') });
    return rows;
  }
  function slideProduct(p) { return svgOpen() + '<use href="#' + A.figFor(p) + '" x="85" y="35" width="230" height="230"/></svg>'; }
  function slidePorts(p) {
    var rows = portRows(p), h = 40 + rows.length * 40, y0 = Math.max(24, (280 - h) / 2);
    var out = svgOpen() + '<rect x="70" y="' + y0 + '" width="110" height="' + h + '" rx="18" ' + strokeAttrs(3) + '/>';
    rows.forEach(function (r, i) {
      var y = y0 + 30 + i * 40, usbA = r.kind === 'a';
      out += '<rect x="' + (usbA ? 109 : 110) + '" y="' + (usbA ? y - 1 : y) + '" width="' + (usbA ? 32 : 30) + '" height="' + (usbA ? 12 : 10) + '" rx="' + (usbA ? 2 : 3) + '" fill="var(--green)"/>' +
        '<path d="M146 ' + (y + 5) + 'H200" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>' + label(210, y + 10, r.text, { size: 15, bold: true });
    });
    var sp = A.splits(p);
    if (sp.length) out += label(200, 282, 'Shared: ' + sp.map(function (ws) { return ws.join(' + ') + ' W'; }).join(', or '), { muted: true, anchor: 'middle' });
    return out + '</svg>';
  }
  // Hubs: every port the spec sheet names (Video, USB, Cards, Power), numbered along the bar.
  function hubRows(p) {
    var rows = [], v = A.spec(p, ['Video']), u = A.spec(p, ['USB']), c = A.spec(p, ['Cards']), pw = A.spec(p, ['Power']);
    if (v) rows.push({ wide: true, text: 'HDMI · ' + v.value.replace(/^HDMI\s*/i, '') });
    if (u) {
      var a = /(\d+)x\s*USB-A\s*([^,]*)/i.exec(u.value), cc = /(\d+)x\s*USB-C\s*([^,]*)/i.exec(u.value);
      if (a) for (var i = 0; i < +a[1]; i++) rows.push({ text: ('USB-A ' + a[2]).trim() });
      if (cc) for (var j = 0; j < +cc[1]; j++) rows.push({ text: ('USB-C ' + cc[2]).trim() });
    }
    if (c) c.value.replace(/\s*\([^)]*\)/g, '').split(/\s*\+\s*/).forEach(function (x) { rows.push({ small: true, text: x.trim() + (/UHS/i.test(c.value) ? ' (UHS-I)' : '') }); });
    if (pw) rows.push({ text: 'USB-C · ' + pw.value.replace(/\s*USB-C\s*/i, ' ').replace(/\s+/g, ' ').trim() });
    return rows;
  }
  function slideHub(p) {
    var rows = hubRows(p), n = rows.length, out = svgOpen() + '<rect x="40" y="44" width="320" height="40" rx="12" ' + strokeAttrs(3) + '/>';
    rows.forEach(function (r, i) {
      var cx = 40 + (i + 0.5) * 320 / n, w = r.wide ? 26 : r.small ? 14 : 20;
      out += '<rect x="' + (cx - w / 2) + '" y="59" width="' + w + '" height="10" rx="2" fill="var(--green)"/>' +
        label(cx, 106, String(i + 1), { size: 12, bold: true, anchor: 'middle', muted: true }) +
        label(60, 140 + i * 23, (i + 1) + '  ' + r.text, { size: 13, bold: i === 0 });
    });
    return out + '</svg>';
  }
  function thumbHub(p) {
    var n = hubRows(p).length || 7, out = '<rect x="40" y="110" width="320" height="80" rx="22" ' + strokeAttrs(7) + '/>';
    for (var i = 0; i < n; i++) out += '<rect x="' + (40 + (i + 0.5) * 320 / n - 12) + '" y="140" width="24" height="20" rx="4" fill="var(--green)"/>';
    return out;
  }
  function slideSize(p) {
    var d = A.dimensions(p), k = Math.min(156 / d.w, 144 / d.h, 90 / d.d), W = d.w * k, H = d.h * k, D = d.d * k;
    var fx = 90, fy = 80 + (144 - H) / 2, sx = 290, foldable = /foldable/i.test((A.spec(p, ['Plug']) || { value: '' }).value);
    var out = svgOpen() +
      '<rect x="' + fx + '" y="' + fy + '" width="' + W + '" height="' + H + '" rx="16" ' + strokeAttrs(3) + '/>' +
      '<rect x="' + sx + '" y="' + fy + '" width="' + D + '" height="' + H + '" rx="12" ' + strokeAttrs(3) + '/>' +
      '<g fill="none" stroke="var(--ink-2)" stroke-width="1.5" stroke-linecap="round">' +
        '<path d="M' + fx + ' ' + (fy - 28) + 'H' + (fx + W) + 'M' + fx + ' ' + (fy - 34) + 'v12M' + (fx + W) + ' ' + (fy - 34) + 'v12"/>' +
        '<path d="M' + (fx - 30) + ' ' + fy + 'V' + (fy + H) + 'M' + (fx - 36) + ' ' + fy + 'h12M' + (fx - 36) + ' ' + (fy + H) + 'h12"/>' +
        '<path d="M' + sx + ' ' + (fy + H + 28) + 'H' + (sx + D) + 'M' + sx + ' ' + (fy + H + 22) + 'v12M' + (sx + D) + ' ' + (fy + H + 22) + 'v12"/>' +
      '</g>' +
      label(fx + W / 2, fy - 40, d.w + ' mm', { bold: true, anchor: 'middle' }) +
      label(sx + D / 2, fy + H + 52, d.d + ' mm', { bold: true, anchor: 'middle' }) +
      label(fx - 46, fy + H / 2, d.h + ' mm', { bold: true, anchor: 'middle', transform: 'rotate(-90 ' + (fx - 46) + ' ' + (fy + H / 2) + ')' });
    var cap = (d.g ? d.g + ' g' : '') + (foldable ? (d.g ? ', ' : '') + 'foldable plug' : '');
    if (cap) out += label(fx + W / 2, fy + H + 38, cap, { muted: true, anchor: 'middle' });
    return out + '</svg>';
  }
  // Each extra in the box is drawn as itself: cables and leads as the cable figure, adapters
  // as a small charger, guides as a sheet; anything else (strap, pouch, fuse) as a labelled card.
  function boxItem(item, cx, size) {
    var h = size / 2;
    if (/cable|lead/i.test(item)) return '<use href="#fig-cable-c" x="' + (cx - h) + '" y="' + (146 - h) + '" width="' + size + '" height="' + size + '"/>';
    if (/adapter|charger/i.test(item)) return '<use href="#fig-nano" x="' + (cx - h) + '" y="' + (146 - h) + '" width="' + size + '" height="' + size + '"/>';
    if (/guide|manual|documentation|paperwork/i.test(item)) {
      return '<rect x="' + (cx - 30) + '" y="106" width="60" height="80" rx="6" fill="var(--screen)" ' + strokeAttrs(3) + '/>' +
        '<path d="M' + (cx - 16) + ' 128h32M' + (cx - 16) + ' 144h32M' + (cx - 16) + ' 160h20" fill="none" stroke="var(--ink-2)" stroke-width="2" stroke-linecap="round"/>';
    }
    var cw = Math.min(96, size + 2); // a labelled card never touches its neighbour
    // A label wider than its card breaks at the last space that still fits ("Carry case" → "Carry" / "case").
    var lines = [item], fitChars = Math.floor((cw - 12) / 6.6);
    if (item.length > fitChars && item.indexOf(' ') > 0) {
      var cut = item.lastIndexOf(' ', fitChars);
      if (cut > 0) lines = [item.slice(0, cut), item.slice(cut + 1)];
    }
    return '<rect x="' + (cx - cw / 2) + '" y="118" width="' + cw + '" height="56" rx="10" fill="var(--screen)" ' + strokeAttrs(3) + '/>' +
      lines.map(function (t, i) { return label(cx, lines.length === 1 ? 151 : 145 + i * 15, t, { size: 12, bold: true, anchor: 'middle' }); }).join('');
  }
  function slideBox(p) {
    var items = p.in_box, extras = items.slice(1, 4), hasUsbCable = items.some(function (x) { return /cable/i.test(x); }), fig = A.figFor(p);
    var out = svgOpen();
    if (extras.length) {
      out += '<use href="#' + fig + '" x="30" y="60" width="150" height="150"/>';
      var cell = 200 / extras.length, size = Math.min(88, cell - 8);
      extras.forEach(function (x, i) { out += boxItem(x, 190 + (i + 0.5) * cell, size); });
    } else {
      out += '<use href="#' + fig + '" x="110" y="42" width="180" height="180"/>';
    }
    // One centred text block: the main item, then everything else in the box, then the cable note.
    var caps = [];
    if (extras.length) caps.push('Also: ' + extras.join(', '));
    if (!hasUsbCable && p.category === 'chargers') caps.push('No USB-C cable in the box');
    else if (!extras.length) caps.push('Nothing else in the box');
    var top = 290 - caps.length * 18;
    out += label(200, top, items[0], { bold: true, anchor: 'middle' });
    caps.forEach(function (c, i) { out += label(200, top + 18 * (i + 1), c, { muted: true, anchor: 'middle' }); });
    return out + '</svg>';
  }
  function slidesFor(p) {
    var n = noun(p), d = A.dimensions(p), o = A.ports(p), fig = A.figFor(p);
    var list = [{ id: 'product', aria: 'The ' + n.toLowerCase(), thumb: '<use href="#' + fig + '" x="80" y="30" width="240" height="240"/>', label: n, svg: slideProduct(p) }];
    // Ports are drawn on power products and the Ampline accessories that carry an output; a device's own ports stay in its spec table.
    var power = !p.brand || category().group === 'Power';
    if (power && p.category === 'hubs' && hubRows(p).length) list.push({ id: 'ports', aria: 'Every port on the hub', thumb: thumbHub(p), label: 'Ports', svg: slideHub(p) });
    else if (power && o.c + o.a) list.push({ id: 'ports', aria: 'Ports and what each delivers', thumb: '<use href="#thumb-ports" width="400" height="300"/>', label: 'Ports', svg: slidePorts(p) });
    if (d) list.push({ id: 'size', aria: 'Size: ' + d.w + ' by ' + d.h + ' by ' + d.d + ' mm' + (d.g ? ', ' + d.g + ' g' : ''), thumb: '<use href="#thumb-size" width="400" height="300"/>', label: 'Size', svg: slideSize(p) });
    list.push({ id: 'box', aria: 'What is in the box', thumb: '<use href="#thumb-box" width="400" height="300"/>', label: 'Box', svg: slideBox(p) });
    return list;
  }
  // Which of the catalog's image paths exist: each is tried once; a 404 resolves to nothing and the drawings stand alone.
  function probe(srcs) {
    return Promise.all(srcs.map(function (src) {
      return new Promise(function (res) { var im = new Image(); im.onload = function () { res(src); }; im.onerror = function () { res(null); }; im.src = src; });
    })).then(function (l) { return l.filter(Boolean); });
  }
  function photoSlides(p, photos) {
    return photos.map(function (src, i) {
      var alt = p.name + (photos.length > 1 ? ', photo ' + (i + 1) : '');
      return { id: 'photo-' + i, aria: 'Photo of ' + alt, img: src, label: photos.length > 1 ? 'Photo ' + (i + 1) : 'Photo',
        svg: '<img class="slide__photo" src="' + esc(src) + '" alt="' + esc(alt) + '">' };
    });
  }
  function renderGallery(photos) {
    var list = photoSlides(state.p, photos || []).concat(slidesFor(state.p));
    track.innerHTML = list.map(function (s) { return '<figure class="slide' + (s.img ? ' slide--photo' : '') + '" aria-label="' + esc(s.aria) + '">' + s.svg + '</figure>'; }).join('');
    $('#thumbs').innerHTML = list.map(function (s, i) {
      return '<button type="button" class="thumb" data-slide="' + i + '" aria-current="' + (i === 0) + '">' + (s.img ? '<img src="' + esc(s.img) + '" alt="">' : '<svg viewBox="0 0 400 300" aria-hidden="true">' + s.thumb + '</svg>') + '<span>' + esc(s.label) + '</span></button>';
    }).join('');
    slides = Array.prototype.slice.call(track.children);
    document.querySelectorAll('[data-step]').forEach(function (b) { b.hidden = list.length < 2; });
  }

  var track = $('#track'), slides = [];
  function slideIndex() { return Math.round(track.scrollLeft / track.clientWidth); }
  function syncGallery() {
    var i = slideIndex();
    document.querySelectorAll('[data-slide]').forEach(function (b) { b.setAttribute('aria-current', String(+b.dataset.slide === i)); });
  }
  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  }

  /* ---------- Events ---------- */

  document.addEventListener('click', function (e) {
    var buy = e.target.closest('[data-buy]');
    if (buy && !buy.disabled) {
      var label = choiceLabel();
      A.cart.add(state.p.id + (label ? '|' + label : ''));
      if (state.withBundle && state.bundle) A.cart.add(state.bundle.id);
      document.querySelectorAll('[data-buy]').forEach(function (b) {
        b.classList.add('btn--added');
        b.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>Added';
      });
      clearTimeout(state._t);
      state._t = setTimeout(function () {
        document.querySelectorAll('[data-buy]').forEach(function (b) { b.classList.remove('btn--added'); });
        renderCta();
      }, 1400);
      return;
    }
    var chip = e.target.closest('#fit-chips .chip');
    if (chip) {
      state.device = state.device === chip.dataset.device ? null : chip.dataset.device;
      writeUrl(); renderFit(); renderFits();
      return;
    }
    var nav = e.target.closest('[data-slide]');
    if (nav) { goTo(+nav.dataset.slide); return; }
    var arrow = e.target.closest('[data-step]');
    if (arrow) goTo(slideIndex() + (+arrow.dataset.step));
  });
  document.addEventListener('change', function (e) {
    if (e.target.closest('#variants')) { state.choice[e.target.name] = e.target.value; renderCta(); renderSpecs(); }
    if (e.target.id === 'bundle-cb') { state.withBundle = e.target.checked; renderBundle(); renderCta(); }
  });
  if (track) {
    var raf;
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(syncGallery); });
  }
  // Sticky bar on phones: shown while the main button is scrolled out of view.
  var cta = $('#cta'), bar = $('#buybar');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      bar.hidden = entries[0].isIntersecting;
      document.body.classList.toggle('has-buybar', !bar.hidden);
    }, { threshold: 0 }).observe(cta);
  }

  /* ---------- Boot ---------- */

  A.load(BASE)
    .then(function (data) {
      state.p = data.products.find(function (p) { return p.slug === SLUG; });
      if (!state.p) throw new Error('unknown product');
      state.bundle = state.p.stock === 'out_of_stock' ? null : A.bundleFor(state.p, data.products); // nothing is pickable on an unbuyable page
      state.groups = A.variantGroups(state.p);
      state.groups.forEach(function (g) { state.choice[g.key] = A.defaultVariant(state.p, g); }); // the SKU's own tier or pack first
      state.setup = A.setupFor(state.p, data.products).sort(function (a, b) { return (a.stock === 'out_of_stock') - (b.stock === 'out_of_stock'); }); // buyable first
      readUrl();
      document.title = state.p.name + ' — Ampline';
      $('#foot-cats').innerHTML = A.shopLinks(data.categories, BASE, null);
      renderGallery();
      probe((state.p.images || []).map(function (src) { return BASE + src; })).then(function (photos) {
        if (!photos.length) return;
        renderGallery(photos); syncGallery();
        document.querySelector('.gallery__note').textContent = (photos.length === 1 ? 'Photo' : 'Photos') + ' from the catalog; the drawings are from the spec sheet.';
      });
      renderHead(); renderFit(); renderVariants(); renderBundle(); renderCta();
      renderDelivers(); renderFits(); renderSetup(); renderSpecs(); renderBox(); renderReviews();
      syncGallery();
      $('#pdp').classList.add('is-ready');
    })
    .catch(function () {
      $('#buy').innerHTML = A.loadError();
    });
})();
