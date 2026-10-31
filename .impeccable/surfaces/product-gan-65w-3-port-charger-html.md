---
version: 1
slug: "product-gan-65w-3-port-charger-html"
primary_target: "product/gan-65w-3-port-charger.html"
related_targets: ["product.js","catalog.js","tools/product-template.html","tools/make-product-pages.py"]
---

# Product pages (product/<slug>.html, all 58 SKUs)

Scope: one scaffold (tools/product-template.html, written out for every SKU by tools/make-product-pages.py) for every product in content/products.json. Visitor mode: Persuade. Each page carries only its title, meta description, data-slug, breadcrumb text and h1 fallback; product.js renders everything else from the catalog: the head, the drawn gallery, the buy box, the sections and the related row. Extended to all 58 SKUs on 2026-10-11.

Audience and job: a shopper who arrived from a listing, a search, the home grid or a device tile, often with a device in the URL. On an accessory or power product they must learn whether it fits their device, what one port gives, how the output splits when shared, and what the box holds. On a device they must learn what it takes to charge (its own published ceiling, indicative), choose the colour or storage the catalog lists, and find the Ampline accessories that fit it.

Three heads from one scaffold:
- Power products and accessories with an output: the watt glyph reads a port's max output of 100, with the category caption (max on one port, through the cable, to the laptop); the fit line answers for the device in the URL and the Fits section offers the family chips.
- Devices mapped to the devices array: the same glyph reads the family's charge ceiling from the catalog, captioned "Takes up to" with "The catalog's ceiling for <family>; this model may take less. Indicative.", on an axis that stretches to the ceiling when it passes 100W; a catch-all family ("Other USB-C laptop") shows no glyph. No fit line, no Fits section. After Specs, the box and Reviews the page ends with "Complete your setup", a scroll row of house products the catalog lists for that device (buyable first, out of stock last), each tile carrying the device forward.
- Everything else (audio, gaming, networking, smart home, cases): no glyph; cases and folios made for one model carry an empty compat and say "Made for <model> only" instead of a family claim.

Action: Add to cart with the chosen variant: the plug region from the Plug spec where it lists more than one, then the catalog's variants (colour, storage, pack) with two or more options, each a chip radio group preselected on the option the SKU already is (the tier or pack in its name or Storage spec, else the first); the cart key is the SKU plus the chosen labels ("Teal · 256 GB", "EU plug"). The h1, the sticky bar (choice first), the Specs Storage row and the cart line follow the chosen tier or pack ("Apple iPhone 16, 256 GB"); the title and breadcrumb keep the SKU name. Every variant shares the SKU's one placeholder price; the notes say storage-tier and pack pricing are left to the client. The optional cable bundle stays on chargers whose box lacks one. Out-of-stock SKUs show the disabled button and no bundle. The phone keeps the action in a sticky bar.

Proof: the catalog itself. The gallery is drawn in the world's stroke grammar: the tile figure (category figures for third-party products), a ports panel on power products and the Ampline accessories that carry an output, a size drawing when the Size spec parses as W x H x D mm, and a box drawing from in_box. Thumb labels are one word in 84px thumbs from 1024px. Specs and box list read from the record; reviews are an aggregate plus a marked placeholder.

Constraints: no per-device wattage or charge-time claims beyond devices[].max_charge_w marked indicative; prices, ratings and stock placeholder and labeled; third-party names only, no logos; every drawing label comes from a spec or box entry; delivery, warranty and payment rows stay placeholders.

Unresolved: real prices, photography, delivery and warranty terms, reviews, storage-tier pricing.

## Update 2026-10-11 (two reported bugs)

- The sticky gallery rode over every later section on desktop because its containing block was the whole page grid. The head, gallery and buy box now sit in one `.pdp__top` grid (template regenerated for all 58 pages); the gallery sticks only until the buy box ends.
- Gallery slides and tile wells no longer use percentage padding on an aspect-ratio box: WebKit sized them wrongly on an iPhone (tile well 177px in a 145px column). Drawings and photos are absolutely inset instead. Verified in Playwright WebKit with iPhone emulation and in Chromium at 1990px.

## Update 2026-10-11 (category circles)

- Every product page ends with the home's category circles under "Shop by category" (the shared `catRow` in catalog.js: photo categories first, a best seller's photo or the house drawing, one sideways row). Links carry the page's `?device=` query so a shopper who arrived from a fit keeps it. The footer's "This page" list links to it.

