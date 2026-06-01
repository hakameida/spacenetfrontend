"use client";

import React from "react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 md:pt-24">
      <div className="text-center px-4 py-8">
        {/* Animated Maintenance Icon */}
        <div className="mb-8 animate-bounce">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            <svg className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
          🔧 تحت الصيانة 🔧
        </h1>
        
        <div className="space-y-3 mb-8">
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 font-semibold">
            الموقع قيد التطوير والتحديث
          </p>
          <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto">
            نعتذر عن أي إزعاج، نحن نعمل على تحسين الموقع لتقديم أفضل الخدمات
          </p>
          <p className="text-sm text-gray-400">
            سنعود قريباً بإذن الله
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-2 rounded-full animate-progress"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">جاري التحديث...</p>
        </div>

        <div className="inline-block bg-blue-50 rounded-full px-6 py-2 mb-8">
          <p className="text-sm text-blue-600">
            ⏳ المتوقع: قريباً جداً
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            للاستفسار أو المساعدة:
          </p>
          <div className="flex justify-center gap-4">
            <a href="tel:0956958013" className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              اتصل بنا
            </a>
            <a href="http://wa.me/963956958013" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.032 2.012c-5.514 0-9.996 4.48-9.996 9.99 0 1.76.458 3.484 1.325 5.002L2 22.001l5.21-1.354c1.46.792 3.102 1.21 4.802 1.21 5.514 0 9.996-4.48 9.996-9.99 0-5.51-4.482-9.99-9.996-9.99zm0 18.38c-1.49 0-2.957-.4-4.24-1.156l-.304-.18-3.09.802.826-3.01-.198-.316c-.84-1.326-1.284-2.85-1.284-4.42 0-4.618 3.76-8.376 8.38-8.376 4.62 0 8.38 3.758 8.38 8.376 0 4.618-3.76 8.376-8.38 8.376zm4.59-6.27c-.252-.126-1.49-.735-1.72-.82-.23-.084-.398-.126-.566.126-.168.252-.654.82-.802.99-.147.168-.294.188-.546.063-.252-.126-1.064-.392-2.028-1.252-.75-.67-1.256-1.496-1.403-1.75-.147-.252-.016-.388.11-.513.113-.113.252-.294.378-.44.126-.147.168-.252.252-.42.084-.168.042-.315-.02-.44-.063-.126-.566-1.36-.776-1.862-.204-.49-.41-.424-.566-.43-.147-.007-.315-.007-.483-.007-.168 0-.44.063-.672.315-.232.252-.884.864-.884 2.108 0 1.244.906 2.446 1.032 2.614.126.168 1.78 2.72 4.314 3.814.602.26 1.072.416 1.438.532.604.192 1.154.165 1.588.1.484-.074 1.49-.61 1.7-1.198.21-.588.21-1.092.147-1.198-.063-.105-.232-.168-.484-.294z"/>
              </svg>
              واتساب
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl -z-10"></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}