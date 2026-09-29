// components/brands/brands-section.tsx
"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Layers } from "lucide-react";

// ✅ Available in `simple-icons` — imported directly
import {
  siRedragon,
  siRazer,
  siHyperx,
  siDell,
  siMsi,
  siAsus,
  siLenovo,
} from "simple-icons";

/* ────────────────────────────── Types ────────────────────────────── */

interface Brand {
  /** English name used for search query — must match product.brand in your data */
  searchName: string;
  /** Arabic/display label shown under the logo (optional) */
  label?: string;
  /**
   * Either:
   *  - a path string to a file in /public (e.g. "/brands/fantech.svg")
   *  - a ReactNode containing an inline <svg />
   */
  logo: string | React.ReactNode;
  /** Optional custom alt (only used when `logo` is a string path) */
  alt?: string;
}

/* ────────────────────────────── Data ─────────────────────────────── */

/** Helper to render a simple-icons object as an inline SVG */
const renderSimpleIcon = (icon: { path: string; hex: string; title: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    className="w-full h-full"
    fill={`#${icon.hex}`}
  >
    <title>{icon.title}</title>
    <path d={icon.path} />
  </svg>
);

const BRANDS: Brand[] = [
  // ── Available in simple-icons ────────────────────────────────────────
  { searchName: "Redragon", label: "ريد دراجون", logo: renderSimpleIcon(siRedragon) },
  { searchName: "Razer", label: "ريزر", logo: renderSimpleIcon(siRazer) },
  { searchName: "HyperX", label: "هايبر إكس", logo: renderSimpleIcon(siHyperx) },
  { searchName: "Dell", label: "ديل", logo: renderSimpleIcon(siDell) },
  { searchName: "MSI", label: "MSI", logo: renderSimpleIcon(siMsi) },
  { searchName: "ASUS", label: "أسوس", logo: renderSimpleIcon(siAsus) },
  { searchName: "Lenovo", label: "لينوفو", logo: renderSimpleIcon(siLenovo) },

  // ── NOT in simple-icons — use file paths ─────────────────────────────
  // 👇 Place the downloaded SVGs in `public/brands/` as shown below.
  { searchName: "Fantech", label: "فانتك", logo: "/brands/fantech.svg", alt: "Fantech" },
  { searchName: "Attack Shark", label: "أتاك شارك", logo: "/brands/attack-shark.svg", alt: "Attack Shark" },
  { searchName: "Havit", label: "هافيت", logo: "/brands/havit.svg", alt: "Havit" },
  { searchName: "A4Tech", label: "A4 تك", logo: "/brands/a4tech.svg", alt: "A4Tech" },
  { searchName: "Netac", label: "نيتاك", logo: "/brands/netac.svg", alt: "Netac" },
];

/* ─────────────────────────── Brand card ──────────────────────────── */

interface BrandCardProps {
  brand: Brand;
  onSelect: (brand: Brand) => void;
  /** Duplicated clone used by the mobile marquee → hidden from a11y tree */
  clone?: boolean;
}

function BrandCard({ brand, onSelect, clone = false }: BrandCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(brand)}
      aria-label={`بحث عن منتجات ${brand.label ?? brand.searchName}`}
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
      className="group relative flex w-[92px] shrink-0 select-none flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg md:w-auto md:p-4 md:hover:-translate-y-1"
    >
      <div className="relative flex h-14 w-full items-center justify-center md:h-16">
        {typeof brand.logo === "string" ? (
          <Image
            src={brand.logo}
            alt={brand.alt ?? brand.searchName}
            fill
            sizes="120px"
            className="object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">
            {brand.logo}
          </div>
        )}
      </div>

      {brand.label && (
        <span className="text-[11px] font-semibold text-gray-600 transition-colors group-hover:text-blue-600 md:text-xs">
          {brand.label}
        </span>
      )}
    </button>
  );
}

/* ───────────────────── Mobile: auto-scrolling marquee ─────────────── */

/** Auto-scroll speed in pixels per second */
const MARQUEE_SPEED = 45;
/** Delay before the auto-scroll resumes after the user lifts their finger */
const RESUME_DELAY = 1500;

function BrandMarquee({
  brands,
  onSelect,
}: {
  brands: Brand[];
  onSelect: (brand: Brand) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pause = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    pausedRef.current = true;
  }, []);

  const scheduleResume = useCallback((delay = 0) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
      resumeTimer.current = null;
    }, delay);
  }, []);

  /* Auto-scroll loop */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);

      const dt = Math.min(now - last, 64); // clamp after tab switches
      last = now;

      // Hidden (desktop layout) → nothing to animate
      if (el.clientWidth === 0) return;

      const first = el.children[0] as HTMLElement | undefined;
      const second = el.children[brands.length] as HTMLElement | undefined;
      if (!first || !second) return;

      // Exact width of one full copy of the list (including the gap)
      const loopWidth = second.offsetLeft - first.offsetLeft;
      if (loopWidth <= 0) return;

      if (!pausedRef.current) {
        el.scrollLeft += (MARQUEE_SPEED * dt) / 1000;
      }

      // Seamless wrap: the two copies are identical, so the jump is invisible
      if (el.scrollLeft >= loopWidth) {
        el.scrollLeft -= loopWidth;
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [brands.length]);

  /* Pause on touch / hover, resume afterwards */
  const handlePointerDown = () => pause();

  const handlePointerUp = (e: React.PointerEvent) => {
    // Touch → wait a bit so the native momentum scroll finishes first
    scheduleResume(e.pointerType === "mouse" ? 0 : RESUME_DELAY);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    // Only for mouse — touch fires pointerleave right after pointerup
    if (e.pointerType === "mouse") scheduleResume(0);
  };

  return (
    <div
      ref={scrollRef}
      dir="ltr"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => scheduleResume(RESUME_DELAY)}
      onPointerLeave={handlePointerLeave}
      className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {[...brands, ...brands].map((brand, i) => (
        <BrandCard
          key={`${brand.searchName}-${i}`}
          brand={brand}
          onSelect={onSelect}
          clone={i >= brands.length}
        />
      ))}
    </div>
  );
}

/* ───────────────────────────── Section ───────────────────────────── */

export default function BrandsSection() {
  const router = useRouter();

  const handleBrandClick = useCallback(
    (brand: Brand) => {
      router.push(`/search/${encodeURIComponent(brand.searchName)}`);
    },
    [router]
  );

  return (
    <section className="my-10">
      {/* Header — matches your existing style */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
          <Layers
            className="w-7 h-7 md:w-9 md:h-9"
            style={{ color: "rgba(34,82,154,1)" }}
          />
        </div>
        <div>
          <h2
            className="md:text-[42px] text-[28px] font-extrabold tracking-tight leading-tight"
            style={{ color: "rgba(34,82,154,1)" }}
          >
            فئات
          </h2>
          <span
            className="text-[16px] md:text-[18px] font-medium block mt-1"
            style={{ color: "rgba(34,82,154,0.8)" }}
          >
            تصفح حسب الماركة
          </span>
        </div>
      </div>

      {/* 📱 Mobile: auto-scrolling marquee (pause + swipe) */}
      <div className="md:hidden">
        <BrandMarquee brands={BRANDS} onSelect={handleBrandClick} />
      </div>

      {/* 💻 Desktop / laptop: the original grid */}
      <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {BRANDS.map((brand) => (
          <BrandCard
            key={brand.searchName}
            brand={brand}
            onSelect={handleBrandClick}
          />
        ))}
      </div>
    </section>
  );
}