# Juff Coffee — Steps 1–8

Open `../index.html` directly in a modern browser. No installation, build step, framework, or external network dependency is required for the homepage.

## Structure

- `index.html`: semantic homepage, poster-style hero, experience video, featured promotions, navigation, contact dialog, menu tab panels, bottom social strip, and reusable product card template.
- `style.css`: mobile-first poster layout, design tokens, compact two-column product cards, responsive media layouts, and reduced-motion support.
- `script.js`: real product data and image paths, deferred video loading, menu rendering and keyboard navigation, mobile navigation, dialogs, and business contact configuration.
- `assets/logo.svg`: scalable J monogram and botanical logo, also used as the favicon.
- `assets/icons/`: 16px, 32px, Apple touch, 192px, and 512px logo-derived application icons.
- `assets/social/juff-coffee-og.webp`: optimized 1200×630 branded social-sharing image derived from the approved hero and logo.
- `images/hero/`: responsive WebP hero assets and the archived previous hero.
- `images/products/`: selected product-only WebP crops organized by category.
- `assets/products/generated/`: 49 optimized 512×512 WebP product photographs generated for the products that previously used placeholders.
- `images/promos/`: three complete promotional WebP images used in the featured section.
- `video/juff-coffee.mp4`: optimized, silent 480px-wide H.264 video (approximately 2.06 MB).
- `video/juff-coffee-poster.jpg`: lightweight poster shown while the video is deferred.
- `robots.txt`: production-safe crawler access without an invented sitemap URL.
- `sitemap.xml.template`: single-page sitemap template awaiting the production domain.
- `site.webmanifest`: lightweight site metadata and icons; no service worker is installed.

## Scope and next step

The homepage and real menu are implemented: 28 Beverages, 14 Food, and 14 Sushi products (56 total). Names and numeric values follow the supplied Step 3 written list exactly, including where it differs from the photographed menus. RP is the prominent selling price in MAD. DP is a secondary MAD value; SV and PV appear without currency. All values display two decimal places using French number formatting. No sample descriptions or promotional badges are retained.

“Voir le menu” opens Beverages; header category buttons select the matching category and scroll to the menu. Only the selected panel is visible. The sticky category buttons follow the ARIA tabs pattern: Left/Right arrows wrap between categories, Home/End select the first/last, and Enter/Space also activate a focused button. Tab moves from the active category into its panel. Transitions respect reduced-motion preferences.

## Edit products and replace image placeholders

Edit `MENU_PRODUCTS` near the top of `script.js`. Each category contains an array; add, remove, or replace objects there. No card markup or CSS needs to be duplicated.

```js
{ name: 'Your product', dp: 22.00, rp: 28.00, sv: 8.00, pv: 1.00,
  image: 'images/product.jpg',
  imageAlt: 'A description of the photograph',
  description: 'Optional short description.', badge: 'Popular' }
```

Keep `dp`, `rp`, `sv`, and `pv` numeric. `rp` replaces the previous sample `price` field; the renderer uses it as the selling price and adds MAD. Put photographs in `images/`, and use their relative paths in `image`. Empty or failed images display the neutral photo placeholder. `imageAlt` defaults to the product name. `description` and `badge` may be omitted or left empty. Keep category keys `Beverages`, `Food`, and `Sushi`.

All 56 products now have a dedicated image. Seven approved real product images remain mapped exactly as before: Cordyceps Coffee, Lingzhi Black Coffee, Lemonzhi Juice, Kiwi Juice, Spirunanas Cake, Maki, and Cucumber Maki. The other 49 entries use optimized generated product photographs from `assets/products/generated/`. Promotional prices and Arabic copy were cropped out of the approved card images so the product data in `MENU_PRODUCTS` remains authoritative. In particular, the uploaded Lemonzhi and Spirunanas promotional prices differ from the supplied menu data; the website continues to show the Step 3 values of 15 MAD and 28 MAD.

The renderer still contains its resilient fallback for a failed image request, but no menu entry has an empty image path. Generated square photographs use `object-fit: contain`; approved promotional crops retain their existing presentation.

Card structure lives in `#product-card-template` in `index.html`. Menu styling is grouped under section 08 in `style.css`. Without JavaScript, the menu displays an explanatory note and the existing social links remain available.

