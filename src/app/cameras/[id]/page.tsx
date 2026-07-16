// app/cameras/[id]/page.tsx
"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetCameraByIdQuery, useGetCamerasListQuery } from "@/data-access/api/camera";
import { useAppSelector } from "@/store";
import { selectCameraListList } from "@/data-access/slices/camera-list";
import { IoMdCart, IoMdShare } from "react-icons/io";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Camera, Image as ImageIcon, Video, Settings } from "lucide-react";
import { getImage } from "@/util/get-image-url";
import CardCamera from "@/feature/card-camera";

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

export default function CameraDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useGetCameraByIdQuery({ id: params.id });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>("");
  
  // Swipe state
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Get all cameras for similar products
  const { isLoading: isListLoading } = useGetCamerasListQuery({ status: true });
  const cameraListRaw = useAppSelector(selectCameraListList);
  const cameraList: any[] = Array.isArray(cameraListRaw) ? cameraListRaw : [];

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollarPrice ?? 0);
    }
  }, [dollarData]);

  useEffect(() => {
    const camera = data;
    if (camera) {
      const firstImage = [
        camera.url1, camera.url2, camera.url3, camera.url4, camera.url5,
        camera.image1, camera.image2, camera.image3, camera.image4, camera.image5
      ].find(Boolean);
      if (firstImage) setCurrentImage(firstImage);
    }
  }, [data]);

  const camera = data;

  // Get all images array
  const allImages: string[] = [
    camera?.url1, camera?.url2, camera?.url3, camera?.url4, camera?.url5,
    camera?.image1, camera?.image2, camera?.image3, camera?.image4, camera?.image5
  ].filter((img): img is string => Boolean(img));

  // Calculate discount
  const discountPercent = camera?.discount ? getDiscountPercent(camera.price, camera.discount) : 0;
  const hasDiscount = discountPercent > 0;

  // Find similar products
  const similarProducts = useMemo(() => {
    if (!camera || cameraList.length === 0) return [];

    const currentPrice = parseFloat(camera.price) || 0;
    const currentBrand = camera.brand || '';
    const currentType = camera.type_name || '';
    const currentMegapixels = camera.megapixels || '';

    const scored = cameraList
      .filter((item) => item.id !== camera.id)
      .map((item) => {
        let score = 0;
        const itemPrice = parseFloat(item.price) || 0;
        const itemBrand = item.brand || '';
        const itemType = item.type_name || '';
        const itemMegapixels = item.megapixels || '';

        if (currentBrand && itemBrand === currentBrand) score += 50;
        if (currentType && itemType === currentType) score += 40;
        if (currentMegapixels && itemMegapixels === currentMegapixels) score += 20;

        const priceDiff = Math.abs(currentPrice - itemPrice);
        if (currentPrice > 0 && priceDiff <= 200) score += 25;
        if (currentPrice > 0 && priceDiff <= 50) score += 15;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return scored;
  }, [camera, cameraList]);

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
    if (!camera) return "";
    const specsList: string[] = [];
    if (camera.brand) specsList.push(`• الماركة: ${camera.brand}`);
    if (camera.modelNumber) specsList.push(`• رقم الموديل: ${camera.modelNumber}`);
    if (camera.type_name) specsList.push(`• النوع: ${camera.type_name}`);
    if (camera.sensorType) specsList.push(`• نوع المستشعر: ${camera.sensorType}`);
    if (camera.megapixels) specsList.push(`• الدقة: ${camera.megapixels}`);
    if (camera.videoResolution) specsList.push(`• دقة الفيديو: ${camera.videoResolution}`);
    if (camera.lensMount) specsList.push(`• نوع العدسة: ${camera.lensMount}`);
    
    if (camera.dynamicSpecs) {
      camera.dynamicSpecs.forEach((spec: { key: string; value: string }) => {
        specsList.push(`• ${spec.key}: ${spec.value}`);
      });
    }
    
    return specsList.length > 0 ? `\n\n*المواصفات:*\n${specsList.join('\n')}` : '';
  };

  // Share function
  const handleShare = async () => {
    if (!camera) return;
    
    const specsText = buildSpecsText();
    
    let shareText = `📷 *${camera.name}*\n\n💰 السعر: $${formatPriceInUSD(camera.discount || camera.price)}`;
    if (hasDiscount) {
      shareText += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(camera.price)})`;
    }
    shareText += `\n📦 الحالة: ${getAgeInArabic(camera.age)}${specsText}\n\n🔗 الرابط:`;
    const shareUrl = `${window.location.origin}/cameras/${params.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: camera.name,
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
    if (!camera) return;
    
    const specsText = buildSpecsText();
    
    let message = `مرحباً، أريد الاستفسار عن هذا المنتج:\n\n`;
    message += `📷 *${camera.name}*\n`;
    message += `💰 السعر: $${formatPriceInUSD(camera.discount || camera.price)}`;
    if (hasDiscount) {
      message += ` (خصم ${discountPercent}% - كان $${formatPriceInUSD(camera.price)})`;
    }
    message += `\n📦 الحالة: ${getAgeInArabic(camera.age)}`;
    message += specsText;
    message += `\n\n🔗 رابط المنتج: ${window.location.origin}/cameras/${params.id}`;
    
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
    return <CameraDetailsSkeleton />;
  }

  if (!camera) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">عذراً!</h2>
          <p className="text-gray-600">المنتج غير متوفر أو تم حذفه</p>
          <Link href="/cameras" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة إلى الكاميرات
          </Link>
        </div>
      </div>
    );
  }

  const ageDisplay = getAgeDisplay(camera.age);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Discount Banner */}
      {hasDiscount && (
        <div className="mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-center relative">
          <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
            عرض خاص
          </div>
          <h3 className="text-white text-xl font-bold">
            🎉 خصم {discountPercent}% على {camera.name} 🎉
          </h3>
          <p className="text-white/90 text-sm mt-1">
            وفر {Math.floor(parseFloat(camera.price) - parseFloat(camera.discount))}$
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
                  alt={camera.name}
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
              {camera.name}
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
                      {formatPriceInSYP(camera.price, dollar)} ل.س
                    </p>
                  )}
                  <p className="text-2xl md:text-3xl font-bold text-red-600">
                    {formatPriceInSYP(camera.discount || camera.price, dollar)} <span className="text-sm">ل.س</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">السعر بالدولار</span>
                  {hasDiscount && (
                    <p className="text-xs text-gray-500 line-through mt-1">
                      ${formatPriceInUSD(camera.price)}
                    </p>
                  )}
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    ${formatPriceInUSD(camera.discount || camera.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {camera.brand && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">الماركة</p>
                  <p className="text-sm font-medium text-gray-800">{camera.brand}</p>
                </div>
              )}
              {camera.type_name && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">النوع</p>
                  <p className="text-sm font-medium text-gray-800">{camera.type_name}</p>
                </div>
              )}
              {camera.megapixels && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> الدقة</p>
                  <p className="text-sm font-medium text-gray-800">{camera.megapixels}</p>
                </div>
              )}
              {camera.sensorType && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Settings className="w-3 h-3" /> المستشعر</p>
                  <p className="text-sm font-medium text-gray-800">{camera.sensorType}</p>
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
                    <td className="py-3 px-4 text-gray-600">{camera.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الحالة</td>
                    <td className="py-3 px-4 text-gray-600">{getAgeInArabic(camera.age)}</td>
                  </tr>
                  
                  {/* Discount row */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الخصم</td>
                    <td className="py-3 px-4 text-gray-600">
                      {hasDiscount ? (
                        <span className="text-red-600 font-bold">
                          خصم {discountPercent}% - وفر {Math.floor(parseFloat(camera.price) - parseFloat(camera.discount))}$
                        </span>
                      ) : (
                        <span className="text-gray-500">لا يوجد خصم</span>
                      )}
                    </td>
                  </tr>
                  
                  {camera.brand && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الماركة</td>
                      <td className="py-3 px-4 text-gray-600">{camera.brand}</td>
                    </tr>
                  )}
                  {camera.type_name && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">النوع</td>
                      <td className="py-3 px-4 text-gray-600">{camera.type_name}</td>
                    </tr>
                  )}
                  {camera.modelNumber && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">رقم الموديل</td>
                      <td className="py-3 px-4 text-gray-600">{camera.modelNumber}</td>
                    </tr>
                  )}
                  {camera.sensorType && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">نوع المستشعر</td>
                      <td className="py-3 px-4 text-gray-600">{camera.sensorType}</td>
                    </tr>
                  )}
                  {camera.megapixels && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">الدقة</td>
                      <td className="py-3 px-4 text-gray-600">{camera.megapixels}</td>
                    </tr>
                  )}
                  {camera.videoResolution && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">دقة الفيديو</td>
                      <td className="py-3 px-4 text-gray-600">{camera.videoResolution}</td>
                    </tr>
                  )}
                  {camera.lensMount && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700">نوع العدسة</td>
                      <td className="py-3 px-4 text-gray-600">{camera.lensMount}</td>
                    </tr>
                  )}
                  
                  {camera.dynamicSpecs && camera.dynamicSpecs.map((spec: { key: string; value: string }, idx: number) => (
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
                {camera.description || "لا يوجد وصف لهذا المنتج"}
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
                <CardCamera
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
                  brand={product.brand || ""}
                  megapixels={product.megapixels || ""}
                  sensor_type={product.sensor_type || ""}
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
function CameraDetailsSkeleton() {
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