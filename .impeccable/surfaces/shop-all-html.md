---
version: 1
slug: "shop-all-html"
primary_target: "shop/all.html"
related_targets: ["shop/chargers.html","index.html"]
---

## Surface: the listing family (shop/all.html and shop/<slug>.html for all 15 categories)

Mode: Operate. Built 2026-10-11 from shop/chargers.html as the template; tools/make-shop-pages.py writes every page from tools/shop-template.html, each page carrying only its title, meta description, data-category, breadcrumb, h1 and blurb fallback. shop.js renders the rest from content/products.json.

Thesis: narrow in two taps, starting from what you own. On Accessories and Power categories and on the all-products page a "What do you own?" strip sits under the page head and above the grid: family chips, then that family's device chips with would-be counts, then a bucket's models, the same steps as home. The title follows the device ("Fits iPhone 16", "Chargers for iPhone 16"). The category's own facets follow in the rail or sheet in the order the catalog's facets array names them; the count stays in view. (Layout round 2026-10-11 replaced the Fits radio group in the rail.)

Rules the controller follows:
- Filter groups come from each category's facets. Options are derived from the pool (A.facetOptions): distinct normalised spec values, watt bands for output labels, port options, price bands that follow the pool's price range (Under $20 / $20 to $50 / Over $50 for chargers; Under $300 / $300 to $800 / Over $800 for phones; Under $500 / $500 to $1,500 / Over $1,500 for all products). Only options that match something in the pool are offered, and a group (Price included) needs two live options to stay; so a one-product category shows no dead rail and Cables has no price group while every cable is under $20. Coverage and Battery filter by band (Up to / Over 200 m²; Under a day / 1 to 3 days / Over 3 days) because the raw specs mix units. A prose Fits spec facet is dropped where the device group already answers fit.
- The own strip appears only on Accessories and Power categories and on shop/all.html; device categories hide it. Devices never fit a device. Tapping a pressed model falls back to its bucket; tapping a pressed bucket or closing the family clears the device. On screens under 1024px a device tap scrolls the count line under the header; the desktop rail is sticky so the facets stay reachable.
- Sort: Featured, price both ways, rating everywhere; Max output per port only when the category group is Power.
- shop/all.html is a search landing: its rail holds Group and Brand (no Price: a band over phones and cables answers nothing; Group is the divider); every product, and the header search (?q=) matching name, brand, category and spec label/values, every token required, bare numbers matched as whole numbers (a comma after the number is prose, a comma plus three digits is a thousands mark). Query and haystack share one normalisation (type-c, usb c and usbc meet USB-C; powerbank meets Power Bank; 65 w meets 65W; 10,000 reads as 10000). A device name, family word or in-range model number in the query ("iphone 16", "iphone 13", "macbook", "android") becomes a fit test: the product fits that device or names it, so "iphone charger" lists chargers and "iphone 16" leads with the phone and its case. Featured order under a search ranks name hits, then category hits, above spec hits (updated 2026-10-11, harden catalog.js). On that page the header form filters in place and the field follows the search state; elsewhere it submits to shop/all.html.
- State lives in the URL: device, q, sort, and one param per facet (slugified label, comma-joined option ids). Inner-page group nav links to shop/all.html?group=<group>.
- The sheet's Clear and the Filters badge leave the search and the device alone (neither is in the sheet); the applied chips' Clear all removes everything. The header group nav marks the current group with aria-current: the category's group on a category page, the one selected Group option on the all-products listing.
- Model-specific cases and folios carry no family compat (the devices list is coarse), so a device chip never claims a case that fits only one model; their fit is stated in the Fits spec row.
- Empty result names the single filter or the search whose removal frees the most results, with a primary button to remove it; Clear all appears as the ghost action only when more than one thing is applied. The device is suggested for removal only when nothing else frees results. Search-only misses read "Nothing matches “q”." with one button.
- Every price and rating stays marked SYNTHETIC; the Price legend carries the synthetic tag. The blurb no longer repeats the disclaimer (distill, 2026-10-11): it is one line and hides once a device is named, because the title then says what the page is. The count line names the search and the deal state, not the device. A facet group with fewer than two live options collapses at render time.

Open: product photography (tiles use drawn line art per category), delivery/warranty/payment rows remain placeholders.

## Update 2026-10-11 (harden, after the first critique at 25/40)

- The phone sheet clips instead of hiding its overflow: a tap on a Fits chip focuses a visually-hidden radio, and a hidden-overflow dialog scrolled itself by 579px to reach it, leaving the head off screen. Clip cannot be scrolled. Rail chips are 44px on touch screens.
- A cart change no longer re-renders the grid. shop.js updates only the tile buttons whose state is stale, so the clicked button keeps its "Added" moment and its focus, and a drawer removal flips only that tile back.
- Tiles for SKUs with a variant choice (colour, storage, plug region, pack) render the pill as a "Choose options" link to the product page carrying the device query, never a blind add; "In cart" shows once any variant is in the cart. Shared tile in catalog.js, so every listing and home row follow.
- Filters push history entries: Back undoes one filter step and stays on the listing. Scroll restoration is manual; pagehide stores the scroll under the current URL (filters included) and a back_forward or reload navigation restores it, instantly, after the first render.
- A header search scrolls the toolbar (the count line) to the top under the sticky header, using the page's scroll-padding, and blurs the field under a coarse pointer so the keyboard does not cover the answer.
- The empty state suggests removing the device only when no other single removal frees results: Devices plus iPhone 16 now says "Removing Devices shows 12 products".
- Verified at 390 (touch) and 1440: sheet tap, Back through filters, search landing, add without re-render, variant link, empty state, Back-from-product scroll, Escape focus return; node checks pass; the detector reports only the pre-existing toolbar inset finding.

Open for the next rounds: search understanding (harden catalog.js), fit leading the page (layout, distill), tile rhythm and small touch targets (polish).

## Update 2026-10-11 (harden catalog.js, layout, distill, polish)

- Search understands shopper phrasings (see the search rule above): synonyms, numbers before commas, device terms as fit tests, name-first ranking. 21 node assertions in check.js.
- Layout: the "What do you own?" strip above the grid replaced the Fits radio group; the title follows the device; the all-products rail is Group and Brand; the desktop rail is sticky. Verified at 390 (touch) and 1440: family, bucket and model taps, toggles, reload, sheet contents, category and device pages, focus order, rail stickiness; all 16 listings open clean.
- Distill: one-line blurb that hides once a device is named, count without the device suffix, dead facet groups collapse, the Filters button hides when nothing can narrow, one exit on a single miss, Clear all only beside two or more applied chips.
- Polish: skeleton heights match the median real tile (560 / 608), the sort select and the count carry their shape before the catalog loads, figure-unit pairs never break in names or facts, cable and hub tiles use the product page's watt captions, applied chips, Clear all and tile buttons are 44px on touch, the families row keeps room for the focus ring, scroll-to-count respects reduced motion. Detector: only the toolbar inset finding, recorded in ignore.md as the house hairline row.

Open: the orphan last tile on a 3-column desktop row (58 products), and the count battery that drains as the answer narrows (a question from the critique, not a defect).

