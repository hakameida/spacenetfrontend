"use client";

import React, { useEffect, useState } from "react";
import { useGetDollarQuery, useGetProductsListQuery } from "@/data-access/api/products/products";
import { useAppSelector } from "@/store";
import { selectLaptopListList } from "@/data-access/slices/product-list";
import { LaptopList } from "../laptop-list";
import { Viewport } from "next";
import MultipleItemsOffer from "@/components/react-slick/react-slickOffer";

interface ProductList {
  id?: string;
  name?: string;
  price?: string;
  type?: string;
}

const sortProductsByPrice = (products: ProductList[], direction: "asc" | "desc") => {
  return products
    .slice()
    .sort((a, b) => {
      // Handle "soon" products (price 0.00) - always push them to the end
      const aIsSoon = a.price === "0.00";
      const bIsSoon = b.price === "0.00";
      
      if (aIsSoon && !bIsSoon) return 1; // a is soon, b is not - a comes after b
      if (!aIsSoon && bIsSoon) return -1; // b is soon, a is not - b comes after a
      if (aIsSoon && bIsSoon) return 0; // both are soon - maintain order
      
      // Normal sorting for non-soon products
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

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  useEffect(() => {
    if (data?.data?.dollarPriceByPk) {
      setDollar(data?.data?.dollarPriceByPk?.dollarPrice ?? 0);
    }
  }, [data]);

  let selectedLaptopListList: ProductList[] = useAppSelector(selectLaptopListList);
  selectedLaptopListList = sortProductsByPrice(selectedLaptopListList, sortDirection);

  // Apply filtering
  const filteredProductList =
    productType === "Laptop" || productType === "computer" || productType === "Mobile" || productType === "Accessory" || productType === "printers"|| productType === "playstation" || productType === "programms" 
      ? selectedLaptopListList.filter((product) => {
          const matchesBrand = selectedBrand ? product.name?.toLowerCase().includes(selectedBrand.toLowerCase()) : true;
          const matchesCondition = selectedCondition ? product.name?.toLowerCase().includes(selectedCondition.toLowerCase()) : true;
          return matchesBrand && matchesCondition;
        })
      : selectedLaptopListList;

  return (
    <>
      <div className="my-[10px]">
        <h2 className="md:text-[34px] text-[20px] text-[#2a2a2a] font-[7000]"
          style={{ color: "rgba(34,82,154,1)" }}>
          {title}
        </h2>
      </div>
      
      <div className="select-type flex flex-wrap items-center justify-between gap-4 md:gap-6 p-2 md:p-4">
        <div className="flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto">
          {productType === "Laptop" && (
            ["HP", "Asus", "Acer", "Dell","Lenovo","Msi"].map((brand) => (
              <button
                key={brand}
                className={`filter-btn ${selectedBrand === brand ? "active" : ""}`}
                onClick={() => setSelectedBrand(selectedBrand === brand ? "" : brand)}
              >
                {brand}
              </button>
            ))
          )}

          {productType === "computer" && (
            ["CPU", "GPU", "RAM", "Cooler", "Motherboard", "PowerSupply", "Hard"].map((component) => (
              <button
                key={component}
                className={`filter-btn ${selectedBrand === component ? "active" : ""}`}
                onClick={() => setSelectedBrand(selectedBrand === component ? "" : component)}
              >
                {component}
              </button>
            ))
          )}
          
          {/* ... rest of your filter buttons ... */}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <input
            type="text"
            placeholder="فلتر يدوي"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="border rounded p-2 min-w-[180px]"
          />

          <span
            className="cursor-pointer p-2 bg-main_color text-white rounded text-center min-w-[150px]"
            onClick={() => setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"))}
          >
            {sortDirection === "asc" ? "من الارخص الى الاغلى" : "من الاغلى الى الارخص"}
          </span>
        </div>
      </div>

      <LaptopList title={title} dollarPrice={dollar} isLoading={isLoading} selectedList={filteredProductList} />

      <style>
        {`
          .filter-btn {
            padding: 8px 12px;
            background-color: rgba(0,0,0,0.5);
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            white-space: nowrap;
          }

          .filter-btn.active {
            background-color: var(--main-color);
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