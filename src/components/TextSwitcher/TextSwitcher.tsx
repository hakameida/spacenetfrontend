// components/TextSwitcher.tsx
"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "المكان الأفضل للحصول على افضل اسعار الالكترونيات في دمشق",
  "أسعار منافسة وجودة عالية في سوق البحصة",
  "اكتشف أحدث العروض على الموبايلات واللابتوبات",
  "وجهتك الأولى للتكنولوجيا في دمشق",
];

export function TextSwitcher() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 overflow-hidden relative text-lg text-blue-800">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute w-full text-center"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
