# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML and CSS with one shared `styles.css` and vanilla JS: `catalog.js` (shared catalog logic, cart drawer, product tile), `app.js` (home), `shop.js` (category listings), `product.js` (product pages). No build step, no framework; `tools/make-product-pages.py` and `tools/make-shop-pages.py` write the per-SKU product pages and the per-category listing pages from templates in `tools/`; they are helpers, not a build. Chosen by the user on 2026-10-10; live mode runs on the static files.

## Users

Primary: a phone-first shopper in Lebanon replacing a dead or lost charger or cable today. They browse on the phone, compare quickly, and pay by card or cash on delivery. Prices in USD.

The same shopper also buys the device itself: a phone, laptop, tablet, headphones, watch, console, router or smart-home piece, chosen by budget and by the facts the category facets carry (screen, storage, processor, type, noise cancelling). Updated 2026-10-11.

No secondary audience confirmed. Distributor or B2B buyers are out of scope for the prototype.

## Product Purpose

Ampline (placeholder name) is a multi-category tech retailer for Lebanon: phones, laptops, tablets, audio, wearables, gaming, networking and smart home, plus accessories (cables, hubs, car, cases and mounts) and power (chargers, power banks, wireless). Ampline is also the house brand for the charging and cable range and for its own mounts and stands; cases, folios and every device are third-party products listed by product name only, no logos. Updated 2026-10-11; the store began as a charging-accessories storefront.

This build is a pitch sample for prospective clients. Success means a first-time visitor on a phone can name what they own, see what fits it, understand what a power product will deliver, and reach the cart without doubt.

## Positioning

"Start from what you own." The shopper names the phone or laptop they own and the whole store answers: accessories, cables, chargers and cases filter to what fits it; devices browse by budget and the category facets. The charging-watts answer, the max a port delivers read from the spec sheet, stays on power products and never becomes a per-device claim. The one per-device figure the store shows is the device's own published charge ceiling from `devices[].max_charge_w`, always marked indicative; it describes the device, not what any product will deliver to it. Neighbouring stores list specs; this store answers "does it fit what I have". The mechanism is backed by the `devices` array, the `compat` and `device` fields and the `specs` of `content/products.json`.

## Operating Context

- Catalog lives in `content/products.json`: 58 SKUs across 15 categories in three groups (Devices, Accessories, Power). Each category carries a `group` and a `facets` array naming the spec labels that become filters (Brand and Price resolve to product fields; output labels, Coverage and Battery filter by band). A top-level `devices` array (21 family buckets plus 3 models nested under them by `parent`: iPhone 16, Galaxy S25, iPad Air 11-inch (M2); each with family, connector, `max_charge_w`, and `aliases` mapping the original compat strings) is the single list the device picker should read. A model fits everything its bucket fits plus the products that name it, which is how model-specific cases and folios enter a fit answer. Devices carry `device` (the id they are) and variants; accessories carry `compat` (device ids for newer items, prose for the 12 original SKUs). Prices, ratings and availability are synthetic and labeled so in `_meta`; `_meta.brands_note` covers third-party names.
- Competitor evidence lives in `inspo/NOTES.md` with screenshots and DOM facts under `inspo/<site>/` for Porodo, Green Lion, Bavin, Anker, Powerology, Belkin, Baseus and Ugreen, captured 2026-10-10. It records category conventions as facts: wattage carried in product titles, strike-through compare prices, a shipping/returns/warranty trust row, a category row near the top of the home page, a sticky add-to-cart bar on mobile product pages, Arabic switchers on the three Gulf stores.
- The shopper's scene is the phone. Desktop is secondary.

## Capabilities and Constraints

- Scope (updated 2026-10-11): home, a listing per category, an all-products listing with search, a product page for every SKU, and a cart drawer shared by all pages. Checkout is a stub that ends in a thank-you panel; no payment is taken. Built so far (2026-10-11): home, a listing for every category and the all-products listing with search (`shop.js` renders all 16 from the catalog's facets; `tools/make-shop-pages.py` writes the pages), a product page for every one of the 58 SKUs (`product.js` renders three heads from the catalog: power and accessory, mapped device, and everything else), the cart drawer.
- Search runs in the browser over the catalog file; there is no backend.
- Currency USD. Every price is a synthetic placeholder until a client supplies real ones. Device variants (colour, storage) share one price per SKU; storage-tier pricing is undecided and left to the client, and the page says so.
- Brand name "Ampline" is a placeholder; renaming is a find-and-replace across the pages.
- Language: English first. An Arabic right-to-left edition is planned, timing undecided; pages should not bake text into images.
- Compatibility data is coarse (device families and ids, max watts per port). The device picker must stay honest to that: show the port's max output and the matched catalog entry, never invent a per-device wattage that the data does not hold. `devices[].max_charge_w` is indicative and must be presented as such.
- Third-party products: product names as a retailer lists them, no logos, no marketing claims; specs are plain facts. Product images for third-party SKUs are manufacturer product shots sourced on 2026-10-11 at the user's request for the pitch; the licence for client use is the client's to clear, recorded as open. The 12 Ampline SKUs and the two Ampline mounts are a fictional house brand with no photography, so they keep their drawings.
- Pitch assumptions (recorded 2026-10-11, shown as plain copy on home, product pages and the cart, to be confirmed by the client before launch): delivery across Lebanon in 1 to 3 days; a 1-year warranty; card or cash on delivery.
- Undecided, recorded not invented: hosting, image licensing for client use, house-brand photography (the Ampline SKUs draw line art; every page shows a photo wherever a file exists at a catalog image path under `assets/products/`, tiles taking the first image and the product gallery leading with every image that loads), storage-tier pricing.

## Brand Commitments

- Working name Ampline, placeholder. House brand covers charging, cables, power banks, hubs, car and wireless products, plus Ampline mounts and stands; everything else is third-party.
- The eight reference stores set the craft bar and the category truth. They are not a look to copy.
- Visual world: The Charging Lock Screen, recorded in `DESIGN.md`, stays as is for the multi-category store. Only the home hero and its charger-only thesis change to carry "start from what you own"; a category grid is now allowed on the home page (recorded 2026-10-11).
- No real brand logos or badges from any reference store or third-party brand. Third-party product photography is now in (manufacturer product shots, decision of 2026-10-11); reference-store imagery stays out.

## Evidence on Hand

- `content/products.json` (catalog, synthetic prices and ratings, devices array).
- `inspo/NOTES.md` and `inspo/<site>/*.png` plus `facts.json` (eight competitor captures; product pages missing for the three Odoo stores behind Cloudflare).
- `DESIGN.md` and `.impeccable/design.json` (the recorded visual system), surface briefs under `.impeccable/surfaces/`.
- Absent, and not to be fabricated: testimonials, press, customer counts, awards, certifications beyond the catalog's own MFi flag, real prices, product photography, delivery and warranty policies, order confirmations.

## Product Principles

1. Answer "does it fit what I own" before anything else; on power products, also answer "what will one port deliver", read from the spec sheet.
2. Every claim on screen traces to `content/products.json` or is visibly marked synthetic or placeholder.
3. The mobile fold carries the task; desktop extends it.
4. Convention where the shopper expects it (price, cart, trust row, category grid, search); invention only where it serves the fit thesis.
5. Arabic-ready by construction: no text in images, direction-neutral layout where it costs nothing.