Step 6 keeps the data-driven renderer and adds the visual structure from the supplied poster: a compact split hero, cream paper-like surfaces, brown curved separators, decorative leaves and coffee beans, brush-style category banners, image-left product cards, and a side-by-side WhatsApp/Facebook strip at the bottom. The product grid deliberately stays at two columns on every supported viewport. Select a category tab to display its matching brush banner and product list.

The exact supplied WhatsApp and Facebook URLs are set in the HTML for resilience without JavaScript. Their configuration also lives at the top of `script.js`; update both locations if the business details change. Social links open in a new tab with `noopener noreferrer`.

The navigation supports keyboard focus, Escape, click-away dismissal, and breakpoint changes. Dialogs use the native HTML `dialog` element for modal focus management and Escape dismissal. No trackers, cookies, third-party scripts, or external fonts are used.

## Visual assets

The current hero uses responsive WebP versions of `Image ChatGPT 25 sept. 2026, 19_28_24.png`. The previous hero remains archived under `images/hero/previous-iced-coffee.*` and is not downloaded by the page.

Seven of the ten supplied promotional JPEGs were used. Three were intentionally omitted because stronger variants covered the same products: `19.29.51 (1)` and `19.29.54 (1)` duplicate the Lingzhi coffee theme, while `19.29.54` duplicates Lemonzhi. The featured section uses the full Kiwi Juice, Cordyceps Coffee, and Maki promotions at a size where their Arabic text remains readable. Card images use product-only crops and preserve aspect ratio with `object-fit: cover`.

The 24.63-second uploaded video appears below the introduction in “L’expérience Juff Coffee.” Its audio was removed and the MP4 reduced from approximately 2.86 MB to 2.06 MB. It has no initial `src`: an intersection observer loads and autoplays it only on desktop when the section approaches the viewport, reduced motion is not requested, and data saver is off. Mobile and reduced-motion users see the 59 KB poster until they press the accessible play control.

## Verification

Step 1 was verified in local headless Chrome at 320, 375, 390, 768, 1024, and 1440 pixels. Its original screenshots are `preview-1440.png` and `preview-390.png`. Browser QA tooling is not shipped as a website dependency.

Step 2 passed local Chrome checks at 320, 375, 390, 560, 768, 1024, and 1440 pixels across all three categories: four cards per panel; one selected tab and visible panel; no horizontal overflow; keyboard wrapping, Home/End, Enter/Space and Tab; hero/header category navigation; mobile navigation; contact dialog and focus restoration; exact social URLs; sticky filters; reduced-motion support; no JavaScript errors; and the no-JavaScript explanatory fallback. Menu screenshots `menu-preview-390.png` and `menu-preview-1440.png` were visually reviewed.

Step 3 passed local Chrome checks at the same seven widths across all categories. All 56 names and 224 numeric values were compared directly against the supplied written list, including sushi piece counts. Verified RP as the main price, secondary DP/SV/PV, 56 intentional photo placeholders, no page or card text overflow, single active category, keyboard/focus behavior, hero/menu entry points, mobile navigation, contact dialog, exact social URLs, and reduced motion. No console or JavaScript errors were observed. Current screenshots `real-menu-390.png` and `real-menu-1440.png` were visually reviewed. Earlier screenshots document earlier steps only.

Step 5 passed local Chrome checks with all 56 products and prices unchanged: 7 mapped product images, 49 placeholders, 3 featured promotions, responsive hero sources, mobile poster-only behavior before opt-in, deferred desktop autoplay, play/pause control, all three categories, mobile navigation, contact dialog, and exact social URLs. The complete page was checked at 320, 375, 390, 560, 768, 1024, and 1440 pixels with no horizontal overflow or console/JavaScript errors. Every used image decoded successfully. Current media screenshots under `assets/media-*.png` were visually reviewed; browser QA tooling is not shipped as a website dependency.

Step 6 passed local Chrome checks at 320, 360, 375, 390, 393, 412, 430, 768, 1024, and 1440 pixels. All 56 names and 224 numeric values were compared with the supplied written menu. The seven exact image assignments and 49 placeholders remain unchanged. Each category preserves a two-column grid with no card-text clipping or horizontal overflow. Category selection, keyboard navigation, the mobile menu, mobile video opt-in, exact social URLs, image decoding, and console output were also verified. `step6-mobile-390.png` and `step6-menu-1440.png` are the final visual QA captures.

