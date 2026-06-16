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
  Camera,
  Search
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

// ============ IMPORTS FROM YOUR REDUX ============
import { useAppSelector } from "@/store";
import { selectLaptopListList } from "@/data-access/slices/product-list";
import { selectAccessoryListList } from "@/data-access/slices/accessory-list";
import { selectComputerListList } from "@/data-access/slices/computer-list";
import { selectPlayStationListList } from "@/data-access/slices/playstation-list";
import { selectCameraListList } from "@/data-access/slices/camera-list";

// ============ IMPORT API HOOKS TO FETCH PRODUCTS ============
import { useGetLaptopsListQuery } from "@/data-access/api/laptop";
import { useGetAccessoriesListQuery } from "@/data-access/api/accessory";
import { useGetComputersListQuery } from "@/data-access/api/computer";
import { useGetPlayStationsListQuery } from "@/data-access/api/playstation";
import { useGetCamerasListQuery } from "@/data-access/api/camera";

// ============ IMPORT getImage UTILITY ============
import { getImage } from "@/util/get-image-url";

// ============ DEFINE THE PRODUCT TYPE ============
interface SearchableProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  image1?: string;
  url1?: string;
  brand?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  hard?: string;
  screen?: string;
  color?: string;
  os?: string;
  type_name?: string;
  type_id?: string;
  sensor_type?: string;
  megapixels?: string;
  video_resolution?: string;
  lens_mount?: string;
  storage?: string;
  model_number?: string;
  compatibility?: string;
  dynamicSpecs?: Array<{ key: string; value: string }>;
  [key: string]: any;
}

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
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hintDirection, setHintDirection] = useState<"left" | "right" | null>(null);
  const lastScrollY = useRef(0);
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchableProduct[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
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

  // ============ FETCH ALL PRODUCTS ============
  const { isLoading: isLoadingLaptops } = useGetLaptopsListQuery({ status: true });
  const { isLoading: isLoadingAccessories } = useGetAccessoriesListQuery({ status: true });
  const { isLoading: isLoadingComputers } = useGetComputersListQuery({ status: true });
  const { isLoading: isLoadingPlaystations } = useGetPlayStationsListQuery({ status: true });
  const { isLoading: isLoadingCameras } = useGetCamerasListQuery({ status: true });

  // ============ GET PRODUCTS FROM REDUX ============
  const laptopList = useAppSelector(selectLaptopListList);
  const accessoryList = useAppSelector(selectAccessoryListList);
  const computerList = useAppSelector(selectComputerListList);
  const playstationList = useAppSelector(selectPlayStationListList);
  const cameraList = useAppSelector(selectCameraListList);

  // ============ COMBINE ALL PRODUCTS WITH TYPE CASTING ============
  const allProducts: SearchableProduct[] = [
    ...(Array.isArray(laptopList) ? (laptopList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(accessoryList) ? (accessoryList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(computerList) ? (computerList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(playstationList) ? (playstationList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(cameraList) ? (cameraList as unknown as SearchableProduct[]) : []),
  ];

  // ============ DEBUG: LOG ALL PRODUCTS ============
  useEffect(() => {
    const totalProducts = (laptopList?.length || 0) + 
                          (accessoryList?.length || 0) + 
                          (computerList?.length || 0) + 
                          (playstationList?.length || 0) + 
                          (cameraList?.length || 0);
    
    console.log("===== SEARCH DEBUG =====");
    console.log("Loading states:", {
      laptops: isLoadingLaptops,
      accessories: isLoadingAccessories,
      computers: isLoadingComputers,
      playstations: isLoadingPlaystations,
      cameras: isLoadingCameras
    });
    console.log("Laptop List:", laptopList?.length || 0, "items");
    console.log("Accessory List:", accessoryList?.length || 0, "items");
    console.log("Computer List:", computerList?.length || 0, "items");
    console.log("PlayStation List:", playstationList?.length || 0, "items");
    console.log("Camera List:", cameraList?.length || 0, "items");
    console.log("TOTAL PRODUCTS:", totalProducts);
    
    // Log first item of each list to see structure
    if (laptopList && laptopList.length > 0) {
      console.log("Sample Laptop:", laptopList[0]);
    }
    if (accessoryList && accessoryList.length > 0) {
      console.log("Sample Accessory:", accessoryList[0]);
    }
    if (computerList && computerList.length > 0) {
      console.log("Sample Computer:", computerList[0]);
    }
    if (playstationList && playstationList.length > 0) {
      console.log("Sample PlayStation:", playstationList[0]);
    }
    if (cameraList && cameraList.length > 0) {
      console.log("Sample Camera:", cameraList[0]);
    }
  }, [laptopList, accessoryList, computerList, playstationList, cameraList, 
      isLoadingLaptops, isLoadingAccessories, isLoadingComputers, isLoadingPlaystations, isLoadingCameras]);

  // ============ SEARCH FUNCTION ============
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    console.log("Searching for:", query);
    console.log("Total products available:", allProducts.length);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    const results = allProducts.filter((product: SearchableProduct) => {
      // Get all possible searchable fields
      const searchableFields = [
        product.name,
        product.brand,
        product.cpu,
        product.gpu,
        product.ram,
        product.hard,
        product.screen,
        product.color,
        product.os,
        product.type_name,
        product.description,
        product.model_number,
        product.compatibility,
        product.sensor_type,
        product.megapixels,
        product.video_resolution,
        product.lens_mount,
        product.storage,
        // Also check any dynamic specs if they exist
        ...(product.dynamicSpecs?.map((spec: any) => spec.value) || [])
      ].filter(Boolean);
      
      // Check if any field contains the search term
      return searchableFields.some(field => 
        String(field).toLowerCase().includes(searchTerm)
      );
    });
    
    console.log("Search results found:", results.length);
    setSearchResults(results.slice(0, 10));
  };

  // ============ HANDLE SEARCH SUBMIT ============
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // ============ OPEN SEARCH ============
  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // ============ CLOSE SEARCH ============
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // ============ HANDLE RESULT CLICK ============
  const handleResultClick = (product: SearchableProduct) => {
    let path = "";
    if (product.cpu !== undefined) path = `/laptops/${product.id}`;
    else if (product.brand && product.type_name) path = `/accessories/${product.id}`;
    else if (product.type_name) path = `/computer/${product.id}`;
    else if (product.storage) path = `/playstations/${product.id}`;
    else if (product.sensor_type || product.megapixels) path = `/cameras/${product.id}`;
    else path = `/search/${encodeURIComponent(searchQuery)}`;
    
    router.push(path);
    closeSearch();
  };

  // ============ GET IMAGE FOR PRODUCT ============
  const getProductImage = (product: SearchableProduct) => {
    // Try different image fields
    const imageUrl = product.image || product.image1 || product.url1 || "";
    return getImage(imageUrl);
  };

  // ... REST OF YOUR EXISTING CODE (keep everything the same from here) ...

  // ============ THE REST OF YOUR COMPONENT CODE ============
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      setShowInstallButton(false);
    }

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

    const bannerDismissed = localStorage.getItem("desktopInstallBannerDismissed");
    if (bannerDismissed) {
      setShowDesktopBanner(false);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      showManualInstallInstructions();
      return;
    }

    await deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowInstallButton(false);
      setShowDesktopBanner(false);
    }
    
    setDeferredPrompt(null);
  };

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

  const dismissDesktopBanner = () => {
    setShowDesktopBanner(false);
    localStorage.setItem("desktopInstallBannerDismissed", "true");
  };

  const handleOpenApp = () => {
    window.open(window.location.origin, '_blank');
  };

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

      {/* Top Navigation Bar with Search */}
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
            <a
              href="https://technical.city/en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-blue-600 hover:scale-110 transition px-2"
            >
              <MonitorIcon className="w-5 h-5 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs mt-0.5">مقارنة</span>
            </a>

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

          {/* CENTER - Search */}
          <div className="flex-1 flex justify-center">
            {!isSearchOpen ? (
              <button
                onClick={openSearch}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <div className="relative w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="ابحث عن منتج..."
                    className="w-full px-10 py-2 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    dir="rtl"
                  />
                  <button
                    onClick={closeSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-200 rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Loading State */}
                {(isLoadingLaptops || isLoadingAccessories || isLoadingComputers || isLoadingPlaystations || isLoadingCameras) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-center z-50">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500 text-sm">جاري تحميل المنتجات...</span>
                    </div>
                  </div>
                )}

                {/* Search Results Dropdown */}
                {!isLoadingLaptops && !isLoadingAccessories && !isLoadingComputers && !isLoadingPlaystations && !isLoadingCameras && 
                 searchQuery.length >= 2 && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                    {searchResults.map((product, index) => {
                      const imageUrl = getProductImage(product);
                      return (
                        <div
                          key={product.id || index}
                          onClick={() => handleResultClick(product)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                        >
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-10 h-10 object-contain rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {product.price && <span>${parseFloat(product.price).toFixed(2)}</span>}
                              {product.brand && <span className="text-blue-600">{product.brand}</span>}
                              {product.type_name && <span className="text-purple-600">{product.type_name}</span>}
                              {product.cpu && <span className="text-gray-400">{product.cpu}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          router.push(`/search/${encodeURIComponent(searchQuery)}`);
                          closeSearch();
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        عرض جميع النتائج ({searchResults.length})
                      </button>
                    </div>
                  </div>
                )}

                {/* No results message */}
                {!isLoadingLaptops && !isLoadingAccessories && !isLoadingComputers && !isLoadingPlaystations && !isLoadingCameras &&
                 searchQuery.length >= 2 && searchResults.length === 0 && allProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center z-50">
                    <p className="text-gray-500">لا توجد نتائج مطابقة لـ "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        router.push(`/search/${encodeURIComponent(searchQuery)}`);
                        closeSearch();
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      البحث عن "{searchQuery}" في جميع المنتجات
                    </button>
                  </div>
                )}
              </div>
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

      {/* Search Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSearch}
        />
      )}

      {/* Floating Bottom Categories Bar */}
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