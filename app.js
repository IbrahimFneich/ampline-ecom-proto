/* Ampline — home page wiring. Shared catalog logic, cart and tiles live in catalog.js.
   The hero is a retail hero: three live offers from the catalog, the "What do you own?" bar,
   four tiles that swap from best sellers to what fits the tapped device, and the trust row. */
(function () {
  'use strict';

  var A = window.Ampline, $ = A.$, esc = A.esc, money = A.money;
  function dollars(n) { return Number.isInteger(n) ? '$' + n.toLocaleString('en-US') : money(n); } // offer copy: "$469", "$12.99"
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
  var state = { device: null, family: null, suggested: null, suggestedFamily: null, modelAnswered: false };

  function products() { return A.state.products; }
  function cats() { return A.state.categories; }
  function cat(slug) { return cats().find(function (c) { return c.slug === slug; }); }
  function device() { return A.deviceById(state.device); }
  function bucketOf(d) { return d && d.parent ? A.deviceById(d.parent) : d; } // the family bucket a model sits in
  function modelsOf(bucket) { return bucket ? A.DEVICES.filter(function (x) { return x.parent === bucket.id; }) : []; }
  function group(p) { var c = cat(p.category); return c ? c.group : ''; }
  function query() { return state.device ? '?device=' + state.device : ''; }
  function house(p) { return !p.brand || p.brand === 'Ampline'; }
  function byStock(a, b) { return (a.stock === 'out_of_stock') - (b.stock === 'out_of_stock'); } // buyable first
  // Best sellers and new arrivals first, then the most reviewed, up to n.
  function hot(list, n) {
    var h = list.filter(function (p) { return p.badges.some(function (b) { return HOT.indexOf(b) >= 0; }); });
    var rest = list.filter(function (p) { return h.indexOf(p) < 0; }).sort(function (a, b) { return b.rating.count - a.rating.count; });
    return h.concat(rest).sort(byStock).slice(0, n);
  }
  // One product per category first (round robin over each category's hot ranking), so a group's
  // row maps the group instead of repeating one silhouette; `skip` keeps the hero's tiles out.
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
  function tiles(list) { return list.map(function (p, i) { return A.tile(p, i, '', query()); }).join(''); }
  function rowMarkup(id, list) { return A.rowMarkup(id, tiles(list)); }
  // The hero's four: best sellers across the store, or the first four that fit the tapped device.
  function bestSellers() { return hot(products().filter(function (p) { return p.badges.indexOf('Best seller') >= 0; }), 4); }
  function fitList() {
    var d = device();
    if (!d) return null;
    var order = FIT_ORDERS[d.family] || FIT_ORDERS.iphone;
    var direct = function (p) { return (p.compat || []).indexOf(d.id) >= 0 ? 0 : 1; }; // a product made for this exact model leads its category
    return products().filter(function (p) { return A.fits(p, d); }).sort(function (a, b) {
      var ia = order.indexOf(a.category), ib = order.indexOf(b.category);
      return byStock(a, b) || ia - ib || direct(a) - direct(b) || b.rating.count - a.rating.count;
    });
  }
  // The four tiles: the top product of each category in turn, so a phone sees a charger, a cable, a power bank and a case.
  function fitFour(list) {
    var seen = {}, out = [];
    list.forEach(function (p) { if (!seen[p.category] && out.length < 4) { seen[p.category] = true; out.push(p); } });
    list.forEach(function (p) { if (out.length < 4 && out.indexOf(p) < 0) out.push(p); });
    return out;
  }
  function payoffList() { var list = fitList(); return list ? fitFour(list) : bestSellers(); }

  /* ---------- Promo: three offers computed from the catalog ---------- */

  function fig(p, lazy) { // slides past the first load their photos lazily
    var photo = (p.images || [])[0];
    return '<span class="promo__fig"><svg aria-hidden="true"><use href="#' + A.figFor(p) + '"/></svg>' +
      (photo ? '<img src="' + esc(photo) + '" alt="" decoding="async"' + (lazy ? ' loading="lazy"' : '') + ' onerror="this.remove()">' : '') + '</span>';
  }
  function slides() {
    var all = products(), syn = '\u00a0<span class="syn">synthetic</span>'; // the tag stays with the last word
    var own = all.filter(house), phones = all.filter(function (p) { return p.category === 'phones'; });
    var deals = all.filter(function (p) { return p.compare_at && p.compare_at > p.price; }).sort(function (a, b) { return (b.compare_at - b.price) - (a.compare_at - a.price); });
    var min = function (list) { return dollars(Math.min.apply(null, list.map(function (p) { return p.price; }))); };
    var pick = function (list, ids) { return ids.map(function (id) { return list.find(function (p) { return p.id === id; }); }).filter(Boolean); };
    var dealOff = deals.length ? Math.max.apply(null, deals.map(function (p) { return p.compare_at - p.price; })) : 0;
    return [
      { title: 'Charge everything you own.', offer: 'Ampline GaN chargers, cables and power banks, from <span class="nb"><b>' + min(own) + '</b>.' + syn + '</span>',
        href: 'shop/all.html?brand=ampline', cta: 'Shop the range', art: pick(own, ['AMP-GAN-100D', 'AMP-CBL-3IN1', 'AMP-PB-MAG10']) },
      { title: 'Phones, unlocked.', offer: 'iPhone, Galaxy and Pixel, from <span class="nb"><b>' + min(phones) + '</b>.' + syn + '</span>',
        href: 'shop/phones.html', cta: 'Shop phones', art: pick(phones, ['APL-IP16-128', 'SAM-S25-256', 'GOO-PIX9-128']) },
      { title: 'On deal now.', offer: '<b>' + deals.length + ' products</b> below their list price, up to <span class="nb"><b>' + dollars(dealOff) + '\u00a0off</b>.' + syn + '</span>',
        href: 'shop/all.html?deal=1', cta: 'Shop the deals', art: deals.filter(function (p) { return (p.images || [])[0]; }).slice(0, 3) }
    ];
  }
  var track, dots = [];
  function renderPromo() {
    var list = slides();
    track = $('#promo-track');
    track.innerHTML = list.map(function (s, i) {
      return '<article class="promo__slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + list.length + '">' +
        '<div class="promo__text"><h2 class="promo__title">' + esc(s.title) + '</h2><p class="promo__offer">' + s.offer + '</p>' +
        '<a class="btn" href="' + s.href + '">' + esc(s.cta) + '</a></div>' +
        '<div class="promo__art" aria-hidden="true">' + s.art.map(function (p) { return fig(p, i > 0); }).join('') + '</div></article>';
    }).join('');
    $('#promo-dots').innerHTML = list.map(function (s, i) {
      return '<button type="button" class="promo__dot" data-promo-go="' + i + '" aria-label="Slide ' + (i + 1) + ' of ' + list.length + ': ' + esc(s.title) + '" aria-current="' + (i === 0) + '"></button>';
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

  /* ---------- Picker ---------- */

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

  /* ---------- Payoff: four tiles ---------- */

  function renderPayoff() {
    var d = device(), list = fitList(), h = $('#h-payoff'), sub = $('#payoff-sub'), link = $('#payoff-link'), box = $('#payoff-tiles');
    link.hidden = false;
    if (!list) {
      h.textContent = 'Best sellers';
      sub.textContent = 'The store\u2019s best sellers, until you name what you own.';
      link.href = 'shop/all.html?sort=rating-desc';
      link.innerHTML = 'All products <svg aria-hidden="true"><use href="#i-arrow"/></svg>';
      box.innerHTML = tiles(bestSellers());
      return;
    }
    var models = modelsOf(bucketOf(d)), n = list.length;
    h.textContent = 'Fits ' + d.name;
    link.hidden = !n;
    if (!n) { // nothing listed yet: say so and keep the best sellers in view
      sub.textContent = 'The catalog lists nothing for ' + d.name + ' yet; these are the store\u2019s best sellers.';
      box.innerHTML = tiles(bestSellers());
      return;
    }
    var four = fitFour(list), padded = four.length < 4;
    if (padded) hot(products().filter(function (p) { return group(p) !== 'Devices'; }), 12).forEach(function (p) { if (four.length < 4 && four.indexOf(p) < 0) four.push(p); }); // accessory and power best sellers only
    sub.textContent = n + (n === 1 ? ' product' : ' products') + ' the catalog lists for it' + (!d.parent && models.length ? '; name the model above for cases' : '') +
      (padded ? (n === 1 ? '; the other three are best sellers.' : '; the rest are best sellers.') : '.');
    link.href = 'shop/all.html?device=' + d.id;
    link.innerHTML = 'See all that fits <svg aria-hidden="true"><use href="#i-arrow"/></svg>';
    box.innerHTML = tiles(four);
  }

  /* ---------- Groups: category grid and one featured row each ---------- */

  function renderGroups() {
    var skip = payoffList().slice(0, 4).map(function (p) { return p.id; });
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

  function render() { renderFamilies(); renderDevices(); renderModels(); renderPayoff(); renderGroups(); requestAnimationFrame(A.syncRows); }
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
    $('#guess').hidden = !state.suggested || !!state.device || !!state.family;
    if (!opts.silent) history.replaceState(null, '', state.device ? '#device=' + state.device : location.pathname + location.search);
    render();
    // A tap brings the answer into view at every width: the model question when it is open, else the tiles
    // (on desktop the bar scrolls under the header so the chips stay in reach above the tiles).
    if (d && !opts.silent) {
      var wide = window.matchMedia('(min-width: 1024px)').matches;
      scrollTo(wide ? $('#pickbar') : !d.parent && modelsOf(d).length && !state.modelAnswered ? $('#models-chips') : $('#payoff'));
    }
  }
  function setFamily(id) {
    state.family = state.family === id ? null : id;
    if (state.device && A.deviceById(state.device).family !== state.family) { state.device = null; state.modelAnswered = false; history.replaceState(null, '', location.pathname + location.search); }
    $('#guess').hidden = !state.suggested || !!state.device || !!state.family;
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
        scrollTo(window.matchMedia('(min-width: 1024px)').matches ? $('#pickbar') : $('#devices-chips'));
        return;
      }
      setFamily(fam.dataset.family); return;
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
  // Arrow keys move the pager while focus is inside the promo card.
  $('#promo').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(slideIndex() + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(slideIndex() - 1, true); }
  });
  var raf;
  $('#promo-track').addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(syncDots); });
  window.addEventListener('resize', function () { if (track) track.scrollTo({ left: slideIndex() * track.clientWidth }); });
  document.addEventListener('ampline:cart', function () { renderPayoff(); renderGroups(); });
  window.addEventListener('hashchange', function () { if (/device=/.test(location.hash) || !location.hash) setDevice(deviceFromHash(), { silent: true }); });

  /* ---------- Boot ---------- */

  A.load('')
    .then(function (data) {
      $('#foot-cats').innerHTML = A.shopLinks(data.categories, '', null);
      renderPromo();
      renderHouse();
      // The browser's guess rings a chip and names itself in the bar; nothing is chosen until the shopper taps.
      var g = guess();
      state.suggested = g.device; state.suggestedFamily = g.family;
      var gd = state.suggested ? A.deviceById(state.suggested) : null, gf = A.deviceGroups().find(function (x) { return x.id === g.family; });
      var gname = gd ? gd.name.replace(/^Other /, '') : gf ? gf.name : null;
      if (gname) {
        $('#guess').innerHTML = 'Your browser looks like <button type="button" class="guess__pick" ' + (gd ? 'data-device="' + gd.id + '"' : 'data-family="' + g.family + '"') + '>' +
          (/^[aeiou]/i.test(gname) ? 'an ' : 'a ') + esc(gname) + '</button>. ' + (gd ? 'Tap it, or pick another.' : 'Tap it to pick which one.');
        state.suggested = state.suggested || g.family; // keeps the guess line visible until a device is chosen
      }
      setDevice(deviceFromHash(), { silent: true });
    })
    .catch(function () {
      $('#payoff-tiles').innerHTML = A.loadError();
      $('#groups').innerHTML = '';
    });
})();
