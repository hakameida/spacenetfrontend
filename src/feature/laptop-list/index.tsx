"use client";
import React, { useEffect, useState } from "react";
import CardProduct from "@/components/card/card-product";
import { Skeleton } from "@mui/material";

interface ProductList {
  description?: string;
  discount?: string;
  id?: string;
  image?: string;
  name?: string;
  price?: string;
  type?: string;
  age?: string;
}

export const LaptopList = ({
  isLoading,
  selectedList,
  dollarPrice,
  title,
  gridClassName = "grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4"
}: {
  dollarPrice: number;
  isLoading: boolean;
  selectedList: ProductList[];
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
              {Array.from(new Array(8)).map((_, index) => (
                <div key={index} className="w-full">
                  <div
                    className={"card"}
                    style={{
                      width: "100%",
                      height: "300px",
                      borderRadius: "10px",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                    <div className="content">
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </div>
                    <div className="card-icons w-full bg-[#dbdbdb] opacity-45 z-40 h-[70px] flex items-center justify-center gap-x-4">
                      <Skeleton variant="circular" width="40px" height="40px" />
                      <Skeleton variant="circular" width="40px" height="40px" />
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
              {selectedList?.map((laptopItem, key) => (
                <div key={key} className="w-full">
                  <CardProduct
                    height="300px"
                    rounded="10px"
                    width="100%"
                    image={laptopItem.image ? laptopItem.image : ""}
                    title={laptopItem.name ? laptopItem.name : ""}
                    price={laptopItem.price ? laptopItem.price : ""}
                    description={
                      laptopItem.description ? laptopItem.description : ""
                    }
                    dollarPrice={dollarPrice}
                    icons={true}
                    id={laptopItem.id ? laptopItem.id : ""}
                    age={laptopItem.age ? laptopItem.age : ""}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @media (max-width: 640px) {
          .grid {
            gap: 0.5rem;
          }
        }
        
        /* Ensure cards don't overflow on very small screens */
        @media (max-width: 480px) {
          :global(.grid-cols-2) {
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};