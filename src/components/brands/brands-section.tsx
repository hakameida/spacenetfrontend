// components/brands/brands-section.tsx
"use client";

import React from "react";
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
  {
    searchName: "Redragon",
    label: "ريد دراجون",
    logo: renderSimpleIcon(siRedragon),
  },
  {
    searchName: "Razer",
    label: "ريزر",
    logo: renderSimpleIcon(siRazer),
  },
  
  {
    searchName: "HyperX",
    label: "هايبر إكس",
    logo: renderSimpleIcon(siHyperx),
  },
  {
    searchName: "Dell",
    label: "ديل",
    logo: renderSimpleIcon(siDell),
  },
  {
    searchName: "MSI",
    label: "MSI",
    logo: renderSimpleIcon(siMsi),
  },
  {
    searchName: "ASUS",
    label: "أسوس",
    logo: renderSimpleIcon(siAsus),
  },
  {
    searchName: "Lenovo",
    label: "لينوفو",
    logo: renderSimpleIcon(siLenovo),
  },

  // ── NOT in simple-icons — use file paths ─────────────────────────────
  // 👇 Place the downloaded SVGs in `public/brands/` as shown below.
  //    (See the instructions below for where to get them.)
  {
    searchName: "Fantech",
    label: "فانتك",
    logo: "/brands/fantech.svg",
    alt: "Fantech",
  },
  {
    searchName: "Attack Shark",
    label: "أتاك شارك",
    logo: "/brands/attack-shark.svg",
    alt: "Attack Shark",
  },
  {
    searchName: "Havit",
    label: "هافيت",
    logo: "/brands/havit.svg",
    alt: "Havit",
  },
  {
    searchName: "A4Tech",
    label: "A4 تك",
    logo: "/brands/a4tech.svg",
    alt: "A4Tech",
  },
  {
    searchName: "Netac",
    label: "نيتاك",
    logo: "/brands/netac.svg",
    alt: "Netac",
  },
];

export default function BrandsSection() {
  const router = useRouter();

  const handleBrandClick = (brand: Brand) => {
    router.push(`/search/${encodeURIComponent(brand.searchName)}`);
  };

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

      {/* Brands grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {BRANDS.map((brand) => (
          <button
            key={brand.searchName}
            onClick={() => handleBrandClick(brand)}
            aria-label={`بحث عن منتجات ${brand.label ?? brand.searchName}`}
            className="group relative flex flex-col items-center justify-center gap-2 p-3 md:p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative w-full h-14 md:h-16 flex items-center justify-center">
              {typeof brand.logo === "string" ? (
                <Image
                  src={brand.logo}
                  alt={brand.alt ?? brand.searchName}
                  fill
                  sizes="120px"
                  className="object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  {brand.logo}
                </div>
              )}
            </div>
            {brand.label && (
              <span className="text-[11px] md:text-xs font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">
                {brand.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}