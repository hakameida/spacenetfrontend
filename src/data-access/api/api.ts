import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const MARKET_SECRET_TOKEN = process.env.MARKET_SECRET_TOKEN;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.spacenetstore.com/graphql/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Authorization", `Bearer ${MARKET_SECRET_TOKEN}`); 
      return headers;
    },
  }),
  endpoints: () => ({}),
});
