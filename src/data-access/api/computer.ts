// src/data-access/api/computer.ts
import { apiSlice } from "../api/api";
import { addComputerListItem } from "@/data-access/slices/computer-list";

export interface ComputerResponse {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  type?: { id: string; name: string };
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

const computerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComputersList: builder.query({
      query: ({ type_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetComputers($typeName: String, $status: Boolean) {
              allComputers(typeName: $typeName, status: $status) {
                id
                name
                description
                discount
                price
                age
                status
                count
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
      transformResponse: (response: { data: { allComputers: ComputerResponse[] } }) => {
        if (!response?.data?.allComputers) return [];
        
        const computerList = response.data.allComputers.map((obj) => {
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
        return computerList;
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => {
              dispatch(addComputerListItem(item));
            });
          }
        } catch (error) {
          console.error("Error fetching computers:", error);
        }
      },
    }),

    getComputerById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetComputerById($id: ID!) {
              computerById(id: $id) {
                id
                name
                description
                discount
                price
                age
                status
                count
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
      transformResponse: (response: { data: { computerById: ComputerResponse } }) => {
        const obj = response?.data?.computerById;
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
          type_info: obj?.type,
        };
      },
    }),

    getComputerTypes: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetComputerTypes {
              computerTypes {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { computerTypes: Array<{ id: string; name: string }> } }) => {
        return response?.data?.computerTypes || [];
      },
    }),
  }),
});

export const {
  useGetComputersListQuery,
  useGetComputerByIdQuery,
  useGetComputerTypesQuery,
} = computerApi;