"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Art } from "@/components/art";
import { ProductCard } from "@/components/product-card";
import {
  categories,
  generations,
  heroSlides,
  products,
  promoSlides,
  type Hair,
  type PaletteId,
  type Garment,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const homeProducts = products.filter((product) => product.home);

export function HomePage() {
  return (
    <div>
      <Hero />
      <Section
        title="Выберите категорию"
        href="/catalog"
        className="mt-8"
      >
        <div className="grid grid-flow-col auto-cols-[148px] grid-rows-1 gap-3 overflow-x-auto pb-1 snap-x lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {categories.map((category, index) => (
            <LookCard
              key={category.id}
              href={`/catalog?category=${category.id}`}
              label={category.name}
              palette={category.palette}
              garment={category.garment}
              hair={category.hair}
              aspect="aspect-[3/4]"
              delay={index * 0.04}
            />
          ))}
        </div>
      </Section>

      <Section title="Новые поступления" href="/catalog?sort=new" className="mt-12">
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
          {homeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <div className="mx-auto mt-9 w-full max-w-[1024px] px-4 sm:px-[35px]">
        <Banner slides={promoSlides} compact />
      </div>

      <Section title="Для каждого поколения" href="/catalog" className="mt-8">
        <div className="grid grid-flow-col auto-cols-[190px] gap-2.5 overflow-x-auto pb-1 snap-x lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          {generations.map((item, index) => (
            <LookCard
              key={item.label}
              href={`/catalog?category=${item.id}`}
              label={item.label}
              palette={item.palette}
              garment={item.garment}
              hair={item.hair}
              aspect="aspect-[6/5]"
              delay={index * 0.04}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  href,
  className,
  children,
}: {
  title: string;
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-[1024px] px-4 sm:px-[35px]", className)}>
      <div className="fade-up mb-3.5 flex items-end justify-between gap-4">
        <h2 className="text-[22px] leading-none font-medium tracking-[-0.02em] text-[#1a1a1e]">{title}</h2>
        <Link href={href} className="see-all shrink-0 text-[13px] text-[#8e8e93]">
          Смотреть все
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function LookCard({
  href,
  label,
  palette,
  garment,
  hair,
  aspect,
  delay,
}: {
  href: string;
  label: string;
  palette: PaletteId;
  garment: Garment;
  hair: Hair;
  aspect: string;
  delay: number;
}) {
  return (
    <div className="snap-start">
      <Link
        href={href}
        style={{ animationDelay: `${delay}s` }}
        className={cn("fade-up group relative block overflow-hidden rounded-[12px]", aspect)}
      >
        <Art
          palette={palette}
          garment={garment}
          hair={hair}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.45)]">
          {label}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  );
}

function Hero() {
  return (
    <div className="mx-auto w-full max-w-[1024px] px-4 sm:px-[35px]">
      <Banner slides={heroSlides} />
    </div>
  );
}

type Slide = (typeof heroSlides)[number] | (typeof promoSlides)[number];

function Banner({ slides, compact = false }: { slides: readonly Slide[]; compact?: boolean }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6800);
    return () => window.clearInterval(timer);
  }, [paused, reduce, slides.length]);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[16px] text-white",
        compact ? "h-[280px] sm:h-[227px]" : "h-[460px] sm:h-[316px]",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        const start = event.touches[0]?.clientX ?? 0;
        event.currentTarget.dataset.x = String(start);
      }}
      onTouchEnd={(event) => {
        const start = Number(event.currentTarget.dataset.x ?? 0);
        const end = event.changedTouches[0]?.clientX ?? start;
        if (end - start > 48) go(index - 1);
        if (start - end > 48) go(index + 1);
      }}
    >
      <div key={slide.id} className="fade-up absolute inset-0">
        <Art
          palette={slide.palette}
          garment={slide.garment}
          hair={slide.hair}
          mode="banner"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
      </div>

      <div className={cn("relative z-10 flex h-full flex-col", compact ? "max-w-[460px] p-6 sm:p-8" : "max-w-[420px] p-7 sm:p-10")}>
        <div key={`${slide.id}-copy`} className="fade-up">
            <p className="text-[11px] tracking-[0.16em] text-white/85 uppercase">{slide.eyebrow}</p>
            <h2
              className={cn(
                "mt-3 font-medium tracking-[-0.03em] text-white",
                compact ? "text-[28px] leading-[1.12] sm:text-[32px]" : "text-[34px] leading-[1.08] sm:text-[36px]",
              )}
            >
              {slide.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className={cn("mt-3 text-[13px] leading-[1.45] text-white/88", compact ? "max-w-[340px]" : "max-w-[280px]")}>{slide.text}</p>
            <Link
              href={slide.href}
              className={cn(
                "mt-4 inline-flex h-8 w-fit items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-transform hover:-translate-y-0.5",
                compact ? "bg-[#1a1a1e] text-white" : "bg-white text-[#1a1a1e]",
              )}
            >
              {slide.cta}
              <ArrowRight className="size-3.5" />
            </Link>
        </div>
      </div>

      <div className="absolute top-5 right-6 z-10 flex items-center gap-3 text-[11px] tracking-[0.08em] sm:top-6 sm:right-7">
        {slides.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(itemIndex)}
            className={cn(
              "flex items-center gap-3 transition-opacity",
              itemIndex === index ? "text-white" : "text-white/55 hover:text-white/80",
            )}
            aria-label={`Слайд ${itemIndex + 1}`}
          >
            {String(itemIndex + 1).padStart(2, "0")}
            {itemIndex === index && itemIndex < slides.length - 1 && (
              <span className="hidden h-px w-8 bg-white/80 sm:block" />
            )}
          </button>
        ))}
      </div>

      <div className="absolute right-4 bottom-4 z-10 flex gap-2 sm:right-5 sm:bottom-5">
        <RoundArrow label="Предыдущий слайд" onClick={() => go(index - 1)}>
          <ArrowLeft className="size-3.5" />
        </RoundArrow>
        <RoundArrow label="Следующий слайд" onClick={() => go(index + 1)}>
          <ArrowRight className="size-3.5" />
        </RoundArrow>
      </div>
    </section>
  );
}

function RoundArrow({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full border border-white/80 text-white transition hover:bg-white/15"
    >
      {children}
    </button>
  );
}
