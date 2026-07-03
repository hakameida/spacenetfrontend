// src/data-access/api/playstation.ts
import { apiSlice } from "../api/api";
import { addPlayStationListItem } from "@/data-access/slices/playstation-list";

export interface PlayStationResponse {
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
  modelNumber: string;
  storage: string;
  color: string;
  includesController: boolean;
  controllerCount: number;
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

const playstationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all playstations
    getPlayStationsList: builder.query({
      query: ({ type_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetPlayStations($typeName: String, $status: Boolean) {
              allPlaystations(typeName: $typeName, status: $status) {
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
                storage
                color
                includesController
                controllerCount
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
      transformResponse: (response: { data: { allPlaystations: PlayStationResponse[] } }) => {
        if (!response?.data?.allPlaystations) return [];
        
        const playstationList = response.data.allPlaystations.map((obj) => {
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
            brand: obj?.brand || 'Sony',
            model_number: obj?.modelNumber || '',
            storage: obj?.storage || '',
            color: obj?.color || '',
            includes_controller: obj?.includesController ?? true,
            controller_count: obj?.controllerCount || 1,
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
        return playstationList;
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => {
              dispatch(addPlayStationListItem(item));
            });
          }
        } catch (error) {
          console.error("Error fetching playstations:", error);
        }
      },
    }),

    // Get playstation by ID - FIXED
    getPlayStationById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetPlayStationById($id: ID!) {
              playstationById(id: $id) {
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
                storage
                color
                includesController
                controllerCount
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
      transformResponse: (response: { data: { playstationById: PlayStationResponse } }) => {
        const obj = response?.data?.playstationById;
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

    // Get playstation types for filter options
    getPlayStationTypes: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetPlayStationTypes {
              playstationTypes {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { playstationTypes: Array<{ id: string; name: string }> } }) => {
        return response?.data?.playstationTypes || [];
      },
    }),
  }),
});

export const {
  useGetPlayStationsListQuery,
  useGetPlayStationByIdQuery,
  useGetPlayStationTypesQuery,
} = playstationApi;