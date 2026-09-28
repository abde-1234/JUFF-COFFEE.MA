'use strict';

// Shared by the browser and the cart regression tests. Stored display values are
// never trusted: restore always looks up the current, approved menu data.
class JuffOrderCart {
  constructor(products, offers) {
    this.products = new Map(Object.entries(products).flatMap(([category, items]) =>
      items.map(product => [`${category}:${product.name}`, product])));
    this.offers = new Map(offers.map(offer => [offer.id, offer]));
    this.items = [];
    this.format = new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  quantity(value) {
    if (!Number.isInteger(value) || value < 1 || value > 99) throw new Error('Choisissez une quantité entre 1 et 99.');
    return value;
  }

  product(productId, type, quantity) {
    const product = this.products.get(productId);
    if (!product || !['DP', 'RP', 'SV', 'PV'].includes(type) || !Number.isFinite(product[type.toLowerCase()])) {
      throw new Error('Choisissez un type : DP, RP, SV ou PV.');
    }
    const value = product[type.toLowerCase()];
    return {
      id: JSON.stringify(['product', productId, type]), kind: 'product', productId,
      name: product.name, type, value,
      displayValue: this.format.format(value) + (['DP', 'RP'].includes(type) ? ' MAD' : ''),
      quantity: this.quantity(quantity),
    };
  }

  offer(offerId, options, quantity) {
    const offer = this.offers.get(offerId);
    if (!offer) throw new Error('Cette offre n’est pas disponible.');
    const selected = offer.choices.map(choice => {
      const value = options?.[choice.key];
      if (!choice.options.includes(value)) throw new Error(`Choisissez une option pour ${choice.key}.`);
      return [choice.key, value];
    });
    return {
      id: JSON.stringify(['offer', offerId, selected]), kind: 'offer', offerId,
      name: offer.name, value: offer.price, displayValue: `${offer.price} MAD`,
      options: Object.fromEntries(selected), content: [...offer.fixedItems],
      quantity: this.quantity(quantity),
    };
  }

  add(item) {
    const existing = this.items.find(line => line.id === item.id);
    if (existing) existing.quantity = this.quantity(existing.quantity + item.quantity);
    else this.items.push(item);
  }

  addProduct(productId, type, quantity) { this.add(this.product(productId, type, quantity)); }
  addOffer(offerId, options, quantity) { this.add(this.offer(offerId, options, quantity)); }
  changeQuantity(id, quantity) {
    const item = this.items.find(line => line.id === id);
    if (item) item.quantity = this.quantity(quantity);
  }
  remove(id) { this.items = this.items.filter(item => item.id !== id); }
  clear() { this.items = []; }
  get count() { return this.items.reduce((sum, item) => sum + item.quantity, 0); }

  serialize() {
    return JSON.stringify({ version: 1, items: this.items.map(({ kind, productId, offerId, type, options, quantity }) =>
      ({ kind, productId, offerId, type, options, quantity })) });
  }

  restore(raw) {
    this.clear();
    try {
      const saved = JSON.parse(raw);
      if (saved?.version !== 1 || !Array.isArray(saved.items)) return;
      for (const item of saved.items.slice(0, 500)) {
        try {
          if (item?.kind === 'product') this.addProduct(item.productId, item.type, item.quantity);
          if (item?.kind === 'offer') this.addOffer(item.offerId, item.options, item.quantity);
        } catch { /* Discard obsolete or invalid lines; never invent replacements. */ }
      }
    } catch { /* Missing or malformed storage starts with an empty order. */ }
  }

  message() {
    if (!this.items.length) return '';
    const lines = this.items.map((item, index) => {
      const details = item.kind === 'product'
        ? [`Type : ${item.type}`, `Valeur : ${item.displayValue}`]
        : [`Prix : ${item.displayValue}`, ...item.content.map(value => `• ${value}`),
          ...Object.entries(item.options).map(([key, value]) => `${key} : ${value}`)];
      return [`${index + 1}. ${item.name}`, ...details, `Quantité : ${item.quantity}`].join('\n');
    });
    return `Bonjour Juff Coffee 👋\n\nJe souhaite passer cette commande :\n\n${lines.join('\n\n')}\n\nMerci.`;
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = JuffOrderCart;
