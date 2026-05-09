// app/offers/[id]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from "react";
import { useGetOfferByIdQuery } from "@/data-access/api/shared";
import { useGetLaptopByIdQuery } from "@/data-access/api/laptop";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { IoMdCart, IoMdShare } from "react-icons/io";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

// Helper to get discount percent from original product price and offer price
const getDiscountPercent = (originalPrice: string, offerPrice: string) => {
  if (!originalPrice || parseFloat(originalPrice) === 0) return 0;
  return Math.floor(((parseFloat(originalPrice) - parseFloat(offerPrice)) / parseFloat(originalPrice)) * 100);
};

export default function OfferPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Fetch offer data
  const { data: offerData, isLoading: offerLoading, error: offerError } = useGetOfferByIdQuery({ id });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  
  // Swipe state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Extract offer from response - using simplified Offer model
  const offer = offerData?.data?.offerById ?? offerData?.offerById ?? null;
  
  // Get productId from the simplified offer
  const productId: string | undefined = offer?.productId;

  // Fetch laptop data using the productId
  const { data: laptopData, isLoading: laptopLoading, error: laptopError } = useGetLaptopByIdQuery(
    { id: productId },
    { skip: !productId }
  );

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollar_price ?? 0);
    }
  }, [dollarData]);

  const laptop = laptopData?.data?.laptopById;
  
  // Calculate discount using original laptop price and offer price
  const originalPrice = laptop?.price;
  const discountPercent = originalPrice ? getDiscountPercent(originalPrice, offer?.price) : 0;

  // Get all images array from laptop
  const allImages = [
    laptop?.url1, laptop?.url2, laptop?.url3, laptop?.url4, laptop?.url5,
    laptop?.image1, laptop?.image2, laptop?.image3, laptop?.image4, laptop?.image5
  ].filter(Boolean) as string[];

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
    if (distance > 50 && currentIndex < allImages.length - 1) {
      setCurrentImage(allImages[currentIndex + 1]);
    }
    if (distance < -50 && currentIndex > 0) {
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

  const buildWarrantyText = () => {
    if (!laptop) return "";
    if (laptop.age?.toLowerCase() === 'jdyd') {
      return '\n\n*الضمان والهدايا (جديد):*\n• كفالة هاردوير: 3 شهور\n• كفالة سوفتوير: 6 شهور\n• الهدايا: حقيبة + ماوس + ستاند معدني + ماوس باد';
    } else if (laptop.age?.toLowerCase() === 'used' || laptop.age?.toLowerCase() === 'openbox') {
      return `\n\n*الضمان والهدايا (${laptop.age?.toLowerCase() === 'used' ? 'مستعمل' : 'أوبن بوكس'}):*\n• كفالة هاردوير: شهر واحد\n• كفالة سوفتوير: 3 شهور\n• الهدايا: حقيبة + ماوس + ماوس باد`;
    }
    return '';
  };

  const handleShare = async () => {
    if (!offer || !laptop) return;
    const specsText = buildSpecsText();
    const warrantyText = buildWarrantyText();
    
    // Use laptop name for the offer since offer has no name anymore
    let shareText = `🎉 *عرض خاص: ${laptop.name}* 🎉\n\n💰 السعر بعد الخصم: $${formatPriceInUSD(offer.price)}`;
    if (discountPercent > 0) {
      shareText += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(originalPrice)})`;
    }
    shareText += `\n📦 الحالة: ${getAgeInArabic(laptop.age)}${specsText}${warrantyText}\n\n🔗 الرابط:`;
    const shareUrl = `${window.location.origin}/offers/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: laptop.name, text: shareText.replace(/\*/g, ''), url: shareUrl });
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
    if (!offer || !laptop) return;
    const specsText = buildSpecsText();
    const warrantyText = buildWarrantyText();
    
    let message = `مرحباً، أريد الاستفسار عن هذا العرض:\n\n`;
    message += `🎉 *عرض خاص: ${laptop.name}* 🎉\n`;
    message += `💰 السعر بعد الخصم: $${formatPriceInUSD(offer.price)}\n`;
    if (discountPercent > 0) {
      message += `💰 السعر القديم: $${formatPriceInUSD(originalPrice)} (خصم ${discountPercent}%)\n`;
    }
    message += `📦 الحالة: ${getAgeInArabic(laptop.age)}`;
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
    if (!laptop) return { hardware: '', software: '', gifts: '' };
    if (laptop.age?.toLowerCase() === 'jdyd') {
      return { hardware: '3 شهور', software: '6 شهور', gifts: 'حقيبة + ماوس + ستاند معدني + ماوس باد' };
    } else if (laptop.age?.toLowerCase() === 'used' || laptop.age?.toLowerCase() === 'openbox') {
      return { hardware: 'شهر واحد', software: '3 شهور', gifts: 'حقيبة + ماوس + ماوس باد' };
    }
    return { hardware: '-', software: '-', gifts: '-' };
  };

  // Loading / error states
  if (offerLoading || (productId && laptopLoading)) return <OfferSkeleton />;

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">Debug Information</h2>
          <div className="text-left space-y-2">
            <p><strong>Offer ID requested:</strong> {id}</p>
            <p><strong>Offer Error:</strong> {offerError ? JSON.stringify(offerError, null, 2) : 'No error'}</p>
            <p><strong>Full Response:</strong></p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(offerData, null, 2)}
            </pre>
          </div>
          <Link href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  if (productId && laptopLoading) return <OfferSkeleton />;

  if (!laptop && !laptopLoading && productId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">Laptop Not Found</h2>
          <div className="text-left space-y-2">
            <p><strong>Product ID:</strong> {productId}</p>
            <p><strong>Laptop Error:</strong> {laptopError ? JSON.stringify(laptopError, null, 2) : 'No error'}</p>
            <p><strong>Laptop Data:</strong></p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(laptopData, null, 2)}
            </pre>
          </div>
          <Link href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  if (!offer || !laptop) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-2">عذراً!</h2>
          <p className="text-gray-600">العرض أو اللابتوب غير متوفر</p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const ageDisplay = getAgeDisplay(laptop.age);
  const warrantyInfo = getWarrantyInfo();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Offer Banner */}
      <div className="mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-center relative">
        <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
          عرض خاص
        </div>
        <h3 className="text-white text-xl font-bold">
          🎉 عرض خاص: {laptop.name} 🎉
        </h3>
        {discountPercent > 0 && (
          <p className="text-white/90 text-sm mt-1">
            خصم {discountPercent}% - وفر {Math.floor(parseFloat(originalPrice) - parseFloat(offer.price))}$
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
                <Image
                  src={currentImage}
                  alt={laptop.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                    <Image
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
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
              {laptop.name}
            </h1>
            
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-sm rounded-full ${ageDisplay.className}`}>
                {ageDisplay.label}
              </span>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="text-sm text-gray-500">السعر بالليرة السورية</span>
                  <p className="text-2xl md:text-3xl font-bold text-red-600">
                    {formatPriceInSYP(offer.price, dollar)} <span className="text-sm">ل.س</span>
                  </p>
                  {discountPercent > 0 && (
                    <p className="text-xs text-gray-500 line-through mt-1">
                      كان: {formatPriceInSYP(originalPrice, dollar)} ل.س
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">السعر بالدولار</span>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    ${formatPriceInUSD(offer.price)}
                  </p>
                  {discountPercent > 0 && (
                    <p className="text-xs text-gray-500 line-through mt-1">
                      كان: ${formatPriceInUSD(originalPrice)}
                    </p>
                  )}
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
      {laptop.description && (
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <h2 className="text-xl font-bold text-blue-600">تمييزات اضافية</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {laptop.description}
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