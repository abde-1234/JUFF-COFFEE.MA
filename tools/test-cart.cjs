const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const Cart = require('../cart.js');
const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const { MENU_PRODUCTS, OFFERS } = vm.runInNewContext(source.slice(0, source.indexOf('const toggle')) + '\n({ MENU_PRODUCTS, OFFERS })');
const cart = new Cart(MENU_PRODUCTS, OFFERS);
const kiwi = 'Beverages:KIWI JUICE';
const coffee = 'Beverages:CORDYCEPS COFFEE';
const maki = 'Sushi:MAKI — 6 PIECES';

for (const type of ['', undefined, null, 'rp', 'UNKNOWN']) {
  assert.throws(() => cart.addProduct(kiwi, type, 1), /Veuillez choisir un type/);
  assert.equal(cart.count, 0);
}
for (const quantity of [0, -1, NaN, Infinity, 1.5, '2', 100]) {
  assert.throws(() => cart.addProduct(kiwi, 'RP', quantity));
  assert.equal(cart.count, 0);
}
cart.addProduct(kiwi, 'RP', 2);
cart.addProduct(coffee, 'DP', 1);
cart.addProduct(maki, 'RP', 2);
assert.equal(cart.items.length, 3);
assert.equal(cart.items[2].value, 40); // Actual menu value, not the brief's illustrative 38.
cart.changeQuantity(cart.items[0].id, 3);
cart.remove(cart.items[1].id);
cart.addOffer('formule-gourmand', { Café: 'Lion’s Mane', Crêpe: 'Nutella' }, 2);
assert.equal(cart.items.length, 3);
const expected = 'Bonjour Juff Coffee 👋\n\nJe souhaite passer cette commande :\n\n1. KIWI JUICE\nType : RP\nValeur : 21,00 MAD\nQuantité : 3\n\n2. MAKI — 6 PIECES\nType : RP\nValeur : 40,00 MAD\nQuantité : 2\n\n3. Formule Gourmand\nPrix : 50 MAD\n• Jus Roselle\nCafé : Lion’s Mane\nCrêpe : Nutella\nQuantité : 2\n\nMerci.';
assert.equal(cart.message(), expected);
assert.equal(new URL(`https://wa.me/212631139014?text=${encodeURIComponent(cart.message())}`).searchParams.get('text'), expected);
const restored = new Cart(MENU_PRODUCTS, OFFERS);
restored.restore(cart.serialize());
assert.equal(restored.message(), expected);
cart.addProduct(kiwi, 'DP', 1);
cart.addProduct(kiwi, 'RP', 1);
assert.equal(cart.items.length, 4);
assert.equal(cart.items[0].quantity, 4);
cart.addProduct(kiwi, 'SV', 1);
cart.addProduct(kiwi, 'PV', 1);
assert.equal(cart.items.at(-2).displayValue, '6,20');
assert.equal(cart.items.at(-1).displayValue, '1,00');
assert.ok(!cart.message().includes('Total'));
const capped = new Cart(MENU_PRODUCTS, OFFERS);
capped.addProduct(kiwi, 'RP', 99);
assert.throws(() => capped.addProduct(kiwi, 'RP', 1));
assert.throws(() => capped.changeQuantity(capped.items[0].id, 0));
assert.equal(capped.count, 99);
cart.addOffer('formule-gourmand', { Café: 'Cordyceps', Crêpe: 'Fruits' }, 1);
assert.equal(cart.items.filter(item => item.kind === 'offer').length, 2);
assert.throws(() => cart.addOffer('formule-gourmand', {}, 1));
const tampered = JSON.parse(cart.serialize());
tampered.items[0].value = 0.01;
tampered.items[0].name = 'untrusted';
restored.restore(JSON.stringify(tampered));
assert.equal(restored.items[0].value, 21);
assert.equal(restored.items[0].name, 'KIWI JUICE');
for (const raw of ['{', 'null', '{"version":99,"items":[]}', '{"version":1,"items":[{"kind":"product","productId":"missing","type":"RP","quantity":1}]}']) {
  restored.restore(raw);
  assert.equal(restored.count, 0);
}
for (const [category, products] of Object.entries(MENU_PRODUCTS)) for (const item of products) for (const type of ['DP', 'RP', 'SV', 'PV']) {
  const line = restored.product(`${category}:${item.name}`, type, 1);
  assert.equal(line.value, item[type.toLowerCase()]);
  assert.equal(line.displayValue.includes('MAD'), ['DP', 'RP'].includes(type));
}
for (const offer of OFFERS) {
  restored.addOffer(offer.id, Object.fromEntries(offer.choices.map(choice => [choice.key, choice.options.at(-1)])), 1);
}
assert.equal(restored.items.length, 8);
restored.clear();
assert.equal(restored.message(), '');
assert.equal(restored.count, 0);
console.log('PASS: explicit type required, 224 exact values, mixed orders, options, units, quantities, merging, persistence, corrupt storage, all 8 offers.');

// A locale change must affect display/message copy without changing order data.
const bilingual = new Cart(MENU_PRODUCTS, OFFERS);
bilingual.addProduct(kiwi, 'SV', 2);
bilingual.addOffer('formule-gourmand', { Café: 'Lion’s Mane', Crêpe: 'Nutella' }, 1);
const saved = bilingual.serialize();
const french = bilingual.message();
bilingual.setLanguage('ar');
assert.equal(bilingual.serialize(), saved);
assert.equal(bilingual.message(), 'مرحبًا جوف كوفي 👋\n\nأرغب في تقديم الطلب التالي:\n\n1. KIWI JUICE\nالنوع : SV\nالقيمة : 6,20\nالكمية : 2\n\n2. عرض الذوّاقة\nالسعر : 50 MAD\n• عصير Roselle\nالقهوة : Lion’s Mane\nالكريب : نوتيلا\nالكمية : 1\n\nشكرًا.');
assert.throws(() => bilingual.addProduct(kiwi, '', 1), /يرجى اختيار النوع/);
assert.throws(() => bilingual.addProduct(kiwi, 'RP', 100), /يرجى اختيار كمية/);
assert.throws(() => bilingual.addOffer('missing', {}, 1), /هذا العرض غير متاح/);
assert.throws(() => bilingual.addOffer('formule-gourmand', {}, 1), /خيارات القهوة/);
assert.equal(bilingual.serialize(), saved);
bilingual.setLanguage('fr');
assert.equal(bilingual.message(), french);
bilingual.setLanguage('unsupported');
assert.equal(bilingual.language, 'fr');
const { fr, ar } = Cart.translations;
assert.deepEqual(Object.keys(fr).sort(), Object.keys(ar).sort());
assert.deepEqual(Object.keys(fr.offer_text).sort(), Object.keys(ar.offer_text).sort());
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
for (const [, key] of html.matchAll(/data-i18n(?:-aria|-alt)?="([^"]+)"/g)) {
  assert.equal(typeof fr[key], 'string', `Missing French translation: ${key}`);
  assert.equal(typeof ar[key], 'string', `Missing Arabic translation: ${key}`);
}
console.log('PASS: Arabic checkout, localized validation, dictionary completeness, language fallback and unchanged serialized order.');
