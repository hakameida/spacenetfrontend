// feature/all-case-page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetCasesListQuery } from "@/data-access/api/case";
import { useAppSelector } from "@/store";
import { selectCaseListList, CaseItem } from "@/data-access/slices/case-list";
import CaseList from "@/feature/case-list";
import { FiX, FiSearch, FiChevronDown, FiChevronUp, FiSliders } from "react-icons/fi";

interface FilterState {
  types: string[];
  cpu: string[];
  gpu: string[];
  ram: string[];
  storage: string[];
  minPrice: string;
  maxPrice: string;
  manualSearch: string;
}

interface ShowAllState {
  types: boolean;
  cpu: boolean;
  gpu: boolean;
  ram: boolean;
  storage: boolean;
}

const useExtractedFilters = (cases: CaseItem[]) => {
  return useMemo(() => {
    const types = new Set<string>();
    const cpus = new Set<string>();
    const gpus = new Set<string>();
    const rams = new Set<string>();
    const storages = new Set<string>();

    cases.forEach((caseItem) => {
      if (caseItem.type_name) types.add(caseItem.type_name);
      if (caseItem.cpu) cpus.add(caseItem.cpu);
      if (caseItem.gpu) gpus.add(caseItem.gpu);
      if (caseItem.ram) rams.add(caseItem.ram);
      if (caseItem.storage) storages.add(caseItem.storage);
    });

    return {
      types: Array.from(types).sort(),
      cpus: Array.from(cpus).sort(),
      gpus: Array.from(gpus).sort(),
      rams: Array.from(rams).sort((a, b) => {
        const aNum = parseInt(a) || 0;
        const bNum = parseInt(b) || 0;
        return aNum - bNum;
      }),
      storages: Array.from(storages).sort(),
    };
  }, [cases]);
};

const sortProductsByPrice = (products: CaseItem[], direction: "asc" | "desc") => {
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
        className="flex items-center justify-between w-full text-left font-semibold text-gray-700 hover:text-green-600 transition-colors"
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
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 flex-shrink-0"
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
              className="text-sm text-green-600 hover:text-green-700 font-medium mt-2"
            >
              {showAll ? "عرض أقل" : `عرض ${options.length - defaultShowCount} المزيد`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const AllCasePage = ({ title }: { title: string }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
  });

  const [showAllState, setShowAllState] = useState<ShowAllState>({
    types: false,
    cpu: false,
    gpu: false,
    ram: false,
    storage: false,
  });

  const { isLoading } = useGetCasesListQuery({ status: true });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    types: [],
    cpu: [],
    gpu: [],
    ram: [],
    storage: [],
    minPrice: "",
    maxPrice: "",
    manualSearch: ""
  });

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
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

  const caseListRaw = useAppSelector(selectCaseListList);
  const caseList: CaseItem[] = Array.isArray(caseListRaw) ? caseListRaw : [];
  const sortedCaseList = sortProductsByPrice(caseList, sortDirection);
  
  const availableFilters = useExtractedFilters(sortedCaseList);

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
      types: [],
      cpu: [],
      gpu: [],
      ram: [],
      storage: [],
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
    return filters.types.length +
           filters.cpu.length +
           filters.gpu.length +
           filters.ram.length +
           filters.storage.length +
           (filters.minPrice ? 1 : 0) +
           (filters.maxPrice ? 1 : 0);
  }, [filters]);

  const filteredProductList = sortedCaseList.filter((product) => {
    if (!product) return false;
    
    if (filters.types.length > 0) {
      if (!filters.types.includes(product.type_name)) return false;
    }

    if (filters.cpu.length > 0) {
      if (!product.cpu || !filters.cpu.includes(product.cpu)) return false;
    }

    if (filters.gpu.length > 0) {
      if (!product.gpu || !filters.gpu.includes(product.gpu)) return false;
    }

    if (filters.ram.length > 0) {
      if (!product.ram || !filters.ram.includes(product.ram)) return false;
    }

    if (filters.storage.length > 0) {
      if (!product.storage || !filters.storage.includes(product.storage)) return false;
    }

    if (filters.minPrice || filters.maxPrice) {
      const price = parseFloat(product.price || "0");
      if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
    }

    if (filters.manualSearch.trim() !== "") {
      const searchTerm = filters.manualSearch.toLowerCase();
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm) ||
                           product.description?.toLowerCase().includes(searchTerm) ||
                           product.cpu?.toLowerCase().includes(searchTerm) ||
                           product.gpu?.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-green-700 rounded-full p-0.5">
        <FiX size={14} />
      </button>
    </span>
  );

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="number"
                  placeholder="إلى"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <FilterSectionWithShowMore 
        sectionKey="types"
        title="نوع الجهاز" 
        options={availableFilters.types} 
        selectedValues={filters.types}
        onToggle={(value) => handleFilterToggle("types", value)}
        showAll={showAllState.types}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
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
    </div>
  );

  return (
    <>
      <div className="my-[10px] flex items-center justify-between">
        <h2 className="md:text-[34px] text-[20px] font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm py-3 mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ابحث عن جهاز..."
              value={filters.manualSearch}
              onChange={(e) => handleManualSearch(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
              <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs flex items-center justify-center font-bold bg-green-600 text-white">
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
              {filters.types.map(type => (
                <FilterChip key={type} label={type} onRemove={() => handleFilterToggle("types", type)} />
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

      {showMobileFilters && (
        <div 
          className="fixed inset-0 z-[9999] lg:hidden"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowMobileFilters(false)}
          />
          
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
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
              >
                عرض {filteredProductList.length} جهاز
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
            عرض <span className="font-bold text-green-600">{filteredProductList.length}</span> من أصل{" "}
            <span className="font-bold">{caseList.length}</span> جهاز
          </div>

          <CaseList 
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

export default AllCasePage;