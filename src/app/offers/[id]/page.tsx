// app/offers/[id]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from "react";
import { useGetOfferByIdQuery } from "@/data-access/api/shared";
import { useGetLaptopByIdQuery } from "@/data-access/api/laptop";
import { useGetComputerByIdQuery } from "@/data-access/api/computer";
import { useGetAccessoryByIdQuery } from "@/data-access/api/accessory";
import { useGetPlayStationByIdQuery } from "@/data-access/api/playstation";
import { useGetCameraByIdQuery } from "@/data-access/api/camera";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { IoMdCart, IoMdShare } from "react-icons/io";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImage } from "@/util/get-image-url";

// Helper to format price in SYP
const formatPriceInSYP = (price: string, dollar: number) => {
  const priceNum = parseFloat(price || "0");
  if (isNaN(priceNum)) return "0";
  const dollarPrice = dollar > 0 ? dollar : 1;
  return Math.floor(priceNum * dollarPrice).toLocaleString();
};

// Helper to format price in USD
const formatPriceInUSD = (price: string) => {
  const priceNum = parseFloat(price || "0");
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

// Helper to get discount percent
const getDiscountPercent = (originalPrice: string, offerPrice: string) => {
  if (!originalPrice || parseFloat(originalPrice) === 0) return 0;
  return Math.floor(((parseFloat(originalPrice) - parseFloat(offerPrice)) / parseFloat(originalPrice)) * 100);
};

// Helper to get module name
const getModuleName = (module: string | undefined) => {
  if (!module) return '';
  switch (module.toUpperCase()) {
    case 'LAPTOP': return 'لابتوب';
    case 'COMPUTER': return 'كمبيوتر';
    case 'ACCESSORY': return 'اكسسوارات';
    case 'PLAYSTATION': return 'بلايستيشن';
    case 'CAMERA': return 'كاميرا';
    default: return '';
  }
};

// Define a type for the product
interface ProductType {
  id: string;
  name: string;
  description: string;
  price: string;
  age: string;
  url1?: string;
  url2?: string;
  url3?: string;
  url4?: string;
  url5?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image?: string;
  dynamicSpecs?: Array<{ key: string; value: string }>;
  cpu?: string;
  gpu?: string;
  ram?: string;
  hard?: string;
  screen?: string;
  color?: string;
  os?: string;
  brand?: string;
  model_number?: string;
  compatibility?: string;
  type_name?: string;
  storage?: string;
  modelNumber?: string;
  sensorType?: string;
  megapixels?: string;
  videoResolution?: string;
  lensMount?: string;
  controllerCount?: number;
  [key: string]: any;
}

export default function OfferPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Fetch offer data
  const { data: offerData, isLoading: offerLoading } = useGetOfferByIdQuery({ id });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>("");
  
  // Swipe state
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Extract offer from response
  const offer = offerData?.data?.offerById ?? offerData?.offerById ?? null;
  
  // Get productId and productModule from the offer
  const productId: string | undefined = offer?.productId;
  const productModule: string | undefined = offer?.productModule;

  // Fetch product based on module type
  const { data: laptopData, isLoading: laptopLoading } = useGetLaptopByIdQuery(
    { id: productId },
    { skip: !productId || productModule?.toUpperCase() !== 'LAPTOP' }
  );

  const { data: computerData, isLoading: computerLoading } = useGetComputerByIdQuery(
    { id: productId },
    { skip: !productId || productModule?.toUpperCase() !== 'COMPUTER' }
  );

  const { data: accessoryData, isLoading: accessoryLoading } = useGetAccessoryByIdQuery(
    { id: productId },
    { skip: !productId || productModule?.toUpperCase() !== 'ACCESSORY' }
  );

  const { data: playstationData, isLoading: playstationLoading } = useGetPlayStationByIdQuery(
    { id: productId },
    { skip: !productId || productModule?.toUpperCase() !== 'PLAYSTATION' }
  );

  const { data: cameraData, isLoading: cameraLoading } = useGetCameraByIdQuery(
    { id: productId },
    { skip: !productId || productModule?.toUpperCase() !== 'CAMERA' }
  );

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollarPrice ?? 0);
    }
  }, [dollarData]);

  // Get the correct product based on module
  let product: ProductType | null | undefined = null;
  let isLoading = false;
  
  if (productModule?.toUpperCase() === 'LAPTOP') {
    product = laptopData;
    isLoading = laptopLoading;
  } else if (productModule?.toUpperCase() === 'COMPUTER') {
    product = computerData;
    isLoading = computerLoading;
  } else if (productModule?.toUpperCase() === 'ACCESSORY') {
    product = accessoryData;
    isLoading = accessoryLoading;
  } else if (productModule?.toUpperCase() === 'PLAYSTATION') {
    product = playstationData;
    isLoading = playstationLoading;
  } else if (productModule?.toUpperCase() === 'CAMERA') {
    product = cameraData;
    isLoading = cameraLoading;
  }

  // Calculate discount - FIXED: handle undefined values
  const originalPrice = product?.price || '';
  const offerPrice = offer?.price || '';
  const discountPercent = originalPrice ? getDiscountPercent(originalPrice, offerPrice) : 0;

  // Get all images array from product
  const allImages: string[] = [
    product?.url1, product?.url2, product?.url3, product?.url4, product?.url5,
    product?.image1, product?.image2, product?.image3, product?.image4, product?.image5,
    product?.image
  ].filter((img): img is string => Boolean(img));

  useEffect(() => {
    if (allImages.length > 0 && !currentImage) {
      setCurrentImage(allImages[0]);
    }
  }, [allImages, currentImage]);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const currentIndex = allImages.findIndex(img => img === currentImage);
    if (distance > 50 && currentIndex < allImages.length - 1 && currentIndex >= 0) {
      const nextImg = allImages[currentIndex + 1];
      if (nextImg) setCurrentImage(nextImg);
    }
    if (distance < -50 && currentIndex > 0 && currentIndex < allImages.length) {
      const prevImg = allImages[currentIndex - 1];
      if (prevImg) setCurrentImage(prevImg);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

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

  // Build specs text based on product type
  const buildSpecsText = () => {
    if (!product) return "";
    const specsList: string[] = [];
    
    // Laptop specs
    if (productModule?.toUpperCase() === 'LAPTOP') {
      if (product.cpu) specsList.push(`• المعالج: ${product.cpu}`);
      if (product.gpu) specsList.push(`• كرت الشاشة: ${product.gpu}`);
      if (product.ram) specsList.push(`• الرام: ${product.ram}`);
      if (product.hard) specsList.push(`• التخزين: ${product.hard}`);
      if (product.screen) specsList.push(`• الشاشة: ${product.screen}`);
      if (product.color) specsList.push(`• اللون: ${product.color}`);
      if (product.os) specsList.push(`• نظام التشغيل: ${product.os}`);
    }
    
    // Accessory specs
    if (productModule?.toUpperCase() === 'ACCESSORY') {
      if (product.brand) specsList.push(`• الماركة: ${product.brand}`);
      if (product.model_number) specsList.push(`• رقم الموديل: ${product.model_number}`);
      if (product.compatibility) specsList.push(`• التوافق: ${product.compatibility}`);
      if (product.type_name) specsList.push(`• النوع: ${product.type_name}`);
    }
    
    // PlayStation specs
    if (productModule?.toUpperCase() === 'PLAYSTATION') {
      if (product.type_name) specsList.push(`• النوع: ${product.type_name}`);
      if (product.storage) specsList.push(`• المساحة: ${product.storage}`);
      if (product.color) specsList.push(`• اللون: ${product.color}`);
      if (product.modelNumber) specsList.push(`• رقم الموديل: ${product.modelNumber}`);
    }
    
    // Camera specs
    if (productModule?.toUpperCase() === 'CAMERA') {
      if (product.brand) specsList.push(`• الماركة: ${product.brand}`);
      if (product.type_name) specsList.push(`• النوع: ${product.type_name}`);
      if (product.megapixels) specsList.push(`• الدقة: ${product.megapixels}`);
      if (product.sensorType) specsList.push(`• نوع المستشعر: ${product.sensorType}`);
      if (product.videoResolution) specsList.push(`• دقة الفيديو: ${product.videoResolution}`);
      if (product.lensMount) specsList.push(`• نوع العدسة: ${product.lensMount}`);
    }
    
    // Computer specs
    if (productModule?.toUpperCase() === 'COMPUTER') {
      if (product.type_name) specsList.push(`• النوع: ${product.type_name}`);
    }
    
    // Dynamic specs for all types
    if (product.dynamicSpecs) {
      product.dynamicSpecs.forEach((spec: { key: string; value: string }) => {
        specsList.push(`• ${spec.key}: ${spec.value}`);
      });
    }
    
    return specsList.length > 0 ? `\n\n*المواصفات:*\n${specsList.join('\n')}` : '';
  };

  // Build warranty text (only for laptops)
  const buildWarrantyText = () => {
    if (!product || productModule?.toUpperCase() !== 'LAPTOP') return '';
    if (product.age?.toLowerCase() === 'jdyd') {
      return '\n\n*الضمان والهدايا (جديد):*\n• كفالة هاردوير: 3 شهور\n• كفالة سوفتوير: 6 شهور\n• الهدايا: حقيبة + ماوس + ستاند معدني + ماوس باد';
    } else if (product.age?.toLowerCase() === 'used' || product.age?.toLowerCase() === 'openbox') {
      return `\n\n*الضمان والهدايا (${product.age?.toLowerCase() === 'used' ? 'مستعمل' : 'أوبن بوكس'}):*\n• كفالة هاردوير: شهر واحد\n• كفالة سوفتوير: 3 شهور\n• الهدايا: حقيبة + ماوس + ماوس باد`;
    }
    return '';
  };

  const handleShare = async () => {
    if (!offer || !product) return;
    const specsText = buildSpecsText();
    const warrantyText = buildWarrantyText();
    
    let shareText = `🎉 *عرض خاص: ${product.name}* 🎉\n\n💰 السعر بعد الخصم: $${formatPriceInUSD(offerPrice)}`;
    if (discountPercent > 0 && originalPrice) {
      shareText += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(originalPrice)})`;
    }
    shareText += `\n📦 الحالة: ${getAgeInArabic(product.age)}${specsText}${warrantyText}\n\n🔗 الرابط:`;
    const shareUrl = `${window.location.origin}/offers/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: shareText.replace(/\*/g, ''), url: shareUrl });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(`${shareText.replace(/\*/g, '')}\n${shareUrl}`);
          alert('تم نسخ معلومات العرض إلى الحافظة');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText.replace(/\*/g, '')}\n${shareUrl}`);
        alert('تم نسخ معلومات العرض إلى الحافظة');
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const handleWhatsAppOrder = () => {
    if (!offer || !product) return;
    const specsText = buildSpecsText();
    const warrantyText = buildWarrantyText();
    
    let message = `مرحباً، أريد الاستفسار عن هذا العرض:\n\n`;
    message += `🎉 *عرض خاص: ${product.name}* 🎉\n`;
    message += `💰 السعر بعد الخصم: $${formatPriceInUSD(offerPrice)}\n`;
    if (discountPercent > 0 && originalPrice) {
      message += `💰 السعر القديم: $${formatPriceInUSD(originalPrice)} (خصم ${discountPercent}%)\n`;
    }
    message += `📦 الحالة: ${getAgeInArabic(product.age)}`;
    message += specsText;
    message += warrantyText;
    message += `\n\n🔗 رابط العرض: ${window.location.origin}/offers/${id}`;
    if (currentImage) {
      message += `\n\n📸 صورة المنتج: ${currentImage}`;
    }
    window.open(`https://wa.me/963956958013?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getAgeDisplay = (age: string | undefined): { label: string; className: string } => {
    if (!age) return { label: '', className: '' };
    switch (age.toLowerCase()) {
      case 'jdyd':    return { label: 'جديد',      className: 'bg-green-100 text-green-700' };
      case 'used':    return { label: 'مستعمل',    className: 'bg-orange-100 text-orange-700' };
      case 'openbox': return { label: 'أوبن بوكس', className: 'bg-yellow-100 text-yellow-700' };
      default:        return { label: age,          className: 'bg-gray-100 text-gray-700' };
    }
  };

  const getWarrantyInfo = () => {
    if (!product || productModule?.toUpperCase() !== 'LAPTOP') return { hardware: '-', software: '-', gifts: '-' };
    if (product.age?.toLowerCase() === 'jdyd') {
      return { hardware: '3 شهور', software: '6 شهور', gifts: 'حقيبة + ماوس + ستاند معدني + ماوس باد' };
    } else if (product.age?.toLowerCase() === 'used' || product.age?.toLowerCase() === 'openbox') {
      return { hardware: 'شهر واحد', software: '3 شهور', gifts: 'حقيبة + ماوس + ماوس باد' };
    }
    return { hardware: '-', software: '-', gifts: '-' };
  };

  // Loading state
  if (offerLoading || (productId && isLoading)) return <OfferSkeleton />;

  if (!offer || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-2">عذراً!</h2>
          <p className="text-gray-600">العرض أو المنتج غير متوفر</p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const ageDisplay = getAgeDisplay(product.age);
  const warrantyInfo = getWarrantyInfo();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Offer Banner */}
      <div className="mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-center relative">
        <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
          عرض خاص
        </div>
        <h3 className="text-white text-xl font-bold">
          🎉 عرض خاص: {product.name} 🎉
        </h3>
        <p className="text-white/90 text-sm mt-1">
          {getModuleName(productModule)} - خصم {discountPercent}%
        </p>
        {discountPercent > 0 && originalPrice && (
          <p className="text-white/90 text-sm mt-1">
            وفر {Math.floor(parseFloat(originalPrice) - parseFloat(offerPrice))}$
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left - Image Gallery */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div 
              ref={imageContainerRef}
              className="relative w-full h-80 md:h-96 bg-gray-50"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {currentImage ? (
                <img
                  src={getImage(currentImage)}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">لا توجد صورة</span>
                </div>
              )}
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 ${
                      allImages.findIndex(img => img === currentImage) === 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'opacity-100'
                    }`}
                    disabled={allImages.findIndex(img => img === currentImage) === 0}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all duration-300 ${
                      allImages.findIndex(img => img === currentImage) === allImages.length - 1 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'opacity-100'
                    }`}
                    disabled={allImages.findIndex(img => img === currentImage) === allImages.length - 1}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
              
              {allImages.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
                  {allImages.findIndex(img => img === currentImage) + 1} / {allImages.length}
                </div>
              )}

              {discountPercent > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  خصم {discountPercent}%
                </div>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto border-t border-gray-100 scrollbar-hide">
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

        {/* Right - Offer Info */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-block px-3 py-1 text-sm rounded-full ${ageDisplay.className}`}>
                {ageDisplay.label}
              </span>
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                {getModuleName(productModule)}
              </span>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="text-sm text-gray-500">السعر بالليرة السورية</span>
                  <p className="text-2xl md:text-3xl font-bold text-red-600">
                    {formatPriceInSYP(offerPrice, dollar)} <span className="text-sm">ل.س</span>
                  </p>
                  {discountPercent > 0 && originalPrice && (
                    <p className="text-xs text-gray-500 line-through mt-1">
                      كان: {formatPriceInSYP(originalPrice, dollar)} ل.س
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">السعر بالدولار</span>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    ${formatPriceInUSD(offerPrice)}
                  </p>
                  {discountPercent > 0 && originalPrice && (
                    <p className="text-xs text-gray-500 line-through mt-1">
                      كان: ${formatPriceInUSD(originalPrice)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Product Specs - Dynamic based on type */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Laptop specs */}
              {productModule?.toUpperCase() === 'LAPTOP' && (
                <>
                  {product.cpu && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">المعالج</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{product.cpu}</p>
                    </div>
                  )}
                  {product.gpu && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">كرت الشاشة</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{product.gpu}</p>
                    </div>
                  )}
                  {product.ram && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">الرام</p>
                      <p className="text-sm font-medium text-gray-800">{product.ram}</p>
                    </div>
                  )}
                  {product.hard && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">التخزين</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{product.hard}</p>
                    </div>
                  )}
                </>
              )}

              {/* Accessory specs */}
              {productModule?.toUpperCase() === 'ACCESSORY' && (
                <>
                  {product.brand && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">الماركة</p>
                      <p className="text-sm font-medium text-gray-800">{product.brand}</p>
                    </div>
                  )}
                  {product.type_name && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">النوع</p>
                      <p className="text-sm font-medium text-gray-800">{product.type_name}</p>
                    </div>
                  )}
                  {product.model_number && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">رقم الموديل</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{product.model_number}</p>
                    </div>
                  )}
                </>
              )}

              {/* PlayStation specs */}
              {productModule?.toUpperCase() === 'PLAYSTATION' && (
                <>
                  {product.type_name && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">النوع</p>
                      <p className="text-sm font-medium text-gray-800">{product.type_name}</p>
                    </div>
                  )}
                  {product.storage && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">المساحة</p>
                      <p className="text-sm font-medium text-gray-800">{product.storage}</p>
                    </div>
                  )}
                  {product.color && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">اللون</p>
                      <p className="text-sm font-medium text-gray-800">{product.color}</p>
                    </div>
                  )}
                </>
              )}

              {/* Camera specs */}
              {productModule?.toUpperCase() === 'CAMERA' && (
                <>
                  {product.brand && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">الماركة</p>
                      <p className="text-sm font-medium text-gray-800">{product.brand}</p>
                    </div>
                  )}
                  {product.megapixels && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">الدقة</p>
                      <p className="text-sm font-medium text-gray-800">{product.megapixels}</p>
                    </div>
                  )}
                  {product.type_name && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">النوع</p>
                      <p className="text-sm font-medium text-gray-800">{product.type_name}</p>
                    </div>
                  )}
                </>
              )}

              {/* Computer specs */}
              {productModule?.toUpperCase() === 'COMPUTER' && (
                <>
                  {product.type_name && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">النوع</p>
                      <p className="text-sm font-medium text-gray-800">{product.type_name}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <IoMdCart size={20} />
                اطلب العرض الآن
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

      {/* Full Specifications Section */}
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
                    <td className="py-3 px-4 text-gray-600">{product.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الحالة</td>
                    <td className="py-3 px-4 text-gray-600">{getAgeInArabic(product.age)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">النوع</td>
                    <td className="py-3 px-4 text-gray-600">{getModuleName(productModule)}</td>
                  </tr>
                  
                  {/* Dynamic specs based on product type */}
                  {productModule?.toUpperCase() === 'LAPTOP' && (
                    <>
                      {product.cpu && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">المعالج (CPU)</td>
                          <td className="py-3 px-4 text-gray-600">{product.cpu}</td>
                        </tr>
                      )}
                      {product.gpu && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">كرت الشاشة (GPU)</td>
                          <td className="py-3 px-4 text-gray-600">{product.gpu}</td>
                        </tr>
                      )}
                      {product.ram && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الذاكرة (RAM)</td>
                          <td className="py-3 px-4 text-gray-600">{product.ram}</td>
                        </tr>
                      )}
                      {product.hard && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">التخزين (Storage)</td>
                          <td className="py-3 px-4 text-gray-600">{product.hard}</td>
                        </tr>
                      )}
                      {product.screen && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الشاشة (Screen)</td>
                          <td className="py-3 px-4 text-gray-600">{product.screen}</td>
                        </tr>
                      )}
                      {product.color && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">اللون (Color)</td>
                          <td className="py-3 px-4 text-gray-600">{product.color}</td>
                        </tr>
                      )}
                      {product.os && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">نظام التشغيل (OS)</td>
                          <td className="py-3 px-4 text-gray-600">{product.os}</td>
                        </tr>
                      )}
                    </>
                  )}

                  {productModule?.toUpperCase() === 'ACCESSORY' && (
                    <>
                      {product.brand && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الماركة</td>
                          <td className="py-3 px-4 text-gray-600">{product.brand}</td>
                        </tr>
                      )}
                      {product.type_name && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">النوع</td>
                          <td className="py-3 px-4 text-gray-600">{product.type_name}</td>
                        </tr>
                      )}
                      {product.model_number && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">رقم الموديل</td>
                          <td className="py-3 px-4 text-gray-600">{product.model_number}</td>
                        </tr>
                      )}
                      {product.compatibility && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">التوافق</td>
                          <td className="py-3 px-4 text-gray-600">{product.compatibility}</td>
                        </tr>
                      )}
                    </>
                  )}

                  {productModule?.toUpperCase() === 'PLAYSTATION' && (
                    <>
                      {product.type_name && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">النوع</td>
                          <td className="py-3 px-4 text-gray-600">{product.type_name}</td>
                        </tr>
                      )}
                      {product.brand && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الماركة</td>
                          <td className="py-3 px-4 text-gray-600">{product.brand}</td>
                        </tr>
                      )}
                      {product.modelNumber && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">رقم الموديل</td>
                          <td className="py-3 px-4 text-gray-600">{product.modelNumber}</td>
                        </tr>
                      )}
                      {product.storage && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">المساحة</td>
                          <td className="py-3 px-4 text-gray-600">{product.storage}</td>
                        </tr>
                      )}
                      {product.color && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">اللون</td>
                          <td className="py-3 px-4 text-gray-600">{product.color}</td>
                        </tr>
                      )}
                      {product.controllerCount && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">عدد أيدي التحكم</td>
                          <td className="py-3 px-4 text-gray-600">{product.controllerCount}</td>
                        </tr>
                      )}
                    </>
                  )}

                  {productModule?.toUpperCase() === 'CAMERA' && (
                    <>
                      {product.brand && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الماركة</td>
                          <td className="py-3 px-4 text-gray-600">{product.brand}</td>
                        </tr>
                      )}
                      {product.type_name && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">النوع</td>
                          <td className="py-3 px-4 text-gray-600">{product.type_name}</td>
                        </tr>
                      )}
                      {product.modelNumber && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">رقم الموديل</td>
                          <td className="py-3 px-4 text-gray-600">{product.modelNumber}</td>
                        </tr>
                      )}
                      {product.sensorType && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">نوع المستشعر</td>
                          <td className="py-3 px-4 text-gray-600">{product.sensorType}</td>
                        </tr>
                      )}
                      {product.megapixels && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الدقة</td>
                          <td className="py-3 px-4 text-gray-600">{product.megapixels}</td>
                        </tr>
                      )}
                      {product.videoResolution && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">دقة الفيديو</td>
                          <td className="py-3 px-4 text-gray-600">{product.videoResolution}</td>
                        </tr>
                      )}
                      {product.lensMount && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">نوع العدسة</td>
                          <td className="py-3 px-4 text-gray-600">{product.lensMount}</td>
                        </tr>
                      )}
                    </>
                  )}

                  {productModule?.toUpperCase() === 'COMPUTER' && (
                    <>
                      {product.type_name && (
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">النوع</td>
                          <td className="py-3 px-4 text-gray-600">{product.type_name}</td>
                        </tr>
                      )}
                    </>
                  )}
                  
                  {/* Dynamic specs for all types */}
                  {product.dynamicSpecs && product.dynamicSpecs.map((spec: { key: string; value: string }, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">{spec.key}</td>
                      <td className="py-3 px-4 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                  
                  {/* Warranty only for laptops */}
                  {productModule?.toUpperCase() === 'LAPTOP' && (
                    <>
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
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {product.description && (
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <h2 className="text-xl font-bold text-blue-600">تمييزات اضافية</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
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
function OfferSkeleton() {
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