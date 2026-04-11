"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useGetOffersListQuery } from "@/data-access/api/products/products";
import Link from "next/link";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const ArrowButton = ({ direction, onClick, disabled }) => {
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
  </div>
);

function MultipleItemsOffer({ productType }) {
  const sliderRef = useRef(null);
  const { data, isLoading, error } = useGetOffersListQuery({ type: productType });
  const offers = data || [];

  const settings = {
    dots: true,
    infinite: offers.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: offers.length > 1,
    autoplaySpeed: 5000,
    speed: 500,
    pauseOnHover: true,
    adaptiveHeight: true,
    arrows: false, // We'll use custom navigation
    dotsClass: "slick-dots custom-dots",
    fade: false, // Set to true for fade effect between slides
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Smooth easing
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
    return (
      <p className="bg-white text-red-600 text-center p-6 rounded shadow hover:shadow-lg transition">
        خطأ في جلب العروض
      </p>
    );
  }

  if (offers.length === 0) {
    return (
      <p className="bg-white text-blue-700 text-center p-6 rounded select-none">
        حاليا لا يوجد عروض
      </p>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      {/* Custom Navigation Buttons */}
      {offers.length > 1 && (
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
        {offers.map((offer) => {
          // Improved image URL handling
          let imageUrl = offer.image || offer.image1;
          
          if (imageUrl) {
            if (imageUrl.startsWith("offers/") || imageUrl.startsWith("http")) {
              imageUrl = imageUrl.startsWith("http") 
                ? imageUrl 
                : `https://dockergqlserver.onrender.com/media/${imageUrl}`;
            }
          }

          return (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}`}
              className="block bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              passHref
            >
              <div className="flex flex-col">
                {/* Image Container - Fixed height instead of aspect ratio to prevent cropping */}
                <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={offer.name || "Offer image"}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/fallback-image.jpg"; // Add a fallback image
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4 md:p-6 text-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {offer.name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-3 mt-2">
                    {offer.oldprice && (
                      <p className="text-lg text-red-500 font-bold line-through">
                        {offer.oldprice} $
                      </p>
                    )}
                    <p className="text-2xl text-green-600 font-bold">
                      {offer.price} $
                    </p>
                  </div>
                  
                  {/* Optional: Add a shop now button */}
                  <div className="mt-4">
                    <span className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition">
                      عرض التفاصيل
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>

      {/* Add custom styles for dots */}
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
      `}</style>
    </div>
  );
}

export default MultipleItemsOffer;