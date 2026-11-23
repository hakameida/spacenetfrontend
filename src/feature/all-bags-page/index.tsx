"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useGetDollarQuery } from "@/data-access/api/shared";
import { useGetBagsListQuery } from "@/data-access/api/bag";
import { useAppSelector } from "@/store";
import { selectBagListList, BagItem } from "@/data-access/slices/bag-list";
import BagList from "../bag-list";
import { FiX, FiSearch, FiChevronDown, FiChevronUp, FiSliders } from "react-icons/fi";

interface FilterState {
  materials: string[];
  laptopSizes: string[];
  colors: string[];
  age: string[];
  waterResistant: string[];
  minPrice: string;
  maxPrice: string;
  manualSearch: string;
}

interface FilterSectionsState {
  price: boolean;
}

interface ShowAllState {
  materials: boolean;
  laptopSizes: boolean;
  colors: boolean;
  age: boolean;
  waterResistant: boolean;
}

const STORAGE_KEY = "all-bag-page-state";

const loadSavedState = (): {
  filters?: FilterState;
  sortDirection?: "asc" | "desc";
  showAllState?: ShowAllState;
} | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const useExtractedFilters = (bags: BagItem[]) => {
  return useMemo(() => {
    const materials = new Set<string>();
    const laptopSizes = new Set<string>();
    const colors = new Set<string>();
    const ages = new Set<string>();
    const waterResistantOptions = new Set<string>();

    bags.forEach(bag => {
      if (bag.material_name) materials.add(bag.material_name);
      if (bag.laptop_size) laptopSizes.add(bag.laptop_size);
      if (bag.color) colors.add(bag.color);
      
      if (bag.age) {
        if (bag.age === 'جديد' || bag.age === 'new' || bag.age === 'New') {
          ages.add('جديد');
        } else if (bag.age === 'مستعمل' || bag.age === 'used' || bag.age === 'Used') {
          ages.add('مستعمل');
        } else if (bag.age === 'اوبن بوكس' || bag.age === 'openbox' || bag.age === 'Open Box') {
          ages.add('اوبن بوكس');
        } else {
          ages.add(bag.age);
        }
      }

      if (bag.water_resistant !== undefined) {
        waterResistantOptions.add(bag.water_resistant ? 'مقاوم للماء' : 'غير مقاوم');
      }
    });

    return {
      materials: Array.from(materials).sort(),
      laptopSizes: Array.from(laptopSizes).sort(),
      colors: Array.from(colors).sort(),
      ages: Array.from(ages),
      waterResistantOptions: Array.from(waterResistantOptions),
    };
  }, [bags]);
};

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

