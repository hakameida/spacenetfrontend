"use client";
import React, { useEffect, useState } from "react";
import { useGetDollarQuery, useGetProductByIdQuery } from "@/data-access/api/products/products";
import { IoMdCart } from "react-icons/io";
import { Skeleton } from "@mui/material";
import { getImage } from "@/util/get-image-url";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductList {
  description?: string;
  discount?: string;
  id?: string;
  url1?: string;
  url2?: string;
  url3?: string;
  url4?: string;
  url5?: string;
  image1 ?: string ;
  image2 ?: string ;
  image3 ?: string ;
  image4 ?: string ;
  image5 ?: string ;
  
  name?: string;
  price?: string;
  type?: string;
  age?: string;
  arabic_info?: string;
}

function calculateDiscountedPrice(price: number, discount: number, dollar: number) {
  let discountAmount = (price * discount) / 100;
  let discountedPrice = price - discountAmount;
  return discountedPrice * dollar;
}

export const ProductById = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetProductByIdQuery({ id });
  const { data: dollarPrice } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (dollarPrice?.data?.dollarPriceByPk) {
      setDollar(dollarPrice?.data?.dollarPriceByPk?.dollarPrice ?? 0);
    }
  }, [dollarPrice]);

  useEffect(() => {
    if (data?.data?.productById) {
      // Find the first available image URL
      const firstImage = [
        data.data.productById.url1,
        data.data.productById.url2,
        data.data.productById.url3,
        data.data.productById.url4,
        data.data.productById.url5,
        data.data.productById.image1,
        data.data.productById.image2,
        data.data.productById.image3,
        data.data.productById.image4,
        data.data.productById.image5,

      ].find(url => url);
      
      if (firstImage) {
        setCurrentImage(firstImage);
      }
    }
  }, [data]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      {isLoading ? (
        Array.from(new Array(1)).map((_, index) => (
          <div className="grid grid-cols-12 gap-2" key={index}>
            <div className="md:col-span-8 col-span-12 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </div>
              <div className="">
                <Skeleton variant="rectangular" width="150px" height="40px" />
              </div>
            </div>
            <div className="md:col-span-4 col-span-12">
              <div className="w-full h-[400px] p-4 rounded-[0.5rem] bg-[rgba(0,0,0,0.1)] flex items-center justify-center">
                <Skeleton variant="rectangular" width="80%" height="100%" />
              </div>
            </div>
          </div>
        ))
      ) : data?.data?.productById ? (
        <div>
          <div className="grid grid-cols-12 gap-8">
            <div
              dir="ltr"
              className="lg:col-span-8 md:col-span-6 col-span-12 h-full flex flex-col justify-between md:p-0 p-2"
            >
              <div className="space-y-2">
                <p className="text-[28px] text-[#191919] font-bold">
                  {data.data.productById.name}
                </p>
                
                <p className="text-[20px] text-[#191919] font-[400]">
                  <span className="font-[700]">Type: </span>
                  {data.data.productById.type}
                </p>
                
                <p className="text-[24px] text-[#191919] font-bold">
                  {Number(data.data.productById.price) * dollar} S.P
                </p>
                
                {data.data.productById.discount !== "0%" && (
                  <p className="text-[16px] text-[#191919] font-[400]">
                    <span className="font-[700]">Discount: </span>
                    {data.data.productById.discount}
                  </p>
                )}
                
                <div className="mt-6">
                  <p className="text-[20px] text-[#333333] font-bold mb-2">Description:</p>
                  <div className="whitespace-pre-line text-[16px]">
                    {data.data.productById.description}
                  </div>
                </div>
                
                <div className="mt-6" dir="rtl">
                  <div className="whitespace-pre-line text-[16px]">
                    {data.data.productById.arabic_info}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a href="http://wa.me/963956958013" target="_blank">
                  <button className="w-[150px] rounded p-4 bg-[rgb(255,153,0)] cursor-pointer text-white flex items-center justify-center gap-2">
                    Order now <IoMdCart />
                  </button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 md:col-span-6 col-span-12">
              <div className="flex flex-col gap-4">
                <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  {currentImage ? (
                    <img 
                      src={getImage(currentImage, 3072)} 
                      alt={data.data.productById.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span>Loading image...</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 overflow-x-auto py-2">
                  {[
                    data.data.productById.url1,
                    data.data.productById.url2,
                    data.data.productById.url3,
                    data.data.productById.url4,
                    data.data.productById.url5,
                    data.data.productById.image1,
                    data.data.productById.image2,
                    data.data.productById.image3,
                    data.data.productById.image4,
                    data.data.productById.image5,

                  ].filter(url => url).map((url, index) => (
                    <div 
                      key={index}
                      className={`w-16 h-16 rounded cursor-pointer border-2 ${currentImage === url ? 'border-orange-500' : 'border-transparent'}`}
                      onClick={() => setCurrentImage(url)}
                    >
                      <img 
                        src={getImage(url, 200)} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">Product not found</div>
      )}
    </>
  );
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        background: "#ccc",
        width: "40px",
        height: "40px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        color: "black",
        zIndex: "999",
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
        display: "flex",
        background: "#ccc",
        width: "40px",
        height: "40px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        color: "black",
        zIndex: "999",
      }}
      onClick={onClick}
    />
  );
}

export default ProductById;