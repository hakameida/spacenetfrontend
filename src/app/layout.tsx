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
      <body className="bg-white">
        <ProviderComponent>
          <TopNavbar />
          <WhatsappButton />
          <ScrollToTopButton />
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
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                    <img src="/logo.png" alt="Space Net" className="w-14 h-14 object-contain" />
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Space Net Store</h3>
                <p className="text-gray-400 text-sm mb-4">أفضل المتاجر المتخصصة في بيع البطاريات والإلكترونيات</p>
                
                {/* QR Code */}
                <div className="relative mt-2">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 duration-300 cursor-pointer group/qr">
                    <QrCode className="w-20 h-20 text-gray-800" />
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">امسح للاتصال</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">امسح الكود QR</p>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                  تواصل معنا
                  <div className="absolute -bottom-2 right-0 w-12 h-0.5 bg-gradient-to-l from-red-500 to-blue-500 rounded-full" />
                </h3>
                <div className="space-y-4">
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
                      <a href="tel:0937111158" className="text-sm hover:text-blue-400 transition">0937111158</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-gray-400 text-sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                      <p className="text-sm">spacenetstore@spacenet.com</p>
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

              {/* Social Media Section */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                  وسائل التواصل
                  <div className="absolute -bottom-2 right-0 w-12 h-0.5 bg-gradient-to-l from-red-500 to-blue-500 rounded-full" />
                </h3>
                <div className="flex flex-col gap-4">
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
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                  منتجاتنا
                  <div className="absolute -bottom-2 right-0 w-12 h-0.5 bg-gradient-to-l from-red-500 to-blue-500 rounded-full" />
                </h3>
                <ul className="space-y-3">
                  {["laptops", "computer", "accessories", "mobiles", "batteries", "cameras"].map((item, index) => (
                    <li key={index}>
                      <a
                        href={`/${item}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block group"
                      >
                        <span className="group-hover:text-red-400 transition">•</span>{" "}
                        {item === "laptops" && "لابتوبات"}
                        {item === "computer" && "كومبيوتر"}
                        {item === "accessories" && "اكسسوارات"}
                        {item === "mobiles" && "موبايلات"}
                        {item === "batteries" && "بطاريات"}
                        {item === "cameras" && "كاميرات مراقبة"}
                      </a>
                    </li>
                  ))}
                </ul>
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