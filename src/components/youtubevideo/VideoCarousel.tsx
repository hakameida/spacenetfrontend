"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetyoutubeUrlQuery } from "@/data-access/api/products/products"; // Replace with correct path

const VideoCarousel = () => {
  const { data, isLoading, error } = useGetyoutubeUrlQuery(undefined);

  const videoLinks = data?.data?.youtubelinks?.map((item: any) => item.youtubeUrl) || [];

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

  if (isLoading) return <div className="text-center p-4">Loading videos...</div>;
  if (error) return <div className="text-center p-4 text-red-500">خطا بتحصيل الفيديوهات</div>;
  if (videoLinks.length === 0) return <div className="text-center p-4">لا يوجد فيديوهات</div>;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      
      <div className="relative flex items-center justify-center w-full max-w-6xl overflow-hidden">
        <button onClick={goToPrev} className="z-20 text-gray-500 hover:text-blue-600 transition">
          <ChevronLeft size={40} />
        </button>

        <div className="flex items-center justify-center gap-8 w-full">
          {visibleIndices.map((index, position) => {
            const isCenter = position === 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isCenter ? 1 : 0.85 }}
                transition={{ duration: 0.5 }}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer ${
                  isCenter
                    ? "w-[420px] h-[240px] z-10"
                    : "w-[250px] h-[140px] z-0 opacity-70"
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
                ></iframe>
              </motion.div>
            );
          })}
        </div>

        <button onClick={goToNext} className="z-20 text-gray-500 hover:text-blue-600 transition">
          <ChevronRight size={40} />
        </button>
      </div>

      <AnimatePresence>
        {fullscreenIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          >
            <button
              onClick={() => setFullscreenIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition z-50"
            >
              <X size={40} />
            </button>
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
            ></motion.iframe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCarousel;
