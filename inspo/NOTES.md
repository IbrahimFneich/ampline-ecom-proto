# Competitor storefront notes

Factual record of eight charger and accessory storefronts. Layout comes from the screenshots. Fonts, colours and URLs come from `facts.json` unless marked "sampled" (pixel colour read from a screenshot). No design direction for our site is given here.

## Capture

- **Date:** 2026-10-10. Home pass 19:21 to 19:29 UTC (facts.json `capturedAt`), PDP pass later the same evening.
- **Method:** Playwright driving the Chrome channel (capture.log "using chrome channel"). Desktop 1440x900 at scale 1. Mobile uses the Playwright "iPhone 13" device (390 px wide, 664 px fold) at scale 1. Locale en-US.
- **Files per site:** home fold and full page, desktop and mobile, plus `facts.json`. PDP fold and full page for five sites.
- **Cloudflare gap:** porodo, greenlion and powerology serve a Cloudflare bot challenge on deeper pages, so no product page exists for them. capture.log does print "powerology desktop pdp ok", but the folder holds no `pdp-*.png` and no PDP facts, so it counts as not captured.
- **PDP URLs captured (facts.json `pdpUrl`):**
  - anker: https://www.anker.com/products/a121d-45w-smart-display-charger-dual-foldable?variant=46557402398870&ref=image_product_shelf
  - baseus: https://www.baseus.com/products/picogo-ah22-digital-display-fast-charger-3c-100w
  - bavin: https://bavin.ph/products/bavin-pc2210-240w-fast-charging-type-c-ai-smart-auto-cut-off-adapter-for-laptops-ip-android-phones
  - belkin: https://www.belkin.com/p/retractable-gan-wall-charger-67w/WCH022bkBK-MV.html
  - ugreen: https://us.ugreen.com/products/ugreen-uno-100w-usb-c-gan-charger-4-ports

Every site section below uses the same nine labels in the same order.

## Anker (anker.com)

