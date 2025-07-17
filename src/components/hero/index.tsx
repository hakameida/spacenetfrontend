"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import gsap from "gsap";

const messages = [
  "يوجد لدينا توصيل لكافة المحافظات",
  "افضل الاجهزة وبافضل الاسعار",
  "كفالة ذهبية على جميع الاجهزة",
  " تشمل هارد وير وسوفت وير",
  "توصيل لجميع مناطق دمشق ",
  "شحن امن لحميع المحافظات",
  "تخديم كامل و مميز بعد البيع",
];

export const Hero = () => {
  const [search, setSearch] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const logoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ❄️ Draw realistic snowflake
  const drawSnowflake = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, size);
      ctx.moveTo(0, size * 0.5);
      ctx.lineTo(size * 0.25, size * 0.5);
      ctx.moveTo(0, size * 0.5);
      ctx.lineTo(-size * 0.25, size * 0.5);
    }

    ctx.stroke();
    ctx.restore();
  };

  // ❄️ Snow animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let flakes = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 100,
    }));

    let angle = 0;

    const drawFlakes = () => {
      ctx.clearRect(0, 0, width, height);
      flakes.forEach((f) => {
        drawSnowflake(ctx, f.x, f.y, f.r);
      });
      updateFlakes();
    };

    const updateFlakes = () => {
      angle += 0.01;
      flakes.forEach((f, i) => {
        f.y += Math.cos(angle + f.d) + 1 + f.r / 3;
        f.x += Math.sin(angle) * 1.5;

        if (f.x > width || f.x < 0 || f.y > height) {
          flakes[i] = {
            x: Math.random() * width,
            y: 0,
            r: f.r,
            d: f.d,
          };
        }
      });
    };

    const animate = () => {
      drawFlakes();
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  // 🌟 Logo float + container fade in
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

  // 📢 Message text animation
 useEffect(() => {
  const el = textRef.current;
  if (!el) return;

  const tl = gsap.timeline({
    onComplete: () => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    },
  });

  tl.fromTo(el, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5 })
    .to(el, { duration: 5 })
    .to(el, { x: -100, opacity: 0, duration: 1.5 });

  // ✅ Proper cleanup
  return () => {
    tl.kill(); // Kill the timeline
  };
}, [currentIndex]);

  // 🔁 Cycle every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // 🔍 Search
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
      className="relative w-[90%] mx-auto bg-black opacity-50 flex flex-col items-center justify-center gap-24 px-4 py-8 border border-red-200 rounded-2xl shadow-lg"
      style={{
        backgroundImage: "url('/123.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ❄️ Snow Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Logo + Sliding Text */}
      <div
        ref={logoRef}
        className="relative flex flex-col items-center cursor-pointer w-[220px] md:w-[460px] h-[220px] md:h-[460px] transform rotate-[-10deg] select-none"
      >
        <img
          src="/logo.png"
          alt="logo"
          className="w-full h-full object-contain"
          draggable={false}
        />

        <div
          className="mt-4 text-center text-[16px] md:text-[22px] font-semibold text-[rgba(34,82,154,1)] whitespace-nowrap select-none pointer-events-none"
          aria-live="polite"
          style={{ width: "100%", maxWidth: "300px" }}
        >
          <div ref={textRef}>{messages[currentIndex]}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className="flex items-center border-2 border-[rgba(34,82,154,1)] rounded-full px-4 py-2 w-[80%] md:w-[50%] bg-white shadow-md"
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
