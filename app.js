/* Ampline — home page wiring. Shared catalog logic, cart and tiles live in catalog.js.
   The hero picker reads the catalog's devices[]; everything on the page is derived from the catalog. */
(function () {
  'use strict';

  var A = window.Ampline, $ = A.$, esc = A.esc;
  var HOT = ['Best seller', 'New'];
  var GROUPS = [
    { id: 'devices', name: 'Devices', line: 'Phones, laptops, tablets and the rest, by budget and by the facts each listing carries.' },
    { id: 'accessories', name: 'Accessories', line: 'Cables, hubs, car and cases that fit what you own.' },
    { id: 'power', name: 'Power', line: 'Chargers, power banks and wireless stands, each with the watts one port can give.' }
  ];
  var FIT_ORDER = ['cases-and-mounts', 'cables', 'hubs', 'car', 'chargers', 'power-banks', 'wireless'];
  var CONNECTOR = { 'usb-c': 'USB-C', lightning: 'Lightning', magsafe: 'MagSafe' };
  var state = { device: null, family: null, suggested: null };

  function products() { return A.state.products; }
  function cats() { return A.state.categories; }
  function cat(slug) { return cats().find(function (c) { return c.slug === slug; }); }
  function device() { return A.deviceById(state.device); }
  function group(p) { var c = cat(p.category); return c ? c.group : ''; }
  function query() { return state.device ? '?device=' + state.device : ''; }
  // Best sellers and new arrivals first, then the most reviewed, up to n.
  function hot(list, n) {
    var h = list.filter(function (p) { return p.badges.some(function (b) { return HOT.indexOf(b) >= 0; }); });
    var rest = list.filter(function (p) { return h.indexOf(p) < 0; }).sort(function (a, b) { return b.rating.count - a.rating.count; });
    return h.concat(rest).slice(0, n);
  }
  // One product per category first (round robin over each category's hot ranking), so a group's
  // row maps the group instead of repeating one silhouette; `skip` keeps the default fits row out.
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
    // A group left thin after the skip (under four unique) fills its row from the skipped products.
    if (out.length < 4 && skip && skip.length) {
      hot(list, list.length).forEach(function (p) { if (out.length < n && out.indexOf(p) < 0) out.push(p); });
    }
    return out;
  }
  function tiles(list) { return list.map(function (p, i) { return A.tile(p, i, '', query()); }).join(''); }
  function rowMarkup(id, list) { return A.rowMarkup(id, tiles(list)); }
  function defaultFits() { return hotAcross(products().filter(function (p) { return group(p) !== 'Devices'; }), 8); }

  /* ---------- Picker ---------- */

  function renderFamilies() {
    $('#families').innerHTML = A.deviceGroups().map(function (g) {
      var hint = !state.family && state.suggested && A.deviceById(state.suggested).family === g.id;
      return '<button type="button" class="chip' + (hint ? ' is-suggested' : '') + '" data-family="' + g.id + '" aria-pressed="' + (state.family === g.id) + '">' + esc(g.name) + '</button>';
    }).join('');
  }
  function renderDevices() {
    var box = $('#devices-chips'), g = A.deviceGroups().find(function (x) { return x.id === state.family; });
    box.hidden = !g;
    if (!g) return;
    box.innerHTML = '<div class="chipset">' + g.devices.map(function (d) {
      var hint = !state.device && state.suggested === d.id;
      return '<button type="button" class="chip' + (hint ? ' is-suggested' : '') + '" data-device="' + d.id + '" aria-pressed="' + (state.device === d.id) + '">' + esc(d.name) + '</button>';
    }).join('') + '</div>';
  }

  /* ---------- What it takes, what fits ---------- */

  function fitList() {
    var d = device();
    if (!d) return null;
    return products().filter(function (p) { return A.fits(p, d); }).sort(function (a, b) {
      var ia = FIT_ORDER.indexOf(a.category), ib = FIT_ORDER.indexOf(b.category);
      return ia - ib || b.rating.count - a.rating.count;
    });
  }

  function renderOwn() {
    var d = device(), fill = $('#fill'), figure = $('#figure'), prompt = $('#prompt');
    $('#glyph').classList.toggle('is-charging', !!d);
    if (!d) {
      fill.style.setProperty('--pct', 0);
      figure.hidden = true; prompt.hidden = false;
      // With nothing picked, the glyph reads as fill anyway: one band per device family, lo to hi of the
      // published ceilings on the same 0 to 100W track (laptops run past the track and say so).
      var bands = [['Phones', function (x) { return x.family === 'iphone' || (x.family === 'android' && x.id !== 'galaxy-tab'); }],
        ['Tablets', function (x) { return x.family === 'ipad' || x.id === 'galaxy-tab'; }],
        ['Laptops', function (x) { return x.family === 'mac' || x.family === 'windows-laptop'; }],
        ['Handhelds', function (x) { return x.family === 'switch-steam-deck'; }],
        ['Wearables', function (x) { return x.family === 'watch-earbuds'; }]]
        .map(function (b) {
          var ws = A.DEVICES.filter(b[1]).map(function (x) { return x.max_charge_w; });
          return { name: b[0], lo: Math.min.apply(null, ws), hi: Math.max.apply(null, ws) };
        });
      // Labels sit clear of their band: after it when the band ends before 60% of the track, before it otherwise.
      $('#prompt').innerHTML = bands.map(function (b) {
        var lo = Math.min(1, b.lo / 100), hi = Math.min(1, b.hi / 100);
        return '<div class="band' + (hi > 0.6 ? ' band--before' : '') + '" style="--lo:' + lo + ';--hi:' + hi + '"><span class="band__fill"></span>' +
          '<span class="band__label">' + b.name + ' <b>' + (b.lo === b.hi ? b.lo : b.lo + ' to ' + b.hi) + 'W</b></span></div>';
      }).join('');
      $('#own-cap').textContent = 'Published ceilings, indicative';
      $('#own-sub').textContent = 'Each family\u2019s range as the makers publish it. Pick a device for its own figure.';
      $('#own-line').textContent = 'Pick what you own and the store answers.';
      $('#own-counts').textContent = 'Cases, cables, chargers, power banks, hubs, car and wireless, from fifteen categories.';
      return;
    }

    var list = fitList(), w = d.max_charge_w;
    fill.style.setProperty('--pct', Math.min(1, w / 100));
    prompt.hidden = true; figure.hidden = false;
    A.countTo($('#figure-n'), w);
    $('#own-cap').textContent = 'Takes up to ' + w + 'W over ' + (CONNECTOR[d.connector] || d.connector);
    $('#own-sub').textContent = 'The ' + d.name + '’s own charge ceiling, as its maker publishes it. Indicative; each power product below states what its port can give.';
    var byCat = {};
    list.forEach(function (p) { byCat[p.category] = (byCat[p.category] || 0) + 1; });
    var parts = FIT_ORDER.filter(function (s) { return byCat[s]; }).map(function (s) { return byCat[s] + ' ' + cat(s).name.toLowerCase(); });
    $('#own-line').textContent = list.length + (list.length === 1 ? ' product fits ' : ' products fit ') + d.name + '.';
    $('#own-counts').textContent = parts.length ? parts.join(', ') + '.' : '';
  }

  function renderFitRow() {
    var d = device(), list = fitList(), sub = $('#fits-sub'), h = $('#h-fits'), count = $('#fits-count');
    if (!list) {
      h.textContent = 'Fits what you own';
      sub.textContent = 'The best sellers across accessories and power, until you pick what you own.';
      count.innerHTML = '<a class="section__link" href="shop/all.html">All products <svg aria-hidden="true"><use href="#i-arrow"/></svg></a>';
      list = defaultFits();
    } else {
      h.textContent = 'Fits ' + d.name;
      sub.textContent = 'Cases, cables, chargers and hubs the catalog lists for it. Watts appear on power products only.';
      count.innerHTML = '<a class="section__link" href="shop/all.html?device=' + d.id + '">See all ' + list.length + ' <svg aria-hidden="true"><use href="#i-arrow"/></svg></a>';
    }
    $('#fits-row').innerHTML = list.length ? tiles(list)
      : '<p class="empty fitsrow__empty">The catalog lists nothing for ' + esc(d.name) + ' yet.</p>';
  }

  /* ---------- Groups: category grid and one featured row each ---------- */

  function renderGroups() {
    $('#groups').innerHTML = GROUPS.map(function (g) {
      var gcats = cats().filter(function (c) { return c.group === g.name; });
      var grid = gcats.map(function (c) {
        var n = products().filter(function (p) { return p.category === c.slug; }).length;
        var built = A.ROUTES.shop.indexOf(c.slug) >= 0;
        var inner = '<span class="cat__icon"><svg aria-hidden="true"><use href="#i-' + c.slug + '"/></svg></span>' +
          '<span class="cat__text"><b>' + esc(c.name) + '</b><small>' + esc(c.blurb) + '</small></span>' +
          '<span class="cat__count">' + (built
            ? 'Shop ' + n + ' ' + c.name.toLowerCase() + '<svg class="cat__go" aria-hidden="true"><use href="#i-arrow"/></svg>'
            : n + (n === 1 ? ' product' : ' products') + '<span class="cat__soon">page not built</span>') + '</span>';
        return built
          ? '<a class="cat" href="shop/' + c.slug + '.html' + query() + '">' + inner + '</a>'
          : '<div class="cat cat--soon">' + inner + '</div>';
      }).join('');
      var skip = state.device ? [] : defaultFits().map(function (p) { return p.id; });
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
    var own = products().filter(function (p) { return !p.brand || p.brand === 'Ampline'; });
    var power = own.filter(function (p) { return A.maxPortWatts(p) !== null; });
    var w = power.map(A.maxPortWatts), lo = Math.min.apply(null, w), hi = Math.max.apply(null, w);
    var tech = []; own.forEach(function (p) { p.badges.forEach(function (b) { if (['GaN', 'MFi', 'Qi2'].indexOf(b) >= 0 && tech.indexOf(b) < 0) tech.push(b); }); });
    $('#house-fill').style.setProperty('--pct', Math.min(1, hi / 100));
    $('#house-n').textContent = hi;
    $('#house-sub').textContent = 'Our own chargers, cables, power banks, hubs, car and wireless products. Every one lists the most watts a port can give, read from its spec sheet.';
    $('#house-facts').innerHTML = '<li><b>' + own.length + '</b> products</li><li><b>' + lo + ' to ' + hi + 'W</b> per port</li><li><b>' + tech.join(' · ') + '</b> in the range</li>';
  }

  /* ---------- Selection ---------- */

  // Row arrows: hidden at the end they cannot scroll towards, so they never sit over a first tile for nothing.
  function render() { renderFamilies(); renderDevices(); renderOwn(); renderFitRow(); renderGroups(); requestAnimationFrame(A.syncRows); }

  function setDevice(id, opts) {
    opts = opts || {};
    var d = A.deviceById(id);
    state.device = d ? d.id : null;
    if (d) state.family = d.family;
    $('#guess').hidden = !state.suggested || !!state.device;
    if (!opts.silent) history.replaceState(null, '', state.device ? '#device=' + state.device : location.pathname + location.search);
    render();
    // On a phone the answer sits below the chips: bring the glyph into view after a tap.
    if (d && !opts.silent && window.matchMedia('(max-width: 1023px)').matches) {
      var top = $('#glyph').getBoundingClientRect().top + window.scrollY - document.querySelector('.bar').offsetHeight - 12;
      window.scrollTo({ top: top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }
  function setFamily(id) {
    state.family = state.family === id ? null : id;
    if (state.device && A.deviceById(state.device).family !== state.family) { state.device = null; history.replaceState(null, '', location.pathname + location.search); }
    $('#guess').hidden = !state.suggested || !!state.device;
    render();
  }
  function deviceFromHash() {
    var m = /device=([a-z0-9-]+)/.exec(location.hash);
    return m ? m[1] : null;
  }
  // The browser hints at a family and sometimes a device; an iPhone's model is not in the UA,
  // so the iPhone family opens with nothing ringed.
  function guess() {
    var ua = navigator.userAgent;
    if (/Android/.test(ua)) return { family: 'android', device: 'android-phone' };
    if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return { family: 'ipad', device: 'ipad' };
    if (/iPhone/.test(ua)) return { family: 'iphone', device: null };
    if (/Macintosh/.test(ua)) return { family: 'mac', device: 'macbook-air' };
    if (/Windows|Linux|CrOS/.test(ua)) return { family: 'windows-laptop', device: 'windows-laptop' };
    return { family: null, device: null };
  }

  /* ---------- Events ---------- */

  document.addEventListener('click', function (e) {
    var fam = e.target.closest('[data-family]');
    if (fam) { setFamily(fam.dataset.family); return; }
    var chip = e.target.closest('[data-device]');
    if (chip) { setDevice(state.device === chip.dataset.device ? null : chip.dataset.device); return; }
  });
  document.addEventListener('ampline:cart', function () { renderFitRow(); renderGroups(); });
  window.addEventListener('hashchange', function () { setDevice(deviceFromHash(), { silent: true }); });

  /* ---------- Boot ---------- */

  A.load('')
    .then(function (data) {
      $('#foot-cats').innerHTML = A.shopLinks(data.categories, '', null);
      renderHouse();
      // The browser's guess only marks a chip; the battery stays empty until the first tap.
      var g = guess();
      state.suggested = g.device;
      state.family = g.family;
      if (state.suggested) $('#guess-name').textContent = A.deviceById(state.suggested).name;
      setDevice(deviceFromHash(), { silent: true });
    })
    .catch(function () {
      $('#fits-row').innerHTML = A.loadError();
      $('#groups').innerHTML = '';
    });
})();
