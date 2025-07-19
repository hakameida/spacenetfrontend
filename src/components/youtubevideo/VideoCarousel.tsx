"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetyoutubeUrlQuery } from "@/data-access/api/products/products";

const VideoCarousel = () => {
  const { data, isLoading, error } = useGetyoutubeUrlQuery(undefined);
  const videoLinks =
    data?.data?.youtubelinks?.map((item: any) => item.youtubeUrl) || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoLinks.length) % videoLinks.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoLinks.length);
  };

  const visibleIndices = [
    (currentIndex - 1 + videoLinks.length) % videoLinks.length,
    currentIndex,
    (currentIndex + 1) % videoLinks.length,
  ];

  // 🦴 Skeleton Loader
  if (isLoading)
    return (
      <div className="flex justify-center items-center gap-4 p-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-300 animate-pulse rounded-xl ${
              i === 1 ? "w-[420px] h-[240px]" : "w-[250px] h-[140px] opacity-70"
            }`}
          />
        ))}
      </div>
    );

  if (error)
    return <div className="text-center p-4 text-red-500">خطأ بتحصيل الفيديوهات</div>;
  if (videoLinks.length === 0)
    return <div className="text-center p-4">لا يوجد فيديوهات</div>;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* 🎥 Carousel */}
      <div className="relative flex items-center justify-between w-full max-w-6xl overflow-hidden">
        {/* ⬅️ Left Arrow */}
        <button
          onClick={goToPrev}
          className="absolute left-0 z-30 p-2 bg-white/60 hover:bg-white/90 rounded-full shadow-md transition"
        >
          <ChevronLeft size={32} />
        </button>

        {/* 🎞️ Video Items */}
        <div className="flex items-center justify-center gap-8 w-full">
          {visibleIndices.map((index, position) => {
            const isCenter = position === 1;
            return (
              <motion.div
                key={`video-${index}-${position}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isCenter ? 1 : 0.85 }}
                transition={{ duration: 0.5 }}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer ${
                  isCenter ? "w-[420px] h-[240px] z-10" : "w-[250px] h-[140px] z-0 opacity-70"
                }`}
                onClick={() => setFullscreenIndex(index)}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={videoLinks[index]}
                  frameBorder="0"
                  allowFullScreen
                  className="pointer-events-none"
                />
              </motion.div>
            );
          })}
        </div>

        {/* ➡️ Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-0 z-30 p-2 bg-white/60 hover:bg-white/90 rounded-full shadow-md transition"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* 🖥️ Fullscreen Viewer */}
      <AnimatePresence>
        {fullscreenIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setFullscreenIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition z-50"
            >
              <X size={40} />
            </button>

            {/* 📽️ Fullscreen Video */}
            <motion.iframe
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.5 }}
              width="90%"
              height="80%"
              src={videoLinks[fullscreenIndex]}
              frameBorder="0"
              allowFullScreen
              className="rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCarousel;
