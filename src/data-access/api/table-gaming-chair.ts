import { apiSlice } from "../api/api";
import { addTableGamingChairListItem } from "@/data-access/slices/table-gaming-chair-list";

export interface TableGamingChairResponse {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  modelNumber: string;
  dimensions: string;
  maxWeight: string;
  color: string;
  weight: string;
  heightAdjustable: boolean;
  TableGamingChairType?: { id: string; name: string };
  url1: string; url2: string; url3: string; url4: string; url5: string;
  image1: string; image2: string; image3: string; image4: string; image5: string;
  dynamicSpecs: Array<{ key: string; value: string }>;
}

const tableGamingChairApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTableGamingChairsList: builder.query({
      query: ({ type_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetTableGamingChairs($typeName: String, $status: Boolean) {
              allTableGamingChairs(typeName: $typeName, status: $status) {
                id
                name
                description
                discount
                price
                age
                status
                count
                modelNumber
                dimensions
                maxWeight
                color
                weight
                heightAdjustable
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
                TableGamingChairType:type {
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
      transformResponse: (response: { data: { allTableGamingChairs: TableGamingChairResponse[] } }) => {
        if (!response?.data?.allTableGamingChairs) return [];
        
        return response.data.allTableGamingChairs.map((obj) => {
          let ageArabic = obj?.age || '';
          const ageLower = ageArabic.toLowerCase();
          if (ageLower === 'jdyd' || ageLower === 'new') ageArabic = 'جديد';
          else if (ageLower === 'used') ageArabic = 'مستعمل';
          else if (ageLower === 'openbox') ageArabic = 'اوبن بوكس';
          
          return {
            id: obj?.id,
            name: obj?.name,
            description: obj?.description,
            discount: obj?.discount,
            price: obj?.price,
            age: ageArabic,
            status: obj?.status,
            count: obj?.count,
            type_id: obj?.TableGamingChairType?.id || '',
            type_name: obj?.TableGamingChairType?.name || '',
            model_number: obj?.modelNumber || '',
            dimensions: obj?.dimensions || '',
            max_weight: obj?.maxWeight || '',
            color: obj?.color || '',
            weight: obj?.weight || '',
            height_adjustable: obj?.heightAdjustable || false,
            image: obj?.url1 || obj?.image1 || '',
            url1: obj?.url1, url2: obj?.url2, url3: obj?.url3, url4: obj?.url4, url5: obj?.url5,
            image1: obj?.image1, image2: obj?.image2, image3: obj?.image3, image4: obj?.image4, image5: obj?.image5,
            dynamicSpecs: obj?.dynamicSpecs || [],
          };
        });
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => dispatch(addTableGamingChairListItem(item)));
          }
        } catch (error) {
          console.error("Error fetching tables/chairs:", error);
        }
      },
    }),

    getTableGamingChairById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetTableGamingChairById($id: ID!) {
              tableGamingChairById(id: $id) {
                id
                name
                description
                discount
                price
                age
                status
                count
                modelNumber
                dimensions
                maxWeight
                color
                weight
                heightAdjustable
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
                TableGamingChairType:type {
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
      transformResponse: (response: { data: { tableGamingChairById: TableGamingChairResponse } }) => {
        const obj = response?.data?.tableGamingChairById;
        if (!obj) return null;
        
        let ageArabic = obj?.age || '';
        const ageLower = ageArabic.toLowerCase();
        if (ageLower === 'jdyd' || ageLower === 'new') ageArabic = 'جديد';
        else if (ageLower === 'used') ageArabic = 'مستعمل';
        else if (ageLower === 'openbox') ageArabic = 'اوبن بوكس';
        
        return {
          ...obj,
          age: ageArabic,
          type_name: obj?.TableGamingChairType?.name || '',
          type_info: obj?.TableGamingChairType,
        };
      },
    }),

    getTableGamingChairTypes: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetTableGamingChairTypes {
              tableGamingChairTypes {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { tableGamingChairTypes: Array<{ id: string; name: string }> } }) => {
        return response?.data?.tableGamingChairTypes || [];
      },
    }),
  }),
});

export const {
  useGetTableGamingChairsListQuery,
  useGetTableGamingChairByIdQuery,
  useGetTableGamingChairTypesQuery,
} = tableGamingChairApi;