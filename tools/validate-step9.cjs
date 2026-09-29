const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const dataSource = source.slice(0, source.indexOf('const toggle')) + '\nglobalThis.__data = { CONTACT, MENU_PRODUCTS, OFFERS };';
const context = {};
vm.runInNewContext(dataSource, context);
const { CONTACT, MENU_PRODUCTS, OFFERS } = context.__data;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const products = Object.values(MENU_PRODUCTS).flat();
const priceValues = products.flatMap(product => [product.dp, product.rp, product.sv, product.pv]);
assert(products.length === 56, `Expected 56 products; received ${products.length}`);
assert(priceValues.length === 224, `Expected 224 product values; received ${priceValues.length}`);
assert(products.every(product => product.image && fs.existsSync(path.join(root, product.image))), 'A product image is missing');
assert(OFFERS.length === 8, `Expected 8 offers; received ${OFFERS.length}`);
assert(OFFERS.every(offer => fs.existsSync(path.join(root, offer.image))), 'An offer image is missing');
assert(CONTACT.whatsapp === '212631139014', 'Official WhatsApp destination changed');
assert(CONTACT.facebook === 'https://www.facebook.com/share/1C9qgVSaXs/?mibextid=wwXIfr', 'Official Facebook URL changed');

const offerPrices = Object.fromEntries(OFFERS.map(offer => [offer.name, offer.price]));
assert(JSON.stringify(offerPrices) === JSON.stringify({
  'Formule Express': 39,
  'Formule Fraîcheur': 49,
  'Formule Vitalité': 49,
  'Formule Cocooning': 40,
  'Formule Gourmand': 50,
  'Formule Energy Booster': 49,
  'Apple Fermented Jam Toast + Cordyceps Coffee': 25,
  'Pineapple Jam Toast + Lingzhi Coffee 3in1': 25,
}), 'Offer prices or names do not match the approved list');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert((html.match(/data-category=/g) || []).length === 4, 'Expected four menu category tabs');
assert(html.includes('data-category="Offres"'), 'Offers tab is missing');
assert(html.includes('data-product-order'), 'Compact product order control is missing');
assert(html.includes('Commander sur WhatsApp'), 'Cart checkout action is missing');
assert(source.includes('encodeURIComponent(message)'), 'WhatsApp messages are not safely encoded');
assert(source.includes("menuSection.addEventListener('click'"), 'Delegated menu event handling is missing');

console.log(JSON.stringify({
  products: products.length,
  standardPricingValues: priceValues.length,
  productImages: products.length,
  offers: OFFERS.length,
  offerImages: OFFERS.length,
  orderableItems: products.length + OFFERS.length,
  whatsapp: CONTACT.whatsapp,
  result: 'PASS',
}, null, 2));
