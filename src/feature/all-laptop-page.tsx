"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetLaptopsListQuery } from "@/data-access/api/laptop";
import { useAppSelector } from "@/store";
import { selectLaptopListList, LaptopItem } from "@/data-access/slices/laptop-list";
import LaptopList from "../feature/laptop-list";
import { FiX, FiSearch, FiChevronDown, FiChevronUp, FiSliders } from "react-icons/fi";

interface FilterState {
  brands: string[];
  cpu: string[];
  gpu: string[];
  ram: string[];
  storage: string[];
  screenSize: string[];
  age: string[];
  minPrice: string;
  maxPrice: string;
  manualSearch: string;
}

// Track expanded state for each filter section
interface FilterSectionsState {
  brands: boolean;
  cpu: boolean;
  gpu: boolean;
  ram: boolean;
  storage: boolean;
  screenSize: boolean;
  age: boolean;
}

// Track showAll state for each filter section
interface ShowAllState {
  brands: boolean;
  cpu: boolean;
  gpu: boolean;
  ram: boolean;
  storage: boolean;
  screenSize: boolean;
  age: boolean;
}

// Extract unique values from laptop data
const useExtractedFilters = (laptops: LaptopItem[]) => {
  return useMemo(() => {
    const brands = new Set<string>();
    const cpus = new Set<string>();
    const gpus = new Set<string>();
    const rams = new Set<string>();
    const storages = new Set<string>();
    const screenSizes = new Set<string>();
    const ages = new Set<string>();

    laptops.forEach(laptop => {
      const firstWord = laptop.name?.split(' ')[0];
      if (firstWord) brands.add(firstWord);

      if (laptop.cpu) cpus.add(laptop.cpu);
      if (laptop.gpu) gpus.add(laptop.gpu);
      if (laptop.ram) {
        const ramMatch = laptop.ram.match(/(\d+)/);
        if (ramMatch) rams.add(`${ramMatch[1]}GB`);
        else rams.add(laptop.ram);
      }
      if (laptop.hard) {
        const storageMatch = laptop.hard.match(/(\d+)\s*(GB|TB)/i);
        if (storageMatch) storages.add(`${storageMatch[1]}${storageMatch[2].toUpperCase()}`);
        else storages.add(laptop.hard);
      }
      if (laptop.screen) {
        const screenMatch = laptop.screen.match(/(\d+\.?\d*)/);
        if (screenMatch) screenSizes.add(`${screenMatch[1]}"`);
        else screenSizes.add(laptop.screen);
      }

      laptop.dynamicSpecs?.forEach(spec => {
        const key = spec.key.toLowerCase();
        const value = spec.value;
        
        if ((key.includes('cpu') || key.includes('معالج') || key.includes('processor')) && !laptop.cpu) {
          cpus.add(value);
        } else if ((key.includes('gpu') || key.includes('كرت') || key.includes('graphics') || key.includes('vga')) && !laptop.gpu) {
          gpus.add(value);
        } else if ((key.includes('ram') || key.includes('رام') || key.includes('memory')) && !laptop.ram) {
          const ramMatch = value.match(/(\d+)/);
          if (ramMatch) rams.add(`${ramMatch[1]}GB`);
          else rams.add(value);
        } else if ((key.includes('storage') || key.includes('تخزين') || key.includes('ssd') || key.includes('hdd') || key.includes('hard')) && !laptop.hard) {
          const storageMatch = value.match(/(\d+)\s*(GB|TB)/i);
          if (storageMatch) storages.add(`${storageMatch[1]}${storageMatch[2].toUpperCase()}`);
          else storages.add(value);
        } else if ((key.includes('screen') || key.includes('شاشة') || key.includes('display')) && !laptop.screen) {
          const screenMatch = value.match(/(\d+\.?\d*)/);
          if (screenMatch) screenSizes.add(`${screenMatch[1]}"`);
          else screenSizes.add(value);
        }
      });

      if (laptop.age) {
        if (laptop.age === 'جديد' || laptop.age === 'new' || laptop.age === 'New') {
          ages.add('جديد');
        } else if (laptop.age === 'مستعمل' || laptop.age === 'used' || laptop.age === 'Used') {
          ages.add('مستعمل');
        } else if (laptop.age === 'اوبن بوكس' || laptop.age === 'openbox' || laptop.age === 'Open Box') {
          ages.add('اوبن بوكس');
        } else {
          ages.add(laptop.age);
        }
      }
    });

    return {
      brands: Array.from(brands).sort(),
      cpus: Array.from(cpus).sort(),
      gpus: Array.from(gpus).sort(),
      rams: Array.from(rams).sort((a, b) => {
        const aNum = parseInt(a) || 0;
        const bNum = parseInt(b) || 0;
        return aNum - bNum;
      }),
      storages: Array.from(storages).sort((a, b) => {
        const aNum = parseInt(a) || 0;
        const bNum = parseInt(b) || 0;
        return aNum - bNum;
      }),
      screenSizes: Array.from(screenSizes).sort((a, b) => {
        const aNum = parseFloat(a) || 0;
        const bNum = parseFloat(b) || 0;
        return aNum - bNum;
      }),
      ages: Array.from(ages),
    };
  }, [laptops]);
};

