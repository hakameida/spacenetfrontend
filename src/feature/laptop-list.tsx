"use client";

import React from "react";
import CardProduct from "@/components/card/card-product";
import { Skeleton } from "@mui/material";
import { LaptopItem } from "@/data-access/slices/laptop-list";

export const LaptopList = ({
  isLoading,
  selectedList,
  dollarPrice,
  title,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4"
}: {
  dollarPrice: number;
  isLoading: boolean;
  selectedList: LaptopItem[];
  title: string;
  gridClassName?: string;
}) => {

  return (
    <>
      {isLoading ? (
        <div className="container mx-auto my-[40px] px-2 md:px-4">
          <div className="my-[10px]">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
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
                        <Skeleton variant="text" width="65%" height={12} />
                        <Skeleton variant="text" width="55%" height={12} />
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
                selectedList.map((laptopItem, key) => (
                  <div key={key} className="w-full min-w-0">
                    <CardProduct
                      height="180px"
                      rounded="10px"
                      width="100%"
                      image={laptopItem.image ?? ""}
                      title={laptopItem.name ?? ""}
                      price={laptopItem.price ?? ""}
                      discount={laptopItem.discount ?? ""}
                      description={laptopItem.description ?? ""}
                      dollarPrice={dollarPrice}
                      icons={true}
                      id={laptopItem.id ?? ""}
                      age={laptopItem.age ?? ""}
                      cpu={laptopItem.cpu ?? ""}
                      gpu={laptopItem.gpu ?? ""}
                      ram={laptopItem.ram ?? ""}
                      storage={laptopItem.hard ?? ""}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 w-full">
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

export default LaptopList;