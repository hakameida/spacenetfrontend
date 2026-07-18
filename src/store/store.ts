// store/store.ts
import { apiSlice } from "@/data-access/api/api";
import { laptopList } from "@/data-access/slices/laptop-list";
import { accessoryList } from "@/data-access/slices/accessory-list";
import { computerList } from "@/data-access/slices/computer-list"; 
import { cameraList } from "@/data-access/slices/camera-list";
import { playstationList } from "@/data-access/slices/playstation-list";
import { storageList } from "@/data-access/slices/storage-list"; // NEW
import { caseList } from "@/data-access/slices/case-list"; // NEW
import { configureStore } from "@reduxjs/toolkit";
import { allProductsList } from "@/data-access/slices/all-products-list";
import { productsTypeList } from "@/data-access/slices/products-types";
import { searchList } from "@/data-access/slices/search-list";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    laptopList,
    accessoryList,
    computerList,      
    playstationList,
    cameraList,
    storageList, // NEW
    caseList, // NEW
    allProductsList,
    productsTypeList,
    searchList,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;