// feature/storage-list/index.tsx
"use client";

import React from "react";
import CardStorage from "@/feature/card-storage";
import { Skeleton } from "@mui/material";
import { StorageItem } from "@/data-access/slices/storage-list";

export const StorageList = ({
  isLoading,
  selectedList,
  dollarPrice,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4"
}: {
  dollarPrice: number;
  isLoading: boolean;
  selectedList: StorageItem[];
  title?: string;
  gridClassName?: string;
}) => {

  return (
    <>
      {isLoading ? (
        <div className="container mx-auto my-[40px] px-2 md:px-4">
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
                selectedList.map((storageItem, key) => (
                  <div key={key} className="w-full min-w-0">
                    <CardStorage
                      height="180px"
                      rounded="10px"
                      width="100%"
                      image={storageItem.image ?? ""}
                      title={storageItem.name ?? ""}
                      price={storageItem.price ?? ""}
                      description={storageItem.description ?? ""}
                      discount={storageItem.discount ?? ""}
                      dollarPrice={dollarPrice}
                      id={storageItem.id ?? ""}
                      age={storageItem.age ?? ""}
                      type_name={storageItem.type_name ?? ""}
                      brand={storageItem.brand ?? ""}
                      capacity={storageItem.capacity ?? ""}
                      read_speed={storageItem.read_speed ?? ""}
                      write_speed={storageItem.write_speed ?? ""}
                      dynamicSpecs={storageItem.dynamicSpecs ?? []}
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

export default StorageList;