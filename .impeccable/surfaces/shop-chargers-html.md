---
version: 1
slug: "shop-chargers-html"
primary_target: "shop/chargers.html"
related_targets: ["shop.js","catalog.js"]
---

# Chargers category page (shop/chargers.html)

Scope: the one category listing in the prototype, chargers. Visitor mode: Operate.

Task: narrow four chargers to the one to buy. Filters: which device it fits (first, pre-applied when arriving from home with ?device=), type (wall, desktop, travel adapter, from the catalog's type field added 2026-10-11), max output per port in three bands, ports, price in three bands labeled synthetic. Sort: featured, price both ways, max output, rating. Count and applied-filter chips stay in view; every state lives in the URL query.

States: loading skeleton tiles; results; empty result that names the single filter whose removal frees the most results; filter options show their would-be count and disable at zero; out-of-stock tiles keep their disabled button.

Phone: a sticky toolbar with the count, a Filters button carrying the applied count, and the sort select; the rail opens as a native dialog bottom sheet with Clear and "Show N chargers". From 1024px the same dialog renders as a sticky left rail.

Constraints: same header, cart popover, product tile and footer as home (catalog.js is shared); no per-device wattage or charge-time claims; synthetic prices and ratings labeled; one sentence per product on tiles.

Decisions (user, 2026-10-11): type field added to products.json; device is the first rail filter, pre-applied and removable; price filter as bands.

Unresolved: the other five category pages (home links to shop/<slug>.html), the product page, real prices and photography.
