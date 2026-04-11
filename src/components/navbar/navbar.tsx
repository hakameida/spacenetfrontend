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
  CheckCircle,
  Home,
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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
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
  const [installSuccess, setInstallSuccess] = useState(false);

  // Register SW + listen for install prompt
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) setIsInstalled(true);

    if ("getInstalledRelatedApps" in navigator) {
      (navigator as any).getInstalledRelatedApps()
        .then((apps: any[]) => { if (apps.length > 0) setIsInstalled(true); })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenNavbarOnboarding");
    const isMobile = window.innerWidth < 768;
    if (!hasSeenOnboarding && isMobile) {
      setShowOnboarding(true);
      setTimeout(() => {
        if (categoriesRef.current) {
          const { scrollWidth, clientWidth } = categoriesRef.current;
          if (scrollWidth > clientWidth) setHintDirection("right");
        }
      }, 100);
    }
  }, []);

  // ─── PWA Install: fires immediately on tap ───────────────────────────────
  const handleInstallClick = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      // Supported browsers (Chrome/Edge Android): show native prompt directly
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: iOS / unsupported browsers → show instructions alert
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert("لتثبيت التطبيق على iOS:\n1. اضغط على زر المشاركة 📤\n2. اختر «إضافة إلى الشاشة الرئيسية»\n3. اضغط «إضافة»");
      } else {
        alert("لتثبيت التطبيق:\n1. اضغط على زر القائمة (⋮) في المتصفح\n2. اختر «تثبيت التطبيق» أو «Add to Home Screen»");
      }
    }
  };

  // Drag to scroll
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
    if (Math.abs(x - startX) > 5) setHasMoved(true);
    e.preventDefault();
    categoriesRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };
  const handleMouseUp = () => { setIsDragging(false); setHasMoved(false); };
  const handleMouseLeave = () => { if (isDragging) { setIsDragging(false); setHasMoved(false); } };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (hasMoved) { e.preventDefault(); return; }
    window.location.href = href;
  };

  const handleCategoriesScroll = () => {
    if (categoriesRef.current && showOnboarding) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      const isAtStart = scrollLeft < 10;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      if (!isAtStart && !isAtEnd) setHintDirection(null);
      else if (isAtStart && scrollWidth > clientWidth) setHintDirection("right");
      else if (isAtEnd) setHintDirection("left");
    }
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasSeenNavbarOnboarding", "true");
  };

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) setVisible(true);
      else if (currentScrollY < lastScrollY.current) setVisible(true);
      else if (currentScrollY > lastScrollY.current) setVisible(false);
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
              <p className="text-gray-600 text-sm mb-3">اسحب لليمين واليسار لمشاهدة جميع الأقسام</p>
              <button
                onClick={dismissOnboarding}
                className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
              >
                فهمت!
              </button>
            </div>
          </div>
          {hintDirection && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[101] animate-pulse">
              <div className="flex gap-8">
                {hintDirection === "right" && <ChevronRight className="w-8 h-8 text-white animate-bounce-right" />}
                {hintDirection === "left" && <ChevronLeft className="w-8 h-8 text-white animate-bounce-left" />}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Install success toast ── */}
      {installSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-green-500 text-white px-5 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
            تم تثبيت التطبيق بنجاح!
          </div>
        </div>
      )}

      {/* ── Top Navigation Bar ── */}
      <nav
        className={`
          fixed top-0 w-full h-[80px] bg-white/30 backdrop-blur-md z-50 shadow-md
          transition-all duration-200 ease-out
          ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <div className="flex justify-between items-center px-4 h-full max-w-7xl mx-auto">

          {/* ── Left: Compare ── */}
          <a
            href="https://technical.city/en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-blue-800 hover:scale-110 transition"
            style={{ width: 76 }}
          >
            <MonitorIcon className="w-6 h-6" />
            <span className="text-xs mt-1">مقارنة</span>
          </a>

          {/* ── Center: Logo ── */}
          <a href="/">
            <Image src="/logo.png" alt="Logo" width={64} height={64} className="w-12 sm:w-14 md:w-16" />
          </a>

          {/* ── Right: TWO icons always visible ── */}
          <div className="flex items-center gap-2" style={{ width: 76 }}>
            {/* PC Builder */}
            <a
              href="/pc-build"
              className="flex flex-col items-center text-blue-800 hover:scale-110 transition"
            >
              <Wrench className="w-5 h-5" />
              <span className="text-[10px] mt-1 whitespace-nowrap">جمع حاسوب</span>
            </a>

            {/* Install / Installed */}
            <button
              onClick={handleInstallClick}
              className={`flex flex-col items-center transition hover:scale-110 ${
                isInstalled ? "text-green-500 cursor-default" : "text-red-600"
              }`}
              disabled={isInstalled}
              title={isInstalled ? "التطبيق مثبت" : "تثبيت التطبيق"}
            >
              <div className="relative">
                {isInstalled ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    {/* Pulsing dot */}
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                  </>
                )}
              </div>
              <span className="text-[10px] mt-1">{isInstalled ? "مثبت" : "تثبيت"}</span>
            </button>
          </div>

        </div>
      </nav>

      {/* ── Floating Bottom Categories Bar ── */}
      <div
        ref={categoriesRef}
        onScroll={handleCategoriesScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed left-1/2 -translate-x-1/2
          bottom-6 z-[60]
          bg-white/90 backdrop-blur-md
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          rounded-full border border-white/40
          px-4 py-3
          w-[90%] max-w-[500px]
          overflow-x-auto flex gap-1
          scrollbar-hide
          transition-all duration-200 ease-out
          ${visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}
          ${showOnboarding ? "z-[101]" : ""}
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
                min-w-[70px] cursor-default group
                ${pathname === link.href ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}
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
        .animate-bounce-right { animation: bounce-right 1s infinite; }
        .animate-bounce-left  { animation: bounce-left  1s infinite; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}