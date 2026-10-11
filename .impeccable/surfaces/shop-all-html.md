---
version: 1
slug: "shop-all-html"
primary_target: "shop/all.html"
related_targets: ["shop/chargers.html","index.html"]
---

## Surface: the listing family (shop/all.html and shop/<slug>.html for all 15 categories)

Mode: Operate. Built 2026-10-11 from shop/chargers.html as the template; tools/make-shop-pages.py writes every page from tools/shop-template.html, each page carrying only its title, meta description, data-category, breadcrumb, h1 and blurb fallback. shop.js renders the rest from content/products.json.

Thesis: narrow in two taps. On Accessories and Power categories the Fits device group comes first, radios grouped by family with would-be counts; then the category's own facets in the order the catalog's facets array names them; the count stays in view.

Rules the controller follows:
- Filter groups come from each category's facets. Options are derived from the pool (A.facetOptions): distinct normalised spec values, watt bands for output labels, port options, price bands that follow the pool's price range (Under $20 / $20 to $50 / Over $50 for chargers; Under $300 / $300 to $800 / Over $800 for phones; Under $500 / $500 to $1,500 / Over $1,500 for all products). Only options that match something in the pool are offered, and a group (Price included) needs two live options to stay; so a one-product category shows no dead rail and Cables has no price group while every cable is under $20. Coverage and Battery filter by band (Up to / Over 200 m²; Under a day / 1 to 3 days / Over 3 days) because the raw specs mix units. A prose Fits spec facet is dropped where the device group already answers fit.
- The Fits device group appears only on Accessories and Power categories and on shop/all.html. Devices never fit a device.
- Sort: Featured, price both ways, rating everywhere; Max output per port only when the category group is Power.
- shop/all.html is a search landing: Group, Brand and Price come before the Fits group in its rail; every product, and the header search (?q=) matching name, brand, category and spec label/values, every token required, bare numbers matched as whole numbers. On that page the header form filters in place and the field follows the search state; elsewhere it submits to shop/all.html.
- State lives in the URL: device, q, sort, and one param per facet (slugified label, comma-joined option ids). Inner-page group nav links to shop/all.html?group=<group>.
- The sheet's Clear and the Filters badge leave the search alone (it is not in the sheet); the applied chips' Clear all removes it too. The header group nav marks the current group with aria-current: the category's group on a category page, the one selected Group option on the all-products listing.
- Model-specific cases and folios carry no family compat (the devices list is coarse), so a device chip never claims a case that fits only one model; their fit is stated in the Fits spec row.
- Empty result names the single filter or the search whose removal frees the most results, with a primary button to remove it and Clear all as the ghost action. Search-only misses read "Nothing matches “q”."
- Every price and rating stays marked SYNTHETIC; the Price legend carries the synthetic tag.

Open: product photography (tiles use drawn line art per category), delivery/warranty/payment rows remain placeholders.
