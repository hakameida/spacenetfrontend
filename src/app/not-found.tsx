"use client";
import React from "react";
import Link from "next/link";
import { FaHome, FaArrowRight } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <div className="mb-6">
          <span className="text-8xl md:text-9xl font-bold text-gray-200">404</span>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex p-4 bg-gray-50 rounded-full">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          الصفحة غير موجودة
        </h1>
        <p className="text-gray-500 mb-8">
          عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
              <FaHome className="text-sm" />
              الرئيسية
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <FaArrowRight className="text-sm" />
            رجوع
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400 mb-3">روابط سريعة:</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link href="/laptops" className="text-gray-500 hover:text-blue-500 transition">
              لابتوبات
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/batteries" className="text-gray-500 hover:text-blue-500 transition">
              بطاريات
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/accessories" className="text-gray-500 hover:text-blue-500 transition">
              اكسسوارات
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/mobiles" className="text-gray-500 hover:text-blue-500 transition">
              موبايلات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}