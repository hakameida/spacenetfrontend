"use client"
import "./global.css";
import ProviderComponent from "@/store/ProviderComponnt";
import Navbar from "@/components/navbar/navbar";
import Head from "next/head";
import ScrollToTopButton from "@/components/scrolltop/ScrollToTopButton"
import { FaWhatsapp, FaFacebook, FaTelegram, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import TopNavbar from "@/components/navbar/navbar";
// import SideNav from "@/components/sidenavbar/sidenavbar";
import WhatsappButton from "@/components/whatsapp/WhatsappButton";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={"en"} translate="no" dir="rtl">
      <meta name="viewport" content="width=1024" />
      <meta name="keywords" content="SCPNET..." />
      <meta name="google-site-verification" content="sXMXcw-2VzB_JqJrK5F341-46d9Fydeh6210CvUXqY4" />
      <link rel="icon" href="/logo.png" sizes="any" />
      <body className="bg-white">
        <ProviderComponent>
          <TopNavbar />
          {/* <SideNav/> */}
          <WhatsappButton />
          <ScrollToTopButton/>
          {children}
        </ProviderComponent>

        <footer className="bg-white mt-12 border-t">
          <div className="container mx-auto w-full p-4 py-10 lg:py-12">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">

              {/* Social Links */}
              <div className="flex flex-col justify-center items-center text-center">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase">
                  تواصل معنا
                </h2>
                <ul className="text-gray-500 font-medium space-y-4">
                  <li className="flex items-center gap-2 justify-center">
                    <FaWhatsapp className="text-green-500 text-xl" />
                    <a href="http://wa.me/963956958013" target="_blank" className="hover:underline">
                      WhatsApp
                    </a>
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <FaFacebook className="text-blue-600 text-xl" />
                    <a href="https://www.facebook.com/profile.php?id=61572406436431" target="_blank" className="hover:underline">
                      Facebook
                    </a>
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <FaTelegram className="text-blue-400 text-xl" />
                    <a href="https://t.me/laptop_space_net" target="_blank" className="hover:underline">
                      Telegram
                    </a>
                  </li>
                </ul>
              </div>
              {/* Google Map & Address */}
              <div className="text-center">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase">موقعنا</h2>
                <div className="w-full h-64 border-2 border-gray-300 rounded overflow-hidden mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.90281070646944!2d36.29680686502602!3d33.51581479330745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e7adeb2efd97%3A0x870312fc0b6036c9!2sSpace%20Net!5e0!3m2!1sen!2s!4v1749843905896!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <p className="flex justify-center items-center gap-2 text-gray-700 text-base mb-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  دمشق - البحصة - مقابل البرج الفضي
                </p>
              </div>

              {/* Phone Numbers & Logo */}
              <div className="flex flex-col justify-center items-center text-center">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase">أرقامنا</h2>
                <div className="flex flex-col space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaPhoneAlt className="text-blue-500" />
                    <span>0956958013</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaPhoneAlt className="text-blue-500" />
                    <span>0937111158</span>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="flex flex-col justify-center items-center text-center">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase">منتجات</h2>
                <ul className="text-gray-500 font-medium space-y-4">
                <a href="/laptops"> <li className="hover:underline cursor-pointer">لابتوبات</li></a>
                <a href="/computer">  <li className="hover:underline cursor-pointer">كومبيوتر</li></a>
                <a href="/accessories">   <li className="hover:underline cursor-pointer">اكسسوارات</li></a>
                <a href="/mobiles">  <li className="hover:underline cursor-pointer">موبايلات</li></a>
                <a href="/playstation">  <li className="hover:underline cursor-pointer">بلايستيشن</li></a>
                <a href="/printers">  <li className="hover:underline cursor-pointer">طابعات</li></a>
                <a href="/batteries">  <li className="hover:underline cursor-pointer">بطاريات</li></a>
                <a href="/programms">  <li className="hover:underline cursor-pointer">برامج</li></a>

                </ul>
              </div>

              {/* Fifth Section - Image */}
              <div className="flex flex-col justify-center items-center text-center">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase">Space Net</h2>
                <a href="/"> <img 
                  src="/logo.png" // Replace this with your image path
                  alt="Space Net" 
                  className="w-48 h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                /> </a>
              </div>

            </div>

            <hr className="my-8 border-gray-200 sm:mx-auto lg:my-12" />

            <a href="https://EIXADARKO.com/" target="_blank">
              <p className="text-[18px] text-buttons_color text-center">
                <span className="underline">EIXADARKO</span>© 2025 . All rights reserved
              </p>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
