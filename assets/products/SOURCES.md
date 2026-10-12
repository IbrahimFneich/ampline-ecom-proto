# Image sources

Manufacturer product shots for the third-party SKUs, fetched from each maker’s own product page with
`tools/fetch-images.cjs`, trimmed and re-encoded to WebP by `tools/optimize-images.cjs`, and wired into
`content/products.json` by `tools/sync-images.py`. The 14 Ampline SKUs are a fictional house brand with no
real-world photo: they carry no image and draw their line art instead.

Licensing for client use is the client’s to clear. These are the manufacturers’ own images, shown here to
demonstrate the prototype, not cleared for commercial use.

## Fetched 2026-10-12

20 files across 12 products. Every row below was
checked by eye against the product, and against the generation the page actually sells, before it was kept.

| File | Product page | Image |
|:--|:--|:--|
| `apple-homepod-mini-2.webp` | https://www.apple.com/shop/buy-homepod/homepod-mini | https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/homepod-mini-select-202210?wid=1080&hei=880&fmt=jpeg&qlt=90&.v=K2c3bEwyaWVDeDZkdHpLbHkwcGVSam9RVGpuTmx0T1h4bDIxVHQ5RDRIRkJPeDF2ZVVaSE5jWEZxb1JBMHNSQkJkRlpCNVhYU3AwTldRQldlSnpRa0NKOUJGbUVtUkw5S2dEY1BnYXVWR2c |
| `apple-ipad-air-11-m2-128gb-2.webp` | https://www.apple.com/shop/buy-ipad/ipad-air | https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-model-unselect-gallery-1-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=azZtTlRzREZ3NzhWaHRDQW5YeUV0UEs0TkxxOFYxN2dtSHJMdW5sNDFVK3MxV2hYTmJkSS9ZdDBsUEkxd0lnTHZIZkplbmJiNHg2c1VDS2NVdjhMUVBXdlJRYjdSZWJHVUh4aFVDb0hhVVhjOG04VWNidngvZmprWTAxVyttRDQ&traceId=1 |
| `apple-ipad-air-11-m2-128gb-3.webp` | https://www.apple.com/shop/buy-ipad/ipad-air | https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-model-unselect-gallery-2-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=azZtTlRzREZ3NzhWaHRDQW5YeUV0UEs0TkxxOFYxN2dtSHJMdW5sNDFVK1p4MGdFOVMzRG8xZXVzVEN1YWdzY3ZIZkplbmJiNHg2c1VDS2NVdjhMUVBXdlJRYjdSZWJHVUh4aFVDb0hhVVVNWGMvLzQrYStPQUR0bS85cnl5dm4&traceId=1 |
| `apple-ipad-pro-11-m4-256gb-2.webp` | https://www.apple.com/shop/buy-ipad/ipad-pro | https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-1-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=cXN0QTVTNDBtbGIzcy91THBPRThnNE5sSFgwakNWNmlhZ2d5NGpHdllWY09WV3R2ZHdZMXRzTjZIcWdMTlg4eVM1L0VuR3dWZGNjaVhFSWhJU255OFgwS0NUL3lieGZmUG5IUUtTQUVSNDl3SDJoYXNTQWlYYStqYlk3Wjl6eks&traceId=1 |
| `apple-iphone-16-128gb-2.webp` | https://www.apple.com/shop/buy-iphone/iphone-16 | https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch_GEO_US?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4OUh1cU00ZU5qL3V3QjQwYlZSSzMvRzBoUVhuTWlrY2hIK090ZGZZbk9HeEd5aFM4QSthSG1nSUl6WXJQME1SZ2tRWGJsdWFXSEUxVHJQU1Yvbi9pZVR1YmZQMXFXa2w0U3RUanhYSTV4Z29R&traceId=1 |
| `apple-iphone-16-128gb-3.webp` | https://www.apple.com/shop/buy-iphone/iphone-16 | https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch_AV1?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4L2RJbmltQWhGZkQyVGNjT3IyemNOZWd2S3NaRzcrU0dmYjNHTUFiMnlsWGEwekI5ZWpRa0o2WWdVYzdzTUdBdFYrZzgzK3BvTTNyTSs2NGJET0s5ZHQ&traceId=1 |
| `logitech-g435-lightspeed-2.webp` | https://www.logitechg.com/en-us/shop/p/g435-wireless-bluetooth-gaming-headset | https://resource.logitechg.com/w_1200,h_1200,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g435/2025/gallery/g435-3qtr-back-left-angle-black-gallery-4.png |
| `logitech-g435-lightspeed-3.webp` | https://www.logitechg.com/en-us/shop/p/g435-wireless-bluetooth-gaming-headset | https://resource.logitechg.com/w_1200,h_1200,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g435/2025/gallery/g435-in-the-box-black-gallery-5.png |
| `nintendo-switch-oled-2.webp` | https://www.nintendo.com/us/store/products/nintendo-switch-oled-model-white-set/ | https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.5/c_scale,w_700/ncom/en_US/products/hardware/nintendo-switch-oled-model-white-set/115461-switch-oled-white-console-front-1200x675 |
| `sony-dualsense-wireless-controller-2.webp` | https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/ | https://gmedia.playstation.com/is/image/SIEPDC/dualsense-adaptive-triggers-image-block-01-en-30aug23?$1600px--t$ |
| `tp-link-archer-ax55-2.webp` | https://www.tp-link.com/ae/home-networking/wifi-router/archer-ax55/ | https://static.tp-link.com/upload/image-line/Overview_Archer_AX55_02_large_20210816012609l.jpg |
| `tp-link-archer-ax55-3.webp` | https://www.tp-link.com/ae/home-networking/wifi-router/archer-ax55/ | https://static.tp-link.com/upload/image-line/Archer_AX55(US)1.0_B_large_20220318035004t.png |
| `tp-link-archer-be230-2.webp` | https://www.tp-link.com/ae/home-networking/wifi-router/archer-be230/ | https://static.tp-link.com/upload/image-line/Archer_BE230_US_1.0_02_large_20231212120717w.jpg |
| `tp-link-archer-be230-3.webp` | https://www.tp-link.com/ae/home-networking/wifi-router/archer-be230/ | https://static.tp-link.com/upload/image-line/Archer_BE230_US_1.0_03_large_20231212120731l.jpg |
| `tp-link-deco-x50-3-pack-2.webp` | https://www.tp-link.com/ae/home-networking/deco/deco-x50/ | https://static.tp-link.com/upload/image-line/Deco_X50(1-pack)_Overview_01_large_20211225093734f.jpg |
| `tp-link-deco-x50-3-pack-3.webp` | https://www.tp-link.com/ae/home-networking/deco/deco-x50/ | https://static.tp-link.com/upload/image-line/Deco_X50_Overview_02_large_20211225094042l.jpg |
| `tp-link-m7350-4g-mobile-wifi-2.webp` | https://www.tp-link.com/ae/home-networking/mifi/m7350/ | https://static.tp-link.com/M7350UN4002large_1622770946080l.jpg |
| `tp-link-m7350-4g-mobile-wifi-3.webp` | https://www.tp-link.com/ae/home-networking/mifi/m7350/ | https://static.tp-link.com/M7350UN4003large_16227709464844.jpg |
| `tp-link-re605x-2.webp` | https://www.tp-link.com/ae/home-networking/range-extender/re605x/ | https://static.tp-link.com/RE605X-02_large_1597889277472g.jpg |
| `tp-link-re605x-3.webp` | https://www.tp-link.com/ae/home-networking/range-extender/re605x/ | https://static.tp-link.com/RE605X-03_large_1597889286448c.jpg |

## Fetched but not kept

Each line is a candidate the fetch downloaded and the review turned away, named by the image it came from:

- samsung-galaxy-s25-256gb, RF90F29AECR_01_Charcoal_Glass_Stainless_Steel_SCOM.jpg from https://www.samsung.com/us/smartphones/galaxy-s25/buy/: wrong product: a Samsung refrigerator
- samsung-galaxy-s25-256gb, WD90F53AVB_01_Brushed_Black_SCOM.jpg from https://www.samsung.com/us/smartphones/galaxy-s25/buy/: wrong product: a Samsung washing machine
- samsung-galaxy-s25-ultra-512gb, RF90F29AECR_01_Charcoal_Glass_Stainless_Steel_SCOM.jpg from https://www.samsung.com/us/smartphones/galaxy-s25-ultra/buy/: wrong product: a Samsung refrigerator
- samsung-galaxy-s25-ultra-512gb, WD90F53AVB_01_Brushed_Black_SCOM.jpg from https://www.samsung.com/us/smartphones/galaxy-s25-ultra/buy/: wrong product: a Samsung washing machine
- apple-macbook-air-13-m3, macbook-air-size-select-202601-13inch_AV1 from https://www.apple.com/shop/buy-mac/macbook-air/13-inch: subject cut off at the frame edge
- apple-macbook-pro-16-m4-pro, mac-macbook-pro-size-select-202601-16inch_AV1 from https://www.apple.com/shop/buy-mac/macbook-pro/16-inch: subject cut off at the frame edge
- apple-ipad-10th-gen-64gb, personal-setup-shop-shared-202511_GEO_US from https://www.apple.com/shop/buy-ipad/ipad: line-art icon strip, not a product shot
- apple-ipad-pro-11-m4-256gb, ipad-pro-model-select-gallery-2-202405 from https://www.apple.com/shop/buy-ipad/ipad-pro: near-duplicate of -2 and cut off at the edge
- apple-watch-series-10-42mm, personal-setup-shop-shared-202511_GEO_US from https://www.apple.com/shop/buy-watch/apple-watch: line-art icon strip, not a product shot
- apple-watch-se-2nd-gen-40mm, personal-setup-shop-shared-202511_GEO_US from https://www.apple.com/shop/buy-watch/apple-watch-se: line-art icon strip, not a product shot
- sony-playstation-5-slim-1tb, ps5-overview-breath-stunning-games-icon-01-en-18jun24 from https://www.playstation.com/en-us/ps5/: placeholder icon, not a photograph
- sony-playstation-5-slim-1tb, ps5-overview-lightning-speed-icon-01-en-18jun24 from https://www.playstation.com/en-us/ps5/: placeholder logo, not a photograph
- nintendo-switch-oled, 115461-switch-oled-white-boxart-1200x675 from https://www.nintendo.com/us/store/products/nintendo-switch-oled-model-white-set/: retail box art with text baked in
- apple-homepod-mini, homepod-apple-music-202412 from https://www.apple.com/shop/buy-homepod/homepod-mini: music UI collage with album art and text baked in
- apple-macbook-air-13-m3, macbook-air-size-select-202601-13inch from https://www.apple.com/shop/buy-mac/macbook-air/13-inch: generic Shop MacBook Air page; asset stamped 202601 and shows a Sky Blue lid the M3 never had
- apple-macbook-pro-16-m4-pro, mac-macbook-pro-size-select-202601-16inch from https://www.apple.com/shop/buy-mac/macbook-pro/16-inch: generic Shop MacBook Pro page; asset stamped 202601, a later generation
- apple-ipad-10th-gen-64gb, ipad-model-unselect-gallery-1-202503 from https://www.apple.com/shop/buy-ipad/ipad: generic Buy iPad page; asset stamped 202503, the 11th generation
- apple-airpods-pro-2-usb-c, og__c0ceegchesom_overview.png from https://www.apple.com/airpods-pro/: page now sells AirPods Pro 3 (h1 "AirPods Pro 3"); asset stamped 202609
- apple-watch-series-10-42mm, s12-case-unselect-gallery-1-202609 from https://www.apple.com/shop/buy-watch/apple-watch: page now sells Series 12 (h1 "Shop Apple Watch Series 12"); asset stamped 202609
- apple-watch-se-2nd-gen-40mm, se-case-unselect-gallery-1-202609 from https://www.apple.com/shop/buy-watch/apple-watch-se: page now sells SE 3 (h1 "Buy Apple Watch SE 3"); asset stamped 202609
- samsung-galaxy-s25-256gb, SDSAC-9641-S25FE_Global_Color_Group_KV_PC-800x600.jpg from https://www.samsung.com/us/smartphones/galaxy-s25/buy/: colour range with the colour names set as text in the image
- samsung-galaxy-s25-ultra-512gb, SDSAC-8805-S25Ultra-GalleryUpdate-Group-800x600.jpg from https://www.samsung.com/us/smartphones/galaxy-s25-ultra/buy/: colour range with the finish names and a Galaxy AI mark set as text
- sony-playstation-5-slim-1tb, ps5-overview-breath-stunning-games-icon-01-en-18jun24 from https://www.playstation.com/en-us/ps5/: PlayStation placeholder icon, not a photograph
- sony-playstation-5-slim-1tb, ps5-overview-lightning-speed-icon-01-en-18jun24 from https://www.playstation.com/en-us/ps5/: PlayStation bolt logo, not a photograph
- samsung-galaxy-s25-256gb, us-galaxy-s25-fe-sm-s731-sm-s731uzwaxaa-548774453 from https://www.samsung.com/us/smartphones/galaxy-s25/buy/: the page sells the Galaxy S25 FE (h1 "Galaxy S25 FE") and the asset is us-galaxy-s25-fe-sm-s731: a different model
- sony-dualsense-wireless-controller, dualsense-haptic-feedback-image-block-01-en-30aug23 from https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/: feature render with the controller set in a blue splash; it reads as a scene, not a product on a clean ground

