// src/app/search/[searchWord]/page.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { selectLaptopListList } from "@/data-access/slices/product-list";
import { selectAccessoryListList } from "@/data-access/slices/accessory-list";
import { selectComputerListList } from "@/data-access/slices/computer-list";
import { selectPlayStationListList } from "@/data-access/slices/playstation-list";
import { selectCameraListList } from "@/data-access/slices/camera-list";
import { useGetDollarQuery } from "@/data-access/api/shared";
import CardProduct from "@/components/card/card-product";
import { Search, ArrowRight, X } from "lucide-react";
import Link from "next/link";

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

// Helper to determine product type and get correct link
const getProductLink = (product: SearchableProduct): string => {
  if (product.cpu !== undefined) return `/laptops/${product.id}`;
  else if (product.brand && product.type_name) return `/accessories/${product.id}`;
  else if (product.type_name) return `/computer/${product.id}`;
  else if (product.storage) return `/playstations/${product.id}`;
  else if (product.sensor_type || product.megapixels) return `/cameras/${product.id}`;
  else return `/search/${encodeURIComponent(product.name)}`;
};

// Helper to get product category
const getProductCategory = (product: SearchableProduct): string => {
  if (product.cpu !== undefined) return "لابتوب";
  else if (product.brand && product.type_name) return "اكسسوار";
  else if (product.type_name) return "كمبيوتر";
  else if (product.storage) return "بلايستيشن";
  else if (product.sensor_type || product.megapixels) return "كاميرا";
  else return "منتج";
};

export default function SearchPage({ params }: { params: { searchWord: string } }) {
  const router = useRouter();
  const searchQuery = decodeURIComponent(params.searchWord);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const { data: dollarData } = useGetDollarQuery({});
  const [dollar, setDollar] = useState(0);

  // Get all products from Redux
  const laptopList = useAppSelector(selectLaptopListList);
  const accessoryList = useAppSelector(selectAccessoryListList);
  const computerList = useAppSelector(selectComputerListList);
  const playstationList = useAppSelector(selectPlayStationListList);
  const cameraList = useAppSelector(selectCameraListList);

  useEffect(() => {
    if (dollarData?.data?.dollarPriceByPk) {
      setDollar(dollarData.data.dollarPriceByPk.dollarPrice ?? 0);
    }
  }, [dollarData]);

  // Combine all products
  const allProducts: SearchableProduct[] = [
    ...(Array.isArray(laptopList) ? (laptopList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(accessoryList) ? (accessoryList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(computerList) ? (computerList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(playstationList) ? (playstationList as unknown as SearchableProduct[]) : []),
    ...(Array.isArray(cameraList) ? (cameraList as unknown as SearchableProduct[]) : []),
  ];

  // Search function
  const searchProducts = (query: string) => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    return allProducts.filter((product: SearchableProduct) => {
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
        ...(product.dynamicSpecs?.map((spec: any) => spec.value) || [])
      ].filter(Boolean);
      
      return searchableFields.some(field => 
        String(field).toLowerCase().includes(searchTerm)
      );
    });
  };

  const results = useMemo(() => {
    return searchProducts(searchQuery);
  }, [searchQuery, allProducts]);

  // Handle new search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: SearchableProduct[] } = {};
    results.forEach(product => {
      const category = getProductCategory(product);
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
    });
    return groups;
  }, [results]);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full px-6 py-4 pr-14 text-lg bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              dir="rtl"
              autoFocus
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  router.push("/search");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            نتائج البحث عن: <span className="text-blue-600">&quot;{searchQuery}&quot;</span>
          </h1>
          <p className="text-gray-500 mt-1">
            تم العثور على <span className="font-bold text-blue-600">{results.length}</span> منتج
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <span>العودة للرئيسية</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([category, products]) => (
            <div key={category}>
              <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
                <span className="text-sm text-gray-500">({products.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {products.map((product) => {
                  const imageUrl = product.image || product.image1 || product.url1 || "";
                  return (
                    <CardProduct
                      key={product.id}
                      height="160px"
                      rounded="10px"
                      width="100%"
                      image={imageUrl}
                      title={product.name || ""}
                      price={product.price || "0"}
                      description={product.description || ""}
                      dollarPrice={dollar}
                      icons={true}
                      id={product.id || ""}
                      age={product.age || ""}
                      cpu={product.cpu || ""}
                      gpu={product.gpu || ""}
                      ram={product.ram || ""}
                      storage={product.hard || ""}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">لا توجد نتائج</h2>
          <p className="text-gray-500 mb-6">
            لم نتمكن من العثور على منتجات تطابق &quot;<span className="font-bold">{searchQuery}</span>&quot;
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSearchInput("");
                router.push("/laptops");
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              تصفح اللابتوبات
            </button>
            <button
              onClick={() => {
                setSearchInput("");
                router.push("/accessories");
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              تصفح الاكسسوارات
            </button>
            <button
              onClick={() => {
                setSearchInput("");
                router.push("/computer");
              }}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
            >
              تصفح الكمبيوتر
            </button>
            <button
              onClick={() => {
                setSearchInput("");
                router.push("/playstations");
              }}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
            >
              تصفح البلايستيشن
            </button>
            <button
              onClick={() => {
                setSearchInput("");
                router.push("/cameras");
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              تصفح الكاميرات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}