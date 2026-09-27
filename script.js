'use strict';

// Business contact details. Update here if they change.
// WhatsApp: country code and number, digits only. Facebook: full HTTPS page URL.
const CONTACT = Object.freeze({
  whatsapp: '212631139014',
  facebook: 'https://www.facebook.com/share/1C9qgVSaXs/?mibextid=wwXIfr',
});

// MENU CONTENT — real products from the supplied Step 3 list.
// rp is the selling price in MAD; dp is also MAD. sv and pv have no currency.
// All products have a local image. imageAlt, description, and badge are optional;
// the renderer keeps a placeholder fallback for an unavailable image.
// Keep category keys Beverages/Food/Sushi. Values follow the written list exactly.
const MENU_PRODUCTS = {
  Beverages: [
    { name: "OOTEA LINGZHI COFFEE MIX 2 IN 1", dp: 18.00, rp: 8.00, sv: 4.80, pv: 1.00, image: 'assets/products/generated/ootea-lingzhi-coffee-mix-2-in-1.webp' },
    { name: "LION'S MANE COFFEE", dp: 16.00, rp: 20.00, sv: 5.90, pv: 1.00, image: 'assets/products/generated/lions-mane-coffee.webp' },
    { name: "REISHI GANO TEA", dp: 16.00, rp: 20.00, sv: 5.90, pv: 1.00, image: 'assets/products/generated/reishi-gano-tea.webp' },
    { name: "OOZHI TEA", dp: 10.00, rp: 15.00, sv: 3.70, pv: 0.50, image: 'assets/products/generated/oozhi-tea.webp' },
    { name: "ZHITEA", dp: 11.00, rp: 14.00, sv: 4.00, pv: 0.50, image: 'assets/products/generated/zhitea.webp' },
    { name: "OOLONG TEA", dp: 12.00, rp: 15.00, sv: 4.40, pv: 0.50, image: 'assets/products/generated/oolong-tea.webp' },
    { name: "LINGZHI COFFEE 3 IN 1", dp: 15.00, rp: 19.00, sv: 5.50, pv: 1.00, image: 'assets/products/generated/lingzhi-coffee-3-in-1.webp' },
    { name: "OOTEA BLACK COFFEE MIX LITE", dp: 14.00, rp: 18.00, sv: 5.10, pv: 1.00, image: 'assets/products/generated/ootea-black-coffee-mix-lite.webp' },
    { name: "OOTEA EU COFFEE MIX", dp: 15.00, rp: 19.00, sv: 5.50, pv: 1.00, image: 'assets/products/generated/ootea-eu-coffee-mix.webp' },
    { name: "OOTEA CORDYCEPS COFFEE MIX 3 IN 1", dp: 14.00, rp: 18.00, sv: 5.10, pv: 1.00, image: 'assets/products/generated/ootea-cordyceps-coffee-mix-3-in-1.webp' },
    { name: "LION'S MANE OOCHA", dp: 21.00, rp: 26.00, sv: 7.70, pv: 1.00, image: 'assets/products/generated/lions-mane-oocha.webp' },
    { name: "OOTEA BLACK COFFEE MIX", dp: 14.00, rp: 18.00, sv: 5.10, pv: 1.00, image: 'assets/products/generated/ootea-black-coffee-mix.webp' },
    { name: "OOTEA LINGZHI COFFEE MIX 3 IN 1", dp: 14.00, rp: 18.00, sv: 5.10, pv: 1.00, image: 'assets/products/generated/ootea-lingzhi-coffee-mix-3-in-1.webp' },
    { name: "CORDYCEPS COFFEE", dp: 14.00, rp: 18.00, sv: 5.10, pv: 1.00, image: 'images/products/beverages/cordyceps-coffee.webp', imageAlt: 'Tasse de Cordyceps Coffee crémeux avec grains de café.' },
    { name: "LINGZHI BLACK COFFEE", dp: 14.00, rp: 18.00, sv: 5.10, pv: 1.00, image: 'images/products/beverages/lingzhi-black-coffee.webp', imageAlt: 'Tasse de Lingzhi Black Coffee entourée de grains de café et de lingzhi.' },
    { name: "MORINZHI JUICE", dp: 24.00, rp: 30.00, sv: 8.80, pv: 2.00, image: 'assets/products/generated/morinzhi-juice.webp' },
    { name: "MORICINIA JUICE", dp: 24.00, rp: 30.00, sv: 8.80, pv: 2.00, image: 'assets/products/generated/moricinia-juice.webp' },
    { name: "CORDYPINE JUICE", dp: 42.00, rp: 53.00, sv: 15.30, pv: 3.50, image: 'assets/products/generated/cordypine-juice.webp' },
    { name: "NEPH-V JUICE", dp: 42.00, rp: 53.00, sv: 15.30, pv: 1.50, image: 'assets/products/generated/neph-v-juice.webp' },
    { name: "LIGNOPINE JUICE", dp: 42.00, rp: 53.00, sv: 15.30, pv: 3.50, image: 'assets/products/generated/lignopine-juice.webp' },
    { name: "LEMONZHI JUICE", dp: 10.00, rp: 15.00, sv: 5.70, pv: 0.50, image: 'images/products/beverages/lemonzhi-juice.webp', imageAlt: 'Verre de Lemonzhi Juice glacé avec citron et menthe.' },
    { name: "KIWI JUICE", dp: 17.00, rp: 21.00, sv: 6.20, pv: 1.00, image: 'images/products/beverages/kiwi-juice.webp', imageAlt: 'Grand verre de Kiwi Juice glacé avec rondelle de kiwi.' },
    { name: "COCOZHI DRINK", dp: 18.00, rp: 23.00, sv: 6.60, pv: 1.00, image: 'assets/products/generated/cocozhi-drink.webp' },
    { name: "ICED ZHI MOCHA", dp: 15.00, rp: 19.00, sv: 5.50, pv: 1.00, image: 'assets/products/generated/iced-zhi-mocha.webp' },
    { name: "ICED WHITE COFFEE ZHINO", dp: 22.00, rp: 28.00, sv: 8.00, pv: 1.00, image: 'assets/products/generated/iced-white-coffee-zhino.webp' },
    { name: "ICED VITA COFFEE", dp: 17.00, rp: 21.00, sv: 6.20, pv: 1.00, image: 'assets/products/generated/iced-vita-coffee.webp' },
    { name: "ROSELLE JUICE", dp: 21.00, rp: 26.00, sv: 7.70, pv: 1.50, image: 'assets/products/generated/roselle-juice.webp' },
    { name: "APPLE ENZYME DRINK", dp: 34.00, rp: 43.00, sv: 12.40, pv: 2.50, image: 'assets/products/generated/apple-enzyme-drink.webp' },
  ],
  Food: [
    { name: "PINEAPPLE JAM TOAST", dp: 9.00, rp: 11.00, sv: 3.40, pv: 0.50, image: 'assets/products/generated/pineapple-jam-toast.webp' },
    { name: "APPLE FERMENTED JAM TOAST", dp: 9.00, rp: 11.00, sv: 3.30, pv: 0.50, image: 'assets/products/generated/apple-fermented-jam-toast.webp' },
    { name: "CIN-G SOUP", dp: 65.00, rp: 106.00, sv: 31.00, pv: 4.00, image: 'assets/products/generated/cin-g-soup.webp' },
    { name: "SPIRULINA CEREAL", dp: 21.00, rp: 26.00, sv: 7.70, pv: 1.00, image: 'assets/products/generated/spirulina-cereal.webp' },
    { name: "PINEAPPLE CAKE", dp: 39.00, rp: 49.00, sv: 14.20, pv: 2.50, image: 'assets/products/generated/pineapple-cake.webp' },
    { name: "CACAOCAKE", dp: 39.00, rp: 49.00, sv: 14.20, pv: 2.50, image: 'assets/products/generated/cacaocake.webp' },
    { name: "COFFEEPINECAKE", dp: 39.00, rp: 49.00, sv: 14.20, pv: 2.50, image: 'assets/products/generated/coffeepinecake.webp' },
    { name: "SPIRUNANAS CAKE", dp: 22.00, rp: 28.00, sv: 8.00, pv: 1.00, image: 'images/products/food/spirunanas-cake.webp', imageAlt: 'Gâteau Spirunanas vert fourré à l’ananas.' },
    { name: "GANOODLE (TOMYAM FLAVOR)", dp: 36.00, rp: 45.00, sv: 13.10, pv: 2.00, image: 'assets/products/generated/ganoodle-tomyam-flavor.webp' },
    { name: "SPIRUDLE (TOMYAM FLAVOR)", dp: 36.00, rp: 45.00, sv: 13.10, pv: 2.00, image: 'assets/products/generated/spirudle-tomyam-flavor.webp' },
    { name: "SPIRUDLE", dp: 36.00, rp: 45.00, sv: 13.10, pv: 2.00, image: 'assets/products/generated/spirudle.webp' },
    { name: "SPIRUDLE (CURRY FLAVOR)", dp: 36.00, rp: 45.00, sv: 13.10, pv: 2.00, image: 'assets/products/generated/spirudle-curry-flavor.webp' },
    { name: "LINA YOBITE", dp: 8.00, rp: 10.00, sv: 3.00, pv: 0.50, image: 'assets/products/generated/lina-yobite.webp' },
    { name: "ZHI YOBITE", dp: 8.00, rp: 10.00, sv: 3.00, pv: 0.50, image: 'assets/products/generated/zhi-yobite.webp' },
  ],
  Sushi: [
    { name: "MAKI — 6 PIECES", dp: 32.00, rp: 40.00, sv: 11.70, pv: 2.00, image: 'images/products/sushi/maki.webp', imageAlt: 'Assiette de six makis au saumon, avocat et concombre.' },
    { name: "NIGIRI — 2 PIECES", dp: 30.00, rp: 38.00, sv: 11.00, pv: 2.00, image: 'assets/products/generated/nigiri-2-pieces.webp' },
    { name: "AVOCADO MAKI — 6 PIECES", dp: 30.00, rp: 38.00, sv: 11.00, pv: 2.00, image: 'assets/products/generated/avocado-maki-6-pieces.webp' },
    { name: "TUNA MAKI — 6 PIECES", dp: 48.00, rp: 60.00, sv: 17.50, pv: 3.00, image: 'assets/products/generated/tuna-maki-6-pieces.webp' },
    { name: "CALIFORNIA ROLL — 6 PIECES", dp: 35.00, rp: 43.00, sv: 12.80, pv: 2.00, image: 'assets/products/generated/california-roll-6-pieces.webp' },
    { name: "TEMPURA ROLL — 6 PIECES", dp: 40.00, rp: 40.00, sv: 14.60, pv: 2.50, image: 'assets/products/generated/tempura-roll-6-pieces.webp' },
    { name: "TAMAGO NIGIRI — 2 PIECES", dp: 38.00, rp: 48.00, sv: 13.90, pv: 2.50, image: 'assets/products/generated/tamago-nigiri-2-pieces.webp' },
    { name: "URAMAKI — 6 PIECES", dp: 40.00, rp: 50.00, sv: 14.60, pv: 2.50, image: 'assets/products/generated/uramaki-6-pieces.webp' },
    { name: "TARIEN — 2 PIECES", dp: 41.00, rp: 51.00, sv: 15.00, pv: 2.50, image: 'assets/products/generated/tarien-2-pieces.webp' },
    { name: "CUCUMBER MAKI — 6 PIECES", dp: 25.00, rp: 31.00, sv: 9.10, pv: 1.50, image: 'images/products/sushi/cucumber-maki.webp', imageAlt: 'Assiette de six makis au concombre.' },
    { name: "SHRIMP SUSHI — 2 PIECES", dp: 25.00, rp: 31.00, sv: 9.10, pv: 1.50, image: 'assets/products/generated/shrimp-sushi-2-pieces.webp' },
    { name: "SPICY TUNA ROLL — 6 PIECES", dp: 52.00, rp: 65.00, sv: 19.00, pv: 3.00, image: 'assets/products/generated/spicy-tuna-roll-6-pieces.webp' },
    { name: "VEGETABLE ROLL — 6 PIECES", dp: 30.00, rp: 38.00, sv: 11.00, pv: 2.00, image: 'assets/products/generated/vegetable-roll-6-pieces.webp' },
    { name: "GARLIC SHRIMP ROLL — 6 PIECES", dp: 40.00, rp: 50.00, sv: 14.60, pv: 2.50, image: 'assets/products/generated/garlic-shrimp-roll-6-pieces.webp' },
  ],
};

