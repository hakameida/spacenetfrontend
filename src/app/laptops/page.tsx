// /app/laptops/page.tsx - Full file with metadata and client logic combined
"use client";

import React, { useState, useEffect } from "react";
import { AllLaptopPage } from "@/feature/all-laptop-page";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";
import VideoCarousel from "@/components/youtubevideo/VideoCarousel";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { Play, Tag, Sparkles, ChevronLeft, ChevronRight, Shield, Phone, MessageCircle, ZoomIn } from "lucide-react";
import Image from "next/image";
import Head from "next/head";

// Promotional messages for the slider
const promoMessages = [
  "يوجد لدينا توصيل لكافة المحافظات",
  "افضل الاجهزة وبافضل الاسعار",
  "كفالة ذهبية على جميع الاجهزة",
  "تشمل هارد وير وسوفت وير",
  "توصيل لجميع مناطق دمشق",
  "شحن امن لجميع المحافظات",
  "تخديم كامل و مميز بعد البيع",
];

export default function LaptopPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoMessages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoMessages.length) % promoMessages.length);
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/963998372756", "_blank");
  };

  return (
    <>
      <Head>
        <title>اسعار لابتوبات في سوريا بحصة</title>
        <meta name="description" content="لابتوبات جيمينغ ومكتبي بارخص الاسعار وافضل الانواع في سبيس ستور" />
        <meta name="keywords" content="بيع لابتوبات جيمينغ, لابتوبات بحصة, لابتوبات بارخص الاسعار بحصه, لابتوبات جيمينغ,جيمينغ لابتوبات, اسعار لابتوبات في سوريا" />
      </Head>
      
      <LoadingScreen />

{/* Main Container - Adjusted for shorter navbar */}
<div className="w-full mx-auto mb-4 mt-1 pt-14 md:pt-16">        
        {/* Hero Section with Background Image and Foggy Effect */}
        <div className="relative w-full h-auto md:h-[600px] lg:h-[700px] overflow-hidden pb-8">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/laptopmain.png"
              alt="Laptop Hero"
              fill
              className="object-cover object-center"
              priority
              quality={100}
            />
          </div>
          
          {/* Foggy/Glassmorphism Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/40 to-black/60 backdrop-blur-sm" />
          
          {/* Additional gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          
          {/* Content Container */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-0">
            
            {/* Main Title */}
            <div className="text-center mb-6 md:mb-8 animate-fadeInDown">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                سبيس نت ستور
              </h1>
              <p className="text-lg sm:text-xl md:text-3xl text-blue-200 font-light drop-shadow-md">
                وجهتك الأولى للابتوبات في سوريا
              </p>
            </div>
            
            {/* Promo Slider */}
            <div className="relative w-full max-w-3xl mx-auto">
              {/* Slider Container */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4 md:p-8">
                {/* Slider Content */}
                <div className="min-h-[100px] md:min-h-[120px] flex items-center justify-center">
                  <div className="text-center animate-fadeIn">
                    <div className="inline-block p-2 md:p-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 mb-3 md:mb-4">
                      <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                    </div>
                    <p className="text-base md:text-xl lg:text-3xl font-bold text-white leading-relaxed px-2">
                      {promoMessages[currentSlide]}
                    </p>
                    <div className="mt-3 md:mt-4 flex justify-center gap-2">
                      <div className="w-8 md:w-12 h-0.5 bg-blue-400 rounded-full" />
                      <div className="w-4 md:w-6 h-0.5 bg-white/50 rounded-full" />
                    </div>
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 p-1 md:p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 p-1 md:p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                
                {/* Dots Indicator */}
                <div className="flex justify-center gap-1 md:gap-2 mt-4 md:mt-6">
                  {promoMessages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        currentSlide === index
                          ? "w-6 md:w-8 h-1.5 md:h-2 bg-blue-500"
                          : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating Badges */}
            <div className="relative z-10 flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8 mb-4 md:mb-0">
              <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white border border-white/20">
                🚚 توصيل سريع
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white border border-white/20">
                💎 كفالة ذهبية
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white border border-white/20">
                ⭐ ضمان شامل
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the page content */}
        <div className="sm:container w-[90%] mx-auto">
          <div className="my-[10px]">
            {/* Offers Header with Icon */}
            <div className="flex items-center gap-3 mb-2 mt-8">
              <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm">
                <Tag className="w-7 h-7 md:w-9 md:h-9" style={{ color: "rgba(34,82,154,1)" }} />
              </div>
              <div>
                <h2
                  className="md:text-[42px] text-[28px] font-extrabold tracking-tight leading-tight"
                  style={{ color: "rgba(34,82,154,1)" }}
                >
                  عروض الاسبوع
                </h2>
                <span
                  className="text-[16px] md:text-[18px] font-medium block mt-1"
                  style={{ color: "rgba(34,82,154,0.8)" }}
                >
                  عروض كل اسبوع شكل
                </span>
              </div>
            </div>
            <MultipleItemsOffer productModule="LAPTOP" />
          </div>

          {/* Technical Support Section - Interactive Card - Same Height for All Screens */}
          <div className="my-6 md:my-8">
            {/* Interactive Card */}
            <div 
              className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
              onClick={handleWhatsAppClick}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-WHITE-600 via-WHITE-700 to-indigo-700" />
              
              {/* Image Container - Same Height for ALL Screens (Mobile, Tablet, Desktop, Wide) */}
              <div className="relative w-full h-56 overflow-hidden">
                <div 
                  className={`relative w-full h-full transition-all duration-700 ${
                    isHovered ? 'scale-125 md:scale-150' : 'scale-100'
                  }`}
                >
                  <Image
                    src="/itsupport.png"
                    alt="الدعم التقني"
                    fill
                    className="object-contain transition-all duration-700"
                    style={{ objectPosition: "center" }}
                  />
                </div>
                
                {/* Zoom Indicator */}
                <div className={`absolute top-2 right-2 transition-all duration-300 ${
                  isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                }`}>
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5 md:p-2">
                    <ZoomIn className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>
                
                {/* Dark Overlay - Changes on hover */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isHovered ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/40'
                }`} />
                
                {/* Content Overlay - Shows on Hover/Press */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {/* WhatsApp Icon */}
                  <div className="mb-2 md:mb-3">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg animate-bounce">
                      <MessageCircle className="w-5 h-5 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                      <h3 className="text-sm md:text-lg font-bold text-white">
                        الدعم التقني لديكم
                      </h3>
                    </div>
                    <p className="text-base md:text-xl font-bold text-yellow-300 mb-1">
                      لا خوف عليكم
                    </p>
                    <p className="text-white/90 text-xs md:text-sm">
                      فريق دعم متخصص على مدار الساعة
                    </p>
                    
                    {/* WhatsApp Button */}
                    <div className="mt-2 md:mt-3 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-full px-3 py-1.5 md:px-4 md:py-2 transition-all duration-300">
                      <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      <span className="text-white text-xs md:text-sm font-semibold">واتساب: 0998372756</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Tags - Shows when not hovered */}
                <div className={`absolute inset-0 flex items-center justify-center gap-1.5 md:gap-2 px-2 transition-all duration-500 ${
                  isHovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                }`}>
                  <div className="bg-black/50 backdrop-blur-md rounded-full px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs text-white border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105">
                    🎧 24/7
                  </div>
                  <div className="bg-black/50 backdrop-blur-md rounded-full px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs text-white border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105">
                    ⚡ سريع
                  </div>
                  <div className="bg-black/50 backdrop-blur-md rounded-full px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs text-white border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105">
                    🛡️ شامل
                  </div>
                </div>

                {/* Hint Text - Shows when not hovered */}
                <div className={`absolute bottom-2 left-0 right-0 text-center transition-all duration-500 ${
                  isHovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}>
                  <p className="text-white/80 text-[10px] md:text-xs bg-black/40 backdrop-blur-sm inline-block px-2 py-0.5 rounded-full mx-auto">
                    🔍 اضغط للتكبير والتواصل
                  </p>
                </div>
              </div>
              
              {/* Bottom Accent Line */}
              <div className="relative z-10 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />
            </div>
          </div>

          {/* Laptops Header with Icon */}
          <div className="flex items-center gap-3 mb-4 mt-12">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10" style={{ color: "rgba(34,82,154,1)" }} />
            </div>
            <h2
              className="md:text-[42px] text-[28px] font-extrabold tracking-tight"
              style={{ color: "rgba(34,82,154,1)" }}
            >
              لابتوبات
            </h2>
          </div>

          <AllLaptopPage title="" />
          
          {/* Videos Section */}
          <div className="flex items-center gap-3 mb-4 mt-12">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-red-500/20 backdrop-blur-sm">
              <Play className="w-7 h-7 md:w-9 md:h-9" style={{ color: "rgba(34,82,154,1)" }} />
            </div>
            <h2
              className="md:text-[42px] text-[28px] font-extrabold tracking-tight"
              style={{ color: "rgba(34,82,154,1)" }}
            >
              فيديوهات سبيس نت ستور
            </h2>
          </div>
          <VideoCarousel />
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </>
  );
}