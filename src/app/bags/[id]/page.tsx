"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetBagByIdQuery, useGetBagsListQuery } from "@/data-access/api/bag";
import { useAppSelector } from "@/store";
import { selectBagListList } from "@/data-access/slices/bag-list";
import { IoMdCart, IoMdShare } from "react-icons/io";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Shield } from "lucide-react";
import { getImage } from "@/util/get-image-url";
import CardBag from "@/feature/card-bag";

const formatPriceInSYP = (price: string, dollar: number) => {
  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) return "0";
  const dollarPrice = dollar > 0 ? dollar : 1;
  return Math.floor(priceNum * dollarPrice).toLocaleString();
};

const formatPriceInUSD = (price: string) => {
  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) return "0";
  return priceNum.toFixed(1);
};

const getAgeInArabic = (age: string | undefined): string => {
  if (!age) return "";
  switch (age.toLowerCase()) {
    case 'jdyd': return 'جديد';
    case 'used': return 'مستعمل';
    case 'openbox': return 'أوبن بوكس';
    default: return age;
  }
};

const getDiscountPercent = (originalPrice: string, discountPrice: string) => {
  if (!originalPrice || parseFloat(originalPrice) === 0) return 0;
  return Math.floor(((parseFloat(originalPrice) - parseFloat(discountPrice)) / parseFloat(originalPrice)) * 100);
};

const ZOOM_LEVEL = 2.5;
const LENS_SIZE = 170;

