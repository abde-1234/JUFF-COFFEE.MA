# Multi-product WhatsApp cart — verification

Implemented and tested against the actual `npm run build` output served by `npm run preview`.

## French / Arabic update

- Updated `index.html`, `script.js`, `style.css`, and `cart.js`. The shared `translations` dictionary begins at `cart.js:4`, with `fr` and `ar` entries and an `offer_text` mapping. Static content uses `data-i18n`; accessible labels and image descriptions use `data-i18n-aria` and `data-i18n-alt`. Dynamic cart, validation and WhatsApp text use the same dictionary.
- French is the default. The header FR/AR buttons update the page in place, set `html.lang` and `html.dir`, and persist the choice as `juffLanguage:v1`. Invalid or unavailable language storage falls back to French. Unavailable storage still allows switching within the current page.
- Switching preserves selected product types, quantities, selected offer options, active category and saved cart data. Product names, brand artwork, metric codes and original prices remain intact.
- Final production preview tested in Chrome at **320, 390, 760, 1024 and 1440px in both languages**. All four categories passed overflow and control-boundary checks; headers and cart dialogs fit. Arabic navigation and RTL arrow-key navigation passed.
- Real checkout clicks captured exactly one WhatsApp URL per checkout. Decoded French and Arabic messages matched the expected full mixed order, including translated greeting, order title, type/value/price/quantity labels and offer options. The destination remains `212631139014`; no message was sent.
- Verified language and cart reload persistence, no preselected product type, translated inline validation (including an already visible error), quantity changes, removal, clearing, disabled empty checkout, all eight offers, and unitless SV/PV values. The original French cart regression flow also passed.
- Corrupt storage recovery and blocked-storage behavior passed. All 64 menu images decoded. **Zero application console errors** were recorded.
- `npm run build` passed with the extended bilingual regression tests. Final production asset audit passed: **85 files / 4,746,958 bytes**. Approved product/contact data remains unchanged; canonical, social and sitemap URLs still use `https://juff-coffee-mia.vercel.app/`.
- Repeatable browser checks: `tools/test-i18n-browser.mjs`, exporting `i18nChecks(page, context, outgoing)`. Use a fresh context against the production preview and intercept WhatsApp requests locally. Evidence: `audit-results/i18n.json`; visual captures: `audit-results/i18n-cart-ar-320.png` and `audit-results/i18n-ar-1440.png`.

The sections below describe the original cart verification; the bilingual checks above cover the current implementation.

## Behavior

- All 56 standard cards start with **no selected type**. Clicking Ajouter without a type now shows “Veuillez choisir un type avant d’ajouter ce produit.” (or its Arabic translation) and leaves the order unchanged.
- Select options use the existing product values. DP/RP retain MAD; SV/PV do not gain a currency. Successful additions reset the card's type selector to blank.
- Quantities are integers from 1 to 99. Zero, negative, nonnumeric, fractional and excessive values cannot enter the cart. Repeated identical lines merge only within this range; an excessive addition is rejected without modifying the existing line.
- Product plus type identifies a product line. Offer plus selected options identifies an offer line. Different types or offer configurations remain separate.
- The order panel supports quantity changes, removal, clearing and one WhatsApp checkout containing all lines. No combined total is invented. Empty checkout is disabled.
- The cart is saved with a versioned `juffOrderCart:v1` key. Reload restores valid lines from current approved data while product selectors remain blank. Corrupt storage is ignored; unavailable storage retains a working in-memory order and displays a persistence notice. No personal information is stored.

## Actual browser checks

- Chrome production preview: **320, 360, 375, 390, 393, 412, 430, 768, 1024, 1440px**.
- At every width: blank-type rejection, explicit DP selection, quantity changes, addition, cart review, removal, disabled empty checkout, and actual new-tab WhatsApp navigation passed.
- All four categories retained the two-column standard-product layout, with no horizontal overflow or controls outside cards. The cart fits the screen, scrolls longer lists, and keeps checkout accessible.
- The exact requested sequence passed: Kiwi RP ×2, Cordyceps DP ×1, Maki RP ×2; change Kiwi to ×3, remove Cordyceps, add Formule Gourmand with Lion’s Mane/Nutella ×2, reload, then checkout.
- The captured message contained Kiwi **RP — 21,00 MAD ×3**, Maki **RP — 40,00 MAD ×2**, and Formule Gourmand **50 MAD ×2** with the selected options. These are the actual stored menu values.
- Additional browser checks verified separate Cordyceps DP/RP lines, merging only matching types, unitless Kiwi SV/PV, all eight offers in one order, and corrupt/blocked storage fallbacks.
- Destination: **212631139014**. New-tab requests were captured and decoded to verify accents, emoji, punctuation and line breaks without double encoding. No WhatsApp message was sent.
- Keyboard Enter opens the cart; Escape closes it. Select labels, quantity/removal labels and native dialog behavior remain accessible. No duplicate IDs or unlabeled selects found.
- **Zero application console errors.**

## Regression and build

- 56 products, 224 pricing values, 56 mapped product visuals, 8 offers, zero visible image placeholders.
- Approved menu/contact data and existing SEO metadata matched the Git baseline. Facebook, video assets and menu categories remain unchanged.
- `npm run build` succeeded (Windows `npm.cmd` launcher), including syntax checks, data validation and real cart-model tests.
- Production output: **85 files / 4,717,502 bytes**. Every output asset returned HTTP 200 and matched disk contents. Video byte-range support and canonical/social/sitemap output passed.
- Unit tests exercise mandatory selection, all 224 values, invalid quantities, merging, mixed units, option snapshots, restoration and malformed persisted data.

## Files and evidence

- Feature: `index.html`, `script.js`, new `cart.js`, `style.css`.
- Build/tests: `package.json`, `tools/test-cart.cjs`, `tools/test-cart-browser.mjs`, `tools/validate-step9.cjs`, `tools/audit-production.mjs`, `tools/audit-static.cjs`.
- Documentation: this report, `DEPLOYMENT.md`, `assets/README.md`.
- Visual checks: `assets/cart-mobile-390.png`, `assets/cart-desktop-1440.png`.
- Detailed local browser evidence: `audit-results/cart.json` (not deployed).

Run `npm test` to rerun the model tests. `tools/test-cart-browser.mjs` exports `cartChecks(page, context, outgoing)` for the supplied Playwright browser setup; the navigation-capture route must record WhatsApp requests in `outgoing` and fulfill them locally.
