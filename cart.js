'use strict';

// Shared UI and checkout dictionary. Product names, IDs and option values stay canonical.
const translations = {
  "fr": {
    "nav_home": "Accueil",
    "nav_beverages": "Boissons",
    "nav_food": "Restauration",
    "nav_sushi": "Sushi",
    "nav_offers": "Offres",
    "nav_contact": "Contact",
    "top_tagline": "Une pause, un sourire.",
    "brand_slogan": "BON CAFÉ · BONNE HUMEUR",
    "hero_badge": "VOTRE PETITE PAUSE BONHEUR",
    "hero_coffee": "BON CAFÉ",
    "hero_mood": "BONNE HUMEUR",
    "hero_text_1": "Un bon café, un instant pour soi.",
    "hero_text_2": "Installez-vous, savourez… et prenez le temps.",
    "hero_cta": "Voir le menu",
    "contact_title": "ON GARDE LE CONTACT ?",
    "whatsapp": "WhatsApp",
    "facebook": "Facebook",
    "photo_caption": "UN PEU DE FRAÎCHEUR. BEAUCOUP DE BONHEUR.",
    "stamp_break": "UNE PAUSE",
    "stamp_sip": "UNE GORGÉE",
    "photo_title": "Votre moment préféré.",
    "photo_note": "À savourer, tout simplement.",
    "visual_index": "01 / LA PAUSE CAFÉ",
    "moment_1": "Le plaisir d’un bon café",
    "moment_1_text": "La pause qui fait du bien.",
    "moment_2": "Un instant pour ralentir",
    "moment_2_text": "Prenez le temps de savourer.",
    "moment_3": "De beaux moments à partager",
    "moment_3_text": "Seul, à deux, ou entre amis.",
    "video_caption": "24 secondes · sans son",
    "experience_badge": "L’EXPÉRIENCE JUFF COFFEE",
    "experience_title": "Une pause qui se vit.",
    "experience_text": "Découvrez l’ambiance Juff Coffee, ses boissons préparées avec soin et un lieu pensé pour ralentir un instant.",
    "discover_drinks": "Découvrir les boissons",
    "featured_badge": "SÉLECTION DU MOMENT",
    "featured_title": "À découvrir chez Juff.",
    "featured_text": "Trois créations mises en lumière dans leurs visuels promotionnels d’origine.",
    "fresh_drink": "Boisson fraîche",
    "coffee_pick": "Notre sélection café",
    "sushi_pick": "Notre sélection sushi",
    "view_menu": "Voir dans la carte",
    "maki_featured": "Maki · 6 pièces",
    "menu_badge": "À CHAQUE ENVIE, SA PAUSE",
    "menu_title": "Notre menu",
    "menu_text_1": "Un café, une petite faim, un moment à partager.",
    "menu_text_2": "Choisissez votre prochaine pause.",
    "price_note": "Prix de vente RP en MAD · Détails DP, SV et PV sur chaque produit.",
    "offers_intro": "Des formules généreuses pour le petit-déjeuner ou le goûter, préparées dans l’esprit Juff Coffee.",
    "contact_via": "Contactez-nous sur",
    "follow_us": "Suivez-nous sur",
    "footer_text": "Du café. Du bonheur. Tout simplement.",
    "back_top": "Retour en haut",
    "close": "Fermer",
    "soon_title": "À très bientôt.",
    "contact_dialog_title": "Gardons le contact.",
    "contact_dialog_text": "Un petit bonjour, une question ? Retrouvez Juff Coffee sur nos réseaux.",
    "soon_text": "Nos coordonnées seront bientôt disponibles. Nous avons hâte de partager un bon café avec vous.",
    "back_home": "Revenir à l’accueil",
    "order_badge": "COMMANDER",
    "my_order": "Ma commande",
    "order_description": "Vérifiez vos articles avant de continuer sur WhatsApp.",
    "empty_cart": "Votre commande est vide.",
    "storage_note": "Votre commande reste disponible dans cet onglet, mais ne peut pas être enregistrée sur cet appareil.",
    "clear_cart": "Vider la commande",
    "checkout": "Commander sur WhatsApp",
    "photo_pending": "PHOTO À VENIR",
    "choose_type": "Type",
    "choose_placeholder": "Choisir…",
    "quantity": "Quantité",
    "decrease": "Diminuer la quantité",
    "increase": "Augmenter la quantité",
    "add_button": "Ajouter",
    "add_order": "Ajouter à la commande",
    "remove_item": "Supprimer",
    "validation_choose_type": "Veuillez choisir un type avant d’ajouter ce produit.",
    "validation_quantity": "Choisissez une quantité entre 1 et 99.",
    "validation_offer": "Cette offre n’est pas disponible.",
    "validation_option": "Choisissez une option pour {name}.",
    "cart_success": "Produit ajouté à la commande.",
    "cart_count": "{count} article(s) dans votre commande.",
    "quantity_for": "Quantité pour {name}",
    "type_for": "Type pour {name}",
    "add_named": "Ajouter {name} à la commande",
    "remove_named": "Retirer {name} de la commande",
    "price": "Prix",
    "value": "Valeur",
    "total": "Total",
    "order_hello": "Bonjour Juff Coffee 👋",
    "order_title": "Je souhaite passer cette commande :",
    "order_thanks": "Merci.",
    "skip_content": "Aller au contenu",
    "brand_home": "Juff Coffee — Accueil",
    "nav_open": "Ouvrir la navigation",
    "nav_close": "Fermer la navigation",
    "nav_label": "Navigation principale",
    "moments_label": "L’esprit Juff Coffee",
    "video_label": "Découverte en vidéo de l’espace Juff Coffee",
    "video_play": "Lire la vidéo Juff Coffee",
    "video_pause": "Mettre la vidéo Juff Coffee en pause",
    "categories": "Catégories du menu",
    "contact_label": "Contacter Juff Coffee",
    "open_order": "Ouvrir ma commande",
    "social_tab": "{name} (nouvel onglet)",
    "language_label": "Langue du site",
    "hero_alt": "Grand café glacé crémeux servi dans un gobelet portant le logo Juff Coffee, dans une ambiance de café chaleureuse.",
    "kiwi_alt": "Grand verre de Kiwi Juice glacé avec rondelle de kiwi.",
    "coffee_alt": "Tasse de Cordyceps Coffee crémeux avec grains de café.",
    "maki_alt": "Assiette de six makis au saumon, avocat et concombre.",
    "offer_text": {
      "Formule Express": "Formule Express",
      "Petit-Déjeuner Express": "Petit-Déjeuner Express",
      "Crêpe au Chocolat": "Crêpe au Chocolat",
      "Choisir votre café": "Choisir votre café",
      "Café": "Café",
      "Choisissez un café + une crêpe.": "Choisissez un café + une crêpe.",
      "Formule Fraîcheur": "Formule Fraîcheur",
      "Goûter Fraîcheur": "Goûter Fraîcheur",
      "Crêpe aux Fruits": "Crêpe aux Fruits",
      "Un café glacé + une crêpe aux fruits.": "Un café glacé + une crêpe aux fruits.",
      "Formule Vitalité": "Formule Vitalité",
      "Petit-Déjeuner Vitalité": "Petit-Déjeuner Vitalité",
      "Jus Lemonzhi": "Jus Lemonzhi",
      "Jus Kiwi": "Jus Kiwi",
      "Thé Reishi Gano": "Thé Reishi Gano",
      "Crêpe à la Spiruline": "Crêpe à la Spiruline",
      "Jus": "Jus",
      "Choisir votre jus": "Choisir votre jus",
      "Choisissez un jus + un thé + une crêpe à la spiruline.": "Choisissez un jus + un thé + une crêpe à la spiruline.",
      "Formule Cocooning": "Formule Cocooning",
      "Goûter Cocooning": "Goûter Cocooning",
      "Boisson Cocozhi": "Boisson Cocozhi",
      "Crêpe Nutella": "Crêpe Nutella",
      "Une boisson chaude + une crêpe.": "Une boisson chaude + une crêpe.",
      "Formule Gourmand": "Formule Gourmand",
      "Petit-Déjeuner Gourmand": "Petit-Déjeuner Gourmand",
      "Café Cordyceps": "Café Cordyceps",
      "Café Lion’s Mane": "Café Lion’s Mane",
      "Jus Roselle": "Jus Roselle",
      "Crêpe": "Crêpe",
      "Choisir votre crêpe": "Choisir votre crêpe",
      "Fruits": "Fruits",
      "Nutella": "Nutella",
      "Choisissez un café + jus Roselle + une crêpe aux fruits ou Nutella.": "Choisissez un café + jus Roselle + une crêpe aux fruits ou Nutella.",
      "Formule Energy Booster": "Formule Energy Booster",
      "Goûter Energy Booster": "Goûter Énergie",
      "Jus Cordypine": "Jus Cordypine",
      "Jus Morinzhi": "Jus Morinzhi",
      "Jus concentré": "Jus concentré",
      "Choisir votre jus concentré": "Choisir votre jus concentré",
      "Choisissez un jus concentré + un Iced Vita Coffee + une crêpe à la spiruline.": "Choisissez un jus concentré + un Iced Vita Coffee + une crêpe à la spiruline.",
      "Duo gourmand": "Duo gourmand",
      "Toast à la confiture de pomme fermentée": "Toast à la confiture de pomme fermentée",
      "Un toast fruité accompagné d’un café chaud.": "Un toast fruité accompagné d’un café chaud.",
      "Nouveau !": "Nouveau !",
      "Toast à la confiture d’ananas": "Toast à la confiture d’ananas",
      "Un toast à l’ananas accompagné d’un café crémeux.": "Un toast à l’ananas accompagné d’un café crémeux."
    },
    "page_title": "Juff Coffee | Café & Restaurant",
    "product_photo": "Photo de {name}"
  },
  "ar": {
    "nav_home": "الرئيسية",
    "nav_beverages": "المشروبات",
    "nav_food": "المأكولات",
    "nav_sushi": "السوشي",
    "nav_offers": "العروض",
    "nav_contact": "اتصل بنا",
    "top_tagline": "استراحة وابتسامة.",
    "brand_slogan": "قهوة طيبة · مزاج جميل",
    "hero_badge": "استراحتك الصغيرة المميزة",
    "hero_coffee": "قهوة طيبة",
    "hero_mood": "مزاج جميل",
    "hero_text_1": "قهوة طيبة، ولحظة لك وحدك.",
    "hero_text_2": "اجلس، استمتع… وخذ وقتك.",
    "hero_cta": "شاهد القائمة",
    "contact_title": "هل نبقى على تواصل؟",
    "whatsapp": "واتساب",
    "facebook": "فيسبوك",
    "photo_caption": "قليل من الانتعاش. كثير من السعادة.",
    "stamp_break": "خذ استراحة",
    "stamp_sip": "استمتع برشفة",
    "photo_title": "لحظتك المفضلة.",
    "photo_note": "استمتع بها بكل بساطة.",
    "visual_index": "01 / استراحة القهوة",
    "moment_1": "متعة القهوة الطيبة",
    "moment_1_text": "استراحة تمنحك الراحة.",
    "moment_2": "لحظة للهدوء",
    "moment_2_text": "خذ وقتك واستمتع.",
    "moment_3": "لحظات جميلة نتشاركها",
    "moment_3_text": "بمفردك، مع رفيق، أو مع الأصدقاء.",
    "video_caption": "24 ثانية · بدون صوت",
    "experience_badge": "تجربة جوف كوفي",
    "experience_title": "استراحة تعيشها بكل حواسك.",
    "experience_text": "اكتشف أجواء جوف كوفي، ومشروباته المُعدّة بعناية، ومكانًا يدعوك إلى الهدوء للحظات.",
    "discover_drinks": "اكتشف المشروبات",
    "featured_badge": "مختاراتنا الحالية",
    "featured_title": "اكتشفها لدى جوف.",
    "featured_text": "ثلاثة اختيارات مميزة بصورها الترويجية الأصلية.",
    "fresh_drink": "مشروب منعش",
    "coffee_pick": "اختيارنا من القهوة",
    "sushi_pick": "اختيارنا من السوشي",
    "view_menu": "شاهد في القائمة",
    "maki_featured": "ماكي · 6 قطع",
    "menu_badge": "لكل رغبة، استراحتها",
    "menu_title": "قائمتنا",
    "menu_text_1": "قهوة، لقمة خفيفة، ولحظة للمشاركة.",
    "menu_text_2": "اختر استراحتك القادمة.",
    "price_note": "سعر البيع RP بالدرهم المغربي (MAD) · تفاصيل DP وSV وPV على كل منتج.",
    "offers_intro": "عروض سخية للإفطار أو لوجبة خفيفة، مُعدّة بروح جوف كوفي.",
    "contact_via": "تواصل معنا عبر",
    "follow_us": "تابعنا على",
    "footer_text": "قهوة. سعادة. بكل بساطة.",
    "back_top": "العودة إلى الأعلى",
    "close": "إغلاق",
    "soon_title": "نراك قريبًا.",
    "contact_dialog_title": "لنبقَ على تواصل.",
    "contact_dialog_text": "لديك سؤال أو ترغب في إلقاء التحية؟ تواصل مع جوف كوفي عبر صفحاتنا.",
    "soon_text": "ستتوفر معلومات التواصل قريبًا. نتطلع إلى مشاركتكم قهوة طيبة.",
    "back_home": "العودة إلى الرئيسية",
    "order_badge": "اطلب الآن",
    "my_order": "طلبي",
    "order_description": "راجع محتويات طلبك قبل المتابعة عبر واتساب.",
    "empty_cart": "طلبك فارغ.",
    "storage_note": "يبقى طلبك متاحًا في علامة التبويب هذه، لكن لا يمكن حفظه على هذا الجهاز.",
    "clear_cart": "إفراغ الطلب",
    "checkout": "اطلب عبر واتساب",
    "photo_pending": "الصورة قريبًا",
    "choose_type": "النوع",
    "choose_placeholder": "اختر…",
    "quantity": "الكمية",
    "decrease": "تقليل الكمية",
    "increase": "زيادة الكمية",
    "add_button": "إضافة",
    "add_order": "إضافة إلى الطلب",
    "remove_item": "حذف",
    "validation_choose_type": "يرجى اختيار النوع قبل إضافة هذا المنتج.",
    "validation_quantity": "يرجى اختيار كمية بين 1 و99.",
    "validation_offer": "هذا العرض غير متاح.",
    "validation_option": "يرجى اختيار أحد خيارات {name}.",
    "cart_success": "تمت إضافة المنتج إلى الطلب.",
    "cart_count": "عدد القطع في طلبك: {count}.",
    "quantity_for": "كمية {name}",
    "type_for": "نوع {name}",
    "add_named": "إضافة {name} إلى الطلب",
    "remove_named": "حذف {name} من الطلب",
    "price": "السعر",
    "value": "القيمة",
    "total": "المجموع",
    "order_hello": "مرحبًا جوف كوفي 👋",
    "order_title": "أرغب في تقديم الطلب التالي:",
    "order_thanks": "شكرًا.",
    "skip_content": "انتقل إلى المحتوى",
    "brand_home": "جوف كوفي — الرئيسية",
    "nav_open": "فتح قائمة التنقل",
    "nav_close": "إغلاق قائمة التنقل",
    "nav_label": "التنقل الرئيسي",
    "moments_label": "روح جوف كوفي",
    "video_label": "اكتشف أجواء جوف كوفي بالفيديو",
    "video_play": "تشغيل فيديو جوف كوفي",
    "video_pause": "إيقاف فيديو جوف كوفي مؤقتًا",
    "categories": "أقسام القائمة",
    "contact_label": "تواصل مع جوف كوفي",
    "open_order": "فتح طلبي",
    "social_tab": "{name} (علامة تبويب جديدة)",
    "language_label": "لغة الموقع",
    "hero_alt": "قهوة مثلجة كريمية في كوب يحمل شعار جوف كوفي، وسط أجواء مقهى دافئة.",
    "kiwi_alt": "كوب كبير من عصير الكيوي المثلج مع شريحة كيوي.",
    "coffee_alt": "فنجان قهوة كورديسيبس كريمية مع حبوب القهوة.",
    "maki_alt": "طبق من ست قطع ماكي بالسلمون والأفوكادو والخيار.",
    "offer_text": {
      "Formule Express": "عرض إكسبرس",
      "Petit-Déjeuner Express": "إفطار سريع",
      "Crêpe au Chocolat": "كريب بالشوكولاتة",
      "Choisir votre café": "اختر قهوتك",
      "Café": "القهوة",
      "Choisissez un café + une crêpe.": "اختر قهوة + كريب.",
      "Formule Fraîcheur": "عرض الانتعاش",
      "Goûter Fraîcheur": "وجبة خفيفة منعشة",
      "Crêpe aux Fruits": "كريب بالفواكه",
      "Un café glacé + une crêpe aux fruits.": "قهوة مثلجة + كريب بالفواكه.",
      "Formule Vitalité": "عرض الحيوية",
      "Petit-Déjeuner Vitalité": "إفطار الحيوية",
      "Jus Lemonzhi": "عصير Lemonzhi",
      "Jus Kiwi": "عصير الكيوي",
      "Thé Reishi Gano": "شاي Reishi Gano",
      "Crêpe à la Spiruline": "كريب بالسبيرولينا",
      "Jus": "العصير",
      "Choisir votre jus": "اختر عصيرك",
      "Choisissez un jus + un thé + une crêpe à la spiruline.": "اختر عصيرًا + شاي + كريب بالسبيرولينا.",
      "Formule Cocooning": "عرض الاسترخاء",
      "Goûter Cocooning": "وجبة خفيفة للاسترخاء",
      "Boisson Cocozhi": "مشروب Cocozhi",
      "Crêpe Nutella": "كريب بالنوتيلا",
      "Une boisson chaude + une crêpe.": "مشروب ساخن + كريب.",
      "Formule Gourmand": "عرض الذوّاقة",
      "Petit-Déjeuner Gourmand": "إفطار الذوّاقة",
      "Café Cordyceps": "قهوة Cordyceps",
      "Café Lion’s Mane": "قهوة Lion’s Mane",
      "Jus Roselle": "عصير Roselle",
      "Crêpe": "الكريب",
      "Choisir votre crêpe": "اختر الكريب",
      "Fruits": "فواكه",
      "Nutella": "نوتيلا",
      "Choisissez un café + jus Roselle + une crêpe aux fruits ou Nutella.": "اختر قهوة + عصير Roselle + كريب بالفواكه أو النوتيلا.",
      "Formule Energy Booster": "عرض الطاقة",
      "Goûter Energy Booster": "وجبة خفيفة للطاقة",
      "Jus Cordypine": "عصير Cordypine",
      "Jus Morinzhi": "عصير Morinzhi",
      "Jus concentré": "العصير المركّز",
      "Choisir votre jus concentré": "اختر عصيرك المركّز",
      "Choisissez un jus concentré + un Iced Vita Coffee + une crêpe à la spiruline.": "اختر عصيرًا مركّزًا + قهوة Iced Vita Coffee + كريب بالسبيرولينا.",
      "Duo gourmand": "ثنائي لذيذ",
      "Toast à la confiture de pomme fermentée": "توست بمربى التفاح المخمّر",
      "Un toast fruité accompagné d’un café chaud.": "توست بالفواكه مع قهوة ساخنة.",
      "Nouveau !": "جديد!",
      "Toast à la confiture d’ananas": "توست بمربى الأناناس",
      "Un toast à l’ananas accompagné d’un café crémeux.": "توست بالأناناس مع قهوة كريمية."
    },
    "page_title": "جوف كوفي | مقهى ومطعم",
    "product_photo": "صورة {name}"
  }
};

