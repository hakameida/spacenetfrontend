"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductList {
  image?: string;
  title?: string;
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        left: "40px",
        display: "flex",
        background: "#ccc",
        width: "40px",
        height: "40px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        color: "black",
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        right: "40px",
        display: "flex",
        background: "#ccc",
        width: "40px",
        height: "40px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        color: "black",
        zIndex: 99999,
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
}

function MultipleItems({ ProductList }: { ProductList: ProductList[] }) {
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
  };

  return (
    <>
      <div className="slider-container">
        <Slider {...settings}>
          {ProductList?.map((productItem, key) => (
            <div key={key} className="relative bg-transparent">
              <div
                className="
                w-full
                flex
                items-center
                justify-center
                relative
                cursor-pointer
                transition
                bg-transparent
                hover:bg-[rgba(0,0,0,0.1)]
              "
                onClick={() => {
                  if (productItem.image) setPopupImage(productItem.image);
                }}
              >
                <img
                  alt={productItem.title ?? ""}
                  src={productItem.image ?? ""}
                  className="w-[400px]"
                />
                <p className="absolute top-4 right-4 md:text-[34px] text-[20px] pointer-events-none">
                  {productItem.title}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Popup modal */}
      {popupImage && (
        <div
          onClick={() => setPopupImage(null)}
          className="
            fixed
            inset-0
            bg-black bg-opacity-70
            flex
            justify-center
            items-center
            z-50
            cursor-pointer
          "
        >
          <img
            src={popupImage}
            alt="popup"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
          />
          <button
            onClick={() => setPopupImage(null)}
            className="
              absolute top-8 right-8
              text-white
              text-3xl
              font-bold
              bg-gray-800 bg-opacity-60
              rounded-full
              w-10 h-10
              flex items-center justify-center
              cursor-pointer
              hover:bg-gray-700
            "
            aria-label="Close popup"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}

export default MultipleItems;