- **Platform, market, language, currency:** Shopify, no generator tag. US store, title "Anker | Live Charged. - Anker US", lang en-US, ltr. Prices look like "$29.99", "$39.99" and "$149.99", with a $ prefix and two decimals. The only region switch is "United States / English" in the footer. No Arabic.
- **Header and nav:** A black top strip lists sister brands ("Anker Charging", "Anker SOLIX", "Anker eufy", "Anker eufyMake", "Anker soundcore", with "Anker Innovations" on the right). Below it a black announcement bar reads "Discover Anker's New Expansion and Charging Solutions. | Shop Now >>", with "Product Recall" on the right. The logo sits left and search, cart and account icons sit right. A second row holds "Power Bank", "Charger", "Wireless Charger", "Cable", "AC Power", "Hubs & Docks", "Series", then right-aligned "Shop By", "Member Benefits", "Explore & Support". Dropdowns were not opened, and the facts nav list is the footer. A fixed right-edge tab reads "GET 15% OFF" and a chat bubble sits bottom right.
- **Home first viewport:** On both viewports a modal covers the hero: "Sign Up for Exclusive Offers Save Up to $20 or Get 15% Off", with an email field, two pre-ticked consent boxes and "Sign Up". Behind it is a full-bleed lifestyle photo of a vehicle interior and a beach. The hero headline is not readable.
- **Home section order:** (1) Lifestyle hero. (2) "Anker MagGo 2 Pro / The World's Fastest and Coolest Wireless Power Bank" with "Shop Now", a studio render over light streaks. (3) "Industry's First High-Refresh-Rate USB-C Hub with a Smart Display" with "Shop Now" and a 2-dot pager. (4) "The World's No. 1 Mobile Charging Brand" with three stats ("Available in 146 Markets", "200 Million + Global Customers", "Pioneering in Charging Technology for 14 Years") and two "SHOP NOW" tiles. (5) "Explore Anker's Top Products By Category", grey tiles: Power Banks, Chargers, Wireless Chargers, Hubs and Docks, plus Cables and AC Power on mobile. (6) "Explore Anker's Flagship Series", two tiles, one being "Anker Nano / Professional Fast Charging All in a Nano" with "Learn More". (7) "Power for Every Moment". (8) "Must-Have Anker Selections", tabs "New Arrivals" and "Bestsellers", about 4.5 cards visible with an arrow. (9) "Discover More from Anker Innovations" ("The Outdoors Are Calling", "Save up to 55% and win a eufyCam S4"). (10) Six service tiles: "FAST, FREE DELIVERY", "30-DAY MONEY-BACK GUARANTEE", "PAY WITH EASE" (Affirm), "WE ARE HERE TO HELP", "ANKERCREDITS REWARDS", "HASSLE-FREE WARRANTY". (11) Sign-up block. (12) "More Exclusive Offers": Welcome Offer, Corporate Offer, Certified Refurbished, Referral Program, Education. (13) "Straight From Our Fans" review cards with five orange stars, a quote and a product chip. (14) "Featured Blogs and Updates" with "All Blogs >". (15) Black footer: newsletter "Get an Exclusive 15% Off Your First Purchase", membership perks, four "Buy on the Anker Store" badges, columns Products, Explore, Support and Contact Us, and payment marks.
- **Product card:** A light grey tile (#eaeaec, sampled) on a #f5f5f7 page, with the image on top. The bold two-line title carries the spec in parentheses, for example "Anker Nano Charger (45W, Smart Display, 180° Foldable)". A two-line grey feature sentence follows. The price "$29.99" is followed by a grey strike-through "$39.99". Each card has two buttons, "Shop Now" (outline) and "Learn More" (black fill). No stars and no badges appear on shelf cards. Hover state unknown.
- **Category navigation:** Category tiles on the home page and category links in the header. The "Shop By" dropdown was not opened, and no device picker was observed.
- **PDP layout:**
  - **Sticky top bar:** the product name plus tabs "Purchase / Overview / Specs / Comparison / FAQ / Downloads / Reviews".
  - **Gallery:** a 3-up horizontal carousel of infographic slides with a "$10 OFF" corner flag, a "4/8" counter and arrows. Below it sit a thumbnail strip and the toggles "Overview / Video / Model".
  - **Buy box, top to bottom:** (1) "New" label, H1, blue stars "5.0 (1 reviews)". (2) "$39.99" with an orange chip "Save $10.00". (3) Coupon card "Save $10 with our auto-applied code. Copy Code", then a nudge to log in for AnkerCredits. (4) "Key Features" with five bullets. (5) "Color: Black Stone" with five round swatches, then a quantity stepper. (6) "Select Your Version": "OTA Version $39.99 Save $10 with Coupon" tagged "New", and "Standard Version $39.99 Save $14 with Coupon" tagged "Member Price". (7) "Anker Plus Membership" upsell with three radio options. (8) "Review Your Selections" summary, then "Add to Cart" (blue outline) and "Buy Now" (blue fill). (9) "Services and Benefits": shipping, 30-day returns, warranty, support, payment marks, and "Delivery Method" with DHL, UPS and FedEx.
  - **Sticky bottom bar:** shown on desktop and mobile. It reads "Pre-order now. ship on Oct. 15th - Oct. 25th." and holds the price, the chip, "Add to Cart" and "Buy Now".
  - **Below the buy box:** (1) Overview image modules, for example "45W Max, Smart 3-Stage Charging" and "TÜV-Certified Care with ActiveShield™ 5.0". (2) Use-case tabs "At Work / At Home / On the Go", then "Universal Compatibility". (3) Comparison table of four Anker chargers. Rows: Color, Product Name, Total Output (Max), Single-Port Output (Max), Ports and Connections, Anker InstaCord, Data Transfer (Max), Dimensions, Weight, Safety Feature, MFi Certification. Each column has "Buy Now". (4) "Charging Tips", which lists supported devices and says some Samsung Galaxy models "are limited to 27W max charging". (5) Notes, including "This charger does not include a charging cable." (6) "Specifications", with Output given as "5V⎓3A / 9V⎓3A / 15V⎓3A / 20V⎓2.25A (45W Max)". (7) "FAQ" with eight accordion items, then reviews (only the pager rendered), then "Downloads" (a user guide). (8) A breadcrumb at the very bottom, then the footer.
  - **Not seen:** a "What's in the box" heading.
- **Colour and type character:** MontForAnker on body, h1 and buttons. White body, header text rgb(29,29,31). Cyan-blue #00befa on Buy Now and stars, and orange #ff9900 on save chips (both sampled). Shelf buttons are black and white with square corners. The facts radius of 0px was measured on a top-bar link, not a button. Photography mixes studio renders on dark or gradient grounds with lifestyle scenes. Gallery slides are text-heavy infographics.
- **Mobile:** Hamburger, search and cart on the right, with the brand strip and announcement above the header. The modal covers the whole fold. Category tiles form a two-column grid with pager dots. The PDP sticky bar with "Add to Cart" and "Buy Now" shows in the fold at load. Footer columns collapse to accordions.

## Baseus (baseus.com)

- **Platform, market, language, currency:** Shopify. US store, title "Baseus Official | Practical. Reliable. Base on User.", lang en, ltr. The home page shows a single price, "$299" for a mystery box. The PDP shows "$59.99 USD", with the currency code as a suffix, and the bundle shows "$69.99" against "$89.99". A flag and "United States/English" sit in the announcement bar, and the footer has "Select Your Region: United States/English". No Arabic.
- **Header and nav:** An announcement carousel with arrows reads "[gift emoji] Fall Sale | Unlock $299 Mystery Box". The round "b" logo sits left. The centred nav holds "Fall Sale [fire emoji]", "Dark Cherry Series", "Products", "Support", "Explore". On the right are "Store ↗", search, account, and a cart with a "0" count. Dropdown contents are unknown. A yellow chat bubble sits bottom right.
- **Home first viewport:** On desktop and mobile a spin-wheel modal covers the hero: "Feeling lucky? Up to 50% off", "Join Baseus Club", "Spin Now — Prize + Guaranteed 10% Off!", and a button "SUBCRIBE&SPIN NOW". Behind it is a full-bleed dark-cherry still life with "All Eyes on Cherry", "Meet the Dark Cherry ..." (cut off by the modal) and a "Learn More" pill. The mobile pager has four segments.
- **Home section order:** (1) Hero carousel. (2) "We Categorize – You Choose": nine studio cut-outs on white (Power Banks, Chargers, Power Strips, Cables, Earbuds, Headphones, Security Cameras, Hubs&Docks, Car Accessories). (3) Scene tiles "On the Go" (large), "Entertainment Home Base" and "Work Smarter", each with "Shop Now". (4) "Baseus Essentials" carousel, about 4.5 tall cards visible, with a pause control. (5) Full-width black band with the logo, a video poster. (6) "Featured in". (7) "Loved by Creators / Hear what the community is raving about.": three creator cards with verified ticks. (8) "Explore Baseus Latest Insights": one large article and three small, labelled "TECH EXPLAINED" and "TIPS". (9) Service row: "FREE SHIPPING", "SUPPORT CENTER", "EMAIL US". (10) Charcoal footer with app badges and payment marks.
- **Product card:** The "Baseus Essentials" cards are tall with a pastel peach-to-blue gradient. Each shows a model name ("PicoGo Pro AH22"), a one-line descriptor ("Fast Charger 100W", "Qi2.2 Power Bank") and a black "Shop Now" pill. Home cards show no price, stars or badge. Hover state unknown.
- **Category navigation:** The nine-icon row on the home page, plus "Products" in the nav (contents unknown). Campaign entries also sit in the nav ("Dark Cherry Series"). No device picker was observed.
- **PDP layout:** The PicoGo Pro AH22 was sold out at capture, so in-stock placement of the add-to-cart button is unverified.
  - **Breadcrumb:** "Home / Baseus PicoGo Pro AH22 Digital Display Fast Charger 3C 100W".
  - **Gallery:** a large image with a strip of eight or more thumbnails and a zoom control.
  - **Buy box, top to bottom:** (1) H1, then "$59.99 USD" with a "SOLD OUT" chip. On desktop the modal hides the price. (2) "SKU: E0125902", an empty star row, and the italic line "Coming soon: Estimated to arrive October 31." (3) Description and five bullets, one of which reads "Interative Smart Display" [sic]. (4) "Color: Dark Cherry" with two image swatches. (5) "NOTIFY ME WHEN AVAILABLE", a grey pill in place of add to cart. (6) "Worry-Free Purchase available with seel" and payment marks. (7) "Buy More Save More": an add-on power bank checkbox with a variant select, "Total price: $69.99 $89.99", and "ADD TO CART". (8) "Share" and "Shipping & Returns".
  - **Tabs:** "OVERVIEW / SPECS / REVIEW", which become accordions on mobile.
  - **Overview:** stacked dark image modules, each with pill sub-tabs, for example "3-in-1 Charging / Single-Port Use / Dual-Port Use / Triple-Port Use" and "Enyoyable Peeko" [sic].
  - **Lower page:** a trust row ("Free Shipping Over $20", "7-Day Money Back Guarantee", "Hassle-Free Warranty"), then "FAQ" with five items including "What's the max wattage for each port?" and "Is it good for international travel?", then "You may also like" and the footer.
  - **Sticky bar:** none observed.
- **Colour and type character:** DM Sans throughout. White body, header text #333333. The facts "Start shopping" button has a #282828 background, white text and a 30px radius, which matches the visible "Shop Now" pills. Yellow appears on the logo and the chat bubble (#fceb55, sampled). PDP imagery uses the campaign's deep cherry and purple. The footer is charcoal #282828. Home photography is lifestyle scenes with people.
- **Mobile:** The header is hidden behind the modal in every mobile capture. Scene tiles stack in one column. The Essentials carousel shows one card plus a peek of the next. PDP tabs become accordions.

## Bavin (bavin.ph)

- **Platform, market, language, currency:** Shopify (footer "© 2026, BAVIN Powered by Shopify"). Philippines, title "BAVIN", lang en, ltr. Prices look like "₱1,799.00". The PDP shows "₱399.00 PHP", with symbol prefix and code suffix, and cards show "From ₱1,299.00 PHP". An "English" dropdown appears in both the header and the announcement bar, plus a footer "Language" select. The options were not captured, and no Arabic was seen.
- **Header and nav:** A centred container on white. The lime wordmark sits left, with nav "Home", "Categories ˅" and "Product". On the right are "English ˅", search, account and cart. A lime bar below the header reads "Welcome to BAVIN store →". The Categories children exist in the DOM (menu not opened):
  - **Use-case groups:** "Budget Friendly", "Built-in Cable", "Car Jump Starter & Inflator", "Fast Charging", "Wireless Charging", "Gaming Console", "Laptop Charging", "Solar Powerbank".
  - **Charger groups by connector and wattage band:** "USB / 1A-1.3A Charger", "USB /2A-2.4A Charger", "USB / Multi-Port Charger", "USB / QC3.0 Charger", "Type-C / 20W-33W Charger", "Type-C / 36W-45W Charger".
  - **Cable groups:** "Extra-Length Cable", "3-in-1 & 4-in-1 Cable", "90 Degree Gaming Cable", "Nylon Braided Cable".
  - A "Contact" chat pill sits bottom right.
- **Home first viewport:** A single full-width banner with all text baked into the image: "BAVIN BY YOUR SIDE / THROUGH EVERY IMPORTANT MOMENT" and "SHOP NOW!". It shows a product group on lime podiums in a grass-and-sky scene. "Shop By Category" sits at the desktop fold edge with six line icons: Powerbanks, Chargers, Data Cables, TWS Earbud, KTV Speaker, iPhone 18.
- **Home section order:** Sections below the fold rendered almost invisible, and the headings were read after boosting contrast. (1) Banner. (2) "Shop By Category": six icons, a "1/5" carousel with "View More →" on mobile. (3) Italic quote band: " BAVIN: BY YOUR SIDE THROUGH EVERY IMPORTANT MOMENT ". (4) Slideshow with pager 1 to 5 and pause, one slide being "KTV KARAOKE". (5) "Best Selling BAVIN ITEMS" carousel with "View all". (6) Seven shelves named "Recommend Best Selling BAVIN" plus Powerbank, Charger, Data Cable, Audio Accessories, Speakers, OTG Adapters, Car Accessories, each with "View all". (7) "Subscribe to our emails", socials, the Language select and a PayPal mark.
  - The number of cards per shelf could not be counted.
- **Product card:** The card shares the page ground (#f4f4f4). The square image carries a lime label top left and a lime "Sale" pill. Titles are marketplace-length, four to seven lines, for example "[CCC] BAVIN PC032 Pro 10000mAh/ PC1103 20000mAh 2-in-1 22.5W Fast Charging Powerbank w/ Dual Cables & Foldable AC Plug". The strike-through price sits on its own line ("₱3,409.00 PHP") above "From ₱1,299.00 PHP". No stars and no CTA were seen. Hover state unknown.
- **Category navigation:** The "Categories" dropdown with the wattage-banded groups above, the home category icons, and one "View all" shelf per category.
- **PDP layout:** BAVIN PC2210 240W adapter.
  - **No breadcrumb.**
  - **Gallery:** main image plus nine thumbnails in a four-column grid. On mobile it becomes a swipe with a thumbnail strip, arrows and zoom.
  - **Buy box, top to bottom:** (1) A five-line H1. (2) "Color: White" with two round swatches. (3) Strike-through "₱1,299.00 PHP", then "₱399.00 PHP", then a lime "Sale" pill. (4) A green dot with "81 in stock", then a quantity stepper. (5) "Add to cart" (outline), "Pay with PayPal" (yellow) and "More payment options". (6) Three icons: "100% Authentic", "After Sale Service", "Fast Shipping".
  - **Below:** plain-text spec lines "Brand: BAVIN", "Model: PC2210", "Interface: Type-C" and "Max. Charging: 48V / 5A / 240W", then "Features:" and a "Special Note:" troubleshooting list.
  - **Not seen:** reviews, tabs, a compatibility block, related products, and a sticky bar.
- **Colour and type character:** Jost on body and buttons, DM Sans on h1 only. Body #f4f4f4, header text rgba(0,0,0,0.75). Lime #94d40b (sampled) on the bar, the "Sale" pill and the logo. The facts button is the cart drawer's "Check out": #535353 background, 7px radius. Banners are saturated composites with type baked in. The PDP pairs a white studio main image with dark infographic thumbnails.
- **Mobile:** Hamburger left, logo centred, search and cart right, with the lime bar under the header. The fold shows the banner (its text is tiny) and the category carousel. The PDP stacks everything and has no sticky bar.

## Belkin (belkin.com)

- **Platform, market, language, currency:** Not Shopify, and no generator tag. US store, title "iPhone Chargers, Power Banks & Docking Stations | Belkin", lang en, ltr. Prices look like "$99.99", with sale prices like "$89.99". The region "United States" sits in the footer. No Arabic.
- **Header and nav:** A lime bar reads "Premium accessories for iPhone 18. Shop now". The logo sits left, with nav "Products", "Sale" (red), "New Arrivals", "Shop By", "Business", "Support". On the right is a wide search field with a lime outline, "What are you looking for?", then account and cart. The mega-menu children exist in the DOM only (menu not opened):
  - **"Choose Your Device":** "iPhone 18", "iPhone 17", "iPhone 16", "iPhone 15", "Samsung S26", "Samsung S25", "Samsung S24", "Google Pixel 11", "Nintendo Switch 2".
  - **Other entries:** "Special Offers", "Buy with Prime", "Certified Refurbished", "Best Sellers", "Earn Belkin Rewards", "Guides".
  - **"Collections":** "Disney", "Best iPhone 17 Accessories", "iPhone 17 Screen Protectors".
  - An accessibility button sits bottom left.
- **Home first viewport:** A text-left hero: "Everything iPhone 18 Pro", "Advanced power and protection for your latest device." and a black pill "Shop now". Studio products sit on pale-blue podiums. Also inside the fold are the "Featured in" press-logo strip (GEAR PATROL, iDB, IGN, Mashable, TechCrunch, appleinsider, Bloomberg, CNET), the "Shop by Category" heading, and a cookie banner.
- **Home section order:** (1) Hero. (2) "Featured in" logo marquee. (3) "Shop by Category" carousel, six visible (Switch 2 Accessories, Wireless Chargers, Chargers, Docks and Hubs, Screen Protectors, Audio), with an active underline. (4) "Get Pixel-Perfect Protection" band with "Shop now". (5) Tabbed shelf "Switch 2 Accessories / 25W Fast Chargers / Content Creation Accessories / Custom Screen Protectors", five cards visible. (6) "Protect Your Devices for Storm Season / Rely on tested and certified surge protectors." with a lime "Shop now". (7) Lime "belkin rewards" band: "turns every connection into points", tiles Shop, Earn and Save, and "Log In" / "Sign Up". (8) "Discover Tech with Belkin" article carousel. (9) Black footer with "Connect with Belkin" email signup and an SMS opt-in.
- **Product card:** White, image on top. A red rectangular "Sale" badge sits above a grey category eyebrow ("Gaming", "ScreenForce"). The bold title runs two to three lines and carries the spec, for example "Power Bank 20K (30W) for Nintendo Switch 2" or "Dual USB-C Wall Charger 65W for Nintendo Switch 2". The price shows a strike-through "$99.99" then a red "$89.99". Each card has a black pill, either "Add to Cart" or "View Details". No stars on home cards. Hover state unknown.
- **Category navigation:** Device first in the nav ("Choose Your Device", DOM only), the home category carousel, use-case shelf tabs, and the PDP breadcrumb "Products / Chargers / USB-C Chargers".
- **PDP layout:** Retractable GaN Wall Charger 67W, Spider-Man edition.
  - **Breadcrumb**, then a single large studio image on white with a thumbnail strip. Under the gallery, a grey trust panel reads "Fast and free shipping", "30-Day money back guarantee", "24/7 Customer support".
  - **Buy box, top to bottom:** (1) Series name "UltraCharge" with a pink "New" badge, then the H1 and "SKU: WCH022bkBK-MV". (2) Orange stars "4.7 (52)", a description paragraph, and "$44.99". (3) An empty bordered box (a widget that did not render). (4) "Model" text chips "45W Standalone" and "67W Standalone". (5) "Color" with four image swatches; the selected one has a lime ring. (6) Yellow pill "Add to Cart" and black pill "Buy Now". (7) "Shipping" accordion: "Free Standard Shipping on $75+", "Free 2-Day Shipping on $125+", "This product usually ships within 1-2 business days." (8) "Warranty" accordion: "2-Year Warranty", "$2,500 Connected Equipment Warranty", and automatic registration.
  - **Tab strip:** "At a Glance / What's in the Box / Compatibility / Technical Specifications / Support". Only At a Glance content was captured.
  - **Spec band:** a lime "100% plastic-free packaging" band, then an icon row: "3.3ft/1m retractable cable", "67W max output", "USB-C Cable x1 USB-C Port x1", "Fast charge an iPhone 17 Pro Max from 0-50% in 23 minutes", "Tested for safety", "Universal USB-C compatibility".
  - **Reviews:** Header blocks: "Rating Snapshot" histogram with row filters, "Overall Rating 4.7 52 Reviews", and "Review this Product". "Average Customer Ratings" for Quality, Performance and Ease of Use. "Filter Reviews", with search, a Rating filter and a "Review Submitted via Sampling or Sweeps Campaign" filter. Each review shows Helpful counts and a "Response from Belkin". Some carry "Originally posted on Retractable GaN Wall Charger 45W".
  - **Then** "Questions" and "Disclaimers" accordions.
  - **Sticky bar:** none observed. The cookie banner covers the bottom of the mobile fold.
- **Colour and type character:** Suisse Intl, Regular for body and Medium or SemiBold for headings and buttons. White ground, black text. All sampled: lime #6ffb38, yellow #f4d771 on Add to Cart, sale red #ab2117, star orange #e65c00, pink #f8cbd7 on "New". Buttons are pills; the facts 0px radius was measured on the region selector. Photography is studio cut-outs on white or pale gradients. Black footer.
- **Mobile:** Hamburger left, logo centred, search, account and cart right. The hero image sits above the text. The PDP puts the title block before the gallery. The tab strip becomes stacked underlined headings ("At a Glance", "What's in the Box", "Compatibility", "Technical Specs", "Support"). Footer groups become "+" accordions.

## Green Lion (greenlion.net)

- **Platform, market, language, currency:** Odoo (generator "Odoo"). Prices put a dirham-style currency glyph before the amount (glyph, then "59.00"), and the footer links a "TDRA Certificate". Title "Home | Green Lion", lang en-US, ltr. The dropdown reads "English (US)" and "الْعَرَبيّة" exists in the DOM, so Arabic is offered; no right-to-left page was captured. The footer reads "Powered by TEQTRONIX" and gives the address "9099 Leslie St Unit C, Richmond Hill, ON L4B 1K9, Canada".
- **Header and nav:** White header with the logo left (lion mark plus italic wordmark). A flat centred nav holds "Home", "Shop", "Bulk Purchase", "About", "Blogs". On the right are cart, search, "English (US) ˅" and a "Sign in" pill. No mega-menu. A purple chat bubble shows, and the Odoo cookie bar reads "We use cookies to provide you a better user experience on this website." with "Only essentials" and "I agree".
- **Home first viewport:** A full-bleed carousel with five bars and round arrows. The slide reads "iPhone 18 Series Collection" with a white "More Details" button over a monochrome studio shot of phone cases on black rocks.
- **Home section order:** (1) Hero carousel. (2) "CATEGORIES" with "All Products ›": an icon carousel on a mint panel (Charger & Cable, Powerbank, Holder & Mount, Hub & Dock, Self-Care, Grooming, Smartwatch, Lifestyle). (3) "SMART GADGETS" / "For a Simpler Life": three cards with green category pills. (4) "Latest Product" with "See all →": a 2x3 grid carousel. (5) Tabs "Power Bank / Cooling Fan / Power Station", for example "Built-In Kickstand / Everest 10000mAh Power Bank" with "More Details" and "Related Products". (6) "Smart Appliances & Lifestyle" with "See More ›": a 2x2 list grid. (7) "Portable Fan": six tall cards. (8) Promo slider "Green Lion MagSafe Crystal Clear Case for iPhone 18 Pro / 18 Pro Max - Clear" with "DISCOVER MORE →". (9) "POWER HUB & DOCK": 2x3. (10) "SMART WATCHES". (11) "LATEST BLOGS": three cards. (12) "Bulk Orders, Better Benefits" banner. (13) Footer, readable on mobile only: "QUICK ACCESS", "COMPANY", "TERMS & CONDITION" (including "24 Months Warranty", "Warranty Claim", "TDRA Certificate"), "GET IN TOUCH".
- **Product card:** A white rounded card on a dark-green gradient band, with a small image. The bold two-line title is cut off with an ellipsis, for example "Green Lion Florenza Woven Fabric MagSafe Case for...". Then the glyph price "59.00" and a dark-green square cart icon button. The list-grid variant adds "SKU: GN4GLTCONNWH" and "GTIN: 9904907209492". Fan cards show a title and a "View Product" outline pill. No stars, badges or strike-through prices were seen. Hover state unknown.
- **Category navigation:** "Shop" in the flat nav, the home icon carousel, and "See More ›" / "View All Products ›" on each section. No device picker.
- **PDP layout:** Not captured (Cloudflare).
- **Colour and type character:** Heebo on body and h1. The facts button is the skip link ("Noto Sans Arabic", background #0f5132, 0px radius). That green is the Odoo primary and matches the visible cart buttons. White body, header text #212529. Grounds are white, with mint panels and dark-green gradient bands. Section titles are uppercase with a thin rule. Studio cut-outs throughout; the hero is monochrome.
- **Mobile:** Logo left, cart in a circle and hamburger right. There is no search icon in the mobile header. Grids become one-column carousels with round grey arrows. The footer is a set of link lists.

## Porodo (porodo.net)

- **Platform, market, language, currency:** Odoo. Title "Porodo | Choose the Best!", lang en-US, ltr. A flag with "EN ˅" shows, and "AR" and "EN" exist in the DOM, so Arabic is offered. No price was visible, so the currency was not observed.
- **Header and nav:** White header with the orange wordmark left. Nav "Products ˅", "Porodo Brands", "Become Distributor", "Support", "Blogs". On the right are flag with "EN ˅", search, a wishlist heart (count 0), cart (count 0) and account. DOM children:
  - **Brands:** "Porodo Blue", "Soundtec", "Porodo Lifestyle", "Porodo Gaming".
  - **Support:** "Order Status", "Shipping & Returns", "Warranty", "User Manuals".
  - **Categories:** "Cable, Charger, Adapter", "Keyboard & Mouse", "Earbuds & Headphone", "Holders & Stand", "Microphone", "Home Appliance".
  - A purple chat bubble and the Odoo cookie bar (orange outline buttons) also show.
- **Home first viewport:** A full-bleed carousel with five bars and arrows. The slide reads "EXPLORE PORODO TRACKFIT SERIES" in dark orange capitals with an orange "Check Now" button, over a studio shot of smart bands on beige plinths. The "Shop by Category" heading and a peach gradient panel start at the fold edge.
- **Home section order:** Unresolved beyond "Shop by Category"; see Gaps.
- **Product card:** Not captured.
- **Category navigation:** The "Products" dropdown (categories above), a "Shop by Category" block whose content was not captured, and "Products" in the mobile bottom bar.
- **PDP layout:** Not captured (Cloudflare).
- **Colour and type character:** DM Sans throughout (facts reads "DM sans"). White body, header text #212529. Orange #fe5000 comes from the skip link, which uses the Odoo primary. It matches the "Check Now" button (sampled #fe5000), the logo and the cookie buttons. The 6px radius comes from the same element. The hero uses warm neutral studio photography.
- **Mobile:** Logo left, search and hamburger right. A fixed bottom tab bar holds "Home" (active, in orange), "Products", "Cart" (0) and "Log in". The hero text is centred above the image.

## Powerology (powerology.me)

- **Platform, market, language, currency:** Odoo. Prices look like "AED 139.00", with the currency code first and a non-breaking space. Title "Powerology | The Power Expert & Consumer Electronics", lang en-US, ltr. A globe with "EN ˅" shows, and "AR" and "EN" exist in the DOM, so Arabic is offered. The footer reads "POWERED BY TEQTRONIX" and gives the same Richmond Hill, ON address as Green Lion. It links "TDRA Certificate" and "Catalogue".
- **Header and nav:** White header with the logo left. A flat nav holds "Home", "Shop", "Become a Distributor", "About", "Blogs". On the right are the globe with "EN ˅", search, a wishlist heart (0) and account. A purple chat bubble and the Odoo cookie bar also show.
- **Home first viewport:** A full-bleed carousel with six bars and square arrows. On desktop the slide is a render of a 70W charger between two laptops on a dark ring-light ground, a large "70W" graphic, and the caption "70W Power Anywhere You Land", with no CTA in view. On mobile the slide reads "Mondial 70W GaN Travel Charger" with "Shop Now".
- **Home section order:** (1) Hero carousel. (2) "Shop by Category": a carousel of grey tiles (Audio, Lifestyle, Smart Camera, Holders and Stands, Chargers and Cables, "Monitors, Projectors & TV"). (3) "Latest Products" with "See all →": four cards visible on a light-blue panel. (4) Two feature cards, for example "Powerology Pater II Portable Power Station 700W", each with five spec bullets and "More Details". (5) "Trending Now" carousel, four visible. (6) Dark band with "SHOP NOW". (7) "Stay Powered!": a 2x2 list grid. (8) "Bulk Purchase Inquiries" banner with a cyan "Discover more". (9) "Check out what's new": three blog cards. (10) Navy footer, including "Check My Warranty Request", "Extended Warranty" and "Download App" with "Click or Scan".
- **Product card:** A white card with the image on top and a bold two-line title cut off with an ellipsis, for example "Powerology Mondial 70W GaN III Universal Travel Charger - Blac...". Then a bold "AED 149.00". No CTA, stars, badges or strike-through prices on cards. The list-grid variant shows "SKU: PWGC300GY" and "GTIN: 9904907012382". Hover state unknown.
- **Category navigation:** "Shop" in the flat nav, the home tile carousel, and "See all →" on each shelf. No device picker.
- **PDP layout:** Not captured (Cloudflare).
- **Colour and type character:** Red Hat Text throughout. White body, header text #212529. Cyan #00c2f3 comes from the skip link (Odoo primary) and matches the "Discover more" pill and the logo. Navy #0e273c (sampled) on the footer and the "More Details" pills. Light-blue gradient panels (#a3d1ff, sampled). Product renders sit on dark or light-blue grounds.
- **Mobile:** Logo left, search and hamburger right. Category tiles form a two-column grid inside a carousel. Feature cards stack, and "Trending Now" becomes a two-row carousel.

## UGREEN (ugreen.com home, us.ugreen.com PDP)

- **Platform, market, language, currency:** Shopify on both domains. The home page is the global brand site: title "UGREEN Official Site", lang en, ltr, footer "United States (English)". A geo prompt in Arabic tops the page: "هذا الموقع لا يتطابق مع موقعك الحالي. هل ترغب في تغيير موقعك؟", with buttons "التحويل" and "يلغي". The PDP is on us.ugreen.com in USD ("$79.99", "$59.99"). No Arabic storefront was observed.
- **Header and nav:**
  - **Home:** a black bar "UGREEN x New England Patriots", then a transparent header over the hero. The logo sits left, with nav "NAS", "Charging", "Data & Accessories", "About", "Support", "Community". On the right are search and a black "Store ˅" pill; the DOM lists "Electronics Store" and "NAS Store" under it. The home page has no cart.
  - **Store (PDP):** **Top bars:** a black promo bar "Power Up Your Autumn | save up to 50%" with "Save Now ›". Then a bar reading "UGREEN AIoT", "30-Day Worry-Free Trial | 2-Year Product Warranty", and a flag with "United States / English". **Nav:** "[fire emoji] Big Deal Days", "UGREEN x Honkai", "Products", "UGREEN Series", "Shop by Device", "Explore", then search, account and cart. **DOM children:** "Docking Stations", "USB Hubs", "Chargers", "High-Power Charging", "Wireless Chargers", "Car Chargers", "USB-C Cables", "UGREEN MagFlow Series", "UGREEN Nexode Pro", and "Shop by Device" > "iPhone Chargers".
- **Home first viewport:** The geo prompt, the announcement bar and the transparent header sit over a full-bleed lifestyle video still of a hand holding the MagFlow puck. Centred text reads "UGREEN MagFlow", "Stay Cool. Stay Fast." with a white outline pill "Learn More". A segmented progress bar has seven to eight segments. A cookie modal offers "Preferences", "Accept" and "Decline".
- **Home section order:** (1) Hero carousel. (2) "Discover Our Signature Series": two large tiles (UGREEN Nexode "Powerful | Reliable | Industry-Leading", UGREEN NASync) and three small (Revodok, MagFlow, Uno), each with a "Learn More" outline pill. (3) Lifestyle image row. (4) Category carousel; only "Chargers" rendered. (5) Tabs "HOME / OFFICE" with "Discover Everyday Essentials ›". (6) Stats: "2100+ Patents", "180+ Countries", "73 Product Design Awards", "300M+ Global Users". (7) Forest image or video. (8) "Media Voices". (9) Newsroom with "View Our Newsroom ›": tag chips "Brand", "Product Launches", "Retail Expansions", "Trade Shows", plus dates. (10) Black footer: icon row "Where to Buy", "Support", "About UGREEN", "Contact Us", then the newsletter "Smart Tech for Smarter Living".
- **Product card:** The home page has no priced cards; it shows series tiles only. On the PDP, the "Recommended Purchase" card has a grey image area with a green "20% OFF" ribbon, a two-line title, yellow stars "(1)", "$39.99" with a strike-through price, and a green "Add to Cart" bar. Hover state unknown.
- **Category navigation:** On the home page, series and product lines in the nav plus the "HOME / OFFICE" scenario tabs. In the store, "Products", "UGREEN Series" and "Shop by Device" (DOM only).
- **PDP layout:** UGREEN Uno 100W 4-Port Charger.
  - **Breadcrumb:** "Home › UGREEN Uno 100W 4-Port Charger".
  - **Gallery:** a single-image carousel with grey round arrows, a green "25% OFF" ribbon and a thumbnail strip. On mobile the strip ends in a "4+" tile.
  - **Buy box, top to bottom:** (1) Chip "[fire emoji] Big Deal Days | Up to 50% Off", the H1, and the subtitle "Add a splash of fun to your charging." (2) Yellow stars "(85)", then "$79.99" with a green outline chip "Save 25%". (3) "Key Benefits" with five bullets and "Learn More ›". (4) Coupon banner "Save 25% Code: UL45514" with "Copy". (5) Quantity, then "Add to Cart" (green outline) and "Buy now" (green fill). Mobile adds "Buy with Shop". Then "More payment options". (6) "Worry-Free Delivery® available with seel". (7) "Essential Worker & Senior Discounts" ("Unlock Summer Savings: Save an extra 5%"). (8) Icons "Fast & Free Shipping", "2-Year Product Warranty", "30-Day Returns". (9) "Other Recommendations": an add-on checkbox for "UGREEN 2-in-1 Qi2 Magnetic Foldable Fast Charging Station $39.99 $49.99".
  - **Sticky bar:** appears on desktop and in the mobile full-page capture. It shows a thumbnail, the title, "Expected to be delivered within 5 days", "$59.99" with a strike-through "$79.99" and "Save 25%", and a black "Add To Cart".
  - **Sticky section nav:** "Overview / Specs / Reviews / Recommended".
  - **Overview:** modules "100W Fast Charging" (30 Min, 0-43%, Macbook Pro 16") and "GaNInfinity Chip". Then "Charging Guide UGREEN Uno 100w Charger", a per-port wattage diagram (45W / 30W / 7.5W), and an SEO paragraph.
  - **"Specs":** a two-column table with SKU 45514, Total USB Ports "3*USB-C、1*USB-A", Input, Total Output "100W Max", "Charge Agreement" (protocol list per port) and Dimensions.
  - **"Reviews":** "4.86 out of 5", "Based on 85 reviews", a histogram, "Customer photos & videos", a transparency badge "100.0", search, "Most Recent", "Verified by Shop", "Review written in Shop App", and a pager 1 2 3.
  - **Not seen:** a compatibility list or a what's-in-the-box block.
- **Colour and type character:** Metropolis on the PDP for body, h1 and button. The home body stack lists Metropolis then monospace fallbacks. The facts home button (Open Sans, 2px) is the geo-prompt button. The PDP "Add to Cart" reads white background, #009632 text, 8px radius. The home page uses white and #f7f9f8 grounds, a black footer, and outline pills over imagery. The store uses green #007934 on "Buy now", #009632 on chips, yellow #fabb1a on stars and #338642 on ribbons (all sampled). Home photography is lifestyle video stills and interiors. PDP imagery is dark tech-render infographics.
- **Mobile:** On the home page, logo left with search and hamburger right; the geo prompt and the cookie modal stack over the fold. On the PDP the header holds search, account, cart and hamburger, and the gallery comes first. The sticky bar shows in the full-page capture.

## Cross-site comparison

Mega-menu key: "DOM" means nested links exist in the DOM but the menu was never opened. "flat" means a single-level nav. "?" means unknown.

| Site | Platform | Body font | Display font | Accent colour | Button radius | Card background | Price format | Badge style | Mega-menu | Arabic |
|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|
| Anker | Shopify | MontForAnker | MontForAnker | #00befa CTA and stars; #ff9900 save chip | square (screens) | grey tile #eaeaec | `$29.99` then strike `$39.99` | orange "Save $10.00" chip; "$10 OFF" flag | ? | N |
| Baseus | Shopify | DM Sans | DM Sans | yellow #fceb55; CTA #282828 | 30px pill | pastel gradient | home none; PDP `$59.99 USD` | "SOLD OUT" chip | ? | N |
| Bavin | Shopify | Jost | DM Sans (h1) | lime #94d40b | 7px | page grey #f4f4f4 | `From ₱1,299.00 PHP`, strike line above | lime "Sale" pill | Y (DOM) | N |
| Belkin | other (no generator) | Suisse Intl Regular | Suisse Intl Medium/SemiBold | lime #6ffb38; yellow #f4d771; red #ab2117 | pill (screens) | white | strike `$99.99` then red `$89.99` | red "Sale" rectangle; pink "New" | Y (DOM) | N |
| Green Lion | Odoo | Heebo | Heebo | dark green #0f5132 | about 8px and pills (screens) | white rounded card on green band | glyph then `59.00` | green category pill | N (flat) | Y (switcher) |
| Porodo | Odoo | DM Sans | DM Sans | orange #fe5000 | 6px | not captured | not observed | not captured | Y (DOM) | Y (switcher) |
| Powerology | Odoo | Red Hat Text | Red Hat Text | cyan #00c2f3; navy #0e273c | pills (screens) | white | `AED 149.00` | none seen | N (flat) | Y (switcher) |
| UGREEN | Shopify | Metropolis | Metropolis | green #007934 / #009632 | 8px (PDP); outline pills (home) | grey image area (PDP) | `$79.99` + "Save 25%"; sticky `$59.99` with strike | green "25% OFF" ribbon | Y (DOM, store) | geo prompt only |

## Recurring patterns (4 or more sites)

- **Region or language switcher visible:** all 8. Anker and Belkin show it in the footer only.
- **Category row in the upper home sections:** Anker, Baseus, Bavin, Belkin, Green Lion, Porodo, Powerology (7). It sits directly after the hero on Baseus, Bavin, Green Lion, Porodo and Powerology. Anker has it fifth and Belkin after the press strip. UGREEN puts series tiles first.
- **Multi-slide hero with pager:** Baseus, Green Lion, Porodo, Powerology, UGREEN (5). Belkin and Bavin use a single hero. Anker stacks banners and only its third banner has a pager.
- **Floating chat launcher bottom right:** Anker, Baseus, Bavin, Green Lion, Porodo, Powerology (6).
- **Blog or news block on home:** Anker, Baseus, Belkin, Green Lion, Powerology, UGREEN (6).
- **Wattage inside the product title, not as a separate attribute:**
  - Cards: Anker, Belkin, Bavin, Powerology. The Baseus card descriptor reads "Fast Charger 100W".
  - PDPs: all five H1s include the wattage.
- **Strike-through compare price:** Anker, Baseus (bundle), Bavin, Belkin, UGREEN (5).
- **Trust row for shipping, returns and warranty:** Anker, Baseus, Bavin, Belkin, UGREEN (5). On Bavin and Belkin it appears on the PDP only.
- **B2B or distributor entry:** Anker "Corporate Purchase", Belkin "Business", Green Lion "Bulk Purchase", Porodo "Become Distributor", Powerology "Become a Distributor" and "Bulk Purchase Inquiries" (5).
- **Cookie consent on first load:** Belkin, Green Lion, Porodo, Powerology, UGREEN (5).
- **Dark footer:** Anker, Baseus, Belkin, Powerology, UGREEN (5).
- **Second instant-buy button beside Add to Cart:** Anker "Buy Now", Belkin "Buy Now", UGREEN "Buy now", Bavin "Pay with PayPal" (4 of the 5 PDPs).
- **Series or sub-brand as a nav entry:** Anker "Series", Baseus "Dark Cherry Series", Porodo "Porodo Brands", UGREEN "UGREEN Series" (4).
- **Platforms:** Shopify on 4 (Anker, Baseus, Bavin, UGREEN). Odoo on 3 (Green Lion, Porodo, Powerology). Belkin is neither.

## Borrow (mechanics that serve the shopper)

- **Device picker in the nav:** Belkin "Choose Your Device" lists exact models (iPhone 18 to 15, Samsung S26 to S24, Pixel 11, Switch 2). UGREEN has "Shop by Device" > "iPhone Chargers". Both are DOM only.
- **Charger categories by connector and wattage band:** Bavin "Type-C / 20W-33W Charger" and "Type-C / 36W-45W Charger", plus use-case groups "Laptop Charging" and "Built-in Cable".
- **Wattage as the variant picker:** Belkin "Model" chips "45W Standalone" / "67W Standalone".
- **Comparison table of sibling chargers:** Anker, with Total Output, Single-Port Output, Ports and Connections, Weight and Safety Feature.
- **Per-port output guide:** UGREEN "Charging Guide" diagram (45W / 30W / 7.5W). Baseus tabs "Single-Port Use / Dual-Port Use / Triple-Port Use" and the FAQ "What's the max wattage for each port?".
- **Device-specific compatibility copy:**
  - Anker "Charging Tips" names Samsung models "limited to 27W".
  - Belkin's spec row reads "Fast charge an iPhone 17 Pro Max from 0-50% in 23 minutes", and the PDP has a "Compatibility" tab.
- **What's in the box:** Belkin has a "What's in the Box" tab and the spec icon "USB-C Cable x1 USB-C Port x1". Anker's note says "This charger does not include a charging cable."
- **Electrical spec lines:** Anker Output "5V⎓3A / 9V⎓3A / 15V⎓3A / 20V⎓2.25A". UGREEN "Charge Agreement" per port. Bavin "Max. Charging: 48V / 5A / 240W".
- **Sticky add-to-cart bar with price and a delivery line:** Anker shows a pre-order ship window. UGREEN shows "Expected to be delivered within 5 days".
- **Sticky in-page section nav on the PDP:** Anker and UGREEN.
- **Stock and availability lines:** Bavin "81 in stock". Baseus "Coming soon: Estimated to arrive October 31." with "NOTIFY ME WHEN AVAILABLE".
- **Shipping thresholds and dispatch time on the PDP:** Belkin, with $75+ and $125+ tiers and "ships within 1-2 business days".
- **Warranty terms on the PDP:** Belkin "2-Year Warranty" and "$2,500 Connected Equipment Warranty". UGREEN "2-Year Product Warranty".
- **Warranty self-service links:** Green Lion "Warranty Claim", Powerology "Check My Warranty Request".
- **Reviews you can filter:**
  - Belkin: histogram row filters, sub-ratings, search and "Response from Belkin".
  - UGREEN: "Customer photos & videos" and "Verified by Shop".
- **Add-on checkbox with a running total:** Baseus "Buy More Save More", UGREEN "Other Recommendations".
- **Copyable coupon code in the buy box:** Anker "Copy Code", UGREEN "Code: UL45514" with "Copy".
- **Mobile bottom tab bar:** Porodo "Home / Products / Cart / Log in".
- **Manuals and downloads:** Anker PDP "Downloads", Porodo "User Manuals".
- **AR/EN toggle in the header:** Green Lion, Porodo, Powerology.
- **SKU and GTIN in view:** SKU on the Belkin and Baseus PDPs and in the UGREEN specs. SKU and GTIN on Green Lion and Powerology list cards.

## Avoid (generic or friction, with evidence)

- **Full-fold first-visit modals on both viewports:**
  - Anker: email sign-up modal.
  - Baseus: spin wheel on home and PDP. It hides the desktop PDP price and the mobile header.
- **Three layers before the hero:** UGREEN shows the Arabic geo prompt, the announcement bar and the cookie modal.
- **Hero copy baked into the image:** Bavin "BAVIN BY YOUR SIDE ..." and "SHOP NOW!". It is tiny at 390 px and cannot be selected as text.
- **Card titles four to seven lines long:** Bavin.
- **Home product cards without a price:** Baseus "Baseus Essentials".
- **Buy box and sticky bar show different prices:** UGREEN shows "$79.99" with "Save 25%" in the buy box but "$59.99" with a strike-through "$79.99" in the sticky bar.
- **Add to Cart pushed far down:** Anker places the version choice, three membership options and a summary before Add to Cart. On mobile, the sticky bar is the only buy button near the fold.
- **Breadcrumb only at the bottom of the PDP:** Anker.
- **Two language selectors in the first 92 px:** Bavin, one in the header and one in the announcement bar.
- **Copy errors in buttons and bullets:** Baseus "SUBCRIBE&SPIN NOW", "Interative Smart Display", "Enyoyable Peeko".
- **Shared template shell:**
  - Green Lion and Powerology share the footer structure, "Powered by TEQTRONIX", the Richmond Hill address, and the "TDRA Certificate" and "Catalogue" links.
  - All three Odoo sites share the cookie-bar wording and the purple chat bubble.
- **No search in the mobile header:** Green Lion.
- **Font data, recorded without a verdict:**
  - DM Sans appears on three sites: Baseus (all text), Porodo (all text) and Bavin (h1 only).
  - The others use Jost (Bavin body), Heebo (Green Lion), Red Hat Text (Powerology), Suisse Intl (Belkin), MontForAnker (Anker) and Metropolis (UGREEN).

## Gaps (not verified)

- **Hover states:** unknown on all eight sites.
- **PDPs:** porodo, greenlion and powerology were not captured because of Cloudflare. The powerology log line says "ok" but no files exist.
- **No listing or category pages captured:**
  - **Unknown:** filters, sort, grid density, and the filter entry on mobile.
- **Porodo:** both full-page captures are blank below the first band. The desktop full page is 2880 px wide with content only in the top-left 1440x900 area. facts pageHeight is 900. Home section order and cards are unresolved.
- **Bavin:** below-fold home sections and the lower PDP rendered almost invisible because scroll-reveal never fired. Headings were read after boosting contrast, but card counts and badge text remain unread.
- **Lazy media did not render in full-page captures. These are blank areas, not whitespace:**
  - Anker: home blocks and PDP Overview modules.
  - Baseus: Essentials images, creators, the "Featured in" logos.
  - Belkin: shelf images and two PDP carousels.
  - Green Lion: fan images, "SMART WATCHES", and the desktop footer.
  - Powerology: "Trending Now" and the dark band.
  - UGREEN: the category carousel and "Media Voices".
- **Overlays covering content:**
  - Anker's modal hides the hero headline.
  - Baseus's modal hides the desktop PDP price and the mobile header.
  - UGREEN shows the geo prompt and a cookie modal.
  - Belkin's cookie banner covers the bottom of the mobile fold, so a sticky bar there is unverified.
  - The Odoo cookie bars on the three Odoo sites.
- **Region prompt:** UGREEN's Arabic prompt suggests IP-based detection. The cause was not verified.
- **Menus never opened:** mega-menu contents come only from DOM link lists. Anker's facts nav list is its footer.
- **Sticky mobile bars:** observed only on Anker (fold) and UGREEN (full page). Scroll-triggered behaviour elsewhere is unknown.
- **Belkin:** the bordered box under the price did not render, so its content is unknown. The "What's in the Box" and "Compatibility" tab contents were not captured.
- **Baseus:** the PDP was sold out, so the in-stock buy box is unknown.
- **facts.json caveats:**
  - Button fields measured non-CTA elements on six readings: an Anker top-bar link, the Belkin region selector, the UGREEN geo button, and skip links on the three Odoo sites.
  - The h1 differs from the visible headline on Anker, Baseus, Belkin and Green Lion.
  - priceCount and productLinkCount read 0 for Green Lion and Powerology. The price regex misses the dirham-style glyph and Odoo's `/shop/` URLs.
  - Green Lion's currency glyph was read from the screenshots only.