// STEP 9 — promotional formulas. These prices are independent from the four
// standard product metrics above and come from the supplied offers menu.
const OFFERS = [
  {
    id: 'formule-express',
    name: 'Formule Express',
    subtitle: 'Petit-Déjeuner Express',
    price: 39,
    image: 'assets/offers/generated/formule-express.webp',
    imageAlt: 'Café chaud accompagné d’une crêpe au chocolat pour la Formule Express.',
    items: ['Lingzhi Black Coffee', 'Crêpe au Chocolat', 'Ootea Lingzhi Coffee Mix 2 en 1'],
    fixedItems: ['Crêpe au Chocolat'],
    choices: [{ key: 'Café', label: 'Choisir votre café', options: ['Lingzhi Black Coffee', 'Ootea Lingzhi Coffee Mix 2 en 1'] }],
    note: 'Choisissez un café + une crêpe.',
  },
  {
    id: 'formule-fraicheur',
    name: 'Formule Fraîcheur',
    subtitle: 'Goûter Fraîcheur',
    price: 49,
    image: 'assets/offers/generated/formule-fraicheur.webp',
    imageAlt: 'Café glacé et crêpe aux fruits de la Formule Fraîcheur.',
    items: ['Iced Zhi Mocha', 'Crêpe aux Fruits'],
    fixedItems: ['Iced Zhi Mocha', 'Crêpe aux Fruits'],
    choices: [],
    note: 'Un café glacé + une crêpe aux fruits.',
  },
  {
    id: 'formule-vitalite',
    name: 'Formule Vitalité',
    subtitle: 'Petit-Déjeuner Vitalité',
    price: 49,
    image: 'assets/offers/generated/formule-vitalite.webp',
    imageAlt: 'Jus frais, thé et crêpe verte de la Formule Vitalité.',
    items: ['Jus Lemonzhi', 'Jus Kiwi', 'Thé Reishi Gano', 'Crêpe à la Spiruline'],
    fixedItems: ['Thé Reishi Gano', 'Crêpe à la Spiruline'],
    choices: [{ key: 'Jus', label: 'Choisir votre jus', options: ['Lemonzhi', 'Kiwi'] }],
    note: 'Choisissez un jus + un thé + une crêpe à la spiruline.',
  },
  {
    id: 'formule-cocooning',
    name: 'Formule Cocooning',
    subtitle: 'Goûter Cocooning',
    price: 40,
    image: 'assets/offers/generated/formule-cocooning.webp',
    imageAlt: 'Boisson chaude et crêpe au chocolat de la Formule Cocooning.',
    items: ['Boisson Cocozhi', 'Crêpe Nutella'],
    fixedItems: ['Boisson Cocozhi', 'Crêpe Nutella'],
    choices: [],
    note: 'Une boisson chaude + une crêpe.',
  },
  {
    id: 'formule-gourmand',
    name: 'Formule Gourmand',
    subtitle: 'Petit-Déjeuner Gourmand',
    price: 50,
    image: 'assets/offers/generated/formule-gourmand.webp',
    imageAlt: 'Café, jus Roselle et crêpe aux fruits de la Formule Gourmand.',
    items: ['Café Cordyceps', 'Café Lion’s Mane', 'Jus Roselle', 'Crêpe aux Fruits', 'Crêpe Nutella'],
    fixedItems: ['Jus Roselle'],
    choices: [
      { key: 'Café', label: 'Choisir votre café', options: ['Cordyceps', 'Lion’s Mane'] },
      { key: 'Crêpe', label: 'Choisir votre crêpe', options: ['Fruits', 'Nutella'] },
    ],
    note: 'Choisissez un café + jus Roselle + une crêpe aux fruits ou Nutella.',
  },
  {
    id: 'formule-energy-booster',
    name: 'Formule Energy Booster',
    subtitle: 'Goûter Energy Booster',
    price: 49,
    image: 'assets/offers/generated/formule-energy-booster.webp',
    imageAlt: 'Jus concentrés, café glacé et crêpe à la spiruline de la Formule Energy Booster.',
    items: ['Jus Cordypine', 'Jus Morinzhi', 'Iced Vita Coffee', 'Crêpe à la Spiruline'],
    fixedItems: ['Iced Vita Coffee', 'Crêpe à la Spiruline'],
    choices: [{ key: 'Jus concentré', label: 'Choisir votre jus concentré', options: ['Cordypine', 'Morinzhi'] }],
    note: 'Choisissez un jus concentré + un Iced Vita Coffee + une crêpe à la spiruline.',
  },
  {
    id: 'apple-toast-cordyceps',
    name: 'Apple Fermented Jam Toast + Cordyceps Coffee',
    subtitle: 'Duo gourmand',
    price: 25,
    image: 'assets/offers/generated/apple-toast-cordyceps-coffee.webp',
    imageAlt: 'Toast à la confiture de pomme fermentée accompagné d’un Cordyceps Coffee.',
    items: ['Toast à la confiture de pomme fermentée', 'Cordyceps Coffee'],
    fixedItems: ['Toast à la confiture de pomme fermentée', 'Cordyceps Coffee'],
    choices: [],
    note: 'Un toast fruité accompagné d’un café chaud.',
    badge: 'Nouveau !',
  },
  {
    id: 'pineapple-toast-lingzhi',
    name: 'Pineapple Jam Toast + Lingzhi Coffee 3in1',
    subtitle: 'Duo gourmand',
    price: 25,
    image: 'assets/offers/generated/pineapple-toast-lingzhi-coffee.webp',
    imageAlt: 'Toast à la confiture d’ananas accompagné d’un Lingzhi Coffee 3 en 1.',
    items: ['Toast à la confiture d’ananas', 'Lingzhi Coffee 3in1'],
    fixedItems: ['Toast à la confiture d’ananas', 'Lingzhi Coffee 3in1'],
    choices: [],
    note: 'Un toast à l’ananas accompagné d’un café crémeux.',
    badge: 'Nouveau !',
  },
];

