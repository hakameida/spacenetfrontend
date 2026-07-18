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
  Search,
  HardDrive,
  Server // NEW - for Case (PC Builds)
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

// ============ IMPORTS FROM YOUR REDUX ============
import { useAppSelector } from "@/store";
import { selectLaptopListList } from "@/data-access/slices/laptop-list";
import { selectAccessoryListList } from "@/data-access/slices/accessory-list";
import { selectComputerListList } from "@/data-access/slices/computer-list";
import { selectPlayStationListList } from "@/data-access/slices/playstation-list";
import { selectCameraListList } from "@/data-access/slices/camera-list";
import { selectStorageListList } from "@/data-access/slices/storage-list"; // NEW
import { selectCaseListList } from "@/data-access/slices/case-list"; // NEW

// ============ IMPORT API HOOKS TO FETCH PRODUCTS ============
import { useGetLaptopsListQuery } from "@/data-access/api/laptop";
import { useGetAccessoriesListQuery } from "@/data-access/api/accessory";
import { useGetComputersListQuery } from "@/data-access/api/computer";
import { useGetPlayStationsListQuery } from "@/data-access/api/playstation";
import { useGetCamerasListQuery } from "@/data-access/api/camera";
import { useGetStoragesListQuery } from "@/data-access/api/storage"; // NEW
import { useGetCasesListQuery } from "@/data-access/api/case"; // NEW

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
  capacity?: string; // NEW - for storage
  read_speed?: string; // NEW - for storage
  write_speed?: string; // NEW - for storage
  motherboard?: string; // NEW - for case
  psu?: string; // NEW - for case
  case?: string; // NEW - for case
  cooling?: string; // NEW - for case
  dynamicSpecs?: Array<{ key: string; value: string }>;
  [key: string]: any;
}

// All nav links with their paths
const allNavLinks = [
  { name: "كمبيوتر", href: "/computer", icon: PcCase },
  { name: "اكسسوارات", href: "/accessories", icon: Headphones },
  { name: "لابتوبات", href: "/laptops", icon: LaptopIcon },
  { name: "بلايستيشن", href: "/playstations", icon: Gamepad2 },
  { name: "كاميرات", href: "/cameras", icon: Camera },
  { name: "وحدات تخزين", href: "/storage", icon: HardDrive }, // Updated name
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
  const { isLoading: isLoadingStorages } = useGetStoragesListQuery({ status: true }); // NEW
  const { isLoading: isLoadingCases } = useGetCasesListQuery({ status: true }); // NEW

  // ============ GET PRODUCTS FROM REDUX ============
  const laptopList = useAppSelector(selectLaptopListList);
  const accessoryList = useAppSelector(selectAccessoryListList);
  const computerList = useAppSelector(selectComputerListList);
  const playstationList = useAppSelector(selectPlayStationListList);
  const cameraList = useAppSelector(selectCameraListList);
  const storageList = useAppSelector(selectStorageListList); // NEW
  const caseList = useAppSelector(selectCaseListList); // NEW

  // ============ COMBINE ALL PRODUCTS WITH TYPE CASTING ============
  const allProducts: SearchableProduct[] = [
    ...(Array.isArray(laptopList) ? (laptopList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(accessoryList) ? (accessoryList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(computerList) ? (computerList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(playstationList) ? (playstationList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(cameraList) ? (cameraList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(storageList) ? (storageList as unknown as SearchableProduct[]) : []), // NEW
    ...(Array.isArray(caseList) ? (caseList as unknown as SearchableProduct[]) : []), // NEW
  ];

  // ============ SEARCH FUNCTION ============
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    const results = allProducts.filter((product: SearchableProduct) => {
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
        product.capacity, // NEW - for storage
        product.read_speed, // NEW - for storage
        product.write_speed, // NEW - for storage
        product.motherboard, // NEW - for case
        product.psu, // NEW - for case
        product.case, // NEW - for case
        product.cooling, // NEW - for case
        ...(product.dynamicSpecs?.map((spec: any) => spec.value) || [])
      ].filter(Boolean);
      
      return searchableFields.some(field => 
        String(field).toLowerCase().includes(searchTerm)
      );
    });
    
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
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  // ============ CLOSE SEARCH ============
  const closeSearch = () => {
    setIsSearchOpen(false);
    document.body.style.overflow = 'unset';
    setSearchQuery("");
    setSearchResults([]);
  };

  // ============ HANDLE RESULT CLICK ============
  const handleResultClick = (product: SearchableProduct) => {
    let path = "";
    // Check for Laptop
    if (product.cpu !== undefined && !product.motherboard) {
      path = `/laptops/${product.id}`;
    }
    // Check for Case (PC Build) - has motherboard
    else if (product.motherboard) {
      path = `/computer/case/${product.id}`;
    }
    // Check for Storage - has capacity
    else if (product.capacity) {
      path = `/storage/${product.id}`;
    }
    // Check for Accessory
    else if (product.brand && product.type_name) {
      path = `/accessories/${product.id}`;
    }
    // Check for Computer
    else if (product.type_name && !product.storage) {
      path = `/computer/${product.id}`;
    }
    // Check for PlayStation
    else if (product.storage) {
      path = `/playstations/${product.id}`;
    }
    // Check for Camera
    else if (product.sensor_type || product.megapixels) {
      path = `/cameras/${product.id}`;
    }
    else {
      path = `/search/${encodeURIComponent(searchQuery)}`;
    }
    
    router.push(path);
    closeSearch();
  };

  // ============ GET IMAGE FOR PRODUCT ============
  const getProductImage = (product: SearchableProduct) => {
    const imageUrl = product.image || product.image1 || product.url1 || "";
    return getImage(imageUrl);
  };

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

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Filter navLinks to exclude the current page
  const filteredNavLinks = allNavLinks.filter(link => link.href !== pathname);

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

      {/* FLOATING SEARCH BUTTON */}
      <button
        onClick={openSearch}
        className={`
          fixed z-[70] transition-all duration-300 ease-out
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          left-4 top-[70px]
          flex items-center gap-2 px-4 py-2.5
          bg-white/80 backdrop-blur-md
          border border-white/20
          rounded-full shadow-lg
          hover:bg-white/90 hover:shadow-xl
          transition-all duration-300
          group
        `}
      >
        <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors hidden sm:inline">
          ابحث عن منتج...
        </span>
        <span className="text-xs text-gray-400 hidden sm:inline">⌘K</span>
      </button>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeSearch}
          />
          
          <div className="relative w-full max-w-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="ابحث عن منتج..."
                    className="w-full px-12 py-3.5 text-lg text-white bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder:text-white/40"
                    dir="rtl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-white/10 rounded-full p-1 transition-colors"
                    >
                      <X className="w-5 h-5 text-white/60" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {(isLoadingLaptops || isLoadingAccessories || isLoadingComputers || isLoadingPlaystations || isLoadingCameras || isLoadingStorages || isLoadingCases) && (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
                      <span className="text-white/70">جاري البحث...</span>
                    </div>
                  </div>
                )}

                {!isLoadingLaptops && !isLoadingAccessories && !isLoadingComputers && !isLoadingPlaystations && !isLoadingCameras && !isLoadingStorages && !isLoadingCases &&
                 searchQuery.length >= 2 && searchResults.length > 0 && (
                  <>
                    {searchResults.map((product, index) => {
                      const imageUrl = getProductImage(product);
                      return (
                        <div
                          key={product.id || index}
                          onClick={() => handleResultClick(product)}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                        >
                          {imageUrl && (
                            <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{product.name}</p>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                              {product.price && <span>${parseFloat(product.price).toFixed(2)}</span>}
                              {product.brand && <span className="text-blue-300">{product.brand}</span>}
                              {product.type_name && <span className="text-purple-300">{product.type_name}</span>}
                            </div>
                          </div>
                          <ChevronLeft className="w-4 h-4 text-white/30" />
                        </div>
                      );
                    })}
                    
                    <div className="px-4 py-3 border-t border-white/10">
                      <button
                        onClick={() => {
                          router.push(`/search/${encodeURIComponent(searchQuery)}`);
                          closeSearch();
                        }}
                        className="w-full text-center text-sm text-white/70 hover:text-white font-medium py-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        عرض جميع النتائج ({searchResults.length})
                      </button>
                    </div>
                  </>
                )}

                {!isLoadingLaptops && !isLoadingAccessories && !isLoadingComputers && !isLoadingPlaystations && !isLoadingCameras && !isLoadingStorages && !isLoadingCases &&
                 searchQuery.length >= 2 && searchResults.length === 0 && allProducts.length > 0 && (
                  <div className="p-8 text-center">
                    <p className="text-white/60">لا توجد نتائج مطابقة لـ &quot;{searchQuery}&quot;</p>
                    <button
                      onClick={() => {
                        router.push(`/search/${encodeURIComponent(searchQuery)}`);
                        closeSearch();
                      }}
                      className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-medium"
                    >
                      البحث عن &quot;{searchQuery}&quot; في جميع المنتجات
                    </button>
                  </div>
                )}

                {searchQuery.length < 2 && (
                  <div className="p-6 text-center text-white/40 text-sm">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>ابحث عن منتجات، ماركات، أو تصنيفات</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <button 
                        onClick={() => {
                          setSearchQuery("لابتوب");
                          handleSearch("لابتوب");
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/60 transition-colors"
                      >
                        💻 لابتوب
                      </button>
                      <button 
                        onClick={() => {
                          setSearchQuery("ماوس");
                          handleSearch("ماوس");
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/60 transition-colors"
                      >
                        🖱️ ماوس
                      </button>
                      <button 
                        onClick={() => {
                          setSearchQuery("كيبورد");
                          handleSearch("كيبورد");
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/60 transition-colors"
                      >
                        ⌨️ كيبورد
                      </button>
                      <button 
                        onClick={() => {
                          setSearchQuery("بلايستيشن");
                          handleSearch("بلايستيشن");
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/60 transition-colors"
                      >
                        🎮 بلايستيشن
                      </button>
                      <button 
                        onClick={() => {
                          setSearchQuery("SSD");
                          handleSearch("SSD");
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/60 transition-colors"
                      >
                        💾 SSD
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/5 text-center">
                <p className="text-white/30 text-xs">
                  اضغط ESC أو انقر خارج النافذة للإغلاق
                </p>
              </div>
            </div>
          </div>
        </div>
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
          px-2
          w-[95%] max-w-[700px]
          overflow-x-auto
          scrollbar-hide
          transition-all duration-200 ease-out
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          ${showOnboarding ? 'z-[101]' : ''}
          select-none
        `}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex justify-around items-center gap-0.5">
          {filteredNavLinks.map((link) => {
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
                  text-gray-500
                  min-w-[50px]
                `}
              >
                <IconComponent className={`
                  w-3.5 h-3.5 transition-all duration-300
                  text-gray-500 group-hover:text-gray-700
                `} />
                <span className={`
                  text-[8px] font-medium whitespace-nowrap
                  text-gray-500
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
        .slide-in-from-top-4 {
          animation: slideInFromTop 0.3s ease-out;
        }
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}