export default function BagDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useGetBagByIdQuery({ id: params.id });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>("");

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgBounds, setImgBounds] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const { isLoading: isListLoading } = useGetBagsListQuery({ status: true });
  const bagListRaw = useAppSelector(selectBagListList);
  const bagList: any[] = Array.isArray(bagListRaw) ? bagListRaw : [];

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollarPrice ?? 0);
    }
  }, [dollarData]);

  useEffect(() => {
    const bag = data;
    if (bag) {
      const firstImage = [
        bag.url1, bag.url2, bag.url3, bag.url4, bag.url5,
        bag.image1, bag.image2, bag.image3, bag.image4, bag.image5
      ].find(Boolean);
      if (firstImage) setCurrentImage(firstImage);
    }
  }, [data]);

  const bag = data;

  const allImages: string[] = [
    bag?.url1, bag?.url2, bag?.url3, bag?.url4, bag?.url5,
    bag?.image1, bag?.image2, bag?.image3, bag?.image4, bag?.image5
  ].filter((img): img is string => Boolean(img));

  const discountPercent = bag?.discount ? getDiscountPercent(bag.price, bag.discount) : 0;
  const hasDiscount = discountPercent > 0;

  const measureImage = () => {
    const img = imgRef.current;
    const container = imageContainerRef.current;
    if (!img || !container || !img.naturalWidth || !img.naturalHeight) return;

    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const style = window.getComputedStyle(img);
    const padL = parseFloat(style.paddingLeft) || 0;
    const padR = parseFloat(style.paddingRight) || 0;
    const padT = parseFloat(style.paddingTop) || 0;
    const padB = parseFloat(style.paddingBottom) || 0;

    const contentW = imgRect.width - padL - padR;
    const contentH = imgRect.height - padT - padB;
    if (contentW <= 0 || contentH <= 0) return;

    const aspect = img.naturalWidth / img.naturalHeight;
    let drawW: number, drawH: number;
    if (contentW / contentH > aspect) {
      drawH = contentH;
      drawW = drawH * aspect;
    } else {
      drawW = contentW;
      drawH = drawW / aspect;
    }

    const drawX = imgRect.left + padL + (contentW - drawW) / 2 - containerRect.left;
    const drawY = imgRect.top + padT + (contentH - drawH) / 2 - containerRect.top;

    setImgBounds({ x: drawX, y: drawY, w: drawW, h: drawH });
  };

  useEffect(() => {
    measureImage();
    window.addEventListener("resize", measureImage);
    window.addEventListener("scroll", measureImage, true);
    return () => {
      window.removeEventListener("resize", measureImage);
      window.removeEventListener("scroll", measureImage, true);
    };
  }, [currentImage]);

  const updateZoomAt = (clientX: number, clientY: number, container: HTMLElement) => {
    if (imgBounds.w === 0 || imgBounds.h === 0) {
      setZoomActive(false);
      return;
    }
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (
      x < imgBounds.x || x > imgBounds.x + imgBounds.w ||
      y < imgBounds.y || y > imgBounds.y + imgBounds.h
    ) {
      setZoomActive(false);
      return;
    }

    setZoomPos({ x, y });
    setZoomActive(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateZoomAt(e.clientX, e.clientY, e.currentTarget);
  };
  const handleMouseLeave = () => setZoomActive(false);

  const handleTouchStartZoom = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) updateZoomAt(t.clientX, t.clientY, e.currentTarget);
  };
  const handleTouchMoveZoom = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) updateZoomAt(t.clientX, t.clientY, e.currentTarget);
  };
  const handleTouchEndZoom = () => setZoomActive(false);

  const similarProducts = useMemo(() => {
    if (!bag || bagList.length === 0) return [];
    const currentPrice = parseFloat(bag.price) || 0;
    const currentMaterial = bag.material_name || '';

    const scored = bagList
      .filter((item) => item.id !== bag.id)
      .map((item) => {
        let score = 0;
        const itemPrice = parseFloat(item.price) || 0;
        const itemMaterial = item.material_name || '';

        if (currentMaterial && itemMaterial === currentMaterial) score += 50;
        const priceDiff = Math.abs(currentPrice - itemPrice);
        if (currentPrice > 0 && priceDiff <= 200) score += 25;
        if (currentPrice > 0 && priceDiff <= 50) score += 15;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return scored;
  }, [bag, bagList]);

  const nextImage = () => {
    const currentIndex = allImages.findIndex(img => img === currentImage);
    if (currentIndex < allImages.length - 1 && currentIndex >= 0) {
      const nextImg = allImages[currentIndex + 1];
      if (nextImg) setCurrentImage(nextImg);
    }
  };

  const prevImage = () => {
    const currentIndex = allImages.findIndex(img => img === currentImage);
    if (currentIndex > 0 && currentIndex < allImages.length) {
      const prevImg = allImages[currentIndex - 1];
      if (prevImg) setCurrentImage(prevImg);
    }
  };

  const buildSpecsText = () => {
    if (!bag) return "";
    const specsList: string[] = [];
    if (bag.material_name) specsList.push(`• المادة: ${bag.material_name}`);
    if (bag.modelNumber) specsList.push(`• رقم الموديل: ${bag.modelNumber}`);
    if (bag.laptopSize) specsList.push(`• مقاس اللابتوب: ${bag.laptopSize}`);
    if (bag.color) specsList.push(`• اللون: ${bag.color}`);
    if (bag.waterResistant) specsList.push(`• مقاوم للماء: نعم`);

    if (bag.dynamicSpecs) {
      bag.dynamicSpecs.forEach((spec: { key: string; value: string }) => {
        specsList.push(`• ${spec.key}: ${spec.value}`);
      });
    }

    return specsList.length > 0 ? `\n\n*المواصفات:*\n${specsList.join('\n')}` : '';
  };

  const handleShare = async () => {
    if (!bag) return;
    const specsText = buildSpecsText();
    let shareText = `🎒 *${bag.name}*\n\n💰 السعر: $${formatPriceInUSD(bag.discount || bag.price)}`;
    if (hasDiscount) {
      shareText += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(bag.price)})`;
    }
    shareText += `\n📦 الحالة: ${getAgeInArabic(bag.age)}${specsText}\n\n🔗 الرابط:`;
    const shareUrl = `${window.location.origin}/bags/${params.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: bag.name,
          text: shareText.replace(/\*/g, ''),
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(`${shareText.replace(/\*/g, '')}\n${shareUrl}`);
          alert('تم نسخ معلومات المنتج إلى الحافظة');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText.replace(/\*/g, '')}\n${shareUrl}`);
        alert('تم نسخ معلومات المنتج إلى الحافظة');
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const handleWhatsAppOrder = () => {
    if (!bag) return;
    const specsText = buildSpecsText();
    let message = `مرحباً، أريد الاستفسار عن هذا المنتج:\n\n`;
    message += `🎒 *${bag.name}*\n`;
    message += `💰 السعر: $${formatPriceInUSD(bag.discount || bag.price)}`;
    if (hasDiscount) {
      message += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(bag.price)})`;
    }
    message += `\n📦 الحالة: ${getAgeInArabic(bag.age)}`;
    message += specsText;
    message += `\n\n🔗 رابط المنتج: ${window.location.origin}/bags/${params.id}`;
    if (currentImage) {
      message += `\n\n📸 صورة المنتج: ${currentImage}`;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/963956958013?text=${encodedMessage}`, '_blank');
  };

  const getAgeDisplay = (age: string | undefined): { label: string; className: string } => {
    if (!age) return { label: '', className: '' };
    switch (age.toLowerCase()) {
      case 'jdyd': return { label: 'جديد', className: 'bg-green-100 text-green-700' };
      case 'used': return { label: 'مستعمل', className: 'bg-orange-100 text-orange-700' };
      case 'openbox': return { label: 'أوبن بوكس', className: 'bg-yellow-100 text-yellow-700' };
      default: return { label: age, className: 'bg-gray-100 text-gray-700' };
    }
  };

  if (isLoading) {
    return <BagDetailsSkeleton />;
  }

  if (!bag) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">عذراً!</h2>
          <p className="text-gray-600">المنتج غير متوفر أو تم حذفه</p>
          <Link href="/bags" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى الحقائب
          </Link>
        </div>
      </div>
    );
  }

  const ageDisplay = getAgeDisplay(bag.age);
  const currentIndex = allImages.findIndex(img => img === currentImage);
  const isAtStart = currentIndex <= 0;
  const isAtEnd = currentIndex === allImages.length - 1 || currentIndex === -1;

  return (
      <div className="container mx-auto px-4 py-8 pt-24">
        {hasDiscount && (
          <div className="mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-center relative">
            <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
              عرض خاص
            </div>
            <h3 className="text-white text-xl font-bold">
              🎉 خصم {discountPercent}% على {bag.name} 🎉
            </h3>
            <p className="text-white/90 text-sm mt-1">
              وفر {Math.floor(parseFloat(bag.price) - parseFloat(bag.discount))}$
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div
                ref={imageContainerRef}
                className="relative w-full h-80 md:h-96 bg-gray-50 select-none"
                style={{ touchAction: "none", cursor: zoomActive ? "crosshair" : "zoom-in" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStartZoom}
                onTouchMove={handleTouchMoveZoom}
                onTouchEnd={handleTouchEndZoom}
                onTouchCancel={handleTouchEndZoom}
              >
                {currentImage ? (
                  <img
                    ref={imgRef}
                    src={getImage(currentImage)}
                    alt={bag.name}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    draggable={false}
                    onLoad={measureImage}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">لا توجد صورة</span>
                  </div>
                )}

                {zoomActive && currentImage && imgBounds.w > 0 && (
                  <div
                    className="pointer-events-none absolute rounded-full border-4 border-white shadow-2xl z-30"
                    style={{
                      width: LENS_SIZE,
                      height: LENS_SIZE,
                      left: zoomPos.x - LENS_SIZE / 2,
                      top: zoomPos.y - LENS_SIZE / 2,
                      backgroundImage: `url(${getImage(currentImage)})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${imgBounds.w * ZOOM_LEVEL}px ${imgBounds.h * ZOOM_LEVEL}px`,
                      backgroundPosition: `${
                        LENS_SIZE / 2 - (zoomPos.x - imgBounds.x) * ZOOM_LEVEL
                      }px ${
                        LENS_SIZE / 2 - (zoomPos.y - imgBounds.y) * ZOOM_LEVEL
                      }px`,
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.35)",
                    }}
                  />
                )}

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={nextImage}
                      disabled={isAtEnd}
                      aria-label="التالي"
                      className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 z-20 ${
                        isAtEnd ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    <button
                      onClick={prevImage}
                      disabled={isAtStart}
                      aria-label="السابق"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 z-20 ${
                        isAtStart ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}

                {allImages.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white z-20">
                    {currentIndex + 1} / {allImages.length}
                  </div>
                )}

                {hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-20">
                    خصم {discountPercent}%
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto border-t border-gray-100 scrollbar-hide justify-center">
                  {allImages.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(url)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0
                        ${currentImage === url ? 'border-blue-600 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <img
                        src={getImage(url)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {bag.name}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${ageDisplay.className}`}>
                  {ageDisplay.label}
                </span>
                {hasDiscount && (
                  <span className="inline-block px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                    خصم {discountPercent}%
                  </span>
                )}
              </div>

              <div className={`rounded-xl p-4 mb-6 ${hasDiscount ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-sm text-gray-500">السعر بالليرة السورية</span>
                    {hasDiscount && (
                      <p className="text-xs text-gray-500 line-through mt-1">
                        {formatPriceInSYP(bag.price, dollar)} ل.س
                      </p>
                    )}
                    <p className="text-2xl md:text-3xl font-bold text-red-600">
                      {formatPriceInSYP(bag.discount || bag.price, dollar)} <span className="text-sm">ل.س</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">السعر بالدولار</span>
                    {hasDiscount && (
                      <p className="text-xs text-gray-500 line-through mt-1">
                        ${formatPriceInUSD(bag.price)}
                      </p>
                    )}
                    <p className="text-xl md:text-2xl font-bold text-green-600">
                      ${formatPriceInUSD(bag.discount || bag.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {bag.material_name && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">المادة</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{bag.material_name}</p>
                  </div>
                )}
                {bag.laptopSize && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">مقاس اللابتوب</p>
                    <p className="text-sm font-medium text-gray-800">{bag.laptopSize}</p>
                  </div>
                )}
                {bag.modelNumber && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">رقم الموديل</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{bag.modelNumber}</p>
                  </div>
                )}
                {bag.color && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">اللون</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{bag.color}</p>
                  </div>
                )}
                {bag.waterResistant && (
                  <div className="bg-blue-50 rounded-lg p-2 col-span-2">
                    <p className="text-xs text-blue-500 font-semibold flex items-center gap-1">
                      <Shield size={14} /> مقاوم للماء
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 items-stretch">
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <IoMdCart size={20} />
                  اطلب الآن
                </button>

                

                <button
                  onClick={handleShare}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl transition flex items-center justify-center"
                >
                  <IoMdShare size={22} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* المواصفات الكاملة Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <h2 className="text-xl font-bold text-blue-600">المواصفات الكاملة</h2>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 w-1/3 rounded-r-lg">الاسم</td>
                      <td className="py-3 px-4 text-gray-600">{bag.name}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الحالة</td>
                      <td className="py-3 px-4 text-gray-600">{getAgeInArabic(bag.age)}</td>
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الخصم</td>
                      <td className="py-3 px-4 text-gray-600">
                        {hasDiscount ? (
                          <span className="text-red-600 font-bold">
                            خصم {discountPercent}% - وفر {Math.floor(parseFloat(bag.price) - parseFloat(bag.discount))}$
                          </span>
                        ) : (
                          <span className="text-gray-500">لا يوجد خصم</span>
                        )}
                      </td>
                    </tr>

                    {bag.material_name && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">المادة</td>
                        <td className="py-3 px-4 text-gray-600">{bag.material_name}</td>
                      </tr>
                    )}
                    {bag.laptopSize && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">مقاس اللابتوب</td>
                        <td className="py-3 px-4 text-gray-600">{bag.laptopSize}</td>
                      </tr>
                    )}
                    {bag.modelNumber && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">رقم الموديل</td>
                        <td className="py-3 px-4 text-gray-600">{bag.modelNumber}</td>
                      </tr>
                    )}
                    {bag.color && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">اللون</td>
                        <td className="py-3 px-4 text-gray-600">{bag.color}</td>
                      </tr>
                    )}
                    {bag.waterResistant !== undefined && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">مقاوم للماء</td>
                        <td className="py-3 px-4 text-gray-600">
                          {bag.waterResistant ? '✅ نعم' : '❌ لا'}
                        </td>
                      </tr>
                    )}

                    {bag.dynamicSpecs && bag.dynamicSpecs.map((spec: { key: string; value: string }, idx: number) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">{spec.key}</td>
                        <td className="py-3 px-4 text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* الوصف Section */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <h2 className="text-xl font-bold text-blue-600">تمييزات اضافية</h2>
            </div>

            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {bag.description || "لا يوجد وصف لهذا المنتج"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS SECTION */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
                <Sparkles className="w-7 h-7 md:w-9 md:h-9 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  منتجات مشابهة
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  قد تعجبك هذه المنتجات أيضاً
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {similarProducts.map((product) => {
                const productImage = product.image || product.image1 || product.url1 || "";
                return (
                  <CardBag
                    key={product.id}
                    height="160px"
                    rounded="10px"
                    width="100%"
                    image={productImage}
                    title={product.name || ""}
                    price={product.price || "0"}
                    discount={product.discount || ""}
                    dollarPrice={dollar}
                    id={product.id || ""}
                    age={product.age || ""}
                    material_name={product.material_name || ""}
                    laptop_size={product.laptop_size || ""}
                    water_resistant={product.water_resistant || false}
                    dynamicSpecs={product.dynamicSpecs || []}
                  />
                );
              })}
            </div>
          </div>
        )}

        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    
  );
}

function BagDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <Skeleton variant="rounded" width="100%" height={400} />
        </div>
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width="30%" height={24} className="mt-2" />
            <Skeleton variant="rounded" width="100%" height={100} className="mt-4" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Skeleton variant="rounded" width="100%" height={60} />
              <Skeleton variant="rounded" width="100%" height={60} />
              <Skeleton variant="rounded" width="100%" height={60} />
              <Skeleton variant="rounded" width="100%" height={60} />
            </div>
            <Skeleton variant="rounded" width="100%" height={50} className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}