const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#main-navigation');
const dialog = document.querySelector('#info-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const dialogSocials = document.querySelector('.dialog-socials');
const orderDialog = document.querySelector('#order-dialog');
const orderDialogTitle = document.querySelector('#order-dialog-title');
const orderDialogLink = document.querySelector('.order-dialog-whatsapp');
const mobileViewport = window.matchMedia('(max-width: 759px)');
let activeProductName = '';

document.documentElement.classList.add('js');
toggle.hidden = false;
document.querySelector('#year').textContent = new Date().getFullYear();

function closeNavigation(restoreFocus = false) {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Ouvrir la navigation');
  if (restoreFocus) toggle.focus();
}

toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? 'Fermer la navigation' : 'Ouvrir la navigation');
  navigation.classList.toggle('is-open', expanded);
});

navigation.addEventListener('click', (event) => {
  const control = event.target.closest('a, button');
  if (control && !control.hasAttribute('data-menu')) closeNavigation(mobileViewport.matches);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeNavigation();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeNavigation(true);
});
document.addEventListener('focusin', (event) => {
  if (!event.target.closest('.site-header')) closeNavigation();
});
mobileViewport.addEventListener('change', () => closeNavigation());

function showInfo(title, description, showContacts = false) {
  closeNavigation(mobileViewport.matches && navigation.contains(document.activeElement));
  dialogTitle.textContent = title;
  dialogDescription.textContent = description;
  dialogSocials.hidden = !showContacts;
  if (!dialog.open) dialog.showModal();
}

