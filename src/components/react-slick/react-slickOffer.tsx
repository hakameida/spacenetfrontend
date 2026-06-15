"use client";

import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useGetOffersListQuery, type ProductModule, type Offer } from "@/data-access/api/shared";
import { useGetLaptopByIdQuery } from "@/data-access/api/laptop";
// import { useGetComputerByIdQuery } from "@/data-access/api/computer";
// import { useGetAccessoryByIdQuery } from "@/data-access/api/accessory";
import Link from "next/link";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { getImage } from "@/util/get-image-url";

interface ArrowButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ 
  direction, 
  onClick, 
  disabled = false 
}) => {
  const isNext = direction === "next";
  const Icon = isNext ? IoIosArrowForward : IoIosArrowBack;
  
  return (
    <button
      aria-label={isNext ? "Next slide" : "Previous slide"}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center 
        ${isNext ? 'right-2 md:right-4' : 'left-2 md:left-4'} 
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'} 
        text-white rounded-full shadow transition duration-300`}
    >
      <Icon size={24} />
    </button>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-lg border p-4 animate-pulse">
    <div className="w-full h-64 bg-gray-300 rounded mb-4" />
    <div className="h-6 bg-gray-300 rounded mb-2 w-3/4 mx-auto" />
    <div className="h-5 bg-gray-300 rounded w-1/4 mx-auto" />
    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className="h-10 bg-gray-300 rounded" />
      <div className="h-10 bg-gray-300 rounded" />
      <div className="h-10 bg-gray-300 rounded" />
      <div className="h-10 bg-gray-300 rounded" />
    </div>
  </div>
);

interface MultipleItemsOfferProps {
  productModule?: ProductModule;
  limit?: number;
}

const getModuleName = (module: ProductModule) => {
  switch (module) {
    case 'LAPTOP': return 'لابتوب';
    case 'COMPUTER': return 'كمبيوتر';
    case 'ACCESSORY': return 'اكسسوارات';
    case 'PLAYSTATION': return 'بلايستيشن';
    default: return '';
  }
};

const getImageUrl = (url: string) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/graphql/', '') || 'http://localhost:8000';
  if (url.startsWith('/media/')) {
    return `${baseUrl}${url}`;
  }
  return `${baseUrl}/media/${url}`;
};

// Component to fetch product and display offer card
const OfferCard = ({ offer }: { offer: Offer }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch product based on productModule from the offer
  const { data: laptopData, isLoading: laptopLoading } = useGetLaptopByIdQuery(
    { id: offer.productId },
    { skip: offer.productModule !== 'LAPTOP' || !offer.productId }
  );
  

  
  useEffect(() => {
    if (offer.productModule === 'LAPTOP' && laptopData?.data?.laptopById) {
      setProduct(laptopData.data.laptopById);
      setLoading(false);
    } 
  }, [offer.productModule, laptopData,  laptopLoading ]);
  
  const originalPrice = product?.price;
  const discountPercent = originalPrice ? Math.floor(((parseFloat(originalPrice) - parseFloat(offer.price)) / parseFloat(originalPrice)) * 100) : 0;
  const hasDiscount = discountPercent > 0;
  const imageUrl = getImage(product?.url1 || product?.image1);
  
  if (loading) {
    return (
      <div className="block bg-white rounded-xl border overflow-hidden shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-64 md:h-80 bg-gray-200 animate-pulse" />
          <div className="flex-1 p-6 md:p-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return null;
  }
  
  return (
    <Link
      href={`/offers/${offer.id}`}
      className="block bg-white rounded-xl border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-image.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">لا توجد صورة</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              خصم {discountPercent}%
            </div>
          )}
          
          {/* Module Badge */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {getModuleName(offer.productModule)}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 text-center md:text-right">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
          )}
          
          {/* Product Specifications */}
          {offer.productModule === 'LAPTOP' && (
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {product.cpu && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">المعالج</p>
                  <p className="text-xs font-medium text-gray-800 truncate">{product.cpu}</p>
                </div>
              )}
              {product.ram && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">الرام</p>
                  <p className="text-xs font-medium text-gray-800">{product.ram}</p>
                </div>
              )}
              {product.gpu && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">كرت الشاشة</p>
                  <p className="text-xs font-medium text-gray-800 truncate">{product.gpu}</p>
                </div>
              )}
              {product.hard && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">التخزين</p>
                  <p className="text-xs font-medium text-gray-800 truncate">{product.hard}</p>
                </div>
              )}
              {product.screen && (
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-xs text-gray-500">الشاشة</p>
                  <p className="text-xs font-medium text-gray-800 truncate">{product.screen}</p>
                </div>
              )}
            </div>
          )}
          
          {offer.productModule === 'COMPUTER' && product.dynamic_specs && (
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {product.dynamic_specs.slice(0, 4).map((spec: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">{spec.key}</p>
                  <p className="text-xs font-medium text-gray-800 truncate">{spec.value}</p>
                </div>
              ))}
            </div>
          )}
          
          {offer.productModule === 'ACCESSORY' && (
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {product.brand && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">الماركة</p>
                  <p className="text-xs font-medium text-gray-800 truncate">{product.brand}</p>
                </div>
              )}
              {product.model_number && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">الموديل</p>
                  <p className="text-xs font-medium text-gray-800 truncate">{product.model_number}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
            {hasDiscount && (
              <p className="text-lg text-red-500 font-bold line-through">
                {originalPrice} ل.س
              </p>
            )}
            <p className="text-3xl font-bold text-green-600">
              {offer.price} <span className="text-sm">ل.س</span>
            </p>
          </div>
          
          {hasDiscount && (
            <p className="text-sm text-green-600 mt-1">
              وفر {Math.floor(parseFloat(originalPrice) - parseFloat(offer.price))} ل.س
            </p>
          )}
          
          <div className="mt-6">
            <span className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-md group-hover:shadow-lg">
              تفاصيل العرض
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

function MultipleItemsOffer({ productModule, limit = 10 }: MultipleItemsOfferProps) {
  const sliderRef = useRef<Slider>(null);
  const { data, isLoading, error } = useGetOffersListQuery({});
  const allOffers: Offer[] = data || [];
  let filteredOffers = productModule 
    ? allOffers.filter(offer => offer.productModule === productModule)
    : allOffers;
  
  filteredOffers = filteredOffers.slice(0, limit);

  const settings: Settings = {
    dots: true,
    infinite: filteredOffers.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: filteredOffers.length > 1,
    autoplaySpeed: 5000,
    speed: 500,
    pauseOnHover: true,
    adaptiveHeight: true,
    arrows: false,
    dotsClass: "slick-dots custom-dots",
    fade: false,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    console.error("Offers error:", error);
    return (
      <p className="bg-white text-red-600 text-center p-6 rounded shadow hover:shadow-lg transition">
        خطأ في جلب العروض
      </p>
    );
  }

  if (filteredOffers.length === 0) {
    return (
      <p className="bg-white text-blue-700 text-center p-6 rounded select-none">
        حاليا لا يوجد عروض
      </p>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      {filteredOffers.length > 1 && (
        <>
          <ArrowButton 
            direction="prev" 
            onClick={handlePrev} 
          />
          <ArrowButton 
            direction="next" 
            onClick={handleNext} 
          />
        </>
      )}

      <Slider ref={sliderRef} {...settings}>
        {filteredOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </Slider>

      <style jsx global>{`
        .custom-dots {
          bottom: -30px;
        }
        .custom-dots li button:before {
          font-size: 12px;
          color: #3b82f6;
          opacity: 0.5;
        }
        .custom-dots li.slick-active button:before {
          opacity: 1;
          color: #2563eb;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default MultipleItemsOffer;