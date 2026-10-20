import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { SiteFrame } from "@/components/site-frame";
import "./globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LUMI — стиль в каждом моменте",
    template: "%s — LUMI",
  },
  description:
    "Минималистичный интернет-магазин LUMI: спокойный гардероб для женщин, мужчин и детей.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${onest.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#fbfbfb] text-[#1a1a1e]">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
