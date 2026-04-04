"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeLogo, setFadeLogo] = useState(false);

  useEffect(() => {
    // Step 1: Fade out logo after 1.2s
    const logoTimer = setTimeout(() => {
      setFadeLogo(true);
    }, 1200);

    // Step 2: Remove loading screen after 2s
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex flex-col items-center justify-center
        bg-white
        transition-opacity duration-700
      "
    >
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Logo"
        width={120}
        height={120}
        className={`
          transition-all duration-700
          ${fadeLogo ? "opacity-0 scale-75" : "opacity-100 scale-100"}
        `}
      />

      {/* Loading Spinner */}
      <div
        className={`
          mt-6 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin
          transition-opacity duration-700
          ${fadeLogo ? "opacity-0" : "opacity-100"}
        `}
      />
    </div>
  );
}
