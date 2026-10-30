const LUMI = {
  freeShipping: 8000,
  palettes: {
    charcoal: { from: "#4a433c", to: "#8d847a", light: "#d9d0c6", cloth: "#1c1b1a", cloth2: "#3a3836", skin: "#c9a88c", hair: "#3a2a22" },
    sand: { from: "#c9b7a4", to: "#a89480", light: "#f0e6da", cloth: "#d9c7b2", cloth2: "#c4b09a", skin: "#d2b294", hair: "#2c241e" },
    cream: { from: "#e7ddd2", to: "#d4c8ba", light: "#f7f2eb", cloth: "#f3ece3", cloth2: "#e4d9cc", skin: "#e4c4aa", hair: "#6a4b36" },
    ink: { from: "#2c2c2e", to: "#5c5c60", light: "#ddd8d2", cloth: "#161618", cloth2: "#3a3a3e", skin: "#c9a88c", hair: "#1a1a1c" },
    oat: { from: "#f0e4d4", to: "#e4d2c0", light: "#f8f2ea", cloth: "#f6efe6", cloth2: "#eadccb", skin: "#f0d0b8", hair: "#c4a27a" },
    stone: { from: "#d9d2c9", to: "#c3bab0", light: "#f4f0ea", cloth: "#2a2724", cloth2: "#e7e0d6", skin: "#d8bba4", hair: "#3a3028" },
    taupe: { from: "#6a6158", to: "#b7ab9e", light: "#efe6dc", cloth: "#f4efe8", cloth2: "#d9d0c4", skin: "#c9a88c", hair: "#3a2c24" },
    greige: { from: "#6e6a64", to: "#b7b2aa", light: "#ece7e0", cloth: "#3e4650", cloth2: "#efe8de", skin: "#d2b294", hair: "#2a2622" },
    blush: { from: "#cfc3b8", to: "#8f8680", light: "#f3ece6", cloth: "#1e1e20", cloth2: "#8f3034", skin: "#d7b496", hair: "#4a3428" },
    fog: { from: "#d5d0c8", to: "#b7b1a8", light: "#f6f3ee", cloth: "#8d8a86", cloth2: "#f3efe8", skin: "#e0c2a8", hair: "#cbb59a" },
    navy: { from: "#8e9296", to: "#c8c4be", light: "#eeeae4", cloth: "#1e2830", cloth2: "#d5d8dc", skin: "#c9a88c", hair: "#1a1c1e" },
  },
  categories: [
    { id: "women", name: "Женщины", dative: "Женщинам", palette: "charcoal", garment: "hoodie", hair: "long" },
    { id: "men", name: "Мужчины", dative: "Мужчинам", palette: "sand", garment: "hoodie", hair: "short" },
    { id: "girls", name: "Девочки", dative: "Девочкам", palette: "cream", garment: "cardigan", hair: "long" },
    { id: "boys", name: "Мальчики", dative: "Мальчикам", palette: "ink", garment: "hoodie", hair: "beanie" },
    { id: "baby", name: "Baby", dative: "Малышам", palette: "oat", garment: "onesie", hair: "baby" },
  ],
  generations: [
    { id: "women", label: "Женщинам", palette: "blush", garment: "jacket", hair: "long" },
    { id: "men", label: "Мужчинам", palette: "fog", garment: "sweater", hair: "short" },
    { id: "girls", label: "Девочкам", palette: "cream", garment: "coat", hair: "beanie" },
    { id: "boys", label: "Мальчикам", palette: "navy", garment: "puffer", hair: "beanie" },
    { id: "baby", label: "Малышам", palette: "oat", garment: "sweater", hair: "twins" },
  ],
  products: [
    { id: "oversized-sweater", name: "Объемный свитер оверсайз", category: "women", price: 5990, garment: "sweater", color: "Молочный", cloth: "#f4efe8", cloth2: "#d9d2c8", home: true, fresh: true, material: "Шерсть мериноса, хлопок", description: "Мягкий свободный силуэт с широким плечом и спокойной длиной. Носится отдельно или поверх рубашки — и не спорит с джинсами." },
    { id: "hooded-puffer", name: "Пуховик с капюшоном", category: "men", price: 16990, garment: "puffer", color: "Чёрный", cloth: "#1a1a1c", cloth2: "#3a3a3e", home: true, fresh: true, material: "Нейлон, пух и перо", description: "Короткий объём без лишнего блеска. Капюшон держит форму, а лёгкий наполнитель не превращает силуэт в шар." },
    { id: "knit-cardigan", name: "Кардиган вязаный", category: "girls", price: 4990, garment: "cardigan", color: "Кремовый", cloth: "#f7f1e8", cloth2: "#e6d9c8", home: true, fresh: true, material: "Хлопок, акрил", description: "Тёплый кардиган на пуговицах с мягкой резинкой. Достаточно спокойный, чтобы носить его в школу и на прогулку." },
    { id: "print-hoodie", name: "Худи с принтом", category: "boys", price: 3990, garment: "hoodie", color: "Чёрный", cloth: "#1c1c1e", cloth2: "#eceae6", home: true, fresh: true, material: "Хлопок футер", description: "Плотное худи с капюшоном и небольшим принтом на груди. Крой прямой, без лишнего объёма в рукаве." },
    { id: "warm-onesie", name: "Комбинезон утепленный", category: "baby", price: 7990, garment: "onesie", color: "Песочный", cloth: "#f3eadf", cloth2: "#e4d5c4", home: true, fresh: true, material: "Хлопок, утеплитель", description: "Мягкий комбинезон, который легко надевать: кнопки от горла до пятки и спокойный песочный цвет." },
    { id: "straight-coat", name: "Пальто прямого кроя", category: "women", price: 18990, compareAt: 24990, garment: "coat", color: "Графит", cloth: "#2c2a28", cloth2: "#5c5854", fresh: true, material: "Шерсть", description: "Прямое пальто до колена без пояса и лишних деталей. Хорошо сидит на свитер и на платье." },
    { id: "wide-trousers", name: "Брюки широкие", category: "women", price: 7990, garment: "trousers", color: "Серый", cloth: "#c5c8cc", cloth2: "#8e939a", material: "Хлопок, эластан", description: "Спокойные широкие брюки с высокой посадкой. Защип спрятан, край можно подвернуть." },
    { id: "basic-sweatshirt", name: "Свитшот базовый", category: "men", price: 5490, garment: "sweatshirt", color: "Светло-серый", cloth: "#e7e2db", cloth2: "#cfc8be", fresh: true, material: "Хлопок", description: "Плотный свитшот без принта. Рукав чуть укорочен, чтобы было видно запястье." },
    { id: "straight-jeans", name: "Джинсы прямые", category: "men", price: 8990, garment: "jeans", color: "Деним", cloth: "#6d7680", cloth2: "#3e4650", material: "Деним", description: "Прямой деним средней плотности. Цвет спокойный, без потертостей и контрастной строчки." },
    { id: "knit-dress", name: "Платье вязаное", category: "girls", price: 4590, compareAt: 5990, garment: "dress", color: "Молочный", cloth: "#f6f0e8", cloth2: "#e7d9c8", material: "Хлопок", description: "Прямое вязаное платье с длинным рукавом. Не колется и не обтягивает." },
    { id: "warm-jacket", name: "Куртка утепленная", category: "boys", price: 9990, garment: "jacket", color: "Тёмно-синий", cloth: "#243038", cloth2: "#4c5964", material: "Нейлон, утеплитель", description: "Короткая куртка с капюшоном и тихой фурнитурой. Достаточно тёплая для осени без пуховика." },
    { id: "cotton-pajamas", name: "Пижама хлопковая", category: "baby", price: 3490, garment: "pajamas", color: "Кремовый", cloth: "#f7f1e8", cloth2: "#e7dccf", material: "Хлопок", description: "Мягкий комплект из лонгслива и брюк. Швы наружу, чтобы ничего не натирало." },
    { id: "oversized-shirt", name: "Рубашка оверсайз", category: "women", price: 6490, compareAt: 7990, garment: "shirt", color: "Белый", cloth: "#f7f4ef", cloth2: "#e4ddd4", material: "Хлопок", description: "Свободная рубашка из плотного хлопка. Хорошо смотрится навыпуск и заправленной наполовину." },
  ],
  hero: [
    { id: "new", eyebrow: "Новая коллекция", title: ["Стиль в каждом", "моменте"], text: "Создайте свой безупречный образ для любого повода", cta: "Перейти к новой коллекции", href: "catalog.html?sort=new", palette: "taupe", garment: "sweater", hair: "long" },
    { id: "autumn", eyebrow: "Осенний гардероб", title: ["Тихие", "оттенки", "сезона"], text: "Пальто, трикотаж и деним — собранные так, чтобы носить их каждый день.", cta: "Смотреть образы", href: "catalog.html?category=women", palette: "greige", garment: "coat", hair: "long" },
    { id: "family", eyebrow: "Для всей семьи", title: ["Один дом,", "много", "стилей"], text: "Женщинам, мужчинам и детям — в одной спокойной палитре, без крикливых деталей.", cta: "Выбрать категорию", href: "catalog.html", palette: "stone", garment: "sweater", hair: "twins" },
  ],
  promo: [
    { id: "sale", eyebrow: "Только до 31 октября", title: ["Скидка 30%", "на выбранные стили"], text: "Обновите гардероб с выгодой — любимые вещи стали доступнее.", cta: "Смотреть коллекцию", href: "catalog.html?sale=1", palette: "greige", garment: "sweater", hair: "none", heroType: true },
    { id: "knit", eyebrow: "Новинки недели", title: ["Трикотаж,", "который хочется"], text: "Мягкие фактуры и свободный крой — уже можно примерить в каталоге.", cta: "К новинкам", href: "catalog.html?sort=new", palette: "taupe", garment: "cardigan", hair: "none", plate: true },
    { id: "delivery", eyebrow: "Доставка", title: ["Бесплатно", "от 8 000 ₽"], text: "Соберём заказ аккуратно и отправим по России в ближайший день.", cta: "Условия доставки", href: "delivery.html", palette: "fog", garment: "tote", hair: "none", dark: true },
  ],
  stores: [
    { id: "minsk", city: "Минск", address: "ул. Немига, 5", hours: "ежедневно 10:00–21:00", lat: 53.9054, lng: 27.5543 },
    { id: "brest", city: "Брест", address: "ул. Советская, 52", hours: "ежедневно 10:00–21:00", lat: 52.0938, lng: 23.6854 },
    { id: "grodno", city: "Гродно", address: "ул. Советская, 31", hours: "ежедневно 10:00–21:00", lat: 53.678, lng: 23.8294 },
    { id: "gomel", city: "Гомель", address: "пр-т Ленина, 10", hours: "ежедневно 10:00–21:00", lat: 52.424, lng: 30.987 },
    { id: "vitebsk", city: "Витебск", address: "ул. Ленина, 26", hours: "ежедневно 10:00–21:00", lat: 55.191, lng: 30.204 },
  ],
};

