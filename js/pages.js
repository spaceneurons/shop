const LumiPages = (() => {
  function home() {
    document.title = "LUMI — стиль в каждом моменте";
    LumiUI.boot((main) => {
      const fresh = LUMI.products.filter((item) => item.home).slice(0, 4).map((item) => {
        const category = LUMI.category(item.category);
        return LumiUI.lookCard({ id: category.id, name: category.name, image: item.image }, "zoom");
      }).join("");
      const arrivals = LUMI.products.filter((item) => item.fresh).map((item) => LumiUI.productCard(item)).join("");
      const generations = LUMI.generations.map((item) => LumiUI.lookCard(item)).join("");
      main.innerHTML = `
        <div class="hero-wrap">${LumiUI.banner([LUMI.hero[0]])}</div>
        ${LumiUI.section("Выбрать категорию", "", `<div class="products home">${fresh}</div>`, "inset")}
        ${LumiUI.section("Новые поступления", "catalog.html?sort=new", LumiUI.rail(arrivals), "inset")}
        <div class="promo-wrap">${LumiUI.banner(LUMI.promo, true)}</div>
        ${LumiUI.section("Для каждого поколения", "catalog.html", `<div class="looks gens">${generations}</div>`, "loose")}
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
    const initial = params.get("sort");
    let sort = initial === "price-asc" || initial === "price-desc" ? initial : "new";
    const categoryName = LUMI.category(category)?.name;
    const title = sale ? "Распродажа" : categoryName || "Каталог";
    document.title = `${title} — LUMI`;

    LumiUI.boot((main) => {
      function list() {
        let items = LUMI.products.filter((item) => {
          if (category && item.category !== category) return false;
          if (sale && !item.compareAt) return false;
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
          ...LUMI.categories.map((item) => [`catalog.html?category=${item.id}${saleQuery}`, item.name, category === item.id]),
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
      const related = LUMI.products.filter((entry) => entry.category === item.category && entry.id !== item.id).slice(0, 4);
      let size = null;
      let hinted = false;

      function draw() {
        const sizes = LUMI.sizes(item.category);
        main.innerHTML = `<div class="page">
          <p class="crumbs"><a href="index.html">Главная</a> / <a href="catalog.html?category=${item.category}">${LumiUI.esc(category.name)}</a></p>
          <div class="product-layout">
            <div class="product-photo">${lumiArt({ image: item.image, mode: "packshot" })}</div>
            <div>
              <p class="kicker">${LumiUI.esc(category.name)}</p>
              <h1 class="page-title">${LumiUI.esc(item.name)}</h1>
              <p class="price-row">${LUMI.money(item.price)}${item.compareAt ? `<s>${LUMI.money(item.compareAt)}</s>` : ""}</p>
              <p class="intro">${LumiUI.esc(item.description)}</p>
              <p class="tiny">${LumiUI.esc(item.material)}</p>
              <div class="sizes ${hinted && !size ? "shake" : ""}" style="margin-top:24px">
                <p class="tiny" style="width:100%;color:var(--nav)">Размер</p>
                ${sizes.map((entry) => `<button type="button" data-pick="${LumiUI.esc(entry)}" class="${size === entry ? "is-on" : ""}">${LumiUI.esc(entry)}</button>`).join("")}
              </div>
              <p class="form-error size-error" ${hinted && !size ? "" : "hidden"}>Выберите размер.</p>
              <div class="buy-row">
                <button class="btn" type="button" id="buy">Добавить в корзину</button>
                <button class="btn btn-ghost" type="button" data-wish="${item.id}" data-wish-label="text">${LumiStore.wished(item.id) ? "В избранном" : "В избранное"}</button>
              </div>
              <p class="tiny">Бесплатная доставка от 8 000 ₽. Обмен и возврат — 14 дней, если вещь не носили.</p>
            </div>
          </div>
          ${related.length ? `<section class="block"><h2>Ещё из раздела</h2><div class="products catalog">${related.map((entry) => LumiUI.productCard(entry)).join("")}</div></section>` : ""}
        </div>`;
        main.querySelectorAll("[data-pick]").forEach((button) => {
          button.addEventListener("click", () => {
            size = button.dataset.pick;
            hinted = false;
            draw();
          });
        });
        main.querySelector("#buy").addEventListener("click", () => {
          if (!size) {
            hinted = true;
            draw();
            return;
          }
          LumiStore.add(item.id, size);
          LumiUI.open("cart");
        });
      }
      draw();
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
