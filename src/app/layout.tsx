"use client";
import "./global.css";
import ProviderComponent from "@/store/ProviderComponnt";
import Navbar from "@/components/navbar/navbar";
import Head from "next/head";
import ScrollToTopButton from "@/components/scrolltop/ScrollToTopButton";
import { FaWhatsapp, FaFacebook, FaTelegram, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { QrCode } from "lucide-react";
import TopNavbar from "@/components/navbar/navbar";
import WhatsappButton from "@/components/whatsapp/WhatsappButton";
import { useState, useEffect } from "react";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <html lang={"en"} translate="no" dir="rtl">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content="SCPNET..." />
      <meta
        name="google-site-verification"
        content="sXMXcw-2VzB_JqJrK5F341-46d9Fydeh6210CvUXqY4"
      />
      <link rel="icon" href="/logo.png" sizes="any" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <body className="bg-white">
        <ProviderComponent>
          <TopNavbar />
          <WhatsappButton />
          {/* <ScrollToTopButton /> */}
          {children}
        </ProviderComponent>

        {/* Modern Transparent Footer - Removed mt-20 */}
        <footer className="relative overflow-hidden">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md" />
          
          {/* Animated gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-blue-500 animate-gradient-x" />
          
          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="container mx-auto relative z-10 px-4 py-12 lg:py-16">
            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12">
              
              {/* Brand & QR Code Section */}
              <div className="flex flex-col items-center text-center group">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                    <img src="/logo.png" alt="Space Net" className="w-14 h-14 object-contain" />
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Space Net Store</h3>
                <p className="text-gray-400 text-sm mb-4">أفضل المتاجر المتخصصة في بيع البطاريات والإلكترونيات</p>
                
                {/* QR Code */}
                <div className="relative mt-2">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 duration-300 cursor-pointer group/qr overflow-hidden">
                    <img 
                      src="/frame.jpg" 
                      alt="QR Code" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">امسح للاتصال</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">امسح الكود QR</p>
                </div>
              </div>

              {/* Contact Info Section - Responsive: Original on PC, 2x2 Grid on Mobile */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                  تواصل معنا
                  <div className="absolute -bottom-2 right-0 w-12 h-0.5 bg-gradient-to-l from-red-500 to-blue-500 rounded-full" />
                </h3>
                
                {/* Mobile View (2x2 Grid) - Hidden on PC */}
                <div className="grid grid-cols-2 gap-3 lg:hidden">
                  {/* Phone 1 */}
                  <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group/item bg-white/5 rounded-lg p-2 hover:bg-white/10">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/item:bg-red-500/20 transition-colors">
                      <FaPhoneAlt className="text-red-500 text-xs" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">هاتف 1</p>
                      <a href="tel:0956958013" className="text-[11px] hover:text-red-400 transition">0956958013</a>
                    </div>
                  </div>
                  
                  {/* Phone 2 */}
                  <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group/item bg-white/5 rounded-lg p-2 hover:bg-white/10">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                      <FaPhoneAlt className="text-blue-500 text-xs" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">هاتف 2</p>
                      <a href="tel:0937702856" className="text-[11px] hover:text-blue-400 transition">0937702856</a>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group/item bg-white/5 rounded-lg p-2 hover:bg-white/10">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-gray-400 text-xs" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">البريد الإلكتروني</p>
                      <p className="text-[10px] truncate max-w-[100px]">spacenetstore@gmail.com</p>
                    </div>
                  </div>
                  
                  {/* Hours */}
                  <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group/item bg-white/5 rounded-lg p-2 hover:bg-white/10">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaClock className="text-gray-400 text-xs" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">ساعات العمل</p>
                      <p className="text-[10px]">السبت - الخميس</p>
                      <p className="text-[9px] text-gray-400">11ص - 8م</p>
                    </div>
                  </div>
                </div>

                {/* PC View (Original Layout) - Hidden on Mobile */}
                <div className="hidden lg:block space-y-4">
                  <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/item">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover/item:bg-red-500/20 transition-colors">
                      <FaPhoneAlt className="text-red-500 text-sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">هاتف 1</p>
                      <a href="tel:0956958013" className="text-sm hover:text-red-400 transition">0956958013</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/item">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                      <FaPhoneAlt className="text-blue-500 text-sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">هاتف 2</p>
                      <a href="tel:0937702856" className="text-sm hover:text-blue-400 transition">0937702856</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-gray-400 text-sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                      <p className="text-sm">spacenetstore@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <FaClock className="text-gray-400 text-sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">ساعات العمل</p>
                      <p className="text-sm">السبت - الخميس: 11ص - 8م</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links Section - Responsive: Original on PC, 2x2 Grid on Mobile */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                  منتجاتنا
                  <div className="absolute -bottom-2 right-0 w-12 h-0.5 bg-gradient-to-l from-red-500 to-blue-500 rounded-full" />
                </h3>
                
                {/* Mobile View (2x2 Grid) - Hidden on PC */}
                <div className="grid grid-cols-2 gap-3 lg:hidden">
                  <a
                    href="/laptops"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group/item bg-white/5 rounded-lg p-2 hover:bg-white/10"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/item:bg-red-500/20 transition-colors">
                      <span className="text-red-500 text-sm">💻</span>
                    </div>
                    <span className="text-[11px] group-hover/item:text-red-400 transition">لابتوبات</span>
                  </a>
                  
                  <a
                    href="/computer"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group/item bg-white/5 rounded-lg p-2 hover:bg-white/10"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                      <span className="text-blue-500 text-sm">🖥️</span>
                    </div>
                    <span className="text-[11px] group-hover/item:text-blue-400 transition">كومبيوتر</span>
                  </a>
                  
                  <a
                    href="/accessories"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group/item bg-white/5 rounded-lg p-2 hover:bg-white/10"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/item:bg-purple-500/20 transition-colors">
                      <span className="text-purple-500 text-sm">🎧</span>
                    </div>
                    <span className="text-[11px] group-hover/item:text-purple-400 transition">اكسسوارات</span>
                  </a>
                  
                  <a
                    href="/batteries"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group/item bg-white/5 rounded-lg p-2 hover:bg-white/10"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/item:bg-green-500/20 transition-colors">
                      <span className="text-green-500 text-sm">🔋</span>
                    </div>
                    <span className="text-[11px] group-hover/item:text-green-400 transition">بطاريات</span>
                  </a>
                </div>

                {/* PC View (Original Layout) - Hidden on Mobile */}
                <ul className="hidden lg:block space-y-3">
                  {["laptops", "computer", "accessories", "batteries"].map((item, index) => (
                    <li key={index}>
                      <a
                        href={`/${item}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block group"
                      >
                        <span className="group-hover:text-red-400 transition">•</span>{" "}
                        {item === "laptops" && "لابتوبات"}
                        {item === "computer" && "كومبيوتر"}
                        {item === "accessories" && "اكسسوارات"}
                        {item === "batteries" && "بطاريات"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media Section - Responsive: With text on PC, Icons only on Mobile */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                  وسائل التواصل
                  <div className="absolute -bottom-2 right-0 w-12 h-0.5 bg-gradient-to-l from-red-500 to-blue-500 rounded-full" />
                </h3>
                
                {/* Mobile View (Icons Only) - Hidden on PC */}
                <div className="flex gap-4 lg:hidden">
                  <a
                    href="http://wa.me/963956958013"
                    target="_blank"
                    className="group w-12 h-12 bg-white/5 hover:bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <FaWhatsapp className="text-green-500 text-2xl" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61572406436431"
                    target="_blank"
                    className="group w-12 h-12 bg-white/5 hover:bg-blue-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <FaFacebook className="text-blue-500 text-2xl" />
                  </a>
                  <a
                    href="https://t.me/space_net_store"
                    target="_blank"
                    className="group w-12 h-12 bg-white/5 hover:bg-blue-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <FaTelegram className="text-blue-400 text-2xl" />
                  </a>
                  <a
                    href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME"
                    target="_blank"
                    className="group w-12 h-12 bg-white/5 hover:bg-pink-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>

                {/* PC View (With Text) - Hidden on Mobile */}
                <div className="hidden lg:flex flex-col gap-4">
                  <a
                    href="http://wa.me/963956958013"
                    target="_blank"
                    className="group flex items-center gap-3 bg-white/5 hover:bg-green-500/20 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <FaWhatsapp className="text-green-500 text-xl" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white">واتساب</span>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61572406436431"
                    target="_blank"
                    className="group flex items-center gap-3 bg-white/5 hover:bg-blue-600/20 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <FaFacebook className="text-blue-500 text-xl" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white">فيسبوك</span>
                  </a>
                  <a
                    href="https://t.me/space_net_store"
                    target="_blank"
                    className="group flex items-center gap-3 bg-white/5 hover:bg-blue-400/20 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <FaTelegram className="text-blue-400 text-xl" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white">تيليغرام</span>
                  </a>
                  <a
                    href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME"
                    target="_blank"
                    className="group flex items-center gap-3 bg-white/5 hover:bg-pink-500/20 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 group-hover:text-white">انستغرام</span>
                  </a>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                  موقعنا
                  <div className="absolute -bottom-2 right-0 w-12 h-0.5 bg-gradient-to-l from-red-500 to-blue-500 rounded-full" />
                </h3>
                <div className="w-full max-w-xs bg-white/5 backdrop-blur-sm rounded-xl p-3 mb-3 transition-all hover:shadow-lg">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-2">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.90281070646944!2d36.29680686502602!3d33.51581479330745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e7adeb2efd97%3A0x870312fc0b6036c9!2sSpace%20Net!5e0!3m2!1sen!2s!4v1749843905896!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                    <FaMapMarkerAlt className="text-red-400 text-xs" />
                    <span>دمشق - البحصة - مقابل البرج الفضي</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider with gradient */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
            </div>

            {/* Copyright Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
              <div className="flex gap-6">
                <a href="/privacy" className="text-gray-400 text-sm hover:text-white transition">سياسة الخصوصية</a>
                <a href="/terms" className="text-gray-400 text-sm hover:text-white transition">الشروط والأحكام</a>
                <a href="/faq" className="text-gray-400 text-sm hover:text-white transition">الأسئلة الشائعة</a>
              </div>
              <a href="https://EIXADARKO.com/" target="_blank" className="group">
                <p className="text-sm text-gray-400 group-hover:text-white transition">
                  <span className="underline group-hover:text-red-400 transition">EIXADARKO</span> © 2025 . جميع الحقوق محفوظة
                </p>
              </a>
            </div>
          </div>
        </footer>

        {/* Add animation styles */}
        <style jsx global>{`
          @keyframes gradient-x {
            0%, 100% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
          }
          .animate-gradient-x {
            animation: gradient-x 3s ease-in-out infinite;
          }
          .delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </body>
    </html>
  );
}