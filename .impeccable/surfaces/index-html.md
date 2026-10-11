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


## Update 2026-10-11 (critique fixes)

- Model step: a family bucket that holds models (iPhone 15 or newer → iPhone 16; Samsung Galaxy S → Galaxy S25; iPad Air → iPad Air 11-inch (M2)) asks "Which model? Cases and folios fit one model only." with the models and "Another model" (the bucket). A model fits everything its bucket fits plus the products that name it, so cases enter the fit answer only when the model is named. Devices with a `parent` in `devices[]` are models; the device chips show buckets only.
- The answer carries the payoff: under "N products fit …" a peek row shows the first four fitting products (drawing or photo, in 52px white hairline wells) and links to the fits row, so on a phone the battery and the products share the viewport. The trust row (delivery, warranty, card or cash on delivery, each a placeholder) sits under the result and fills the desktop dead band.
- The battery axis stretches to the ceiling when it passes 100W (MacBook Pro: 0 / 70 / 140W). Captions: "The catalog's ceiling for <bucket>[, which this model sits in]; your model may take less." and, for a catch-all bucket, "A typical figure for this group, not a maker's number."; both end "Indicative; each power product below states what its port can give."
- Photos sit in the same grey well as drawings, inset 12%, multiplied so a white studio background drops into the well; the drawing hides while a photo is present. Product images are trimmed WebP at up to 1000px (tools/optimize-images.cjs), 1.4 MB for 44 files.
- Ranked lists put out-of-stock products last; the house strip says the two mounts carry no watts; the browser guess reads "an Android phone", not "a Other Android phone".


## Update 2026-10-11 (retail hero)

The first viewport is a retail hero inside the same world; the watt chart left the hero and watts stay on power product tiles. Top to bottom:
- Promo card: a white hairline card holding three slides in a scroll-snap track (one slide in view at every width, swipe on touch), each a live-text headline, a one-line offer computed from the catalog with the synthetic tag, and a Shop link to its listing: the Ampline range (shop/all.html?brand=ampline, "from $12.99"), phones (shop/phones.html, "from $469"), deals (shop/all.html?deal=1, "9 products below their list price, up to $100 off"). The art side is the grey well with three catalog figures: drawings for the house range, trimmed WebP photos (each under 150 KB) for phones and deals, no text in images. The pager is prev/next round buttons plus dots (aria-current), ArrowLeft/ArrowRight while focus is inside the card; no autoplay. On desktop the pager sits at the slide's bottom-left; on phones under the art.
- Picker bar: a white card with the h1 "What do you own?", the browser guess line, the family chips, then the device and model rows when a family is picked.
- Payoff: four tiles from catalog.js, "Best sellers" (the Best seller badge, buyable first) with "All products", swapped live to "Fits <device>" (the first four that fit, cases first) with "See all that fits" to shop/all.html?device=<id>. The featured rows below skip these four.
- Trust row: three white hairline items with the recorded pitch promises, "Delivery across Lebanon in 1 to 3 days", "1-year warranty", "Card or cash on delivery" (PRODUCT.md records them as assumptions to confirm). The same copy sits on product pages and in the cart.
- On phones a device tap scrolls the tiles into view (the model question first when it is open). The category grid follows the hero directly; the separate fits row is gone.
- shop.js learned ?deal=1 (products with a compare-at price) with an "On deal" applied chip.

## Update 2026-10-11 (second critique fixes)

- The fit answer ranks by why a shopper with that device comes: a per-family category order (phones: chargers, cables, power banks, cases; laptops: chargers, hubs, cables; watches and earbuds: wireless first), and the four tiles take the top product of each category in turn, with a product made for the exact model (the iPhone 16 case) leading its category. iPhone 16 now answers charger, cable, power bank, case.
- The thesis heading "What do you own?" is 1.75rem on phones (the slide headline's size) and up to 2.75rem on desktop (42px at 1440, just under the slide headline). On phones the promo slide is compact: the text beside a 120px grey well as tall as the text block, holding the lead figure with the second overlapping its lower right, the pager beneath, about 320px tall, so the bar and its first chip rows enter the first viewport; from 720px the two-column slide with the staged three-figure art returns.
- A device tap scrolls the answer into view at every width: on desktop always the bar under the header (chips above, tiles below, no bounce between bucket and model), on phones the model question when it is open, else the tiles. A thin answer (fewer than four fits) is padded with accessory and power best sellers under a subline that says so.
- The browser guess names only what the user agent can tell ("a Mac", "an iPhone", "an Android phone", "a Windows laptop"); tapping a family-only guess opens the device row in view with "Tap it to pick which one." The suggestion ring is a hairline ink border, no inset; green stays for pressed and fit. The guess line hides once a family is picked and a repeat tap never closes it. The family row may wrap at 1024.
- Before the catalog arrives the skeleton slide, the empty chip rows, the guess line and the payoff subtitle reserve their heights, so the catalog's arrival moves the tiles by at most 6px at 390, 820 and 1440.
- aria-live sits on the payoff subtitle, not the tile grid; a hovered current dot keeps its green; the first slide's art shows the GaN 100W charger, the 3-in-1 cable and the MagSafe power bank its copy names.
