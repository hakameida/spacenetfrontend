// components/TopNavbar.tsx
"use client";

import { LaptopIcon, MonitorIcon } from "lucide-react";

const TopNavbar = () => {
  return (
    <nav className="sticky top-0 w-full h-[80px] bg-white bg-opacity-30 backdrop-blur-md z-50 shadow-md">
      <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">
        {/* Left Icon */}
        <a href="https://www.notebookcheck.net/" target="_blank" rel="noopener noreferrer">
          <LaptopIcon className="w-6 h-6 text-red-600 hover:scale-110 transition" />
        </a>

        {/* Center Logo */}
        <a href="/">
          <img src="/logo.png" alt="Logo" className="w-12 sm:w-14 md:w-16" />
        </a>

        {/* Right Icon */}
        <a href="https://pcpartpicker.com/" target="_blank" rel="noopener noreferrer">
          <MonitorIcon className="w-6 h-6 text-blue-800 hover:scale-110 transition" />
        </a>
      </div>
    </nav>
  );
};

export default TopNavbar;
