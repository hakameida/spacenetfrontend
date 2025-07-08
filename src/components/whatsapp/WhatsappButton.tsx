"use client";

import { FaWhatsapp } from "react-icons/fa";

const WhatsappButton = () => {
  return (
    <a
      href="https://wa.me/963956958013"
      target="_blank"
      rel="noopener noreferrer"
      title="تواصل معنا على واتساب"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center animate-glow"
    >
      <FaWhatsapp className="w-6 h-6" />
    </a>
  );
};

export default WhatsappButton;
