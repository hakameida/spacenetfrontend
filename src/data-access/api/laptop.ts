import { apiSlice } from "../api/api";
import { addLaptopListItem } from "@/data-access/slices/laptop-list";

export interface LaptopResponse {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  cpu: string;
  gpu: string;
  ram: string;
  hard: string;
  screen: string;
  color: string;
  os: string;
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
  status: boolean;
  count: number;
}

const laptopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all laptops
    getLaptopsList: builder.query({
      query: ({ status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetLaptops($status: Boolean) {
              allLaptops(status: $status) {
                id
                name
                description
                discount
                price
                age
                cpu
                gpu
                ram
                hard
                screen
                color
                os
                url1
                image1
                dynamicSpecs {
                  key
                  value
                }
              }
            }
          `,
          variables: { status },
        },
      }),
      transformResponse: (response: { data: { allLaptops: LaptopResponse[] } }) => {
        if (!response?.data?.allLaptops) return [];
        
        const laptopList = response.data.allLaptops.map((obj) => ({
          id: obj?.id,
          name: obj?.name,
          description: obj?.description,
          discount: obj?.discount,
          price: obj?.price,
          age: obj?.age,
          cpu: obj?.cpu || '',
          gpu: obj?.gpu || '',
          ram: obj?.ram || '',
          hard: obj?.hard || '',
          screen: obj?.screen || '',
          color: obj?.color || '',
          os: obj?.os || '',
          image: obj?.url1 || obj?.image1 || '',
          dynamicSpecs: obj?.dynamicSpecs || [],
        }));
        return laptopList;
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => {
              dispatch(addLaptopListItem(item));
            });
          }
        } catch {
          return;
        }
      },
    }),

    // Get laptop by ID
    getLaptopById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetLaptopById($id: ID!) {
              laptopById(id: $id) {
                id
                name
                description
                discount
                price
                age
                status
                count
                cpu
                gpu
                ram
                hard
                screen
                color
                os
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
    }),
  }),
});

export const {
  useGetLaptopsListQuery,
  useGetLaptopByIdQuery,
} = laptopApi;