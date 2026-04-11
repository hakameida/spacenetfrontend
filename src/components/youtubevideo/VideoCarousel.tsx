"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetyoutubeUrlQuery } from "@/data-access/api/products/products";

const VideoCarousel = () => {
  const { data, isLoading, error } = useGetyoutubeUrlQuery(undefined);
  const videoLinks =
    data?.data?.youtubelinks?.map((item: any) => item.youtubeUrl) || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload adjacent videos
  useEffect(() => {
    if (videoLinks.length > 0) {
      const indicesToPreload = [
        currentIndex,
        (currentIndex + 1) % videoLinks.length,
        (currentIndex - 1 + videoLinks.length) % videoLinks.length,
      ];
      
      indicesToPreload.forEach(index => {
        if (!loadedVideos.has(index)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'document';
          link.href = videoLinks[index];
          document.head.appendChild(link);
          
          setLoadedVideos(prev => new Set(prev).add(index));
        }
      });
    }
  }, [currentIndex, videoLinks]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoLinks.length) % videoLinks.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoLinks.length);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex !== null) {
        if (e.key === 'ArrowLeft') {
          setFullscreenIndex((prev) => 
            prev !== null ? (prev - 1 + videoLinks.length) % videoLinks.length : null
          );
        } else if (e.key === 'ArrowRight') {
          setFullscreenIndex((prev) => 
            prev !== null ? (prev + 1) % videoLinks.length : null
          );
        }
      } else {
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'ArrowRight') goToNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex, videoLinks.length]);

  // Get visible videos based on screen size
  const getVisibleIndices = () => {
    if (isMobile) {
      return [currentIndex];
    }
    return [
      (currentIndex - 1 + videoLinks.length) % videoLinks.length,
      currentIndex,
      (currentIndex + 1) % videoLinks.length,
    ];
  };

  // 🦴 Skeleton Loader
  if (isLoading)
    return (
      <div className="flex justify-center items-center gap-4 p-6">
        {[...Array(isMobile ? 1 : 3)].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-300 animate-pulse rounded-xl ${
              isMobile 
                ? "w-[90vw] h-[200px]" 
                : i === 1 
                ? "w-[420px] h-[240px]" 
                : "w-[250px] h-[140px] opacity-70"
            }`}
          />
        ))}
      </div>
    );

  if (error)
    return <div className="text-center p-4 text-red-500">خطأ بتحصيل الفيديوهات</div>;
  if (videoLinks.length === 0)
    return <div className="text-center p-4">لا يوجد فيديوهات</div>;

  const visibleIndices = getVisibleIndices();

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6">
      {/* 🎥 Carousel */}
      <div 
        className="relative flex items-center justify-between w-full max-w-6xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ⬅️ Left Arrow - Hide on mobile when at start */}
        {(!isMobile || currentIndex > 0) && (
          <button
            onClick={goToPrev}
            className={`${
              isMobile ? "absolute left-2" : "absolute left-0"
            } z-30 p-2 bg-white/80 hover:bg-white/90 rounded-full shadow-md transition-all hover:scale-110 active:scale-95 backdrop-blur-sm`}
            aria-label="Previous video"
          >
            <ChevronLeft size={isMobile ? 28 : 32} />
          </button>
        )}

        {/* 🎞️ Video Items */}
        <div className={`flex items-center justify-center gap-4 md:gap-8 w-full transition-all duration-300 ${
          isMobile ? "px-12" : ""
        }`}>
          <AnimatePresence mode="wait">
            {visibleIndices.map((index, position) => {
              const isCenter = !isMobile && position === 1;
              const isMobileView = isMobile;
              
              return (
                <motion.div
                  key={`video-${index}-${currentIndex}`}
                  initial={{ opacity: 0, x: isMobileView ? (position === 0 ? 100 : -100) : 0, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: isCenter ? 1 : isMobileView ? 1 : 0.85 }}
                  exit={{ opacity: 0, x: isMobileView ? (position === 0 ? -100 : 100) : 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
                    isCenter 
                      ? "w-[420px] h-[240px] md:w-[420px] md:h-[240px] z-10" 
                      : isMobileView
                      ? "w-[85vw] h-[200px] sm:w-[400px] sm:h-[225px]"
                      : "w-[200px] h-[120px] md:w-[250px] md:h-[140px] z-0 opacity-70"
                  }`}
                  onClick={() => setFullscreenIndex(index)}
                  whileHover={!isMobileView ? { scale: isCenter ? 1.02 : 0.87 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${videoLinks[index]}?autoplay=0&enablejsapi=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading={position === 1 || isMobileView ? "eager" : "lazy"}
                    className="pointer-events-none"
                    title={`Video ${index + 1}`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ➡️ Right Arrow - Hide on mobile when at end */}
        {(!isMobile || currentIndex < videoLinks.length - 1) && (
          <button
            onClick={goToNext}
            className={`${
              isMobile ? "absolute right-2" : "absolute right-0"
            } z-30 p-2 bg-white/80 hover:bg-white/90 rounded-full shadow-md transition-all hover:scale-110 active:scale-95 backdrop-blur-sm`}
            aria-label="Next video"
          >
            <ChevronRight size={isMobile ? 28 : 32} />
          </button>
        )}
      </div>

      {/* 📍 Progress Indicators - Mobile */}
      {isMobile && (
        <div className="flex gap-2 mt-6">
          {videoLinks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 h-2 bg-blue-500"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to video ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* 📍 Progress Indicators - Desktop */}
      {!isMobile && videoLinks.length > 3 && (
        <div className="flex gap-2 mt-6">
          {videoLinks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 h-2 bg-blue-500"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to video ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* 🖥️ Fullscreen Viewer with navigation */}
      <AnimatePresence>
        {fullscreenIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setFullscreenIndex(null);
            }}
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setFullscreenIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition-all z-50 hover:scale-110"
              aria-label="Close fullscreen"
            >
              <X size={40} />
            </button>

            {/* ⬅️ Navigation in Fullscreen */}
            <button
              onClick={() => setFullscreenIndex((prev) => 
                prev !== null ? (prev - 1 + videoLinks.length) % videoLinks.length : null
              )}
              className="absolute left-4 text-white hover:text-blue-400 transition-all z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 hover:scale-110"
              aria-label="Previous video"
            >
              <ChevronLeft size={40} />
            </button>

            {/* 📽️ Fullscreen Video */}
            <motion.iframe
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              width="90%"
              height="80%"
              src={`${videoLinks[fullscreenIndex]}?autoplay=1&enablejsapi=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl shadow-2xl"
              title={`Fullscreen Video ${fullscreenIndex + 1}`}
            />

            {/* ➡️ Navigation in Fullscreen */}
            <button
              onClick={() => setFullscreenIndex((prev) => 
                prev !== null ? (prev + 1) % videoLinks.length : null
              )}
              className="absolute right-4 text-white hover:text-blue-400 transition-all z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 hover:scale-110"
              aria-label="Next video"
            >
              <ChevronRight size={40} />
            </button>

            {/* Video Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
              {fullscreenIndex + 1} / {videoLinks.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCarousel;