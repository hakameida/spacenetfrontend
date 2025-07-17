
import React from "react";

import { Hero } from "@/components/hero";
import { AllProductPage } from "@/feature/all-products-list";
import MultipleItems from "@/components/react-slick/react-slick";


import type { Viewport } from "next";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";
import VideoCarousel from "@/components/youtubevideo/VideoCarousel";
import Head from "next/head";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.5, // Change this value to adjust the zoom level
  maximumScale: 1,
  userScalable: true,
};

// const products = [
//   {
//     image: "/ads1.jpg",
//     title: "",
//   },

//   {
//     image: "/ads2.jpg",
//     title: "",
//   },
//   {
//     image: "/ads3.jpg",
//     title: "",
//   },
//   {
//     image: "/ads4.jpg",
//     title: "",
//   },
//   {
//     image: "/ads5.jpg",
//     title: "",
//   },
//   {
//     image: "/ads6.jpg",
//     title: "",
//   },
//   {
//     image: "/ads7.jpg",
//     title: "",
//   },
//   {
//     image: "/ads8.jpg",
//     title: "",
//   },
// ];

export const metadata = {
  title: "اكسسوارات سبيس نت ستور",
  description:
    "اكسسوارات بارخص الاسعار وافضل الانواع في سبيس ستور هاردات رامات ماوسات كيبورات والقائمة تطول ",
  keywords:
    "بيع اكسسوارات بحصه  , اكسسوارات جودة عالية بحصه , اكسسوارات بارخص الاسعار بحصه , بيع هاردات بحصه  ,بيع رامات بحصه  ,بيع كيبورد بحصه , بيع ماوس",
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
          <MultipleItemsOffer   productType="Accessory" />
          </div>
    {/* <h2 className="md:text-[34px] text-[20px] font-[700]" style={{ color: 'rgba(255,15,27,1)' }}>
      التصنيفات الموجودة بالموقع
    </h2> */}
    {/* <span className="text-[14px] font-[400]" style={{ color: 'rgba(34,82,154,1)' }}>
      جميع انواع الاكسسوارات 
    </span> */}
  
      {/* <MultipleItems ProductList={products} /> */}

      <AllProductPage productType="Accessory" title="اكسسوارات" />
    </div>
  );
}