export const AllBagsPage = ({ title }: { title: string }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<FilterSectionsState>({
    price: true,
  });

  const [showAllState, setShowAllState] = useState<ShowAllState>({
    materials: false,
    laptopSizes: false,
    colors: false,
    age: false,
    waterResistant: false,
  });

  // Lyket like counts map keyed by bag id
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const { isLoading } = useGetBagsListQuery({ status: true });
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    materials: [],
    laptopSizes: [],
    colors: [],
    age: [],
    waterResistant: [],
    minPrice: "",
    maxPrice: "",
    manualSearch: ""
  });

  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      if (saved.filters) setFilters(saved.filters);
      if (saved.sortDirection) setSortDirection(saved.sortDirection);
      if (saved.showAllState) setShowAllState(saved.showAllState);
    }
    setHasRestored(true);
  }, []);

  // Fetch all like counts for the "bags" namespace, once
  useEffect(() => {
    let cancelled = false;

    const fetchLikeCounts = async () => {
      try {
        const res = await fetch(
          "https://api.lyket.dev/v1/rank/like-buttons/bags?per_page=500",
          {
            headers: {
              Authorization: "Bearer pt_0e230d6e7e20dfa46a4c040f2c8c9b",
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          console.warn("Lyket likes fetch failed:", res.status);
          return;
        }

        const json = await res.json();
        const rawList: any[] = Array.isArray(json) ? json : json?.data ?? [];

        const map: Record<string, number> = {};
        rawList.forEach((item) => {
          const id = String(item?.id ?? "");
          const likes = item?.attributes?.total_likes ?? 0;
          if (id) map[id] = Number(likes) || 0;
        });

        console.log("✅ Lyket bags like map:", map);
        if (!cancelled) setLikeCounts(map);
      } catch (err) {
        console.error("Lyket fetch error:", err);
      }
    };

    fetchLikeCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasRestored) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          filters,
          sortDirection,
          showAllState,
        })
      );
    } catch {
      // ignore
    }
  }, [filters, sortDirection, showAllState, hasRestored]);

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

  const bagListRaw = useAppSelector(selectBagListList);
  const bagList: BagItem[] = Array.isArray(bagListRaw) ? bagListRaw : [];
  const sortedBagList = sortProductsByPrice(bagList, sortDirection);

  const availableFilters = useExtractedFilters(sortedBagList);

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
      materials: [],
      laptopSizes: [],
      colors: [],
      age: [],
      waterResistant: [],
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
    return filters.materials.length +
           filters.laptopSizes.length +
           filters.colors.length +
           filters.age.length +
           filters.waterResistant.length +
           (filters.minPrice ? 1 : 0) +
           (filters.maxPrice ? 1 : 0);
  }, [filters]);

  const normalizeAge = (age: string): string => {
    if (age === 'جديد' || age === 'new' || age === 'New') return 'جديد';
    if (age === 'مستعمل' || age === 'used' || age === 'Used') return 'مستعمل';
    if (age === 'اوبن بوكس' || age === 'openbox' || age === 'Open Box') return 'اوبن بوكس';
    return age;
  };

  const filteredProductList = sortedBagList.filter((product) => {
    if (!product) return false;

    if (filters.materials.length > 0) {
      if (!product.material_name || !filters.materials.includes(product.material_name)) return false;
    }

    if (filters.laptopSizes.length > 0) {
      if (!product.laptop_size || !filters.laptopSizes.includes(product.laptop_size)) return false;
    }

    if (filters.colors.length > 0) {
      if (!product.color || !filters.colors.includes(product.color)) return false;
    }

    if (filters.waterResistant.length > 0) {
      const isWaterResistant = product.water_resistant ? 'مقاوم للماء' : 'غير مقاوم';
      if (!filters.waterResistant.includes(isWaterResistant)) return false;
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

    if (filters.manualSearch.trim() !== "") {
      const searchTerm = filters.manualSearch.toLowerCase();
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm) ||
                           product.description?.toLowerCase().includes(searchTerm) ||
                           product.model_number?.toLowerCase().includes(searchTerm) ||
                           product.laptop_size?.toLowerCase().includes(searchTerm) ||
                           product.material_name?.toLowerCase().includes(searchTerm) ||
                           product.color?.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Attach likeCount to each filtered bag
  const filteredWithLikes = useMemo(
    () =>
      filteredProductList.map((p) => ({
        ...p,
        likeCount: likeCounts[String(p.id)] || 0,
      })),
    [filteredProductList, likeCounts]
  );

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
        sectionKey="materials"
        title="المادة"
        options={availableFilters.materials}
        selectedValues={filters.materials}
        onToggle={(value) => handleFilterToggle("materials", value)}
        showAll={showAllState.materials}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore
        sectionKey="laptopSizes"
        title="مقاس اللابتوب"
        options={availableFilters.laptopSizes}
        selectedValues={filters.laptopSizes}
        onToggle={(value) => handleFilterToggle("laptopSizes", value)}
        showAll={showAllState.laptopSizes}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore
        sectionKey="colors"
        title="اللون"
        options={availableFilters.colors}
        selectedValues={filters.colors}
        onToggle={(value) => handleFilterToggle("colors", value)}
        showAll={showAllState.colors}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={5}
      />

      <FilterSectionWithShowMore
        sectionKey="waterResistant"
        title="مقاومة الماء"
        options={availableFilters.waterResistantOptions}
        selectedValues={filters.waterResistant}
        onToggle={(value) => handleFilterToggle("waterResistant", value)}
        showAll={showAllState.waterResistant}
        onToggleShowAll={handleToggleShowAll}
        defaultShowCount={2}
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
              placeholder="ابحث عن حقيبة..."
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
              {filters.materials.map(m => (
                <FilterChip key={m} label={m} onRemove={() => handleFilterToggle("materials", m)} />
              ))}
              {filters.laptopSizes.map(size => (
                <FilterChip key={size} label={size} onRemove={() => handleFilterToggle("laptopSizes", size)} />
              ))}
              {filters.colors.map(color => (
                <FilterChip key={color} label={color} onRemove={() => handleFilterToggle("colors", color)} />
              ))}
              {filters.waterResistant.map(wr => (
                <FilterChip key={wr} label={wr} onRemove={() => handleFilterToggle("waterResistant", wr)} />
              ))}
              {filters.age.map(age => (
                <FilterChip key={age} label={age} onRemove={() => handleFilterToggle("age", age)} />
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

      <div className="flex gap-6">
        <div className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-xl shadow-lg p-4 h-fit sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تصفية النتائج</h3>
          <FilterContent />
        </div>

        <div className="flex-1">
          <div className="mb-4 text-sm text-gray-600">
            عرض <span className="font-bold text-blue-600">{filteredProductList.length}</span> من أصل{" "}
            <span className="font-bold">{bagList.length}</span> حقيبة
          </div>

          <BagList
            dollarPrice={dollar}
            isLoading={isLoading}
            selectedList={filteredWithLikes}
            gridClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
          />
        </div>
      </div>
    </>
  );
};

export default AllBagsPage;