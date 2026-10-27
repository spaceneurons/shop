const LumiUI = (() => {
  const toasts = [];
  let cartStep = "cart";
  let orderNo = "";
  let checkout = { name: "", phone: "", city: "", address: "" };
  let checkoutError = "";
  let open = null;
  let search = "";
  let searchOpen = false;

  function esc(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function boot(render) {
    document.body.innerHTML = layout();
    render(document.getElementById("main"));
    bind();
    paintChrome();
    window.addEventListener("scroll", paintHeader, { passive: true });
    paintHeader();
  }

  function layout() {
    return `${header()}${`<main id="main"></main>`}${footer()}${drawers()}<div id="toasts" class="toasts"></div>`;
  }

  function navLinks() {
    return [
      ...LUMI.categories
        .filter((item) => item.id !== "baby")
        .map((item) => ({ href: `catalog.html?category=${item.id}`, label: item.name })),
      { href: "catalog.html?sale=1", label: "Распродажа" },
      { href: "stores.html", label: "Адреса" },
    ];
  }

  function header() {
    const links = navLinks();
    return `<header class="header" id="header">
      <div class="frame bar">
        <button class="icon-btn only-mobile" type="button" data-open="menu" aria-label="Открыть меню">${icon("menu")}</button>
        <a class="logo" href="index.html">LUMI</a>
        <nav class="nav" aria-label="Каталог">${links.map((link) => `<a class="nav-link" href="${link.href}">${esc(link.label)}</a>`).join("")}</nav>
        <div class="search">
          <span class="search-icon">${icon("search")}</span>
          <input id="search" type="search" placeholder="Поиск по каталогу" aria-label="Поиск по каталогу" autocomplete="off">
          <div id="search-results" class="search-results" hidden></div>
        </div>
        <div class="tools">
          <button class="icon-btn only-mobile" type="button" data-open="search" aria-label="Поиск">${icon("search")}</button>
          <button class="icon-btn" type="button" data-open="account" aria-label="Профиль">${icon("user")}</button>
          <button class="icon-btn" type="button" data-open="wishlist" aria-label="Избранное">${icon("heart")}<span id="wish-count" class="badge" hidden></span></button>
          <button class="icon-btn" type="button" data-open="cart" aria-label="Корзина">${icon("bag")}<span id="cart-count" class="badge" hidden></span></button>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    const links = [
      ["about.html", "О бренде"],
      ["delivery.html", "Доставка и оплата"],
      ["returns.html", "Обмен и возврат"],
      ["contacts.html", "Контакты"],
    ];
    return `<footer class="footer"><div class="frame footer-row">
      <div class="footer-links"><a class="logo" href="index.html">LUMI</a>
        <nav aria-label="О магазине">${links.map(([href, label]) => `<a class="nav-link" href="${href}">${label}</a>`).join("")}</nav>
      </div>
      <div class="socials">
        <a href="contacts.html" aria-label="Instagram">${icon("instagram")}</a>
        <a href="contacts.html" aria-label="Telegram">${icon("telegram")}</a>
        <a href="contacts.html" aria-label="ВКонтакте">${icon("vk")}</a>
        <a href="contacts.html" aria-label="YouTube">${icon("youtube")}</a>
      </div>
    </div></footer>`;
  }

  function drawers() {
    return `<div id="overlay" class="overlay" hidden></div>
      <aside id="sheet" class="sheet" hidden></aside>
      <aside id="menu" class="sheet sheet-left" hidden></aside>
      <div id="modal" class="modal" hidden></div>`;
  }

  function bind() {
    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    document.addEventListener("change", onChange);
    document.addEventListener("submit", onSubmit);
    const searchField = document.getElementById("search");
    searchField.addEventListener("focus", () => {
      searchOpen = true;
      paintSearch();
    });
    searchField.addEventListener("blur", () => {
      window.setTimeout(() => {
        searchOpen = false;
        paintSearch();
      }, 160);
    });
    document.querySelectorAll(".rail-track").forEach((track) => {
      const sync = () => {
        const rail = track.closest(".rail");
        const max = track.scrollWidth - track.clientWidth;
        rail.querySelector(".is-prev").disabled = track.scrollLeft <= 4;
        rail.querySelector(".is-next").disabled = track.scrollLeft >= max - 4;
      };
      track.addEventListener("scroll", sync, { passive: true });
      sync();
    });
    LumiStore.subscribe(() => {
      paintChrome();
      if (open === "cart") paintCart();
      if (open === "wishlist") paintWishlist();
    });
  }

  function onClick(event) {
    const railBtn = event.target.closest("[data-rail]");
    if (railBtn) {
      const track = railBtn.closest(".rail").querySelector(".rail-track");
      const card = track.querySelector(".product");
      const gap = 4;
      const step = (card?.getBoundingClientRect().width || track.clientWidth) + gap;
      track.scrollBy({ left: Number(railBtn.dataset.rail) * step, behavior: "smooth" });
      return;
    }
    const opener = event.target.closest("[data-open]");
    if (opener) {
      show(opener.dataset.open);
      return;
    }
    if (event.target.closest("[data-close]")) {
      hide();
      return;
    }
    const wish = event.target.closest("[data-wish]");
    if (wish) {
      event.preventDefault();
      const added = LumiStore.toggleWish(wish.dataset.wish);
      const product = LUMI.product(wish.dataset.wish);
      toast(added ? "Сохранили в избранное" : "Убрали из избранного", product?.name);
      refreshHearts();
      return;
    }
    const add = event.target.closest("[data-add]");
    if (add) {
      event.preventDefault();
      const result = LumiStore.add(add.dataset.add, add.dataset.size || undefined);
      if (result) toast("Добавили в корзину", `${result.product.name} · ${result.size}`);
      return;
    }
    const qty = event.target.closest("[data-qty]");
    if (qty) {
      LumiStore.setQty(qty.dataset.id, qty.dataset.size, Number(qty.dataset.qty));
      return;
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      LumiStore.remove(remove.dataset.id, remove.dataset.size);
      return;
    }
    if (event.target.closest("[data-checkout]")) {
      cartStep = "checkout";
      paintCart();
      return;
    }
    if (event.target.closest("[data-back-cart]")) {
      cartStep = "cart";
      paintCart();
      return;
    }
    const result = event.target.closest("[data-go]");
    if (result) {
      location.href = result.dataset.go;
    }
  }

  function onInput(event) {
    if (event.target.id === "search") {
      search = event.target.value;
      searchOpen = true;
      paintSearch();
    }
    if (event.target.id === "mobile-search") {
      search = event.target.value;
      paintMobileSearch();
    }
    if (event.target.dataset.field) {
      checkout[event.target.dataset.field] = event.target.value;
    }
    if (event.target.dataset.profile) {
      event.target.closest("form").dataset[event.target.dataset.profile] = event.target.value;
    }
  }

  function onChange(event) {
    if (event.target.dataset.resize) {
      LumiStore.setSize(event.target.dataset.id, event.target.dataset.resize, event.target.value);
    }
  }

  function onSubmit(event) {
    const form = event.target;
    if (form.id === "checkout-form") {
      event.preventDefault();
      if (checkout.name.trim().length < 2 || checkout.phone.trim().length < 6 || checkout.city.trim().length < 2 || checkout.address.trim().length < 4) {
        checkoutError = "Заполните имя, телефон, город и адрес — без этого заказ не соберём.";
        paintCart();
        return;
      }
      orderNo = String(2400 + Math.floor(Math.random() * 500));
      LumiStore.clearCart();
      cartStep = "done";
      checkoutError = "";
      paintCart();
    }
    if (form.id === "account-form") {
      event.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const error = form.querySelector(".form-error");
      if (name.length < 2 || !email.includes("@")) {
        error.hidden = false;
        error.textContent = "Нужны имя и почта, чтобы обращаться к вам в корзине.";
        return;
      }
      LumiStore.saveProfile({ name, email });
      hide();
      toast("Профиль сохранён", name);
    }
    if (form.id === "contact-form") {
      event.preventDefault();
      const name = form.name.value.trim();
      const contact = form.contact.value.trim();
      const message = form.message.value.trim();
      const error = form.querySelector(".form-error");
      if (name.length < 2 || contact.length < 4 || message.length < 8) {
        error.hidden = false;
        error.textContent = "Напишите имя, как с вами связаться и коротко, о чём вопрос.";
        return;
      }
      form.hidden = true;
      const success = document.getElementById("contact-success");
      success.hidden = false;
      success.textContent = `Сообщение осталось на этой странице: в демонстрации письма не уходят. ${name}, спасибо, что написали.`;
    }
  }

  function show(name) {
    open = name;
    if (name === "cart") {
      cartStep = stateCartEmpty() ? "cart" : cartStep === "done" ? "done" : "cart";
      paintCart();
    } else if (name === "wishlist") paintWishlist();
    else if (name === "account") paintAccount();
    else if (name === "menu") paintMenu();
    else if (name === "search") paintMobileSearch();
  }

  function hide() {
    open = null;
    document.getElementById("overlay").hidden = true;
    document.getElementById("sheet").hidden = true;
    document.getElementById("menu").hidden = true;
    document.getElementById("modal").hidden = true;
  }

  function stateCartEmpty() {
    return LumiStore.snapshot().cart.length === 0 && cartStep !== "done";
  }

  function paintChrome() {
    const count = LumiStore.count();
    const wishes = LumiStore.snapshot().wishlist.length;
    const cartBadge = document.getElementById("cart-count");
    const wishBadge = document.getElementById("wish-count");
    cartBadge.hidden = count === 0;
    cartBadge.textContent = count;
    wishBadge.hidden = wishes === 0;
    wishBadge.textContent = wishes;
    refreshHearts();
  }

  function refreshHearts() {
    document.querySelectorAll("[data-wish]").forEach((button) => {
      const on = LumiStore.wished(button.dataset.wish);
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", String(on));
      if (button.dataset.wishLabel === "text") button.textContent = on ? "В избранном" : "В избранное";
    });
  }

  function paintHeader() {
    document.getElementById("header").classList.toggle("is-stuck", window.scrollY > 8);
  }

  function paintSearch() {
    const box = document.getElementById("search-results");
    const query = search.trim().toLowerCase();
    if (!searchOpen || !query) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const list = LUMI.products.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 6);
    box.hidden = false;
    box.innerHTML = `<p class="search-label">Нашли</p>${
      list.length
        ? list.map((item) => `<button type="button" data-go="product.html?id=${item.id}">${esc(item.name)} <span>→</span></button>`).join("")
        : `<p class="muted">Ничего не нашли. Попробуйте другое слово.</p>`
    }`;
  }

  function paintMenu() {
    const links = navLinks().map((link) => [link.href, link.label]);
    openSheet("left", `<h2 class="logo">LUMI</h2><nav class="menu-nav">${links.map(([href, label], index) => `<a href="${href}" style="animation-delay:${index * 40}ms">${esc(label)}</a>`).join("")}</nav>`);
  }

  function paintMobileSearch() {
    const query = search.trim().toLowerCase();
    const list = query ? LUMI.products.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 6) : [];
    const results = query
      ? list.map((item) => `<button class="menu-link" type="button" data-go="product.html?id=${item.id}">${esc(item.name)}</button>`).join("") || `<p class="muted">Ничего не нашли.</p>`
      : "";
    openSheet("top", `<h2>Поиск по каталогу</h2><input id="mobile-search" class="field" value="${esc(search)}" placeholder="Свитер, сумка, пальто">${results}`);
    const input = document.getElementById("mobile-search");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  function paintWishlist() {
    const items = LumiStore.snapshot().wishlist.map(LUMI.product).filter(Boolean);
    openSheet("right", `<h2>Избранное</h2><p class="muted">${items.length ? "Сохранено только в этом браузере." : "Отметьте сердце на карточке — вещь сохранится здесь."}</p><div class="sheet-list">${items.map((item) => `<div class="line"><a class="thumb" href="product.html?id=${item.id}">${lumiArt({ image: item.image, mode: "packshot" })}</a><div><a href="product.html?id=${item.id}">${esc(item.name)}</a><p>${LUMI.money(item.price)}</p></div><button type="button" data-wish="${item.id}">Убрать</button></div>`).join("")}</div>`);
  }

  function paintAccount() {
    const profile = LumiStore.snapshot().profile;
    document.getElementById("overlay").hidden = false;
    const modal = document.getElementById("modal");
    modal.hidden = false;
    modal.innerHTML = `<div class="dialog" role="dialog" aria-modal="true">
      <button class="close" type="button" data-close aria-label="Закрыть">×</button>
      <h2>${profile ? `Здравствуйте, ${esc(profile.name)}` : "Личный кабинет"}</h2>
      <p class="muted">Имя хранится только на этом устройстве. Аккаунт никуда не отправляется.</p>
      <form id="account-form">
        <label>Имя<input class="field" name="name" value="${esc(profile?.name || "")}"></label>
        <label>Почта<input class="field" name="email" type="email" value="${esc(profile?.email || "")}"></label>
        <p class="form-error" hidden></p>
        <div class="row">
          <button class="btn" type="submit">Сохранить</button>
          ${profile ? `<button class="btn btn-ghost" type="button" id="logout">Выйти</button>` : ""}
        </div>
      </form>
    </div>`;
    document.getElementById("logout")?.addEventListener("click", () => {
      LumiStore.clearProfile();
      hide();
    });
  }

  function paintCart() {
    const lines = LumiStore.snapshot().cart.map((line) => ({ ...line, product: LUMI.product(line.id) })).filter((line) => line.product);
    const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
    const left = Math.max(0, LUMI.freeShipping - subtotal);
    const progress = Math.min(100, (subtotal / LUMI.freeShipping) * 100);
    let body = "";
    if (cartStep === "done") {
      body = `<div class="done"><div class="done-mark">✓</div><h2>Заказ ${esc(orderNo)} собран</h2><p class="muted">Это демонстрация магазина: данные остались в браузере, письмо не уйдёт. ${esc(checkout.name)}, мы бы отправили заказ в ${esc(checkout.city)}.</p><button class="btn" type="button" data-close>Продолжить покупки</button></div>`;
    } else if (cartStep === "checkout") {
      body = `<h2>Оформление</h2><p class="muted">Оплата не списывается.</p>
        <form id="checkout-form" class="stack">
          ${["name", "phone", "city", "address"].map((field) => {
            const labels = { name: "Имя", phone: "Телефон", city: "Город", address: "Адрес" };
            return `<label>${labels[field]}<input class="field" data-field="${field}" value="${esc(checkout[field])}"></label>`;
          }).join("")}
          ${checkoutError ? `<p class="form-error">${esc(checkoutError)}</p>` : ""}
          <div class="row"><button class="btn btn-ghost" type="button" data-back-cart>Назад</button><button class="btn" type="submit">Оформить · ${LUMI.money(subtotal)}</button></div>
        </form>`;
    } else if (!lines.length) {
      body = `<h2>Корзина</h2><p class="muted">Пока пусто — вещи ждут в каталоге.</p><div class="empty"><p>Добавьте вещь с витрины — она появится здесь.</p><a class="btn" href="catalog.html">В каталог</a></div>`;
    } else {
      body = `<h2>Корзина</h2><p class="muted">Можно поменять размер и количество.</p>
        <div class="sheet-list">${lines.map((line) => `<div class="line">
          <a class="thumb" href="product.html?id=${line.product.id}">${lumiArt({ image: line.product.image, mode: "packshot" })}</a>
          <div class="line-body">
            <div class="line-top"><p>${esc(line.product.name)}</p><button type="button" data-remove data-id="${line.id}" data-size="${esc(line.size)}" aria-label="Удалить">✕</button></div>
            <label class="tiny">Размер<select data-resize="${esc(line.size)}" data-id="${line.id}">${LUMI.sizes(line.product.category).map((size) => `<option ${size === line.size ? "selected" : ""}>${esc(size)}</option>`).join("")}</select></label>
            <div class="line-bottom"><div class="qty"><button type="button" data-id="${line.id}" data-size="${esc(line.size)}" data-qty="${line.qty - 1}">−</button><span>${line.qty}</span><button type="button" data-id="${line.id}" data-size="${esc(line.size)}" data-qty="${line.qty + 1}">+</button></div><strong>${LUMI.money(line.product.price * line.qty)}</strong></div>
          </div>
        </div>`).join("")}</div>
        <div class="sheet-foot">
          <p class="tiny">${left === 0 ? "Доставка бесплатная" : `До бесплатной доставки ${LUMI.money(left)}`}</p>
          <div class="progress"><span style="width:${progress}%"></span></div>
          <div class="line-bottom"><span>Итого</span><strong>${LUMI.money(subtotal)}</strong></div>
          <button class="btn btn-wide" type="button" data-checkout>Оформить заказ</button>
        </div>`;
    }
    openSheet("right", body);
  }

  function openSheet(side, html) {
    document.getElementById("overlay").hidden = false;
    document.getElementById("modal").hidden = true;
    const menu = document.getElementById("menu");
    const sheet = document.getElementById("sheet");
    if (side === "left") {
      sheet.hidden = true;
      menu.hidden = false;
      menu.innerHTML = `<button class="close" type="button" data-close aria-label="Закрыть">×</button>${html}`;
      return;
    }
    menu.hidden = true;
    sheet.hidden = false;
    sheet.classList.toggle("sheet-top", side === "top");
    sheet.innerHTML = `<button class="close" type="button" data-close aria-label="Закрыть">×</button>${html}`;
  }

  function toast(title, detail) {
    const id = `${Date.now()}`;
    toasts.push({ id, title, detail });
    paintToasts();
    window.setTimeout(() => {
      const index = toasts.findIndex((item) => item.id === id);
      if (index >= 0) toasts.splice(index, 1);
      paintToasts();
    }, 3200);
  }

  function paintToasts() {
    document.getElementById("toasts").innerHTML = toasts.map((item) => `<button type="button" data-open="cart">${esc(item.title)}${item.detail ? `<span>${esc(item.detail)}</span>` : ""}</button>`).join("");
  }

  function productCard(product) {
    return `<article class="product">
      <div class="product-media">
        <a href="product.html?id=${product.id}" aria-label="${esc(product.name)}">${lumiArt({ image: product.image, mode: "packshot" })}<span class="shine"></span></a>
        <button class="heart ${LumiStore.wished(product.id) ? "is-on" : ""}" type="button" data-wish="${product.id}" aria-label="В избранное" aria-pressed="${LumiStore.wished(product.id)}">${icon("heart")}</button>
        <button class="quick-add" type="button" data-add="${product.id}">В корзину</button>
      </div>
      <a class="product-copy" href="product.html?id=${product.id}">
        <h3>${esc(product.name)}</h3>
        <p>${esc(LUMI.category(product.category).name)}</p>
        <strong>${LUMI.money(product.price)}${product.compareAt ? `<s>${LUMI.money(product.compareAt)}</s>` : ""}</strong>
      </a>
    </article>`;
  }

  function rail(cards) {
    return `<div class="rail">
      <div class="rail-track">${cards}</div>
      <button class="rail-nav is-prev" type="button" data-rail="-1" aria-label="Предыдущие">${icon("left")}</button>
      <button class="rail-nav is-next" type="button" data-rail="1" aria-label="Следующие">${icon("arrow")}</button>
    </div>`;
  }

  function lookCard(item, extraClass) {
    const href = `catalog.html?category=${item.id}`;
    const label = item.label || item.name;
    return `<a class="look${extraClass ? ` ${extraClass}` : ""}" href="${href}">${lumiArt(item)}<span>${esc(label)} ${icon("arrow")}</span></a>`;
  }

  function section(title, href, inner, extra) {
    const more = href ? `<a class="see-all" href="${href}">Смотреть все ${icon("arrow")}</a>` : "";
    return `<section class="frame block ${extra || ""}">
      <div class="block-head fade-up"><h2>${esc(title)}</h2>${more}</div>
      ${inner}
    </section>`;
  }

  function banner(slides, compact) {
    return `<section class="banner ${compact ? "is-compact" : ""}" data-banner>
      <div class="banner-stage"></div>
      <div class="banner-copy"></div>
      <div class="pager"></div>
      <div class="arrows">
        <button type="button" data-prev aria-label="Предыдущий слайд">${icon("left")}</button>
        <button type="button" data-next aria-label="Следующий слайд">${icon("arrow")}</button>
      </div>
    </section>`;
  }

  function mountBanner(root, slides) {
    let index = 0;
    let paused = false;
    const stage = root.querySelector(".banner-stage");
    const copy = root.querySelector(".banner-copy");
    const pager = root.querySelector(".pager");
    const compact = root.classList.contains("is-compact");
    function draw() {
      const slide = slides[index];
      stage.innerHTML = `<div class="fade-up banner-art">${lumiArt({ ...slide, mode: "banner" })}<div class="banner-veil"></div></div>`;
      copy.innerHTML = `<div class="fade-up">
        <p class="eyebrow">${esc(slide.eyebrow)}</p>
        <h2>${slide.title.map((line) => `<span>${esc(line)}</span>`).join("")}</h2>
        <p class="lead">${esc(slide.text)}</p>
        <a class="${compact ? "btn btn-dark" : "btn btn-light"}" href="${slide.href}">${esc(slide.cta)} ${icon("arrow")}</a>
      </div>`;
      pager.innerHTML = slides.map((item, itemIndex) => `<button type="button" class="${itemIndex === index ? "is-on" : ""}" data-go-slide="${itemIndex}">${String(itemIndex + 1).padStart(2, "0")}${itemIndex === index && itemIndex < slides.length - 1 ? "<i></i>" : ""}</button>`).join("");
    }
    function go(next) {
      index = (next + slides.length) % slides.length;
      draw();
    }
    if (slides.length < 2) {
      pager.hidden = true;
      root.querySelector(".arrows").hidden = true;
      draw();
      return;
    }
    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-prev]")) go(index - 1);
      if (event.target.closest("[data-next]")) go(index + 1);
      const jump = event.target.closest("[data-go-slide]");
      if (jump) go(Number(jump.dataset.goSlide));
    });
    root.addEventListener("mouseenter", () => { paused = true; });
    root.addEventListener("mouseleave", () => { paused = false; });
    let startX = 0;
    root.addEventListener("touchstart", (event) => { startX = event.touches[0]?.clientX || 0; }, { passive: true });
    root.addEventListener("touchend", (event) => {
      const dx = (event.changedTouches[0]?.clientX || startX) - startX;
      if (dx > 48) go(index - 1);
      if (dx < -48) go(index + 1);
    });
    window.setInterval(() => { if (!paused && !matchMedia("(prefers-reduced-motion: reduce)").matches) go(index + 1); }, 6800);
    draw();
  }

  function icon(name) {
    const paths = {
      search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-3.5-3.5"/>',
      user: '<circle cx="12" cy="8" r="3.2"/><path d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19"/>',
      heart: '<path d="M12 19s-7-4.4-7-8.2A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 7 2.8C19 14.6 12 19 12 19z"/>',
      bag: '<path d="M6 8h12l-1 11H7L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      arrow: '<path d="M5 12h12"/><path d="m13 6 6 6-6 6"/>',
      left: '<path d="M19 12H7"/><path d="m11 6-6 6 6 6"/>',
      instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" stroke="none"/>',
      telegram: '<path d="M20 5 4 11.1l4.2 1.4L10 18l2.2-3.6L17 17z"/>',
      vk: '<path d="M4 8h2.4c.2 3.2 1.6 5 2.8 5.6V8H12v3.4c1.2-.2 2.4-1.5 2.8-3.4h2.2c-.4 1.6-1.3 2.9-2 3.6.8.6 1.9 1.7 2.3 3.6h-2.4c-.4-1.3-1.2-2.2-2.3-2.5V16H9.2V14C7.4 13.6 5.2 11.4 4 8z" fill="currentColor" stroke="none"/>',
      youtube: '<rect x="3" y="7" width="18" height="10" rx="3"/><path d="m11 9.5 4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
  }

  return { boot, open: show, esc, productCard, lookCard, rail, section, banner, mountBanner, toast };
})();
