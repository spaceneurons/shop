"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { defaultSize, productById, type CategoryId } from "@/lib/data";

export type CartLine = {
  id: string;
  size: string;
  qty: number;
};

export type Profile = {
  name: string;
  email: string;
};

export type Toast = {
  id: string;
  title: string;
  detail?: string;
};

type StoreState = {
  cart: CartLine[];
  wishlist: string[];
  profile: Profile | null;
};

type StoreContextValue = StoreState & {
  ready: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (open: boolean) => void;
  toasts: Toast[];
  addToCart: (id: string, size?: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  setSize: (id: string, from: string, to: string) => void;
  removeLine: (id: string, size: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  wished: (id: string) => boolean;
  saveProfile: (profile: Profile) => void;
  clearProfile: () => void;
  dismissToast: (id: string) => void;
  notify: (title: string, detail?: string) => void;
  count: number;
};

const KEY = "lumi-store";
const empty: StoreState = { cart: [], wishlist: [], profile: null };

let memory: StoreState = empty;
let loaded = false;
const listeners = new Set<() => void>();

function persist(next: StoreState) {
  memory = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(memory));
  }
  listeners.forEach((listener) => listener());
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    memory = {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      profile: parsed.profile ?? null,
    };
  } catch {
    memory = empty;
  }
}

function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  ensureLoaded();
  return memory;
}

function getServerSnapshot() {
  return empty;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (title: string, detail?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((current) => [...current.slice(-2), { id, title, detail }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  const addToCart = useCallback(
    (id: string, size?: string) => {
      const product = productById(id);
      if (!product) return;
      const picked = size ?? defaultSize(product.category as CategoryId);
      const existing = memory.cart.find((line) => line.id === id && line.size === picked);
      const cart = existing
        ? memory.cart.map((line) =>
            line.id === id && line.size === picked ? { ...line, qty: line.qty + 1 } : line,
          )
        : [...memory.cart, { id, size: picked, qty: 1 }];
      persist({ ...memory, cart });
      notify("Добавили в корзину", `${product.name} · ${picked}`);
    },
    [notify],
  );

  const setQty = useCallback((id: string, size: string, qty: number) => {
    persist({
      ...memory,
      cart:
        qty <= 0
          ? memory.cart.filter((line) => !(line.id === id && line.size === size))
          : memory.cart.map((line) =>
              line.id === id && line.size === size ? { ...line, qty } : line,
            ),
    });
  }, []);

  const setSize = useCallback((id: string, from: string, to: string) => {
    if (from === to) return;
    const source = memory.cart.find((line) => line.id === id && line.size === from);
    if (!source) return;
    const target = memory.cart.find((line) => line.id === id && line.size === to);
    const cart = memory.cart
      .filter((line) => !(line.id === id && line.size === from))
      .map((line) =>
        line.id === id && line.size === to ? { ...line, qty: line.qty + source.qty } : line,
      );
    if (!target) cart.push({ id, size: to, qty: source.qty });
    persist({ ...memory, cart });
  }, []);

  const removeLine = useCallback((id: string, size: string) => {
    persist({
      ...memory,
      cart: memory.cart.filter((line) => !(line.id === id && line.size === size)),
    });
  }, []);

  const clearCart = useCallback(() => {
    persist({ ...memory, cart: [] });
  }, []);

  const toggleWish = useCallback(
    (id: string) => {
      const product = productById(id);
      const has = memory.wishlist.includes(id);
      persist({
        ...memory,
        wishlist: has ? memory.wishlist.filter((item) => item !== id) : [...memory.wishlist, id],
      });
      if (product) notify(has ? "Убрали из избранного" : "Сохранили в избранное", product.name);
    },
    [notify],
  );

  const wished = useCallback((id: string) => state.wishlist.includes(id), [state.wishlist]);

  const saveProfile = useCallback(
    (profile: Profile) => {
      persist({ ...memory, profile });
      setAccountOpen(false);
      notify("Профиль сохранён", profile.name);
    },
    [notify],
  );

  const clearProfile = useCallback(() => {
    persist({ ...memory, profile: null });
  }, []);

  const count = state.cart.reduce((sum, line) => sum + line.qty, 0);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...state,
      ready: true,
      cartOpen,
      setCartOpen,
      wishlistOpen,
      setWishlistOpen,
      accountOpen,
      setAccountOpen,
      toasts,
      addToCart,
      setQty,
      setSize,
      removeLine,
      clearCart,
      toggleWish,
      wished,
      saveProfile,
      clearProfile,
      dismissToast,
      notify,
      count,
    }),
    [
      state,
      cartOpen,
      wishlistOpen,
      accountOpen,
      toasts,
      addToCart,
      setQty,
      setSize,
      removeLine,
      clearCart,
      toggleWish,
      wished,
      saveProfile,
      clearProfile,
      dismissToast,
      notify,
      count,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
