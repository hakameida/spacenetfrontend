import CardAbout from "@/components/card/card-about";
import React from "react";
import { LaptopList } from "@/feature/laptop-list";
import { AccessoryList } from "@/feature/Accessory-list";
import { Hero } from "@/components/hero";
import { AllProductPage } from "@/feature/all-products-list";
import MultipleItems from "@/components/react-slick/react-slick";


import type { Viewport } from "next";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.5, // Change this value to adjust the zoom level
  maximumScale: 1,
  userScalable: true,
};

const products = [
  {
    image: "/ads1.jpg",
    title: "",
  },

  {
    image: "/ads2.jpg",
    title: "",
  },
  {
    image: "/ads3.jpg",
    title: "",
  },
  {
    image: "/ads4.jpg",
    title: "",
  },
  {
    image: "/ads5.jpg",
    title: "",
  },
  {
    image: "/ads6.jpg",
    title: "",
  },
  {
    image: "/ads7.jpg",
    title: "",
  },
  {
    image: "/ads8.jpg",
    title: "",
  },
];

export const metadata = {
  title: "Space Net For Laptop",
  description: "سبيس نت فور لابتوب, جميع انواع الابتوبات المكتبية و الغيمنغ لابتوب و الاكسسوارات والموبايلات",
};

export default function Home() {
  return (
    <div className="sm:container w-[90%] mx-auto mb-16 mt-8 ">
      <Hero />
      <div className="my-[10px]">
    <h2 className="md:text-[34px] text-[20px] font-[700]" style={{ color: 'rgba(255,15,27,1)' }}>
      التصنيفات الموجودة بالموقع
    </h2>
    <span className="text-[14px] font-[400]" style={{ color: 'rgba(34,82,154,1)' }}>
      جميع انواع الابتوبات و الملحقات الخاصة باللابتوب
    </span>
  </div>
      <MultipleItems ProductList={products} />
      <AllProductPage productType="computer" title="كومبيوتر" />
    </div>
  );
}