function whatsappOrderUrl(message) {
  const base = socialUrl('whatsapp');
  return base ? `${base}?text=${encodeURIComponent(message)}` : '#';
}

function quantityFrom(control) {
  return Number.parseInt(control.querySelector('output').textContent, 10) || 1;
}

function setQuantity(control, quantity) {
  const safeQuantity = Math.min(99, Math.max(1, Number(quantity) || 1));
  control.querySelector('output').textContent = String(safeQuantity);
  control.querySelector('[data-quantity-action="decrease"]').disabled = safeQuantity === 1;
  control.querySelector('[data-quantity-action="increase"]').disabled = safeQuantity === 99;
  return safeQuantity;
}

function productOrderMessage(name, quantity) {
  return `Bonjour Juff Coffee 👋\nJe souhaite commander :\n\nProduit : ${name}\nQuantité : ${quantity}\n\nMerci.`;
}

function offerOrderMessage(offer, card) {
  const quantity = quantityFrom(card.querySelector('[data-quantity-control]'));
  const content = offer.fixedItems.map(item => `• ${item}`);
  card.querySelectorAll('[data-choice-key]').forEach((select) => {
    content.push(`• ${select.dataset.choiceKey} : ${select.value}`);
  });
  return `Bonjour Juff Coffee 👋\nJe souhaite commander cette offre :\n\nFormule : ${offer.name}\nPrix : ${offer.price} MAD\nQuantité : ${quantity}\n\nContenu :\n${content.join('\n')}\n\nMerci.`;
}

