import { apiSlice } from "../api/api";
import { addCameraListItem } from "@/data-access/slices/camera-list";

export interface CameraResponse {
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
  sensorType: string;
  megapixels: string;
  videoResolution: string;
  lensMount: string;
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

const cameraApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all cameras
    getCamerasList: builder.query({
      query: ({ type_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetCameras($typeName: String, $status: Boolean) {
              allCameras(typeName: $typeName, status: $status) {
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
                sensorType
                megapixels
                videoResolution
                lensMount
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
      transformResponse: (response: { data: { allCameras: CameraResponse[] } }) => {
        if (!response?.data?.allCameras) return [];
        
        const cameraList = response.data.allCameras.map((obj) => {
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
            brand: obj?.brand || '',
            model_number: obj?.modelNumber || '',
            sensor_type: obj?.sensorType || '',
            megapixels: obj?.megapixels || '',
            video_resolution: obj?.videoResolution || '',
            lens_mount: obj?.lensMount || '',
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
        return cameraList;
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => {
              dispatch(addCameraListItem(item));
            });
          }
        } catch (error) {
          console.error("Error fetching cameras:", error);
        }
      },
    }),

    // Get camera by ID
    getCameraById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetCameraById($id: ID!) {
              cameraById(id: $id) {
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
                sensorType
                megapixels
                videoResolution
                lensMount
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
      transformResponse: (response: { data: { cameraById: CameraResponse } }) => {
        const obj = response?.data?.cameraById;
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

    // Get camera types for filter options
    getCameraTypes: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetCameraTypes {
              cameraTypes {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { cameraTypes: Array<{ id: string; name: string }> } }) => {
        return response?.data?.cameraTypes || [];
      },
    }),
  }),
});

export const {
  useGetCamerasListQuery,
  useGetCameraByIdQuery,
  useGetCameraTypesQuery,
} = cameraApi;