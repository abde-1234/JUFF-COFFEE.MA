// Browser audit helper. Pass an installed Playwright instance to createAudit().
// This is development tooling and is never copied to dist/.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = path.join(root, 'audit-results');

export async function createAudit(playwright, channel = 'chrome') {
  const source = await fs.readFile(path.join(root, 'script.js'), 'utf8');
  const data = vm.runInNewContext(source.slice(0, source.indexOf('const toggle')) + '\n({MENU_PRODUCTS, OFFERS})');
  const browser = await playwright.chromium.launch({ channel, headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  context.setDefaultTimeout(8000);
  const report = { browser: channel, version: browser.version(), base: 'http://127.0.0.1:4173', errors: [], warnings: [], failedRequests: [], badResponses: [], widths: [], orders: [], media: [], screenshots: [] };
  const external = [];
  const resources = [];
  await fs.mkdir(reportDir, { recursive: true });
  const save = () => fs.writeFile(path.join(reportDir, `${channel}.json`), JSON.stringify(report, null, 2));
  // Capture actual new-tab navigation without contacting or sending to either service.
  await context.route(/https:\/\/(?:wa\.me|www\.facebook\.com)\//, async route => {
    external.push(route.request().url());
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>External destination captured</title>' });
  });
  await context.addInitScript(() => {
    window.__auditVitals = { cls: 0, lcp: 0, longTasks: [] };
    for (const type of ['layout-shift', 'largest-contentful-paint', 'longtask']) {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (type === 'layout-shift' && !entry.hadRecentInput) window.__auditVitals.cls += entry.value;
          if (type === 'largest-contentful-paint') window.__auditVitals.lcp = entry.startTime;
          if (type === 'longtask') window.__auditVitals.longTasks.push(entry.duration);
        }
      }).observe({ type, buffered: true });
    }
  });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') report.errors.push(message.text());
    if (message.type() === 'warning') report.warnings.push(message.text());
  });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => {
    resources.push({ url: response.url(), status: response.status() });
    if (response.status() >= 400) report.badResponses.push({ url: response.url(), status: response.status() });
  });
  await page.goto(report.base, { waitUntil: 'load' });

  async function capture(locator, expected, label) {
    const before = external.length;
    const next = context.waitForEvent('page');
    await locator.click(); // Real pointer input, with Playwright visibility/hit-testing.
    const popup = await next;
    await popup.waitForLoadState();
    assert.equal(external.length, before + 1, 'One click must create one navigation');
    const url = external[before];
    assert.equal(popup.url(), url);
    const parsed = new URL(url);
    if (!label.startsWith('Facebook')) {
      assert.equal(parsed.origin + parsed.pathname, 'https://wa.me/212631139014');
      assert.equal(parsed.searchParams.get('text'), expected);
    } else assert.equal(url, 'https://www.facebook.com/share/1C9qgVSaXs/?mibextid=wwXIfr');
    report.orders.push({ label, width: page.viewportSize().width, url, message: expected });
    await popup.close();
    await save();
  }

  async function product(category, name, quantity = 2) {
    await page.locator(`#tab-${category.toLowerCase()}`).click();
    const card = page.locator('.product-card').filter({ has: page.getByRole('heading', { name, exact: true }) });
    await card.locator('.product-type').selectOption('RP'); // Explicit test input; never a UI default.
    assert.equal(await card.locator('output').innerText(), '1');
    assert.ok(await card.locator('[data-quantity-action="decrease"]').isDisabled());
    for (let q = 1; q < quantity; q++) await card.locator('[data-quantity-action="increase"]').click();
    await card.locator('[data-product-order]').click();
    await page.locator('.cart-toggle').click();
    const value = new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.MENU_PRODUCTS[category].find(item => item.name === name).rp);
    await capture(page.locator('.order-dialog-whatsapp'), `Bonjour Juff Coffee 👋\n\nJe souhaite passer cette commande :\n\n1. ${name}\nType : RP\nValeur : ${value} MAD\nQuantité : ${quantity}\n\nMerci.`, `${category}: ${name}`);
    await page.locator('.cart-clear').click();
    await page.locator('.order-dialog-close').click();
  }

  async function offer(index, quantity = 2, alternate = true) {
    await page.locator('#tab-offres').click();
    const item = data.OFFERS[index];
    const card = page.locator('.offer-card').nth(index);
    const content = Array.from(item.fixedItems, value => `• ${value}`);
    assert.equal(await card.locator('.offer-name').innerText(), item.name);
    assert.equal(await card.locator('.offer-price strong').innerText(), String(item.price));
    for (let i = 0; i < item.choices.length; i++) {
      const choice = item.choices[i];
      const value = choice.options[alternate ? choice.options.length - 1 : 0];
      await card.locator('select').nth(i).selectOption({ label: value });
      content.push(`${choice.key} : ${value}`);
    }
    let existing = Number(await card.locator('output').innerText());
    while (existing > 1) { await card.locator('[data-quantity-action="decrease"]').click(); existing--; }
    assert.ok(await card.locator('[data-quantity-action="decrease"]').isDisabled());
    for (let q = 1; q < quantity; q++) await card.locator('[data-quantity-action="increase"]').click();
    await card.locator('.offer-order-button').click();
    await page.locator('.cart-toggle').click();
    await capture(page.locator('.order-dialog-whatsapp'), `Bonjour Juff Coffee 👋\n\nJe souhaite passer cette commande :\n\n1. ${item.name}\nPrix : ${item.price} MAD\n${content.join('\n')}\nQuantité : ${quantity}\n\nMerci.`, item.name);
    await page.locator('.cart-clear').click();
    await page.locator('.order-dialog-close').click();
  }

  async function testWidth(width) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    await page.goto(report.base, { waitUntil: 'load' });
    const initial = await page.evaluate(() => ({
      videoSrc: document.querySelector('video').getAttribute('src'),
      hero: document.querySelector('.coffee-photo img').currentSrc,
      vitals: window.__auditVitals,
      eagerProducts: [...document.querySelectorAll('.product-image')].filter(e => e.loading !== 'lazy' || e.decoding !== 'async').length,
      loadedProducts: [...document.querySelectorAll('.product-image')].filter(e => e.complete && e.naturalWidth > 0).length,
      fonts: document.fonts.status,
    }));
    assert.equal(initial.videoSrc, null, 'Video must not load at initial top-of-page position');
    assert.equal(initial.eagerProducts, 0);
    assert.ok(initial.hero.endsWith(width <= 600 ? '-560.webp' : '-1000.webp'));
    if (width < 760) {
      const toggle = page.locator('.nav-toggle');
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
    }
    await page.locator('#main-navigation [data-menu="Food"]').click();
    assert.equal(await page.locator('#tab-food').getAttribute('aria-selected'), 'true');
    if (width < 760) assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'false');
    const layouts = [];
    for (const category of ['beverages', 'food', 'sushi', 'offres']) {
      await page.locator(`#tab-${category}`).click();
      const layout = await page.locator(`#panel-${category}`).evaluate(panel => {
        const grid = panel.querySelector('.product-grid, .offers-grid');
        const controls = [...panel.querySelectorAll('[data-product-order], .offer-order-button, select, .quantity-stepper')];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          outsideCards: controls.filter(e => { const r = e.getBoundingClientRect(), c = e.closest('article').getBoundingClientRect(); return r.left < c.left - 1 || r.right > c.right + 1 || r.bottom > c.bottom + 1; }).length,
          distortedImages: [...panel.querySelectorAll('img')].filter(e => !['contain', 'cover'].includes(getComputedStyle(e).objectFit)).length,
          clippedImages: [...panel.querySelectorAll('.product-image')].filter(e => { const r = e.getBoundingClientRect(), p = e.parentElement.getBoundingClientRect(); return r.height > p.height || r.width > p.width; }).length,
          clippedPrices: [...panel.querySelectorAll('.product-pricing dd')].filter(e => e.scrollWidth > e.clientWidth + 1).length,
        };
      });
      assert.equal(layout.overflow, false, `Horizontal overflow at ${width}/${category}`);
      assert.equal(layout.outsideCards, 0, `Control outside card at ${width}/${category}`);
      assert.equal(layout.distortedImages, 0);
      assert.equal(layout.clippedImages, 0, `Clipped product image at ${width}/${category}`);
      assert.equal(layout.clippedPrices, 0, `Clipped price at ${width}/${category}`);
      if (category !== 'offres') assert.equal(layout.columns, 2);
      layouts.push({ category, ...layout });
    }
    await product('Beverages', "LION'S MANE COFFEE", 2);
    await product('Food', 'GANOODLE (TOMYAM FLAVOR)', 3);
    await product('Sushi', 'MAKI — 6 PIECES', 2);
    await offer(1, 2);
    await offer(4, 3);
    await offer(6, 2);
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    assert.ok(await page.locator('.site-footer').isVisible());
    report.widths.push({ width, initial, layouts, result: 'PASS' });
    await save();
    return { width, result: 'PASS', errors: report.errors.length, assetErrors: report.badResponses.length };
  }

  async function allImages() {
    const checks = [];
    for (const category of ['beverages', 'food', 'sushi', 'offres']) {
      await page.locator(`#tab-${category}`).click();
      const images = page.locator(`#panel-${category} img`);
      for (let i = 0; i < await images.count(); i++) {
        const image = images.nth(i);
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(image => image.decode());
      }
      checks.push(...await images.evaluateAll(images => images.map(image => ({ src: image.getAttribute('src'), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, loading: image.loading, decoding: image.decoding }))));
    }
    assert.equal(checks.length, 64);
    assert.ok(checks.every(image => image.naturalWidth > 0));
    assert.equal(await page.locator('.product-placeholder:not([hidden])').count(), 0);
    report.images = checks;
    await save();
    return { decodedImages: checks.length, placeholders: 0 };
  }

  async function contacts() {
    await capture(page.locator('.social-links [data-social="whatsapp"]'), null, 'WhatsApp hero');
    await capture(page.locator('.contact-whatsapp'), null, 'WhatsApp contact strip');
    if (page.viewportSize().width < 760) await page.locator('.nav-toggle').click();
    await page.locator('[data-contact]').click();
    await capture(page.locator('.dialog-socials [data-social="whatsapp"]'), null, 'WhatsApp contact dialog');
    await page.locator('.dialog-close').click();
    await capture(page.locator('.social-links [data-social="facebook"]'), null, 'Facebook hero');
    await capture(page.locator('.contact-facebook'), null, 'Facebook contact strip');
  }

  async function video(width) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(report.base, { waitUntil: 'load' });
    assert.equal(await page.locator('video').getAttribute('src'), null);
    await page.locator('.video-toggle').scrollIntoViewIfNeeded();
    if (width < 760) {
      assert.equal(await page.locator('video').getAttribute('src'), null);
      await page.locator('.video-toggle').click();
    }
    await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && !v.paused && v.currentTime > 0; });
    const result = await page.locator('video').evaluate((v, width) => ({ width, duration: v.duration, time: v.currentTime, source: v.currentSrc, preload: v.preload, readyState: v.readyState, videoWidth: v.videoWidth }), width);
    await page.locator('.video-toggle').click();
    assert.equal(await page.locator('video').evaluate(v => v.paused), true);
    report.media.push(result);
    await save();
    return result;
  }

  async function screenshots() {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(report.base, { waitUntil: 'load' });
      // Load visible-category lazy images before capturing the complete page.
      for (const image of await page.locator('img:visible').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(image => image.decode());
      }
      if (await page.locator('video').evaluate(v => !v.paused)) await page.locator('.video-toggle').click();
      await page.locator('.brand').click();
      await page.waitForFunction(() => scrollY < 1);
      const relative = `assets/deployment-final-${width === 390 ? 'mobile-390' : 'desktop-1440'}.png`;
      await page.screenshot({ path: path.join(root, relative), fullPage: true, animations: 'disabled' });
      report.screenshots.push(relative);
    }
    await save();
    return report.screenshots;
  }

  async function finish() {
    report.network = resources;
    await save();
    return { errors: report.errors, warnings: report.warnings, badResponses: report.badResponses, failedRequests: report.failedRequests, widths: report.widths.map(item => item.width), orders: report.orders.length };
  }

  return { page, context, browser, report, data, product, offer, testWidth, allImages, contacts, video, screenshots, finish, save };
}
