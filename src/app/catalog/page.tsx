import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog-view";

export const metadata: Metadata = {
  title: "Каталог",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1024px] px-4 py-16 text-sm text-[#8e8e93] sm:px-[35px]">Собираем каталог…</div>}>
      <CatalogView />
    </Suspense>
  );
}
