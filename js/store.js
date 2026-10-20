const LumiStore = (() => {
  const key = "lumi-store";
  const empty = { cart: [], wishlist: [], profile: null };
  let state = load();
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return structuredClone(empty);
      const parsed = JSON.parse(raw);
      return {
        cart: Array.isArray(parsed.cart) ? parsed.cart : [],
        wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
        profile: parsed.profile || null,
      };
    } catch {
      return structuredClone(empty);
    }
  }

  function emit() {
    localStorage.setItem(key, JSON.stringify(state));
    listeners.forEach((listener) => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function add(id, size) {
    const product = LUMI.product(id);
    if (!product) return;
    const picked = size || LUMI.defaultSize(product.category);
    const line = state.cart.find((item) => item.id === id && item.size === picked);
    if (line) line.qty += 1;
    else state.cart.push({ id, size: picked, qty: 1 });
    emit();
    return { product, size: picked };
  }

  function setQty(id, size, qty) {
    state.cart = qty <= 0
      ? state.cart.filter((item) => !(item.id === id && item.size === size))
      : state.cart.map((item) => (item.id === id && item.size === size ? { ...item, qty } : item));
    emit();
  }

  function setSize(id, from, to) {
    if (from === to) return;
    const source = state.cart.find((item) => item.id === id && item.size === from);
    if (!source) return;
    const target = state.cart.find((item) => item.id === id && item.size === to);
    state.cart = state.cart.filter((item) => !(item.id === id && item.size === from));
    if (target) target.qty += source.qty;
    else state.cart.push({ id, size: to, qty: source.qty });
    emit();
  }

  function remove(id, size) {
    state.cart = state.cart.filter((item) => !(item.id === id && item.size === size));
    emit();
  }

  function clearCart() {
    state.cart = [];
    emit();
  }

  function toggleWish(id) {
    const has = state.wishlist.includes(id);
    state.wishlist = has ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id];
    emit();
    return !has;
  }

  function wished(id) {
    return state.wishlist.includes(id);
  }

  function saveProfile(profile) {
    state.profile = profile;
    emit();
  }

  function clearProfile() {
    state.profile = null;
    emit();
  }

  function count() {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function snapshot() {
    return state;
  }

  return { subscribe, add, setQty, setSize, remove, clearCart, toggleWish, wished, saveProfile, clearProfile, count, snapshot };
})();
