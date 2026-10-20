"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StoreDrawers } from "@/components/drawers";
import { StoreProvider } from "@/lib/store";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StoreDrawers />
    </StoreProvider>
  );
}
