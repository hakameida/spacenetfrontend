"use client";

import React from "react";
import { AllBagsPage } from "@/feature/all-bags-page";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";
import VideoCarousel from "@/components/youtubevideo/VideoCarousel";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { Tag, Sparkles, Play } from "lucide-react";
import Head from "next/head";
import BrandsSection from "@/components/brands/brands-section";
import { FloatingLogo } from "@/components/FloatingLogo/FloatingLogo";

export default function BagsPage() {
  return (
    <>
    {/* Hero Section */}
            <FloatingLogo />
      <Head>
        <title>حقائب لابتوب في سوريا - سبيس نت ستور</title>
        <meta name="description" content="أفضل الحقائب والحقائب المدرسية وحقائب اللابتوب بأفضل الأسعار" />
      </Head>

      <LoadingScreen />

      <div className="w-full mx-auto mb-4 mt-1 pt-14 md:pt-16">
        <div className="sm:container w-[90%] mx-auto">
          <div className="flex items-center gap-3 mb-2 mt-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm">
              <Tag className="w-7 h-7 md:w-9 md:h-9" style={{ color: "rgba(34,82,154,1)" }} />
            </div>
            <div>
              <h2 className="md:text-[42px] text-[28px] font-extrabold tracking-tight leading-tight" style={{ color: "rgba(34,82,154,1)" }}>
                عروض الاسبوع
              </h2>
              <span className="text-[16px] md:text-[18px] font-medium block mt-1" style={{ color: "rgba(34,82,154,0.8)" }}>
                عروض كل اسبوع شكل
              </span>
            </div>
          </div>
          <MultipleItemsOffer />

          <BrandsSection />

          <div className="flex items-center gap-3 mb-4 mt-12">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10" style={{ color: "rgba(34,82,154,1)" }} />
            </div>
            <h2 className="md:text-[42px] text-[28px] font-extrabold tracking-tight" style={{ color: "rgba(34,82,154,1)" }}>
              حقائب
            </h2>
          </div>

          <AllBagsPage title="" />

          <div className="flex items-center gap-3 mb-4 mt-12">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-red-500/20 backdrop-blur-sm">
              <Play className="w-7 h-7 md:w-9 md:h-9" style={{ color: "rgba(34,82,154,1)" }} />
            </div>
            <h2 className="md:text-[42px] text-[28px] font-extrabold tracking-tight" style={{ color: "rgba(34,82,154,1)" }}>
              فيديوهات سبيس نت ستور
            </h2>
          </div>
          <VideoCarousel />
        </div>
      </div>
    </>
  );
}