# Juff Coffee deployment audit

This is the pre-cart deployment baseline. The newer multi-product cart changes and production-browser verification are recorded in [CART-VERIFICATION.md](CART-VERIFICATION.md); the current build contains 85 files. Counts and screenshots below describe the earlier baseline.

Final status: **READY FOR DEPLOYMENT**

Production URL: https://juff-coffee-mia.vercel.app/

## Build and preview

- `npm run build` succeeded through the Windows `npm.cmd` launcher: zero errors or build warnings.
- Output: **84 files, 4,704,449 bytes (4.49 MiB)** in `dist/`.
- `npm run preview` was used to test the actual `dist/` output over HTTP, not the source/development server.
- This is a static HTML/CSS/JavaScript site. The added build and preview use Node built-ins; no framework, runtime dependency, or dependency upgrade was needed.
- Vercel configuration sets `npm run build` and the `dist` output directory. No public deployment was performed during this audit.

## Confirmed fixes

- Added the missing package/build/production-preview configuration and Git exclusions.
- Configured the supplied production domain in `package.json`. The build emits absolute canonical, Open Graph, Twitter image, and JSON-LD URLs, a valid sitemap, and a robots sitemap reference.
- Removed desktop overrides that changed the required two-column product grid to three/four columns.
- Constrained the product-image grid row: oversized implicit rows had clipped the approved images inside their fixed-height frames. Images now fit without changing the assets or card dimensions.
- Darkened pricing-label and WhatsApp background colors slightly to correct measured text contrast: **4.83:1** and **4.71:1**, respectively.

## Verification

| Area | Actual result |
| --- | --- |
| Data | 56 products, 56 mapped WebP visuals, 224 original pricing values, 8 offers, zero displayed placeholders. Product data and all image bytes preserved. |
| Source integrity | `index.html` and `script.js` match the original Git content, including all names, prices, and ordering logic. |
| Assets | All 84 output files returned HTTP 200 and matched disk bytes. All 64 product/offer images decoded in Chrome. No image, font, poster, or video 404s. |
| Discovery | Correct Kiwi Lime Juice, Ordinary Coffee vs Mushroom Coffee, and sushi visuals. Equal-height frames and `object-fit: contain`; visually reviewed. |
| WhatsApp | Only destination `212631139014` found. Browser clicks covered beverage, food, sushi, all 8 offers, quantities, selected options, and all 3 general contact links. Captured new-tab URLs and exact decoded messages; no messages sent. |
| Social links | Facebook actions opened the configured destination in new tabs. External navigation was intercepted for inspection. All blank-target links include `noopener noreferrer`. |
| Chrome widths | 320, 360, 375, 390, 393, 412, 430, 768, 1024, 1440px. All four categories passed at each width; no horizontal overflow, clipped prices, or product images outside their frames. |
| Edge | Major ordering and navigation flows passed at 390 and 1440px. Firefox was not installed. |
| Controls | Mobile menu opening/closing, category navigation, quantity changes, selectors, order dialogs, and footer passed. Arrow keys, Enter, Escape, and visible focus verified. |
| Video | 24.71-second, 480px-wide video played and paused on mobile and desktop. No initial video request; mobile waits for a click, desktop waits until near the viewport. `preload="none"` retained; byte-range requests return 206. |
| Console/network | Zero application errors, console warnings, or HTTP asset errors. Rapid navigation/resizing canceled some pending image requests with `ERR_ABORTED`; every affected asset passed subsequent loading and the complete resource audit. |
| Accessibility/HTML | One H1; no duplicate IDs, nested links/buttons, missing image alt attributes, unlabeled selects, or unlabeled ordering actions. Quick structure/keyboard checks, not a full accessibility certification. |
| SEO | Title, description, language, viewport, robots, favicon, theme color, OG and Twitter metadata present. JSON-LD parses successfully and contains no invented ratings, reviews, address, telephone, or opening hours. |
| Domain | Canonical/OG base is the confirmed Vercel URL. Generated sitemap and robots use the same URL. The legacy placeholder sitemap template is source-only and excluded from `dist/`. |
| Security/hygiene | Credential-pattern scan found no secrets. No machine paths, localhost URLs, `.env`, Git metadata, build tools, source artwork, or audit screenshots in production output. `.gitignore` excludes dependencies, output, environment files, OS metadata, and local audit results. |

## Performance observations

Lighthouse was not installed; no Lighthouse scores are claimed. These are single local, unthrottled Chrome measurements, not mobile-device benchmarks or real-world CrUX results.

| Viewport | LCP | CLS | Initial resource transfer | Long tasks |
| --- | --- | --- | --- | --- |
| 390px | 172 ms | 0.0141 | 554,199 bytes | One 61 ms task |
| 1440px | 300 ms | 0 | 441,830 bytes | One 169 ms task |

No initial video download, external font requests, or duplicate large resource downloads occurred. Fonts use the existing system stacks. Product WebPs average 26,127 bytes; the largest is 91,216 bytes. Lazy loading and asynchronous decoding remain enabled; only 8/6 product images were requested during the initial mobile/desktop samples. The responsive hero is eager, dimensioned, and high priority. The observed startup long tasks are recorded for follow-up; no production-blocking performance issue was found.

## Evidence and reproduction

- Screenshots: `assets/deployment-final-mobile-390.png` and `assets/deployment-final-desktop-1440.png`.
- Local detailed results: `audit-results/chrome.json`, `audit-results/msedge.json`, `audit-results/static.json` (intentionally ignored by Git and excluded from deployment).
- Run `node tools/audit-static.cjs` while the production preview is running to recheck built resources, metadata, data/source integrity, video ranges, and credential patterns.
- `tools/audit-production.mjs` exports `createAudit(playwright, channel)` for an externally provided Playwright installation; browser audit tooling is not a production dependency.

**Deployment blockers: none found in the tested production output.** Publish `dist/`; retain the configured production URL.
