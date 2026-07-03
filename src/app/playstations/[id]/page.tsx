// app/playstations/[id]/page.tsx
"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetPlayStationByIdQuery, useGetPlayStationsListQuery } from "@/data-access/api/playstation";
import { useAppSelector } from "@/store";
import { selectPlayStationListList } from "@/data-access/slices/playstation-list";
import { IoMdCart, IoMdShare } from "react-icons/io";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, HardDrive } from "lucide-react";
import { getImage } from "@/util/get-image-url";
import CardPlayStation from "@/feature/card-playstation";

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

export default function PlayStationDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useGetPlayStationByIdQuery({ id: params.id });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>("");
  
  // Swipe state
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Get all playstations for similar products
  const { isLoading: isListLoading } = useGetPlayStationsListQuery({ status: true });
  const playstationListRaw = useAppSelector(selectPlayStationListList);
  const playstationList: any[] = Array.isArray(playstationListRaw) ? playstationListRaw : [];

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollarPrice ?? 0);
    }
  }, [dollarData]);

  useEffect(() => {
    const playstation = data;
    if (playstation) {
      const firstImage = [
        playstation.url1, playstation.url2, playstation.url3, playstation.url4, playstation.url5,
        playstation.image1, playstation.image2, playstation.image3, playstation.image4, playstation.image5
      ].find(Boolean);
      if (firstImage) setCurrentImage(firstImage);
    }
  }, [data]);

  const playstation = data;

  // Get all images array
  const allImages: string[] = [
    playstation?.url1, playstation?.url2, playstation?.url3, playstation?.url4, playstation?.url5,
    playstation?.image1, playstation?.image2, playstation?.image3, playstation?.image4, playstation?.image5
  ].filter((img): img is string => Boolean(img));

  // Calculate discount
  const discountPercent = playstation?.discount ? getDiscountPercent(playstation.price, playstation.discount) : 0;
  const hasDiscount = discountPercent > 0;

  // Find similar products
  const similarProducts = useMemo(() => {
    if (!playstation || playstationList.length === 0) return [];

    const currentPrice = parseFloat(playstation.price) || 0;
    const currentType = playstation.type_name || '';
    const currentStorage = playstation.storage || '';

    const scored = playstationList
      .filter((item) => item.id !== playstation.id)
      .map((item) => {
        let score = 0;
        const itemPrice = parseFloat(item.price) || 0;
        const itemType = item.type_name || '';
        const itemStorage = item.storage || '';

        if (currentType && itemType === currentType) score += 50;
        if (currentStorage && itemStorage === currentStorage) score += 30;

        const priceDiff = Math.abs(currentPrice - itemPrice);
        if (currentPrice > 0 && priceDiff <= 200) score += 25;
        if (currentPrice > 0 && priceDiff <= 50) score += 15;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return scored;
  }, [playstation, playstationList]);

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
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const currentIndex = allImages.findIndex(img => img === currentImage);
    
    if (isLeftSwipe && currentIndex < allImages.length - 1 && currentIndex >= 0) {
      const nextImg = allImages[currentIndex + 1];
      if (nextImg) setCurrentImage(nextImg);
    }
    
    if (isRightSwipe && currentIndex > 0 && currentIndex < allImages.length) {
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

  // Build specs text for sharing/whatsapp
  const buildSpecsText = () => {
    if (!playstation) return "";
    const specsList: string[] = [];
    if (playstation.brand) specsList.push(`• الماركة: ${playstation.brand}`);
    if (playstation.modelNumber) specsList.push(`• رقم الموديل: ${playstation.modelNumber}`);
    if (playstation.storage) specsList.push(`• المساحة: ${playstation.storage}`);
    if (playstation.color) specsList.push(`• اللون: ${playstation.color}`);
    if (playstation.type_name) specsList.push(`• النوع: ${playstation.type_name}`);
    if (playstation.controllerCount) specsList.push(`• عدد أيدي التحكم: ${playstation.controllerCount}`);
    
    if (playstation.dynamicSpecs) {
      playstation.dynamicSpecs.forEach((spec: { key: string; value: string }) => {
        specsList.push(`• ${spec.key}: ${spec.value}`);
      });
    }
    
    return specsList.length > 0 ? `\n\n*المواصفات:*\n${specsList.join('\n')}` : '';
  };

  // Share function
  const handleShare = async () => {
    if (!playstation) return;
    
    const specsText = buildSpecsText();
    
    let shareText = `🎮 *${playstation.name}*\n\n💰 السعر: $${formatPriceInUSD(playstation.discount || playstation.price)}`;
    if (hasDiscount) {
      shareText += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(playstation.price)})`;
    }
    shareText += `\n📦 الحالة: ${getAgeInArabic(playstation.age)}${specsText}\n\n🔗 الرابط:`;
    const shareUrl = `${window.location.origin}/playstations/${params.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: playstation.name,
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
    if (!playstation) return;
    
    const specsText = buildSpecsText();
    
    let message = `مرحباً، أريد الاستفسار عن هذا المنتج:\n\n`;
    message += `🎮 *${playstation.name}*\n`;
    message += `💰 السعر: $${formatPriceInUSD(playstation.discount || playstation.price)}`;
    if (hasDiscount) {
      message += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(playstation.price)})`;
    }
    message += `\n📦 الحالة: ${getAgeInArabic(playstation.age)}`;
    message += specsText;
    message += `\n\n🔗 رابط المنتج: ${window.location.origin}/playstations/${params.id}`;
    
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

  if (isLoading) {
    return <PlayStationDetailsSkeleton />;
  }

  if (!playstation) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">عذراً!</h2>
          <p className="text-gray-600">المنتج غير متوفر أو تم حذفه</p>
          <Link href="/playstations" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى البلايستيشن
          </Link>
        </div>
      </div>
    );
  }

  const ageDisplay = getAgeDisplay(playstation.age);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Discount Banner */}
      {hasDiscount && (
        <div className="mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-center relative">
          <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
            عرض خاص
          </div>
          <h3 className="text-white text-xl font-bold">
            🎉 خصم {discountPercent}% على {playstation.name} 🎉
          </h3>
          <p className="text-white/90 text-sm mt-1">
            وفر {Math.floor(parseFloat(playstation.price) - parseFloat(playstation.discount))}$
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left - Image Gallery with Swipe Support */}
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
                  alt={playstation.name}
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
              
              {allImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white flex items-center gap-1 md:hidden">
                  <span>👆 اسحب لليمين واليسار</span>
                </div>
              )}

              {/* Discount Badge on Image */}
              {hasDiscount && (
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

        {/* Right - Product Info */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {playstation.name}
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
                      {formatPriceInSYP(playstation.price, dollar)} ل.س
                    </p>
                  )}
                  <p className="text-2xl md:text-3xl font-bold text-red-600">
                    {formatPriceInSYP(playstation.discount || playstation.price, dollar)} <span className="text-sm">ل.س</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">السعر بالدولار</span>
                  {hasDiscount && (
                    <p className="text-xs text-gray-500 line-through mt-1">
                      ${formatPriceInUSD(playstation.price)}
                    </p>
                  )}
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    ${formatPriceInUSD(playstation.discount || playstation.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {playstation.type_name && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">النوع</p>
                  <p className="text-sm font-medium text-gray-800">{playstation.type_name}</p>
                </div>
              )}
              {playstation.storage && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><HardDrive className="w-3 h-3" /> المساحة</p>
                  <p className="text-sm font-medium text-gray-800">{playstation.storage}</p>
                </div>
              )}
              {playstation.color && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">اللون</p>
                  <p className="text-sm font-medium text-gray-800">{playstation.color}</p>
                </div>
              )}
              {playstation.modelNumber && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">رقم الموديل</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{playstation.modelNumber}</p>
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
                    <td className="py-3 px-4 text-gray-600">{playstation.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الحالة</td>
                    <td className="py-3 px-4 text-gray-600">{getAgeInArabic(playstation.age)}</td>
                  </tr>
                  
                  {/* Discount row */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الخصم</td>
                    <td className="py-3 px-4 text-gray-600">
                      {hasDiscount ? (
                        <span className="text-red-600 font-bold">
                          خصم {discountPercent}% - وفر {Math.floor(parseFloat(playstation.price) - parseFloat(playstation.discount))}$
                        </span>
                      ) : (
                        <span className="text-gray-500">لا يوجد خصم</span>
                      )}
                    </td>
                  </tr>
                  
                  {playstation.type_name && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">النوع</td>
                      <td className="py-3 px-4 text-gray-600">{playstation.type_name}</td>
                    </tr>
                  )}
                  {playstation.brand && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الماركة</td>
                      <td className="py-3 px-4 text-gray-600">{playstation.brand}</td>
                    </tr>
                  )}
                  {playstation.modelNumber && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">رقم الموديل</td>
                      <td className="py-3 px-4 text-gray-600">{playstation.modelNumber}</td>
                    </tr>
                  )}
                  {playstation.storage && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">المساحة</td>
                      <td className="py-3 px-4 text-gray-600">{playstation.storage}</td>
                    </tr>
                  )}
                  {playstation.color && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">اللون</td>
                      <td className="py-3 px-4 text-gray-600">{playstation.color}</td>
                    </tr>
                  )}
                  {playstation.controllerCount && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">عدد أيدي التحكم</td>
                      <td className="py-3 px-4 text-gray-600">{playstation.controllerCount}</td>
                    </tr>
                  )}
                  
                  {playstation.dynamicSpecs && playstation.dynamicSpecs.map((spec: { key: string; value: string }, idx: number) => (
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
            <h2 className="text-xl font-bold text-blue-600">تمييزات اصافية</h2>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {playstation.description || "لا يوجد وصف لهذا المنتج"}
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
                <CardPlayStation
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
                  id={product.id || ""}
                  age={product.age || ""}
                  type_name={product.type_name || ""}
                  storage={product.storage || ""}
                  color={product.color || ""}
                  includes_controller={product.includes_controller}
                  controller_count={product.controller_count}
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

// Skeleton Loader Component
function PlayStationDetailsSkeleton() {
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