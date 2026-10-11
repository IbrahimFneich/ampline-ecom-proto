---
name: Ampline
description: Multi-category tech retailer that starts from what you own, drawn as a phone's charging lock screen in daylight.
colors:
  charge-green: "#17b867"
  charge-green-ink: "#0e7a47"
  charge-green-mid: "#6fd9a4"
  charge-green-pale: "#b6edd0"
  charge-green-soft: "#dcf5e7"
  caution-amber: "#e09a1c"
  caution-amber-ink: "#8a5a00"
  caution-amber-soft: "#fff0d2"
  daylight-ground: "#f4f6f8"
  screen-white: "#ffffff"
  lockscreen-ink: "#0b0d10"
  muted-slate: "#55606e"
  hairline: "#dce2e9"
  empty-track: "#e9edf1"
  off-grey: "#8e97a3"
  off-grey-soft: "#eef1f4"
  sleep-black: "#0b0d10"
  sleep-ink: "#c9d1d9"
  sleep-ink-dim: "#7d8794"
  sleep-line: "#1f252d"
typography:
  display:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.75rem, 1.1rem + 3.2vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
  figure-tile:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  figure-pdp:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontFeature: "tnum"
  price-big:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  body:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  body-small:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.3
  label:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.3
  admin-title:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  admin-table:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    fontFeature: "tnum"
  admin-meta:
    fontFamily: "Readex Pro, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
rounded:
  pill: "999px"
  xl: "28px"
  glyph: "22px"
  md: "18px"
  sm: "12px"
  seg: "8px"
  field: "10px"
  control: "6px"
  mini: "5px"
spacing:
  gutter: "clamp(20px, 4vw, 48px)"
  container: "1200px"
  section: "56px"
  section-desktop: "72px"
  tile-gap: "12px"
  tile-gap-wide: "16px"
  rail: "280px"
  rail-gap: "40px"
  admin-sidebar: "236px"
components:
  button-primary:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  button-primary-added:
    backgroundColor: "{colors.charge-green}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
  button-primary-disabled:
    backgroundColor: "{colors.empty-track}"
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.pill}"
  button-ghost:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  button-filters:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "40px"
  filters-badge:
    backgroundColor: "{colors.charge-green}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 6px"
    height: "20px"
  icon-button:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    size: "36px"
  chip-device:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    padding: "0 15px 0 13px"
    height: "40px"
  chip-device-pressed:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
  chip-filter:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "0 11px 0 10px"
    height: "36px"
  chip-filter-checked:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
  chip-filter-disabled:
    backgroundColor: "{colors.off-grey-soft}"
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.pill}"
  chip-applied:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "0 10px 0 12px"
    height: "32px"
  checkbox:
    backgroundColor: "{colors.screen-white}"
    rounded: "{rounded.control}"
    size: "20px"
  checkbox-checked:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.control}"
  checkbox-disabled:
    backgroundColor: "{colors.off-grey-soft}"
    rounded: "{rounded.control}"
  select:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    padding: "0 36px 0 14px"
    height: "40px"
  tag:
    backgroundColor: "{colors.off-grey-soft}"
    textColor: "{colors.muted-slate}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "22px"
  tag-hot:
    backgroundColor: "{colors.charge-green-soft}"
    textColor: "{colors.charge-green-ink}"
    rounded: "{rounded.pill}"
  synthetic-label:
    backgroundColor: "{colors.caution-amber-soft}"
    textColor: "{colors.caution-amber-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "1px 7px"
  cart-button:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    padding: "0 12px 0 14px"
    height: "40px"
  cart-drawer:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    width: "min(420px, 100vw)"
  cart-drawer-sheet:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.xl}"
  quantity-stepper:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 3px"
  product-tile:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.md}"
    padding: "12px"
  filter-sheet:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.xl}"
  empty-state:
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.md}"
    padding: "40px 20px"
  skeleton-block:
    backgroundColor: "{colors.empty-track}"
    rounded: "{rounded.sm}"
  battery-glyph:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.figure-pdp}"
    rounded: "{rounded.glyph}"
  search-field:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "40px"
  category-tile:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.md}"
    padding: "12px"
  category-icon-well:
    backgroundColor: "{colors.off-grey-soft}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.sm}"
    size: "40px"
  row-button:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    size: "40px"
  chipgroup-label:
    textColor: "{colors.muted-slate}"
    typography: "{typography.label}"
  button-big:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
    height: "52px"
    width: "100%"
  chip-device-dormant:
    backgroundColor: "{colors.off-grey-soft}"
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.pill}"
  chip-device-dormant-pressed:
    backgroundColor: "{colors.muted-slate}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
  fitline:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  fitline-ok:
    backgroundColor: "{colors.charge-green-soft}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.sm}"
  fitline-no:
    backgroundColor: "{colors.off-grey-soft}"
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.sm}"
  gallery-track:
    backgroundColor: "{colors.screen-white}"
    rounded: "{rounded.md}"
  gallery-thumb:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 4px 8px"
  bundle-box:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.md}"
    padding: "14px"
  compat-pill:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  placeholder-box:
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.md}"
    padding: "20px"
  buybar:
    textColor: "{colors.lockscreen-ink}"
    padding: "10px 0"
  announcement-bar:
    backgroundColor: "{colors.sleep-black}"
    textColor: "{colors.sleep-ink}"
    padding: "8px 16px"
  hero-panel:
    backgroundColor: "{colors.off-grey-soft}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.xl}"
    padding: "48px 56px 44px"
    height: "420px"
  hero-panel-phone:
    backgroundColor: "{colors.off-grey-soft}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.xl}"
    padding: "24px 20px 18px"
  promo-button:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    size: "36px"
  promo-dot:
    backgroundColor: "{colors.off-grey}"
    rounded: "{rounded.pill}"
    size: "8px"
  promo-dot-current:
    backgroundColor: "{colors.charge-green}"
    rounded: "{rounded.pill}"
    width: "26px"
    height: "8px"
  category-circle:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    size: "88px"
  tile-badge-hot:
    backgroundColor: "{colors.charge-green-soft}"
    textColor: "{colors.charge-green-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  tile-fit:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
    padding: "3px 9px 3px 7px"
  trust-icon-well:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    size: "36px"
  footer-sleep:
    backgroundColor: "{colors.sleep-black}"
    textColor: "{colors.sleep-ink}"
  admin-sidebar:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.muted-slate}"
    width: "236px"
    padding: "18px 14px 16px"
  admin-nav-link-current:
    backgroundColor: "{colors.daylight-ground}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 10px"
  admin-tabbar:
    backgroundColor: "{colors.daylight-ground}"
    textColor: "{colors.muted-slate}"
    height: "60px"
  stat-tile:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.figure-tile}"
    rounded: "{rounded.md}"
    padding: "12px 16px 10px"
  admin-card:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  data-table:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.admin-table}"
    rounded: "{rounded.md}"
  status-mini:
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.mini}"
    width: "26px"
    height: "11px"
  status-delivered:
    textColor: "{colors.charge-green-ink}"
  status-cancelled:
    textColor: "{colors.muted-slate}"
  late-mark:
    backgroundColor: "{colors.caution-amber-soft}"
    textColor: "{colors.caution-amber-ink}"
    rounded: "{rounded.pill}"
    padding: "1px 7px"
  admin-panel:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    width: "min(480px, 100vw)"
  admin-panel-sheet:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.xl}"
  order-battery:
    backgroundColor: "{colors.screen-white}"
    rounded: "{rounded.seg}"
    width: "76px"
    height: "28px"
  cell-input:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    typography: "{typography.admin-table}"
    rounded: "{rounded.field}"
    width: "6.5em"
    height: "36px"
    padding: "0 10px"
  cell-select:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 28px 0 11px"
  bulk-bar:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
    padding: "8px 10px 8px 16px"
  field-input:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.field}"
    height: "40px"
    padding: "0 12px"
  field-input-readonly:
    backgroundColor: "{colors.daylight-ground}"
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.field}"
  switch:
    backgroundColor: "{colors.empty-track}"
    rounded: "{rounded.pill}"
    width: "44px"
    height: "26px"
  signin-card:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.xl}"
    width: "min(440px, 100%)"
    padding: "28px"
  error-box:
    backgroundColor: "{colors.caution-amber-soft}"
    textColor: "{colors.caution-amber-ink}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
  toast:
    backgroundColor: "{colors.lockscreen-ink}"
    textColor: "{colors.daylight-ground}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  checkout-input:
    backgroundColor: "{colors.screen-white}"
    textColor: "{colors.lockscreen-ink}"
    rounded: "{rounded.field}"
    height: "44px"
    padding: "0 14px"
  checkout-error:
    backgroundColor: "{colors.caution-amber-soft}"
    textColor: "{colors.caution-amber-ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.field}"
    padding: "8px 12px"
---

# Design System: Ampline

## Overview

**Creative North Star: "The Charging Lock Screen"**

Every surface reads as a phone's lock screen in daylight while it charges. The ground is a cool near-white, the figures are near-black and set in one variable family, and a single charging green does the work of filling. Batteries fill, split-output bars fill, the pressed chip's dot fills. Nothing is decorated that is not also a reading of power.

Density is moderate and phone-first. Content sits on hairline-ruled rows and white cards on the grey ground, with pill-shaped controls that echo status chips. Depth is almost entirely tonal. The page ends with the screen asleep: one dark block. On home a thin announcement bar in the same sleep colours sits above the header, the lock screen's status bar. These two are the only dark regions in a light-only scheme.