function updateOfferOrderLink(card) {
  const offer = OFFERS[Number(card.dataset.offerIndex)];
  if (!offer) return;
  card.querySelector('.offer-order-button').href = whatsappOrderUrl(offerOrderMessage(offer, card));
}

function updateProductOrderLink() {
  const quantity = quantityFrom(orderDialog.querySelector('[data-quantity-control]'));
  orderDialogLink.href = whatsappOrderUrl(productOrderMessage(activeProductName, quantity));
  orderDialogLink.setAttribute('aria-label', `Commander ${activeProductName}, quantité ${quantity}, sur WhatsApp`);
}

function openProductOrder(name) {
  activeProductName = name;
  orderDialogTitle.textContent = name;
  setQuantity(orderDialog.querySelector('[data-quantity-control]'), 1);
  updateProductOrderLink();
  if (!orderDialog.open) orderDialog.showModal();
}

// Render once: textContent keeps menu copy separate from markup and styles.
const categoryTabs = [...document.querySelectorAll('.category-tab')];
const cardTemplate = document.querySelector('#product-card-template');
const offerTemplate = document.querySelector('#offer-card-template');
const menuSection = document.querySelector('#menu');
const priceFormat = new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const categoryIcons = { Beverages: 'icon-cup', Food: 'icon-leaf', Sushi: 'icon-spark', Offres: 'icon-spark' };

