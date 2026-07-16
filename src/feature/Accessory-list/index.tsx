// src/feature/Accessory-list/index.tsx
"use client";

import React from "react";
import CardAccessory from "@/feature/card-accessory";
import { Skeleton } from "@mui/material";
import { AccessoryItem } from "@/data-access/slices/accessory-list";

export const AccessoryList = ({
  isLoading,
  selectedList,
  dollarPrice,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4"
}: {
  dollarPrice: number;
  isLoading: boolean;
  selectedList: AccessoryItem[];
  title?: string;
  gridClassName?: string;
}) => {

  return (
    <>
      {isLoading ? (
        <div className="w-full my-[40px] px-2 md:px-4">
          <div className="my-[40px]">
            <div className={gridClassName}>
              {Array.from(new Array(9)).map((_, index) => (
                <div key={index} className="w-full min-w-0">
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <Skeleton variant="rectangular" width="100%" height={180} />
                    <div className="p-2.5">
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="50%" />
                      <div className="mt-2 flex flex-col gap-1">
                        <Skeleton variant="text" width="70%" height={12} />
                        <Skeleton variant="text" width="60%" height={12} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto my-[40px] px-2 md:px-4">
          <div className="my-[40px]">
            <div className={gridClassName}>
              {selectedList && selectedList.length > 0 ? (
                selectedList.map((accessoryItem, key) => (
                  <div key={key} className="w-full min-w-0">
                    <CardAccessory
                      height="180px"
                      rounded="10px"
                      width="100%"
                      image={accessoryItem.image ?? ""}
                      title={accessoryItem.name ?? ""}
                      price={accessoryItem.price ?? ""}
                      discount={accessoryItem.discount ?? ""}
                      description={accessoryItem.description ?? ""}
                      dollarPrice={dollarPrice}
                      id={accessoryItem.id ?? ""}
                      age={accessoryItem.age ?? ""}
                      brand={accessoryItem.brand ?? ""}
                      type_name={accessoryItem.type_name ?? ""}
                      dynamicSpecs={accessoryItem.dynamicSpecs ?? []}
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
        </div>
      )}
    </>
  );
};

export default AccessoryList;