The store sells devices, accessories and power, and it starts from what the shopper owns. Home follows the category canon in the same world: the three promises in the announcement bar, a hero panel that names one product and its price in live text, "Choose your device" right under it, the categories as a row of circles, and ten best sellers that re-sort to what fits the device the shopper names, the rest dimmed, never hidden. The battery stays where a figure exists: on power products it reads what a port delivers, the house strip reads the range's top output, and a device's own product page reads the ceiling the catalog lists for that device's family, marked indicative. Products with neither an output spec nor a listed ceiling carry no battery and lead with brand and facets instead.

The world uses drawn stroke icons and line-art product figures. The figures carry green port marks, and third-party devices are drawn in the same grammar with green marks, so even illustration speaks the charging language. Where the catalog has a photo, it sits in the same grey figure well as the drawing it replaces, so a photo and a drawing read as one family. The hero panel is the same idea at full scale: an off-grey-soft field one step below the ground, with the render standing directly on it, multiplied flat.

**Key Characteristics:**
- One accent, charging green, that means "fills", "fits" and "available".
- Battery glyphs as the signature component, filled with a clip-path, never a width animation.
- Pills for every control and status, hairlines for every list.
- Tabular figures everywhere; wattage is the headline number on power products.
- Light scheme only; the footer is the screen asleep and the home announcement bar its status bar.

## Colors

A cool neutral lock screen with one charging green, a caution amber for honesty states, and a dormant grey for what does not fit.

### Primary
- **Charging Green** (charge-green): fills battery glyphs and the first split segment. It also marks pressed chip dots, the "added" button, in-stock dots, the brand dot, focus rings and selection. The current hero pager dot is the one green pill, a charging bar. On home it draws the check inside the tile's Fits mark and underlines the browser's guess. On the category page it fills the Filters count badge and underlines the Clear all text button.
- **Charging Green Ink** (charge-green-ink): green text on light grounds, used for in-stock labels, hot tags, the hot badge and the "Save $N" line where the bright green would fail contrast.
- **Green Tints** (charge-green-mid, charge-green-pale, charge-green-soft): the second, third and fourth segments of a split-output stack, in that order. Soft also backs the hot tag and the hot badge on a tile's well.

### Secondary
- **Caution Amber** (caution-amber, caution-amber-ink, caution-amber-soft): low-stock dots, the rating star and the filled share of drawn rating stars, the SYNTHETIC label and the notice block. It marks what is uncertain, scarce or not real yet.

### Neutral
- **Daylight Ground** (daylight-ground): page background and the inside of product figure wells. It is also the text color on ink buttons and pressed chips.
- **Screen White** (screen-white): cards, chips, the cart button, the battery glyph body, the cart drawer and the filter sheet. On home it fills the category circles, the trust band's icon circles and the hero pager buttons.
- **Lock-Screen Ink** (lockscreen-ink): all primary text, glyph strokes, buttons, pressed chips, checked filter chips, checked checkboxes and the tile's Fits mark.
- **Muted Slate** (muted-slate): secondary text, sub-lines, counts and strike-through prices. On the product page it outlines the empty mini battery in the no-fit line, draws dimension lines in gallery drawings, and fills a pressed device chip whose device does not fit.
- **Hairline** (hairline): every 1px border and row divider.
- **Empty Track** (empty-track): unfilled battery, the split-output remainder, empty cart count, disabled buttons, idle chip dots.
- **Off Grey** (off-grey, off-grey-soft): the dormant state. It marks out-of-stock, dashes placeholder borders, fills the idle pager dots, and backs tags, icon wells and category icon wells. Its soft step is the hero panel's field. On the category page it fills filter options that would return nothing and dashes the empty-state box. On the product page it fills the battery glyph and backs the fit line when the chosen device is not listed.
- **Ink scrim** (lockscreen-ink at 45%): the backdrop behind the phone filter sheet.
- **Sleep** (sleep-black, sleep-ink, sleep-ink-dim, sleep-line): the footer and, on home only, the announcement bar above the header.

### Named Rules
**The One Charge Rule.** Green means power, fit or saving: filling, pressed, available, added, and the "Save $N" figure in green ink. It is never used as a decorative fill, a heading color or a section background.

**The Honest Amber Rule.** Amber marks what is scarce or synthetic. A value that is placeholder or invented gets the amber SYNTHETIC label, never green.

**The Dormant Grey Rule.** What does not fit the chosen device is shown in grey, not hidden and not red. The scheme has no error red. A filter option that would return zero results under the current filters goes dormant the same way: grey and disabled, still listed with its zero count. An option no product in the listing carries is never offered at all. On a product page the whole reading goes dormant together: the glyph fill, the fit line and the chosen chip. On home, best sellers that do not fit the pick dim to 38% and keep their place in the row.

## Typography

