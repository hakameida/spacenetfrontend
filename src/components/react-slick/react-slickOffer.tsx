"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetOffersListQuery } from "@/data-access/api/products/products";
import Link from "next/link";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      aria-label="Next slide"
      className="flex justify-center items-center bg-[rgba(34,82,154,1)] hover:bg-blue-800 text-white rounded-full w-12 h-12 absolute left-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-300"
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <IoIosArrowForward size={24} />
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      aria-label="Previous slide"
      className="flex justify-center items-center bg-[rgba(34,82,154,1)] hover:bg-blue-800 text-white rounded-full w-12 h-12 absolute right-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-300"
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <IoIosArrowBack size={24} />
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="block bg-white rounded-lg border overflow-hidden p-4 animate-pulse">
      <div className="w-full h-60 bg-gray-300 rounded-md mb-4" />
      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4 mx-auto" />
      <div className="h-5 bg-gray-300 rounded w-1/4 mx-auto" />
    </div>
  );
}

function MultipleItemsOffer({ productType }) {
  const { data, isLoading, error } = useGetOffersListQuery({ type: productType });
  const offers = data || [];

  const settings = {
    dots: false,
    infinite: offers.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: offers.length > 1,
    speed: 600,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <p className="bg-white text-red-600 text-center p-6 rounded cursor-pointer hover:shadow-lg transition-shadow duration-300">
        خطأ في جلب العروض
      </p>
    );
  }

  if (offers.length === 0) {
    return (
      <p
        className="bg-white text-gray-500 text-center p-6 rounded cursor-default select-none"
        style={{ color: "rgba(34,82,154,1)" }}
      >
        حاليا لا يوجد عروض
      </p>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <Slider {...settings}>
        {offers.map((offer) => {
          const imageUrl =
            offer.image ||
            (offer.image1?.startsWith("offers/")
              ? `https://spacenetserver.up.railway.app/media/${offer.image1}`
              : offer.image1);

          return (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}`}
              className="block bg-white rounded-lg border duration-300 overflow-hidden"
              passHref
            >
              <div className="flex flex-col items-center p-4">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={offer.name || ""}
                    className="w-full h-60 object-cover rounded-md"
                    loading="lazy"
                  />
                )}
                <h3 className="mt-4 text-xl md:text-2xl font-semibold text-gray-900 text-center">
                  {offer.name}
                </h3>
                <p className="mt-1 text-lg text-red-600 font-bold text-center line-through">
                  {offer.oldprice} $
                </p>
                <p className="mt-1 text-lg text-red-600 font-bold text-center">
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
