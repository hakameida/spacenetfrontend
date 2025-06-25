  "use client";

  import MultipleItems from "@/components/react-slick/react-slick";
  import React, { useEffect, useState } from "react";
  import { useGetDollarQuery, useGetSearchProductsListQuery } from "@/data-access/api/products/products";
  import { selectSearchList } from "@/data-access/slices/search-list";

  import { useAppSelector } from "@/store";
  import Image from "next/image";
  import { Skeleton } from "@mui/material";
  import CardProduct from "@/components/card/card-product";

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

  export const SearchList = ({ word }: { word: string }) => {
    const { data, isLoading } = useGetSearchProductsListQuery({ word });
    const selectedSearchListList: ProductList[] = useAppSelector((state) =>
      selectSearchList(state)
    );

    const { data: dollarData } = useGetDollarQuery({});
    const [dollar, setDollar] = useState(0);
    useEffect(() => {
      if (dollarData?.data?.dollarPriceByPk) {
        setDollar(dollarData?.data?.dollarPriceByPk?.dollarPrice ?? 0);
      }
    }, [dollarData]); // 👈 Watch the correct query
    
  return (
    <>
      {isLoading ? (
        <div className="container mx-auto">
          <div className="my-[10px]">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <div className="my-[40px]">
            <div className="grid-container">
              {Array.from(new Array(8)).map((_, index) => (
                <div key={index} className="grid-item">
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
        <>
          {selectedSearchListList?.length > 0 ? (
            <div className="container mx-auto">
              <div className="my-[10px]">
                <h2 className="bg-white text-gray-500 text-center p-6 rounded cursor-default select-none"
        style={{ color: "rgba(34,82,154,1)" }}>
                  نتيجة البحث عن : {word}
                </h2>

              </div>
              <div className="my-[40px]">
                <div className="grid-container">
                  {selectedSearchListList?.map((laptopItem, key) => (
                    <div key={key} className="grid-item">
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
                        dollarPrice={dollar}
                        icons={true}
                        id={laptopItem.id ? laptopItem.id : ""}
                        age={laptopItem.age ? laptopItem.age : ""}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col w-full h-[400px]"
            
        style={{ color: "rgba(34,82,154,1)" }}>
              <p> لم يتم العثور على منتجات متطابقة مع نتيجة البحث </p>
            </div>
          )}
        </>
      )}
    </>
  );
};
