/* Ampline admin — one page, hash routes, no backend.
   Reads ../content/products.json and ../content/orders.json; every edit is held in localStorage under one key
   and layered over the files on load. "Reset demo data" clears the key. Counts and money come only from orders.json. */
(function () {
  'use strict';

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function slugify(s) { return String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  var DAY = 86400000;

  var KEY = 'ampline:admin:v1', SESSION = 'ampline:admin:session';
  var STATUSES = ['new', 'packed', 'shipped', 'delivered', 'cancelled'];
  var LABEL = { new: 'New', packed: 'Packed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
  var PCT = { new: 0, packed: 0.34, shipped: 0.67, delivered: 1, cancelled: 0 };
  var NEXT = { new: 'packed', packed: 'shipped', shipped: 'delivered' };
  var STOCK = { in_stock: ['In stock', 1, ''], low_stock: ['Low stock', 0.22, 'low'], out_of_stock: ['Out of stock', 0, 'out'] };
  var PROMISE_DAYS = 3;
  var CANCEL_REASONS = ['Customer changed their mind', 'Could not reach the customer', 'Item out of stock', 'Duplicate order', 'Address outside the delivery area', 'Other'];
  var GROUPS = ['Devices', 'Accessories', 'Power'];
  var FAMILIES = [['iphone', 'iPhone'], ['android', 'Android'], ['ipad', 'iPad'], ['mac', 'Mac'], ['windows-laptop', 'Windows laptop'], ['switch-steam-deck', 'Switch & Steam Deck'], ['watch-earbuds', 'Watch & earbuds']];
  var TRUST_DEFAULT = ['Delivery across Lebanon in 1 to 3 days', '1-year warranty', 'Card or cash on delivery'];

  /* ---------- Overlay: every edit, in one localStorage key ---------- */

  function blank() { return { orders: {}, placed: [], products: {}, added: [], categories: { renamed: {}, added: [] }, devices: { renamed: {}, added: [] }, settings: {} }; }
  var storageOk = true;
  function loadOverlay() {
    try { var raw = localStorage.getItem(KEY); var o = raw ? JSON.parse(raw) : null; return Object.assign(blank(), o || {}); }
    catch (e) { storageOk = false; return blank(); }
  }
  var state = { catalog: null, seed: null, errors: {}, overlay: loadOverlay(), route: { name: 'dashboard', id: null, q: {} }, selected: {}, shift: 0, lastFocus: null, search: '' };
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state.overlay)); storageOk = true; }
    catch (e) { storageOk = false; toast('Storage is off: this edit lives until the tab closes.'); }
  }

  /* ---------- Data views over the files plus the overlay ---------- */

  function categories() {
    if (!state.catalog) return [];
    var ren = state.overlay.categories.renamed;
    return state.catalog.categories.map(function (c) { return Object.assign({}, c, ren[c.slug] ? { name: ren[c.slug] } : {}); }).concat(state.overlay.categories.added);
  }
  function devices() {
    if (!state.catalog) return [];
    var ren = state.overlay.devices.renamed;
    return state.catalog.devices.map(function (d) { return Object.assign({}, d, ren[d.id] ? { name: ren[d.id] } : {}); }).concat(state.overlay.devices.added);
  }
  function products() {
    if (!state.catalog) return [];
    var patch = state.overlay.products;
    return state.catalog.products.map(function (p) { return patch[p.id] ? Object.assign({}, p, patch[p.id]) : p; }).concat(state.overlay.added);
  }
  function productById(id) { return products().find(function (p) { return p.id === id; }) || null; }
  function categoryName(slug) { var c = categories().find(function (x) { return x.slug === slug; }); return c ? c.name : slug; }

  // Seed dates shift as a block so the newest seed order lands today; the file says so in _meta.demo_shift.
  function orders() {
    if (!state.seed) return [];
    var patch = state.overlay.orders, shift = state.shift;
    var seed = state.seed.orders.map(function (o) {
      var p = patch[o.id] || {};
      var hist = (p.history || o.history).map(function (h) { return { status: h.status, at: new Date(h.at).getTime() + (h.shifted ? 0 : shift) }; });
      return Object.assign({}, o, { status: p.status || o.status, cancel_reason: p.cancel_reason !== undefined ? p.cancel_reason : o.cancel_reason, at: new Date(o.placed_at).getTime() + shift, hist: hist, seed: true });
    });
    var placed = state.overlay.placed.map(function (o) {
      var p = patch[o.id] || {};
      return Object.assign({}, o, { status: p.status || o.status, cancel_reason: p.cancel_reason !== undefined ? p.cancel_reason : o.cancel_reason, at: new Date(o.placed_at).getTime(), hist: (p.history || o.history).map(function (h) { return { status: h.status, at: new Date(h.at).getTime() }; }), seed: false });
    });
    return seed.concat(placed).sort(function (a, b) { return b.at - a.at; });
  }
  function orderById(id) { return orders().find(function (o) { return o.id === id; }) || null; }
  function startOfDay(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function ageDays(o) { return (Date.now() - o.at) / DAY; }
  function isOpen(o) { return o.status === 'new' || o.status === 'packed' || o.status === 'shipped'; }
  function isLate(o) { return (o.status === 'packed' || o.status === 'shipped') && ageDays(o) >= PROMISE_DAYS; }
  function codOpen(o) { return o.payment === 'cod' && isOpen(o); }

  /* ---------- Formatting ---------- */

  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(t) { var d = new Date(t); return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function fmtDay(t) { var d = new Date(t); return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function rel(t) {
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + ' min ago';
    var h = Math.round(m / 60);
    if (h < 24) return h + ' h ago';
    var d = Math.round(h / 24);
    return d === 1 ? 'yesterday' : d + ' days ago';
  }
  function payLabel(o) {
    if (o.payment === 'card') return 'Card, paid at order';
    if (o.status === 'delivered') return 'Cash, collected on delivery';
    if (o.status === 'cancelled') return 'Cash on delivery, not collected';
    return 'Cash on delivery, to collect';
  }
  function statusHtml(o) {
    return '<span class="st st--' + o.status + '"><span class="mini" aria-hidden="true"><i style="--pct:' + PCT[o.status] + '"></i></span>' + LABEL[o.status] +
      (isLate(o) ? '<span class="late" title="Past the 1 to 3 day delivery promise">Day ' + Math.floor(ageDays(o)) + '</span>' : '') + '</span>';
  }
  function stockHtml(s) { var st = STOCK[s] || STOCK.in_stock; return '<span class="stockst stockst--' + st[2] + '"><span class="mini" aria-hidden="true"><i style="--pct:' + st[1] + '"></i></span>' + st[0] + '</span>'; }
  function stockMini(s, cls) { var st = STOCK[s] || STOCK.in_stock; return '<span class="mini ' + (cls || '') + (st[2] ? ' mini--' + st[2] : '') + '" aria-hidden="true"><i style="--pct:' + st[1] + '"></i></span>'; }
  function icon(id) { return '<svg aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function chip(label, n, pressed, attrs) { return '<button type="button" class="chip" aria-pressed="' + pressed + '" ' + attrs + '>' + esc(label) + (n != null ? '<em>' + n + '<span class="vh"> results</span></em>' : '') + '</button>'; }
  function errorBox(which) {
    var e = state.errors[which];
    return '<div class="error" role="alert">' + icon('i-warn') + '<div><b>content/' + which + '.json could not be loaded</b> (' + esc(e) + '). The admin reads ' + (which === 'orders' ? 'orders' : 'the catalog') + ' only from that file. Put it back under <code>content/</code> and reload.</div></div>';
  }
  function emptyBox(title, hint, action) {
    return '<div class="empty"><span class="mini" aria-hidden="true"><i style="--pct:0"></i></span><h2>' + esc(title) + '</h2><p>' + esc(hint) + '</p>' + (action || '') + '</div>';
  }
  var toastTimer = null;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2600); }

  /* ---------- Routing ---------- */

  function parseHash() {
    var h = (location.hash || '#dashboard').slice(1), qi = h.indexOf('?'), path = qi < 0 ? h : h.slice(0, qi), q = {};
    if (qi >= 0) new URLSearchParams(h.slice(qi + 1)).forEach(function (v, k) { q[k] = v; });
    var parts = path.split('/');
    return { name: parts[0] || 'dashboard', id: parts[1] ? decodeURIComponent(parts[1]) : null, q: q };
  }
  function go(hash) { location.hash = hash; }
  function hashFor(name, q) { var qs = new URLSearchParams(); Object.keys(q || {}).forEach(function (k) { if (q[k]) qs.set(k, q[k]); }); var s = qs.toString(); return '#' + name + (s ? '?' + s : ''); }
  function signedIn() { try { return sessionStorage.getItem(SESSION) === '1'; } catch (e) { return state.sessionMem === true; } }

  function render() {
    state.route = parseHash();
    var r = state.route;
    if (!signedIn()) { $('#signin').hidden = false; $('#app').hidden = true; closePanel(); return; }
    $('#signin').hidden = true; $('#app').hidden = false;
    $$('#side-nav a, #tabbar a').forEach(function (a) { if (a.dataset.route === r.name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var view = $('#view');
    if (!state.catalog && !state.seed && !state.errors.products && !state.errors.orders) return; // still loading
    view.setAttribute('aria-busy', 'false');
    var html = r.name === 'orders' ? viewOrders(r) : r.name === 'products' ? viewProducts(r) : r.name === 'catalog' ? viewCatalog() : r.name === 'settings' ? viewSettings() : viewDashboard();
    view.innerHTML = html;
    demoNote();
    var badge = $('#nav-new'), n = orders().filter(function (o) { return o.status === 'new'; }).length;
    badge.hidden = !n; badge.textContent = n; badge.setAttribute('aria-label', n + ' new orders');
    if (r.name === 'orders' && r.id) openOrder(r.id);
    else if (r.name === 'products' && r.id) openProduct(r.id);
    else closePanel();
    if (r.name !== state.lastName) { state.lastName = r.name; var h1 = view.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); } window.scrollTo(0, 0); }
  }
  function demoNote() {
    var n = state.seed ? state.seed.orders.length : 0, days = Math.round(state.shift / DAY);
    var el = $('#demo-text');
    el.textContent = state.seed ? n + ' sample orders' + (days ? ', dates shifted ' + days + 'd to end today' : '') + '; prices and stock are placeholders.' + (storageOk ? '' : ' Storage is off: edits last until the tab closes.') : 'Prototype catalog; orders are missing.';
    el.title = state.seed ? 'content/orders.json holds ' + n + ' sample orders authored for the prototype' + (days ? '; every date is shifted by ' + days + ' days so the newest order lands today' : '') + '. Prices, stock and ratings are placeholders from content/products.json.' : '';
  }

  /* ---------- Dashboard ---------- */

  function viewDashboard() {
    if (state.errors.orders) return '<div class="view__head"><div><h1>Dashboard</h1></div></div>' + errorBox('orders') + (state.errors.products ? errorBox('products') : '');
    var all = orders(), now = Date.now(), today0 = startOfDay(now), week0 = today0 - 6 * DAY, month0 = today0 - 29 * DAY;
    var today = all.filter(function (o) { return o.at >= today0; }), week = all.filter(function (o) { return o.at >= week0; });
    var month = all.filter(function (o) { return o.at >= month0 && o.status !== 'cancelled'; });
    var revenue = month.reduce(function (a, o) { return a + o.total; }, 0);
    var cod = all.filter(codOpen), codSum = cod.reduce(function (a, o) { return a + o.total; }, 0);
    var prods = products(), low = prods.filter(function (p) { return p.stock === 'low_stock'; }).length, out = prods.filter(function (p) { return p.stock === 'out_of_stock'; }).length;
    var newN = all.filter(function (o) { return o.status === 'new'; }).length;
    function stat(label, big, small, href, warn, mini) {
      return '<a class="stat" href="' + href + '"><span class="stat__label">' + (mini || (warn ? '<i aria-hidden="true"></i>' : '')) + esc(label) + '</span><b>' + big + '</b><small>' + esc(small) + '</small><span class="stat__go">See list ' + icon('i-arrow') + '</span></a>';
    }
    var tiles = stat('Orders today', today.length, newN ? newN + ' new to pack' : 'nothing waiting', hashFor('orders', { when: 'today' }), newN > 0) +
      stat('This week', week.length, money(week.filter(function (o) { return o.status !== 'cancelled'; }).reduce(function (a, o) { return a + o.total; }, 0)) + ' in 7 days', hashFor('orders', { when: 'week' })) +
      stat('Revenue, 30 days', money(revenue), month.length + ' orders, cancelled excluded', hashFor('orders', { when: 'month' })) +
      stat('Cash to collect', money(codSum), cod.length + ' cash-on-delivery order' + (cod.length === 1 ? '' : 's') + ' open', hashFor('orders', { cod: 'open' }), cod.length > 0) +
      stat('Low stock', low, low ? 'running low' : 'none running low', hashFor('products', { stock: 'low_stock' }), low > 0, stockMini('low_stock', 'stat__mini')) +
      stat('Out of stock', out, out ? 'listed, not buyable' : 'everything buyable', hashFor('products', { stock: 'out_of_stock' }), out > 0, stockMini('out_of_stock', 'stat__mini'));
    var latest = all.slice(0, 5);
    return '<div class="view__head"><div><h1>Dashboard</h1><p>' + esc(DAYS[new Date().getDay()] + ' ' + new Date().getDate() + ' ' + MONTHS[new Date().getMonth()]) + '. Figures come from content/orders.json and the catalog.</p></div></div>' +
      (state.errors.products ? errorBox('products') : '') +
      '<div class="stats">' + tiles + '</div>' +
      '<div class="grid2"><div class="card spark"><div class="card__head"><h2>Orders per day, last 30 days</h2><p>' + all.filter(function (o) { return o.at >= month0; }).length + ' orders</p></div>' + sparkline(all, today0) + '</div>' +
      '<div class="card card--latest"><div class="card__head"><h2>Latest orders</h2><a href="#orders">All orders</a></div>' + ordersTable(latest, false) + '</div></div>';
  }
  function sparkline(all, today0) {
    var days = [], max = 0;
    for (var i = 29; i >= 0; i--) { var d0 = today0 - i * DAY, n = all.filter(function (o) { return o.at >= d0 && o.at < d0 + DAY; }).length; days.push({ t: d0, n: n }); if (n > max) max = n; }
    var W = 600, H = 120, px = 8, py = 12, step = (W - 2 * px) / 29, scale = max ? (H - 2 * py) / max : 0;
    var pts = days.map(function (d, i) { return [px + i * step, H - py - d.n * scale]; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var area = line + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (H - py) + ' L' + px + ' ' + (H - py) + ' Z';
    var last = pts[pts.length - 1], peak = days.reduce(function (a, d) { return d.n > a.n ? d : a; }, days[0]);
    var ticks = '<div class="spark__ticks" aria-hidden="true">' + [0, 7, 14, 21, 29].map(function (i) { return '<span style="left:' + (i / 29 * 100).toFixed(1) + '%">' + esc(fmtDay(days[i].t)) + '</span>'; }).join('') + '</div>';
    var dots = days.map(function (d, i) { return d.n ? '<circle cx="' + pts[i][0].toFixed(1) + '" cy="' + pts[i][1].toFixed(1) + '" r="2.5" fill="#17b867"><title>' + esc(fmtDay(d.t)) + ': ' + d.n + ' order' + (d.n === 1 ? '' : 's') + '</title></circle>' : ''; }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Orders per day over the last 30 days, peak ' + peak.n + ' on ' + esc(fmtDay(peak.t)) + '">' +
      '<path d="' + area + '" fill="#dcf5e7"/><path d="' + line + '" fill="none" stroke="#17b867" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' + dots +
      '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="4" fill="#0b0d10"/></svg>' + ticks +
      '<div class="spark__meta"><span>Peak ' + peak.n + ' on ' + esc(fmtDay(peak.t)) + '</span><span>Today ' + days[29].n + '</span></div>';
  }

  /* ---------- Orders ---------- */

  function filterOrders(q) {
    var list = orders(), now = Date.now(), today0 = startOfDay(now);
    if (q.status && STATUSES.indexOf(q.status) >= 0) list = list.filter(function (o) { return o.status === q.status; });
    if (q.when === 'today') list = list.filter(function (o) { return o.at >= today0; });
    if (q.when === 'week') list = list.filter(function (o) { return o.at >= today0 - 6 * DAY; });
    if (q.when === 'month') list = list.filter(function (o) { return o.at >= today0 - 29 * DAY && o.status !== 'cancelled'; });
    if (q.cod === 'open') list = list.filter(codOpen);
    var s = (q.q || '').trim().toLowerCase();
    if (s) list = list.filter(function (o) { return o.id.toLowerCase().indexOf(s) >= 0 || o.customer.name.toLowerCase().indexOf(s) >= 0 || o.customer.phone.replace(/\s/g, '').indexOf(s.replace(/\s/g, '')) >= 0 || o.customer.city.toLowerCase().indexOf(s) >= 0; });
    return list;
  }
  function ordersTable(list, full) {
    if (!list.length) return emptyBox('No orders match.', 'Clear the filter or the search to see the rest.', '<a class="btn btn--ghost" href="#orders">Show all orders</a>');
    return '<div class="tblwrap"><table class="tbl"><thead><tr><th scope="col">Order</th><th scope="col">Placed</th><th scope="col">Customer</th>' + (full ? '<th scope="col">Payment</th><th scope="col" class="num">Items</th>' : '') + '<th scope="col" class="num">Total</th><th scope="col">Status</th></tr></thead><tbody>' +
      list.map(function (o) {
        var items = o.lines.reduce(function (a, l) { return a + l.qty; }, 0);
        return '<tr data-open="' + esc(o.id) + '"><td class="lead" data-h="Order"><a class="oid" href="#orders/' + encodeURIComponent(o.id) + '">' + esc(o.id) + '</a><span class="lead__x" aria-hidden="true">' + statusHtml(o) + '<b>' + money(o.total) + '</b></span></td>' +
          '<td data-h="Placed">' + esc(fmtDate(o.at)) + '<span class="sub">' + esc(rel(o.at)) + '</span></td>' +
          '<td data-h="Customer">' + esc(o.customer.name) + '<span class="sub">' + esc([o.customer.city, o.customer.area].filter(Boolean).join(', ')) + (o.seed ? '' : ' · storefront') + '</span></td>' +
          (full ? '<td data-h="Payment"><span class="pay' + (codOpen(o) ? ' pay--open' : '') + '">' + esc(payLabel(o)) + '</span></td><td class="num" data-h="Items">' + items + '</td>' : '') +
          '<td class="num ph-hide" data-h="Total"><b>' + money(o.total) + '</b></td>' +
          '<td class="ph-hide" data-h="Status">' + statusHtml(o) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function viewOrders(r) {
    if (state.errors.orders) return '<div class="view__head"><div><h1>Orders</h1></div></div>' + errorBox('orders');
    var q = r.q, all = orders(), list = filterOrders(q);
    var counts = {}; STATUSES.forEach(function (s) { counts[s] = all.filter(function (o) { return o.status === s; }).length; });
    var scope = q.when === 'today' ? 'Today' : q.when === 'week' ? 'This week' : q.when === 'month' ? 'Last 30 days' : q.cod === 'open' ? 'Cash to collect' : '';
    var chips = '<div class="chipset" role="group" aria-label="Status">' +
      chip('All', all.length, !q.status, 'data-status=""') + STATUSES.map(function (s) { return chip(LABEL[s], counts[s], q.status === s, 'data-status="' + s + '"'); }).join('') + '</div>';
    var applied = scope ? '<span class="applied__end"><button type="button" class="applied__chip" data-clear-scope aria-label="Remove ' + esc(scope) + '">' + esc(scope) + icon('i-x') + '</button></span>' : '';
    return '<div class="view__head"><div><h1>Orders</h1><p><span class="mini count__mini" aria-hidden="true"><i style="--pct:' + (all.length ? list.length / all.length : 0) + '"></i></span>' + list.length + ' of ' + all.length + (scope ? ', ' + scope.toLowerCase() : '') + '. A row opens the order.</p></div></div>' +
      '<div class="tools">' + chips + applied + '<label class="search"><span class="vh">Search orders</span>' + icon('i-search') + '<input type="search" id="order-search" placeholder="Order number, name or phone" value="' + esc(q.q || '') + '" autocomplete="off"></label></div>' +
      ordersTable(list, true);
  }

  function openOrder(id) {
    var o = orderById(id);
    if (!o) { closePanel(); toast('Order ' + id + ' is not in the data.'); return; }
    var steps = ['new', 'packed', 'shipped', 'delivered'], cur = steps.indexOf(o.status);
    var stepper = o.status === 'cancelled' ? '' : '<div class="stepper" aria-label="Progress">' + steps.map(function (s, i) {
      return '<div class="step' + (i < cur ? ' is-done' : i === cur ? ' is-now' : '') + '"><i></i>' + LABEL[s] + (i === cur ? '<span class="vh"> (current)</span>' : '') + '</div>';
    }).join('') + '</div>';
    var actions = '';
    if (NEXT[o.status]) actions += '<button type="button" class="btn" data-advance="' + esc(o.id) + '">Mark ' + LABEL[NEXT[o.status]].toLowerCase() + '</button>';
    if (isOpen(o)) actions += '<button type="button" class="btn btn--ghost" data-cancel-start="' + esc(o.id) + '">Cancel order</button>';
    var cancelForm = '<form class="cancel" id="cancel-form" hidden><label for="cancel-reason">Why is it cancelled?</label><div class="select"><select id="cancel-reason" required><option value="">Choose a reason</option>' +
      CANCEL_REASONS.map(function (r) { return '<option>' + esc(r) + '</option>'; }).join('') + '</select>' + icon('i-chevron') + '</div><div class="actions"><button type="submit" class="btn" data-cancel-confirm="' + esc(o.id) + '">Confirm cancellation</button><button type="button" class="btn btn--ghost" data-cancel-stop>Keep the order</button></div></form>';
    var lines = '<table class="lines"><tbody>' + o.lines.map(function (l) {
      return '<tr><td>' + esc(l.name) + (l.variant ? '<small>' + esc(l.variant) + '</small>' : '') + '</td><td class="num">' + l.qty + ' × ' + money(l.price) + '</td><td class="num"><b>' + money(l.qty * l.price) + '</b></td></tr>';
    }).join('') + '</tbody></table><div class="totals"><span>Total</span><b>' + money(o.total) + '</b></div><p class="od__meta">' + (o.seed ? 'Lines and total come from content/orders.json; no delivery fee, tax or discount is recorded.': 'Placed on the storefront in this browser.') + '</p>';
    var html = '<div class="od">' +
      '<div class="od__top"><div>' + statusHtml(o) + '<div class="od__meta">Placed ' + esc(fmtDate(o.at)) + ', ' + esc(rel(o.at)) + '</div></div><span class="batt' + (o.status === 'cancelled' ? ' batt--off' : '') + '" aria-hidden="true"><i id="batt-fill" style="--pct:' + PCT[o.status] + '"></i></span></div>' +
      stepper + (o.status === 'cancelled' ? '<div class="reason"><b>Cancelled.</b> ' + esc(o.cancel_reason || 'No reason recorded') + '</div>' : '') +
      (actions ? '<div class="actions">' + actions + '</div>' : '') + cancelForm +
      '<dl class="kv"><dt>Customer</dt><dd>' + esc(o.customer.name) + '</dd><dt>Phone</dt><dd>' + esc(o.customer.phone) + '</dd><dt>Address</dt><dd>' + esc([o.customer.address, o.customer.area, o.customer.city].filter(Boolean).join(', ')) + '</dd><dt>Payment</dt><dd' + (codOpen(o) ? ' class="pay--open"' : '') + '>' + esc(payLabel(o)) + (codOpen(o) ? ', ' + money(o.total) : '') + '</dd></dl>' +
      '<div><h3 class="vh">Lines</h3>' + lines + '</div>' +
      '<div><h3>History</h3><ul class="history">' + o.hist.map(function (h) { return '<li><b>' + LABEL[h.status] + '</b><span>' + esc(fmtDate(h.at)) + '</span></li>'; }).join('') + '</ul></div>' +
      '</div>';
    showPanel('Order ' + o.id, html);
  }
  function patchOrder(o, status, reason) {
    var p = state.overlay.orders[o.id] || {};
    var hist = (p.history || (o.seed ? o.hist.map(function (h) { return { status: h.status, at: new Date(h.at).toISOString(), shifted: true }; }) : o.hist.map(function (h) { return { status: h.status, at: new Date(h.at).toISOString() }; })));
    hist = hist.concat([{ status: status, at: new Date().toISOString(), shifted: true }]);
    state.overlay.orders[o.id] = { status: status, history: hist, cancel_reason: status === 'cancelled' ? reason : null };
    save();
  }
  function advance(id) {
    var o = orderById(id), next = o && NEXT[o.status];
    if (!next) return;
    patchOrder(o, next, null);
    var fill = $('#batt-fill'); if (fill) fill.style.setProperty('--pct', PCT[next]); // the battery charges before the panel re-renders
    toast('Order ' + o.id + ' marked ' + LABEL[next].toLowerCase() + (next === 'delivered' && o.payment === 'cod' ? ', cash collected' : ''));
    setTimeout(function () { render(); }, 420);
  }

  /* ---------- Products ---------- */

  function viewProducts(r) {
    if (state.errors.products) return '<div class="view__head"><div><h1>Products</h1></div></div>' + errorBox('products');
    var q = r.q, all = products(), list = all;
    if (q.stock && STOCK[q.stock]) list = list.filter(function (p) { return p.stock === q.stock; });
    if (q.cat) list = list.filter(function (p) { return p.category === q.cat; });
    var s = (q.q || '').trim().toLowerCase();
    if (s) list = list.filter(function (p) { return (p.name + ' ' + (p.brand || '') + ' ' + p.id + ' ' + categoryName(p.category)).toLowerCase().indexOf(s) >= 0; });
    var counts = {}; Object.keys(STOCK).forEach(function (k) { counts[k] = all.filter(function (p) { return p.stock === k; }).length; });
    var selN = Object.keys(state.selected).length;
    var chips = '<div class="chipset" role="group" aria-label="Stock">' + chip('All', all.length, !q.stock, 'data-stock=""') + Object.keys(STOCK).map(function (k) { return chip(STOCK[k][0], counts[k], q.stock === k, 'data-stock="' + k + '"'); }).join('') + '</div>';
    var catSel = '<label class="select"><span class="vh">Category</span><select id="cat-filter"><option value="">Every category</option>' + categories().map(function (c) { return '<option value="' + esc(c.slug) + '"' + (q.cat === c.slug ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select>' + icon('i-chevron') + '</label>';
    var bulk = selN ? '<div class="bulk" role="region" aria-label="Selection"><span>' + selN + ' selected</span><button type="button" class="btn" data-bulk-out>Mark out of stock</button><button type="button" class="btn btn--ghost" data-bulk-clear>Clear</button></div>' : '';
    var rows = list.length ? '<div class="tblwrap"><table class="tbl"><thead><tr><th scope="col" class="sel"><input type="checkbox" id="sel-all" aria-label="Select all shown"' + (list.length && list.every(function (p) { return state.selected[p.id]; }) ? ' checked' : '') + '></th><th scope="col">Product</th><th scope="col">Category</th><th scope="col" class="num">Price</th><th scope="col" class="num">Compare-at</th><th scope="col">Stock</th></tr></thead><tbody>' +
      list.map(function (p) {
        var st = STOCK[p.stock] || STOCK.in_stock;
        return '<tr class="has-sel"><td class="sel" data-h=""><input type="checkbox" data-sel="' + esc(p.id) + '" aria-label="Select ' + esc(p.name) + '"' + (state.selected[p.id] ? ' checked' : '') + '></td>' +
          '<td class="lead" data-h="Product"><a href="#products/' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a><span class="sub">' + esc(p.brand || 'Ampline') + ' · ' + esc(p.id) + '</span></td>' +
          '<td data-h="Category">' + esc(categoryName(p.category)) + '</td>' +
          '<td class="num" data-h="Price"><label><span class="vh">Price of ' + esc(p.name) + '</span><input class="cell-input" type="number" min="0" step="0.01" inputmode="decimal" value="' + Number(p.price).toFixed(2) + '" data-price="' + esc(p.id) + '"></label></td>' +
          '<td class="num mute" data-h="Compare-at">' + (p.compare_at ? money(p.compare_at) : '—') + '</td>' +
          '<td data-h="Stock"><span class="stockcell">' + stockMini(p.stock) + '<span class="cell-select cell-select--' + st[2] + '"><select data-stock-of="' + esc(p.id) + '" aria-label="Stock of ' + esc(p.name) + '">' + Object.keys(STOCK).map(function (k) { return '<option value="' + k + '"' + (p.stock === k ? ' selected' : '') + '>' + STOCK[k][0] + '</option>'; }).join('') + '</select>' + icon('i-chevron') + '</span></span></td></tr>';
      }).join('') + '</tbody></table></div>'
      : emptyBox('No products match.', 'Clear the filter or the search.', '<a class="btn btn--ghost" href="#products">Show all products</a>');
    return '<div class="view__head"><div><h1>Products</h1><p><span class="mini count__mini" aria-hidden="true"><i style="--pct:' + (all.length ? list.length / all.length : 0) + '"></i></span>' + list.length + ' of ' + all.length + '. Price and stock save as you change them; the name opens the full form.</p></div><a class="btn" href="#products/new">' + icon('i-plus') + 'Add product</a></div>' +
      '<div class="tools">' + chips + catSel + '<label class="search"><span class="vh">Search products</span>' + icon('i-search') + '<input type="search" id="product-search" placeholder="Name, brand or SKU" value="' + esc(q.q || '') + '" autocomplete="off"></label></div>' + bulk + rows;
  }
  function patchProduct(id, patch) {
    var added = state.overlay.added.find(function (p) { return p.id === id; });
    if (added) Object.assign(added, patch); else state.overlay.products[id] = Object.assign({}, state.overlay.products[id] || {}, patch);
    save();
  }

  function openProduct(id) {
    var isNew = id === 'new', p = isNew ? { id: '', name: '', category: '', price: '', compare_at: null, badges: [], stock: 'in_stock', specs: [], compat: [], variants: {} } : productById(id);
    if (!p) { closePanel(); toast('Product ' + id + ' is not in the catalog.'); return; }
    var devs = devices(), inCompat = {}; (p.compat || []).forEach(function (c) { inCompat[c] = true; });
    // The 12 original SKUs list fit as prose ("iPhone 15 and later"); a device whose aliases carry that prose is ticked too.
    devs.forEach(function (d) { if ((d.aliases || []).some(function (al) { return inCompat[al]; })) inCompat[d.id] = true; });
    var devIds = {}; devs.forEach(function (d) { devIds[d.id] = true; });
    var prose = (p.compat || []).filter(function (c) { return !devIds[c]; });
    var v = p.variants || {};
    var specRows = (p.specs || []).map(function (s) { return specRow(s.label, s.value); }).join('');
    var compat = FAMILIES.map(function (f) {
      var list = devs.filter(function (d) { return d.family === f[0]; });
      if (!list.length) return '';
      return '<div class="compat__fam">' + esc(f[1]) + '</div><div class="compat__grid">' + list.map(function (d) { return '<label class="opt"><input type="checkbox" name="compat" value="' + esc(d.id) + '"' + (inCompat[d.id] ? ' checked' : '') + '><span>' + esc(d.name) + '</span></label>'; }).join('') + '</div>';
    }).join('');
    var html = '<form class="form" id="product-form" data-id="' + esc(p.id) + '" novalidate>' +
      '<label class="field">Name<input class="input" name="name" required maxlength="120" value="' + esc(p.name) + '"></label>' +
      '<div class="fieldrow"><label class="field">Category<span class="select"><select name="category" required><option value="">Choose</option>' + categories().map(function (c) { return '<option value="' + esc(c.slug) + '"' + (p.category === c.slug ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select>' + icon('i-chevron') + '</span></label>' +
      '<label class="field">Stock<span class="select"><select name="stock">' + Object.keys(STOCK).map(function (k) { return '<option value="' + k + '"' + (p.stock === k ? ' selected' : '') + '>' + STOCK[k][0] + '</option>'; }).join('') + '</select>' + icon('i-chevron') + '</span></label></div>' +
      '<div class="fieldrow"><label class="field">Price, USD<input class="input" name="price" type="number" min="0" step="0.01" inputmode="decimal" required value="' + (p.price === '' ? '' : Number(p.price).toFixed(2)) + '"></label>' +
      '<label class="field">Compare-at price<span class="field__hint">Leave empty for no deal</span><input class="input" name="compare_at" type="number" min="0" step="0.01" inputmode="decimal" value="' + (p.compare_at ? Number(p.compare_at).toFixed(2) : '') + '"></label></div>' +
      '<label class="field">Badges<span class="field__hint">Comma separated, as the tile shows them</span><input class="input" name="badges" value="' + esc((p.badges || []).join(', ')) + '"></label>' +
      '<div class="field"><span>Specs<span class="field__hint">Label and value rows, in the order the product page lists them</span></span><div class="rows" id="spec-rows">' + specRows + '</div><button type="button" class="btn btn--ghost btn--small rows__add" data-add-spec>' + icon('i-plus') + 'Add spec</button></div>' +
      '<div class="field"><span>Fits<span class="field__hint">Devices the storefront picker lists; tick every one this product fits</span></span><div class="compat">' + compat + '</div>' +
      (prose.length ? '<span class="field__hint">Also listed as text in the catalog:</span><div class="tags">' + prose.map(function (c) { return '<button type="button" class="applied__chip" data-prose="' + esc(c) + '" aria-pressed="true" aria-label="Remove ' + esc(c) + '">' + esc(c) + icon('i-x') + '</button>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="field"><span>Variants<span class="field__hint">Comma separated options; one option is a fact, not a choice. Every option shares the one price.</span></span><div class="fieldrow"><label class="field">Colour<input class="input" name="v_color" value="' + esc((v.color || []).join(', ')) + '"></label><label class="field">Storage<input class="input" name="v_storage" value="' + esc((v.storage || []).join(', ')) + '"></label></div><label class="field">Pack<input class="input" name="v_pack" value="' + esc((v.pack || []).join(', ')) + '"></label></div>' +
      (isNew ? '<p class="field__hint">A new product gets an id and a drawn figure for its category. It has no page of its own until the pages are regenerated, no photo and no ratings.</p>' : '<p class="field__hint">SKU ' + esc(p.id) + '. Edits apply to the storefront in this browser.</p>') +
      '<div class="form__foot"><button type="button" class="btn btn--ghost" data-panel-close>Cancel</button><button type="submit" class="btn">' + (isNew ? 'Add product' : 'Save product') + '</button></div></form>';
    showPanel(isNew ? 'New product' : esc(p.name), html);
  }
  function specRow(label, value) { return '<div class="rows__r"><input class="input" name="spec_label" placeholder="Label" value="' + esc(label || '') + '" aria-label="Spec label"><input class="input" name="spec_value" placeholder="Value" value="' + esc(value || '') + '" aria-label="Spec value"><button type="button" class="iconbtn" data-remove-row aria-label="Remove spec">' + icon('i-x') + '</button></div>'; }
  function readProductForm(form) {
    var f = new FormData(form), list = function (s) { return String(s || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean); };
    var labels = f.getAll('spec_label'), values = f.getAll('spec_value'), specs = [];
    labels.forEach(function (l, i) { if (String(l).trim() && String(values[i] || '').trim()) specs.push({ label: String(l).trim(), value: String(values[i]).trim() }); });
    var variants = {}; [['v_color', 'color'], ['v_storage', 'storage'], ['v_pack', 'pack']].forEach(function (k) { var arr = list(f.get(k[0])); if (arr.length) variants[k[1]] = arr; });
    var compat = f.getAll('compat').map(String).concat($$('[data-prose][aria-pressed="true"]', form).map(function (b) { return b.dataset.prose; }));
    var price = parseFloat(f.get('price')), cmp = parseFloat(f.get('compare_at'));
    return { name: String(f.get('name') || '').trim(), category: String(f.get('category') || ''), price: isNaN(price) ? NaN : Math.round(price * 100) / 100, compare_at: isNaN(cmp) || !cmp ? null : Math.round(cmp * 100) / 100, badges: list(f.get('badges')), stock: String(f.get('stock')), specs: specs, compat: compat, variants: variants };
  }
  function saveProductForm(form) {
    var id = form.dataset.id, v = readProductForm(form), errs = [];
    if (!v.name) errs.push('a name'); if (!v.category) errs.push('a category'); if (isNaN(v.price) || v.price < 0) errs.push('a price');
    if (errs.length) { toast('The product needs ' + errs.join(', ') + '.'); form.querySelector(!v.name ? '[name=name]' : !v.category ? '[name=category]' : '[name=price]').focus(); return; }
    if (v.compare_at !== null && v.compare_at <= v.price) { toast('A compare-at price must be above the price.'); form.querySelector('[name=compare_at]').focus(); return; }
    if (id) { patchProduct(id, v); toast('Saved ' + v.name); go('#products'); }
    else {
      var nid = 'NEW-' + Date.now().toString(36).toUpperCase().slice(-6);
      state.overlay.added.push(Object.assign({ id: nid, slug: slugify(v.name) + '-' + nid.toLowerCase(), short: '', in_box: [], rating: { value: 0, count: 0 }, images: [] }, v));
      save(); toast('Added ' + v.name); go('#products');
    }
  }

  /* ---------- Categories and devices ---------- */

  function viewCatalog() {
    if (state.errors.products) return '<div class="view__head"><div><h1>Categories &amp; devices</h1></div></div>' + errorBox('products');
    var prods = products(), cats = categories(), devs = devices();
    var catRows = cats.map(function (c) {
      var n = prods.filter(function (p) { return p.category === c.slug; }).length;
      return '<div class="list__r" data-row><input class="input" value="' + esc(c.name) + '" data-rename-cat="' + esc(c.slug) + '" aria-label="Category name"><button type="button" class="btn" data-save-cat="' + esc(c.slug) + '">Save</button><small>' + esc(c.group) + ' · ' + n + ' product' + (n === 1 ? '' : 's') + ' · ' + esc(c.slug) + '</small></div>';
    }).join('');
    var devRows = FAMILIES.map(function (f) {
      var list = devs.filter(function (d) { return d.family === f[0]; });
      if (!list.length) return '';
      return '<div class="list__fam">' + esc(f[1]) + '</div>' + list.map(function (d) {
        return '<div class="list__r' + (d.parent ? ' list__r--model' : '') + '" data-row><input class="input" value="' + esc(d.name) + '" data-rename-dev="' + esc(d.id) + '" aria-label="Device name"><button type="button" class="btn" data-save-dev="' + esc(d.id) + '">Save</button><small>' + esc(d.id) + (d.parent ? ', model in ' + esc(d.parent) : '') + (d.max_charge_w ? ' · ' + d.max_charge_w + ' W ceiling, indicative' : '') + '</small></div>';
      }).join('');
    }).join('');
    return '<div class="view__head"><div><h1>Categories &amp; devices</h1><p>The lists the storefront navigation and the "What do you own?" picker read. Rename in place; Save appears when a name changed.</p></div></div>' +
      '<div class="grid2 grid2--even"><div class="card"><div class="card__head"><h2>Categories</h2><p>' + cats.length + '</p></div><div class="list">' + catRows + '</div>' +
      '<form class="addrow" id="add-cat"><h3>Add a category</h3><label class="field">Name<input class="input" name="name" required maxlength="60"></label><label class="field">Group<span class="select"><select name="group">' + GROUPS.map(function (g) { return '<option>' + g + '</option>'; }).join('') + '</select>' + icon('i-chevron') + '</span></label><label class="field">One-line blurb<input class="input" name="blurb" maxlength="120"></label><button type="submit" class="btn">' + icon('i-plus') + 'Add category</button><p class="field__hint">A new category filters by brand and price until facets are named in the catalog; its page exists once the pages are regenerated.</p></form></div>' +
      '<div class="card"><div class="card__head"><h2>Devices</h2><p>' + devs.length + '</p></div><div class="list">' + devRows + '</div>' +
      '<form class="addrow" id="add-dev"><h3>Add a device</h3><label class="field">Name<input class="input" name="name" required maxlength="60" placeholder="e.g. Samsung Galaxy S26"></label><div class="fieldrow"><label class="field">Family<span class="select"><select name="family">' + FAMILIES.map(function (f) { return '<option value="' + f[0] + '">' + esc(f[1]) + '</option>'; }).join('') + '</select>' + icon('i-chevron') + '</span></label><label class="field">Charge ceiling, W<span class="field__hint">Optional, from the maker</span><input class="input" name="max_charge_w" type="number" min="1" max="300" inputmode="numeric"></label></div><button type="submit" class="btn">' + icon('i-plus') + 'Add device</button><p class="field__hint">A new device appears in the picker; it fits nothing until products list it under Fits.</p></form></div></div>';
  }

  /* ---------- Settings ---------- */

  function settings() { var s = state.overlay.settings || {}; return { store_name: s.store_name || 'Ampline', trust: s.trust && s.trust.length === 3 ? s.trust : TRUST_DEFAULT.slice() }; }
  function viewSettings() {
    var s = settings();
    return '<div class="view__head"><div><h1>Settings</h1><p>Store facts the pages show. Saved in this browser; applied to the storefront at launch.</p></div></div>' +
      '<div class="grid2 grid2--even"><form class="card form" id="settings-form"><label class="field">Store name<span class="field__hint">"Ampline" is a placeholder working name</span><input class="input" name="store_name" required maxlength="40" value="' + esc(s.store_name) + '"></label>' +
      '<label class="field">Currency<input class="input" value="USD, prices are placeholders" readonly aria-readonly="true"></label>' +
      '<div class="field"><span>Trust lines<span class="field__hint">The three promises on the home page, product pages and the cart. Pitch assumptions until the client confirms them.</span></span><div class="rows">' + s.trust.map(function (t, i) { return '<input class="input" name="trust" value="' + esc(t) + '" maxlength="60" aria-label="Trust line ' + (i + 1) + '">'; }).join('') + '</div></div>' +
      '<div class="toggle"><span>Arabic edition<small>Right-to-left pages, planned; timing undecided</small></span><span class="ph">planned</span><button type="button" class="switch" role="switch" aria-checked="false" disabled aria-label="Arabic edition, planned"></button></div>' +
      '<div class="form__foot"><button type="submit" class="btn">Save settings</button></div></form>' +
      '<div class="card"><div class="card__head"><h2>Demo</h2></div><p class="field__hint" style="margin-bottom:12px">Everything you change here stays in this browser’s storage. Reset returns to the two files as shipped.</p><div class="actions"><a class="btn btn--ghost" href="../index.html">' + icon('i-store') + 'Open the storefront</a><button type="button" class="btn btn--ghost" data-reset>' + icon('i-reset') + '<span>Reset demo data</span></button><button type="button" class="btn btn--ghost" data-signout>' + icon('i-out') + 'Sign out</button></div></div></div>';
  }

  /* ---------- Panel ---------- */

  function showPanel(title, html) {
    var p = $('#panel');
    $('#panel-title').innerHTML = title; $('#panel-body').innerHTML = html;
    if (!p.open) { state.lastFocus = document.activeElement; p.showModal(); }
    $('#panel-body').scrollTop = 0;
    var first = $('#panel-body').querySelector('input, select, button:not([data-panel-close])'); if (first && window.matchMedia('(min-width: 720px)').matches) first.focus({ preventScroll: true });
  }
  function closePanel() { var p = $('#panel'); if (p.open) p.close(); }
  $('#panel').addEventListener('close', function () {
    var r = parseHash();
    if (r.id) history.replaceState(null, '', hashFor(r.name, r.q)); // closing the panel leaves the list route behind it
    state.route = parseHash();
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus({ preventScroll: true });
  });
  $('#panel').addEventListener('click', function (e) { if (e.target === e.currentTarget) closePanel(); });
  $('#panel-close').addEventListener('click', closePanel);

  /* ---------- Reset and session ---------- */

  var armed = null;
  function resetDemo(btn) {
    if (armed !== btn) { armed = btn; btn.classList.add('is-armed'); btn.querySelector('span').textContent = 'Confirm reset'; clearTimeout(resetDemo.t); resetDemo.t = setTimeout(function () { disarm(); }, 4000); return; }
    disarm(); state.overlay = blank(); state.selected = {};
    try { localStorage.removeItem(KEY); } catch (e) { /* storage off */ }
    toast('Demo data reset to the files.'); render();
  }
  function disarm() { if (armed) { armed.classList.remove('is-armed'); armed.querySelector('span').textContent = 'Reset demo data'; armed = null; } }
  function signIn() { try { sessionStorage.setItem(SESSION, '1'); } catch (e) { state.sessionMem = true; } if (!location.hash || location.hash === '#signin') location.hash = '#dashboard'; else render(); }
  function signOut() { try { sessionStorage.removeItem(SESSION); } catch (e) { state.sessionMem = false; } closePanel(); render(); }

  /* ---------- Events ---------- */

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a, tr[data-open]');
    if (!t) return;
    if (t.id === 'enter-demo') return signIn();
    if (t.id === 'sign-out' || t.hasAttribute('data-signout')) return signOut();
    if (t.id === 'reset-demo' || t.hasAttribute('data-reset')) return resetDemo(t);
    if (t.hasAttribute('data-panel-close')) return closePanel();
    if (t.hasAttribute('data-status')) return go(hashFor('orders', Object.assign({}, state.route.q, { status: t.dataset.status })));
    if (t.hasAttribute('data-clear-scope')) return go(hashFor('orders', { status: state.route.q.status, q: state.route.q.q }));
    if (t.hasAttribute('data-stock')) return go(hashFor('products', Object.assign({}, state.route.q, { stock: t.dataset.stock })));
    if (t.hasAttribute('data-advance')) return advance(t.dataset.advance);
    if (t.hasAttribute('data-cancel-start')) { var f = $('#cancel-form'); f.hidden = false; $('#cancel-reason').focus(); return; }
    if (t.hasAttribute('data-cancel-stop')) { $('#cancel-form').hidden = true; return; }
    if (t.hasAttribute('data-bulk-out')) { Object.keys(state.selected).forEach(function (id) { patchProduct(id, { stock: 'out_of_stock' }); }); toast(Object.keys(state.selected).length + ' marked out of stock'); state.selected = {}; return render(); }
    if (t.hasAttribute('data-bulk-clear')) { state.selected = {}; return render(); }
    if (t.hasAttribute('data-add-spec')) { $('#spec-rows').insertAdjacentHTML('beforeend', specRow('', '')); $('#spec-rows .rows__r:last-child input').focus(); return; }
    if (t.hasAttribute('data-remove-row')) { t.closest('.rows__r').remove(); return; }
    if (t.hasAttribute('data-prose')) { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); t.style.opacity = t.getAttribute('aria-pressed') === 'true' ? '' : '0.45'; return; }
    if (t.hasAttribute('data-save-cat')) { var ci = $('[data-rename-cat="' + t.dataset.saveCat + '"]'), name = ci.value.trim(); if (!name) return toast('A category needs a name.'); renameCat(t.dataset.saveCat, name); toast('Renamed to ' + name); return render(); }
    if (t.hasAttribute('data-save-dev')) { var di = $('[data-rename-dev="' + t.dataset.saveDev + '"]'), dn = di.value.trim(); if (!dn) return toast('A device needs a name.'); renameDev(t.dataset.saveDev, dn); toast('Renamed to ' + dn); return render(); }
    if (t.matches('tr[data-open]') && !e.target.closest('a, button, input, select, label')) return go('#orders/' + encodeURIComponent(t.dataset.open));
  });
  function renameCat(slug, name) { var added = state.overlay.categories.added.find(function (c) { return c.slug === slug; }); if (added) added.name = name; else state.overlay.categories.renamed[slug] = name; save(); }
  function renameDev(id, name) { var added = state.overlay.devices.added.find(function (d) { return d.id === id; }); if (added) added.name = name; else state.overlay.devices.renamed[id] = name; save(); }

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.id === 'cancel-form') { e.preventDefault(); var reason = $('#cancel-reason').value; if (!reason) { toast('Choose a reason first.'); $('#cancel-reason').focus(); return; } var o = orderById(state.route.id); if (o) { patchOrder(o, 'cancelled', reason); toast('Order ' + o.id + ' cancelled'); render(); } return; }
    if (f.id === 'product-form') { e.preventDefault(); saveProductForm(f); return; }
    if (f.id === 'settings-form') { e.preventDefault(); var fd = new FormData(f); state.overlay.settings = { store_name: String(fd.get('store_name') || '').trim() || 'Ampline', trust: fd.getAll('trust').map(function (x) { return String(x).trim(); }) }; save(); toast('Settings saved'); return; }
    if (f.id === 'add-cat') { e.preventDefault(); var fd2 = new FormData(f), nm = String(fd2.get('name') || '').trim(); if (!nm) return toast('A category needs a name.'); var slug = slugify(nm); if (categories().some(function (c) { return c.slug === slug; })) return toast('A category with that name exists.'); state.overlay.categories.added.push({ slug: slug, name: nm, group: String(fd2.get('group')), blurb: String(fd2.get('blurb') || '').trim(), facets: ['Brand', 'Price'] }); save(); toast('Added ' + nm); render(); return; }
    if (f.id === 'add-dev') { e.preventDefault(); var fd3 = new FormData(f), dn = String(fd3.get('name') || '').trim(); if (!dn) return toast('A device needs a name.'); var did = slugify(dn); if (devices().some(function (d) { return d.id === did; })) return toast('A device with that name exists.'); var w = parseInt(fd3.get('max_charge_w'), 10); state.overlay.devices.added.push({ id: did, name: dn, family: String(fd3.get('family')), connector: null, max_charge_w: isNaN(w) ? null : w, aliases: [] }); save(); toast('Added ' + dn); render(); return; }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'cat-filter') return go(hashFor('products', Object.assign({}, state.route.q, { cat: t.value })));
    if (t.hasAttribute('data-price')) { var v = parseFloat(t.value); if (isNaN(v) || v < 0) { toast('Enter a price of 0 or more.'); t.value = Number(productById(t.dataset.price).price).toFixed(2); return; } patchProduct(t.dataset.price, { price: Math.round(v * 100) / 100 }); t.value = (Math.round(v * 100) / 100).toFixed(2); toast('Price saved: ' + money(v)); return; }
    if (t.hasAttribute('data-stock-of')) { patchProduct(t.dataset.stockOf, { stock: t.value }); var wrap = t.closest('.cell-select'); wrap.className = 'cell-select cell-select--' + STOCK[t.value][2]; var cell = t.closest('.stockcell'); if (cell) cell.querySelector('.mini').outerHTML = stockMini(t.value); toast(STOCK[t.value][0]); if (state.route.q.stock) render(); return; }
    if (t.hasAttribute('data-sel')) { if (t.checked) state.selected[t.dataset.sel] = true; else delete state.selected[t.dataset.sel]; return render(); }
    if (t.id === 'sel-all') { $$('[data-sel]').forEach(function (c) { if (t.checked) state.selected[c.dataset.sel] = true; else delete state.selected[c.dataset.sel]; }); return render(); }
    if (t.hasAttribute('data-rename-cat') || t.hasAttribute('data-rename-dev')) { t.closest('.list__r').classList.add('is-dirty'); return; }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-rename-cat') || t.hasAttribute('data-rename-dev')) { t.closest('.list__r').classList.add('is-dirty'); return; }
    if (t.id === 'order-search' || t.id === 'product-search') {
      clearTimeout(state.searchT);
      state.searchT = setTimeout(function () {
        var name = t.id === 'order-search' ? 'orders' : 'products', q = Object.assign({}, state.route.q, { q: t.value.trim() });
        history.replaceState(null, '', hashFor(name, q)); state.route = parseHash();
        var html = name === 'orders' ? viewOrders(state.route) : viewProducts(state.route);
        var pos = t.selectionStart; $('#view').innerHTML = html; var again = $('#' + t.id); again.focus(); try { again.setSelectionRange(pos, pos); } catch (err) { /* number inputs */ }
      }, 180);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches('tr[data-open]')) go('#orders/' + encodeURIComponent(e.target.dataset.open));
  });
  window.addEventListener('hashchange', render);

  /* ---------- Boot ---------- */

  function fetchJson(name) {
    return fetch('../content/' + name + '.json', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .catch(function (err) { state.errors[name] = err.message === 'Failed to fetch' ? 'not reachable' : err.message; return null; });
  }
  Promise.all([fetchJson('products'), fetchJson('orders')]).then(function (res) {
    state.catalog = res[0]; state.seed = res[1];
    if (state.seed && state.seed.orders && state.seed.orders.length) {
      var newest = Math.max.apply(null, state.seed.orders.map(function (o) { return new Date(o.placed_at).getTime(); }));
      state.shift = startOfDay(Date.now()) - startOfDay(newest);
      if (state.shift < 0) state.shift = 0; // a file dated in the future is shown as written
    } else if (state.seed) state.errors.orders = 'no orders in the file';
    render();
  });
  render();
})();
