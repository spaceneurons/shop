import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1024px] flex-col items-start px-4 py-24 sm:px-[35px]">
      <p className="text-[12px] tracking-[0.14em] text-[#8e8e93] uppercase">404</p>
      <h1 className="mt-2 text-[36px] font-medium tracking-[-0.03em]">Такой страницы нет</h1>
      <p className="mt-3 max-w-md text-[15px] text-[#4a4a50]">
        Ссылка могла устареть. Каталог на месте — откройте его и выберите вещь заново.
      </p>
      <Button className="mt-6 rounded-full" render={<Link href="/catalog" />}>
        В каталог
      </Button>
    </div>
  );
}
