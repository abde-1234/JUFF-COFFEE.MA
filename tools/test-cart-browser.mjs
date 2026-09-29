import assert from 'node:assert/strict';

export function cartChecks(page, context, outgoing) {
  const card = name => page.locator('.product-card').filter({ has: page.getByRole('heading', { name, exact: true }) });
  const line = name => page.locator('.cart-item').filter({ has: page.getByRole('heading', { name, exact: true }) });
  const open = () => page.locator('.cart-toggle').click();
  const close = () => page.locator('.order-dialog-close').click();
  async function add(category, name, type, quantity) {
    await page.locator(`#tab-${category}`).click();
    const product = card(name);
    await product.locator('select').selectOption(type);
    for (let i = 1; i < quantity; i++) await product.locator('[data-quantity-action="increase"]').click();
    await product.locator('[data-product-order]').click();
    assert.equal(await product.locator('select').inputValue(), '');
  }
  async function checkout(expected) {
    const before = outgoing.length;
    const popupPromise = context.waitForEvent('page');
    await page.locator('.order-dialog-whatsapp').click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(outgoing.length, before + 1);
    const url = new URL(outgoing.at(-1));
    assert.equal(url.origin + url.pathname, 'https://wa.me/212631139014');
    const message = url.searchParams.get('text');
    if (expected) assert.equal(message, expected);
    assert.ok(message.includes('Bonjour Juff Coffee 👋\n\n'));
    assert.ok(!message.includes('%0A'));
    await popup.close();
    return { url: url.href, message };
  }
  async function clear() {
    await open();
    if (await page.locator('.cart-clear').isEnabled()) await page.locator('.cart-clear').click();
    assert.ok(await page.locator('.order-dialog-whatsapp').isDisabled());
    assert.equal(await page.locator('.cart-empty').innerText(), 'Votre commande est vide.');
    await close();
  }
  async function requestedFlow() {
    await clear();
    await add('beverages', 'KIWI JUICE', 'RP', 2);
    await add('beverages', 'CORDYCEPS COFFEE', 'DP', 1);
    await add('sushi', 'MAKI — 6 PIECES', 'RP', 2);
    await open();
    assert.equal(await page.locator('.cart-item').count(), 3);
    assert.equal(await page.locator('.cart-count').innerText(), '5');
    await line('KIWI JUICE').locator('[data-cart-action="increase"]').click();
    assert.equal(await line('KIWI JUICE').locator('output').innerText(), '3');
    await line('CORDYCEPS COFFEE').locator('.cart-remove').click();
    await close();
    await page.locator('#tab-offres').click();
    const offer = page.locator('.offer-card').nth(4);
    await offer.locator('select').nth(0).selectOption('Lion’s Mane');
    await offer.locator('select').nth(1).selectOption('Nutella');
    await offer.locator('[data-quantity-action="increase"]').click();
    await offer.locator('.offer-order-button').click();
    // Mutating card choices afterward must not rewrite the saved order.
    await offer.locator('select').nth(0).selectOption('Cordyceps');
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.locator('.cart-count').innerText(), '7');
    assert.ok(await page.locator('.product-type').evaluateAll(es => es.every(e => e.value === '')));
    await open();
    assert.equal(await page.locator('.cart-item').count(), 3);
    const expected = 'Bonjour Juff Coffee 👋\n\nJe souhaite passer cette commande :\n\n1. KIWI JUICE\nType : RP\nValeur : 21,00 MAD\nQuantité : 3\n\n2. MAKI — 6 PIECES\nType : RP\nValeur : 40,00 MAD\nQuantité : 2\n\n3. Formule Gourmand\nPrix : 50 MAD\n• Jus Roselle\nCafé : Lion’s Mane\nCrêpe : Nutella\nQuantité : 2\n\nMerci.';
    const result = await checkout(expected);
    await close();
    await add('beverages', 'CORDYCEPS COFFEE', 'DP', 1);
    await add('beverages', 'CORDYCEPS COFFEE', 'RP', 2);
    await add('beverages', 'CORDYCEPS COFFEE', 'DP', 1);
    await add('beverages', 'KIWI JUICE', 'SV', 1);
    await add('beverages', 'KIWI JUICE', 'PV', 1);
    await open();
    assert.equal(await line('CORDYCEPS COFFEE').count(), 2);
    assert.equal(JSON.stringify(await line('CORDYCEPS COFFEE').locator('output').allTextContents()), JSON.stringify(['2', '2']));
    const mixed = await checkout();
    assert.ok(mixed.message.includes('Type : SV\nValeur : 6,20\n'));
    assert.ok(mixed.message.includes('Type : PV\nValeur : 1,00\n'));
    assert.ok(!mixed.message.includes('Total'));
    await close();
    return { result: 'PASS', exactRequestedFlow: result, mixedUnits: mixed };
  }
  async function width(width) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    await page.reload({ waitUntil: 'load' });
    await clear();
    for (const category of ['beverages', 'food', 'sushi', 'offres']) {
      await page.locator(`#tab-${category}`).click();
      const layout = await page.locator(`#panel-${category}`).evaluate(panel => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        columns: getComputedStyle(panel.querySelector('.product-grid,.offers-grid')).gridTemplateColumns.split(' ').length,
        clipped: [...panel.querySelectorAll('select,[data-product-order],.quantity-stepper,.offer-order-button')].filter(e => {
          const r = e.getBoundingClientRect(), c = e.closest('article').getBoundingClientRect();
          return r.left < c.left - 1 || r.right > c.right + 1 || r.bottom > c.bottom + 1;
        }).length,
      }));
      assert.equal(layout.overflow, false, `Page overflow ${width}/${category}`);
      assert.equal(layout.clipped, 0, `Controls clipped ${width}/${category}`);
      if (category !== 'offres') assert.equal(layout.columns, 2);
    }
    await page.locator('#tab-beverages').click();
    const first = page.locator('.product-card').first();
    assert.equal(await first.locator('.product-type').inputValue(), '');
    await first.locator('[data-product-order]').click();
    assert.equal(await page.locator('.cart-count').innerText(), '0');
    assert.equal(await first.locator('.product-type').getAttribute('aria-invalid'), 'true');
    assert.ok(await first.locator('.product-order-feedback').isVisible());
    await first.locator('.product-type').selectOption('DP');
    await first.locator('[data-quantity-action="increase"]').click();
    await first.locator('[data-product-order]').click();
    assert.equal(await page.locator('.cart-count').innerText(), '2');
    await open();
    await page.waitForFunction(() => { const r = document.querySelector('.cart-dialog').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; });
    const bounds = await page.locator('.cart-dialog').evaluate(e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; });
    assert.ok(bounds, `Cart does not fit ${width}`);
    await page.locator('.cart-item [data-cart-action="decrease"]').click();
    assert.ok(await page.locator('.cart-item [data-cart-action="decrease"]').isDisabled());
    await checkout();
    await page.locator('.cart-remove').click();
    assert.ok(await page.locator('.order-dialog-whatsapp').isDisabled());
    await close();
    return { width, result: 'PASS' };
  }
  return { requestedFlow, width, add, open, close, clear, checkout };
}
