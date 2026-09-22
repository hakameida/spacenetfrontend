// app/laptops/[id]/page.tsx
"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetLaptopByIdQuery, useGetLaptopsListQuery } from "@/data-access/api/laptop";
import { useAppSelector } from "@/store";
import { selectLaptopListList } from "@/data-access/slices/product-list";
import { IoMdCart, IoMdShare } from "react-icons/io";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getImage } from "@/util/get-image-url";
import CardProduct from "@/components/card/card-product";

// ---- Zoom constants ----
const ZOOM_LEVEL = 2.5;   // how much the lens magnifies
const LENS_SIZE = 170;    // lens diameter in px

// Helper to format price in SYP
const formatPriceInSYP = (price: string, dollar: number) => {
  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) return "0";
  const dollarPrice = dollar > 0 ? dollar : 1;
  return Math.floor(priceNum * dollarPrice).toLocaleString();
};

// Helper to format price in USD
const formatPriceInUSD = (price: string) => {
  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) return "0";
  return priceNum.toFixed(2);
};

// Helper to get Arabic age display
const getAgeInArabic = (age: string | undefined): string => {
  if (!age) return "";
  switch (age.toLowerCase()) {
    case 'jdyd':
      return 'جديد';
    case 'used':
      return 'مستعمل';
    case 'openbox':
      return 'أوبن بوكس';
    default:
      return age;
  }
};

// Helper to calculate discount percent
const getDiscountPercent = (originalPrice: string, discountPrice: string) => {
  if (!originalPrice || parseFloat(originalPrice) === 0) return 0;
  return Math.floor(((parseFloat(originalPrice) - parseFloat(discountPrice)) / parseFloat(originalPrice)) * 100);
};

// Helper to extract brand from name
const extractBrand = (name: string): string => {
  if (!name) return "";
  const firstWord = name.split(' ')[0];
  return firstWord;
};

// Helper to extract CPU series
const extractCpuSeries = (cpu: string): string => {
  if (!cpu) return "";
  const cpuLower = cpu.toLowerCase();
  if (cpuLower.includes('intel')) {
    if (cpuLower.includes('i3')) return 'Intel Core i3';
    if (cpuLower.includes('i5')) return 'Intel Core i5';
    if (cpuLower.includes('i7')) return 'Intel Core i7';
    if (cpuLower.includes('i9')) return 'Intel Core i9';
    return 'Intel';
  }
  if (cpuLower.includes('amd') || cpuLower.includes('ryzen')) {
    if (cpuLower.includes('ryzen 3')) return 'AMD Ryzen 3';
    if (cpuLower.includes('ryzen 5')) return 'AMD Ryzen 5';
    if (cpuLower.includes('ryzen 7')) return 'AMD Ryzen 7';
    if (cpuLower.includes('ryzen 9')) return 'AMD Ryzen 9';
    return 'AMD';
  }
  return '';
};

// Helper to extract GPU series
const extractGpuSeries = (gpu: string): string => {
  if (!gpu) return "";
  const gpuLower = gpu.toLowerCase();
  if (gpuLower.includes('rtx')) {
    if (gpuLower.includes('5050')) return 'RTX 50 Series';
    if (gpuLower.includes('5060')) return 'RTX 50 Series';
    if (gpuLower.includes('4050')) return 'RTX 40 Series';
    if (gpuLower.includes('4060')) return 'RTX 40 Series';
    if (gpuLower.includes('3050')) return 'RTX 30 Series';
    if (gpuLower.includes('3060')) return 'RTX 30 Series';
    return 'RTX';
  }
  if (gpuLower.includes('gtx')) return 'GTX';
  return '';
};

