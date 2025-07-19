"use client";

import React, { useEffect, useState } from "react";
import { useGetDollarQuery, useGetProductByIdQuery } from "@/data-access/api/products/products";
import { IoMdCart } from "react-icons/io";
import { Skeleton } from "@mui/material";
import { getImage } from "@/util/get-image-url";

const highlightSpecs = (text: string) => {
  const specs = ["CPU", "GPU", "RAM", "HARD", "SCREEN"];
  let formatted = text;

  specs.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})(\\s*:)`, "gi");
    formatted = formatted.replace(
      regex,
      `<span class='font-bold text-[22px] text-[rgba(34,82,154,1)]'>$1$2</span>`
    );
  });

  return formatted.replace(/\n/g, "<br />");
};

export const ProductById = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetProductByIdQuery({ id });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollarPrice ?? 0);
    }
  }, [dollarData]);

  useEffect(() => {
    const product = data?.data?.productById;
    if (product) {
      const firstImage = [
        product.url1, product.url2, product.url3, product.url4, product.url5,
        product.image1, product.image2, product.image3, product.image4, product.image5
      ].find(Boolean);
      if (firstImage) setCurrentImage(firstImage);
    }
  }, [data]);

  const product = data?.data?.productById;

  return (
    <div className="flex justify-center ">
      <div className="w-full ">
        {isLoading ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <Skeleton variant="rectangular" width="100%" height="400px" />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="rectangular" width="150px" height="50px" />
            </div>
          </div>
        ) : product ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Left */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
              <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                {currentImage ? (
                  <img
                    src={getImage(currentImage, 3072)}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder-image.jpg")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span>Loading image...</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto py-4">
                {[
                  product.url1, product.url2, product.url3, product.url4, product.url5,
                  product.image1, product.image2, product.image3, product.image4, product.image5
                ]
                  .filter(Boolean)
                  .map((url, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 rounded border-2 cursor-pointer transition ${currentImage === url ? "border-[rgba(34,82,154,1)]" : "border-transparent"}`}
                      onClick={() => setCurrentImage(url!)}
                    >
                      <img src={getImage(url!, 200)} alt={`thumb-${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
              </div>
            </div>

            {/* Info Right */}
            <div className="w-full md:w-1/2 flex flex-col justify-start space-y-6 text-center px-4" dir="rtl">
              <h1 className="text-[24px] font-extrabold text-[rgba(34,82,154,1)]">{product.name}</h1>
              <div className="p-4 border-[3px] border-dashed border-[rgba(34,82,154,1)] bg-[rgba(34,82,154,0.05)] rounded-lg">
                <p className="text-[20px] font-semibold text-gray-900 leading-loose">
              <p className="text-[24px] font-bold text-[rgba(34,82,154,1)]">السعر:</p>
              <p className="text-[20px] font-black" style={{ color: 'rgba(255,15,27,1)' }}>
                {Number(product.price) * dollar} S.P
              </p>
              <p className="text-[24px] font-bold text-[rgba(34,82,154,1)]">السعر بالدولار :</p>
              <p className="text-[26px] font-black" style={{ color: 'rgba(255,15,27,1)' }}>
                {product.price} $
              </p>
              </p>
              </div>

              {product.description && (
                <div>
<div className="p-4 border-[3px] border-dashed border-[rgba(34,82,154,1)] bg-[rgba(34,82,154,0.05)] rounded-lg">
                <p className="text-[20px] font-semibold text-gray-900 leading-loose"></p>
                  <p className="text-[24px] font-bold text-[rgba(34,82,154,1)] mb-2">الوصف:</p>
                  <div
                    className="text-[20px] leading-[1.8] text-gray-800 font-medium whitespace-pre-wrap text-center"
                    dangerouslySetInnerHTML={{ __html: highlightSpecs(product.description) }}
                  />
                  </div>  
                </div>
              )}

              <div className="p-4 border-[3px] border-dashed border-[rgba(34,82,154,1)] bg-[rgba(34,82,154,0.05)] rounded-lg">
                <p className="text-[20px] font-semibold text-gray-900 leading-loose">
                  احصل عليه الآن مع الهداية بالكفالة الذهبية  
                  <br />شهر كامل هاردوير وثلاث شهور سوفتوير  
                  <br />الهداية: حقيبة + ماوس + ستاند معدني + ماوس باد
                </p>
              </div>

              {product.arabic_info && (
                <div>
                  <p className="text-[24px] font-bold text-[rgba(34,82,154,1)] mb-2">تفاصيل إضافية:</p>
                  <p className="whitespace-pre-line text-[20px] leading-9 text-gray-800 font-medium">{product.arabic_info}</p>
                </div>
              )}

              <div className=" pt-4">
                <a href="http://wa.me/963956958013" target="_blank" rel="noopener noreferrer">
                  <button className="w-[220px] rounded p-4 bg-[rgba(34,82,154,1)] hover:bg-blue-800 transition text-white flex items-center justify-center gap-2 text-[18px] text-center font-semibold">
                  اطلبه الآن عل الواتس اب<IoMdCart />
                  </button>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-lg">المنتج غير متوفر</div>
        )}
      </div>
    </div>
  );
};

export default ProductById;
