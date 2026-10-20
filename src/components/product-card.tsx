"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Art } from "@/components/art";
import { categoryById, formatPrice, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWish, wished, addToCart } = useStore();
  const saved = wished(product.id);
  const category = categoryById(product.category);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] bg-[#d9d5d1]">
        <Link href={`/product/${product.id}`} className="absolute inset-0 block" aria-label={product.name}>
          <Art
            palette="stone"
            garment={product.garment}
            cloth={product.cloth}
            cloth2={product.cloth2}
            mode="packshot"
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="shine pointer-events-none absolute inset-0" />
        </Link>
        <button
          type="button"
          aria-label={saved ? "Убрать из избранного" : "В избранное"}
          aria-pressed={saved}
          onClick={() => toggleWish(product.id)}
          className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center text-[#6d6a66]"
        >
          <motion.span
            className="flex"
            animate={saved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Heart className={cn("size-[18px]", saved && "fill-[#1a1a1e] text-[#1a1a1e]")} />
          </motion.span>
        </button>
        <motion.button
          type="button"
          onClick={() => addToCart(product.id)}
          initial={false}
          className="absolute inset-x-2 bottom-2 rounded-full bg-[#1a1a1e] px-3 py-2 text-[12px] text-white transition duration-300 max-lg:translate-y-0 max-lg:opacity-100 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0 lg:focus-visible:opacity-100"
        >
          В корзину
        </motion.button>
      </div>
      <Link href={`/product/${product.id}`} className="mt-3 block">
        <h3 className="line-clamp-2 min-h-8 text-[13px] leading-4 font-medium tracking-[-0.01em] text-[#1a1a1e]">{product.name}</h3>
        <p className="mt-1 text-[12px] text-[#9a9aa0]">{category.name}</p>
        <p className="mt-1.5 flex items-baseline gap-2 text-[13px] font-medium text-[#1a1a1e]">
          {formatPrice(product.price)}
          {product.compareAt && (
            <span className="text-[12px] font-normal text-[#a3a3a8] line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </p>
      </Link>
    </article>
  );
}
