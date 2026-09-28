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
  assert.throws(() => cart.addProduct(kiwi, type, 1), /Choisissez un type/);
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
