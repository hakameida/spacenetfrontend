import CardAbout from "@/components/card/card-about";
import React from "react";
import { LaptopList } from "@/feature/laptop-list";
import { AccessoryList } from "@/feature/Accessory-list";
import { Hero } from "@/components/hero";
import { AllProductPage } from "@/feature/all-products-list";
import MultipleItems from "@/components/react-slick/react-slick";
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
  title: "اكسسوارات سبيس نت ستور",
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
  {/* <MultipleItems ProductList={products} /> */}
  <AllProductPage productType="Laptop" title="لابتوبات" />
</div>
  );
}
