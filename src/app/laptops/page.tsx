import React from "react";
import { Hero } from "@/components/hero";
import { AllProductPage } from "@/feature/all-products-list";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";



import type { Viewport } from "next";
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
  title: "اسعار لابتوبات في سوريا بحصة ",
  description:
    "لابتوبات جيمينغ ومكتبي بارخص الاسعار وافضل الانواع في سبيس ستور ",
  keywords:
    "بيع لابتوبات جيمينغ, لابتوبات بحصة , لابتوبات بارخص الاسعار بحصه , لابتوبات جيمينغ,جيمينغ لابتوبات ,اسعار لابتوبات في سوريا",
};

export default function Home() {
  return (
    
    <div className="sm:container w-[90%] mx-auto mb-16 mt-8">
  <Hero />
  <div className="my-[10px]">
        <h2
  className="md:text-[34px] text-[20px] font-extrabold"
  style={{ color: "rgba(34,82,154,1)" }} // bright red
>
  فيديوهات سبيس نت ستور
</h2>
                <VideoCarousel />
                <section className="py-16 px-4 flex items-center justify-center">

  <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 max-w-xl text-center"
  >
    <h1 className="text-3xl md:text-4xl font-bold text-blue-900"
   >
      اسعار الابتوبات في سوريا البحصة
      
    </h1>
    <h2 className="text-3xl md:text-3xl font-bold text-blue-900">افضل الاسعار </h2>
      <h3 className="text-3xl md:text-2xl font-bold text-blue-900">افضل الاجهزة </h3>  
  </div>
</section>
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
          <MultipleItemsOffer   productType="Laptop" />
          </div>
  {/* <MultipleItems ProductList={products} /> */}
  <AllProductPage productType="Laptop" title="لابتوبات" />
</div>
  );
}
