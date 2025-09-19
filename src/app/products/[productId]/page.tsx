import React from "react";
import ProductById from "./product-by-id";
import type { Viewport } from "next";
import { getProductById } from "@/lib/server-gql";

export async function generateMetadata({ params }) {
  const product = await getProductById(params.productId);

  if (!product) {
    return {
      title: "المنتج غير موجود | سبيس نت ستور",
      description: "لم يتم العثور على المنتج المطلوب.",
    };
  }

  return {
    title: `سعر ${product.name} في سوريا | سبيس نت ستور`,
    description: `اكتشف سعر ${product.name} في سوريا، مع أفضل العروض من سبيس نت ستور.`,
    keywords: `سعر ${product.name}, لابتوبات في سوريا`,
  };
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.6, // Change this value to adjust the zoom level
  maximumScale: 1,
  userScalable: true,
};



export default function ProductsId({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <div className="sm:container sm:w-full w-[90%] mx-auto md:my-36 my-8">
      {" "}
      <ProductById id={params.productId} />{" "}
    </div>
  );
}
