/* Ampline — home page wiring. Shared catalog logic, cart and tiles live in catalog.js.
   The home follows the category canon: a hero panel with three live slides, "Choose your device" right
   under it, a row of category circles, ten best sellers that re-sort to what fits the chosen device
   (the rest dimmed, never hidden), the trust row, then the category grid in three groups and the house strip. */
(function () {
  'use strict';

  var A = window.Ampline, $ = A.$, esc = A.esc, money = A.money;
  function dollars(n) { return Number.isInteger(n) ? '$' + n.toLocaleString('en-US') : money(n); } // headline prices: "$1,099", "$14.99"
  var HOT = ['Best seller', 'New'];
  var GROUPS = [
    { id: 'devices', name: 'Devices', line: 'Phones, laptops, tablets and the rest, by budget and by the facts each listing carries.' },
    { id: 'accessories', name: 'Accessories', line: 'Cables, hubs, car and cases that fit what you own.' },
    { id: 'power', name: 'Power', line: 'Chargers, power banks and wireless stands, each with the watts one port can give.' }
  ];
  // What a shopper with this device comes for, first: a phone owner a charger, a laptop owner a charger then a hub.
  var FIT_ORDERS = {
    iphone: ['chargers', 'cables', 'power-banks', 'cases-and-mounts', 'wireless', 'car', 'hubs'],
    android: ['chargers', 'cables', 'power-banks', 'cases-and-mounts', 'wireless', 'car', 'hubs'],
    ipad: ['chargers', 'cables', 'hubs', 'cases-and-mounts', 'power-banks', 'wireless', 'car'],
    mac: ['chargers', 'hubs', 'cables', 'power-banks', 'cases-and-mounts', 'car', 'wireless'],
    'windows-laptop': ['chargers', 'hubs', 'cables', 'power-banks', 'cases-and-mounts', 'car', 'wireless'],
    'switch-steam-deck': ['chargers', 'power-banks', 'cables', 'hubs', 'car', 'wireless', 'cases-and-mounts'],
    'watch-earbuds': ['wireless', 'chargers', 'cables', 'power-banks', 'car', 'hubs', 'cases-and-mounts']
  };
  var BEST_N = 10;
  var state = { device: null, family: null, suggested: null, suggestedFamily: null, modelAnswered: false };

  function products() { return A.state.products; }
  function cats() { return A.state.categories; }
  function cat(slug) { return cats().find(function (c) { return c.slug === slug; }); }
  function device() { return A.deviceById(state.device); }
  function bucketOf(d) { return d && d.parent ? A.deviceById(d.parent) : d; } // the family bucket a model sits in
  function modelsOf(bucket) { return bucket ? A.DEVICES.filter(function (x) { return x.parent === bucket.id; }) : []; }
  function familyDevices(id) { return A.DEVICES.filter(function (d) { return d.family === id; }); }
  function group(p) { var c = cat(p.category); return c ? c.group : ''; }
  function query() { return state.device ? '?device=' + state.device : ''; }
  function house(p) { return !p.brand || p.brand === 'Ampline'; }
  function byStock(a, b) { return (a.stock === 'out_of_stock') - (b.stock === 'out_of_stock'); } // buyable first
  function bySlug(slug) { return products().find(function (p) { return p.slug === slug; }) || null; }
  function byId(id) { return products().find(function (p) { return p.id === id; }) || null; }
  // Best sellers and new arrivals first, then the most reviewed, up to n.
  function hot(list, n) {
    var h = list.filter(function (p) { return p.badges.some(function (b) { return HOT.indexOf(b) >= 0; }); });
    var rest = list.filter(function (p) { return h.indexOf(p) < 0; }).sort(function (a, b) { return b.rating.count - a.rating.count; });
    return h.concat(rest).sort(byStock).slice(0, n);
  }
  // One product per category first (round robin over each category's hot ranking), so a row maps the store
  // instead of repeating one silhouette; `skip` keeps the best sellers out of the group rows.
  function hotAcross(list, n, skip) {
    var pools = {}, order = [];
    hot(list.filter(function (p) { return !skip || skip.indexOf(p.id) < 0; }), list.length).forEach(function (p) {
      if (!pools[p.category]) { pools[p.category] = []; order.push(p.category); }
      pools[p.category].push(p);
    });
    var out = [], round = 0;
    while (out.length < n && round < 10) {
      var added = false;
      order.forEach(function (c) { if (out.length < n && pools[c][round]) { out.push(pools[c][round]); added = true; } });
      if (!added) break;
      round++;
    }
    if (out.length < 4 && skip && skip.length) { // a group left thin after the skip fills from the skipped products
      hot(list, list.length).forEach(function (p) { if (out.length < n && out.indexOf(p) < 0) out.push(p); });
    }
    return out;
  }
  function rowMarkup(id, list) { return A.rowMarkup(id, list.map(function (p, i) { return A.tile(p, i, '', query()); }).join('')); }

  /* ---------- The fit answer ---------- */

  // The devices a pick stands for: one device (a bucket or a model), or every device in a family when only the family is chosen.
  function pickedDevices() {
    if (state.device) return [device()];
    if (state.family) return familyDevices(state.family);
    return null;
  }
  function fitsPick(p, devs) { return devs.some(function (d) { return A.fits(p, d); }); }
  function pickName() { var d = device(); if (d) return d.name; var g = A.deviceGroups().find(function (x) { return x.id === state.family; }); return g ? (/^[aeiou]/i.test(g.name) ? 'an ' : 'a ') + g.name : ''; }
  // What fits, ordered the way that device's owner shops (chargers first for a phone, a hub early for a laptop).
  function fitList(devs) {
    var fam = state.device ? device().family : state.family, order = FIT_ORDERS[fam] || FIT_ORDERS.iphone;
    var d = device();
    var direct = function (p) { return d && (p.compat || []).indexOf(d.id) >= 0 ? 0 : 1; }; // a product made for this exact model leads its category
    return products().filter(function (p) { return fitsPick(p, devs); }).sort(function (a, b) {
      var ia = order.indexOf(a.category), ib = order.indexOf(b.category);
      return byStock(a, b) || ia - ib || direct(a) - direct(b) || b.rating.count - a.rating.count;
    });
  }
  function bestSellers() { return hotAcross(products(), BEST_N); }
  // The ten tiles: the store's best sellers, or, once a device is chosen, what fits it first (one per category, then
  // the rest in fit order) with the best sellers that do not fit filling the row, dimmed.
  function bestList() {
    var devs = pickedDevices();
    if (!devs) return { list: bestSellers(), fit: null, n: 0 };
    var fits = fitList(devs), seen = {}, lead = [];
    fits.forEach(function (p) { if (!seen[p.category] && lead.length < BEST_N) { seen[p.category] = true; lead.push(p); } });
    fits.forEach(function (p) { if (lead.length < BEST_N && lead.indexOf(p) < 0) lead.push(p); });
    var rest = bestSellers().filter(function (p) { return lead.indexOf(p) < 0 && !fitsPick(p, devs); });
    return { list: lead.concat(rest).slice(0, BEST_N), fit: devs, n: fits.length };
  }

  /* ---------- Hero: three live slides ---------- */

  function fig(p, lazy) { // slides past the first load their photos lazily
    var photo = (p.images || [])[0];
    return '<span class="promo__fig"><svg aria-hidden="true"><use href="#' + A.figFor(p) + '"/></svg>' +
      (photo ? '<img src="' + esc(photo) + '" alt="" decoding="async"' + (lazy ? ' loading="lazy"' : '') + ' onerror="this.remove()">' : '') + '</span>';
  }
  function firstSentence(t) { return (/^.*?[.!?](?=\s|$)/.exec(t || '') || [t || ''])[0]; }
  function slides() {
    var syn = '';
    var iphone = bySlug('apple-iphone-16-128gb'), mac = bySlug('apple-macbook-air-13-m3');
    var own = products().filter(house), ownMin = dollars(Math.min.apply(null, own.map(function (p) { return p.price; })));
    var out = [];
    if (iphone) out.push({ title: 'iPhone 16. ' + dollars(iphone.price) + '.' + syn, offer: firstSentence(iphone.short) + ' Pick the colour and storage on its page; pay by card or cash on delivery.',
      href: A.productHref(iphone, '', query()) || 'shop/phones.html', cta: 'Shop iPhone 16', art: [iphone] });
    if (mac) out.push({ title: 'MacBook Air M3. ' + dollars(mac.price) + '.' + syn, offer: firstSentence(mac.short) + ' Our chargers and hubs list the watts one port gives it.',
      href: A.productHref(mac, '', query()) || 'shop/laptops.html', cta: 'Shop MacBook Air', art: [mac] });
    out.push({ title: 'Ampline charging. From ' + ownMin + '.' + syn, offer: 'Our own GaN chargers, cables and power banks, each with the most watts a port can give, read from its spec sheet.',
      href: 'shop/all.html?brand=ampline', cta: 'Shop the range', art: ['AMP-GAN-100D', 'AMP-CBL-3IN1', 'AMP-PB-MAG10'].map(byId).filter(Boolean) });
    return out;
  }
  var track, dots = [];
  function renderPromo() {
    var list = slides();
    track = $('#promo-track');
    track.innerHTML = list.map(function (s, i) {
      return '<article class="promo__slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + list.length + '">' +
        '<div class="promo__text"><h2 class="promo__title">' + s.title + '</h2><p class="promo__offer">' + esc(s.offer) + '</p>' +
        '<div class="promo__ctas"><a class="btn" href="' + s.href + '">' + esc(s.cta) + '</a><a class="btn btn--ghost" href="#pick">Choose your device</a></div></div>' +
        '<div class="promo__art" aria-hidden="true">' + s.art.map(function (p) { return fig(p, i > 0); }).join('') + '</div></article>';
    }).join('');
    $('#promo-dots').innerHTML = list.map(function (s, i) {
      return '<button type="button" class="promo__dot" data-promo-go="' + i + '" aria-label="Slide ' + (i + 1) + ' of ' + list.length + ': ' + esc(s.cta) + '" aria-current="' + (i === 0) + '"></button>';
    }).join('');
    dots = Array.prototype.slice.call($('#promo-dots').children);
    syncDots();
  }
  function slideIndex() { return Math.round(track.scrollLeft / track.clientWidth); }
  function syncDots() {
    var i = slideIndex();
    dots.forEach(function (d, j) { d.setAttribute('aria-current', String(j === i)); });
    Array.prototype.forEach.call(track.children, function (s, j) { if (j === i) s.removeAttribute('inert'); else s.setAttribute('inert', ''); });
    document.querySelector('[data-promo-step="-1"]').setAttribute('aria-disabled', String(i === 0));
    document.querySelector('[data-promo-step="1"]').setAttribute('aria-disabled', String(i === dots.length - 1));
  }
  function goTo(i, focusDot) {
    i = Math.max(0, Math.min(dots.length - 1, i));
    track.scrollTo({ left: i * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (focusDot) dots[i].focus({ preventScroll: true });
  }

  /* ---------- Choose your device ---------- */

  function renderFamilies() {
    $('#families').innerHTML = A.deviceGroups().map(function (g) {
      var hint = !state.family && state.suggestedFamily === g.id;
      return '<button type="button" class="chip' + (hint ? ' is-suggested' : '') + '" data-family="' + g.id + '" aria-pressed="' + (state.family === g.id) + '">' + esc(g.name) + '</button>';
    }).join('');
  }
  function renderDevices() {
    var box = $('#devices-chips'), g = A.deviceGroups().find(function (x) { return x.id === state.family; });
    box.hidden = !g;
    if (!g) return;
    var picked = bucketOf(device());
    box.innerHTML = '<div class="chipset">' + g.devices.filter(function (d) { return !d.parent; }).map(function (d) {
      var hint = !state.device && state.suggested === d.id;
      return '<button type="button" class="chip' + (hint ? ' is-suggested' : '') + '" data-device="' + d.id + '" aria-pressed="' + (!!picked && picked.id === d.id) + '">' + esc(d.name) + '</button>';
    }).join('') + '</div>';
  }
  // Cases and folios fit one model, so a bucket that holds models asks which one; nothing is pressed until the shopper answers.
  function renderModels() {
    var box = $('#models-chips'), bucket = bucketOf(device()), models = modelsOf(bucket);
    box.hidden = !models.length;
    if (!models.length) return;
    box.innerHTML = '<span class="chipgroup__label">Which model? Cases and folios fit one model only.</span><div class="chipset">' +
      models.map(function (m) { return '<button type="button" class="chip" data-device="' + m.id + '" aria-pressed="' + (state.device === m.id) + '">' + esc(m.name) + '</button>'; }).join('') +
      '<button type="button" class="chip" data-device="' + bucket.id + '" data-not-listed aria-pressed="' + (state.device === bucket.id && state.modelAnswered) + '">Mine isn’t listed</button></div>';
  }
  // The line under the chips: the browser's guess until a tap, then what the pick means for the tiles.
  function renderGuessLine() {
    var el = $('#guess'), devs = pickedDevices();
    if (devs) {
      var n = fitList(devs).length, d = device();
      el.textContent = (n ? n + (n === 1 ? ' product fits' : ' products fit') + ' ' + (d ? 'your ' + d.name : pickName()) : 'The catalog lists nothing for ' + (d ? d.name : pickName()) + ' yet') +
        (d ? '. Power products show the most watts one port gives.' : '. Name the exact one for cases and folios.');
      return;
    }
    if (state.suggested || state.suggestedFamily) {
      var gd = A.deviceById(state.suggested), fam = A.deviceGroups().find(function (g) { return g.id === state.suggestedFamily; });
      var label = gd ? gd.name : fam ? (/^[aeiou]/i.test(fam.name) ? 'an ' : 'a ') + fam.name : '';
      el.innerHTML = 'Your browser looks like <button type="button" class="guess__pick" ' + (gd ? 'data-device="' + gd.id + '"' : 'data-family="' + state.suggestedFamily + '"') + '>' + esc(label) + '</button>. ' + (gd ? 'Pick it, or choose another.' : 'Pick it to choose which one.');
      return;
    }
    el.textContent = 'Pick what you own and the best sellers re-sort to what fits it.';
  }

  /* ---------- Category circles ---------- */

  function renderCatRow() { $('#catrow').innerHTML = A.catRow('', query()); } // the shared row from catalog.js, with the chosen device

  /* ---------- Best sellers: ten tiles that re-sort to the device ---------- */

  function renderBest() {
    var r = bestList(), d = device(), h = $('#h-best'), sub = $('#best-sub'), link = $('#best-link'), box = $('#best-tiles');
    box.innerHTML = r.list.map(function (p, i) { return A.tile(p, i, '', query(), { cat: true, fit: r.fit ? fitsPick(p, r.fit) : undefined }); }).join('');
    if (!r.fit) {
      h.textContent = 'Best sellers';
      sub.textContent = 'Across the store, one per category first.';
      link.href = 'shop/all.html?sort=rating-desc';
      link.innerHTML = 'See all ' + products().length + ' products <svg aria-hidden="true"><use href="#i-arrow"/></svg>';
      return;
    }
    var name = d ? d.name : pickName(), pool = products().filter(function (p) { return group(p) !== 'Devices'; }).length;
    h.innerHTML = '<span class="mini best__mini" aria-hidden="true"><i style="--pct:0"></i></span>' + esc('Fits ' + name);
    requestAnimationFrame(function () { var i = h.querySelector('.best__mini i'); if (i) i.style.setProperty('--pct', Math.min(1, r.n / pool)); }); // charges from empty to its share
    var shown = r.list.filter(function (p) { return fitsPick(p, r.fit); }).length;
    sub.textContent = !r.n ? 'Nothing listed for it yet; these are the store\u2019s best sellers.'
      : shown === r.list.length ? 'All ' + (shown === 10 ? 'ten' : shown) + ' fit' + (r.n > shown ? ', and ' + (r.n - shown) + ' more on the full list.' : '.')
      : shown + ' of these fit; the rest are best sellers, dimmed.';
    link.hidden = !r.n;
    link.href = d ? 'shop/all.html?device=' + d.id : 'shop/all.html';
    link.innerHTML = 'See all ' + r.n + ' that fit <svg aria-hidden="true"><use href="#i-arrow"/></svg>';
  }

  /* ---------- Groups: category grid and one featured row each ---------- */

  function renderGroups() {
    var skip = bestList().list.map(function (p) { return p.id; });
    $('#groups').innerHTML = GROUPS.map(function (g) {
      var gcats = cats().filter(function (c) { return c.group === g.name; });
      var grid = gcats.map(function (c) {
        var n = products().filter(function (p) { return p.category === c.slug; }).length;
        var built = A.ROUTES.shop.indexOf(c.slug) >= 0;
        var inner = '<span class="cat__icon"><svg aria-hidden="true"><use href="#i-' + c.slug + '"/></svg></span>' +
          '<span class="cat__text"><b>' + esc(c.name) + '</b><small>' + esc(c.blurb) + '</small></span>' +
          '<span class="cat__count">' + (built
            ? 'Shop ' + n + ' ' + A.nounFor(c.slug, n) + '<svg class="cat__go" aria-hidden="true"><use href="#i-arrow"/></svg>'
            : n + (n === 1 ? ' product' : ' products') + '<span class="cat__soon">page not built</span>') + '</span>';
        return built
          ? '<a class="cat" href="shop/' + c.slug + '.html' + query() + '">' + inner + '</a>'
          : '<div class="cat cat--soon">' + inner + '</div>';
      }).join('');
      var featured = hotAcross(products().filter(function (p) { return group(p) === g.name; }), 6, skip);
      return '<section class="section hgroup" id="' + g.id + '" aria-labelledby="h-' + g.id + '">' +
        '<div class="wrap">' +
          '<div class="section__head"><div><h2 id="h-' + g.id + '">' + g.name + '</h2><p class="section__sub">' + esc(g.line) + '</p></div></div>' +
          '<div class="cats">' + grid + '</div>' +
          '<h3 class="group__sub">Featured in ' + g.name.toLowerCase() + '</h3>' +
          rowMarkup('row-' + g.id, featured) +
        '</div></section>';
    }).join('');
  }

  /* ---------- The house range ---------- */

  function renderHouse() {
    var own = products().filter(house);
    var power = own.filter(function (p) { return A.maxPortWatts(p) !== null; });
    var w = power.map(A.maxPortWatts), lo = Math.min.apply(null, w), hi = Math.max.apply(null, w);
    var tech = []; own.forEach(function (p) { p.badges.forEach(function (b) { if (['GaN', 'MFi', 'Qi2'].indexOf(b) >= 0 && tech.indexOf(b) < 0) tech.push(b); }); });
    $('#house-fill').style.setProperty('--pct', Math.min(1, hi / 100));
    $('#house-n').textContent = hi;
    $('#house-sub').textContent = 'Our own chargers, cables, power banks, hubs, car and wireless products, plus a dash mount and a laptop stand. Every power product lists the most watts a port can give, read from its spec sheet.';
    $('#house-facts').innerHTML = '<li><b>' + own.length + '</b> products</li><li><b>' + lo + ' to ' + hi + 'W</b> per port on the ' + power.length + ' power products</li><li><b>' + tech.join(' · ') + '</b> in the range</li>';
  }

  /* ---------- Selection ---------- */

  function render() { renderFamilies(); renderDevices(); renderModels(); renderGuessLine(); renderCatRow(); renderBest(); renderGroups(); requestAnimationFrame(A.syncRows); }
  function scrollTo(el) {
    var top = el.getBoundingClientRect().top + window.scrollY - document.querySelector('.bar').offsetHeight - 12;
    window.scrollTo({ top: top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function setDevice(id, opts) {
    opts = opts || {};
    var d = A.deviceById(id);
    if (!d || bucketOf(d) !== bucketOf(device())) state.modelAnswered = false; // a new bucket asks again
    if (d && d.parent) state.modelAnswered = true;
    state.device = d ? d.id : null;
    if (d) state.family = d.family;
    if (!opts.silent) history.replaceState(null, '', state.device ? '#device=' + state.device : location.pathname + location.search);
    render();
    // A tap brings the answer into view: on desktop the chips stay in reach above the tiles, on phones the tiles rise into view.
    if (d && !opts.silent) {
      var wide = window.matchMedia('(min-width: 1024px)').matches;
      scrollTo(wide ? $('#pick') : !d.parent && modelsOf(d).length && !state.modelAnswered ? $('#models-chips') : $('#best'));
    }
  }
  function setFamily(id) {
    state.family = state.family === id ? null : id;
    if (state.device && A.deviceById(state.device).family !== state.family) { state.device = null; state.modelAnswered = false; history.replaceState(null, '', location.pathname + location.search); }
    render();
  }
  function deviceFromHash() {
    var m = /device=([a-z0-9-]+)/.exec(location.hash);
    return m ? m[1] : null;
  }
  // The browser hints at a family and sometimes a device; an iPhone's model is not in the UA.
  function guess() {
    var ua = navigator.userAgent;
    if (/Android/.test(ua)) return { family: 'android', device: 'android-phone' }; // the catch-all bucket is all the UA can tell
    if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return { family: 'ipad', device: null };
    if (/iPhone/.test(ua)) return { family: 'iphone', device: null };
    if (/Macintosh/.test(ua)) return { family: 'mac', device: null }; // a Mac, not a model
    if (/Windows|Linux|CrOS/.test(ua)) return { family: 'windows-laptop', device: 'windows-laptop' };
    return { family: null, device: null };
  }

  /* ---------- Events ---------- */

  document.addEventListener('click', function (e) {
    var fam = e.target.closest('[data-family]');
    if (fam) {
      if (fam.classList.contains('guess__pick')) { // the guess tap opens the device row in view and never toggles it closed
        if (state.family !== fam.dataset.family) setFamily(fam.dataset.family);
        scrollTo($('#pick'));
        return;
      }
      setFamily(fam.dataset.family);
      if (state.family && !window.matchMedia('(min-width: 1024px)').matches) scrollTo($('#pick'));
      return;
    }
    var chip = e.target.closest('[data-device]');
    if (chip) {
      var target = A.deviceById(chip.dataset.device), current = device();
      if (chip.hasAttribute('data-not-listed')) { state.modelAnswered = true; setDevice(chip.dataset.device); return; }
      if (current && current.id === target.id) { setDevice(target.parent || null); return; } // a model steps back to its bucket; a bucket clears
      setDevice(chip.dataset.device); return;
    }
    var step = e.target.closest('[data-promo-step]');
    if (step) { goTo(slideIndex() + (+step.dataset.promoStep)); return; }
    var dot = e.target.closest('[data-promo-go]');
    if (dot) goTo(+dot.dataset.promoGo, true);
  });
  // Arrow keys move the pager while focus is inside the hero panel.
  $('#promo').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(slideIndex() + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(slideIndex() - 1, true); }
  });
  var raf;
  $('#promo-track').addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(syncDots); });
  window.addEventListener('resize', function () { if (track) track.scrollTo({ left: slideIndex() * track.clientWidth }); });
  document.addEventListener('ampline:cart', function () {
    // A cart change touches only the tile buttons whose state is stale, so the grid keeps its place.
    var check = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
    document.querySelectorAll('[data-add], [data-choose]').forEach(function (b) {
      var has = A.cart.has(b.dataset.add || b.dataset.choose);
      if (has === b.classList.contains('btn--added')) return;
      b.classList.toggle('btn--added', has);
      b.innerHTML = has ? check + 'In cart' : b.hasAttribute('data-choose') ? 'Choose options' : 'Add to cart';
    });
  });
  window.addEventListener('hashchange', function () { if (/device=/.test(location.hash) || !location.hash) setDevice(deviceFromHash(), { silent: true }); });

  /* ---------- Boot ---------- */

  A.load('')
    .then(function (data) {
      $('#foot-cats').innerHTML = A.shopLinks(data.categories, '', null);
      renderPromo();
      renderHouse();
      // The browser's guess rings a chip and names itself in the line; nothing is chosen until the shopper taps.
      var g = guess();
      state.suggested = g.device && A.deviceById(g.device) ? g.device : null;
      state.suggestedFamily = g.family;
      var fromHash = deviceFromHash();
      if (fromHash && A.deviceById(fromHash)) setDevice(fromHash, { silent: true }); else render();
    })
    .catch(function () {
      $('#promo-track').innerHTML = '<article class="promo__slide"><div class="promo__text">' + A.loadError() + '</div></article>';
      $('#best-tiles').innerHTML = A.loadError();
    });
})();
