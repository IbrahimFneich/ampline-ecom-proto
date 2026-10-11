/* Ampline — listing pages (shop/<category>.html and shop/all.html). Shared logic in catalog.js.
   Filter groups come from each category's facets in the catalog; the Fits device group appears
   on Accessories and Power listings (and the all-products listing); sort options follow the group.
   State lives in the URL (?device=&q=&<facet>=&sort=), so a filtered list can be shared. */
(function () {
  'use strict';

  var A = window.Ampline, $ = A.$, esc = A.esc;
  var CAT = document.body.dataset.category, BASE = document.body.dataset.base || '';
  var SORT_ALL = [['featured', 'Featured'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['rating-desc', 'Rating: high to low']];
  var SORT_POWER = [['watts-desc', 'Max output: high to low']];
  var state = { pool: [], category: null, defs: [], fitsGroup: false, family: null, f: { device: null, q: '', deal: false, facets: {} }, sort: 'featured' };
  var baseTitle = '';
  var searchForm = document.querySelector('.bar__search');

  function noun(n) { return A.nounFor(CAT, n); }
  function device() { return A.deviceById(state.f.device); }
  function cats() { return A.state.categories; }
  function paramOf(label) { return A.slugify(label); }
  function results(over) { return state.pool.filter(function (p) { return (!state.f.deal || p.compare_at) && A.passes(p, state.f, state.defs, over, cats()); }); }
  function sorted(list) {
    var fn = A.SORTS[state.sort];
    if (fn) return list.slice().sort(fn);
    if (!state.f.q) return list;
    // Featured under a search: name and category hits first, catalog order within a rank.
    return list.map(function (p, i) { return { p: p, i: i, r: A.searchRank(p, state.f.q, cats()) }; })
      .sort(function (a, b) { return b.r - a.r || a.i - b.i; }).map(function (x) { return x.p; });
  }
  function optLabel(label, id) {
    var def = state.defs.find(function (d) { return d.label === label; });
    var o = def && def.opts.find(function (x) { return x.id === id; });
    return o ? o.label : id;
  }
  function applied() {
    var out = [];
    if (state.f.q) out.push({ g: 'q', id: '', label: 'Search: ' + state.f.q });
    if (state.f.deal) out.push({ g: 'deal', id: '', label: 'On deal' });
    if (state.f.device) out.push({ g: 'device', id: state.f.device, label: 'Fits ' + device().name });
    state.defs.forEach(function (d) {
      (state.f.facets[d.label] || []).forEach(function (id) { out.push({ g: d.label, id: id, label: optLabel(d.label, id) }); });
    });
    return out;
  }

  /* URL state */

  function readUrl() {
    var q = new URLSearchParams(location.search);
    state.f.device = A.deviceById(q.get('device')) ? q.get('device') : null;
    state.f.q = (q.get('q') || '').trim();
    state.f.deal = q.get('deal') === '1';
    state.f.facets = {};
    state.defs.forEach(function (d) {
      var ids = (q.get(paramOf(d.label)) || '').split(',').filter(function (id) { return d.opts.some(function (o) { return o.id === id; }); });
      if (ids.length) state.f.facets[d.label] = ids;
    });
    var sortIds = sortOptions().map(function (s) { return s[0]; });
    state.sort = sortIds.indexOf(q.get('sort')) >= 0 ? q.get('sort') : 'featured';
  }
  function writeUrl() {
    var q = new URLSearchParams();
    if (state.f.q) q.set('q', state.f.q);
    if (state.f.deal) q.set('deal', '1');
    if (state.f.device) q.set('device', state.f.device);
    state.defs.forEach(function (d) { var ids = state.f.facets[d.label] || []; if (ids.length) q.set(paramOf(d.label), ids.join(',')); });
    if (state.sort !== 'featured') q.set('sort', state.sort);
    var qs = q.toString(), next = location.pathname + (qs ? '?' + qs : '');
    if (next !== location.pathname + location.search) history.pushState(null, '', next); // Back undoes one filter step
  }
  function sortOptions() {
    var power = state.category ? state.category.group === 'Power' : false;
    return SORT_ALL.concat(power ? SORT_POWER : []);
  }

  /* Rail */

  function renderGroups() {
    var facetHtml = state.defs.map(function (d) {
      return '<fieldset class="group" data-group="' + esc(d.label) + '"><legend>' + esc(A.legendFor(d.label)) + (d.label === 'Price' ? ' <span class="syn">synthetic</span>' : '') + '</legend>' +
        d.opts.map(function (o) {
          return '<label class="opt"><input type="checkbox" name="' + esc(d.label) + '" value="' + esc(o.id) + '"><span>' + esc(o.label) + '</span><em></em></label>';
        }).join('') + '</fieldset>';
    }).join('');
    $('#groups').innerHTML = facetHtml;
  }

  /* The "What do you own?" strip above the grid: families, then that family's devices with would-be counts,
     then the models a bucket holds (cases and folios fit one model). Same steps as home, so the shopper already knows them. */
  function bucketOf(d) { return d && d.parent ? A.deviceById(d.parent) : d; }
  function chip(d, pressed) {
    var n = results({ group: 'device', ids: [d.id] }).length;
    return '<button type="button" class="chip" data-device="' + d.id + '" aria-pressed="' + pressed + '"' + (!n && !pressed ? ' disabled' : '') + '>' +
      esc(d.name) + '<em>' + n + '<span class="vh"> results</span></em></button>';
  }
  function renderOwn() {
    var own = $('#own');
    own.hidden = !state.fitsGroup;
    if (!state.fitsGroup) return;
    var d = device(), picked = bucketOf(d), fam = state.family || (d ? d.family : null);
    $('#families').innerHTML = A.deviceGroups().map(function (g) {
      return '<button type="button" class="chip" data-family="' + g.id + '" aria-pressed="' + (fam === g.id) + '">' + esc(g.name) + '</button>';
    }).join('');
    var g = A.deviceGroups().find(function (x) { return x.id === fam; }), box = $('#devices-chips');
    box.hidden = !g;
    if (g) box.innerHTML = '<div class="chipset">' + g.devices.filter(function (x) { return !x.parent; }).map(function (x) { return chip(x, !!picked && picked.id === x.id); }).join('') + '</div>';
    var models = picked ? A.DEVICES.filter(function (x) { return x.parent === picked.id; }) : [], mbox = $('#models-chips');
    mbox.hidden = !models.length;
    if (models.length) mbox.innerHTML = '<span class="chipgroup__label">Which model? Cases and folios fit one model only.</span><div class="chipset">' +
      models.map(function (m) { return chip(m, state.f.device === m.id); }).join('') + '</div>';
  }

  // Controls render once; this keeps them in step with state and shows each option's would-be count.
  function syncGroups() {
    document.querySelectorAll('.group[data-group] .opt').forEach(function (lab) {
      var inp = lab.querySelector('input'), g = inp.name, id = inp.value;
      var n = results({ group: g, ids: [id] }).length;
      lab.querySelector('em').innerHTML = n + '<span class="vh"> results</span>';
      inp.checked = (state.f.facets[g] || []).indexOf(id) >= 0;
      inp.disabled = !n && !inp.checked;
    });
    // A group with fewer than two live options cannot narrow anything: it steps aside until the answer widens.
    document.querySelectorAll('.group[data-group]').forEach(function (fs) {
      var live = [].filter.call(fs.querySelectorAll('input'), function (i) { return !i.disabled || i.checked; }).length;
      fs.hidden = live < 2;
    });
    var n = applied().filter(function (a) { return a.g !== 'q' && a.g !== 'device'; }).length, badge = $('#filters-n'); // the search and the device are not in the sheet
    badge.textContent = n; badge.hidden = !n;
    $('#open-filters').hidden = !n && !document.querySelector('.group[data-group]:not([hidden])'); // nothing left to filter by
    var r = results().length;
    $('#apply-sheet').textContent = 'Show ' + r + ' ' + noun(r);
  }

  /* Results */

  function renderApplied() {
    var list = applied();
    var chips = list.map(function (a) {
      return '<button type="button" class="applied__chip" data-clear="' + esc(a.g) + ':' + esc(a.id) + '" aria-label="Remove filter ' + esc(a.label) + '">' + esc(a.label) + '<svg aria-hidden="true"><use href="#i-x"/></svg></button>';
    });
    var clear = chips.length > 1 ? '<button type="button" class="applied__clear" data-clear-all>Clear all</button>' : ''; // one chip is its own clear
    $('#applied').innerHTML = chips.length ? chips.slice(0, -1).join('') + '<span class="applied__end">' + chips[chips.length - 1] + clear + '</span>' : '';
  }

  function renderCount(n) {
    var total = state.pool.length;
    $('#count').innerHTML = '<span class="mini count__mini" aria-hidden="true"><i style="--pct:' + (total ? n / total : 0) + '"></i></span><span>' +
      (n === total && !state.f.q ? total + ' ' + noun(total) : n + ' of ' + total + ' ' + noun(total)) +
      (state.f.q ? ' <small>for “' + esc(state.f.q) + '”</small>' : '') +
      (state.f.deal ? ' <small>on deal</small>' : '') + '</span>'; // the title already names the device
  }

  // The empty state names the single filter whose removal frees the most results.
  function renderEmpty(show) {
    var box = $('#empty');
    box.hidden = !show;
    if (!show) return;
    var groups = [];
    if (state.f.q) groups.push('q');
    if (state.f.deal) groups.push('deal');
    if (state.f.device) groups.push('device');
    state.defs.forEach(function (d) { if ((state.f.facets[d.label] || []).length) groups.push(d.label); });
    var best = null;
    groups.forEach(function (g) {
      var n = g === 'q' ? state.pool.filter(function (p) { return (!state.f.deal || p.compare_at) && A.passes(p, { device: state.f.device, q: '', facets: state.f.facets }, state.defs, null, cats()); }).length
        : g === 'deal' ? state.pool.filter(function (p) { return A.passes(p, state.f, state.defs, null, cats()); }).length
        : results({ group: g, ids: [] }).length;
      if (!n) return;
      // The device is the shopper's answer: it is the removal to suggest only when nothing else frees results.
      if (!best || (best.g === 'device' && g !== 'device')) best = { g: g, n: n };
      else if (g !== 'device' && n > best.n) best = { g: g, n: n };
    });
    var name = best && (best.g === 'q' ? 'the search' : best.g === 'deal' ? 'On deal' : best.g === 'device' ? device().name
      : (state.f.facets[best.g].length === 1 ? optLabel(best.g, state.f.facets[best.g][0]) : 'the ' + A.legendFor(best.g).toLowerCase() + ' filter'));
    $('#empty-title').textContent = state.f.q && groups.length === 1 ? 'Nothing matches “' + state.f.q + '”.' : 'No ' + noun(1) + ' matches all of these.';
    $('#empty-hint').textContent = best
      ? (best.g === 'q' ? 'Clearing the search shows ' : 'Removing “' + name + '” shows ') + best.n + ' ' + noun(best.n) + '.'
      : 'No single filter is holding the list back; clear them and start again.';
    $('#empty-actions').innerHTML = (best
      ? '<button type="button" class="btn" data-clear="' + esc(best.g) + '">' + (best.g === 'q' ? 'Clear the search' : 'Remove ' + esc(name)) + '</button>' : '') +
      (groups.length > 1 || !best ? '<button type="button" class="btn btn--ghost" data-clear-all>Clear all filters</button>' : ''); // one filter, one way out
  }

  function render() {
    var list = sorted(results());
    var q = state.f.device ? '?device=' + state.f.device : '';
    renderCount(list.length);
    renderApplied();
    $('#tiles').innerHTML = list.map(function (p, i) { return A.tile(p, i, BASE, q); }).join('');
    $('#tiles').hidden = !list.length;
    renderEmpty(!list.length);
    syncGroups();
    renderOwn();
    $('#catrow').innerHTML = A.catRow(BASE, device() ? '?device=' + encodeURIComponent(device().id) : '', CAT); // the id is the catalog's, never the URL's text // the circles carry the device; this page's circle is marked
    var d = device(), title = d ? (CAT === 'all' ? 'Fits ' + d.name : baseTitle + ' for ' + d.name) : baseTitle;
    $('#page-title').textContent = title;
    $('#blurb').hidden = !!d; // the title says it
    document.title = title + ' \u2014 Ampline';
    var gsel = CAT === 'all' ? (state.f.facets.Group || []) : [];
    var cur = CAT === 'all' ? (gsel.length === 1 ? gsel[0] : null) : A.slugify(state.category.group);
    document.querySelectorAll('.bar__nav a[href*="group="]').forEach(function (a) {
      var g = a.getAttribute('href').split('group=')[1];
      if (g === cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (searchForm && CAT === 'all') searchForm.querySelector('input').value = state.f.q;
  }

  /* Events */

  function showCount() { $('.toolbar').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }

  function clear(spec) {
    var i = spec.indexOf(':'), g = i < 0 ? spec : spec.slice(0, i), id = i < 0 ? undefined : spec.slice(i + 1);
    if (g === 'q') state.f.q = '';
    else if (g === 'deal') state.f.deal = false;
    else if (g === 'device') state.f.device = null;
    else if (!id) delete state.f.facets[g];
    else state.f.facets[g] = (state.f.facets[g] || []).filter(function (x) { return x !== id; });
  }
  function clearAll() { state.f = { device: null, q: '', deal: false, facets: {} }; }

  $('#filters').addEventListener('change', function (e) {
    var inp = e.target;
    if (inp.name === 'device') state.f.device = inp.value || null;
    else {
      var cur = state.f.facets[inp.name] || [];
      state.f.facets[inp.name] = inp.checked ? cur.concat([inp.value]) : cur.filter(function (x) { return x !== inp.value; });
    }
    writeUrl(); render();
  });
  $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; writeUrl(); render(); });
  $('#own').addEventListener('click', function (e) {
    var fam = e.target.closest('[data-family]'), dev = e.target.closest('[data-device]');
    if (fam) {
      var on = fam.getAttribute('aria-pressed') === 'true';
      state.family = on ? null : fam.dataset.family;
      if (on || (state.f.device && device().family !== state.family)) state.f.device = null; // closing or switching the family drops the device
    } else if (dev && !dev.disabled) {
      var id = dev.dataset.device, same = state.f.device === id, picked = A.deviceById(id);
      state.family = picked.family;
      // Unpressing a model keeps its bucket; unpressing a bucket clears the device.
      state.f.device = same ? (picked.parent || null) : id;
    } else return;
    writeUrl(); render();
    // On narrow screens the answer sits below the strip: bring the count line up once a device is named.
    if (dev && state.f.device && !window.matchMedia('(min-width: 1024px)').matches) showCount();
  });
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-clear], [data-clear-all]');
    if (!el) return;
    if (el.hasAttribute('data-clear-all')) clearAll(); else clear(el.dataset.clear);
    writeUrl(); render();
  });
  // The header search stays on this page when it already shows every product; elsewhere it submits to the all-products listing.
  if (searchForm && CAT === 'all') {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      state.f.q = searchForm.querySelector('input').value.trim();
      writeUrl(); render();
      if (window.matchMedia('(pointer: coarse)').matches) searchForm.querySelector('input').blur(); // the keyboard would cover the answer
      showCount(); // the count line reads the answer; scroll-padding keeps it under the header
    });
  }
  // A cart change updates only the tile buttons whose state is stale; the clicked button keeps its "Added" moment and its focus.
  function syncAddButtons() {
    var check = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
    document.querySelectorAll('#tiles [data-add], #tiles [data-choose]').forEach(function (b) {
      var link = b.hasAttribute('data-choose'), has = A.cart.has(b.dataset.add || b.dataset.choose);
      if (has === b.classList.contains('btn--added')) return;
      b.classList.toggle('btn--added', has);
      b.innerHTML = has ? check + 'In cart' : link ? 'Choose options' : 'Add to cart';
    });
  }
  document.addEventListener('ampline:cart', syncAddButtons);
  window.addEventListener('popstate', function () { readUrl(); $('#sort').value = state.sort; render(); });

  /* Mobile filter sheet: a native dialog on phones, the static rail from 1024px. */
  var sheet = $('#sheet'), wide = window.matchMedia('(min-width: 1024px)');
  $('#open-filters').addEventListener('click', function () { if (!sheet.open) sheet.showModal(); });
  $('#close-filters').addEventListener('click', function () { sheet.close(); });
  $('#apply-sheet').addEventListener('click', function () { sheet.close(); });
  $('#clear-sheet').addEventListener('click', function () { state.f.facets = {}; state.f.deal = false; writeUrl(); render(); }); // the sheet holds facets; search and device live outside it
  // The footer's Filters link targets the rail, which is a closed dialog on phones.
  document.querySelectorAll('a[href="#filters"]').forEach(function (a) {
    a.addEventListener('click', function (e) { if (!wide.matches) { e.preventDefault(); sheet.showModal(); } });
  });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
  wide.addEventListener('change', function () { if (wide.matches && sheet.open) sheet.close(); });

  /* Boot. The list renders after the fetch, so the browser's own scroll restore lands short; the page keeps its own. */
  function scrollKey() { return 'ampline:scroll:' + location.pathname + location.search; } // the URL at the moment of leaving, filters included
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('pagehide', function () { try { sessionStorage.setItem(scrollKey(), String(Math.round(window.scrollY))); } catch (e) { /* storage off: no restore */ } });
  function restoreScroll() {
    var nav = (performance.getEntriesByType ? performance.getEntriesByType('navigation') : [])[0], y = 0;
    if (!nav || (nav.type !== 'back_forward' && nav.type !== 'reload')) return;
    try { y = +sessionStorage.getItem(scrollKey()) || 0; } catch (e) { /* storage off */ }
    if (y) window.scrollTo({ top: y, behavior: 'instant' }); // a restore is not a journey: no smooth scroll
  }

  A.load(BASE)
    .then(function (data) {
      var all = CAT === 'all';
      state.category = all ? null : data.categories.find(function (c) { return c.slug === CAT; });
      state.pool = all ? data.products : data.products.filter(function (p) { return p.category === CAT; });
      // The all-products page spans phones and cables, so a price band over the whole pool answers nothing: Group is its price divider.
      var labels = all ? ['Group', 'Brand'] : state.category.facets;
      // Only options that match something in the pool are offered, and a group needs two of them to filter anything.
      state.defs = labels.map(function (label) {
        var opts = A.facetOptions(label, state.pool, data.categories).filter(function (o) { return state.pool.some(o.test); });
        return { label: label, opts: opts };
      }).filter(function (d) { return d.opts.length > 1; });
      state.fitsGroup = all || ['Accessories', 'Power'].indexOf(state.category.group) >= 0;
      // The device radios already answer "fits"; a prose Fits spec facet beside them would say it twice.
      if (state.fitsGroup) state.defs = state.defs.filter(function (d) { return d.label !== 'Fits'; });
      $('#sort').innerHTML = sortOptions().map(function (s) { return '<option value="' + s[0] + '">' + s[1] + '</option>'; }).join('');
      readUrl();
      $('#sort').value = state.sort;
      if (searchForm) searchForm.querySelector('input').value = state.f.q;
      baseTitle = all ? 'All products' : state.category.name;
      $('#crumb-name').textContent = all ? 'All products' : state.category.name;
      $('#blurb').textContent = (all ? 'Search by name, brand or spec, or start from what you own' : state.category.blurb) + '.'; // every price and rating carries its own SYNTHETIC tag
      $('#foot-cats').innerHTML = A.shopLinks(data.categories, BASE, CAT);
      renderGroups();
      render();
      // The row opens with this page's circle in view: a category page should show where it sits among the others.
      var row = $('#catrow'), cur = row.querySelector('a[aria-current]');
      if (cur) row.scrollLeft = Math.max(0, cur.offsetLeft - (row.clientWidth - cur.offsetWidth) / 2);
      restoreScroll();
    })
    .catch(function () {
      $('#tiles').innerHTML = A.loadError();
      $('#count').textContent = '';
    });
})();