export default function LaptopDetailsPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useGetLaptopByIdQuery({ id: params.id });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState("");

  // Swipe state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // ---- Zoom state ----
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgBounds, setImgBounds] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Get all laptops for similar products
  const { isLoading: isListLoading } = useGetLaptopsListQuery({ status: true });
  const laptopListRaw = useAppSelector(selectLaptopListList);
  const laptopList: any[] = Array.isArray(laptopListRaw) ? laptopListRaw : [];

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollarPrice ?? 0);
    }
  }, [dollarData]);

  useEffect(() => {
    const laptop = data?.data?.laptopById;
    if (laptop) {
      const firstImage = [
        laptop.url1, laptop.url2, laptop.url3, laptop.url4, laptop.url5,
        laptop.image1, laptop.image2, laptop.image3, laptop.image4, laptop.image5
      ].find(Boolean);
      if (firstImage) setCurrentImage(firstImage);
    }
  }, [data]);

  const laptop = data?.data?.laptopById;

  // Get all images array
  const allImages = [
    laptop?.url1, laptop?.url2, laptop?.url3, laptop?.url4, laptop?.url5,
    laptop?.image1, laptop?.image2, laptop?.image3, laptop?.image4, laptop?.image5
  ].filter(Boolean);

  // Calculate discount
  const discountPercent = laptop?.discount ? getDiscountPercent(laptop.price, laptop.discount) : 0;
  const hasDiscount = discountPercent > 0;

  // ---- Zoom: measure the actual rendered image bounds inside the container ----
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

  // Re-measure when image changes or viewport changes
  useEffect(() => {
    measureImage();
    window.addEventListener("resize", measureImage);
    window.addEventListener("scroll", measureImage, true);
    return () => {
      window.removeEventListener("resize", measureImage);
      window.removeEventListener("scroll", measureImage, true);
    };
  }, [currentImage]);

  // ---- Zoom: pointer position → lens position ----
  const updateZoomAt = (clientX: number, clientY: number, container: HTMLElement) => {
    if (imgBounds.w === 0 || imgBounds.h === 0) {
      setZoomActive(false);
      return;
    }
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Only activate when over the actual rendered image
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

  // Find similar products
  const similarProducts = useMemo(() => {
    if (!laptop || laptopList.length === 0) return [];

    const currentPrice = parseFloat(laptop.price) || 0;
    const currentBrand = extractBrand(laptop.name);
    const currentCpu = extractCpuSeries(laptop.cpu);
    const currentGpu = extractGpuSeries(laptop.gpu);
    const currentRam = laptop.ram || '';

    const scored = laptopList
      .filter((item) => item.id !== laptop.id)
      .map((item) => {
        let score = 0;
        const itemPrice = parseFloat(item.price) || 0;
        const itemBrand = extractBrand(item.name);
        const itemCpu = extractCpuSeries(item.cpu);
        const itemGpu = extractGpuSeries(item.gpu);
        const itemRam = item.ram || '';

        if (currentBrand && itemBrand === currentBrand) score += 50;
        if (currentCpu && itemCpu === currentCpu) score += 30;
        if (currentGpu && itemGpu === currentGpu) score += 30;
        if (currentRam && itemRam === currentRam) score += 20;

        const priceDiff = Math.abs(currentPrice - itemPrice);
        if (currentPrice > 0 && priceDiff <= 200) score += 25;
        if (currentPrice > 0 && priceDiff <= 50) score += 15;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return scored;
  }, [laptop, laptopList]);

  // Handle swipe gestures (RTL: left swipe → next, right swipe → prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const currentIndex = allImages.findIndex(img => img === currentImage);

    if (isLeftSwipe && currentIndex < allImages.length - 1) {
      setCurrentImage(allImages[currentIndex + 1]);
    }

    if (isRightSwipe && currentIndex > 0) {
      setCurrentImage(allImages[currentIndex - 1]);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextImage = () => {
    const currentIndex = allImages.findIndex(img => img === currentImage);
    if (currentIndex < allImages.length - 1) {
      setCurrentImage(allImages[currentIndex + 1]);
    }
  };

  const prevImage = () => {
    const currentIndex = allImages.findIndex(img => img === currentImage);
    if (currentIndex > 0) {
      setCurrentImage(allImages[currentIndex - 1]);
    }
  };

  // Build specs text for sharing/whatsapp
  const buildSpecsText = () => {
    if (!laptop) return "";
    const specsList: string[] = [];
    if (laptop.cpu) specsList.push(`• المعالج: ${laptop.cpu}`);
    if (laptop.gpu) specsList.push(`• كرت الشاشة: ${laptop.gpu}`);
    if (laptop.ram) specsList.push(`• الرام: ${laptop.ram}`);
    if (laptop.hard) specsList.push(`• التخزين: ${laptop.hard}`);
    if (laptop.screen) specsList.push(`• الشاشة: ${laptop.screen}`);
    if (laptop.color) specsList.push(`• اللون: ${laptop.color}`);
    if (laptop.os) specsList.push(`• نظام التشغيل: ${laptop.os}`);

    if (laptop.dynamicSpecs) {
      laptop.dynamicSpecs.forEach((spec: { key: string; value: string }) => {
        specsList.push(`• ${spec.key}: ${spec.value}`);
      });
    }

    return specsList.length > 0 ? `\n\n*المواصفات:*\n${specsList.join('\n')}` : '';
  };

  // Build warranty text
  const buildWarrantyText = () => {
    if (!laptop) return "";

    if (laptop.age?.toLowerCase() === 'jdyd') {
      return '\n\n*الضمان والهدايا (جديد):*\n• كفالة هاردوير: 3 شهور\n• كفالة سوفتوير: 6 شهور\n• الهدايا: حقيبة + ماوس + ستاند معدني + ماوس باد';
    } else if (laptop.age?.toLowerCase() === 'used' || laptop.age?.toLowerCase() === 'openbox') {
      return `\n\n*الضمان والهدايا (${laptop.age?.toLowerCase() === 'used' ? 'مستعمل' : 'أوبن بوكس'}):*\n• كفالة هاردوير: شهر واحد\n• كفالة سوفتوير: 3 شهور\n• الهدايا: حقيبة + ماوس + ماوس باد`;
    }
    return '';
  };

  // Share function
  const handleShare = async () => {
    if (!laptop) return;

    const specsText = buildSpecsText();
    const warrantyText = buildWarrantyText();

    let shareText = `💻 *${laptop.name}*\n\n💰 السعر: $${formatPriceInUSD(laptop.discount || laptop.price)}`;
    if (hasDiscount) {
      shareText += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(laptop.price)})`;
    }
    shareText += `\n📦 الحالة: ${getAgeInArabic(laptop.age)}${specsText}${warrantyText}\n\n🔗 الرابط:`;
    const shareUrl = `${window.location.origin}/laptops/${params.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: laptop.name,
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

  // WhatsApp order function
  const handleWhatsAppOrder = () => {
    if (!laptop) return;

    const specsText = buildSpecsText();
    const warrantyText = buildWarrantyText();

    let message = `مرحباً، أريد الاستفسار عن هذا المنتج:\n\n`;
    message += `💻 *${laptop.name}*\n`;
    message += `💰 السعر: $${formatPriceInUSD(laptop.discount || laptop.price)}`;
    if (hasDiscount) {
      message += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(laptop.price)})`;
    }
    message += `\n📦 الحالة: ${getAgeInArabic(laptop.age)}`;
    message += specsText;
    message += warrantyText;
    message += `\n\n🔗 رابط المنتج: ${window.location.origin}/laptops/${params.id}`;

    if (currentImage) {
      message += `\n\n📸 صورة المنتج: ${currentImage}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/963956958013?text=${encodedMessage}`, '_blank');
  };

  // Helper to display age status in Arabic
  const getAgeDisplay = (age: string | undefined): { label: string; className: string } => {
    if (!age) return { label: '', className: '' };

    switch (age.toLowerCase()) {
      case 'jdyd':
        return { label: 'جديد', className: 'bg-green-100 text-green-700' };
      case 'used':
        return { label: 'مستعمل', className: 'bg-orange-100 text-orange-700' };
      case 'openbox':
        return { label: 'أوبن بوكس', className: 'bg-yellow-100 text-yellow-700' };
      default:
        return { label: age, className: 'bg-gray-100 text-gray-700' };
    }
  };

  // Get warranty info for display in table
  const getWarrantyInfo = () => {
    if (!laptop) return { hardware: '', software: '', gifts: '' };

    if (laptop.age?.toLowerCase() === 'jdyd') {
      return {
        hardware: '✨ إسبوع استبدال فوري: في حال وجود أي عذر مصنعي أو خلل بالقطع  🛠️ كفالة 6 أشهر: تشمل أي عيوب أو سوء صنع.',
        software: '💻 سنة كاملة: دعم كامل وتحديثات للسوفتوير (البرمجيات).',
        gifts: 'حقيبة + ماوس + ستاند معدني + ماوس باد+لصاقات تعريب'
      };
    } else if (laptop.age?.toLowerCase() === 'used' || laptop.age?.toLowerCase() === 'openbox') {
      return {
        hardware: '✨ إسبوع استبدال فوري: في حال وجود أي عذر مصنعي أو خلل بالقطع  🛠️ كفالةشهر: تشمل أي عيوب أو سوء صنع.',
        software: '💻 شهر كامل: دعم كامل وتحديثات للسوفتوير (البرمجيات).',
        gifts: 'حقيبة + ماوس + ماوس باد+لصاقات تعريب'
      };
    }
    return { hardware: '-', software: '-', gifts: '-' };
  };

  if (isLoading) {
    return <LaptopDetailsSkeleton />;
  }

  if (!laptop) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">عذراً!</h2>
          <p className="text-gray-600">المنتج غير متوفر أو تم حذفه</p>
          <Link href="/laptops" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى اللابتوبات
          </Link>
        </div>
      </div>
    );
  }

  const ageDisplay = getAgeDisplay(laptop.age);
  const warrantyInfo = getWarrantyInfo();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Discount Banner */}
      {hasDiscount && (
        <div className="mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-center relative">
          <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
            عرض خاص
          </div>
          <h3 className="text-white text-xl font-bold">
            🎉 خصم {discountPercent}% على {laptop.name} 🎉
          </h3>
          <p className="text-white/90 text-sm mt-1">
            وفر {Math.floor(parseFloat(laptop.price) - parseFloat(laptop.discount))}$
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left - Image Gallery with Swipe Support + Zoom */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Main Image with Swipe + Zoom */}
            <div
              ref={imageContainerRef}
              className="relative w-full h-80 md:h-96 bg-gray-50 select-none"
              style={{ cursor: zoomActive ? "crosshair" : "zoom-in" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {currentImage ? (
                <img
                  ref={imgRef}
                  src={getImage(currentImage)}
                  alt={laptop.name}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                  draggable={false}
                  onLoad={measureImage}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">لا توجد صورة</span>
                </div>
              )}

              {/* ===== Magnifier Lens ===== */}
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
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.35)",
                  }}
                />
              )}

              {/* Navigation Arrows (RTL: left = next, right = prev) */}
              {allImages.length > 1 && (
                <>
                  {/* LEFT arrow → NEXT image (RTL layout) */}
                  <button
                    onClick={nextImage}
                    disabled={allImages.findIndex(img => img === currentImage) === allImages.length - 1}
                    aria-label="التالي"
                    className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 z-20 ${
                      allImages.findIndex(img => img === currentImage) === allImages.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'opacity-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>

                  {/* RIGHT arrow → PREVIOUS image (RTL layout) */}
                  <button
                    onClick={prevImage}
                    disabled={allImages.findIndex(img => img === currentImage) === 0}
                    aria-label="السابق"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 z-20 ${
                      allImages.findIndex(img => img === currentImage) === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'opacity-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white z-20">
                  {allImages.findIndex(img => img === currentImage) + 1} / {allImages.length}
                </div>
              )}

              {/* Swipe Hint for Mobile */}
              {allImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white flex items-center gap-1 md:hidden z-20">
                  <span>👆 اسحب لليمين واليسار</span>
                </div>
              )}

              {/* Discount Badge on Image */}
              {hasDiscount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-20">
                  خصم {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails — centered */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto border-t border-gray-100 scrollbar-hide justify-center">
                {allImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(url!)}
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

        {/* Right - Product Info */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {laptop.name}
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
                      {formatPriceInSYP(laptop.price, dollar)} ل.س
                    </p>
                  )}
                  <p className="text-2xl md:text-3xl font-bold text-red-600">
                    {formatPriceInSYP(laptop.discount || laptop.price, dollar)} <span className="text-sm">ل.س</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">السعر بالدولار</span>
                  {hasDiscount && (
                    <p className="text-xs text-gray-500 line-through mt-1">
                      ${formatPriceInUSD(laptop.price)}
                    </p>
                  )}
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    ${formatPriceInUSD(laptop.discount || laptop.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {laptop.cpu && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">المعالج</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{laptop.cpu}</p>
                </div>
              )}
              {laptop.gpu && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">كرت الشاشة</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{laptop.gpu}</p>
                </div>
              )}
              {laptop.ram && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">الرام</p>
                  <p className="text-sm font-medium text-gray-800">{laptop.ram}</p>
                </div>
              )}
              {laptop.hard && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">التخزين</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{laptop.hard}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
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
                    <td className="py-3 px-4 text-gray-600">{laptop.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الحالة</td>
                    <td className="py-3 px-4 text-gray-600">{getAgeInArabic(laptop.age)}</td>
                  </tr>

                  {/* Discount row */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الخصم</td>
                    <td className="py-3 px-4 text-gray-600">
                      {hasDiscount ? (
                        <span className="text-red-600 font-bold">
                          خصم {discountPercent}% - وفر {Math.floor(parseFloat(laptop.price) - parseFloat(laptop.discount))}$
                        </span>
                      ) : (
                        <span className="text-gray-500">لا يوجد خصم</span>
                      )}
                    </td>
                  </tr>

                  {laptop.cpu && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">المعالج (CPU)</td>
                      <td className="py-3 px-4 text-gray-600">{laptop.cpu}</td>
                    </tr>
                  )}
                  {laptop.gpu && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">كرت الشاشة (GPU)</td>
                      <td className="py-3 px-4 text-gray-600">{laptop.gpu}</td>
                    </tr>
                  )}
                  {laptop.ram && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الذاكرة (RAM)</td>
                      <td className="py-3 px-4 text-gray-600">{laptop.ram}</td>
                    </tr>
                  )}
                  {laptop.hard && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">التخزين (Storage)</td>
                      <td className="py-3 px-4 text-gray-600">{laptop.hard}</td>
                    </tr>
                  )}
                  {laptop.screen && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الشاشة (Screen)</td>
                      <td className="py-3 px-4 text-gray-600">{laptop.screen}</td>
                    </tr>
                  )}
                  {laptop.color && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">اللون (Color)</td>
                      <td className="py-3 px-4 text-gray-600">{laptop.color}</td>
                    </tr>
                  )}
                  {laptop.os && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">نظام التشغيل (OS)</td>
                      <td className="py-3 px-4 text-gray-600">{laptop.os}</td>
                    </tr>
                  )}

                  {laptop.dynamicSpecs && laptop.dynamicSpecs.map((spec: { key: string; value: string }, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">{spec.key}</td>
                      <td className="py-3 px-4 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}

                  <tr className="border-b border-gray-100 bg-green-50/30">
                    <td className="py-3 px-4 bg-green-50 font-semibold text-gray-700">🎁 كفالة هاردوير</td>
                    <td className="py-3 px-4 text-gray-600">{warrantyInfo.hardware}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-green-50/30">
                    <td className="py-3 px-4 bg-green-50 font-semibold text-gray-700">💻 كفالة سوفتوير</td>
                    <td className="py-3 px-4 text-gray-600">{warrantyInfo.software}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-green-50/30">
                    <td className="py-3 px-4 bg-green-50 font-semibold text-gray-700">🎁 الهدايا</td>
                    <td className="py-3 px-4 text-gray-600">{warrantyInfo.gifts}</td>
                  </tr>
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
                {laptop.description || "لا يوجد وصف لهذا المنتج"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ SIMILAR PRODUCTS SECTION ============ */}
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
                <CardProduct
                  key={product.id}
                  height="160px"
                  rounded="10px"
                  width="100%"
                  image={productImage}
                  title={product.name || ""}
                  price={product.price || "0"}
                  discount={product.discount || ""}
                  description={product.description || ""}
                  dollarPrice={dollar}
                  icons={true}
                  id={product.id || ""}
                  age={product.age || ""}
                  cpu={product.cpu || ""}
                  gpu={product.gpu || ""}
                  ram={product.ram || ""}
                  storage={product.hard || ""}
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

// Skeleton Loader Component
function LaptopDetailsSkeleton() {
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

      <div className="mt-12">
        <Skeleton variant="text" width="200px" height={32} className="mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {Array.from(new Array(6)).map((_, index) => (
            <div key={index} className="w-full">
              <Skeleton variant="rounded" width="100%" height={160} />
              <Skeleton variant="text" width="80%" className="mt-2" />
              <Skeleton variant="text" width="50%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}