"use client";

import { 
  LaptopIcon, 
  MonitorIcon, 
  ChevronLeft, 
  ChevronRight,
  PcCase,
  Smartphone,
  Headphones,
  Battery,
  Video
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const navLinks = [
  { name: "كومبيوتر", href: "/computer", icon: PcCase },
  { name: "موبايلات", href: "/mobiles", icon: Smartphone },
  { name: "اكسسوارات", href: "/accessories", icon: Headphones },
  { name: "لابتوبات", href: "/laptops", icon: LaptopIcon },
  { name: "بطاريات", href: "/batteries", icon: Battery },
  { name: "كاميرات مراقبة", href: "/cameras", icon: Video },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hintDirection, setHintDirection] = useState<"left" | "right" | null>(null);
  const lastScrollY = useRef(0);
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check if first visit and if on mobile
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenNavbarOnboarding");
    const isMobile = window.innerWidth < 768;
    
    if (!hasSeenOnboarding && isMobile) {
      setShowOnboarding(true);
      
      // Check if content is scrollable
      setTimeout(() => {
        if (categoriesRef.current) {
          const { scrollWidth, clientWidth } = categoriesRef.current;
          if (scrollWidth > clientWidth) {
            setHintDirection("right");
          }
        }
      }, 100);
    }
  }, []);

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
    
    // Prevent default to avoid text selection
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = Math.abs(x - startX);
    
    // Only consider it a drag if moved more than 5px
    if (walk > 5) {
      setHasMoved(true);
    }
    
    e.preventDefault();
    const moveX = (x - startX) * 1.5; // Scroll speed multiplier
    categoriesRef.current.scrollLeft = scrollLeft - moveX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    setHasMoved(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setHasMoved(false);
    }
  };

  // Handle click on links - prevent if was dragging
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (hasMoved) {
      e.preventDefault();
      return;
    }
    // Normal navigation
    window.location.href = href;
  };

  // Handle scroll hint display
  const handleCategoriesScroll = () => {
    if (categoriesRef.current && showOnboarding) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      const isAtStart = scrollLeft < 10;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      
      if (!isAtStart && !isAtEnd) {
        setHintDirection(null);
      } else if (isAtStart && scrollWidth > clientWidth) {
        setHintDirection("right");
      } else if (isAtEnd) {
        setHintDirection("left");
      }
    }
  };

  // Dismiss onboarding
  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasSeenNavbarOnboarding", "true");
  };

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🌟 Onboarding Overlay */}
      {showOnboarding && (
        <>
          {/* Backdrop with fade */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] animate-in fade-in duration-500"
            onClick={dismissOnboarding}
          />
          
          {/* Hint Message */}
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[101] text-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-2xl max-w-[300px]">
              <p className="text-gray-800 font-bold mb-2">✨ تصفح الأقسام</p>
              <p className="text-gray-600 text-sm mb-3">
                اسحب لليمين واليسار لمشاهدة جميع الأقسام
              </p>
              <button
                onClick={dismissOnboarding}
                className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
              >
                فهمت!
              </button>
            </div>
          </div>

          {/* Scroll Hint Arrows */}
          {hintDirection && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[101] animate-pulse">
              <div className="flex gap-8">
                {hintDirection === "right" && (
                  <ChevronRight className="w-8 h-8 text-white animate-bounce-right" />
                )}
                {hintDirection === "left" && (
                  <ChevronLeft className="w-8 h-8 text-white animate-bounce-left" />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* 🔝 Top Navigation Bar */}
      <nav 
        className={`
          fixed top-0 w-full h-[80px] bg-white/30 backdrop-blur-md z-50 shadow-md
          transition-all duration-200 ease-out
          ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">
          {/* Left Button */}
          <a
            href="https://pcpartpicker.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-red-600 hover:scale-110 transition"
            style={{ width: 76 }}
          >
            <LaptopIcon className="w-6 h-6" />
            <span className="text-xs mt-1">مقارنة كومبيوتر</span>
          </a>

          {/* Logo */}
          <a href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="w-12 sm:w-14 md:w-16"
            />
          </a>

          {/* Right Button */}
          <a
            href="https://www.notebookcheck.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-blue-800 hover:scale-110 transition"
            style={{ width: 76 }}
          >
            <MonitorIcon className="w-6 h-6" />
            <span className="text-xs mt-1">مقارنة لابتوب</span>
          </a>
        </div>
      </nav>

      {/* 🟣 Floating Bottom Categories Bar */}
      <div
        ref={categoriesRef}
        onScroll={handleCategoriesScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed left-1/2 -translate-x-1/2
          bottom-6
          z-[60]
          bg-white/90 backdrop-blur-md
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          rounded-full
          border border-white/40
          px-4 py-3
          w-[90%] max-w-[500px]
          overflow-x-auto
          flex gap-1
          scrollbar-hide
          transition-all duration-200 ease-out
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          ${showOnboarding ? 'z-[101]' : ''}
          select-none
        `}
      >
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <div
              key={link.name}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`
                flex flex-col items-center gap-1
                px-3 py-2 rounded-full
                transition-all duration-300
                min-w-[70px]
                cursor-default
                group
                ${
                  pathname === link.href
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <IconComponent className={`
                w-5 h-5 transition-all duration-300
                ${pathname === link.href ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}
              `} />
              <span className={`
                text-xs font-medium whitespace-nowrap
                ${pathname === link.href ? "text-gray-900 font-bold" : "text-gray-500"}
              `}>
                {link.name}
              </span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        @keyframes bounce-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
        .animate-bounce-right {
          animation: bounce-right 1s infinite;
        }
        .animate-bounce-left {
          animation: bounce-left 1s infinite;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}