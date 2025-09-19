import CardAbout from "@/components/card/card-about";
import React from "react";
import { LaptopList } from "@/feature/laptop-list";
import { AccessoryList } from "@/feature/Accessory-list";
import { Hero } from "@/components/hero";
import { AllProductPage } from "@/feature/all-products-list";
import MultipleItems from "@/components/react-slick/react-slick";


import type { Viewport } from "next";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";
import VideoCarousel from "@/components/youtubevideo/VideoCarousel";

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
  title: "بلايستيشن سبيس نت ستور",
  description:
    "بلايستيشن بارخص الاسعار والافضل في سبيس ستور  ",
  keywords:
    "بيع بلاستيشن بحصه  , بلاستيشن  بحصه , بلاستيشن بارخص الاسعار بحصه ,  بحصه بلاستيشن ",
};

export default function Home() {
  return (
    <div className="sm:container w-[90%] mx-auto mb-16 mt-8 ">
      <Hero />
      <div className="my-[10px]">
        <h2
  className="md:text-[34px] text-[20px] font-extrabold"
  style={{ color: "rgba(34,82,154,1)" }} // bright red
>
  فيديوهات سبيس نت ستور
</h2>
                <VideoCarousel />
<h2
  className="md:text-[34px] text-[20px] font-extrabold"
  style={{ color: "rgba(34,82,154,1)" }} // bright red
>
  عروض الاسبوع
</h2>
<span
  className="text-[14px] font-normal"
  style={{ color: "rgba(34,82,154,1)" }} // deep blue
>
  عروض كل اسبوع شكل
</span>
          <MultipleItemsOffer   productType="playstation" />
          </div>
      <AllProductPage productType="playstation" title="بلايستيشن" />
    </div>
  );
}
