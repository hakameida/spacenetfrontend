"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import gsap from "gsap";

const messages = [
  "يوجد لدينا توصيل لكافة المحافظات",
  "أفضل العروض بأفضل الأسعار",
];

export const Hero = () => {
  const [search, setSearch] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Logo floating + container fade in
  useEffect(() => {
    gsap.to(logoRef.current, {
      y: -15,
      rotation: 5,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power1.inOut",
    });

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 3, ease: "power2.out" }
    );
  }, []);

  // Sliding text animation under logo
  useEffect(() => {
    if (showVideo) return () => {}; // Safe empty cleanup

    const el = textRef.current;
    if (!el) return () => {}; // Safe empty cleanup

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
      },
    });

    tl.fromTo(
      el,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    )
      .to(el, { duration: 7 }) // Keep text visible longer (7 seconds)
      .to(el, { x: -100, opacity: 0, duration: 1.5, ease: "power3.in" });

    return () => tl.kill();
  }, [currentIndex, showVideo]);

  // Cycle text <-> video every 20 seconds (longer display time)
  useEffect(() => {
    const totalCycleMs = 20000; // total 20 seconds cycle
    const videoDurationMs = 5000;

    const interval = setInterval(() => {
      setShowVideo(true);

      setTimeout(() => {
        setShowVideo(false);
        setCurrentIndex(0);
      }, videoDurationMs);
    }, totalCycleMs);

    return () => clearInterval(interval);
  }, []);

  // Search handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      window.location.href = `/search/${search}`;
    }
  };

  const onSearchClick = () => {
    window.location.href = `/search/${search}`;
  };

  return (
  <div
    ref={containerRef}
    className="relative w-[80%] mx-auto bg-white flex flex-col items-center justify-center gap-24 px-4 py-8"
  >
    {/* Logo + Text + Video */}
    <div
      ref={logoRef}
      className="relative flex flex-col items-center cursor-pointer w-[180px] md:w-[300px] h-[180px] md:h-[300px] transform rotate-[-10deg] select-none"
    >
      {/* Logo Image */}
      <img
        src="/logo.png"
        alt="logo"
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* Sliding Text */}
      <div
        className="mt-4 text-center text-[16px] md:text-[22px] font-semibold text-[rgba(34,82,154,1)] whitespace-nowrap select-none pointer-events-none"
        aria-live="polite"
        style={{ width: "100%", maxWidth: "280px" }}
      >
        <div ref={textRef}>{!showVideo && messages[currentIndex]}</div>
      </div>

      {/* Video */}
      {showVideo && (
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/g9t8t66A6oI?autoplay=1&mute=1&controls=0&rel=0"
          title="YouTube video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute top-0 left-0 rounded-md"
        />
      )}
    </div>

    {/* Search Bar */}
    <div
      className="flex items-center border-b-4 border-[rgba(34,82,154,1)] px-2 cursor-pointer w-[80%] md:w-[50%]"
      onKeyDown={handleKeyDown}
    >
      <input
        type="text"
        placeholder="أبحث هنا..."
        className="h-full w-full bg-transparent text-[rgba(34,82,154,1)] text-[22px] outline-none placeholder:text-[rgba(34,82,154,1)]"
        onChange={(e) => setSearch(e.target.value)}
      />
      <span
        className="ml-2 md:text-[28px] text-[18px] text-[rgba(34,82,154,1)] cursor-pointer"
        onClick={onSearchClick}
      >
        <IoSearch />
      </span>
    </div>
  </div>
);

};