const sortProductsByPrice = (products: LaptopItem[], direction: "asc" | "desc") => {
  if (!products || products.length === 0) return [];
  return [...products].sort((a, b) => {
    const aIsSoon = a.price === "0.00";
    const bIsSoon = b.price === "0.00";
    
    if (aIsSoon && !bIsSoon) return 1;
    if (!aIsSoon && bIsSoon) return -1;
    if (aIsSoon && bIsSoon) return 0;
    
    return direction === "asc"
      ? parseFloat(a.price || "0") - parseFloat(b.price || "0")
      : parseFloat(b.price || "0") - parseFloat(a.price || "0");
  });
};

// Fixed FilterSectionWithShowMore - now accepts showAll state from parent
const FilterSectionWithShowMore = ({ 
  title, 
  options, 
  selectedValues, 
  onToggle,
  showAll,
  onToggleShowAll,
  defaultShowCount = 5,
  sectionKey
}: { 
  title: string; 
  options: string[]; 
  selectedValues: string[];
  onToggle: (value: string) => void;
  showAll: boolean;
  onToggleShowAll: (key: string) => void;
  defaultShowCount?: number;
  sectionKey: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const visibleOptions = showAll ? options : options.slice(0, defaultShowCount);
  const hasMore = options.length > defaultShowCount;

  if (options.length === 0) return null;

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span>{title} ({options.length})</span>
        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      
      {isExpanded && (
        <div className="mt-3">
          <div className="max-h-52 overflow-y-auto pr-2 space-y-2">
            {visibleOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => onToggle(option)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors break-words">
                  {option}
                </span>
              </label>
            ))}
          </div>
          
          {hasMore && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleShowAll(sectionKey);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
            >
              {showAll ? "عرض أقل" : `عرض ${options.length - defaultShowCount} المزيد`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const AllLaptopPage = ({ title }: { title: string }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
  });

  // State for "Show More" in each filter section - moved to parent to prevent re-renders from resetting
  const [showAllState, setShowAllState] = useState<ShowAllState>({
    brands: false,
    cpu: false,
    gpu: false,
    ram: false,
    storage: false,
    screenSize: false,
    age: false,
  });

  const { isLoading } = useGetLaptopsListQuery({ status: true });
  console.log("Laptops loading:", isLoading);
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    cpu: [],
    gpu: [],
    ram: [],
    storage: [],
    screenSize: [],
    age: [],
    minPrice: "",
    maxPrice: "",
    manualSearch: ""
  });

  // Prevent body scroll when filter drawer is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
      // Also add a class to the html element to ensure no scrolling
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData?.data?.dollarPriceByPk?.dollarPrice ?? 0);
    }
  }, [dollarData]);

  const laptopListRaw = useAppSelector(selectLaptopListList);
  const laptopList: LaptopItem[] = Array.isArray(laptopListRaw) ? laptopListRaw : [];
  const sortedLaptopList = sortProductsByPrice(laptopList, sortDirection);
  
  const availableFilters = useExtractedFilters(sortedLaptopList);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterToggle = (type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[type] as string[];
      return {
        ...prev,
        [type]: currentArray.includes(value)
          ? currentArray.filter(v => v !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleManualSearch = (value: string) => {
    setFilters(prev => ({ ...prev, manualSearch: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      cpu: [],
      gpu: [],
      ram: [],
      storage: [],
      screenSize: [],
      age: [],
      minPrice: "",
      maxPrice: "",
      manualSearch: ""
    });
  };

  const handleToggleShowAll = (sectionKey: string) => {
    setShowAllState(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey as keyof ShowAllState]
    }));
  };

  const activeFiltersCount = useMemo(() => {
    return filters.brands.length +
           filters.cpu.length +
           filters.gpu.length +
           filters.ram.length +
           filters.storage.length +
           filters.screenSize.length +
           filters.age.length +
           (filters.minPrice ? 1 : 0) +
           (filters.maxPrice ? 1 : 0);
  }, [filters]);

  const normalizeAge = (age: string): string => {
    if (age === 'جديد' || age === 'new' || age === 'New') return 'جديد';
    if (age === 'مستعمل' || age === 'used' || age === 'Used') return 'مستعمل';
    if (age === 'اوبن بوكس' || age === 'openbox' || age === 'Open Box') return 'اوبن بوكس';
    return age;
  };

  const filteredProductList = sortedLaptopList.filter((product) => {
    if (!product) return false;
    
    if (filters.brands.length > 0) {
      const productBrand = product.name?.split(' ')[0] || '';
      if (!filters.brands.includes(productBrand)) return false;
    }

    if (filters.age.length > 0) {
      const normalizedAge = normalizeAge(product.age || '');
      if (!filters.age.includes(normalizedAge)) return false;
    }

    if (filters.minPrice || filters.maxPrice) {
      const price = parseFloat(product.price || "0");
      if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
    }

    if (filters.cpu.length > 0) {
      if (!product.cpu || !filters.cpu.includes(product.cpu)) return false;
    }

    if (filters.gpu.length > 0) {
      if (!product.gpu || !filters.gpu.includes(product.gpu)) return false;
    }

    if (filters.ram.length > 0) {
      const ramMatch = product.ram?.match(/(\d+)/);
      const ramValue = ramMatch ? `${ramMatch[1]}GB` : product.ram;
      if (!ramValue || !filters.ram.includes(ramValue)) return false;
    }

    if (filters.storage.length > 0) {
      const storageMatch = product.hard?.match(/(\d+)\s*(GB|TB)/i);
      const storageValue = storageMatch ? `${storageMatch[1]}${storageMatch[2].toUpperCase()}` : product.hard;
      if (!storageValue || !filters.storage.includes(storageValue)) return false;
    }

    if (filters.screenSize.length > 0) {
      const screenMatch = product.screen?.match(/(\d+\.?\d*)/);
      const screenValue = screenMatch ? `${screenMatch[1]}"` : product.screen;
      if (!screenValue || !filters.screenSize.includes(screenValue)) return false;
    }

    if (filters.manualSearch.trim() !== "") {
      const searchTerm = filters.manualSearch.toLowerCase();
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm) ||
                           product.description?.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-blue-700 rounded-full p-0.5">
        <FiX size={14} />
      </button>
    </span>
  );

  // Fixed FilterContent - price inputs now properly contained
  const FilterContent = () => (
    <div className="space-y-1">
      <div className="border-b border-gray-200 py-3">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700"
        >
          <span>السعر ($)</span>
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSections.price && (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2 w-full">
              <div className="flex-1 min-w-0">
                <input
                  type="number"
                  placeholder="من"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="number"
                  placeholder="إلى"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <FilterSectionWithShowMore 
        sectionKey="brands"
        title="العلامة التجارية" 
        options={availableFilters.brands} 
        selectedValues={filters.brands}
        onToggle={(value) => handleFilterToggle("brands", value)}
        showAll={showAllState.brands}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore 
        sectionKey="age"
        title="الحالة" 
        options={['جديد', 'مستعمل', 'اوبن بوكس']} 
        selectedValues={filters.age}
        onToggle={(value) => handleFilterToggle("age", value)}
        showAll={showAllState.age}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={3}
      />

      <FilterSectionWithShowMore 
        sectionKey="cpu"
        title="المعالج (CPU)" 
        options={availableFilters.cpus} 
        selectedValues={filters.cpu}
        onToggle={(value) => handleFilterToggle("cpu", value)}
        showAll={showAllState.cpu}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore 
        sectionKey="gpu"
        title="كرت الشاشة (GPU)" 
        options={availableFilters.gpus} 
        selectedValues={filters.gpu}
        onToggle={(value) => handleFilterToggle("gpu", value)}
        showAll={showAllState.gpu}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore 
        sectionKey="ram"
        title="الذاكرة (RAM)" 
        options={availableFilters.rams} 
        selectedValues={filters.ram}
        onToggle={(value) => handleFilterToggle("ram", value)}
        showAll={showAllState.ram}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore 
        sectionKey="storage"
        title="التخزين (Storage)" 
        options={availableFilters.storages} 
        selectedValues={filters.storage}
        onToggle={(value) => handleFilterToggle("storage", value)}
        showAll={showAllState.storage}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore 
        sectionKey="screenSize"
        title="حجم الشاشة" 
        options={availableFilters.screenSizes} 
        selectedValues={filters.screenSize}
        onToggle={(value) => handleFilterToggle("screenSize", value)}
        showAll={showAllState.screenSize}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />
    </div>
  );

  return (
    <>
      <div className="my-[10px] flex items-center justify-between">
        <h2 className="md:text-[34px] text-[20px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm py-3 mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ابحث..."
              value={filters.manualSearch}
              onChange={(e) => handleManualSearch(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {filters.manualSearch && (
              <button
                onClick={() => handleManualSearch("")}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <FiSliders size={18} />
            <span className="hidden xs:inline text-sm sm:text-base">فلتر</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs flex items-center justify-center font-bold bg-blue-600 text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all text-sm sm:text-base"
            onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            <span className="hidden sm:inline">
              {sortDirection === "asc" ? "الأقل سعراً" : "الأعلى سعراً"}
            </span>
            <span className="sm:hidden text-lg">
              {sortDirection === "asc" ? "⬆️" : "⬇️"}
            </span>
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs sm:text-sm text-gray-500">الفلاتر:</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {filters.brands.map(brand => (
                <FilterChip key={brand} label={brand} onRemove={() => handleFilterToggle("brands", brand)} />
              ))}
              {filters.age.map(age => (
                <FilterChip key={age} label={age} onRemove={() => handleFilterToggle("age", age)} />
              ))}
              {filters.cpu.map(cpu => (
                <FilterChip key={cpu} label={cpu.substring(0, 15) + (cpu.length > 15 ? '...' : '')} onRemove={() => handleFilterToggle("cpu", cpu)} />
              ))}
              {filters.gpu.map(gpu => (
                <FilterChip key={gpu} label={gpu.substring(0, 15) + (gpu.length > 15 ? '...' : '')} onRemove={() => handleFilterToggle("gpu", gpu)} />
              ))}
              {filters.ram.map(ram => (
                <FilterChip key={ram} label={ram} onRemove={() => handleFilterToggle("ram", ram)} />
              ))}
              {filters.storage.map(storage => (
                <FilterChip key={storage} label={storage} onRemove={() => handleFilterToggle("storage", storage)} />
              ))}
              {(filters.minPrice || filters.maxPrice) && (
                <FilterChip 
                  label={`${filters.minPrice || '0'} - ${filters.maxPrice || '∞'} $`} 
                  onRemove={() => {
                    setFilters(prev => ({ ...prev, minPrice: "", maxPrice: "" }));
                  }} 
                />
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs sm:text-sm text-red-500 hover:text-red-700 underline"
              >
                مسح الكل
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer - Now covers everything including navbar with higher z-index */}
      {showMobileFilters && (
        <div 
          className="fixed inset-0 z-[9999] lg:hidden"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Backdrop with higher z-index */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Filter drawer */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            style={{ height: '100vh', maxHeight: '100vh' }}
          >
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className="text-lg font-bold">تصفية النتائج</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div 
              className="flex-1 overflow-y-auto p-4"
              style={{ 
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <FilterContent />
              <div className="h-4" />
            </div>
            
            <div className="p-4 border-t flex gap-3 flex-shrink-0 bg-white">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                مسح الكل
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
              >
                عرض {filteredProductList.length} منتج
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <div className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-xl shadow-lg p-4 h-fit sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تصفية النتائج</h3>
          <FilterContent />
        </div>

        <div className="flex-1">
          <div className="mb-4 text-sm text-gray-600">
            عرض <span className="font-bold text-blue-600">{filteredProductList.length}</span> من أصل{" "}
            <span className="font-bold">{laptopList.length}</span> لابتوب
          </div>

          <LaptopList 
            title={title} 
            dollarPrice={dollar} 
            isLoading={isLoading} 
            selectedList={filteredProductList}
            gridClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
          />
        </div>
      </div>
    </>
  );
};

export default AllLaptopPage;