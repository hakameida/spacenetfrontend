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
  Video,
  Download,
  Wrench,
  ExternalLink,
  X,
  Gamepad2,
  Camera
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const navLinks = [
  { name: "كمبيوتر", href: "/computer", icon: PcCase },
  { name: "اكسسوارات", href: "/accessories", icon: Headphones },
  { name: "لابتوبات", href: "/laptops", icon: LaptopIcon },
  { name: "بلايستيشن", href: "/playstations", icon: Gamepad2 },
  { name: "كاميرات", href: "/cameras", icon: Camera },
  { name: "بطاريات", href: "/batteries", icon: Battery },
];

// PWA install types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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

  // PWA Install states
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showDesktopBanner, setShowDesktopBanner] = useState(true);

  // Check if device is mobile
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      setShowInstallButton(false);
    }

    // Check for installed apps
    const checkInstalled = async () => {
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const apps = await (navigator as any).getInstalledRelatedApps();
          if (apps.length > 0) {
            setIsInstalled(true);
            setShowInstallButton(false);
          }
        } catch (err) {
          console.log('Error checking installed apps:', err);
        }
      }
    };
    checkInstalled();

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Check if first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenNavbarOnboarding");
    const isMobile = window.innerWidth < 768;
    
    if (!hasSeenOnboarding && isMobile) {
      setShowOnboarding(true);
      
      setTimeout(() => {
        if (categoriesRef.current) {
          const { scrollWidth, clientWidth } = categoriesRef.current;
          if (scrollWidth > clientWidth) {
            setHintDirection("right");
          }
        }
      }, 100);
    }

    // Check if desktop banner should be shown
    const bannerDismissed = localStorage.getItem("desktopInstallBannerDismissed");
    if (bannerDismissed) {
      setShowDesktopBanner(false);
    }
  }, []);

  // Handle PWA Install
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback: Show manual install instructions
      showManualInstallInstructions();
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowInstallButton(false);
      setShowDesktopBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  // Manual install instructions for browsers without prompt
  const showManualInstallInstructions = () => {
    const isMobile = window.innerWidth < 768;
    let message = '';
    
    if (isMobile) {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        message = 'للتثبيت: اضغط على زر المشاركة 📤 ثم اختر "إضافة إلى الشاشة الرئيسية"';
      } else {
        message = 'للتثبيت: اضغط على القائمة (⋮) ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"';
      }
    } else {
      message = 'للتثبيت: اضغط على زر القفل 🔒 في شريط العنوان ثم اختر "تثبيت" أو ابحث عن أيقونة التثبيت في شريط العنوان';
    }
    
    alert(message);
  };

  // Dismiss desktop banner
  const dismissDesktopBanner = () => {
    setShowDesktopBanner(false);
    localStorage.setItem("desktopInstallBannerDismissed", "true");
  };

  // Handle Open in App (for desktop)
  const handleOpenApp = () => {
    window.open(window.location.origin, '_blank');
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = Math.abs(x - startX);
    if (walk > 5) setHasMoved(true);
    e.preventDefault();
    const moveX = (x - startX) * 1.5;
    categoriesRef.current.scrollLeft = scrollLeft - moveX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setHasMoved(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setHasMoved(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (hasMoved) {
      e.preventDefault();
      return;
    }
    window.location.href = href;
  };

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
      {/* Onboarding Overlay */}
      {showOnboarding && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] animate-in fade-in duration-500"
            onClick={dismissOnboarding}
          />
          
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[101] text-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-2xl max-w-[300px]">
              <p className="text-gray-800 font-bold mb-2">✨ تصفح الأقسام</p>
              <p className="text-gray-600 text-sm mb-3">
                اسحب لليمين واليسار لمشاهدة جميع الأقسام
              </p>
              <button
                onClick={dismissOnboarding}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
              >
                فهمت!
              </button>
            </div>
          </div>

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

      {/* Top Navigation Bar */}
      <nav 
        className={`
          fixed top-0 w-full h-[56px] bg-white/30 backdrop-blur-md z-50 shadow-md
          transition-all duration-200 ease-out
          ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">
          
          {/* LEFT SIDE - Buttons Group */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Compare Button */}
            <a
              href="https://technical.city/en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-blue-600 hover:scale-110 transition px-2"
            >
              <MonitorIcon className="w-5 h-5 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs mt-0.5">مقارنة</span>
            </a>

            {/* Install/Open App/PC Build Button */}
            {showInstallButton && !isInstalled ? (
              <button
                onClick={handleInstallClick}
                className="flex flex-col items-center text-green-600 hover:scale-110 transition px-2"
              >
                <Download className="w-5 h-5 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs mt-0.5">تثبيت</span>
              </button>
            ) : isInstalled ? (
              <button
                onClick={handleOpenApp}
                className="flex flex-col items-center text-green-600 hover:scale-110 transition px-2"
              >
                <ExternalLink className="w-5 h-5 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs mt-0.5">فتح التطبيق</span>
              </button>
            ) : (
              <a
                href="/pc-build"
                className="flex flex-col items-center text-red-600 hover:scale-110 transition px-2"
              >
                <Wrench className="w-5 h-5 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs mt-0.5">جمع حاسوبك</span>
              </a>
            )}
          </div>

          {/* RIGHT SIDE - Logo */}
          <a href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12"
            />
          </a>

        </div>
      </nav>

      {/* Floating Bottom Categories Bar - More space on both ends */}
      <div
        ref={categoriesRef}
        onScroll={handleCategoriesScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed left-1/2 -translate-x-1/2
          bottom-4
          z-[60]
          bg-white/95 backdrop-blur-md
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          rounded-full
          border border-white/40
          py-1.5
          w-[75%] max-w-[500px]
          overflow-x-auto
          scrollbar-hide
          transition-all duration-200 ease-out
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          ${showOnboarding ? 'z-[101]' : ''}
          select-none
        `}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex justify-around items-center gap-1 px-1">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <div
                key={link.name}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`
                  flex flex-col items-center gap-0
                  py-1 px-1.5 rounded-full
                  transition-all duration-300
                  cursor-pointer
                  group
                  hover:bg-gray-100
                  ${pathname === link.href ? "bg-gray-100 text-gray-900" : "text-gray-500"}
                `}
              >
                <IconComponent className={`
                  w-4 h-4 transition-all duration-300
                  ${pathname === link.href ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}
                `} />
                <span className={`
                  text-[9px] font-medium whitespace-nowrap
                  ${pathname === link.href ? "text-gray-900 font-bold" : "text-gray-500"}
                `}>
                  {link.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Install Banner */}
      {!isInstalled && showInstallButton && showDesktopBanner && !isMobileDevice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[61] animate-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-3">
            <Download className="w-4 h-4" />
            <div className="text-right">
              <p className="text-xs font-bold">ثبّت التطبيق للوصول السريع</p>
              <p className="text-[10px] opacity-90">استخدم موقعنا كتطبيق مستقل</p>
            </div>
            <button 
              onClick={handleInstallClick}
              className="bg-white text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-100 transition shadow-md"
            >
              تثبيت
            </button>
            <button 
              onClick={dismissDesktopBanner}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

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