import Link from "next/link";
import React from "react";
import { getImage } from "@/util/get-image-url";

const CpuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="10" height="10" rx="1"/>
    <path d="M6 1v2M10 1v2M6 13v2M10 13v2M1 6h2M1 10h2M13 6h2M13 10h2"/>
  </svg>
);

const GpuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="12" height="8" rx="1"/>
    <path d="M6 4V3h4v1M5 8h6"/>
  </svg>
);

const RamIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="5" width="14" height="6" rx="1"/>
    <path d="M4 5V3M8 5V3M12 5V3M4 11v2M8 11v2M12 11v2"/>
  </svg>
);

const StorageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="8" cy="6" rx="6" ry="3"/>
    <path d="M2 6v4c0 1.66 2.69 3 6 3s6-1.34 6-3V6"/>
  </svg>
);

const getAgeInArabic = (age: string | undefined): string => {
  if (!age) return "";
  switch (age.toLowerCase()) {
    case 'jdyd':    return 'جديد';
    case 'used':    return 'مستعمل';
    case 'openbox': return 'أوبن بوكس';
    default:        return age;
  }
};

const getBadgeColor = (age: string | undefined): string => {
  if (!age) return "bg-gray-600";
  switch (age.toLowerCase()) {
    case 'jdyd':    return "bg-red-600";
    case 'used':    return "bg-green-600";
    case 'openbox': return "bg-blue-700";
    default:        return "bg-gray-600";
  }
};

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

const SpecItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center justify-center gap-1 text-gray-600 bg-gray-50 rounded-lg px-1.5 py-1.5 min-w-0">
    <span className="text-[10px] sm:text-[11px] font-medium leading-tight text-left break-words min-w-0">{label}</span>
    <span className="shrink-0">{icon}</span>
  </div>
);

const CardProduct = ({
  width,
  height,
  rounded,
  image,
  title,
  price,
  discount,
  dollarPrice,
  description,
  icons,
  id,
  age,
  cpu,
  gpu,
  ram,
  storage,
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
  icons?: boolean;
  id?: string;
  age?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
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

  const hasSpecs = cpu || gpu || ram || storage;

  return (
    <div className="card-product h-full flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white">
      <Link href={`/laptops/${id}`}>
        {/* Image */}
        <div className="relative bg-gray-50 flex items-center justify-center overflow-hidden" style={{ height }}>
          <img
            className="w-full h-full object-contain p-2"
            alt={`اشتر ${title} باحسن سعر من سبيس نت ستور`}
            src={getImage(image, 400)}
          />
          {ageInArabic && (
            <span className={`absolute top-2 right-2 text-white text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
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

      {/* Body */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-2">
        {/* Title */}
        <p className="font-semibold text-[13px] sm:text-[14px] md:text-[15px] leading-snug text-gray-800 line-clamp-2 mb-2 text-center">
          {title}
        </p>

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

        {/* Specs - 2 columns, CPU+GPU on row 1, RAM+Storage on row 2 */}
        {hasSpecs && (
          <div className="grid grid-cols-2 gap-1 mt-auto pt-2 border-t border-gray-100 min-w-0 overflow-hidden">
            {cpu     && <SpecItem icon={<CpuIcon />}     label={cpu} />}
            {gpu     && <SpecItem icon={<GpuIcon />}     label={gpu} />}
            {ram     && <SpecItem icon={<RamIcon />}     label={ram} />}
            {storage && <SpecItem icon={<StorageIcon />} label={storage} />}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 pb-3 pt-1.5">
        <Link href={`/laptops/${id}`}>
          <span className="inline-block w-full text-center bg-blue-900 hover:bg-blue-800 transition-colors text-white text-[11px] sm:text-[12px] font-semibold px-2 py-2 rounded-lg">
            معلومات المنتج
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CardProduct;