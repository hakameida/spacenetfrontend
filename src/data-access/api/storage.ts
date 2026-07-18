// data-access/api/storage.ts
import { apiSlice } from "../api/api";
import { addStorageListItem } from "@/data-access/slices/storage-list";

export interface StorageResponse {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  type?: { id: string; name: string };
  brand: string;
  model_number: string;
  capacity: string;
  read_speed: string;
  write_speed: string;
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

const storageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all storage devices
    getStoragesList: builder.query({
      query: ({ type_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
           query GetStorages($typeName: String, $status: Boolean) {
              allStorages(typeName: $typeName, status: $status) {
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
                capacity
                readSpeed
                writeSpeed
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
                type {
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
      transformResponse: (response: { data: { allStorages: StorageResponse[] } }) => {
        if (!response?.data?.allStorages) return [];
        
        const storageList = response.data.allStorages.map((obj) => {
          // Convert age to Arabic
          let ageArabic = obj?.age || '';
          const ageLower = ageArabic.toLowerCase();
          if (ageLower === 'jdyd' || ageLower === 'new') ageArabic = 'جديد';
          else if (ageLower === 'used') ageArabic = 'مستعمل';
          else if (ageLower === 'openbox') ageArabic = 'اوبن بوكس';
          
          const typeName = obj?.type?.name || '';
          
          return {
            id: obj?.id,
            name: obj?.name,
            description: obj?.description,
            discount: obj?.discount,
            price: obj?.price,
            age: ageArabic,
            status: obj?.status,
            count: obj?.count,
            type_id: obj?.type?.id || '',
            type_name: typeName,
            brand: obj?.brand || '',
            model_number: obj?.model_number || '',
            capacity: obj?.capacity || '',
            read_speed: obj?.read_speed || '',
            write_speed: obj?.write_speed || '',
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
        return storageList;
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => {
              dispatch(addStorageListItem(item));
            });
          }
        } catch (error) {
          console.error("Error fetching storage devices:", error);
        }
      },
    }),

    // Get storage by ID
    getStorageById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetStorageById($id: ID!) {
              storageById(id: $id) {
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
                capacity
                readSpeed
                writeSpeed
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
                type {
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
      transformResponse: (response: { data: { storageById: StorageResponse } }) => {
        const obj = response?.data?.storageById;
        if (!obj) return null;
        
        let ageArabic = obj?.age || '';
        const ageLower = ageArabic.toLowerCase();
        if (ageLower === 'jdyd' || ageLower === 'new') ageArabic = 'جديد';
        else if (ageLower === 'used') ageArabic = 'مستعمل';
        else if (ageLower === 'openbox') ageArabic = 'اوبن بوكس';
        
        return {
          ...obj,
          age: ageArabic,
          type_name: obj?.type?.name || '',
        };
      },
    }),

    // Get storage types for filter options
    getStorageTypes: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetStorageTypes {
              storageTypes {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { storageTypes: Array<{ id: string; name: string }> } }) => {
        return response?.data?.storageTypes || [];
      },
    }),
  }),
});

export const {
  useGetStoragesListQuery,
  useGetStorageByIdQuery,
  useGetStorageTypesQuery,
} = storageApi;