categoryTabs.forEach((tab) => {
  if (tab.dataset.category === 'Offres') return;
  const panel = document.getElementById(tab.getAttribute('aria-controls'));
  const fragment = document.createDocumentFragment();
  MENU_PRODUCTS[tab.dataset.category].forEach((product) => {
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector('.product-name').textContent = product.name;
    card.querySelector('.price-amount').textContent = priceFormat.format(product.rp);
    for (const field of ['dp', 'sv', 'pv']) {
      card.querySelector(`[data-metric="${field}"]`).textContent = priceFormat.format(product[field]);
    }
    for (const field of ['description', 'badge']) {
      const element = card.querySelector(`.product-${field}`);
      element.textContent = product[field] || '';
      element.hidden = !product[field];
    }
    const image = card.querySelector('.product-image');
    const placeholder = card.querySelector('.product-placeholder');
    placeholder.querySelector('use').setAttribute('href', `#${categoryIcons[tab.dataset.category]}`);
    if (product.image) {
      image.alt = product.imageAlt || product.name;
      image.addEventListener('error', () => {
        image.hidden = true;
        placeholder.hidden = false;
      }, { once: true });
      image.src = product.image;
      image.hidden = false;
      placeholder.hidden = true;
    }
    const orderButton = card.querySelector('[data-product-order]');
    orderButton.dataset.orderName = product.name;
    orderButton.setAttribute('aria-label', `Commander ${product.name} sur WhatsApp`);
    fragment.append(card);
  });
  panel.querySelector('.product-grid').append(fragment);
});

