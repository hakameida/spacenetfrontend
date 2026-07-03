// app/storage/page.tsx
"use client";

import React from "react";
import { HardDrive } from "lucide-react";

export default function StoragePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* Icon */}
        <div className="inline-block p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm mb-6">
          <HardDrive className="w-20 h-20 text-blue-600" />
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          وسائط تخزين
        </h1>
        
        {/* Coming Soon Badge */}
        <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          قريباً
        </div>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          هذا القسم قيد التطوير حالياً. 
          <br />
          سيتم إضافة وسائط التخزين قريباً.
        </p>
        
        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-0.5 w-12 bg-blue-300 rounded-full" />
          <span className="text-blue-400 text-sm">⏳ قيد الإنجاز</span>
          <div className="h-0.5 w-12 bg-blue-300 rounded-full" />
        </div>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        {/* Footer */}
        <p className="mt-8 text-sm text-gray-400">
          سبيس نت ستور • نعمل لتقديم أفضل الخدمات
        </p>
      </div>
    </div>
  );
}