"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { navLinks, products } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { count, setCartOpen, wishlist, setWishlistOpen, setAccountOpen, profile } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.filter((product) => product.fresh).slice(0, 5);
    return products
      .filter((product) => product.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  function goToProduct(id: string) {
    setSearchOpen(false);
    setMobileSearch(false);
    setQuery("");
    router.push(`/product/${id}`);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-black/5 bg-[#fbfbfb]/90 backdrop-blur-md" : "bg-[#fbfbfb]",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1024px] items-center gap-3 px-4 sm:gap-5 sm:px-[35px]">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full lg:hidden"
          aria-label="Открыть меню"
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </Button>

        <Link href="/" className="logo shrink-0 text-[15px] text-[#1a1a1e]" aria-label="LUMI, на главную">
          LUMI
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-4 lg:flex" aria-label="Каталог">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link shrink-0 text-[13px] text-[#3a3a40] transition-colors hover:text-[#1a1a1e]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative ml-auto hidden w-[220px] lg:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#9a9aa0]" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => window.setTimeout(() => setSearchOpen(false), 160)}
            placeholder="Поиск по каталогу"
            aria-label="Поиск по каталогу"
            className="h-8 rounded-full border-transparent bg-[#f3f2f2] pr-3 pl-8 text-[13px] shadow-none placeholder:text-[#a3a3a8] focus-visible:border-transparent focus-visible:ring-0"
          />
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="absolute top-[calc(100%+8px)] right-0 z-50 w-[280px] overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,.08)]"
              >
                <p className="px-2.5 pt-1.5 pb-1 text-[11px] tracking-wide text-[#8e8e93] uppercase">
                  {query.trim() ? "Нашли" : "Новое"}
                </p>
                {results.length === 0 ? (
                  <p className="px-2.5 py-3 text-[13px] text-[#8e8e93]">Ничего не нашли. Попробуйте другое слово.</p>
                ) : (
                  results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => goToProduct(product.id)}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] hover:bg-[#f6f5f4]"
                    >
                      <span>{product.name}</span>
                      <span className="text-[#8e8e93]">→</span>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto flex items-center gap-0.5 lg:ml-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Поиск"
            onClick={() => setMobileSearch(true)}
          >
            <Search />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={profile ? `Профиль, ${profile.name}` : "Профиль"}
            onClick={() => setAccountOpen(true)}
          >
            <User />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            aria-label="Избранное"
            onClick={() => setWishlistOpen(true)}
          >
            <Heart />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-[#1a1a1e] text-[9px] text-white">
                {wishlist.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            aria-label="Корзина"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={reduce ? false : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-[#1a1a1e] text-[9px] text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[86%] bg-[#fbfbfb] sm:max-w-xs">
          <SheetHeader>
            <SheetTitle className="logo text-left text-[15px]">LUMI</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4" aria-label="Мобильное меню">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * index }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-2 py-2.5 text-[16px] text-[#1a1a1e]"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Sheet open={mobileSearch} onOpenChange={setMobileSearch}>
        <SheetContent side="top" className="bg-[#fbfbfb]">
          <SheetHeader>
            <SheetTitle>Поиск по каталогу</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Свитер, сумка, пальто"
              className="h-10 rounded-full border-transparent bg-[#f3f2f2] px-4 focus-visible:ring-0"
            />
            <div className="mt-3 flex flex-col">
              {results.length === 0 ? (
                <p className="px-1 py-3 text-sm text-[#8e8e93]">Ничего не нашли.</p>
              ) : (
                results.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => goToProduct(product.id)}
                    className="rounded-xl px-2 py-2.5 text-left text-sm hover:bg-white"
                  >
                    {product.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