const offersGrid = document.querySelector('.offers-grid');
const offersFragment = document.createDocumentFragment();

OFFERS.forEach((offer, offerIndex) => {
  const card = offerTemplate.content.cloneNode(true);
  const article = card.querySelector('.offer-card');
  article.dataset.offerIndex = String(offerIndex);
  card.querySelector('.offer-name').textContent = offer.name;
  card.querySelector('.offer-subtitle').textContent = offer.subtitle;
  card.querySelector('.offer-price strong').textContent = String(offer.price);
  card.querySelector('.offer-note').textContent = offer.note;

  const image = card.querySelector('.offer-image');
  image.src = offer.image;
  image.alt = offer.imageAlt;

  const badge = card.querySelector('.offer-badge');
  badge.textContent = offer.badge || '';
  badge.hidden = !offer.badge;

  const items = card.querySelector('.offer-items');
  offer.items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    items.append(listItem);
  });

  const options = card.querySelector('.offer-options');
  offer.choices.forEach((choice, choiceIndex) => {
    const field = document.createElement('div');
    field.className = 'offer-field';
    const label = document.createElement('label');
    const select = document.createElement('select');
    const selectId = `${offer.id}-choice-${choiceIndex}`;
    label.htmlFor = selectId;
    label.textContent = choice.label;
    select.id = selectId;
    select.dataset.choiceKey = choice.key;
    choice.options.forEach((option) => select.add(new Option(option, option)));
    field.append(label, select);
    options.append(field);
  });
  options.hidden = offer.choices.length === 0;

  const quantityControl = card.querySelector('[data-quantity-control]');
  const quantityLabel = card.querySelector('.quantity-label');
  const quantityId = `${offer.id}-quantity-label`;
  quantityLabel.id = quantityId;
  quantityLabel.textContent = `Quantité pour ${offer.name}`;
  quantityControl.setAttribute('aria-labelledby', quantityId);

  const orderLink = card.querySelector('.offer-order-button');
  orderLink.setAttribute('aria-label', `Commander la ${offer.name} sur WhatsApp`);
  updateOfferOrderLink(article);
  offersFragment.append(card);
});

offersGrid.append(offersFragment);

document.querySelectorAll('[data-quantity-control]').forEach(control => setQuantity(control, 1));

menuSection.addEventListener('click', (event) => {
  const productOrderButton = event.target.closest('[data-product-order]');
  if (productOrderButton) {
    openProductOrder(productOrderButton.dataset.orderName);
    return;
  }

  const quantityButton = event.target.closest('[data-quantity-action]');
  if (!quantityButton) return;
  const control = quantityButton.closest('[data-quantity-control]');
  const change = quantityButton.dataset.quantityAction === 'increase' ? 1 : -1;
  setQuantity(control, quantityFrom(control) + change);
  const offerCard = quantityButton.closest('.offer-card');
  if (offerCard) updateOfferOrderLink(offerCard);
});

menuSection.addEventListener('change', (event) => {
  const offerCard = event.target.closest('.offer-card');
  if (offerCard && event.target.matches('[data-choice-key]')) updateOfferOrderLink(offerCard);
});

orderDialog.addEventListener('click', (event) => {
  const quantityButton = event.target.closest('[data-quantity-action]');
  if (quantityButton) {
    const control = quantityButton.closest('[data-quantity-control]');
    const change = quantityButton.dataset.quantityAction === 'increase' ? 1 : -1;
    setQuantity(control, quantityFrom(control) + change);
    updateProductOrderLink();
    return;
  }
  if (event.target.closest('.order-dialog-close')) {
    orderDialog.close();
    return;
  }
  if (event.target === orderDialog) {
    const bounds = orderDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) orderDialog.close();
  }
});

