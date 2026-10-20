import { Suspense } from "react";
import type { Metadata } from "next";
import { productById, products } from "@/lib/data";
import { ProductView } from "@/components/product-view";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = productById(id);
  return {
    title: product?.name ?? "Вещь не найдена",
    description: product?.description,
  };
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1024px] px-4 py-16 text-sm text-[#8e8e93] sm:px-[35px]">
          Открываем вещь…
        </div>
      }
    >
      <ProductGate params={params} />
    </Suspense>
  );
}

async function ProductGate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductView id={id} />;
}
