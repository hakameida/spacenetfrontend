import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const MARKET_SECRET_TOKEN = "sk_live_2f48cae0f7d94b3e9b75a32e61d1ab8a"; 

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://spacenetserver.up.railway.app/graphql/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Authorization", `Bearer ${MARKET_SECRET_TOKEN}`); 
      return headers;
    },
  }),
  endpoints: () => ({}),
});
