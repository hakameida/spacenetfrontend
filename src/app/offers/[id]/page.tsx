'use client';

import { useGetOfferByIdQuery } from "@/data-access/api/products/products";
import { getImage } from "@/util/get-image-url";
import React, { useEffect, useState } from "react";
import { IoMdCart } from "react-icons/io";

export default function OfferPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, isLoading } = useGetOfferByIdQuery({ id });
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (data?.data?.offerById) {
      const firstImage = [
        data.data.offerById.url1,
        data.data.offerById.url2,
        data.data.offerById.image1,
        data.data.offerById.image2,
        data.data.offerById.image3,
        data.data.offerById.image4,
      ].find(Boolean);

      if (firstImage) {
        setCurrentImage(firstImage);
      }
    }
  }, [data]);

  if (!data?.data?.offerById && !isLoading) return <div className="text-center py-8">المنتج غير متوفر</div>;

  const offer = data?.data?.offerById;

  return (
    <div className="flex justify-center p-[50px]">
      <div className="w-full max-w-[1200px]">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Image Left */}
          <div className="w-full md:w-1/2 flex flex-col items-center  justify-center">
            <div className={`w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden ${isLoading && 'animate-pulse'}`}>
              {isLoading ? (
                <div className="w-full h-full bg-gray-300"></div>
              ) : currentImage ? (
                <img
                  src={getImage(currentImage, 3072)}
                  alt={offer?.name}
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

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto py-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="w-16 h-16 rounded bg-gray-300 animate-pulse" />
                ))
              ) : (
                [
                  offer?.url1,
                  offer?.url2,
                  offer?.image1,
                  offer?.image2,
                  offer?.image3,
                  offer?.image4,
                ]
                  .filter(Boolean)
                  .map((url, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 rounded cursor-pointer border-2 transition ${currentImage === url ? 'border-[rgba(34,82,154,1)]' : 'border-transparent'}`}
                      onClick={() => setCurrentImage(url)}
                    >
                      <img src={getImage(url, 200)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Info Right */}
          <div className="w-full md:w-1/2 flex flex-col justify-start space-y-6 text-center px-4" dir="rtl">
            {isLoading ? (
              <div className="h-10 bg-gray-300 rounded animate-pulse w-2/3"></div>
            ) : (
              <h1 className="text-[36px] font-extrabold text-[rgba(34,82,154,1)]">{offer?.name}</h1>
            )}

            {isLoading ? (
              <div className="h-6 bg-gray-300 rounded animate-pulse w-1/3"></div>
            ) : (
              <div className="p-4 border-[3px] border-dashed border-[rgba(34,82,154,1)] bg-[rgba(34,82,154,0.05)] rounded-lg">
                <p className="text-[20px] font-semibold text-gray-900 leading-loose">
                <p className="text-[24px] font-bold text-[rgba(34,82,154,1)]">السعرالقديم:</p>
                <p className="text-[42px] font-black line-through" style={{ color: 'rgba(255,15,27,1)' }}>
                {offer?.oldprice} $
              </p>
              <p className="text-[24px] font-bold text-[rgba(34,82,154,1)]">السعر:</p>
              <p className="text-[42px] font-black" style={{ color: 'rgba(255,15,27,1)' }}>
                {offer?.price} $
              </p>
              </p>
              </div>
            )}

            {/* {isLoading ? (
              <div className="h-12 bg-gray-300 rounded animate-pulse w-1/2"></div>
            ) : (
             
            )} */}

            {isLoading ? (
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded animate-pulse w-1/4"></div>
                <div className="h-20 bg-gray-300 rounded animate-pulse w-full"></div>
              </div>
            ) : offer?.description && (
              <div>
                <div className="p-4 border-[3px] border-dashed border-[rgba(34,82,154,1)] bg-[rgba(34,82,154,0.05)] rounded-lg">
                <p className="text-[20px] font-semibold text-gray-900 leading-loose">
                <p className="text-[24px] font-bold text-[rgba(34,82,154,1)] mb-2">الوصف:</p>
                <p className="text-[20px] leading-[1.8] text-gray-800 font-medium whitespace-pre-line">{offer.description}</p>
                </p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="h-14 w-[220px] bg-gray-300 rounded animate-pulse"></div>
            ) : (
              <div className="pt-4">
                <a href="http://wa.me/963956958013" target="_blank" rel="noopener noreferrer">
                  <button className="w-[220px] rounded p-4 bg-[rgba(34,82,154,1)] hover:bg-blue-800 transition text-white flex items-center justify-center gap-2 text-[18px] font-semibold">
                    اطلبه الآن عل الواتس اب<IoMdCart />
                  </button>
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
