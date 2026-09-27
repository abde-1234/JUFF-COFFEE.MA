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
assert(CONTACT.whatsapp === '212682698432', 'Official WhatsApp destination changed');
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

function productMessage(name, quantity) {
  return `Bonjour Juff Coffee 👋\nJe souhaite commander :\n\nProduit : ${name}\nQuantité : ${quantity}\n\nMerci.`;
}

function offerMessage(offer, quantity, selections = {}) {
  const content = offer.fixedItems.map(item => `• ${item}`);
  offer.choices.forEach(choice => content.push(`• ${choice.key} : ${selections[choice.key] || choice.options[0]}`));
  return `Bonjour Juff Coffee 👋\nJe souhaite commander cette offre :\n\nFormule : ${offer.name}\nPrix : ${offer.price} MAD\nQuantité : ${quantity}\n\nContenu :\n${content.join('\n')}\n\nMerci.`;
}

function testUrl(message, expectedParts) {
  const url = new URL(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`);
  assert(url.hostname === 'wa.me' && url.pathname === `/${CONTACT.whatsapp}`, 'Invalid WhatsApp destination');
  const decoded = url.searchParams.get('text');
  expectedParts.forEach(part => assert(decoded.includes(part), `WhatsApp message is missing: ${part}`));
}

testUrl(productMessage('CORDYCEPS COFFEE', 2), ['CORDYCEPS COFFEE', 'Quantité : 2']);
testUrl(productMessage('PINEAPPLE JAM TOAST', 1), ['PINEAPPLE JAM TOAST', 'Quantité : 1']);
testUrl(productMessage('NIGIRI — 2 PIECES', 3), ['NIGIRI — 2 PIECES', 'Quantité : 3']);
testUrl(offerMessage(OFFERS[1], 1), ['Formule Fraîcheur', 'Prix : 49 MAD', 'Iced Zhi Mocha']);
testUrl(offerMessage(OFFERS[4], 2, { Café: 'Lion’s Mane', Crêpe: 'Nutella' }), ['Formule Gourmand', 'Quantité : 2', 'Café : Lion’s Mane', 'Crêpe : Nutella']);
testUrl(offerMessage(OFFERS[6], 1), ['Apple Fermented Jam Toast + Cordyceps Coffee', 'Toast à la confiture de pomme fermentée']);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert((html.match(/data-category=/g) || []).length === 4, 'Expected four menu category tabs');
assert(html.includes('data-category="Offres"'), 'Offers tab is missing');
assert(html.includes('data-product-order'), 'Compact product order control is missing');
assert(html.includes('Commander sur WhatsApp'), 'Visible offer CTA is missing');
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
  messageCases: 6,
  result: 'PASS',
}, null, 2));
