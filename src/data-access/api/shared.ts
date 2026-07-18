// data-access/api/shared.ts

import { apiSlice } from "../api/api";

export interface DollarResponse {
  dollarPrice: number;
  id: string;
}

export type ProductModule = "LAPTOP" | "COMPUTER" | "ACCESSORY" | "PLAYSTATION" | "CAMERA" |"STORAGE" | "CASE";

export interface OfferResponse {
  id: string;
  productId: string;
  price: string;
  status: boolean;
  productModule: ProductModule;
  createdAt?: string;
  durationDays?: number;
  isExpired?: boolean;
  expiryDate?: string;
  remainingDays?: number;
}

export interface Offer {
  id: string;
  productId: string;
  price: string;
  productModule: ProductModule;
  createdAt: string;
  durationDays: number;
  isExpired: boolean;
  expiryDate: string;
  remainingDays: number;
}

export interface YouTubeResponse {
  id: string;
  youtubeUrl: string;
}

const sharedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Dollar Price
    getDollar: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetDollarPrice {
              dollarPriceByPk(id: "651a4e4d-e6f4-4546-a2e4-739e4e96ebb9") {
                dollarPrice
                id
              }
            }
          `,
        },
      }),
    }),

    getYoutubeUrl: builder.query({
      query: () => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetYoutubeLinks {
              youtubeLinks {
                id
                youtubeUrl
              }
            }
          `,
        },
      }),
    }),

    // Get Offers List
    getOffersList: builder.query({
      query: ({ status = true }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetOffersList($status: Boolean) {
              allOffers(status: $status) {
                id
                productId
                price
                productModule
                status
                createdAt
                durationDays
                isExpired
                expiryDate
                remainingDays
              }
            }
          `,
          variables: { status },
        },
      }),
      transformResponse: (response: { data: { allOffers: OfferResponse[] } }) => {
        if (!response?.data?.allOffers) return [];
        
        return response.data.allOffers.map((obj) => ({
          id: obj?.id,
          productId: obj?.productId,
          price: obj?.price,
          productModule: obj?.productModule,
          createdAt: obj?.createdAt || new Date().toISOString(),
          durationDays: obj?.durationDays || 7,
          isExpired: obj?.isExpired || false,
          expiryDate: obj?.expiryDate || '',
          remainingDays: obj?.remainingDays || 0,
        })) as Offer[];
      },
    }),

    
    getOfferById: builder.query({
      query: ({ id }) => ({
        url: ``,
        method: "POST",
        body: {
          query: `
            query GetOfferById($id: ID!) {
              offerById(id: $id) {
                id
                productId
                price
                productModule
                status
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
  useGetDollarQuery,
  useGetYoutubeUrlQuery,
  useGetOffersListQuery,
  useGetOfferByIdQuery,
} = sharedApi;