// feature/card-case/index.tsx
"use client";

import Link from "next/link";
import React from "react";
import { getImage } from "@/util/get-image-url";
import { Cpu, Monitor, HardDrive, MemoryStick, Server, Zap, Box, Fan } from "lucide-react";

interface CaseItem {
  id: string;
  name: string;
  description: string;
  price: string;
  discount?: string;
  image: string;
  age?: string;
  type_name?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  motherboard?: string;
  psu?: string;
  storage?: string;
  case?: string;
  cooling?: string;
  os?: string;
  dynamicSpecs?: Array<{ key: string; value: string }>;
}

// Helper to calculate discount percentage
const calculateDiscount = (originalPrice: string, discountedPrice: string) => {
  const original = parseFloat(originalPrice);
  const discounted = parseFloat(discountedPrice);
  if (!original || !discounted || original <= discounted) return null;
  return Math.round(((original - discounted) / original) * 100);
};

const getDiscountInfo = (discount: string | undefined, price: string) => {
  if (!discount || discount === "0" || discount === "0.00") return null;
  const discountPercent = calculateDiscount(price, discount);
  if (!discountPercent || discountPercent <= 0) return null;
  return {  
    percent: discountPercent,
    originalPrice: price,
    discountedPrice: discount
  };
};

const getAgeInArabic = (age: string | undefined): string => {
  if (!age) return "";
  const ageLower = age.toLowerCase();
  if (ageLower === 'jdyd' || ageLower === 'new' || ageLower === 'جديد') return 'جديد';
  if (ageLower === 'used' || ageLower === 'مستعمل') return 'مستعمل';
  if (ageLower === 'openbox' || ageLower === 'اوبن بوكس') return 'اوبن بوكس';
  return age;
};

const getBadgeColor = (age: string | undefined): string => {
  if (!age) return "bg-gray-600";
  const ageLower = age.toLowerCase();
  if (ageLower === 'jdyd' || ageLower === 'new' || ageLower === 'جديد') return "bg-red-600";
  if (ageLower === 'used' || ageLower === 'مستعمل') return "bg-green-600";
  if (ageLower === 'openbox' || ageLower === 'اوبن بوكس') return "bg-blue-700";
  return "bg-gray-600";
};

const CardCase = ({
  width,
  height,
  rounded,
  image,
  title,
  price,
  discount,
  dollarPrice,
  description,
  id,
  age,
  type_name,
  cpu,
  gpu,
  ram,
  motherboard,
  psu,
  storage,
  case: caseName,
  cooling,
  os,
  dynamicSpecs,
}: {
  width: string;
  height: string;
  rounded: string;
  title: string;
  image: string;
  price: string;
  discount?: string;
  dollarPrice: number;
  description?: string;
  id?: string;
  age?: string;
  type_name?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  motherboard?: string;
  psu?: string;
  storage?: string;
  case?: string;
  cooling?: string;
  os?: string;
  dynamicSpecs?: Array<{ key: string; value: string }>;
}) => {
  const ageInArabic = getAgeInArabic(age);
  const badgeColor = getBadgeColor(age);
  const discountInfo = getDiscountInfo(discount, price);

  const priceInUSD = parseFloat(price);
  const priceInSYP = !isNaN(priceInUSD) && priceInUSD > 0
    ? Math.floor(priceInUSD * dollarPrice).toLocaleString()
    : 0;

  const discountPriceInUSD = discountInfo ? parseFloat(discountInfo.discountedPrice) : null;
  const discountPriceInSYP = discountPriceInUSD && discountPriceInUSD > 0
    ? Math.floor(discountPriceInUSD * dollarPrice).toLocaleString()
    : 0;

  // Get main specs to display
  const specs = [
    { key: "المعالج", value: cpu, icon: Cpu },
    { key: "كرت الشاشة", value: gpu, icon: Monitor },
    { key: "الرام", value: ram, icon: MemoryStick },
    { key: "المذربورد", value: motherboard, icon: Server },
    { key: "مزود الطاقة", value: psu, icon: Zap },
    { key: "التخزين", value: storage, icon: HardDrive },
    { key: "الكيس", value: caseName, icon: Box },
    { key: "التبريد", value: cooling, icon: Fan },
  ].filter(spec => spec.value);

  // Show first 4 specs
  const displaySpecs = specs.slice(0, 4);

  return (
    <div className="card-case h-full flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 bg-white">
      <Link href={`/computer/case/${id}`}>
        {/* Image */}
        <div className="relative flex items-center justify-center overflow-hidden" style={{ height }}>
          <img
            className="w-full h-full object-contain p-2"
            alt={`اشتر ${title} من سبيس نت ستور`}
            src={getImage(image, 400)}
          />
          {ageInArabic && (
            <span className={`absolute top-2 right-2 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md ${badgeColor}`}>
              {ageInArabic}
            </span>
          )}
          {discountInfo && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
              خصم {discountInfo.percent}%
            </span>
          )}
          {type_name && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg">
              {type_name}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-2">
        {/* Title */}
        <p className="font-semibold text-[13px] sm:text-[14px] md:text-[15px] leading-snug text-gray-800 line-clamp-2 mb-2 text-center">
          {title}
        </p>

        {/* Specs */}
        {displaySpecs.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mt-auto pt-2 border-t border-gray-100">
            {displaySpecs.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div key={index} className="flex items-center gap-1 bg-gray-50 rounded-lg px-1.5 py-1">
                  <Icon className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <span className="text-[9px] font-medium text-gray-700 truncate">{spec.value}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Price */}
        {price === "0.00" || priceInUSD === 0 ? (
          <p className="text-[12px] font-bold text-blue-900 mb-2 text-center">قريبا</p>
        ) : (
          <div className="mb-2 text-center mt-2">
            {discountInfo && (
              <p className="text-[12px] text-gray-400 line-through">
                {priceInSYP} ل.س
              </p>
            )}
            <p className="text-[13px] font-bold text-red-600 leading-tight">
              {discountInfo ? discountPriceInSYP : priceInSYP} ل.س
            </p>
            <p className="text-[18px] font-bold text-green-600 leading-tight">
              {discountInfo ? discountInfo.discountedPrice : priceInUSD.toFixed(2)}$
            </p>
            {discountInfo && (
              <p className="text-[10px] text-gray-400 line-through">
                {priceInUSD.toFixed(2)}$
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 pb-3 pt-1.5">
        <Link href={`/computer/case/${id}`}>
          <span className="inline-block w-full text-center bg-green-700 hover:bg-green-800 transition-colors text-white text-[11px] sm:text-[12px] font-semibold px-2 py-2 rounded-lg">
            معلومات الجهاز
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CardCase;