**Display Font:** Readex Pro, self-hosted variable 200 to 700 (with system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Readex Pro (same stack)

**Code literals:** the platform monospace stack (ui-monospace, SFMono-Regular, Menlo, monospace) at 0.875em, only for code inside the amber notice, such as the load-error notice. It is not a typeface of the system and never sets display or body text.

**Character:** One geometric, slightly wide family carries everything, like a phone's system clock face. Hierarchy comes from weight and size, never from a second family.

### Hierarchy
- **Display** (700, clamp(1.75rem, 1.1rem + 3.2vw, 3.5rem), 1.04, -0.03em, balanced wrap): the hero panel's slide titles, an h2 on each slide that names the product and its price in live text ("iPhone 16. $1,099."). The amber SYNTHETIC tag follows the price inside the title, 8px after it at 0.04em tracking. It sits near 30px on a 390px phone and holds its 3.5rem top from about 1200px. Titles take two lines.
- **Headline** (700, clamp 1.5rem to 2.25rem, 1.08, -0.02em): section titles, max 22ch, including the group titles and the house strip title. The category page title pins the headline at its 2.25rem top at every width.
- **Product title** (700, clamp 1.75rem to 2.25rem): the product page h1, the headline style on a smaller ramp.
- **Picker heading** (700, 1.0625rem, 1.08, -0.02em): "Choose your device", in the same wrapping row as the family chips. When the chips fill the row, as at 1440, it sits on its own line above them.
- **Title** (600, 1.25rem, 1.35): prices, the cart heading and cart subtotal at 700, and the wordmark at 700. Also the home's "Featured in" subheads, the filter sheet heading, the empty-state title and, from 1024px, the results count line. On the product page it sets the strike-through beside the big price, the buy bar price and the bundle total.
- **Body** (400, 1rem, 1.5): running text and sub-lines in muted slate, 42 to 54ch. The hero offer line is body at 44ch, 1.125rem from 1024px, with weight 600 ink figures.
- **Status** (400, 0.9375rem): the guess and status line under the family chips, muted. The trust band promises take it at weight 600 in ink.
- **Strip** (0.8125rem): the announcement bar at 400, the category circle labels at 600 and the tile's "Save $N" at 600.
- **Mark** (600, 0.75rem, 1.3): the hot badge and the Fits mark on a tile's well.
- **Tile figure** (700, 1.75rem, 1, -0.03em): the watt number beside the mini battery on product tiles. It steps down to 1.5rem below 720px.
- **Product figure** (700, 2.75rem, 1, -0.035em): the watt number inside the battery glyph on the house strip and product pages. The unit sits at 0.375em in weight 500.
- **Big price** (700, 1.75rem, -0.02em): the product page price, with a 1.25rem muted strike-through. The cart thank-you title uses the same step.
- **Review count** (700, 2.25rem, 1, -0.03em): the aggregate rating number, the headline top as a figure.
- **Body small** (400, 0.875rem, 1.3): tile descriptions, tile facet lines, cart unit prices and thank-you lines, breadcrumbs, filter chips and applied chips.
- **Label** (600, 0.8rem): tags, counts, scale marks, meta lines, split segments, the would-be counts on filter options, chip-group labels and category product counts. At weight 400 it sets the tile brand line, the home tile's category line and category blurbs.

### Named Rules
**The Tabular Rule.** The body sets tabular figures, so watts, prices and counts align and count-ups do not jitter.

**The Five Steps Rule.** Listing, product and cart text sizes are 0.8, 0.875, 1, 1.25 and 1.75rem, with the tile figure stepping to 1.5rem below 720px. Larger fixed sizes are only the fluid ramps' own tops, 2.25rem, 2.75rem and the display's 3.5rem. The home rebuild added four in-between steps (recorded 2026-10-11): 0.75rem for a tile's corner marks, 0.8125rem for the strip roles, 0.9375rem for the status line, the trust band and the phone hero buttons, and 1.0625rem for the picker heading, with the offer line at 1.125rem from 1024px. Only the display, headline and product title sizes are fluid.

## Layout

A centered container of 1200px with a fluid gutter (20px to 48px). Sections breathe at 56px, 72px from 1024px up. Mobile is the primary layout and desktop extends it.

- **Home order:** the announcement bar above the header, then the hero section: the hero panel and its pager, "Choose your device", the category circles, the best sellers and the trust band. Then the three group sections Devices, Accessories and Power, and the Ampline house strip. The groups' featured rows skip the ten products the best sellers show.
- **Hero:** one column at every width, its parts 20px apart. It pads 16px top and 40px bottom, 20px and 56px from 1024px. At 1440 by 900 the first viewport holds the announcement bar, the header, the 420px hero panel and its pager, "Choose your device" with the family chips and the guess line, and the category circles; the best sellers head sits just below the fold. On a 390 by 844 phone it holds the bar, the header's two rows and the first slide, text above the render, with the pager and the picker heading at its foot. A family tap below 1024px brings "Choose your device" under the header. A device tap scrolls at every width: from 1024px "Choose your device" lands under the header so the chips stay above the tiles; below 1024px the open model question lands there, else the best sellers.
- **Best sellers grid:** ten shared tiles, two columns on phones (one under 360px), three from 720px and five from 1024px with a 16px gap. Before the catalog loads, five skeleton tiles and one skeleton slide hold the shape; the empty family row reserves 88px on phones and 44px from 720px, and the sub line reserves one line.
- **Group sections:** each opens with a headline and a muted sub, then the category grid, then a title-size "Featured in" subhead over a scroll row. They pad 48px top, 64px from 1024px.
- **Category grid:** hairline-ruled rows below 720px, three tile columns from 720px with a 10px gap, four from 1024px with a 12px gap.
- **Scroll rows:** tiles run in one snapping row, about three to a row from 720px and 4.4 from 1024px so a fifth tile cuts at the edge and the row reads as scrollable.
- **Tiles:** two columns on mobile with a 12px gap, three from 720px with a 16px gap; under 360px one column, so a price row never splits a tile.
- **Listing pages:** the all-products page and all fifteen category pages share one template. Breadcrumb, title and a 54ch blurb come first; where fit applies (accessories, power, all products) a hairline-topped "What do you own?" strip follows, the home picker's steps in miniature: seven family chips (one swipeable row on phones, wrapping from 720px), then that family's device chips with would-be counts under a hairline, then a bucket's models under "Which model? Cases and folios fit one model only." The title follows the device: "Fits iPhone 16" on the all-products page, "Chargers for iPhone 16" on a category (recorded 2026-10-11). The blurb is one line ("Search by name, brand or spec, or start from what you own." on the all-products page, the catalog blurb on a category) and steps aside once a device is named; the SYNTHETIC tag on every price and rating carries the disclaimer, so the blurb does not repeat it. Then results. On phones the facets live in a bottom sheet behind a Filters button; the button hides when no group can narrow the answer. From 1024px the body becomes a 280px facet rail beside the results, 40px apart, sticky at 74px and scrolling within the viewport when taller. Every filter step is a history entry, so Back undoes one step and stays on the listing; Back from a product page returns to the same scroll position once the list has rendered (recorded 2026-10-11). A header search on the all-products page scrolls the count line to the top, under the sticky header, and dismisses the phone keyboard.
- **Results toolbar:** sticky at 60px, directly under the header (110px on phones, 60px from 1024px). On phones the Filters button and a full-width sort sit above the count line. From 1024px the count sits left and the sort right on one row.
- **Product page:** every SKU has one, all on the same template. Phones stack breadcrumb, head, gallery, buy column, then sections in a single minmax(0, 1fr) column, so no long name or drawing can widen the page. From 1024px it becomes two columns (1.1fr and 1fr, 64px gap) with the gallery sticky at 76px, spanning the head and buy rows; sections run full width below. Sections are hairline-topped with 56px top padding, 72px from 1024px, and no bottom padding. Their order is the shared-output section, Fits, the Specs and In the box pair, Reviews, then "Complete your setup" last in both layouts. The Specs and In the box pair splits into two columns from 720px, 40px apart.
- **Narrow tiles:** below 720px the SYNTHETIC label takes its own line under the price so tile rows align, and hyphenated names never break at the hyphen.
- **Footer:** stacks on mobile, three columns (1.3fr 1fr 1fr) from 720px.
- **Breakpoints:** 720px and 1024px only.

## Elevation & Depth

The system is flat and tonal. White cards sit on the grey ground, and borders are 1px hairlines. The only cast shadow belongs to floating layers: the cart drawer and, on phones, the filter sheet, each over a 45% ink scrim, and the round scroll buttons that sit over a row's edge. From 1024px the same sheet settles into the page as a static rail and drops its shadow. The sticky header and the sticky results toolbar use a translucent ground with a 12px backdrop blur instead of a shadow, at 88% and 92% respectively. The phone buy bar on the product page uses the same 92% translucent ground and 12px blur with a hairline top, no shadow. The current gallery thumb draws a 1px inset ink ring; that is a border, not a cast shadow. The admin adds two floating layers in the same shadow: its order and product panel over the same scrim, and the toast (recorded 2026-10-11).

### Shadow Vocabulary
- **Floating layer** (`box-shadow: 0 12px 32px -12px rgba(11,13,16,0.18), 0 2px 6px -2px rgba(11,13,16,0.08)`): the cart drawer, the phone filter sheet and the row scroll buttons.
- **Scrim** (`background: rgba(11,13,16,0.45)`): the dialog backdrop behind the cart drawer and the phone filter sheet.

### Named Rules
**The Flat Screen Rule.** Cards, chips, tiles and category tiles never cast shadows. Hover answers with a border darkening to ink and, on tiles and linked category tiles, a 2px lift.

## Shapes

Rounded, device-like corners in a small ladder: pill for every control and status, 28px for the hero panel and sheet tops, 22px for the battery glyph, 18px for cards, category tiles and notices, 12px for icon wells and figure wells, 8px for split segments, 6px for checkbox controls. The mini battery runs at 5px with 2px corners on its nub and fill; its enlarged empty-state variant runs at 9px. The battery glyph's fill takes 14px rounding. The filter sheet and the phone cart drawer take 28px on their top corners only. The desktop cart drawer is square, a full-height edge panel. Icon buttons, row scroll buttons, hero pager buttons, quantity buttons and remove buttons are full circles. Dots are full circles at 8px, 11px for the brand dot. The current pager dot stretches to a 26px pill. Category circles and the trust band's 36px icon wells are full circles with a hairline. A tile's hot badge and Fits mark are pills. Fills are cut with `clip-path: inset(... round r)` so the fill keeps its rounding at any level. Placeholder content wears a 1px dashed off-grey border, and the empty state and the product page review placeholder use the same dashed off-grey border on an 18px box.

## Components

### Buttons
- **Shape:** pill, 44px tall (40px inside tiles), 18px horizontal padding, weight 600.
- **Primary:** ink background with daylight-ground text.
- **Hover / Active:** background lightens one step to a near-ink; active scales to 0.98 on the house ease.
- **Added:** green background with ink text and a check icon.
- **Disabled:** empty-track background, muted text, not-allowed cursor.
- **Big:** 52px tall and full width. It is the product page primary, whose label names the action and the live total, as in "Add to cart · $price", and the cart Checkout.
- **Focus:** a 3px green outline offset 3px, global for every focusable element. Visually hidden radio inputs pass it to their chip.
- **Ghost:** screen white with a hairline border and ink text; hover darkens the border to ink. It is the secondary action beside a primary, as in the sheet's Clear beside its show-results button and Clear all filters in the empty state, or the lone way out of the empty cart.
- **As a link:** a button rendered as a link carries no underline; it reads as the button, not as a text link.
- **Filters button:** a 40px ghost pill with a filter icon and a green count badge (20px pill, label size) that appears when filters are set. Phones only.
- **Icon button:** a 36px hairline circle holding an 18px stroke icon, used to close the filter sheet and the cart drawer. Gallery arrows are the 40px version, shown on phones only.
- **Text button:** Clear all is bare ink text at 0.875rem weight 600 with a 2px green underline.
- **Hero pair:** inside each hero slide, a primary pill to the product or the range and a ghost "Choose your device" pill to the picker, 10px apart. They are 46px tall at 0.9375rem with 18px padding, 48px at 1rem with 22px from 1024px, and stack on a 390px phone.

### Chips
- **Style:** the device picker. White pill with a hairline border, 40px tall (42px desktop), weight 500, with an 8px status dot leading.
- **State:** hover darkens the border to ink. Pressed (aria-pressed) inverts to ink with a green dot. Suggested takes a dashed hairline ink border, so it never reads as a hovered chip's solid ring; no inset ring, no green dot and no inversion; green stays for pressed and fit.
- **Home picker:** under "Choose your device". Seven family chips at 40px share a wrapping row with the heading, 8px apart. Picking a family presses it and already re-sorts the best sellers to everything that family's devices take. Its bucket chips follow under a hairline with 12px of top padding, at the 36px chip-set size. A bucket that holds models (catalog devices with a parent) opens a third row under another hairline, a chip-group label "Which model? Cases and folios fit one model only." over the model chips and a "Mine isn't listed" chip. No model is pressed until the shopper taps one. "Mine isn't listed" presses and keeps the bucket. Re-tapping a pressed model steps back to its bucket, re-tapping a pressed bucket clears the pick, and re-tapping a pressed family closes it. The browser's guess takes the dashed suggested border on the family chip until it opens, then on the device chip, never pressing it.
- **Guess and status line:** one muted 0.9375rem live line under the family chips. Before a pick it reads "Pick what you own and the best sellers re-sort to what fits it.", or names only what the user agent can tell, with the right article: "Your browser looks like a Mac. Pick it to choose which one." for a family and "… Pick it, or choose another." for a device. The guessed name is a bare button in ink at weight 600 with a green underline offset 3px, thickening to 2px on hover. A family guess opens that family's row in view and never closes it on a repeat tap. Once something is picked the line becomes the status, as in "2 products fit your Steam Deck. Power products show the most watts one port gives."; with a family alone it ends "Name the exact one for cases and folios."
- **Model fit:** a model fits everything its bucket fits plus the products that name the model. Cases and folios therefore enter the fit answer only once a model is named.
- **Chip groups:** in the Fits filter group and on product pages the device chips are grouped by family. Each group is a label-size muted weight 600 name over its chip set, 6px apart, groups 10px apart.
- **Filter chips:** the device Fits group reuses the device chip as a radio, at 36px and 0.875rem, with its would-be count in label-size muted text after the name. Checked inverts to ink with a green dot. A device that would return nothing turns dormant: off-grey-soft fill and border, an off-grey dot, muted text and a not-allowed cursor.
- **Dormant device chip:** on the product page a device the product does not fit stays pickable. Unpressed it takes the off-grey-soft fill with an off-grey dot and muted text. Pressed it fills muted slate with ground-colored text and keeps the off-grey dot.
- **Option chips:** the buy box's variant picker reuses the device chip as radio groups, one fieldset per group under a weight 600 legend 8px above its chip set, groups 14px apart. Groups come in a fixed order: Plug region when the Plug spec lists more than one region, then Colour, Storage and Pack from the catalog, each only with two or more options. The preselected option is the one the SKU already is, its tier or pack named in the name or Storage spec, else the first. One muted 0.875rem note under the groups says the options share one price: "Same price in every region; the catalog lists one.", "Storage tiers share one synthetic price here; tier pricing is left to the client." or the pack equivalent.
- **Compat pills:** a wrapping list of 0.875rem hairline pills on white, padded 4px 10px, naming listed devices.
- **Applied chips:** 32px white hairline pills at 0.875rem weight 500, each with a 14px muted x icon. Hover darkens the border to ink and a click removes that filter. The last chip and Clear all wrap together as one unit. A search shows as a "Search: q" chip in the same row. Clear all removes the search too, while the sheet's Clear and the Filters badge leave it alone.
- **Tags:** 22px label pills in off-grey-soft. The hot variant is green-soft with green-ink text; on tiles the hot badge leaves the tag row for the well's corner (see Product Tile).

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** screen white on the daylight ground.
- **Shadow Strategy:** none; see Elevation.
- **Border:** 1px hairline, ink on hover.
- **Internal Padding:** 12px mobile, 14px from 720px.

### Inputs / Fields
- **Checkbox rows:** a 20px square box with a 2px ink border and a 6px radius, a full-width label and its would-be count in label-size muted text at the right. Checked fills ink with a drawn ground-colored check. Disabled turns the border off-grey and the fill off-grey-soft, and the label goes muted.
- **Select:** a 40px white pill with a hairline border, weight 600 text and a drawn 16px muted chevron at the right. Hover darkens the border to ink. It fills the toolbar width on phones and sizes to content from 1024px. The listing sort offers Featured, price both ways and rating everywhere, plus "Max output: high to low" on Power categories only.
- **Search field:** a 40px white pill with a hairline border, 14px side padding, an 18px drawn muted search icon and a borderless input with a muted placeholder. Its border darkens to ink while it holds focus. It submits to the all-products listing as a q parameter. On that listing it filters in place and the field always shows the current search.
- **Groups:** each filter group is a fieldset with a hairline top rule, 14px vertical padding and a weight 600 legend floated to full width above its options.

### Navigation
- **Header:** sticky, translucent ground at 88% with a 12px saturating blur and a hairline bottom. The wordmark is weight 700 at 1.25rem with an 11px green dot before it. From 1024px it is one 60px row: wordmark, the nav, the search field centred in the space between (it grows from 320px to at most 460px on auto margins), then the cart at the right. On phones the wordmark and cart share the first row and the search field drops to a full-width second row. The nav is the three groups Devices, Accessories and Power, then Deals. Deals opens the all-products listing narrowed to products with a compare-at price, on every page, home included; there it shows as an "On deal" applied chip, and the link never takes the current state. On home they link to its group sections; on every other page they open the all-products listing filtered to that group. On a category page the link of that category's group is the current one; on the all-products listing it is the link of the one selected group, if exactly one is selected. The current link is set in ink at weight 600 with no pill fill. Nav links are muted pills that go white with ink text on hover, shown from 1024px. Every page carries the same header.
- **Cart button:** a white pill with a hairline border and a count badge. The badge is green with a count, empty-track at zero. Its accessible name carries the count. It opens the cart drawer as a modal dialog on every page.
- **Breadcrumb:** 0.875rem muted links separated by a drawn 14px chevron, with the current page in ink at weight 600. Crumbs do not wrap. A category crumb links only when its category page is built and is plain muted text otherwise. The current crumb shrinks and truncates with an ellipsis.

### Battery Glyph (signature)
A 2.2:1 rounded battery on screen white with a 3px ink outline, 22px rounding, a 9px ink terminal nub and a green fill inset 5px with 14px rounding. The fill level is a `--pct` custom property against a 100W full scale, driving clip-path over 0.8s on the house ease. The watt figure sits centered inside at the product figure size, its bolt fading in after a 0.45s delay while charging, and the number counts up over 700ms. Label-size scale marks sit beneath it, 0, 50 and 100W.

- **House strip:** up to 240px wide, filled to the house range's top output with that figure inside.
- **Product page:** 196px wide at the head of the buy column. On power products and accessories with an output it reads the top port. On a device mapped to the catalog's device list it reads that family's charge ceiling, and the scale stretches to the larger of 100W and the ceiling, so a 140W laptop reads 0, 70 and 140W. Catch-all families ("Other USB-C laptop") and products with neither figure show no glyph.

A mini variant (12px tall, 2px outline, 5px radius, a 3px nub with 2px corners) repeats the reading on each product tile. At 34px wide it leads the results count, filled to results over total. An enlarged empty variant (72 by 32px, 3px outline, 9px radius) sits at zero fill atop the empty state. On the product page the caption sits beside the glyph: a weight 600 line naming what the figure measures over a muted 0.875rem line naming the 100W full scale. The first line follows the category: "Max on one port" by default, "Max through the cable" on cables, "Max to the laptop" on hubs. On a device it reads "Takes up to" over the shared ceiling sentence, followed by "Indicative." The shared sentence has four forms: "The catalog's ceiling for <bucket>; your model may take less." for a bucket, "…for <bucket>, which this model sits in; your model may take less." for a model without a figure of its own, "The <model>'s own ceiling, as its maker publishes it." for a model with one, and "A typical figure for this group, not a maker's number." for a catch-all bucket. It counts up on load through the shared count-up. When the chosen device is not listed it goes dormant and its fill turns off-grey.

### Fit Line
A 12px-rounded hairline box with a leading 34px mini battery and one sentence that names the matched catalog entry. Fits: green-soft fill, green border, the mini filled to the watt level. Does not fit: off-grey-soft fill and border, muted text with the device name in ink, an empty mini outlined in muted slate. With no device chosen it stays white and hairline. A case or folio made for one model lists no family and says so instead: "Made for iPhone 16 only. Check the model before buying." with an empty mini, and its Fits section shrinks to that sentence and one chip. Device pages and products with no output carry no fit line and no Fits section.

### Announcement Bar
The lock screen's status bar, on home only. A thin strip above the header on sleep-black with sleep-ink text at 0.8125rem, centred, padded 8px 16px, carrying the three trust promises separated by sleep-ink-dim middle dots. "1 to 3 days" is set white at weight 600. It wraps to two lines on a 390px phone. It is a note, not a link, and scrolls away while the header stays.

### Hero Panel
A field that names one product and its price in live text, the render standing beside it. One scroll-snap track of slides on the off-grey-soft field with a 1px hairline and 28px corners, one slide in view at every width. It never autoplays, off-screen slides are inert, ArrowLeft and ArrowRight move it while focus is inside, and a resize snaps back to the current slide.

- **Slide grid:** on phones the text sits above a 200px art box, 14px apart, padded 24px 20px 18px. From 720px the text column takes 1.1fr against the render's 1fr, 24px apart, at a 380px minimum height padded 40px 36px. From 1024px the minimum is 420px and the padding 48px 56px 44px. The render runs taller than the padding: its box takes -22px block margins from 720px and -30px from 1024px. The text block centres vertically.
- **Text:** the display title with the SYNTHETIC tag after the price, then the muted offer line, then the hero pair (see Buttons). Whole-dollar prices drop their cents in the title; others keep them, as in "From $12.99.".
- **Slides:** three, computed from the catalog. iPhone 16 and MacBook Air M3 each carry the first sentence of the catalog's short line and one photo. The third is the Ampline range, "From <lowest house price>", with three drawings. A photo fills the art box's height, centred, contained and multiplied flat onto the field. A slide of drawings sets three figures in a row at 28% of the box's width, vertically centred, so every stroke stays one weight.
- **Pager:** centred under the panel, 8px below it: two 36px round white hairline buttons with a 16px chevron, aria-disabled at 0.4 opacity at the ends, around the dots, 10px apart. The current dot is a 26px charging-green pill; the others are 8px off-grey dots in 24px targets that go ink on hover, while a hovered current dot keeps its green.
- **Skeleton:** before the catalog arrives one skeleton slide holds the panel's shape, two pulsing empty-track text bars and a 150 by 48px pill over an empty art box.

### Choose Your Device
No card: the picker heading and the family chips, the guess and status line, then the device and model rows, stacked 10px apart directly on the ground between the hero pager and the category circles. Behaviour is under Chips.

### Category Circles
One row of every category, scrolling sideways at every width with proximity snap and no scrollbar; at 1440 a ninth circle cuts at the edge, so the row reads as scrollable. Each link is an 88px white hairline circle, 100px from 720px, over its name at 0.8125rem weight 600 in ink, 8px below and centred. The circle holds the first photo among the category's best sellers, inset 16%, contained and multiplied; a category without a photo shows its lead product's drawn figure inset 20%. Device categories lead, so the photos come first and the house drawings follow. Circles are 16px apart, 22px from 720px and 28px from 1024px. A link opens the category page with the picked device carried forward.

### Best Sellers
Ten shared Product Tiles under a section head: the h2, a muted sub and a trailing link. With nothing picked it reads "Best sellers" over "Across the store, one per category first." and "See all N products" to the listing sorted by rating. The ten go one per category in turn, each category's best sellers and new arrivals first, then review count, buyable first.

- **The answer:** a pick, whether a family, a device or a model, rewrites the heading to "Fits <device>", led by a 34px mini battery 12px before it that charges to the share of accessories and power products that fit. What fits comes first, one per category in that family's own order and then the rest in fit order; best sellers that do not fit fill the ten, dimmed. Phones read chargers, cables, power banks, cases, wireless, car, hubs; tablets chargers, cables, hubs, cases; laptops chargers, hubs, cables; handhelds chargers, power banks; watches and earbuds wireless first. Within that order buyable comes first, a product whose compat names the exact model leads its category, then review count decides. Every fitting tile carries the Fits mark.
- **Sub and link:** "All ten fit, and N more on the full list." or "N of these fit; the rest are best sellers, dimmed.". The link reads "See all N that fit" and opens the all-products listing filtered to the device. When the catalog lists nothing for the pick, the sub reads "Nothing listed for it yet; these are the store's best sellers.", the link hides and every tile dims. The sub is the live region, not the grid.
- **Tiles here:** the category line replaces the tag row and brand line, the short line hides, and the facts line keeps its slot at zero height so prices align across the row.

### Trust Band
The three promises between two hairlines, no cards, padded 16px top and bottom, 20px from 720px. Each item is a 36px white hairline circle holding an 18px ink stroke icon, 12px before the promise at 0.9375rem weight 600 in ink. Items stack 14px apart on phones and sit three across from 720px. The promises are the pitch's assumptions, not confirmed terms: "Delivery across Lebanon in 1 to 3 days", "1-year warranty" and "Card or cash on delivery". They ship as plain copy with no label while the client confirms them; the announcement bar repeats them.

### Gallery
A scroll-snap track in an 18px hairline white box, each slide 4:3 with its drawing absolutely inset 6% (no percentage padding, for WebKit), holding inline SVG drawings. Photos that exist at the catalog's image paths lead the track as unpadded slides on white with their own image thumbs, labelled Photo; the drawings follow. A photo thumb is contained, never cropped, at 4:3 on white. Catalog photos are trimmed WebP files of at most 1000px. Phones get round 40px hairline arrows over the track, hidden when there is one slide. Thumbs are 12px hairline tiles with a label-size name in a fixed 2.3em two-line box, so tiles stay level, over a figure-only crop; from 1024px they stack as a column beside the track, 84px wide with the label at 0.75rem in a 2.2em box, and the gallery's first grid column is 84px to match; the gallery grid aligns both to the start, so the track keeps its 4:3 height even when four thumbs run taller than it. The current thumb takes an ink border plus a 1px inset ink ring. A muted label-size note closes the gallery, saying the drawings come from the spec sheet.

No slide is authored per product. Each is drawn from the catalog entry, in this order, and only when its spec exists:

- **Product:** the tile figure, enlarged; third-party products take their category figure, so every page carries the full figure set. Its thumb is the same figure, labelled with one word: the category noun (Charger, Cable, Phone, Laptop) or else the last word of the Type spec (Headphones, Smartwatch, Case).
- **Ports:** drawn only on power products and the Ampline accessories that carry an output. A body outline with one green port mark per port the Ports, USB, Output or Wired spec names, USB-C rows first, each led to a weight 600 label by a muted line. Only on chargers, power banks and car chargers does the first USB-C row read "USB-C · <max>W alone". USB-A rows carry a watt figure when the spec states one. A centred muted "Shared: …" caption reads the split-output spec.
- **Hub ports:** hubs replace the ports slide with a bar drawing whose port marks are numbered beneath, then listed in order with every port the Video, USB, Cards and Power specs name. Its thumb is a bar crop with the same number of marks.
- **Size:** front and side outlines to scale with muted dimension lines and millimetre labels, drawn when the Size spec reads as width by height by depth in mm. A muted caption adds the weight and "foldable plug" when the Plug spec says so.
- **Box:** the product figure with its name, and each further item drawn as itself. Cables and leads are the cable figure, adapters and chargers the small charger figure, guides a ruled sheet, and anything else a labelled card whose label breaks onto two lines at the last space that fits ("Carry" / "case"). A muted "Also: …" caption lists the extras. Chargers without a USB-C cable add "No USB-C cable in the box"; single-item boxes say "Nothing else in the box".

### Rating Stars
Five drawn 16px stars in empty-track with an amber copy laid over them, cut by clip-path to the rating fraction. Stars are a reading too, filled the same way batteries are.

### Bundle Box
An 18px hairline white card padded 14px. It holds a checkbox row with a 56px ground-colored figure well, the title "Add the USB-C cable the box lacks" and a muted line carrying the SYNTHETIC pill, then a hairline-topped total line at title size. It appears only on in-stock chargers with no cable in the box; an out-of-stock page offers nothing to pick. The In the box list then carries a muted note, "No USB-C cable in the box", linking back to it.

### Trust Lines
The product page's form of the trust band: a list of muted 0.875rem lines, each led by an 18px ink stroke icon, with the same three promises as home. The cart foot repeats the delivery and payment promise in one muted line. PRODUCT.md records all three as pitch assumptions the client confirms before launch.

### Product Sections
Specs are a hairline-ruled table with a 34% weight 600 label column and muted values. In the box is a plain list with 18px green-ink check icons. The "One plug, shared fairly" section shows only when the spec sheet states a shared output and is hidden otherwise. Reviews open with an aggregate: the review count number, drawn stars and the SYNTHETIC pill, then the dashed placeholder box. On a device mapped to the catalog's device list the page closes with "Complete your setup": a headline, a muted sub that counts the products ("11 Ampline products the catalog lists for iPhone 15 or newer. Each page answers the fit for it.", or "for USB-C laptops like this one" on a catch-all family), then a scroll row of every house product that fits the device, buyable first and out of stock last, each tile carrying the device forward. Hidden sections take their footer link with them.

### Buy Bar
A phone-only bar fixed to the bottom while the main button is out of view. It sits on the 92% translucent ground with a 12px blur and a hairline top. The price at 1.25rem sits over a muted label-size line with an ellipsis that leads with the chosen variant, then the name ("Teal · 256 GB · Apple iPhone 16, 256 GB"), so truncation hides the tail and never the choice, beside an ink "Add to cart" pill. The body gains 72px of bottom padding while it shows. It is hidden from 1024px.

### Split-Output Stack
Lives in the product page's "One plug, shared fairly" section, one row per scenario: a muted label column of 118px, 150px from 1024px, with the scenario name in ink, then a 34px stack of 8px-rounded segments, 3px apart, each as wide as its share of output. Segments step through green, green-mid, green-pale and green-soft with ink labels; the remainder is empty track.

### Product Tile
A white card with a square ground-colored figure well holding line-art at 3px stroke with green ports. When a file exists at the catalog's first image path the well shows that photo instead. The photo keeps the grey well: it is inset 12%, contained, and multiplied so a white studio background drops into the ground. The drawing hides while a photo is present and returns when the file is missing. Below it come the remaining tags, the name, a muted label-size brand line for third-party products, a short line from 720px, the mini battery with the watt figure, price with a muted strike-through and SYNTHETIC label, a meta line with stock dot and amber star, and the button. A product with no ratings shows no star and no rating figure; its meta line carries the stock alone (recorded 2026-10-11). A product with no output spec carries no battery: a muted 0.875rem facet line, its first two facets, takes the watt figure's place. A yes or no facet reads as its own name, "Noise cancelling" or "No noise cancelling", never a bare Yes. Third-party products with no figure of their own take a category figure (phone, laptop, tablet, headphones, watch, controller, router, plug, stand, folio, mount or case), and every page that renders tiles carries the full figure set. Prices everywhere carry thousands separators, as in $1,399.00. Tiles rise from 0.4 opacity and 8px down over 0.5s, staggered 40ms; on the category page they rise over 0.25s without stagger; in scroll rows they do not rise. Below 720px the watt figure drops to 1.5rem, the struck compare price drops to 0.875rem so it stays beside the price on one line, the SYNTHETIC label wraps to its own line, and hyphenated tokens in names are held together with no-wrap spans. Every SKU now has a product page, so every tile name and figure links to one. The guard stays: a tile links only when its page is built and would otherwise stay unlinked rather than point at a missing page. Links carry the picked device forward as a device query parameter. The button adds a SKU that has no choice to make. A SKU with a colour, storage, plug region or pack choice carries the same pill as a link, "Choose options", to its product page with the chosen device in the URL, and reads "In cart" with the check once any of its variants is in the cart. A cart change updates only the buttons whose state changed; the clicked button holds "Added" for 1.4s and keeps its focus (recorded 2026-10-11). The watt caption follows the product page: "W max per port" on chargers, power banks, car and wireless products, "W through the cable" on cables, "W to the laptop" on hubs. Hyphenated tokens and figure-unit pairs (24 GB, 2 m, 42 mm) never break across lines in names or facts. On touch screens the tile button is 44px tall. Skeleton tiles are 560px tall on phones and 608px from 1024px, the median of real tiles, so the catalog's arrival barely shifts the page (polish, 2026-10-11). The well carries no percentage padding: the drawing and the photo are absolutely inset 12%, because WebKit sizes an aspect-ratio box with percentage padding wrongly (an iPhone drew the well 177px wide in a 145px column, 2026-10-11).

**Corner marks and saving (recorded 2026-10-11).** One hot badge, "Best seller" or "New", rides the well's top-left corner 10px in, out of the tag row: a green-soft pill at the mark size in green ink, padded 3px 9px. Where a pick is live on home, a fitting tile carries the Fits mark at the top-right: an ink pill with a 12px green check and "Fits" in ground colour. A non-fitting tile dims to 38% opacity over 0.25s and does not rise. In a phone-width well only the Fits mark shows; the badge hides beside it. A compare-at price is followed by "Save $N" in green ink at 0.8125rem weight 600, whole dollars without cents. On home a 0.8rem muted category line replaces the tag row and the brand line, and the facts line keeps its slot at zero height.

### Scroll Row
A horizontal flex row of tiles with mandatory scroll snap, a hidden scrollbar, a 12px gap and 16px from 1024px. Tiles are min(250px, 74vw) on phones, a third of the row from 720px and 4.4 to the row from 1024px. Row tiles hide the short line on phones. From 1024px round 40px white hairline buttons with an 18px chevron sit over the row's two edges, 20px outside it, carrying the floating shadow; hover darkens the border to ink. The same row markup and edge buttons close a device's product page under "Complete your setup".

### Category Tile
A grid link per category inside a group section. From 720px it is an 18px white hairline card padded 12px: a 40px off-grey-soft icon well at 12px rounding holding a 22px stroke icon, the name at weight 600 over a label-size muted blurb, and a label-size muted weight 600 product count. Hover darkens the border to ink and lifts 2px. A category without a built page is a plain block, never a link, and its count adds a muted weight 400 "· page not built". Below 720px tiles become hairline rows on the ground: icon, name and one-line truncated blurb, then the count at the right with the unbuilt note under it.

### House Strip
The Ampline range closes home under a hairline top. It pads 48px top and 64px bottom, 72px and 96px from 1024px, where it becomes a 260px glyph column beside the text, 56px apart. The glyph is filled to the range maximum. The text stacks a headline-size title, a muted sub that names the dash mount and laptop stand apart from the power products, since they carry no watts, a facts list computed from the catalog (product count, per-port watt range, the technologies in the range) in muted text with ink weight 600 figures, and a ghost button with a trailing arrow to the chargers page.

### Cart Drawer
One native dialog, injected once at the end of the body on every page and opened modally from the header cart button. From 720px it is a full-height right-edge panel, 420px wide or the viewport if narrower, screen white with square corners, the floating shadow and the 45% ink scrim, sliding in 24px from the right from 0.6 opacity over 0.25s on the house ease. Below 720px it is a bottom sheet in the filter sheet's grammar: 28px top corners, max 88% of the dynamic viewport tall, sliding up 24px. Clicking the scrim closes it.

- **Head:** a hairline-ruled row with the "Cart" title at 1.25rem and a label-size muted item count beside it, and the round hairline icon button to close.
- **Body:** scrolls on its own between head and foot.
- **Lines:** hairline-divided rows on a 48px / 1fr / auto grid. A 48px ground-colored figure well at 12px rounding holds the product line art. Beside it sit the name at weight 600 with hyphenated tokens held together, following the chosen tier or pack ("Apple iPhone 16, 256 GB"), the variant label as written in label-size muted text ("Teal · 256 GB", "EU plug"), and the unit price in muted body small with the SYNTHETIC pill. The second row holds the quantity stepper at the left and the line total at weight 600 at the right. A round 30px muted remove button with the x icon closes the first row and goes ink on an off-grey-soft hover.
- **Quantity stepper:** a 36px white hairline pill holding two 30px round buttons with drawn minus and plus strokes and a weight 600 output between them. Buttons take an off-grey-soft hover. Under a coarse pointer the stepper buttons and remove buttons grow to 44px.
- **Foot:** a hairline top and bottom padding that clears the safe area. A Subtotal row at weight 600 with a 1.25rem figure and the SYNTHETIC pill, a muted body-small line, "Delivery across Lebanon in 1 to 3 days · card or cash on delivery", the checkout form, and the big Checkout button.
- **Checkout form (recorded 2026-10-11):** four fields stacked 8px apart. Name and phone are 44px white hairline inputs at 10px radius, padded 0 14px, with placeholders for labels ("Your name", "Phone, e.g. 03 123 456"); focus turns the border ink. The area is the storefront's 40px pill select, "Where to deliver". Payment is two chips 6px apart, "Cash on delivery" and "Card", visually hidden radios at 40px and 0.9375rem; the checked one inverts to ink with a green dot, cash checked first. A missing field shows one amber line above the button, 0.875rem amber ink on amber-soft at 10px radius, padded 8px 12px: "Add <missing fields> so the shop can reach you.", and focus moves to the first missing field. The order is recorded for the admin as New.
- **Empty:** the empty-state box inside the body. It stacks the enlarged zero-fill mini battery, a title-size "Nothing in the cart yet.", one muted line, "Add something and it waits here, on this device.", and a ghost button, "Browse all products" to the all-products listing. On a listing page it reads "Back to the list" and closes the drawer instead.
- **Thank you:** checkout clears the cart and swaps the body for a left-aligned panel; the foot hides. A 72 by 32 mini battery fills from empty to full once over 0.8s on the house ease. "Thank you." sits at 1.75rem and takes focus. One sentence names the order first, "Order W-1001" in ink at weight 600, with its payment ("cash on delivery" or "by card"), then says in muted text that nothing was charged and nothing ships, and that the shop sees it in the admin as New when it was recorded. The ordered lines follow as hairline-divided muted body-small rows with no-wrap quantities, then a Total row in ink above a 2px ink rule, and a primary "Keep browsing" button that closes the drawer. Closing resets the panel.
- **Focus:** the drawer re-renders on every change and keeps keyboard focus on the equivalent control. When that control is gone, focus moves to the next line's remove button, then the heading, or to the thank-you title.
- **Storage:** items persist in localStorage under one key, `ampline.cart`, keyed by product ID, or product ID and the variant label joined by a pipe ("iphone-16|Teal · 256 GB").

### Filter Sheet and Rail
One native dialog renders two ways. On phones it is a modal bottom sheet: screen white, 28px top corners, the floating shadow over a 45% ink scrim, max 88% of the viewport tall, sliding up 24px from 0.6 opacity over 0.25s on the house ease. A hairline-ruled head holds the title and close button, the groups scroll, and a hairline-ruled foot holds a ghost Clear and a primary button that names the result count. From 1024px it renders static as the 280px left rail, transparent, with no shadow, close button or foot. The footer's Filters link opens the sheet on phones. The sheet itself never scrolls, only its groups do, so focusing a hidden input can never push the head off screen; on touch screens every chip in the strip is 44px tall (recorded 2026-10-11). The sheet and rail hold facets only; the device lives in the strip above the grid, so the Filters badge and the sheet's Clear leave it alone. The all-products page carries no Price group: Group is its price divider. A group whose live options drop under two collapses until the answer widens, so a fit answer never shows a rail of dormant brands (distill round, 2026-10-11).

The rail is derived, never authored per page:

- **Groups:** one per facet the category names, in the catalog's order. Output facets share the legend "Max output per port". The Price legend carries the amber SYNTHETIC pill.
- **Options:** the distinct values the listing's products carry, or fixed bands where raw values would not compare: watt bands, port options, Coverage (Up to / Over 200 m²) and Battery (Under a day / 1 to 3 days / Over 3 days).
- **Price bands:** three, set by the listing's top price, so chargers read Under $20 / $20 to $50 / Over $50 and phones Under $300 / $300 to $800 / Over $800.
- **Pruning:** a group stays only while it has two live options, so a one-product category shows a Fits-only rail or none.
- **Fits group:** the device radios, grouped by family, appear only on Accessories and Power categories and on the all-products listing. They lead the rail on category pages and follow Group, Brand and Price on the all-products listing, which is a search landing. A prose Fits spec facet is dropped wherever this group exists.
- **Counts:** every option shows its would-be count, read out to screen readers as "N results".

### Results Toolbar
A sticky strip at 60px on the translucent ground with a hairline bottom. It holds the count line, led by the mini battery filled to results over total, plus the Filters button and sort. The count reads "N of M <noun>" once anything narrows it, from the one shared table of category nouns that also sets the home counts ("1 case or mount, 2 cables, 1 hub or dock"), followed in muted body text by "for “q”" during a search and "fit <device>" with a device chosen. Applied chips follow below it.

### Empty State
A box padded 40px top and bottom and 20px at the sides, with the dashed off-grey border at 18px, centered. It stacks the enlarged zero-fill mini battery, a title-size line, a muted hint of at most 40ch naming the one filter, or the search, whose removal frees the most results, and a primary button to remove it beside a ghost Clear all filters. The title reads "Nothing matches “q”." when the search alone empties the list and "No <noun> matches all of these." otherwise. The hint reads "Removing “Under $50” shows 1 networking product." or "Clearing the search shows N products.", and the primary button "Remove <option>" or "Clear the search".

### Skeleton Tiles
Before data loads, tiles render as borderless blocks in empty-track at the 12px radius, pulsing to half opacity on a 1.2s loop, shaped like the figure, name, line, watt figure and button. On home five skeletons hold the best sellers at 420px, 460px from 1024px.

### Placeholders
The dashed placeholder pill names what is missing. In the footer it counts the unbuilt category pages once, as "N pages not built"; the product page review placeholder is the dashed box. Unbuilt destinations are never linked: their names stay muted text, and category tiles add a muted "· page not built" to their count instead of a pill.

### Footer: the screen asleep
The single dark block. Sleep-black ground, sleep-ink text, dim links whose underline turns green on hover, and a sleep-line rule above the base line. The Shop column lists all fifteen categories: built ones link, the rest are dim text, closed by one dashed "N pages not built" pill in the dim ink. Every category page is now built, so the column is all links and the pill does not render; the guard stays for any page removed later. A "This page" column carries in-page links, Filters and Results on listings; on product pages it lists only the sections that show. Every page shares the home page's prototype note.

## Do's and Don'ts

### Do:
- **Do** express any level of power or fit as a fill inside a rounded track or battery, cut with clip-path and eased on cubic-bezier(0.16, 1, 0.3, 1).
- **Do** draw icons as 24-grid strokes at 2px with round caps, and product figures as 120-grid strokes at 3px with green ports. Third-party devices without a figure of their own are drawn the same way, with green marks at their port or face.
- **Do** use pills for controls and status, hairlines for lists, and 18px cards on the grey ground.
- **Do** generate gallery drawings from the catalog on a 400 by 300 grid with 3px strokes, green ports, Readex Pro labels at 12 to 15 units and 1.5 unit muted dimension lines. Draw only what the spec sheet states; a slide whose spec is missing is left out, never filled in. Thumb crops drop the labels and thicken strokes to 7 to 10 units.
- **Do** label every synthetic value with the amber SYNTHETIC pill and every missing asset with the dashed placeholder pill. Never link an unbuilt page: name it in muted text and count it.
- **Do** show every filter option the listing's products carry with the count it would return, and grey out options that would return nothing instead of hiding them.
- **Do** show a battery only where an output or a published charge ceiling exists, and mark a device's ceiling indicative.
- **Do** let a chosen variant rename the product wherever it is bought (the h1, the Storage spec row, the phone buy bar, the cart line) while the page title and breadcrumb keep the SKU name, and say plainly when variants share one synthetic price.
- **Do** zero all transition and animation durations under prefers-reduced-motion.

### Don't:
- **Don't** add a second accent or use green as decoration; amber is for caution and synthetic only.
- **Don't** cast shadows on cards, tiles or chips; the floating layers are the cart drawer, the phone filter sheet, the row scroll buttons over a row's edge, and in the admin the order and product panel and the toast (extended 2026-10-11).
- **Don't** add a dark mode or another dark region; the footer is the screen asleep and the home announcement bar its status bar, both in the sleep colours.
- **Don't** fabricate product photography or borrow real brand logos; drawn line-art figures stand in until real photography exists.
- **Don't** use emoji or glyph characters as icons; every icon is an inline stroke SVG.
- **Don't** introduce a second typeface; Readex Pro carries display, body and figures, and the platform monospace stack is reserved for code inside notices.

## Responsive contexts (recorded 2026-10-11)

- **Hover is a pointer's affordance.** Every interactive hover state (chips, tiles, category cards, buttons, pager, dots, the guess link, row arrows, cart controls) lives under `@media (hover: hover)`, so a tap on a touch screen never leaves a control in its hover look.
- **Touch targets.** On coarse pointers the family, device and fit chips are 44px tall, the pager buttons and dots 44px squares (the dot's drawn pill stays 8 or 26px), and the guess link gains vertical padding.
- **A phone on its side** (height ≤ 480px, landscape): the header collapses to one 60px row with the search inline, the hero slide goes two columns, 1.2fr text to 1fr art, padded 20px 24px with no minimum height and a 180px art minimum, the title fixed at 1.75rem, and the hero padding tightens to 10px top and 32px bottom.
- **A short desktop window** (≥ 1024px wide, ≤ 700px tall): the slide's minimum height drops to 300px.
- **Safe areas.** The page wrapper pads by the larger of the gutter and the device's safe-area inset; home declares `viewport-fit=cover`.
- **Images.** Hero photos on slides after the first, category circle photos and tile photos load lazily.

## Motion on home (recorded 2026-10-11)

- **The answer charges.** When a family, device or model is picked, a 34px mini battery appears before "Fits <device>" and fills from empty to the share of the store's accessories and power products that fit, in the glyph's own 0.8s house ease, while the fitting tiles rise with their 40ms stagger and the rest dim over 0.25s without rising. Best sellers carry no battery. Each new pick charges it again from empty. Under reduced motion the fill lands at once; the state stays.
- **The first slide settles.** On arrival the first hero slide's render fades and settles 6px into place over 0.5s, once, figures 80ms apart on a slide of drawings; the other slides arrive by scrolling and do not animate. The settle rides the drawing or photo inside the figure box, never the box, so the staging transforms stay untouched.
- **Everything else is feedback at routine speed:** chips change border, fill and colour in 0.2s, the current dot recolours in 0.2s, the pager and the tap-scroll use smooth scrolling that falls back to instant under reduced motion.

## Admin (recorded 2026-10-11)

The back office at admin/ is the Charging Lock Screen in an operating register: the same daylight ground, white hairline panels, one family and pills, run at a fixed rem scale and table density. Its tokens come from the storefront stylesheet; admin.css adds only the shell, tables, panel and form vocabulary. Every order and stock state is a battery with its word beside it.

### Shell
- **One column below 1024px.** The main area pads 16px with 84px plus the safe area at the bottom, so the last row clears the bottom bar.
- **Sidebar from 1024px.** The grid becomes a 236px column beside a minmax(0, 1fr) main padded 24px 32px 56px. The sidebar is sticky at the top, the full dynamic viewport tall, screen white with a hairline right edge, padded 18px 14px 16px. It stacks the wordmark with a hairline "Admin" role pill, five section links, and a hairline-topped foot.
- **Section links.** Each is 40px tall at 12px rounding, 0.9375rem weight 500 in muted slate with a 20px stroke icon, 2px apart. The current link fills with the daylight ground, turns ink at weight 600, and its icon turns green ink. The Orders link carries a 22px green-ink pill with the count of New orders in ground-colored 0.75rem weight 700, hidden at zero.
- **Sidebar foot.** "Open the storefront", "Reset demo data" and "Sign out" share the link style. Reset takes two taps: the first arms it in amber-soft with amber-ink text reading "Confirm reset" for 4 seconds.
- **Bottom bar below 1024px.** It is fixed to the bottom, 60px plus the safe area, five equal columns on the 92% translucent ground with a 12px blur and a hairline top. Each item is a 22px icon over a weight 600 label that truncates. The current item is ink with a green-ink icon. The bar names the catalog section "Catalog" where the sidebar says "Categories & devices".
- **Demo note.** The first line of every view: the amber SYNTHETIC tag, then a 0.8rem muted sentence such as "40 synthetic orders; prices and stock are placeholders." It adds the date shift when the seed's dates were moved to end today, and says when storage is off.
- **View head.** An h1 at 1.5rem weight 700, line height 1.2, over a 0.875rem muted line. List views lead that line with a 30 by 11px mini battery filled to shown over total, as in "40 of 40. A row opens the order." A primary action sits at the right at 40px. Route changes move focus to the h1 with no ring.
- **Loading.** Four empty-track blocks at 18px rounding, 96px tall with the fourth at 240px, pulse on the storefront's 1.2s skeleton loop.

### Admin type ramp
The admin does not use the fluid ramps. Its fixed steps are the view title (1.5rem, 700), the panel title (1.125rem), the card title (1rem, 600, 1.3), panel body text (0.9375rem), meta lines (0.8125rem), table text (0.875rem), and table heads, sub-lines and chart ticks (0.75rem). The stat figure takes the storefront's 1.75rem step at weight 700, -0.02em, line height 1.1, tabular. Admin headings tighten to -0.01em. This ramp is the admin's own; the Five Steps Rule still governs the storefront.

### Stat Tile
A link card per figure: screen white, 18px, hairline, padded 12px 16px 10px (12px 18px 10px from 720px), at least 92px tall. A 0.8rem weight 600 muted label leads, then the figure, a 0.8rem muted sub-line, and "See list" at 0.8rem weight 600 ink with a 14px arrow. A tile that needs a hand leads its label with an 8px amber dot: Orders today while any order is New, Cash to collect while any cash order is open. The stock tiles lead with a 24 by 10px mini instead, low in amber, out dormant. Hover darkens the border to ink on hover pointers. Six tiles sit two to a row with a 10px gap, three from 720px with a 12px gap: Orders today, This week, Revenue over 30 days, Cash to collect, Low stock and Out of stock, each linking to its filtered list.

### Cards and the Sparkline
- **Card.** 18px, white, hairline, padded 16px 18px, 14px apart. Its head holds a 1rem weight 600 title and either a 0.8rem muted count or a 0.875rem weight 600 link. From 1024px the dashboard pairs the sparkline and latest-orders cards at 1fr to 1.5fr; catalog and settings pair two cards at 1fr 1fr.
- **Sparkline.** A full-width inline drawing of orders per day over 30 days: a charging-green-soft area under a 2px charging-green line with round joins, a 2.5px green dot on each day with orders, and a 4px ink dot on today. Five 0.75rem muted tabular date ticks sit under it at days 0, 7, 14, 21 and 29, the end ticks pinned to the edges. A meta row reads "Peak N on <day>" at the left and "Today N" at the right.

### Toolbar
A wrapping row, 8px by 10px gaps: status or stock chips in the device chip grammar with their counts (pressed inverts to ink with a green dot), an applied chip for a scope set from the dashboard, a 40px category select, and a 40px search pill. The search grows from 220px to at most 360px; while it holds focus its border goes ink and it takes the global 3px green ring. Below 720px the toolbar is one column and the chip row scrolls sideways edge to edge with no scrollbar.

### Data Table
- **Frame.** A white hairline box at 18px that scrolls sideways when it must. Text is 0.875rem.
- **Heads.** 0.75rem weight 600 muted, padded 10px 12px, never wrapping, over a hairline.
- **Cells.** Padded 9px 12px with hairline rows and no rule under the last. Numbers align right in tabular figures and never wrap. A sub-line sits under the value as a 0.75rem muted block. Order ids and dates never wrap; product names may. Links are weight 600 with no underline, underlined on hover.
- **Rows.** An order row opens its panel on click, and on hover pointers the row fills with the daylight ground. The latest-orders card tightens cells to 7px 12px.
- **Selection.** Product rows lead with a 36px column holding an 18px checkbox in ink.
- **Phone cards below 720px.** The head hides and each row becomes a block padded 12px 14px between hairlines. Each cell becomes a two-column grid: a 6.5em label column showing the column name in 0.75rem weight 600 muted, then the value, 12px apart on a shared baseline, with any sub-line beneath the value. The lead cell spans the card with no label: the order id or product name, then a line 6px below with the status battery at the left and the total at 1rem weight 700 at the right. The separate Total and Status cells hide. A product card reserves 48px at the end for its checkbox, pinned 14px from the edge. Under a coarse pointer cells pad 4px.

### Status Battery
The word always sits beside the glyph. A status is an inline row, 8px apart, weight 600, never wrapping: a 26 by 11px mini battery (2px ink outline, 5px radius, 3px nub) and the word.

- **Orders.** New is empty. Packed fills to 0.34 and Shipped to 0.67. Delivered fills full and its word turns green ink. Cancelled goes dormant: off-grey outline and nub, empty, word muted.
- **Late.** A Packed or Shipped order at least 3 days old adds a "Day N" mark: an amber-soft pill, 0.72rem weight 700 amber-ink, padded 1px 7px, titled "Past the 1 to 3 day delivery promise". A New order is never marked late.
- **Stock.** In stock fills full green. Low stock fills to 0.22 in amber. Out of stock goes dormant with an off-grey outline and no fill.
- **Payment.** The payment line sits at 0.8125rem. An open cash-on-delivery order reads "Cash on delivery, to collect" in amber ink at weight 600.

### Panel
One native dialog shows an order or a product form. Below 720px it is a bottom sheet: full width, at most 92% of the dynamic viewport tall, 28px top corners, sliding up 24px from 0.6 opacity over 0.25s on the house ease. From 720px it is a full-height right-edge drawer, min(480px, 100vw) wide, square, sliding in from the right. Between 720px and 1024px the drawer opens over the bottom-bar layout. It carries the floating shadow over the 45% ink scrim and clips its overflow. A head row, padded 16px 20px 12px over a hairline, holds the 1.125rem title and the 36px round close button. The body scrolls on its own, padded 10px 20px and 20px plus the safe area at the bottom. When it holds a form, the bottom padding drops to zero so the sticky foot owns the edge.

### Order Detail
- **Top row.** The status battery and its word over a 0.8125rem muted "Placed <date>, <relative>" line, with the order battery at the right.
- **Order battery.** 76 by 28px with a 3px ink border at 8px radius and a 5px ink nub set 8px outside, inset 6px top and bottom. A green fill inset 3px at 3px radius is cut by clip-path to the status level and charges over 0.8s on the house ease. Cancelled turns the border and nub off-grey. Advancing an order charges the fill to the next level first, then the panel re-renders 420ms later and a toast confirms it.
- **Stepper.** Four equal columns, 6px apart, for New, Packed, Shipped and Delivered. Each is a 5px bar at 3px radius over a centered 0.72rem weight 600 word. Done steps are green with green-ink words, the current step is ink, steps ahead are empty track with muted words. Bars recolor over 0.3s. A cancelled order shows no stepper. A reason box replaces it: off-grey-soft at 12px, padded 10px 14px, "Cancelled." in bold then the reason.
- **Actions.** 44px buttons: a primary "Mark packed", "Mark shipped" or "Mark delivered", and a ghost "Cancel order" while the order is open.
- **Cancel form.** A dashed off-grey box at 12px, padded 12px 14px. It holds a 0.8125rem weight 600 label, "Why is it cancelled?", over a required select of six reasons. Below it sit a primary "Confirm cancellation" and a ghost "Keep the order".
- **Facts.** A key-value list with a 7.5em muted weight 600 label column, 6.5em below 720px, at 0.875rem: customer, phone, address, payment.
- **Lines.** Hairline rows at 0.875rem with the variant as a 0.75rem muted line under the name, quantity times price and the line total right-aligned in tabular figures. A hairline-topped Total row at weight 600 with a 1.25rem figure follows, then a muted note with the SYNTHETIC tag. History closes the panel as 0.8125rem muted rows, each status in ink at weight 600 with its date at the right.

### Inline Edits
- **Price.** A cell input 6.5em wide and 36px tall at 10px radius with a hairline, 0.875rem tabular figures aligned right. Focus turns the border ink. It saves on change. An invalid price raises a toast and reverts.
- **Stock.** A 36px pill select at 0.8125rem weight 600 with a 14px muted chevron, led by the 26 by 11px stock mini, which updates as the value changes. Low stock sets the select's text in amber ink, out of stock in muted.
- **Touch.** Under a coarse pointer the cell input, the cell select, list inputs and list Save buttons grow to 44px.

### Bulk Bar
It shows once any product row is selected. It is an ink pill padded 8px 10px 8px 16px with "N selected" in ground-colored 0.875rem weight 600. It holds a 34px "Mark out of stock" button in ground color with ink text (not green: green means power or fit), and a ghost Clear with no fill, ground text and a sleep-line border.

### Forms
- **Field.** A 0.8125rem weight 600 label stacked 6px above its control, with an optional 0.75rem muted hint. Fields sit 14px apart.
- **Input.** 40px, 10px radius, hairline, 0.9375rem weight 400, padded 0 12px. Focus turns the border ink. Read-only inputs fill with the ground in muted text. A textarea starts at 72px.
- **Selects** in a field are the storefront's 40px pill select at full width.
- **Pairs.** Field pairs split two columns 10px apart, one below 720px.
- **Spec rows.** A 0.8fr / 1.2fr / 36px grid with a round 36px remove button, and a 34px ghost "Add spec" below.
- **Fits.** Device checkboxes grouped by family under 0.75rem weight 700 muted names, in two columns, one below 720px. Fit written as prose in the catalog shows as 32px applied chips. The price label carries the SYNTHETIC tag.
- **Sticky foot.** It sticks to the bottom of the panel on white over a hairline, padded 12px 0 and 16px plus the safe area. It right-aligns 44px buttons: a ghost Cancel and the primary "Save product" or "Add product".

### Catalog Lists
Two cards, Categories and Devices. Rows sit 8px apart between hairlines on a 1fr / auto grid. Each holds a 36px input for the name and a 36px Save button that stays hidden until the row is edited. A 0.75rem muted line spans beneath. Devices group by family under a 0.75rem weight 700 muted heading over a hairline. Model rows indent 18px. An add form closes each card under a hairline: a 0.875rem title, fields, and a 40px button.

### Settings
One form card holds Store name, a read-only currency field and the three trust lines, which default to "Delivery across Lebanon in 1 to 3 days", "1-year warranty" and "Card or cash on delivery". A toggle row follows: a hairline top, padded 12px 0, the 0.9375rem weight 600 name over a 0.8rem muted sub. "Arabic edition" is marked with the dashed "planned" placeholder pill beside a disabled switch. The switch is a 44 by 26px empty-track pill with a 20px white knob at 0.7 opacity. A second card carries the demo actions as ghost buttons.

### Sign-in
The stub centers in the viewport with 24px of padding. Its card is min(440px, 100%) wide, white, hairline, 28px rounding, padded 28px with 14px gaps. It stacks the wordmark, the h1 "Admin" at 1.75rem, a muted sub, the big "Enter demo" button, and a 0.8rem muted note led by an 18px amber-ink warning icon. The note says there is no authentication and edits stay in this browser.

### States
- **Error box.** It replaces a view's content under its h1 when a data file fails to load. It has an amber border on amber-soft with amber-ink text at 12px radius, padded 14px 16px, at 0.9375rem, led by a 20px warning icon. The first line is bold: "content/orders.json could not be loaded". File paths sit in the platform monospace at 0.875em. It is an alert.
- **Empty.** The storefront's dashed empty box with a zero-fill mini, a 1.125rem title, a 0.875rem muted hint of at most 36ch, and a ghost button: "No orders match." with "Show all orders", or "No products match." with "Show all products".
- **Toast.** A centered ink pill padded 10px 18px, ground-colored 0.875rem weight 600, with the floating shadow, rising 8px over 0.25s. It sits 76px plus the safe area above the bottom below 1024px, clearing the bar, and 24px from 1024px. It holds for 2.6 seconds and is a status region.
- **Reduced motion.** The battery and step transitions and the panel, toast and skeleton animations stop.

### Storefront handoff
Every admin edit lives in one localStorage key, `ampline:admin:v1`. The storefront layers it over the catalog on load: prices, stock, renamed categories and devices, and added products. A storefront checkout writes its order into the same key as New, with ids from W-1001; the seed's ids run A-1001 to A-1040.

### Named Rules
**The Word Beside the Glyph Rule.** A status battery never stands alone in a cell; its word sits beside it, and the word carries the color when the state is final (green ink for Delivered, muted for Cancelled).

**The Attention Amber Rule.** In the admin, amber also marks what needs a hand: the new-orders dot, cash to collect, a late order, an armed reset and an error. It never marks a finished state.