## Products that gained no new image, and why

A maker page that does not serve this exact model, a block, art under the size floor, or no clean shot.
None of these was worked around:

- `apple-iphone-15-128gb`: discontinued; Apple’s buy page 404s and /iphone/ is a category page
- `apple-iphone-16-silicone-case-magsafe`: Apple serves a cases category page, not this case’s own page
- `apple-smart-folio-ipad-air-11`: Apple serves an iPad accessories category page
- `apple-airpods-pro-2-usb-c`: apple.com/airpods-pro now sells AirPods Pro 3
- `apple-ipad-10th-gen-64gb`: Apple’s Buy iPad page sells the current generation
- `apple-macbook-air-13-m3`: Apple’s Shop MacBook Air page sells the current generation
- `apple-macbook-pro-16-m4-pro`: Apple’s Shop MacBook Pro page sells the current generation
- `apple-watch-series-10-42mm`: Apple’s watch page now sells Series 12
- `apple-watch-se-2nd-gen-40mm`: Apple’s SE page now sells SE 3
- `google-pixel-9-128gb`: store.google.com redirects to the region picker, then a category page
- `google-pixel-watch-3-41mm`: store.google.com redirects to the Pixel Watch 5 page
- `google-nest-mini-2nd-gen`: store.google.com redirects to the store home
- `lenovo-ideapad-slim-5-15`: lenovo.com redirects to a different IdeaPad model
- `lenovo-thinkpad-x1-carbon-gen-12`: lenovo.com redirects to a ThinkPad L13
- `samsung-galaxy-book4-15`: samsung.com redirects to the Galaxy Book5
- `samsung-galaxy-tab-s9-fe-128gb`: samsung.com redirects to the Tab S10 FE
- `samsung-galaxy-tab-a9-plus-64gb`: samsung.com redirects to the Tab A11+
- `samsung-galaxy-buds3`: samsung.com redirects to the Galaxy Buds4
- `samsung-galaxy-fit3`: samsung.com redirects to the Galaxy Watch8
- `samsung-galaxy-s25-clear-case`: samsung.com redirects to the accessories category
- `samsung-galaxy-a56-128gb`: the page served no image at 800 px or more on its long side
- `samsung-galaxy-watch7-40mm`: the page served no image at 800 px or more on its long side
- `sony-wh-1000xm5`: electronics.sony.com returns 403
- `sony-wf-1000xm5`: electronics.sony.com returns 403
- `sony-srs-xb100`: electronics.sony.com returns 403
- `sony-playstation-5-slim-1tb`: playstation.com served only placeholder and logo art for this model
- `logitech-g502-x`: logitechg.com returns 404 for this product
- `tp-link-tapo-p100-2-pack`: tapo.com serves its gallery at 590 px, under the 800 px floor
- `tp-link-tapo-c210`: tapo.com serves its gallery at 590 px, under the 800 px floor
- `tp-link-tapo-l530e`: tapo.com serves its gallery at 590 px, under the 800 px floor
- `samsung-galaxy-s25-256gb`: samsung.com’s S25 buy page now sells the S25 FE
- `samsung-galaxy-s25-ultra-512gb`: every candidate carrying the model token had its finish names set as text

The `-1` image of every third-party SKU predates this record. It was sourced the same way on 2026-10-11;
no per-file source URL was logged at the time and none is in the repository’s history.
