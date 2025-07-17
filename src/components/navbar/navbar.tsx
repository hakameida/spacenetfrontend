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
  { name: "بلايستيشن", href: "/playstation" },
  { name: "طابعات", href: "/printers" },
  { name: "بطاريات", href: "/batteries" },
  { name: "برامج", href: "/programms" },
];

const TopNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 w-full h-[80px] bg-white bg-opacity-30 backdrop-blur-md z-50 shadow-md">
        <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">
          {/* Left icon + label */}
          <a
            href="https://www.notebookcheck.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-red-600 hover:scale-110 transition"
            style={{ width: 76 }}
          >
            <LaptopIcon className="w-6 h-6" />
            <span className="text-xs mt-1"> مقارنة كومبيوتر  </span>
          </a>

          {/* Center logo */}
          <a href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="w-12 sm:w-14 md:w-16"
            />
          </a>

          {/* Right icon + label */}
          <a
            href="https://pcpartpicker.com/"
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

      {/* Sticky "أقسام" Button under the navbar */}
      {!showMenu && (
        <div className="sticky top-[80px] z-40 flex justify-center py-2">
          <button
            onClick={() => setShowMenu(true)}
            aria-expanded={showMenu}
            aria-controls="nav-menu"
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            أقسام
          </button>
        </div>
      )}

      {/* Backdrop */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Sliding Menu */}
      <div
        id="nav-menu"
        role="menu"
        className={`fixed top-[120px] left-1/2 -translate-x-1/2 w-[280px] z-[60] transition-all duration-500 ease-in-out bg-white/30 backdrop-blur-md shadow-md rounded-xl overflow-hidden ${
          showMenu ? "max-h-[600px] py-4 px-6" : "max-h-0 py-0 px-6"
        }`}
      >
        <div className="flex flex-col gap-3 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-base font-bold px-4 py-2 rounded-md transition hover:scale-105 duration-300 w-full text-center
                ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                    : "bg-white/50 text-blue-900"
                }`}
            >
              {link.name}
            </a>
          ))}

          {/* Back Button Inside Menu */}
          <button
            onClick={() => setShowMenu(false)}
            className="mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            ↑ إغلاق
          </button>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
