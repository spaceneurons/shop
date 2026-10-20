"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { Art } from "@/components/art";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  categoryById,
  formatPrice,
  productById,
  products,
  sizesFor,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductView({ id }: { id: string }) {
  const product = productById(id);
  const reduce = useReducedMotion();
  const { addToCart, toggleWish, wished, setCartOpen } = useStore();
  const sizes = product ? sizesFor(product.category) : [];
  const [size, setSize] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-[1024px] px-4 py-20 text-center sm:px-[35px]">
        <h1 className="text-2xl font-medium">Такой вещи нет</h1>
        <p className="mt-2 text-[#6a6a70]">Возможно, ссылка устарела. В каталоге есть актуальные модели.</p>
        <Button className="mt-6 rounded-full" render={<Link href="/catalog" />}>
          В каталог
        </Button>
      </div>
    );
  }

  const category = categoryById(product.category);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const saved = wished(product.id);

  function buy() {
    if (!size) {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    addToCart(product!.id, size);
    setCartOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[1024px] px-4 py-6 sm:px-[35px] sm:py-8">
      <p className="text-[13px] text-[#8e8e93]">
        <Link href="/" className="hover:text-[#1a1a1e]">Главная</Link>
        <span className="px-1.5">/</span>
        <Link href={`/catalog?category=${product.category}`} className="hover:text-[#1a1a1e]">{category.name}</Link>
      </p>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[16px]"
        >
          <Art
            palette="stone"
            garment={product.garment}
            cloth={product.cloth}
            cloth2={product.cloth2}
            mode="packshot"
            className="aspect-[4/5] w-full"
          />
        </motion.div>

        <div>
          <p className="text-[12px] tracking-[0.14em] text-[#8e8e93] uppercase">{category.name}</p>
          <h1 className="mt-2 text-[32px] leading-none font-medium tracking-[-0.03em]">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-[22px] font-medium">{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p className="text-[15px] text-[#a3a3a8] line-through">{formatPrice(product.compareAt)}</p>
            )}
          </div>
          <p className="mt-4 max-w-md text-[14px] leading-6 text-[#3a3a40]">{product.description}</p>
          <p className="mt-3 text-[13px] text-[#8e8e93]">{product.material}</p>

          <motion.div
            className="mt-6"
            animate={shake ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[13px] text-[#3a3a40]">Размер</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSize(item)}
                  className={cn(
                    "h-9 min-w-12 rounded-full px-3 text-[13px] transition",
                    size === item
                      ? "bg-[#1a1a1e] text-white"
                      : "bg-white text-[#1a1a1e] ring-1 ring-black/10 hover:ring-black/30",
                    shake && !size && "ring-[#8d3034]",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            {!size && shake && <p className="mt-2 text-[12px] text-[#8d3034]">Выберите размер.</p>}
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button className="h-11 rounded-full px-6" onClick={buy}>
              Добавить в корзину
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-full bg-white px-4"
              onClick={() => toggleWish(product.id)}
              aria-pressed={saved}
            >
              <Heart className={cn("size-4", saved && "fill-current")} />
              {saved ? "В избранном" : "В избранное"}
            </Button>
          </div>
          <p className="mt-4 text-[12px] leading-5 text-[#8e8e93]">
            Бесплатная доставка от 8 000 ₽. Обмен и возврат — 14 дней, если вещь не носили.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[22px] font-medium tracking-[-0.02em]">Ещё из раздела</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
