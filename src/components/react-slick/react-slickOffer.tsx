"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetOffersListQuery } from "@/data-access/api/products/products";
import Link from "next/link";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const ArrowButton = ({ direction, onClick }) => {
  const isNext = direction === "next";
  const Icon = isNext ? IoIosArrowForward : IoIosArrowBack;
  const positionClass = isNext ? "left-4" : "right-4";

  return (
    <button
      aria-label={isNext ? "Next slide" : "Previous slide"}
      onClick={onClick}
      className={`absolute top-1/2 ${positionClass} -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow transition duration-300`}
    >
      <Icon size={24} />
    </button>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-lg border p-4 animate-pulse">
    <div className="w-full aspect-[4/3] bg-gray-300 rounded mb-4" />
    <div className="h-6 bg-gray-300 rounded mb-2 w-3/4 mx-auto" />
    <div className="h-5 bg-gray-300 rounded w-1/4 mx-auto" />
  </div>
);

function MultipleItemsOffer({ productType }) {
  const { data, isLoading, error } = useGetOffersListQuery({ type: productType });
  const offers = data || [];

  const settings = {
    dots: false,
    infinite: offers.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <ArrowButton direction="next" onClick={undefined} />,
    prevArrow: <ArrowButton direction="prev" onClick={undefined} />,
    autoplay: offers.length > 1,
    speed: 600,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4">
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
    <div className="max-w-2xl mx-auto px-4">
      <Slider {...settings}>
        {offers.map((offer) => {
          const imageUrl =
            offer.image ||
            (offer.image1?.startsWith("offers/")
              ? `https://dockergqlserver.onrender.com/media/${offer.image1}`
              : offer.image1);

          return (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}`}
              className="block bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition duration-300"
              passHref
            >
              <div className="flex flex-col items-center p-4">
                {imageUrl && (
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-md">
                    <img
                      src={imageUrl}
                      alt={offer.name || ""}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="mt-4 text-xl md:text-2xl font-semibold text-gray-900 text-center">
                  {offer.name}
                </h3>
                <p className="mt-1 text-lg text-red-500 font-bold text-center line-through">
                  {offer.oldprice} $
                </p>
                <p className="mt-1 text-lg text-green-600 font-bold text-center">
                  {offer.price} $
                </p>
              </div>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
}

export default MultipleItemsOffer;
