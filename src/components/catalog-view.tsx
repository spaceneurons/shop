"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { categories, products, type CategoryId } from "@/lib/data";

type Sort = "new" | "price-asc" | "price-desc";

export function CatalogView() {
  const params = useSearchParams();
  const router = useRouter();
  const reduce = useReducedMotion();
  const category = params.get("category") as CategoryId | null;
  const sale = params.get("sale") === "1";
  const initialSort = (params.get("sort") as Sort | null) ?? "new";
  const [sort, setSort] = useState<Sort>(
    initialSort === "price-asc" || initialSort === "price-desc" ? initialSort : "new",
  );

  const list = useMemo(() => {
    let next = products.filter((product) => {
      if (category && product.category !== category) return false;
      if (sale && !product.compareAt) return false;
      return true;
    });
    if (sort === "price-asc") next = [...next].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") next = [...next].sort((a, b) => b.price - a.price);
    if (sort === "new") next = [...next].sort((a, b) => Number(Boolean(b.fresh)) - Number(Boolean(a.fresh)));
    return next;
  }, [category, sale, sort]);

  function setCategory(next: CategoryId | null) {
    const query = new URLSearchParams();
    if (next) query.set("category", next);
    if (sale) query.set("sale", "1");
    router.push(query.size ? `/catalog?${query}` : "/catalog");
  }

  const title = sale
    ? "Salé"
    : category
      ? categories.find((item) => item.id === category)?.name
      : "Каталог";

  return (
    <div className="mx-auto w-full max-w-[1024px] px-4 py-8 sm:px-[35px]">
      <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[12px] tracking-[0.14em] text-[#8e8e93] uppercase">LUMI</p>
        <h1 className="mt-2 text-[32px] font-medium tracking-[-0.03em]">{title}</h1>
        <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#6a6a70]">
          {sale
            ? "Вещи, на которые сейчас действует скидка. Цены уже пересчитаны."
            : "Спокойные силуэты, нейтральные цвета и вещи, которые легко сочетать между собой."}
        </p>
      </motion.div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={!category && !sale} onClick={() => router.push("/catalog")}>
            Все
          </FilterChip>
          {categories.map((item) => (
            <FilterChip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
              {item.name}
            </FilterChip>
          ))}
          <FilterChip active={sale} onClick={() => router.push("/catalog?sale=1")}>
            Salé
          </FilterChip>
        </div>
        <label className="text-[12px] text-[#6a6a70]">
          Сортировка
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="mt-1 block h-9 rounded-full border border-black/10 bg-white px-3 text-[13px] text-[#1a1a1e]"
          >
            <option value="new">Сначала новинки</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white px-6 py-12 text-center">
          <p className="text-[15px]">В этом разделе пока пусто.</p>
          <Button className="mt-4 rounded-full" onClick={() => router.push("/catalog")}>
            Смотреть весь каталог
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((product, index) => (
            <motion.div
              key={product.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.3) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-8 shrink-0 rounded-full bg-[#1a1a1e] px-3.5 text-[13px] text-white"
          : "h-8 shrink-0 rounded-full bg-white px-3.5 text-[13px] text-[#3a3a40] ring-1 ring-black/8 hover:ring-black/20"
      }
    >
      {children}
    </button>
  );
}
