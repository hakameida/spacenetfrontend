"use client";

import React from "react";
import CardBag from "@/feature/card-bag";
import { Skeleton } from "@mui/material";
import { BagItem } from "@/data-access/slices/bag-list";

export const BagList = ({
  isLoading,
  selectedList,
  dollarPrice,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4"
}: {
  dollarPrice: number;
  isLoading: boolean;
  selectedList: BagItem[];
  gridClassName?: string;
}) => {
  return (
    <>
      {isLoading ? (
        <div className="container mx-auto my-[40px] px-2 md:px-4">
          <div className={gridClassName}>
            {Array.from(new Array(9)).map((_, index) => (
              <div key={index} className="w-full min-w-0">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Skeleton variant="rectangular" width="100%" height={180} />
                  <div className="p-2.5">
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="50%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto my-[40px] px-2 md:px-4">
          <div className={gridClassName}>
            {selectedList && selectedList.length > 0 ? (
              selectedList.map((item, key) => (
                <div key={key} className="w-full min-w-0">
                  <CardBag
                    height="180px"
                    rounded="10px"
                    width="100%"
                    image={item.image ?? ""}
                    title={item.name ?? ""}
                    price={item.price ?? ""}
                    discount={item.discount ?? ""}
                    dollarPrice={dollarPrice}
                    id={item.id ?? ""}
                    age={item.age ?? ""}
                    material_name={item.material_name ?? ""}
                    laptop_size={item.laptop_size ?? ""}
                    water_resistant={item.water_resistant ?? false}
                    dynamicSpecs={item.dynamicSpecs ?? []}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 w-full">
                <p className="text-gray-500">لا توجد منتجات</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BagList;