Step 7 generated and reviewed 49 dedicated product photographs, including a regenerated two-piece Tamago Nigiri after the first result showed an incorrect quantity. The images were resized to 512×512 WebP at quality 80; together they weigh approximately 1.01 MiB. Local Chrome validation passed at 320, 360, 375, 390, 393, 412, 430, 768, 1024, and 1440 pixels: 56 products, 224 unchanged values, 7 preserved approved mappings, 49 generated mappings, no visible placeholders, no broken or distorted images, two columns at every width, no overlap or horizontal overflow, working category/mobile/video/social behavior, and zero console errors. Final captures are `step7-mobile-390.png` and `step7-menu-1440.png`.

## Step 8 production polish

The document head now includes a concise French title and description, crawler directives, theme and color-scheme metadata, favicon and Apple touch icon references, a manifest, Open Graph metadata, Twitter card metadata, and a canonical configuration. A 1200×630 WebP share image was derived from the approved Juff Coffee hero and logo. JSON-LD identifies Juff Coffee as a `CafeOrCoffeeShop` and exposes a concise `Menu` with Beverages, Food, and Sushi sections. Unconfirmed address, hours, ratings, coordinates, telephone, delivery information, and price range were intentionally omitted.

Accessibility improvements preserve the Step 6 appearance: product headings now follow the category headings at the correct semantic level, the video button explicitly controls the video element, existing descriptive social-link labels are preserved, and keyboard focus uses a high-contrast double indicator. The WhatsApp green and small footer text were minimally darkened to reach stronger text contrast. Reduced-motion behavior, native dialog focus, skip navigation, ARIA tabs, mobile-menu state, and product alt text remain active.

The hero remains the LCP candidate and keeps its responsive WebP sources, explicit dimensions, non-lazy loading, conditional preloads, asynchronous decoding, and high fetch priority. Product images retain explicit dimensions, lazy loading, asynchronous decoding, and low fetch priority. A fresh mobile load requested the 28 images in the active Beverages panel while the 28 images in hidden Food and Sushi panels remained unloaded. The mobile video retained no `src` before voluntary playback; on desktop it loaded and autoplayed muted only after approaching the viewport. No framework, external font, tracker, cookie, service worker, or additional runtime dependency was introduced.

Local headless Chrome measurements at 390×900 on a `file://` build reported FCP 584 ms, LCP 584 ms, DOMContentLoaded 145 ms, and CLS 0. These are local laboratory observations and cannot predict field Core Web Vitals or network performance. Lighthouse was not installed in the environment, so no Lighthouse score is claimed.

Production regression checks passed in Chrome and Edge at 320, 360, 375, 390, 393, 412, 430, 768, 1024, and 1440 pixels. They verified 56 products, 224 unchanged values, 7 approved image mappings, 49 generated image mappings, zero placeholders, image decoding, two-column grids, card and text bounds, keyboard operation, mobile navigation, category navigation, video behavior, safe outbound links, exact social destinations, metadata, structured data, manifest/icon dimensions, zero horizontal overflow, and zero console errors. Firefox was not installed and could not be tested locally.

Baseline captures were created before Step 8 as `step8-baseline-390.png` and `step8-baseline-1440.png`. Fresh comparison captures using the same procedure changed 1.04% of mobile pixels and 0.73% of desktop pixels, primarily from raster/loading timing plus the intentional contrast adjustments. Side-by-side review confirmed identical page geometry and no unintended redesign. Final review captures are `step8-mobile-390.png`, `step8-final-1440.png`, and `step8-menu-1440.png`.

## Deployment actions

The final public domain is not present in the project. Before deployment:

1. Replace the relative canonical, `og:url`, `og:image`, and `twitter:image` values in `index.html` with absolute HTTPS URLs on the final domain.
2. Replace `REPLACE_WITH_PRODUCTION_DOMAIN` in `sitemap.xml.template`, save the result as `sitemap.xml`, and add its absolute URL to `robots.txt`.
3. Serve the project over HTTPS with correct MIME types and long-lived immutable caching for versioned images, video, icons, CSS, and JavaScript. Enable Brotli or gzip for text resources.
4. Configure deployment headers such as `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and an appropriate `Permissions-Policy`. Enable HSTS only after HTTPS is working across the final domain.
5. Run Lighthouse from the deployed HTTPS URL and validate the absolute social metadata with the Facebook and X sharing debuggers.
