import React from "react";
import { Hero } from "@/components/hero";
import { AllProductPage } from "@/feature/all-products-list";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";
import VideoCarousel from "@/components/youtubevideo/VideoCarousel";
import LoadingScreen from "@/components/loading/LoadingScreen";

import type { Viewport } from "next";

export const viewport: Viewport = {
  // width: "device-width",
  // initialScale: 0.5,
  // maximumScale: 1,
  // userScalable: true,
};

export const metadata = {
  title: "اسعار لابتوبات في سوريا بحصة ",
  description:
    "لابتوبات جيمينغ ومكتبي بارخص الاسعار وافضل الانواع في سبيس ستور ",
  keywords:
    "بيع لابتوبات جيمينغ, لابتوبات بحصة , لابتوبات بارخص الاسعار بحصه , لابتوبات جيمينغ,جيمينغ لابتوبات ,اسعار لابتوبات في سوريا",
};

export default function Home() {
  return (
    <>
      {/* 🔵 Loading Screen */}
      <LoadingScreen />

      <div className="sm:container w-[90%] mx-auto mb-16 mt-8">
        <Hero />

        <div className="my-[10px]">
          <h2
            className="md:text-[34px] text-[20px] font-extrabold"
            style={{ color: "rgba(34,82,154,1)" }}
          >
            فيديوهات سبيس نت ستور
          </h2>

          <VideoCarousel />

          <section className="py-16 px-4 flex items-center justify-center">
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 max-w-xl text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
                اسعار الابتوبات في سوريا البحصة
              </h1>
              <h2 className="text-3xl md:text-3xl font-bold text-blue-900">
                افضل الاسعار
              </h2>
              <h3 className="text-3xl md:text-2xl font-bold text-blue-900">
                افضل الاجهزة
              </h3>
            </div>
          </section>

          <h2
            className="md:text-[34px] text-[20px] font-extrabold"
            style={{ color: "rgba(34,82,154,1)" }}
          >
            عروض الاسبوع
          </h2>

          <span
            className="text-[14px] font-normal"
            style={{ color: "rgba(34,82,154,1)" }}
          >
            عروض كل اسبوع شكل
          </span>

          <MultipleItemsOffer productType="Laptop" />
        </div>

        <AllProductPage productType="Laptop" title="لابتوبات" />
      </div>
    </>
  );
}
