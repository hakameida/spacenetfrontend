"use client";

import React, { useEffect, useState } from "react";
import { useGetDollarQuery, useGetProductsListQuery } from "@/data-access/api/products/products";
import { useAppSelector } from "@/store";
import { selectLaptopListList } from "@/data-access/slices/product-list";
import { LaptopList } from "../laptop-list";

interface ProductList {
  id?: string;
  name?: string;
  price?: string;
  type?: string;
  brand?: string; // Assuming you have brand field
}

interface FilterState {
  brands: string[];
  manualSearch: string;
}

// Define filter options for each product type with proper typing
interface FilterOptions {
  brands: string[];
  components?: string[];
  models?: string[];
  resolutions?: string[];
}

const FILTER_OPTIONS: Record<string, FilterOptions> = {
  Laptop: {
    brands: ["HP", "Asus", "Acer", "Dell", "Lenovo", "Msi", "Apple", "Samsung"]
  },
  computer: {
    brands: ["Intel", "AMD", "NVIDIA", "Gigabyte", "ASUS", "MSI", "Corsair", "Seagate"],
    components: ["CPU", "GPU", "RAM", "Cooler", "Motherboard", "PowerSupply", "Hard"]
  },
  Mobile: {
    brands: ["Apple", "Samsung", "Xiaomi", "Oppo", "Nokia", "Huawei", "OnePlus"]
  },
  Accessory: {
    brands: ["Logitech", "Razer", "SteelSeries", "Samsung", "Apple", "Sony"]
  },
  printers: {
    brands: ["HP", "Canon", "Epson", "Brother", "Xerox"]
  },
  playstation: {
    brands: ["Sony"],
    models: ["PS5", "PS4", "PS3"]
  },
  programms: {
    brands: ["Microsoft", "Adobe", "Autodesk", "JetBrains"]
  },
  cameras: {
    brands: ["Hikvision", "Dahua", "Unv", "V380"],
    resolutions: ["2mega", "3mega", "4mega", "5mega", "6mega"]
  }
};

