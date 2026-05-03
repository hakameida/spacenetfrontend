import { apiSlice } from "../api/api";

export interface DollarResponse {
  dollarPrice: number;
  id: string;
}

// Define the exact product module types
export type ProductModule = "LAPTOP" | "COMPUTER" | "ACCESSORY";

export interface OfferResponse {
  id: string;
  name: string;
  oldprice: string;
  price: string;
  description: string;
  url1: string;
  image1: string;
  productId: string;
  productModule: ProductModule;
}

export interface Offer {
  id: string;
  name: string;
  oldprice: string;
  price: string;
  description: string;
  image: string;
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
                name
                oldprice
                price
                description
                url1
                image1
                productModule
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
          name: obj?.name,
          oldprice: obj?.oldprice || "0",
          price: obj?.price,
          description: obj?.description || "",
          image: obj?.url1 || obj?.image1 || "",
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
                name
                description
                oldprice
                price
                status
                productModule
                productId
                url1
                url2
                image1
                image2
                image3
                image4
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