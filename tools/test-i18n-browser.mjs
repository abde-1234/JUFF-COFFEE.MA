import assert from 'node:assert/strict';

// Run against npm run preview (dist), using a fresh Playwright context.
// The caller intercepts wa.me navigation; these tests never send a message.
export function i18nChecks(page, context, outgoing) {
  const language = value => page.locator(`[data-language="${value}"]`).click();
  const product = name => page.locator('.product-card').filter({ has: page.getByRole('heading', { name, exact: true }) });
  const open = () => page.locator('.cart-toggle').click();
  const close = () => page.locator('.order-dialog-close').click();
  async function checkout() {
    const before = outgoing.length;
    const pending = context.waitForEvent('page');
    await page.locator('.order-dialog-whatsapp').click();
    const popup = await pending;
    await popup.waitForLoadState();
    assert.equal(outgoing.length, before + 1, 'Exactly one WhatsApp window per checkout');
    const url = new URL(outgoing.at(-1));
    assert.equal(url.origin + url.pathname, 'https://wa.me/212631139014');
    assert.ok(!url.searchParams.get('text').includes('%0A'), 'Message encoded once');
    await popup.close();
    return { url: url.href, message: url.searchParams.get('text') };
  }
  async function flow() {
    assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
    assert.equal(await page.locator('html').getAttribute('dir'), 'ltr');
    assert.equal(await page.locator('.nav-link').first().innerText(), 'Accueil');
    assert.ok(await page.locator('.product-type').evaluateAll(es => es.length === 56 && es.every(e => e.value === '')));
    await open();
    assert.equal(await page.locator('.cart-empty').innerText(), 'Votre commande est vide.');
    assert.ok(await page.locator('.order-dialog-whatsapp').isDisabled());
    await close();
    await page.locator('#tab-beverages').click();
    const kiwi = product('KIWI JUICE');
    await kiwi.locator('[data-product-order]').click();
    assert.equal(await kiwi.locator('.product-order-feedback').innerText(), 'Veuillez choisir un type avant d’ajouter ce produit.');
    assert.equal(await page.locator('.cart-count').innerText(), '0');
    await language('ar');
    assert.equal(await kiwi.locator('.product-order-feedback').innerText(), 'يرجى اختيار النوع قبل إضافة هذا المنتج.');
    await kiwi.locator('.product-type').selectOption('RP');
    await kiwi.locator('[data-quantity-action="increase"]').click();
    await language('fr');
    assert.equal(await kiwi.locator('.product-type').inputValue(), 'RP');
    assert.equal(await kiwi.locator('output').innerText(), '2');
    await kiwi.locator('[data-product-order]').click();
    assert.equal(await kiwi.locator('.product-type').inputValue(), '');
    await page.locator('#tab-offres').click();
    const gourmand = page.locator('.offer-card').nth(4);
    await gourmand.locator('select').nth(0).selectOption('Lion’s Mane');
    await gourmand.locator('select').nth(1).selectOption('Nutella');
    await language('ar');
    assert.equal(await gourmand.locator('select').nth(1).inputValue(), 'Nutella');
    assert.equal(await gourmand.locator('select').nth(1).locator('option:checked').innerText(), 'نوتيلا');
    await gourmand.locator('.offer-order-button').click();
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'ar');
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    assert.equal(await page.locator('.cart-count').innerText(), '3');
    assert.ok(await page.locator('.product-type').evaluateAll(es => es.every(e => e.value === '')));
    await open();
    assert.equal(await page.locator('#order-dialog-title').innerText(), 'طلبي');
    assert.equal(await page.locator('.cart-item').count(), 2);
    await page.locator('.cart-item').first().locator('[data-cart-action="increase"]').click();
    const arabic = await checkout();
    assert.equal(arabic.message, 'مرحبًا جوف كوفي 👋\n\nأرغب في تقديم الطلب التالي:\n\n1. KIWI JUICE\nالنوع : RP\nالقيمة : 21,00 MAD\nالكمية : 3\n\n2. عرض الذوّاقة\nالسعر : 50 MAD\n• عصير Roselle\nالقهوة : Lion’s Mane\nالكريب : نوتيلا\nالكمية : 1\n\nشكرًا.');
    await close();
    await language('fr');
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.locator('html').getAttribute('dir'), 'ltr');
    await open();
    const french = await checkout();
    assert.equal(french.message, 'Bonjour Juff Coffee 👋\n\nJe souhaite passer cette commande :\n\n1. KIWI JUICE\nType : RP\nValeur : 21,00 MAD\nQuantité : 3\n\n2. Formule Gourmand\nPrix : 50 MAD\n• Jus Roselle\nCafé : Lion’s Mane\nCrêpe : Nutella\nQuantité : 1\n\nMerci.');
    await page.locator('.cart-item').first().locator('.cart-remove').click();
    assert.equal(await page.locator('.cart-item').count(), 1);
    await page.locator('.cart-clear').click();
    assert.ok(await page.locator('.order-dialog-whatsapp').isDisabled());
    await close();
    await language('ar');
    await page.reload({ waitUntil: 'load' });
    await open();
    assert.equal(await page.locator('.cart-empty').innerText(), 'طلبك فارغ.');
    assert.ok(await page.locator('.order-dialog-whatsapp').isDisabled());
    await close();
    await page.locator('#tab-offres').click();
    for (const offer of await page.locator('.offer-card').all()) await offer.locator('.offer-order-button').click();
    await page.locator('#tab-beverages').click();
    for (const type of ['SV', 'PV']) {
      await kiwi.locator('select').selectOption(type);
      await kiwi.locator('[data-product-order]').click();
    }
    await open();
    const allOffers = await checkout();
    assert.equal(await page.locator('.cart-item').count(), 10);
    assert.ok(allOffers.message.includes('النوع : SV\nالقيمة : 6,20\n'));
    assert.ok(allOffers.message.includes('النوع : PV\nالقيمة : 1,00\n'));
    assert.ok(!/Total|المجموع/.test(allOffers.message));
    await page.locator('.cart-clear').click();
    await close();
    return { result: 'PASS', arabic, french, allOffers };
  }
  async function layout(width, locale) {
    await page.setViewportSize({ width, height: 844 });
    await language(locale);
    for (const category of ['beverages', 'food', 'sushi', 'offres']) {
      await page.locator(`#tab-${category}`).click();
      const geometry = await page.locator(`#panel-${category}`).evaluate(panel => {
        const controls = [...panel.querySelectorAll('select,[data-product-order],.quantity-stepper,.offer-order-button')];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          clipped: controls.filter(e => {
            const r = e.getBoundingClientRect(), c = e.closest('article').getBoundingClientRect();
            return r.left < c.left - 1 || r.right > c.right + 1 || r.bottom > c.bottom + 1;
          }).length,
          columns: getComputedStyle(panel.querySelector('.product-grid,.offers-grid')).gridTemplateColumns.split(' ').length,
        };
      });
      assert.equal(geometry.overflow, false, `${locale}/${width}/${category} overflow`);
      assert.equal(geometry.clipped, 0, `${locale}/${width}/${category} clipped controls`);
      if (category !== 'offres') assert.equal(geometry.columns, 2);
    }
    const headerFits = await page.locator('.site-header').evaluate(header => {
      const elements = [...header.querySelectorAll('.brand,.language-switcher,.nav-toggle,.navigation')].filter(e => e.getBoundingClientRect().width);
      return elements.every(e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }) &&
        elements.every((a, i) => elements.slice(i + 1).every(b => {
          const x = a.getBoundingClientRect(), y = b.getBoundingClientRect();
          return x.right <= y.left + 1 || y.right <= x.left + 1 || x.bottom <= y.top + 1 || y.bottom <= x.top + 1;
        }));
    });
    assert.ok(headerFits, `${locale}/${width} header overlap`);
    await open();
    const fits = await page.locator('#order-dialog').evaluate(dialog => {
      const r = dialog.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight;
    });
    assert.ok(fits, `${locale}/${width} dialog overflow`);
    await close();
    return { width, language: locale, result: 'PASS' };
  }
  return { flow, layout };
}
