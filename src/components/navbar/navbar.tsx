"use client";

import { useState } from "react";
import { LaptopIcon, MonitorIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { name: "كومبيوتر", href: "/computer" },
  { name: "موبايلات", href: "/mobiles" },
  { name: "اكسسوارات", href: "/accessories" },
  { name: "لابتوبات", href: "/laptops" },
  // { name: "بلايستيشن", href: "/playstation" },
  // { name: "طابعات", href: "/printers" },
  { name: "بطاريات", href: "/batteries" },
  { name: "كاميرات مراقبة", href: "/cameras" },
  // { name: "برامج", href: "/programms" },
];

const TopNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* 🔝 Top Navigation Bar */}
      <nav className="sticky top-0 w-full h-[80px] bg-white bg-opacity-30 backdrop-blur-md z-50 shadow-md">
        <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">
          {/* 🔺 Left Button */}
          <a
            href="https://pcpartpicker.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-red-600 hover:scale-110 transition"
            style={{ width: 76 }}
          >
            <LaptopIcon className="w-6 h-6" />
            <span className="text-xs mt-1">مقارنة كومبيوتر</span>
          </a>

          {/* 🖼 Logo Center */}
          <a href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="w-12 sm:w-14 md:w-16"
            />
          </a>

          {/* 🔻 Right Button */}
          <a
            href="https://www.notebookcheck.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-blue-800 hover:scale-110 transition"
            style={{ width: 76 }}
          >
            <MonitorIcon className="w-6 h-6" />
            <span className="text-xs mt-1">مقارنة لابتوب</span>
          </a>
        </div>
      </nav>

      {/* 🟣 Floating "أقسام" Button — Centered Under Navbar */}
      {!showMenu && (
        <button
          onClick={() => setShowMenu(true)}
          title="أقسام"
          aria-expanded={showMenu}
          aria-controls="nav-menu"
          className="fixed top-[90px] left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
        >
          أقسام
        </button>
      )}

      {/* 🔲 Fullscreen Backdrop */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* 📋 Sliding Section Menu */}
      <div
        id="nav-menu"
        role="menu"
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] z-[60] transition-all duration-500 ease-in-out bg-white/80 backdrop-blur-md shadow-xl rounded-xl overflow-hidden ${
          showMenu ? "scale-100 opacity-100 p-6" : "scale-0 opacity-0 p-0"
        }`}
      >
        <div className="flex flex-col gap-4 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-base font-bold px-4 py-2 rounded-md transition hover:scale-105 duration-300 w-full text-center
                ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                    : "bg-white/60 text-blue-900"
                }`}
            >
              {link.name}
            </a>
          ))}

          {/* 🔙 Close Button */}
          <button
            onClick={() => setShowMenu(false)}
            className="mt-4 bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            ↑ إغلاق
          </button>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