function translate(language, key, params = {}) {
  const copy = translations[language] || translations.fr;
  return (copy[key] ?? translations.fr[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}


// Shared by the browser and the cart regression tests. Stored display values are
// never trusted: restore always looks up the current, approved menu data.
class JuffOrderCart {
  constructor(products, offers, language = 'fr') {
    this.setLanguage(language);
    this.products = new Map(Object.entries(products).flatMap(([category, items]) =>
      items.map(product => [`${category}:${product.name}`, product])));
    this.offers = new Map(offers.map(offer => [offer.id, offer]));
    this.items = [];
    this.format = new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  setLanguage(language) { this.language = language === 'ar' ? 'ar' : 'fr'; }
  t(key, params) { return translate(this.language, key, params); }
  offerText(value) { return translations[this.language].offer_text[value] || value; }
  itemName(item) { return item.kind === 'offer' ? this.offerText(item.name) : item.name; }
  error(key, params = {}) {
    return Object.assign(new Error(this.t(key, { ...params, ...(params.name ? { name: this.offerText(params.name) } : {}) })), { translationKey: key, translationParams: params });
  }

  quantity(value) {
    if (!Number.isInteger(value) || value < 1 || value > 99) throw this.error('validation_quantity');
    return value;
  }

  product(productId, type, quantity) {
    const product = this.products.get(productId);
    if (!product || !['DP', 'RP', 'SV', 'PV'].includes(type) || !Number.isFinite(product[type.toLowerCase()])) {
      throw this.error('validation_choose_type');
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
    if (!offer) throw this.error('validation_offer');
    const selected = offer.choices.map(choice => {
      const value = options?.[choice.key];
      if (!choice.options.includes(value)) throw this.error('validation_option', { name: choice.key });
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
        ? [`${this.t('choose_type')} : ${item.type}`, `${this.t('value')} : ${item.displayValue}`]
        : [`${this.t('price')} : ${item.displayValue}`, ...item.content.map(value => `• ${this.offerText(value)}`),
          ...Object.entries(item.options).map(([key, value]) => `${this.offerText(key)} : ${this.offerText(value)}`)];
      return [`${index + 1}. ${this.itemName(item)}`, ...details, `${this.t('quantity')} : ${item.quantity}`].join('\n');
    });
    return `${this.t('order_hello')}\n\n${this.t('order_title')}\n\n${lines.join('\n\n')}\n\n${this.t('order_thanks')}`;
  }
}

JuffOrderCart.translations = translations;
JuffOrderCart.translate = translate;

if (typeof module !== 'undefined' && module.exports) module.exports = JuffOrderCart;
