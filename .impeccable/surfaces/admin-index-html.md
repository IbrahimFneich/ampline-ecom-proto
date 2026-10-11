---
version: 1
slug: "admin-index-html"
primary_target: "admin/index.html"
related_targets: ["admin/admin.js","admin/admin.css","content/orders.json"]
---

## Surface: the admin panel (admin/index.html, admin/admin.js, admin/admin.css)

Mode: Operate. Built 2026-10-11 as a whole surface inside The Charging Lock Screen; concept roll key 564b2ed3 assigned structure 6 of 7, "the charge dashboard".

Audience and job: the store owner and one staff member, on a laptop at the shop (designed at 1280) and a phone in the evening (390). Jobs: move orders new → packed → shipped → delivered or cancel with a reason, keep stock states and prices true, edit the catalog lists, set the store facts. The phone is for the order flow.

Thesis: the store's battery glyph is the admin's status language. An order charges from New (empty) through Packed and Shipped to Delivered (full green); Cancelled is a dormant grey battery. Stock is a battery too: full, a sliver, empty. The word always sits beside the glyph. Advancing an order charges its battery one step with the house ease before the panel re-renders; that is the one authored moment.

Structure: sidebar (brand, five sections, storefront link, two-step Reset demo data, Sign out) and hash routes #dashboard, #orders[/id], #products[/id|/new], #catalog, #settings; a sign-in stub (#signin) with one "Enter demo" button and a visible no-authentication note. On phones the sidebar becomes a five-item bottom bar and the sidebar's foot actions live in Settings. Tables become stacked cards under 720px; the order and product panels are a right drawer from 720px and a bottom sheet below.

Data rules:
- Orders come only from content/orders.json (40 synthetic orders, _meta says so) plus orders placed on the storefront in the same browser (ampline:admin:v1.placed, ids W-1001 upward). Seed dates shift as a block so the newest seed order lands today; the demo note says so when it happens.
- Every edit lives in one localStorage key, ampline:admin:v1: order status and history, cancel reason, product patches and added products, category and device renames and additions, settings. The storefront layers the same key over the files on load. Storage off: edits last for the tab and the note says so.
- Dashboard tiles: orders today, this week, revenue over 30 days (cancelled excluded), cash to collect (open cash-on-delivery orders), low stock, out of stock; each links to its filtered list. The sparkline is orders per day for 30 days. No delivery fee, tax or discount exists in the data, so none is shown.
- Payment copy: "Card, paid at order"; "Cash on delivery, to collect" while open, "collected on delivery" once delivered, "not collected" when cancelled.
- A packed or shipped order older than the 3-day promise carries an amber "Day N" mark.
- Product form fields are exactly what the storefront reads: name, category, price, compare-at, badges, stock, specs, compat (device checkboxes, prose entries kept as removable tags, aliases pre-tick devices), variants (colour, storage, pack). A new product gets an id, a drawn figure for its category, no page, no photo and no ratings.
- Settings: store name, currency read-only, three trust lines, Arabic edition toggle disabled and marked planned. Saved here; applied to the storefront at launch, not now.

States: skeleton while the files load; an error box naming the missing file and HTTP status; empty lists with a reset link; "No orders match"; toasts confirm every save.

Open: real authentication, stock quantities (the catalog holds states), the storefront reading settings, pages for products added in the admin (regenerate tools/make-product-pages.py).
