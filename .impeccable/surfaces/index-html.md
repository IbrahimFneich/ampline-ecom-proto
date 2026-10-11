---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["app.js","catalog.js","styles.css"]
---

# Home page (index.html), rebuilt 2026-10-11

Scope: the storefront home for the multi-category store. Visitor mode: Persuade.

Audience and job: a phone-first shopper in Lebanon who owns a phone or laptop and wants what fits it, or is choosing a device. They must name what they own, see what fits across cases, cables, chargers and hubs, find the three groups of the store, and reach a listing or the cart.

Action: pick a family, then the device. Secondary: open a category, search, add a featured product.

Proof: the catalog itself. The picker reads devices[] with its aliases; the fits row is the products whose compat names the device; the glyph shows the device's published charge ceiling from devices[].max_charge_w, labeled indicative; watts appear only on power products' tiles. Featured rows are best sellers, new arrivals and the most reviewed per group. The house strip's facts (count, watt range, GaN, MFi, Qi2) are computed from the Ampline SKUs. No testimonials, press, counts or awards.

Constraints: no per-device wattage claims beyond the device's own published ceiling, marked indicative; prices and ratings synthetic and labeled; delivery, warranty and payment stay unclaimed; unbuilt category pages render as non-link tiles marked not built; the search field submits to shop/all.html?q=, the all-products listing still to be built.

Direction: the established Charging Lock Screen, the category grid now allowed; the glyph reads what the device takes instead of what a charger gives. Memorable moment: picking the device fills the glyph and rewrites the fits row across categories.

Unresolved: the all-products listing with search, the other category listings, product pages for third-party SKUs, real prices, photography, terms.
