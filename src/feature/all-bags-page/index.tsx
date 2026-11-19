"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetBagsListQuery, useGetBagMaterialsQuery } from "@/data-access/api/bag";
import { useAppSelector } from "@/store";
import { selectBagListList, BagItem } from "@/data-access/slices/bag-list";
import BagList from "../bag-list";
import { FiX, FiSearch, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface FilterState {
  materials: string[];
  minPrice: string;
  maxPrice: string;
  manualSearch: string;
}

const sortProductsByPrice = (products: BagItem[], direction: "asc" | "desc") => {
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

const Pagination = ({
  currentPage, totalPages, onPageChange, itemsPerPage,
  onItemsPerPageChange, totalItems, isLoading
}: {
  currentPage: number; totalPages: number; onPageChange: (page: number) => void;
  itemsPerPage: number; onItemsPerPageChange: (count: number) => void;
  totalItems: number; isLoading?: boolean;
}) => {
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const handlePageClick = (page: number) => { if (page !== currentPage && !isLoading) onPageChange(page); };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-500">عرض {startItem} - {endItem} من {totalItems} منتج</div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">عرض:</span>
        <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={16}>16</option>
          <option value={24}>24</option>
          <option value={32}>32</option>
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1 || isLoading}
          className={`p-1.5 rounded-lg ${currentPage === 1 || isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
          <FiChevronRight className="w-5 h-5" />
        </button>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => handlePageClick(number)} disabled={isLoading}
            className={`px-3 py-1 rounded-lg text-sm ${currentPage === number ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} ${isLoading ? 'opacity-50' : ''}`}>
            {number}
          </button>
        ))}
        <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages || isLoading}
          className={`p-1.5 rounded-lg ${currentPage === totalPages || isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
          <FiChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const AllBagsPage = ({ title }: { title: string }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedPrice, setExpandedPrice] = useState(true);
  const [expandedMaterials, setExpandedMaterials] = useState(true);

  const productsContainerRef = useRef<HTMLDivElement>(null);

  const { isLoading } = useGetBagsListQuery({ status: true });
  const { data: materialsData } = useGetBagMaterialsQuery({});
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    materials: [],
    minPrice: "",
    maxPrice: "",
    manualSearch: "",
  });

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData?.data?.dollarPriceByPk?.dollarPrice ?? 0);
    }
  }, [dollarData]);

  const bagListRaw = useAppSelector(selectBagListList);
  const bagList: BagItem[] = Array.isArray(bagListRaw) ? bagListRaw : [];
  const sortedBagList = sortProductsByPrice(bagList, sortDirection);

  const availableMaterials = useMemo(() => {
    const s = new Set<string>();
    sortedBagList.forEach(b => { if (b.material_name) s.add(b.material_name); });
    return Array.from(s).sort();
  }, [sortedBagList]);

  const handleFilterToggle = (value: string) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(value)
        ? prev.materials.filter(v => v !== value)
        : [...prev.materials, value],
    }));
    setCurrentPage(1);
  };

  const handleManualSearch = (value: string) => {
    setFilters(prev => ({ ...prev, manualSearch: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({ materials: [], minPrice: "", maxPrice: "", manualSearch: "" });
    setCurrentPage(1);
  };

  const activeFiltersCount = filters.materials.length
    + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  const filteredProductList = sortedBagList.filter((product) => {
    if (!product) return false;
    if (filters.materials.length > 0 && !filters.materials.includes(product.material_name)) return false;
    if (filters.minPrice || filters.maxPrice) {
      const price = parseFloat(product.price || "0");
      if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
    }
    if (filters.manualSearch.trim() !== "") {
      const t = filters.manualSearch.toLowerCase();
      const m = product.name?.toLowerCase().includes(t)
        || product.description?.toLowerCase().includes(t)
        || product.material_name?.toLowerCase().includes(t)
        || product.model_number?.toLowerCase().includes(t)
        || product.laptop_size?.toLowerCase().includes(t);
      if (!m) return false;
    }
    return true;
  });

  const totalItems = filteredProductList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedProducts = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filteredProductList.slice(s, s + itemsPerPage);
  }, [filteredProductList, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page === currentPage || isTransitioning) return;
    setIsTransitioning(true);
    if (productsContainerRef.current) {
      productsContainerRef.current.style.opacity = '0';
      productsContainerRef.current.style.transition = 'opacity 0.2s ease-out';
    }
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => {
        if (productsContainerRef.current) {
          productsContainerRef.current.style.opacity = '1';
          productsContainerRef.current.style.transition = 'opacity 0.3s ease-in';
        }
        setIsTransitioning(false);
      }, 100);
    }, 200);
  };

  const handleItemsPerPageChange = (count: number) => { setItemsPerPage(count); setCurrentPage(1); };

  const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-blue-700 rounded-full p-0.5"><FiX size={14} /></button>
    </span>
  );

  const FilterContent = () => (
    <div className="space-y-1">
      <div className="border-b border-gray-200 py-3">
        <button onClick={() => setExpandedPrice(v => !v)} className="flex items-center justify-between w-full text-left font-semibold text-gray-700">
          <span>السعر ($)</span>
          {expandedPrice ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedPrice && (
          <div className="mt-3 flex gap-2">
            <input type="number" placeholder="من" value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="number" placeholder="إلى" value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        )}
      </div>

      {availableMaterials.length > 0 && (
        <div className="border-b border-gray-200 py-3">
          <button onClick={() => setExpandedMaterials(v => !v)} className="flex items-center justify-between w-full text-left font-semibold text-gray-700">
            <span>المادة ({availableMaterials.length})</span>
            {expandedMaterials ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {expandedMaterials && (
            <div className="mt-3 max-h-52 overflow-y-auto pr-2 space-y-2">
              {availableMaterials.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer group py-1">
                  <input type="checkbox" checked={filters.materials.includes(opt)}
                    onChange={() => handleFilterToggle(opt)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
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
            <input type="text" placeholder="ابحث عن حقيبة..." value={filters.manualSearch}
              onChange={(e) => handleManualSearch(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm sm:text-base">
            {sortDirection === "asc" ? "الأقل سعراً" : "الأعلى سعراً"}
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs sm:text-sm text-gray-500">الفلاتر:</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {filters.materials.map(m => (
                <FilterChip key={m} label={m} onRemove={() => handleFilterToggle(m)} />
              ))}
              {(filters.minPrice || filters.maxPrice) && (
                <FilterChip label={`${filters.minPrice || '0'} - ${filters.maxPrice || '∞'} $`}
                  onRemove={() => setFilters(prev => ({ ...prev, minPrice: "", maxPrice: "" }))} />
              )}
              <button onClick={clearAllFilters} className="text-xs sm:text-sm text-red-500 hover:text-red-700 underline">مسح الكل</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-6 min-w-0">
        <div className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-xl shadow-lg p-4 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تصفية النتائج</h3>
          <FilterContent />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4 text-sm text-gray-600">
            عرض <span className="font-bold text-blue-600">{paginatedProducts.length}</span> من أصل{" "}
            <span className="font-bold">{filteredProductList.length}</span> حقيبة
          </div>
          <div ref={productsContainerRef} className="transition-opacity duration-300" style={{ opacity: 1 }}>
            <BagList
              dollarPrice={dollar}
              isLoading={isLoading}
              selectedList={paginatedProducts}
              gridClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            />
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage} onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={filteredProductList.length} isLoading={isTransitioning}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AllBagsPage;