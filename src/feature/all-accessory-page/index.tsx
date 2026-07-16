// src/feature/all-accessory-page/index.tsx

"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetAccessoriesListQuery, useGetAccessoryTypesQuery } from "@/data-access/api/accessory";
import { useAppSelector } from "@/store";
import { selectAccessoryListList, AccessoryItem } from "@/data-access/slices/accessory-list";
import AccessoryList from "../Accessory-list";
import { FiX, FiSearch, FiChevronDown, FiChevronUp, FiSliders, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface FilterState {
  types: string[];
  brands: string[];
  minPrice: string;
  maxPrice: string;
  manualSearch: string;
}

interface ShowAllState {
  types: boolean;
  brands: boolean;
}

// Extract unique values from accessory data
const useExtractedFilters = (accessories: AccessoryItem[]) => {
  return useMemo(() => {
    const types = new Set<string>();
    const brands = new Set<string>();

    accessories.forEach(accessory => {
      if (accessory.type_name) types.add(accessory.type_name);
      if (accessory.brand) brands.add(accessory.brand);
    });

    return {
      types: Array.from(types).sort(),
      brands: Array.from(brands).sort(),
    };
  }, [accessories]);
};

const sortProductsByPrice = (products: AccessoryItem[], direction: "asc" | "desc") => {
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

// Pagination Component with smooth transitions
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  isLoading
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  totalItems: number;
  isLoading?: boolean;
}) => {
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-200">
      {/* Items info */}
      <div className="text-sm text-gray-500">
        عرض {startItem} - {endItem} من {totalItems} منتج
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">عرض:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={16}>16</option>
          <option value={24}>24</option>
          <option value={32}>32</option>
        </select>
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-1">
        {/* First page */}
        {/* <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || isLoading}
          className={`px-2 py-1 rounded-lg text-sm transition-all duration-300 ${
            currentPage === 1 || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
          }`}
        >
          الأول
        </button> */}

        {/* Previous */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`p-1.5 rounded-lg transition-all duration-300 ${
            currentPage === 1 || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
          }`}
        >
          <FiChevronRight className="w-5 h-5" />
        </button>

        {/* Page numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageClick(1)}
              className="px-3 py-1 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
              currentPage === number
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => handlePageClick(totalPages)}
              className="px-3 py-1 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`p-1.5 rounded-lg transition-all duration-300 ${
            currentPage === totalPages || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
          }`}
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Last page
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className={`px-2 py-1 rounded-lg text-sm transition-all duration-300 ${
            currentPage === totalPages || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
          }`}
        >
          الأخير
        </button> */}
      </div>
    </div>
  );
};

export const AllAccessoryPage = ({ title }: { title: string }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Ref for products container to scroll to
  const productsContainerRef = useRef<HTMLDivElement>(null);

  const [showAllState, setShowAllState] = useState<ShowAllState>({
    types: false,
    brands: false,
  });

  const { isLoading } = useGetAccessoriesListQuery({ status: true });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    types: [],
    brands: [],
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

  const accessoryListRaw = useAppSelector(selectAccessoryListList);
  const accessoryList: AccessoryItem[] = Array.isArray(accessoryListRaw) ? accessoryListRaw : [];
  const sortedAccessoryList = sortProductsByPrice(accessoryList, sortDirection);
  
  const availableFilters = useExtractedFilters(sortedAccessoryList);

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
    setCurrentPage(1);
  };

  const handleManualSearch = (value: string) => {
    setFilters(prev => ({ ...prev, manualSearch: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      types: [],
      brands: [],
      minPrice: "",
      maxPrice: "",
      manualSearch: ""
    });
    setCurrentPage(1);
  };

  const handleToggleShowAll = (sectionKey: string) => {
    setShowAllState(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey as keyof ShowAllState]
    }));
  };

  const activeFiltersCount = useMemo(() => {
    return filters.types.length +
           filters.brands.length +
           (filters.minPrice ? 1 : 0) +
           (filters.maxPrice ? 1 : 0);
  }, [filters]);

  // Filter products
  const filteredProductList = sortedAccessoryList.filter((product) => {
    if (!product) return false;
    
    if (filters.types.length > 0) {
      if (!filters.types.includes(product.type_name)) return false;
    }

    if (filters.brands.length > 0) {
      if (!filters.brands.includes(product.brand)) return false;
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
                           product.brand?.toLowerCase().includes(searchTerm) ||
                           product.type_name?.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Pagination: Get current page items
  const totalItems = filteredProductList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProductList.slice(startIndex, endIndex);
  }, [filteredProductList, currentPage, itemsPerPage]);

  // Smooth page change with animation
  const handlePageChange = (page: number) => {
    if (page === currentPage || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Fade out effect
    if (productsContainerRef.current) {
      productsContainerRef.current.style.opacity = '0';
      productsContainerRef.current.style.transform = 'translateY(10px)';
      productsContainerRef.current.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
    }
    
    setTimeout(() => {
      setCurrentPage(page);
      
      // Fade in effect
      setTimeout(() => {
        if (productsContainerRef.current) {
          productsContainerRef.current.style.opacity = '1';
          productsContainerRef.current.style.transform = 'translateY(0)';
          productsContainerRef.current.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
        }
        setIsTransitioning(false);
      }, 100);
    }, 200);
  };

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-blue-700 rounded-full p-0.5">
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
        sectionKey="types"
        title="نوع المنتج" 
        options={availableFilters.types} 
        selectedValues={filters.types}
        onToggle={(value) => handleFilterToggle("types", value)}
        showAll={showAllState.types}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

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
              placeholder="ابحث عن اكسسوار..."
              value={filters.manualSearch}
              onChange={(e) => handleManualSearch(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
              {filters.types.map(type => (
                <FilterChip key={type} label={type} onRemove={() => handleFilterToggle("types", type)} />
              ))}
              {filters.brands.map(brand => (
                <FilterChip key={brand} label={brand} onRemove={() => handleFilterToggle("brands", brand)} />
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
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
              >
                عرض {filteredProductList.length} منتج
              </button>
            </div>
          </div>
        </div>
      )}

<div className="flex gap-6 min-w-0">
        <div className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-xl shadow-lg p-4 h-fit sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تصفية النتائج</h3>
          <FilterContent />
        </div>
<div className="flex-1 min-w-0 [&_.container]:max-w-none [&_.container]:mx-0 [&_.container]:px-0">

          <div className="mb-4 text-sm text-gray-600">
            عرض <span className="font-bold text-blue-600">{paginatedProducts.length}</span> من أصل{" "}
            <span className="font-bold">{filteredProductList.length}</span> اكسسوار
          </div>

          {/* Products container with smooth transitions */}
          <div 
            ref={productsContainerRef}
            className="transition-all duration-300 ease-in-out"
            style={{ 
              opacity: 1,
              transform: 'translateY(0)'
            }}
          >
            <AccessoryList 
              dollarPrice={dollar} 
              isLoading={isLoading} 
              selectedList={paginatedProducts}
              gridClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={filteredProductList.length}
              isLoading={isTransitioning}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AllAccessoryPage;