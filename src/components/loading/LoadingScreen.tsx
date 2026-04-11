"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [logoState, setLogoState] = useState<"appear" | "disappear">("appear");

  useEffect(() => {
    // Logo appears and disappears with smooth timing
    const interval = setInterval(() => {
      setLogoState(prev => prev === "appear" ? "disappear" : "appear");
    }, 1000);

    // Remove loading screen after 3 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-gradient-to-br from-white to-gray-50
      "
    >
      <div className="relative">
        {/* Outer Spinning Ring */}
        <div className="w-44 h-44 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        
        {/* Middle Ring */}
        <div className="absolute inset-2 w-40 h-40 rounded-full border-4 border-purple-600 border-b-transparent animate-spin-slow" />
        
        {/* Inner Ring */}
        <div className="absolute inset-4 w-36 h-36 rounded-full border-4 border-pink-600 border-r-transparent animate-spin-reverse" />
        
        {/* Logo with Smooth Appear/Disappear */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`
              bg-white rounded-full p-2 shadow-xl
              transition-all duration-500 ease-in-out
              ${logoState === "appear" 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-0"
              }
            `}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={65}
              height={65}
              className="rounded-full"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}