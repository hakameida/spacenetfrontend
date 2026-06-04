// src/data-access/api/accessory.ts

import { apiSlice } from "../api/api";
import { addAccessoryListItem } from "@/data-access/slices/accessory-list";

export interface AccessoryResponse {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  AccessoryType?: { id: string; name: string };
  brand: string;
  modelNumber: string;
  compatibility: string;
  url1: string;
  url2: string;
  url3: string;
  url4: string;
  url5: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  dynamicSpecs: Array<{ key: string; value: string }>;
}

const accessoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all accessories
    getAccessoriesList: builder.query({
      query: ({ type_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetAccessories($typeName: String, $status: Boolean) {
              allAccessories(typeName: $typeName, status: $status) {
                id
                name
                description
                discount
                price
                age
                status
                count
                brand
                modelNumber
                compatibility
                url1
                url2
                url3
                url4
                url5
                image1
                image2
                image3
                image4
                image5
                AccessoryType:type {
                  id
                  name
                }
                dynamicSpecs {
                  key
                  value
                }
              }
            }
          `,
          variables: { typeName: type_name, status },
        },
      }),
      transformResponse: (response: { data: { allAccessories: AccessoryResponse[] } }) => {
        if (!response?.data?.allAccessories) return [];
        
        const accessoryList = response.data.allAccessories.map((obj) => {
          // Convert age to Arabic only
          let ageArabic = obj?.age || '';
          const ageLower = ageArabic.toLowerCase();
          if (ageLower === 'jdyd' || ageLower === 'new') ageArabic = 'جديد';
          else if (ageLower === 'used') ageArabic = 'مستعمل';
          else if (ageLower === 'openbox') ageArabic = 'اوبن بوكس';
          
          // Keep type in English (keyboard, mouse, headset, etc.)
          const typeName = obj?.AccessoryType?.name || '';
          
          return {
            id: obj?.id,
            name: obj?.name,
            description: obj?.description,
            discount: obj?.discount,
            price: obj?.price,
            age: ageArabic,
            status: obj?.status,
            count: obj?.count,
            brand: obj?.brand || '',
            model_number: obj?.modelNumber || '',
            compatibility: obj?.compatibility || '',
            type_id: obj?.AccessoryType?.id || '',
            type_name: typeName,  // Keep as English: keyboard, mouse, headset
            image: obj?.url1 || obj?.image1 || '',
            url1: obj?.url1,
            url2: obj?.url2,
            url3: obj?.url3,
            url4: obj?.url4,
            url5: obj?.url5,
            image1: obj?.image1,
            image2: obj?.image2,
            image3: obj?.image3,
            image4: obj?.image4,
            image5: obj?.image5,
            dynamicSpecs: obj?.dynamicSpecs || [],
          };
        });
        return accessoryList;
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => {
              dispatch(addAccessoryListItem(item));
            });
          }
        } catch (error) {
          console.error("Error fetching accessories:", error);
        }
      },
    }),

    // Get accessory by ID
    getAccessoryById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetAccessoryById($id: ID!) {
              accessoryById(id: $id) {
                id
                name
                description
                discount
                price
                age
                status
                count
                brand
                modelNumber
                compatibility
                url1
                url2
                url3
                url4
                url5
                image1
                image2
                image3
                image4
                image5
                AccessoryType:type {
                  id
                  name
                }
                dynamicSpecs {
                  key
                  value
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response: { data: { accessoryById: AccessoryResponse } }) => {
        const obj = response?.data?.accessoryById;
        if (!obj) return null;
        
        let ageArabic = obj?.age || '';
        const ageLower = ageArabic.toLowerCase();
        if (ageLower === 'jdyd' || ageLower === 'new') ageArabic = 'جديد';
        else if (ageLower === 'used') ageArabic = 'مستعمل';
        else if (ageLower === 'openbox') ageArabic = 'اوبن بوكس';
        
        return {
          ...obj,
          age: ageArabic,
          type_name: obj?.AccessoryType?.name || '',
          type_info: obj?.AccessoryType,
        };
      },
    }),

    // Get accessory types for filter options
    getAccessoryTypes: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetAccessoryTypes {
              accessoryTypes {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { accessoryTypes: Array<{ id: string; name: string }> } }) => {
        // Keep type names in English
        return response?.data?.accessoryTypes || [];
      },
    }),
  }),
});

export const {
  useGetAccessoriesListQuery,
  useGetAccessoryByIdQuery,
  useGetAccessoryTypesQuery,
} = accessoryApi;