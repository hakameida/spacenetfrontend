// shared.ts
import { apiSlice } from "../api/api";

export interface DollarResponse {
  dollarPrice: number;
  id: string;
}

// Define the exact product module types
export type ProductModule = "LAPTOP" | "COMPUTER" | "ACCESSORY";

export interface OfferResponse {
  id: string;
  productId: string;
  price: string;
  status: boolean;
  productModule: ProductModule;
}

export interface Offer {
  id: string;
  productId: string;
  price: string;
  productModule: ProductModule;
}

export interface YouTubeResponse {
  id: string;
  youtubeUrl: string;
}

const sharedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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