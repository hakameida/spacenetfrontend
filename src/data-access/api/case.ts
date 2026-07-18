// data-access/api/case.ts
import { apiSlice } from "../api/api";
import { addCaseListItem } from "@/data-access/slices/case-list";

export interface CaseResponse {
  id: string;
  name: string;
  description: string;
  discount: string;
  price: string;
  age: string;
  status: boolean;
  count: number;
  type?: { id: string; name: string };
  cpu: string;
  gpu: string;
  ram: string;
  motherboard: string;
  psu: string;
  storage: string;
  case: string;
  cooling: string;
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
}

const caseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all cases (PC Builds)
    getCasesList: builder.query({
      query: ({ type_name, status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetCases($typeName: String, $status: Boolean) {
              allCases(typeName: $typeName, status: $status) {
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
                motherboard
                psu
                storage
                case
                cooling
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
      transformResponse: (response: { data: { allCases: CaseResponse[] } }) => {
        if (!response?.data?.allCases) return [];
        
        const caseList = response.data.allCases.map((obj) => {
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
            cpu: obj?.cpu || '',
            gpu: obj?.gpu || '',
            ram: obj?.ram || '',
            motherboard: obj?.motherboard || '',
            psu: obj?.psu || '',
            storage: obj?.storage || '',
            case: obj?.case || '',
            cooling: obj?.cooling || '',
            os: obj?.os || '',
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
        return caseList;
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.length > 0) {
            data.forEach((item) => {
              dispatch(addCaseListItem(item));
            });
          }
        } catch (error) {
          console.error("Error fetching cases:", error);
        }
      },
    }),

    // Get case by ID
    getCaseById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetCaseById($id: ID!) {
              caseById(id: $id) {
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
                motherboard
                psu
                storage
                case
                cooling
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
      transformResponse: (response: { data: { caseById: CaseResponse } }) => {
        const obj = response?.data?.caseById;
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

    // Get case types for filter options
    getCaseTypes: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetCaseTypes {
              caseTypes {
                id
                name
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data: { caseTypes: Array<{ id: string; name: string }> } }) => {
        return response?.data?.caseTypes || [];
      },
    }),
  }),
});

export const {
  useGetCasesListQuery,
  useGetCaseByIdQuery,
  useGetCaseTypesQuery,
} = caseApi;