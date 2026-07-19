"use client";

import Link from "next/link";
import React from "react";
import { getImage } from "@/util/get-image-url";

// Helper to calculate discount percentage
const calculateDiscount = (originalPrice: string, discountedPrice: string) => {
  const original = parseFloat(originalPrice);
  const discounted = parseFloat(discountedPrice);
  if (!original || !discounted || original <= discounted) return null;
  return Math.round(((original - discounted) / original) * 100);
};

// Get discount info
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

const CardComputer = ({
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
  dynamicSpecs?: Array<{ key: string; value: string }>;
}) => {
  const ageInArabic = getAgeInArabic(age);
  const badgeColor = getBadgeColor(age);
  const discountInfo = getDiscountInfo(discount, price);

  const priceInUSD = parseFloat(price);
  const priceInSYP = !isNaN(priceInUSD) && priceInUSD > 0
    ? Math.floor(priceInUSD * dollarPrice).toLocaleString()
    : 0;

  // Get discount price in SYP if discount exists
  const discountPriceInUSD = discountInfo ? parseFloat(discountInfo.discountedPrice) : null;
  const discountPriceInSYP = discountPriceInUSD && discountPriceInUSD > 0
    ? Math.floor(discountPriceInUSD * dollarPrice).toLocaleString()
    : 0;

  // Get first 2 dynamic specs to display
  const displaySpecs = dynamicSpecs?.slice(0, 2) || [];

  return (
    <div className="card-computer h-full flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white">
      <Link href={`/computer/${id}`}>
        <div className="relative  flex items-center justify-center overflow-hidden" style={{ height }}>
          <img
            className="w-full h-full object-contain p-2"
            alt={`اشتر ${title} باحسن سعر من سبيس نت ستور`}
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
        </div>
      </Link>

      <div className="flex flex-col flex-1 px-3 pt-3 pb-2">
        <p className="font-semibold text-[13px] sm:text-[14px] md:text-[15px] leading-snug text-gray-800 line-clamp-2 mb-2 text-center">
          {title}
        </p>

        {/* Type */}
        {type_name && (
          <div className="flex justify-center mb-3">
            <span className="text-[10px] bg-purple-100 px-2 py-0.5 rounded-full text-purple-700 font-medium">
              {type_name}
            </span>
          </div>
        )}

        {/* Price */}
        {price === "0.00" || priceInUSD === 0 ? (
          <p className="text-[12px] font-bold text-blue-900 mb-2 text-center">قريبا</p>
        ) : (
          <div className="mb-2 text-center">
            {/* Original Price - Crossed out if discount exists */}
            {discountInfo && (
              <p className="text-[12px] text-gray-400 line-through">
                {priceInSYP} ل.س
              </p>
            )}
            
            {/* Discounted Price OR Regular Price */}
            <p className="text-[13px] font-bold text-red-600 leading-tight">
              {discountInfo ? discountPriceInSYP : priceInSYP} ل.س
            </p>
            
            {/* USD Price */}
            <p className="text-[18px] font-bold text-green-600 leading-tight">
              {discountInfo ? discountInfo.discountedPrice : priceInUSD.toFixed(2)}$
            </p>
            
            {/* Show original price in USD if discount exists */}
            {discountInfo && (
              <p className="text-[10px] text-gray-400 line-through">
                {priceInUSD.toFixed(2)}$
              </p>
            )}
          </div>
        )}

        {/* Dynamic Specs */}
        {displaySpecs.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mt-auto pt-2 border-t border-gray-100">
            {displaySpecs.map((spec, index) => (
              <div key={index} className="flex items-center justify-between gap-1 bg-gray-50 rounded-lg px-1.5 py-1">
                <span className="text-[9px] font-medium text-gray-500 truncate">{spec.key}:</span>
                <span className="text-[9px] font-medium text-gray-700 truncate">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-1.5">
        <Link href={`/computer/${id}`}>
          <span className="inline-block w-full text-center bg-blue-900 hover:bg-blue-800 transition-colors text-white text-[11px] sm:text-[12px] font-semibold px-2 py-2 rounded-lg">
            معلومات المنتج
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CardComputer;