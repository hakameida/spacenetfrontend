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

      {/* Maintenance Message */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="bg-yellow-50 border-r-4 border-yellow-400 rounded-lg shadow-md p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              تحت الصيانة
            </h1>
            <p className="text-lg text-gray-600">
              وقت قصير وسوف يعود للخدمة
            </p>
            <div className="mt-6 w-16 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}