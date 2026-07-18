// feature/case-list/index.tsx
"use client";

import React from "react";
import CardCase from "@/feature/card-case";
import { Skeleton } from "@mui/material";
import { CaseItem } from "@/data-access/slices/case-list";

export const CaseList = ({
  isLoading,
  selectedList,
  dollarPrice,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4"
}: {
  dollarPrice: number;
  isLoading: boolean;
  selectedList: CaseItem[];
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
                selectedList.map((caseItem, key) => (
                  <div key={key} className="w-full min-w-0">
                    <CardCase
                      height="180px"
                      rounded="10px"
                      width="100%"
                      image={caseItem.image ?? ""}
                      title={caseItem.name ?? ""}
                      price={caseItem.price ?? ""}
                      description={caseItem.description ?? ""}
                      discount={caseItem.discount ?? ""}
                      dollarPrice={dollarPrice}
                      id={caseItem.id ?? ""}
                      age={caseItem.age ?? ""}
                      type_name={caseItem.type_name ?? ""}
                      cpu={caseItem.cpu ?? ""}
                      gpu={caseItem.gpu ?? ""}
                      ram={caseItem.ram ?? ""}
                      motherboard={caseItem.motherboard ?? ""}
                      psu={caseItem.psu ?? ""}
                      storage={caseItem.storage ?? ""}
                      case={caseItem.case ?? ""}
                      cooling={caseItem.cooling ?? ""}
                      os={caseItem.os ?? ""}
                      dynamicSpecs={caseItem.dynamicSpecs ?? []}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 w-full">
                  <p className="text-gray-500">لا توجد أجهزة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseList;