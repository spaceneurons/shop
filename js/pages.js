const LumiPages = (() => {
  function home() {
    document.title = "LUMI — стиль в каждом моменте";
    LumiUI.boot((main) => {
      const fresh = LUMI.products.filter((item) => item.home).slice(0, 4).map((item) => {
        const category = LUMI.category(item.category);
        return LumiUI.lookCard({ id: category.id, name: category.name, image: item.image }, "zoom");
      }).join("");
      const arrivals = LUMI.products.filter((item) => item.fresh).map((item) => LumiUI.productCard(item)).join("");
      main.innerHTML = `
        <div class="hero-wrap">${LumiUI.banner([LUMI.hero[0]])}</div>
        ${LumiUI.section("Выбрать категорию", "", `<div class="products home">${fresh}</div>`, "inset")}
        ${LumiUI.section("Новые поступления", "catalog.html?sort=new", LumiUI.rail(arrivals), "inset")}
        <div class="promo-wrap">${LumiUI.banner(LUMI.promo)}</div>
        <section class="signup">
          <div class="signup-photo">
            <img src="images/${encodeURIComponent("image 33.png")}" alt="Свитшот и широкие джинсы">
            <div class="signup-copy">
              <h2>Утренний слой</h2>
              <p class="price">Свитшот и деним</p>
              <p class="note">Мягкий ворот, широкие брюки и ни одной лишней детали.</p>
            </div>
          </div>
          <div class="signup-panel">
            <div class="signup-inner">
              <p class="kicker">Рассылка</p>
              <h2>Редкие письма</h2>
              <p class="signup-lead">Коротко и нечасто: новинки и спокойные скидки.</p>
              <form id="newsletter-form">
                <label>Имя
                  <input name="name" type="text" autocomplete="name">
                </label>
                <label>Почта
                  <input name="email" type="email" autocomplete="email">
                </label>
                <p class="form-error" hidden></p>
                <button type="submit">Подписаться</button>
              </form>
            </div>
          </div>
        </section>
        ${LumiUI.section("Вам может понравиться", "catalog.html", `<div class="picks">${["wide-trousers", "basic-sweatshirt", "knit-dress", "warm-jacket"].map((id) => LumiUI.suggestCard(LUMI.product(id))).join("")}</div>`, "suggest", "Изучить все")}
      `;
      const banners = main.querySelectorAll("[data-banner]");
      LumiUI.mountBanner(banners[0], [LUMI.hero[0]]);
      LumiUI.mountBanner(banners[1], LUMI.promo);
    });
  }

  function catalog() {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const sale = params.get("sale") === "1";
    const freshOnly = params.get("fresh") === "1";
    const kind = params.get("kind");
    const initial = params.get("sort");
    let sort = initial === "price-asc" || initial === "price-desc" ? initial : "new";
    const categoryName = LUMI.category(category)?.name;
    const title = freshOnly ? "Новинки" : kind && LUMI.kinds[kind] ? LUMI.kinds[kind] : sale ? "Распродажа" : categoryName || "Каталог";
    document.title = `${title} — LUMI`;

    LumiUI.boot((main) => {
      function list() {
        let items = LUMI.products.filter((item) => {
          if (category && item.category !== category) return false;
          if (sale && !item.compareAt) return false;
          if (freshOnly && !item.fresh) return false;
          if (kind && item.garment !== kind) return false;
          return true;
        });
        if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
        if (sort === "new") items = [...items].sort((a, b) => Number(Boolean(b.fresh)) - Number(Boolean(a.fresh)));
        return items;
      }

      function draw() {
        const items = list();
        const saleQuery = sale ? "&sale=1" : "";
        const chips = [
          ["catalog.html", "Все", !category && !sale],
          ...LUMI.categories.filter((item) => item.id !== "baby").map((item) => [`catalog.html?category=${item.id}${saleQuery}`, item.name, category === item.id]),
          ["catalog.html?sale=1", "Распродажа", sale && !category],
        ];
        main.innerHTML = `<div class="page fade-up">
          <p class="kicker">LUMI</p>
          <h1 class="page-title">${LumiUI.esc(title)}</h1>
          <p class="intro">${sale ? "Вещи, на которые сейчас действует скидка. Цены уже пересчитаны." : "Спокойные силуэты, нейтральные цвета и вещи, которые легко сочетать между собой."}</p>
          <div class="catalog-tools">
            <div class="filters">${chips.map(([href, label, on]) => `<a class="chip ${on ? "is-on" : ""}" href="${href}">${LumiUI.esc(label)}</a>`).join("")}</div>
            <label class="sort">Сортировка
              <select id="sort">
                <option value="new" ${sort === "new" ? "selected" : ""}>Сначала новинки</option>
                <option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>Сначала дешевле</option>
                <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Сначала дороже</option>
              </select>
            </label>
          </div>
          ${items.length
            ? `<div class="products catalog">${items.map((item) => LumiUI.productCard(item)).join("")}</div>`
            : `<div class="empty"><p>В этом разделе пока пусто.</p><a class="btn" href="catalog.html">Смотреть весь каталог</a></div>`}
        </div>`;
        main.querySelector("#sort").addEventListener("change", (event) => {
          sort = event.target.value;
          const next = new URLSearchParams(location.search);
          if (sort === "new") next.delete("sort");
          else next.set("sort", sort);
          const query = next.toString();
          history.replaceState(null, "", query ? `catalog.html?${query}` : "catalog.html");
          draw();
        });
      }
      draw();
    });
  }

  function reviewOf(id) {
    let n = 7;
    for (const ch of id) n = (n * 31 + ch.charCodeAt(0)) % 1000;
    return { score: 4 + ((n % 9) + 1) / 10, count: 6 + (n % 28) };
  }

  function starRow(score) {
    const filled = Math.round(score);
    return `<span class="pdp-stars" aria-hidden="true">${Array.from({ length: 5 }, (_, index) => `<svg viewBox="0 0 20 20"><path d="m10 1.8 2.2 4.6 5 .7-3.6 3.5.9 5L10 13.4 5.5 15.6l.9-5L2.8 7.1l5-.7z"${index < filled ? "" : ' fill="none"'}/></svg>`).join("")}</span>`;
  }

  function shot(image, focus, scale, alt) {
    const src = `images/${encodeURIComponent(image)}`;
    const zoom = scale && scale !== 1 ? `transform:scale(${scale});transform-origin:${focus}` : "";
    return `<div class="pdp-shot"><img src="${src}" alt="${alt}" style="object-position:${focus};${zoom}"></div>`;
  }

  function productTile(entry) {
    return `<a class="pdp-tile" href="product.html?id=${entry.id}">
      ${shot(entry.image, "center 22%", 1, "")}
      <strong>${LumiUI.esc(entry.name)}</strong>
      <em>${LUMI.money(entry.price)}${entry.compareAt ? `<s>${LUMI.money(entry.compareAt)}</s>` : ""}</em>
    </a>`;
  }

  function product() {
    const id = new URLSearchParams(location.search).get("id");
    const item = LUMI.product(id);
    document.title = item ? `${item.name} — LUMI` : "Вещь не найдена — LUMI";
    LumiUI.boot((main) => {
      if (!item) {
        main.innerHTML = `<div class="page" style="text-align:center;padding-top:80px">
          <h1 class="page-title">Такой вещи нет</h1>
          <p class="intro" style="margin:8px auto 0">Возможно, ссылка устарела. В каталоге есть актуальные модели.</p>
          <a class="btn" href="catalog.html" style="margin-top:24px">В каталог</a>
        </div>`;
        return;
      }
      const category = LUMI.category(item.category);
      const kind = LUMI.kinds[item.garment] || category.name;
      const review = reviewOf(item.id);
      const wished = LumiStore.wished(item.id);
      const sizes = LUMI.sizes(item.category);
      const fits = ["Свободная", "Обычная", "Укороченная"];
      const fitDefault = /оверсайз|широкие/i.test(item.name) ? "Свободная" : "Обычная";
      const colors = LUMI.products.filter((entry) => entry.category === item.category);
      const others = LUMI.products.filter((entry) => entry.id !== item.id);
      const viewed = [...others.filter((entry) => entry.category === item.category), ...others.filter((entry) => entry.category !== item.category)].slice(0, 5);
      const liked = others.filter((entry) => !viewed.includes(entry)).slice(0, 5);
      const lines = item.description.split(/(?<=\.)\s+/).filter(Boolean);
      const frame = (index, focus, scale, alt) => {
        const photos = item.shots && item.shots.length ? item.shots : [item.image];
        const photo = photos[index] || photos[0];
        return shot(photo, photos[index] ? "center 28%" : focus, photos[index] ? 1 : scale, alt);
      };
      const srcNote = item.category === "baby" || item.category === "girls" || item.category === "boys"
        ? "Размер указан по росту. Если ребёнок между двумя значениями, берите больший."
        : "Берите свой обычный размер. Свободная посадка сидит с запахом, укороченная — ближе к телу.";

      main.innerHTML = `<div class="page pdp">
        <p class="crumbs"><a href="catalog.html?category=${item.category}">${LumiUI.esc(category.name)}</a> / <a href="catalog.html?category=${item.category}&kind=${item.garment}">${LumiUI.esc(kind)}</a></p>
        <div class="pdp-top">
          <div class="pdp-gallery">
            ${frame(0, "center 8%", 1.9, item.name)}
            ${frame(1, "center 40%", 1, "")}
            ${frame(2, "center 100%", 2.1, "")}
            ${frame(3, "center 22%", 3.1, "")}
          </div>
          <aside class="pdp-buy">
            <div class="pdp-title-row">
              <h1>${LumiUI.esc(item.name)}</h1>
              <button class="heart ${wished ? "is-on" : ""}" type="button" data-wish="${item.id}" aria-label="В избранное" aria-pressed="${wished}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19s-7-4.4-7-8.2A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 7 2.8C19 14.6 12 19 12 19z"/></svg></button>
            </div>
            <p class="pdp-price">${item.compareAt ? `<s>${LUMI.money(item.compareAt)}</s>` : ""}<strong>${LUMI.money(item.price)}</strong></p>
            <p class="pdp-rating">${starRow(review.score)} <span>${review.score.toFixed(1).replace(".", ",")} · ${review.count} отзывов</span></p>
            <p class="pdp-label">Цвет: ${LumiUI.esc(item.color || kind)}</p>
            <div class="pdp-swatches">${colors.map((entry) => `<a class="${entry.id === item.id ? "is-on" : ""}" href="product.html?id=${entry.id}" style="background:${entry.cloth}" aria-label="${LumiUI.esc(entry.color || entry.name)}"></a>`).join("")}</div>
            <p class="pdp-label">Посадка</p>
            <div class="pdp-fits">${fits.map((fit) => `<button type="button" data-fit="${LumiUI.esc(fit)}" class="${fit === fitDefault ? "is-on" : ""}">${LumiUI.esc(fit)}</button>`).join("")}</div>
            <div class="pdp-label-row"><span>Размер</span><button type="button" data-size-guide>Таблица размеров</button></div>
            <div class="pdp-sizes">${sizes.map((entry) => `<button type="button" data-pick="${LumiUI.esc(entry)}">${LumiUI.esc(entry)}</button>`).join("")}</div>
            <p class="form-error size-error" hidden>Выберите размер.</p>
            <div class="pdp-cart">
              <label class="pdp-qty">Количество
                <select id="pdp-qty">${[1, 2, 3, 4, 5].map((qty) => `<option value="${qty}">${qty}</option>`).join("")}</select>
              </label>
              <button class="pdp-add" type="button" id="buy">В корзину</button>
            </div>
            <p class="pdp-fine">Бесплатная доставка от ${LUMI.money(LUMI.freeShipping)}.</p>
            <div class="pdp-notes">
              <a href="delivery.html"><strong>Доставка</strong><span>Бесплатно от ${LUMI.money(LUMI.freeShipping)}. По России — в ближайший день после сборки.</span></a>
              <a href="stores.html"><strong>Самовывоз</strong><span>Из магазина LUMI. Выбрать адрес</span></a>
            </div>
            <p class="pdp-label">Важно знать</p>
            <div class="pdp-know">${lines.map((line) => `<p>${LumiUI.esc(line)}</p>`).join("")}</div>
            <div class="pdp-folds">
              <details id="pdp-size" open>
                <summary>Размер и посадка</summary>
                <p>${srcNote}</p>
                <p>На фото — спокойный студийный свет, без ретуши силуэта.</p>
              </details>
              <details>
                <summary>Ткань и уход</summary>
                <p>${LumiUI.esc(item.material)}. Деликатная стирка при 30°C, без отбеливателя. Сушить в расправленном виде.</p>
              </details>
              <details>
                <summary>О вещи</summary>
                <p>${LumiUI.esc(item.description)}</p>
              </details>
              <details>
                <summary>Доставка и возврат</summary>
                <p>От ${LUMI.money(LUMI.freeShipping)} доставка бесплатная. 14 дней на обмен и возврат, если вещь не носили. <a href="delivery.html">Доставка</a> · <a href="returns.html">Возврат</a></p>
              </details>
            </div>
          </aside>
        </div>
        ${viewed.length ? `<section class="pdp-also"><h2>Смотрели также</h2><div class="pdp-row">${viewed.map(productTile).join("")}</div></section>` : ""}
        ${liked.length ? `<section class="pdp-also"><h2>Вам может понравиться</h2><div class="pdp-row">${liked.map(productTile).join("")}</div></section>` : ""}
      </div>`;

      let size = null;
      main.querySelectorAll("[data-fit]").forEach((button) => {
        button.addEventListener("click", () => {
          main.querySelectorAll("[data-fit]").forEach((entry) => entry.classList.toggle("is-on", entry === button));
        });
      });
      main.querySelectorAll("[data-pick]").forEach((button) => {
        button.addEventListener("click", () => {
          size = button.dataset.pick;
          main.querySelectorAll("[data-pick]").forEach((entry) => entry.classList.toggle("is-on", entry === button));
          main.querySelector(".size-error").hidden = true;
          main.querySelector(".pdp-sizes").classList.remove("shake");
        });
      });
      main.querySelector("[data-size-guide]").addEventListener("click", () => {
        const fold = document.getElementById("pdp-size");
        fold.open = true;
        fold.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      main.querySelector("#buy").addEventListener("click", () => {
        if (!size) {
          const row = main.querySelector(".pdp-sizes");
          row.classList.remove("shake");
          void row.offsetWidth;
          row.classList.add("shake");
          main.querySelector(".size-error").hidden = false;
          return;
        }
        const qty = Number(main.querySelector("#pdp-qty").value) || 1;
        const result = LumiStore.add(item.id, size, qty);
        if (result) LumiUI.toast("Добавили в корзину", `${result.product.name} · ${result.size}`);
        LumiUI.open("cart");
      });
    });
  }

  const infoPages = {
    about: {
      title: "О бренде",
      heading: "Гардероб, который не шумит",
      lead: "LUMI собирает одежду для всей семьи в одной спокойной палитре. Мы оставляем крой, ткань и посадку — и убираем всё, что устаревает за сезон.",
      blocks: [
        ["Для кого", "Для тех, кто носит вещи долго: женщинам, мужчинам, детям и малышам. Один дом — и образы, которые не спорят друг с другом."],
        ["Как выбираем", "Плотный хлопок, мягкий трикотаж, шерсть без блеска, кожа без логотипов. Если вещь не хочется надеть на третий день, она не попадает в каталог."],
        ["Где шьём", "Небольшие партии. Размерную сетку проверяем на примерке, а не только по таблице. Поэтому оверсайз здесь действительно свободный, а не просто большой."],
        ["Как устроен магазин", "Эта витрина работает в браузере: корзина, избранное и профиль сохраняются локально. Оплата и доставка показаны как сценарий заказа, без реального списания."],
      ],
    },
    delivery: {
      title: "Доставка и оплата",
      heading: "Соберём и отправим",
      lead: "По России отправляем в ближайший день после сборки. От 8 000 ₽ доставка бесплатная — прогресс виден прямо в корзине.",
      blocks: [
        ["Курьер и пункты выдачи", "Москва и Санкт-Петербург — курьер на следующий день. Остальные города — пункт выдачи, обычно 2–5 дней."],
        ["Оплата", "Картой на сайте или при получении. В этой демонстрации заказ подтверждается локально и деньги не списываются."],
        ["Примерка", "У курьера можно оставить вещи, которые не подошли. В пункте выдачи — 15 минут на примерку, если формат это позволяет."],
        ["Упаковка", "Без лишней бумаги: тканевый мешок и плотная коробка только для верхней одежды и сумок."],
      ],
    },
    returns: {
      title: "Обмен и возврат",
      heading: "14 дней, чтобы решить",
      lead: "Если вещь не села, её можно вернуть или обменять. Нам важно, чтобы она осталась в том виде, в котором уехала.",
      blocks: [
        ["Срок", "14 дней с момента получения. Сохраните бирки и товарный вид — без следов носки, стирки и парфюма."],
        ["Обмен размера", "Напишите нам размер, который нужен. Если он есть, отправим замену и заберём предыдущий тем же курьером."],
        ["Возврат денег", "После проверки на складе возвращаем оплату тем же способом. Обычно это занимает до 5 рабочих дней."],
        ["Что не возвращаем", "Нижнее бельё и персональные заказы. Уценённые вещи из раздела «Распродажа» возвращаются, если брак — и не возвращаются, если просто не подошёл цвет."],
      ],
    },
    contacts: {
      title: "Контакты",
      heading: "Напишите, если нужна помощь с размером",
      lead: "Отвечаем в будни с 10:00 до 19:00 по Москве. По заказам лучше сразу указать номер — так быстрее найдём вещь.",
      form: true,
      blocks: [
        ["Почта", "hello@lumi.store — для заказов, обмена и вопросов по ткани."],
        ["Шоурум", "Москва, Патриаршие пруды. Примерка по записи, без витринной очереди."],
        ["Телефон", "+7 495 000-00-00. Если не берём трубку, напишите — перезвоним в тот же день."],
        ["Соцсети", "Короткие заметки о посадке и новых партиях. Ссылки в подвале ведут сюда, пока каналы не подключены."],
      ],
    },
  };

  function info(key) {
    const page = infoPages[key];
    document.title = `${page.title} — LUMI`;
    LumiUI.boot((main) => {
      main.innerHTML = `<div class="page fade-up">
        <p class="kicker">${LumiUI.esc(page.title)}</p>
        <h1 class="page-title">${LumiUI.esc(page.heading)}</h1>
        <p class="intro">${LumiUI.esc(page.lead)}</p>
        <div class="info-grid">${page.blocks.map(([title, text]) => `<article class="info-card"><h2>${LumiUI.esc(title)}</h2><p>${LumiUI.esc(text)}</p></article>`).join("")}</div>
        ${page.form ? `<div class="contact-card" style="margin-top:24px;max-width:520px">
          <h2>Написать нам</h2>
          <form id="contact-form">
            <input class="field" name="name" placeholder="Имя" aria-label="Имя">
            <input class="field" name="contact" placeholder="Почта или телефон" aria-label="Почта или телефон">
            <textarea name="message" placeholder="Сообщение" aria-label="Сообщение"></textarea>
            <p class="form-error" hidden></p>
            <button class="btn" type="submit">Отправить</button>
          </form>
          <p id="contact-success" hidden></p>
        </div>` : ""}
      </div>`;
    });
  }

  function stores() {
    document.title = "Адреса — LUMI";
    LumiUI.boot((main) => {
      const shops = LUMI.stores;
      main.innerHTML = `<div class="page fade-up">
        <p class="kicker">Магазины</p>
        <h1 class="page-title">Адреса</h1>
        <p class="intro">Пять магазинов LUMI в Беларуси. Точки на карте — там, где можно примерить вещи.</p>
        <div id="store-map" class="store-map" role="region" aria-label="Карта магазинов в Беларуси"></div>
        <div class="store-list">${shops.map((shop, index) => `<button class="store-card" type="button" data-store="${index}"><h2>${LumiUI.esc(shop.city)}</h2><p>${LumiUI.esc(shop.address)}</p><p>${LumiUI.esc(shop.hours)}</p></button>`).join("")}</div>
      </div>`;
      const mapHost = document.getElementById("store-map");
      if (typeof L === "undefined") {
        mapHost.innerHTML = `<p class="muted">Карта не загрузилась. Адреса магазинов — в списке ниже.</p>`;
        return;
      }
      const map = L.map(mapHost, { scrollWheelZoom: false }).fitBounds([[51.25, 23.15], [56.2, 32.8]], { padding: [24, 24] });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);
      const markers = shops.map((shop) => L.circleMarker([shop.lat, shop.lng], {
        radius: 8,
        color: "#1a1a1e",
        weight: 2,
        fillColor: "#1a1a1e",
        fillOpacity: 1,
      }).addTo(map).bindPopup(`<strong>${LumiUI.esc(shop.city)}</strong><br>${LumiUI.esc(shop.address)}<br>${LumiUI.esc(shop.hours)}`));
      main.querySelectorAll("[data-store]").forEach((button) => {
        button.addEventListener("click", () => {
          const marker = markers[Number(button.dataset.store)];
          map.setView(marker.getLatLng(), 13);
          marker.openPopup();
        });
      });
    });
  }

  function missing() {
    document.title = "Страница не найдена — LUMI";
    LumiUI.boot((main) => {
      main.innerHTML = `<div class="page" style="text-align:center;padding-top:80px">
        <h1 class="page-title">Страница не найдена</h1>
        <p class="intro" style="margin:8px auto 0">Такого адреса нет. Вернитесь на витрину.</p>
        <a class="btn" href="index.html" style="margin-top:24px">На главную</a>
      </div>`;
    });
  }

  return { home, catalog, product, info, stores, missing };
})();