const sortProductsByPrice = (products: ProductList[], direction: "asc" | "desc") => {
  return products
    .slice()
    .sort((a, b) => {
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

export const AllProductPage = ({ productType, title }: { productType: string; title: string }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { isLoading } = useGetProductsListQuery({ type: productType });
  const { data } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);

  // Initialize filters based on product type
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    manualSearch: ""
  });

  useEffect(() => {
    if (data?.data?.dollarPriceByPk) {
      setDollar(data?.data?.dollarPriceByPk?.dollarPrice ?? 0);
    }
  }, [data]);

  let selectedLaptopListList: ProductList[] = useAppSelector(selectLaptopListList);
  selectedLaptopListList = sortProductsByPrice(selectedLaptopListList, sortDirection);

  // Get filter options for current product type
  const filterOptions = FILTER_OPTIONS[productType] || {
    brands: [],
    components: [],
    models: [],
    resolutions: []
  };

  // Handle filter toggle
  const handleFilterToggle = (value: string) => {
    setFilters(prev => {
      const currentValues = prev.brands;
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        brands: newValues
      };
    });
  };

  // Handle manual search
  const handleManualSearch = (value: string) => {
    setFilters(prev => ({
      ...prev,
      manualSearch: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      brands: [],
      manualSearch: ""
    });
  };

  // Apply all filters
  const filteredProductList = selectedLaptopListList.filter((product) => {
    // Brand filter
    if (filters.brands.length > 0) {
      const productBrand = product.brand || product.name?.split(' ')[0] || '';
      const matchesBrand = filters.brands.some(brand => 
        productBrand.toLowerCase().includes(brand.toLowerCase()) ||
        product.name?.toLowerCase().includes(brand.toLowerCase())
      );
      if (!matchesBrand) return false;
    }

    // Manual search filter
    if (filters.manualSearch.trim() !== "") {
      const searchTerm = filters.manualSearch.toLowerCase();
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm) ||
                           product.brand?.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    return true;
  });

  return (
    <>
      <div className="my-[10px]">
        <h2 className="md:text-[34px] text-[20px] text-[#2a2a2a] font-[7000]"
          style={{ color: "rgba(34,82,154,1)" }}>
          {title}
        </h2>
      </div>
      
      <div className="select-type flex flex-wrap items-start justify-between gap-4 md:gap-6 p-2 md:p-4">
        <div className="flex-1 min-w-0">
          {/* Brand Filters */}
          {filterOptions.brands && filterOptions.brands.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "rgba(34,82,154,1)" }}>
                العلامات التجارية
              </h3>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {filterOptions.brands.map((brand) => (
                  <button
                    key={brand}
                    className={`filter-btn ${filters.brands.includes(brand) ? "active" : ""}`}
                    onClick={() => handleFilterToggle(brand)}
                  >
                    {brand} {filters.brands.includes(brand) && "✓"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type-specific filters - computer components */}
          {productType === "computer" && filterOptions.components && filterOptions.components.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "rgba(34,82,154,1)" }}>
                المكونات
              </h3>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {filterOptions.components.map((component) => (
                  <button
                    key={component}
                    className={`filter-btn ${filters.brands.includes(component) ? "active" : ""}`}
                    onClick={() => handleFilterToggle(component)}
                  >
                    {component} {filters.brands.includes(component) && "✓"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type-specific filters - camera resolutions */}
          {productType === "cameras" && filterOptions.resolutions && filterOptions.resolutions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "rgba(34,82,154,1)" }}>
                الدقة
              </h3>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {filterOptions.resolutions.map((resolution) => (
                  <button
                    key={resolution}
                    className={`filter-btn ${filters.brands.includes(resolution) ? "active" : ""}`}
                    onClick={() => handleFilterToggle(resolution)}
                  >
                    {resolution} {filters.brands.includes(resolution) && "✓"}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Type-specific filters - playstation models */}
          {productType === "playstation" && filterOptions.models && filterOptions.models.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "rgba(34,82,154,1)" }}>
                الموديلات
              </h3>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {filterOptions.models.map((model) => (
                  <button
                    key={model}
                    className={`filter-btn ${filters.brands.includes(model) ? "active" : ""}`}
                    onClick={() => handleFilterToggle(model)}
                  >
                    {model} {filters.brands.includes(model) && "✓"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search, Sort, and Clear */}
        <div className="flex flex-col gap-4 min-w-[250px]">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={filters.manualSearch}
            onChange={(e) => handleManualSearch(e.target.value)}
            className="border rounded p-2 w-full"
          />

          <span
            className="cursor-pointer p-2 bg-main_color text-white rounded text-center"
            onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            {sortDirection === "asc" ? "من الارخص الى الاغلى" : "من الاغلى الى الارخص"}
          </span>

          {(filters.brands.length > 0 || filters.manualSearch) && (
            <button
              className="cursor-pointer p-2 bg-gray-500 text-white rounded text-center"
              onClick={clearAllFilters}
            >
              مسح جميع الفلاتر
            </button>
          )}

          {/* Active filters summary */}
          {filters.brands.length > 0 && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <p className="text-sm font-semibold">الفلاتر النشطة:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {filters.brands.map(brand => (
                  <span key={brand} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 mb-2 text-sm text-gray-600">
        عرض {filteredProductList.length} من أصل {selectedLaptopListList.length} منتج
      </div>

      <LaptopList title={title} dollarPrice={dollar} isLoading={isLoading} selectedList={filteredProductList} />

      <style>
        {`
          .filter-btn {
            padding: 8px 16px;
            background-color: #f1f1f1;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 20px;
            cursor: pointer;
            margin: 2px;
            white-space: nowrap;
            transition: all 0.2s ease;
          }

          .filter-btn:hover {
            background-color: #e0e0e0;
            transform: translateY(-1px);
          }

          .filter-btn.active {
            background-color: var(--main-color);
            color: white;
            border-color: var(--main-color);
          }

          .overflow-x-auto::-webkit-scrollbar {
            height: 4px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background-color: var(--main-color);
            border-radius: 10px;
          }
        `}
      </style>
    </>
  );
};