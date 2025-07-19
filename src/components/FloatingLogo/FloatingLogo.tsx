// components/FloatingLogo.tsx
"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const FloatingLogo = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(logoRef.current, {
      y: -12,
      rotation: 4,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="flex justify-center py-12 md:py-10">
      <div
        ref={logoRef}
        className="w-[180px] h-[180px] md:w-[360px] md:h-[360px] transform rotate-[-10deg] select-none"
      >
        <img
          src="/logo.png"
          alt="logo"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};
