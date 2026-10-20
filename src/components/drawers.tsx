"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Art } from "@/components/art";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FREE_SHIPPING,
  formatPrice,
  productById,
  sizesFor,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export function StoreDrawers() {
  return (
    <>
      <CartSheet />
      <WishlistSheet />
      <AccountDialog />
      <Toasts />
    </>
  );
}

function CartSheet() {
  const reduce = useReducedMotion();
  const {
    cart,
    cartOpen,
    setCartOpen,
    setQty,
    setSize,
    removeLine,
    clearCart,
  } = useStore();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [orderNo, setOrderNo] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "" });
  const [error, setError] = useState("");

  const detailed = cart
    .map((line) => {
      const product = productById(line.id);
      return product ? { ...line, product } : null;
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const subtotal = detailed.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  function placeOrder() {
    if (form.name.trim().length < 2 || form.phone.trim().length < 6 || form.city.trim().length < 2 || form.address.trim().length < 4) {
      setError("Заполните имя, телефон, город и адрес — без этого заказ не соберём.");
      return;
    }
    setError("");
    setOrderNo(String(2400 + Math.floor(Math.random() * 500)));
    clearCart();
    setStep("done");
  }

  return (
    <Sheet
      open={cartOpen}
      onOpenChange={(open) => {
        setCartOpen(open);
        if (!open) {
          window.setTimeout(() => setStep("cart"), 250);
        }
      }}
    >
      <SheetContent className="w-full gap-0 bg-[#fbfbfb] p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-black/5 px-5 py-5 pr-12">
          <SheetTitle className="text-[18px] font-medium">Корзина</SheetTitle>
          <SheetDescription>
            {detailed.length === 0 && step !== "done"
              ? "Пока пусто — вещи ждут в каталоге."
              : step === "done"
                ? "Заказ принят локально, оплата не списывается."
                : "Можно поменять размер и количество."}
          </SheetDescription>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {step === "done" ? (
            <motion.div
              key="done"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col items-start justify-center px-5 py-10"
            >
              <motion.div
                initial={reduce ? false : { scale: 0.7 }}
                animate={{ scale: 1 }}
                className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1a1a1e] text-white"
              >
                ✓
              </motion.div>
              <p className="text-lg font-medium">Заказ {orderNo} собран</p>
              <p className="mt-2 text-sm text-[#6a6a70]">
                Это демонстрация магазина: данные остались в браузере, письмо не уйдёт. {form.name}, мы бы отправили заказ в {form.city}.
              </p>
              <Button className="mt-6 rounded-full" onClick={() => setCartOpen(false)}>
                Продолжить покупки
              </Button>
            </motion.div>
          ) : step === "checkout" ? (
            <motion.form
              key="checkout"
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
              onSubmit={(event) => {
                event.preventDefault();
                placeOrder();
              }}
            >
              <Field label="Имя" value={form.name} onChange={(name) => setForm({ ...form, name })} />
              <Field label="Телефон" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
              <Field label="Город" value={form.city} onChange={(city) => setForm({ ...form, city })} />
              <Field label="Адрес" value={form.address} onChange={(address) => setForm({ ...form, address })} />
              {error && <p className="text-[13px] text-[#8d3034]">{error}</p>}
              <div className="mt-auto flex gap-2 pt-4">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep("cart")}>
                  Назад
                </Button>
                <Button type="submit" className="flex-1 rounded-full">
                  Оформить · {formatPrice(subtotal)}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div key="cart" className="flex min-h-0 flex-1 flex-col" initial={false}>
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                {detailed.length === 0 && (
                  <div className="rounded-2xl bg-white px-4 py-8 text-center">
                    <p className="text-sm text-[#6a6a70]">Добавьте вещь с витрины — она появится здесь.</p>
                    <Button
                      className="mt-4 rounded-full"
                      onClick={() => setCartOpen(false)}
                      render={<Link href="/catalog" />}
                    >
                      В каталог
                    </Button>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {detailed.map((line) => (
                    <motion.div
                      layout
                      key={`${line.id}-${line.size}`}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3"
                    >
                      <Link
                        href={`/product/${line.product.id}`}
                        onClick={() => setCartOpen(false)}
                        className="block size-[84px] shrink-0 overflow-hidden rounded-xl"
                      >
                        <Art
                          palette="stone"
                          garment={line.product.garment}
                          cloth={line.product.cloth}
                          cloth2={line.product.cloth2}
                          mode="packshot"
                          className="h-full w-full"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] leading-4 font-medium">{line.product.name}</p>
                          <button
                            type="button"
                            aria-label="Удалить"
                            onClick={() => removeLine(line.id, line.size)}
                            className="text-[#8e8e93] hover:text-[#1a1a1e]"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <label className="mt-1 block text-[12px] text-[#8e8e93]">
                          Размер
                          <select
                            value={line.size}
                            onChange={(event) => setSize(line.id, line.size, event.target.value)}
                            className="mt-1 block h-8 rounded-full border border-black/10 bg-white px-3 text-[12px] text-[#1a1a1e]"
                          >
                            {sizesFor(line.product.category).map((size) => (
                              <option key={size}>{size}</option>
                            ))}
                          </select>
                        </label>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-black/10">
                            <button type="button" className="px-2 py-1" aria-label="Меньше" onClick={() => setQty(line.id, line.size, line.qty - 1)}>
                              <Minus className="size-3" />
                            </button>
                            <span className="w-5 text-center text-[13px]">{line.qty}</span>
                            <button type="button" className="px-2 py-1" aria-label="Больше" onClick={() => setQty(line.id, line.size, line.qty + 1)}>
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <p className="text-[13px] font-medium">{formatPrice(line.product.price * line.qty)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {detailed.length > 0 && (
                <div className="border-t border-black/5 px-5 py-4">
                  <div className="mb-3">
                    <div className="mb-1.5 flex justify-between text-[12px] text-[#6a6a70]">
                      <span>{left === 0 ? "Доставка бесплатная" : `До бесплатной доставки ${formatPrice(left)}`}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-[#eceae7]">
                      <motion.div
                        className="h-full rounded-full bg-[#1a1a1e]"
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-[15px]">
                    <span>Итого</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <Button className="h-10 w-full rounded-full" onClick={() => setStep("checkout")}>
                    Оформить заказ
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-[12px] text-[#6a6a70]">
      {label}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 rounded-xl bg-white"
      />
    </label>
  );
}

function WishlistSheet() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWish } = useStore();
  const items = useMemo(
    () => wishlist.map((id) => productById(id)).filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [wishlist],
  );

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="w-full gap-0 bg-[#fbfbfb] p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-black/5 px-5 py-5 pr-12">
          <SheetTitle className="text-[18px] font-medium">Избранное</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Отметьте сердце на карточке — вещь сохранится здесь." : "Сохранено только в этом браузере."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {items.map((product) => (
            <div key={product.id} className="flex items-center gap-3">
              <Link href={`/product/${product.id}`} onClick={() => setWishlistOpen(false)} className="size-16 overflow-hidden rounded-xl">
                <Art palette="stone" garment={product.garment} cloth={product.cloth} cloth2={product.cloth2} mode="packshot" className="h-full w-full" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${product.id}`} onClick={() => setWishlistOpen(false)} className="text-[13px] font-medium">
                  {product.name}
                </Link>
                <p className="text-[13px] text-[#6a6a70]">{formatPrice(product.price)}</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => toggleWish(product.id)}>
                Убрать
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AccountDialog() {
  const { accountOpen, setAccountOpen, profile, saveProfile, clearProfile } = useStore();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [error, setError] = useState("");

  return (
    <Dialog
      open={accountOpen}
      onOpenChange={(open) => {
        setAccountOpen(open);
        if (open) {
          setName(profile?.name ?? "");
          setEmail(profile?.email ?? "");
          setError("");
        }
      }}
    >
      <DialogContent className="bg-[#fbfbfb] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{profile ? `Здравствуйте, ${profile.name}` : "Личный кабинет"}</DialogTitle>
          <DialogDescription>
            Имя хранится только на этом устройстве. Аккаунт никуда не отправляется.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim().length < 2 || !email.includes("@")) {
              setError("Нужны имя и почта, чтобы обращаться к вам в корзине.");
              return;
            }
            saveProfile({ name: name.trim(), email: email.trim() });
          }}
        >
          <label className="text-[12px] text-[#6a6a70]">
            Имя
            <Input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-10 rounded-xl bg-white" />
          </label>
          <label className="text-[12px] text-[#6a6a70]">
            Почта
            <Input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 h-10 rounded-xl bg-white" type="email" />
          </label>
          {error && <p className="text-[13px] text-[#8d3034]">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" className="rounded-full">
              Сохранить
            </Button>
            {profile && (
              <Button type="button" variant="outline" className="rounded-full" onClick={clearProfile}>
                Выйти
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Toasts() {
  const { toasts, dismissToast, setCartOpen } = useStore();
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => {
              dismissToast(toast.id);
              setCartOpen(true);
            }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto rounded-2xl bg-[#1a1a1e] px-4 py-3 text-left text-white shadow-lg"
          >
            <span className="block text-[13px] font-medium">{toast.title}</span>
            {toast.detail && <span className="mt-0.5 block text-[12px] text-white/70">{toast.detail}</span>}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
