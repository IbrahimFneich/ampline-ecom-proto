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
  var state = { pool: [], category: null, defs: [], fitsGroup: false, f: { device: null, q: '', deal: false, facets: {} }, sort: 'featured' };
  var searchForm = document.querySelector('.bar__search');

  function noun(n) { return A.nounFor(CAT, n); }
  function device() { return A.deviceById(state.f.device); }
  function cats() { return A.state.categories; }
  function paramOf(label) { return A.slugify(label); }
  function results(over) { return state.pool.filter(function (p) { return (!state.f.deal || p.compare_at) && A.passes(p, state.f, state.defs, over, cats()); }); }
  function sorted(list) { var fn = A.SORTS[state.sort]; return fn ? list.slice().sort(fn) : list; }
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
    var qs = q.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }
  function sortOptions() {
    var power = state.category ? state.category.group === 'Power' : false;
    return SORT_ALL.concat(power ? SORT_POWER : []);
  }

  /* Rail */

  function renderGroups() {
    var fitsHtml = '';
    if (state.fitsGroup) {
      var radio = function (d) {
        var id = 'dev-' + (d.id || 'any');
        return '<input type="radio" class="vh" name="device" id="' + id + '" value="' + d.id + '">' +
          '<label class="chip" for="' + id + '">' + esc(d.name) + '<em></em></label>';
      };
      fitsHtml = '<fieldset class="group"><legend>Fits</legend><div class="chipset">' + radio({ id: '', name: 'Any device' }) + '</div>' +
        A.deviceGroups().map(function (g) {
          return '<div class="chipgroup"><span class="chipgroup__label">' + esc(g.name) + '</span><div class="chipset">' + g.devices.map(radio).join('') + '</div></div>';
        }).join('') + '</fieldset>';
    }
    var facetHtml = state.defs.map(function (d) {
      return '<fieldset class="group" data-group="' + esc(d.label) + '"><legend>' + esc(A.legendFor(d.label)) + (d.label === 'Price' ? ' <span class="syn">synthetic</span>' : '') + '</legend>' +
        d.opts.map(function (o) {
          return '<label class="opt"><input type="checkbox" name="' + esc(d.label) + '" value="' + esc(o.id) + '"><span>' + esc(o.label) + '</span><em></em></label>';
        }).join('') + '</fieldset>';
    }).join('');
    // Category listings lead with fit; the all-products listing is a search landing, so Group and Brand come first there.
    $('#groups').innerHTML = CAT === 'all' ? facetHtml + fitsHtml : fitsHtml + facetHtml;
  }

  // Controls render once; this keeps them in step with state and shows each option's would-be count.
  function syncGroups() {
    document.querySelectorAll('input[name="device"]').forEach(function (r) {
      var n = results({ group: 'device', ids: r.value ? [r.value] : [] }).length;
      r.checked = (r.value || null) === state.f.device;
      r.disabled = !n && !r.checked && !!r.value;
      r.nextElementSibling.querySelector('em').innerHTML = n + '<span class="vh"> results</span>';
    });
    document.querySelectorAll('.group[data-group] .opt').forEach(function (lab) {
      var inp = lab.querySelector('input'), g = inp.name, id = inp.value;
      var n = results({ group: g, ids: [id] }).length;
      lab.querySelector('em').innerHTML = n + '<span class="vh"> results</span>';
      inp.checked = (state.f.facets[g] || []).indexOf(id) >= 0;
      inp.disabled = !n && !inp.checked;
    });
    var n = applied().filter(function (a) { return a.g !== 'q'; }).length, badge = $('#filters-n'); // the search is not in the sheet
    badge.textContent = n; badge.hidden = !n;
    var r = results().length;
    $('#apply-sheet').textContent = 'Show ' + r + ' ' + noun(r);
  }

  /* Results */

  function renderApplied() {
    var list = applied();
    var chips = list.map(function (a) {
      return '<button type="button" class="applied__chip" data-clear="' + esc(a.g) + ':' + esc(a.id) + '" aria-label="Remove filter ' + esc(a.label) + '">' + esc(a.label) + '<svg aria-hidden="true"><use href="#i-x"/></svg></button>';
    });
    var clear = '<button type="button" class="applied__clear" data-clear-all>Clear all</button>';
    $('#applied').innerHTML = chips.length ? chips.slice(0, -1).join('') + '<span class="applied__end">' + chips[chips.length - 1] + clear + '</span>' : '';
  }

  function renderCount(n) {
    var total = state.pool.length, d = device();
    $('#count').innerHTML = '<span class="mini count__mini" aria-hidden="true"><i style="--pct:' + (total ? n / total : 0) + '"></i></span><span>' +
      (n === total && !state.f.q ? total + ' ' + noun(total) : n + ' of ' + total + ' ' + noun(total)) +
      (state.f.q ? ' <small>for “' + esc(state.f.q) + '”</small>' : '') +
      (state.f.deal ? ' <small>on deal</small>' : '') +
      (d ? ' <small>fit ' + esc(d.name) + '</small>' : '') + '</span>';
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
      if (n && (!best || n > best.n)) best = { g: g, n: n };
    });
    var name = best && (best.g === 'q' ? 'the search' : best.g === 'deal' ? 'On deal' : best.g === 'device' ? device().name
      : (state.f.facets[best.g].length === 1 ? optLabel(best.g, state.f.facets[best.g][0]) : 'the ' + A.legendFor(best.g).toLowerCase() + ' filter'));
    $('#empty-title').textContent = state.f.q && groups.length === 1 ? 'Nothing matches “' + state.f.q + '”.' : 'No ' + noun(1) + ' matches all of these.';
    $('#empty-hint').textContent = best
      ? (best.g === 'q' ? 'Clearing the search shows ' : 'Removing “' + name + '” shows ') + best.n + ' ' + noun(best.n) + '.'
      : 'No single filter is holding the list back; clear them and start again.';
    $('#empty-actions').innerHTML = (best
      ? '<button type="button" class="btn" data-clear="' + esc(best.g) + '">' + (best.g === 'q' ? 'Clear the search' : 'Remove ' + esc(name)) + '</button>' : '') +
      '<button type="button" class="btn btn--ghost" data-clear-all>Clear all filters</button>';
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
    var gsel = CAT === 'all' ? (state.f.facets.Group || []) : [];
    var cur = CAT === 'all' ? (gsel.length === 1 ? gsel[0] : null) : A.slugify(state.category.group);
    document.querySelectorAll('.bar__nav a[href*="group="]').forEach(function (a) {
      var g = a.getAttribute('href').split('group=')[1];
      if (g === cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (searchForm && CAT === 'all') searchForm.querySelector('input').value = state.f.q;
  }

  /* Events */

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
      $('#tiles').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  document.addEventListener('ampline:cart', render);
  window.addEventListener('popstate', function () { readUrl(); $('#sort').value = state.sort; render(); });

  /* Mobile filter sheet: a native dialog on phones, the static rail from 1024px. */
  var sheet = $('#sheet'), wide = window.matchMedia('(min-width: 1024px)');
  $('#open-filters').addEventListener('click', function () { if (!sheet.open) sheet.showModal(); });
  $('#close-filters').addEventListener('click', function () { sheet.close(); });
  $('#apply-sheet').addEventListener('click', function () { sheet.close(); });
  $('#clear-sheet').addEventListener('click', function () { var q = state.f.q; clearAll(); state.f.q = q; writeUrl(); render(); });
  // The footer's Filters link targets the rail, which is a closed dialog on phones.
  document.querySelectorAll('a[href="#filters"]').forEach(function (a) {
    a.addEventListener('click', function (e) { if (!wide.matches) { e.preventDefault(); sheet.showModal(); } });
  });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
  wide.addEventListener('change', function () { if (wide.matches && sheet.open) sheet.close(); });

  /* Boot */

  A.load(BASE)
    .then(function (data) {
      var all = CAT === 'all';
      state.category = all ? null : data.categories.find(function (c) { return c.slug === CAT; });
      state.pool = all ? data.products : data.products.filter(function (p) { return p.category === CAT; });
      var labels = all ? ['Group', 'Brand', 'Price'] : state.category.facets;
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
      $('#page-title').textContent = all ? 'All products' : state.category.name;
      document.title = (all ? 'All products' : state.category.name) + ' — Ampline';
      $('#crumb-name').textContent = all ? 'All products' : state.category.name;
      $('#blurb').textContent = (all ? 'Every product in the store, searchable by name, brand and spec' : state.category.blurb) + '. Prices and ratings are synthetic placeholders.';
      $('#foot-cats').innerHTML = A.shopLinks(data.categories, BASE, CAT);
      renderGroups();
      render();
    })
    .catch(function () {
      $('#tiles').innerHTML = A.loadError();
      $('#count').textContent = '';
    });
})();
