import { apiSlice } from "../api/api";
import { addBagListItem } from "@/data-access/slices/bag-list";

export interface BagResponse {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  modelNumber: string;
  laptopSize: string;
  color: string;
  waterResistant: boolean;
  BagMaterial?: { id: string; name: string };
  url1: string; url2: string; url3: string; url4: string; url5: string;
  image1: string; image2: string; image3: string; image4: string; image5: string;
  dynamicSpecs: Array<{ key: string; value: string }>;
}

const bagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBagsList: builder.query({
      query: ({ material_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetBags($materialName: String, $status: Boolean) {
              allBags(materialName: $materialName, status: $status) {
                id
                name
                description
                discount
                price
                age
                status
                count
                modelNumber
                laptopSize
                color
                waterResistant
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
                BagMaterial:material {
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
          variables: { materialName: material_name, status },
        },
      }),
      transformResponse: (response: { data: { allBags: BagResponse[] } }) => {
        if (!response?.data?.allBags) return [];
        
        return response.data.allBags.map((obj) => {
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
            material_id: obj?.BagMaterial?.id || '',
            material_name: obj?.BagMaterial?.name || '',
            model_number: obj?.modelNumber || '',
            laptop_size: obj?.laptopSize || '',
            color: obj?.color || '',
            water_resistant: obj?.waterResistant || false,
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
            data.forEach((item) => dispatch(addBagListItem(item)));
          }
        } catch (error) {
          console.error("Error fetching bags:", error);
        }
      },
    }),

    getBagById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetBagById($id: ID!) {
              bagById(id: $id) {
                id
                name
                description
                discount
                price
                age
                status
                count
                modelNumber
                laptopSize
                color
                waterResistant
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
                BagMaterial:material {
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
      transformResponse: (response: { data: { bagById: BagResponse } }) => {
        const obj = response?.data?.bagById;
        if (!obj) return null;
        
        let ageArabic = obj?.age || '';
        const ageLower = ageArabic.toLowerCase();
        if (ageLower === 'jdyd' || ageLower === 'new') ageArabic = 'جديد';
        else if (ageLower === 'used') ageArabic = 'مستعمل';
        else if (ageLower === 'openbox') ageArabic = 'اوبن بوكس';
        
        return {
          ...obj,
          age: ageArabic,
          material_name: obj?.BagMaterial?.name || '',
          material_info: obj?.BagMaterial,
        };
      },
    }),

    getBagMaterials: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetBagMaterials {
              bagMaterials {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { bagMaterials: Array<{ id: string; name: string }> } }) => {
        return response?.data?.bagMaterials || [];
      },
    }),
  }),
});

export const {
  useGetBagsListQuery,
  useGetBagByIdQuery,
  useGetBagMaterialsQuery,
} = bagApi;