LUMI.category = (id) => LUMI.categories.find((item) => item.id === id);
LUMI.product = (id) => LUMI.products.find((item) => item.id === id);
LUMI.money = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
LUMI.sizes = (category) => {
  if (category === "baby") return ["62", "68", "74", "80", "86"];
  if (category === "girls" || category === "boys") return ["104", "110", "116", "122", "128"];
  return ["XS", "S", "M", "L", "XL"];
};
LUMI.defaultSize = (category) => {
  if (category === "baby") return "74";
  if (category === "girls" || category === "boys") return "116";
  return "M";
};
LUMI.kinds = {
  sweater: "Свитеры",
  coat: "Пальто",
  trousers: "Брюки",
  shirt: "Рубашки",
  puffer: "Пуховики",
  sweatshirt: "Свитшоты",
  jeans: "Джинсы",
  cardigan: "Кардиганы",
  dress: "Платья",
  hoodie: "Худи",
  jacket: "Куртки",
  onesie: "Комбинезоны",
  pajamas: "Пижамы",
};

LUMI.photos = Array.from({ length: 66 }, (_, index) => `image ${index + 12}.png`);

(() => {
  const shots = {
    "oversized-sweater": ["image 34.png", "image 37.png"],
    "hooded-puffer": ["image 53.png", "image 30.png"],
    "knit-cardigan": ["image 62.png", "image 14.png", "image 23.png"],
    "print-hoodie": ["image 68.png", "image 15.png", "image 20.png"],
    "warm-onesie": ["image 73.png", "image 16.png"],
    "straight-coat": ["image 29.png"],
    "wide-trousers": ["image 17.png", "image 18.png", "image 19.png"],
    "basic-sweatshirt": ["image 41.png", "image 40.png"],
    "straight-jeans": ["image 31.png", "image 32.png", "image 28.png", "image 13.png"],
    "knit-dress": ["image 75.png", "image 74.png", "image 70.png"],
    "warm-jacket": ["image 63.png", "image 66.png", "image 64.png"],
    "cotton-pajamas": ["image 16.png"],
    "oversized-shirt": ["image 12.png"],
  };
  LUMI.products.forEach((item) => {
    item.shots = shots[item.id] || [];
    item.image = item.shots[0];
  });
  const covers = {
    women: "image 26.png",
    men: "image 40.png",
    girls: "image 23.png",
    boys: "image 64.png",
    baby: "image 16.png",
  };
  LUMI.categories.forEach((item) => { item.image = covers[item.id]; });
  LUMI.generations.forEach((item) => { item.image = covers[item.id]; });
  const heroShots = { new: "hero-style.png", autumn: "image 29.png", family: "image 23.png" };
  LUMI.hero.forEach((item) => {
    item.image = heroShots[item.id];
    item.focus = item.id === "new" ? "center center" : "center 20%";
  });
  const promoShots = { sale: "image 26.png", knit: "image 23.png", delivery: "image 22.png" };
  LUMI.promo.forEach((item) => {
    item.image = promoShots[item.id];
    item.focus = "center 22%";
  });
})();
