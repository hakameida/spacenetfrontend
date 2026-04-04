"use client";

import { LaptopIcon, MonitorIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { name: "كومبيوتر", href: "/computer" },
  { name: "موبايلات", href: "/mobiles" },
  { name: "اكسسوارات", href: "/accessories" },
  { name: "لابتوبات", href: "/laptops" },
  { name: "بطاريات", href: "/batteries" },
  { name: "كاميرات مراقبة", href: "/cameras" },
];

export default function TopNavbar() {
  const pathname = usePathname();

  return (
    <>
      {/* 🔝 Top Navigation Bar */}
      <nav className="sticky top-0 w-full h-[80px] bg-white/30 backdrop-blur-md z-50 shadow-md">
        <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">

          {/* Left Button */}
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

          {/* Logo */}
          <a href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="w-12 sm:w-14 md:w-16"
            />
          </a>

          {/* Right Button */}
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

      {/* 🟣 Floating Bottom Categories Bar */}
      <div
        className="
          fixed bottom-6 left-1/2 -translate-x-1/2
          z-50
          bg-white/90 backdrop-blur-md
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          rounded-full
          border border-white/40
          px-4 py-3
          w-[90%] max-w-[500px]
          overflow-x-auto
          flex gap-3
          scrollbar-hide
        "
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold
              transition-all duration-300
              ${
                pathname === link.href
                  ? "bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-md"
                  : "bg-white/70 text-blue-900 hover:bg-white"
              }
            `}
          >
            {link.name}
          </a>
        ))}
      </div>
    </>
  );
}
