"use client";

import React from "react";
import CardPlayStation from "@/feature/card-playstation";
import { Skeleton } from "@mui/material";
import { PlayStationItem } from "@/data-access/slices/playstation-list";

export const PlayStationList = ({
  isLoading,
  selectedList,
  dollarPrice,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4"
}: {
  dollarPrice: number;
  isLoading: boolean;
  selectedList: PlayStationItem[];
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
                selectedList.map((playstationItem, key) => (
                  <div key={key} className="w-full min-w-0">
                    <CardPlayStation
                      height="180px"
                      rounded="10px"
                      width="100%"
                      image={playstationItem.image ?? ""}
                      title={playstationItem.name ?? ""}
                      price={playstationItem.price ?? ""}
                      description={playstationItem.description ?? ""}
                      dollarPrice={dollarPrice}
                      id={playstationItem.id ?? ""}
                      discount={playstationItem.discount ?? ""}
                      age={playstationItem.age ?? ""}
                      type_name={playstationItem.type_name ?? ""}
                      storage={playstationItem.storage ?? ""}
                      color={playstationItem.color ?? ""}
                      includes_controller={playstationItem.includes_controller}
                      controller_count={playstationItem.controller_count}
                      dynamicSpecs={playstationItem.dynamicSpecs ?? []}
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

export default PlayStationList;