function selectCategory(category, focusTab = false) {
  const selectedTab = categoryTabs.find(tab => tab.dataset.category === category);
  if (!selectedTab) return;
  categoryTabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focusTab) selectedTab.focus({ preventScroll: true });
}

categoryTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCategory(tab.dataset.category));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % categoryTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + categoryTabs.length) % categoryTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = categoryTabs.length - 1;
    else return; // Native buttons already support Enter and Space.
    event.preventDefault();
    selectCategory(categoryTabs[nextIndex].dataset.category, true);
  });
});

document.querySelector('.menu-filters').hidden = false;
selectCategory('Beverages');

// The hero button and header categories now lead directly to the menu.
document.querySelectorAll('[data-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    closeNavigation();
    const category = button.dataset.menu === 'all' ? 'Beverages' : button.dataset.menu;
    selectCategory(category, true);
    menuSection.scrollIntoView({ block: 'start' });
  });
});

// Video is deferred until the section nears the viewport. Desktop may autoplay;
// mobile, reduced-motion and data-saver users receive the poster until they opt in.
const experienceVideo = document.querySelector('.experience-video');
const videoToggle = document.querySelector('.video-toggle');
const videoPlayIcon = videoToggle.querySelector('.video-play-icon');
const videoPauseIcon = videoToggle.querySelector('.video-pause-icon');
const desktopVideo = window.matchMedia('(min-width: 760px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function loadExperienceVideo() {
  if (!experienceVideo.src) {
    experienceVideo.src = experienceVideo.dataset.videoSrc;
    experienceVideo.load();
  }
}

function updateVideoControl() {
  const isPlaying = !experienceVideo.paused;
  videoToggle.setAttribute('aria-label', isPlaying ? 'Mettre la vidéo Juff Coffee en pause' : 'Lire la vidéo Juff Coffee');
  videoToggle.setAttribute('aria-pressed', String(isPlaying));
  videoPlayIcon.hidden = isPlaying;
  videoPauseIcon.hidden = !isPlaying;
}

async function playExperienceVideo() {
  loadExperienceVideo();
  try { await experienceVideo.play(); } catch { updateVideoControl(); }
}

videoToggle.addEventListener('click', () => {
  if (experienceVideo.paused) playExperienceVideo();
  else experienceVideo.pause();
});
experienceVideo.addEventListener('play', updateVideoControl);
experienceVideo.addEventListener('pause', updateVideoControl);

const videoObserver = new IntersectionObserver((entries, observer) => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  const saveData = navigator.connection?.saveData === true;
  if (desktopVideo.matches && !reducedMotion.matches && !saveData) playExperienceVideo();
  observer.disconnect();
}, { rootMargin: '300px 0px' });
videoObserver.observe(experienceVideo);

document.querySelectorAll('[data-contact]').forEach((button) => {
  button.addEventListener('click', () => showInfo('Gardons le contact.', 'Un petit bonjour, une question ? Retrouvez Juff Coffee sur nos réseaux.', true));
});

function socialUrl(platform) {
  if (platform === 'whatsapp' && /^\d{7,15}$/.test(CONTACT.whatsapp)) return `https://wa.me/${CONTACT.whatsapp}`;
  if (platform === 'facebook' && CONTACT.facebook) {
    try {
      const url = new URL(CONTACT.facebook);
      if (url.protocol === 'https:' && /(^|\.)facebook\.com$/.test(url.hostname)) return url.href;
    } catch { /* Leave unconfigured links in the local information flow. */ }
  }
  return '';
}

document.querySelectorAll('[data-social]').forEach((link) => {
  const url = socialUrl(link.dataset.social);
  if (url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (!link.hasAttribute('aria-label')) link.setAttribute('aria-label', `${link.textContent.trim()} (nouvel onglet)`);
  } else {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showInfo('À très bientôt.', 'Nos coordonnées seront bientôt disponibles. Nous avons hâte de partager un bon café avec vous.');
    });
  }
});

document.querySelectorAll('.dialog-close, .dialog-done').forEach((button) => {
  button.addEventListener('click', () => dialog.close());
});
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
