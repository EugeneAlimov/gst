import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  tagTypes: ["cards"],
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://127.0.0.1:8000/api/v1",
    baseUrl: `${baseURL}`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = getState().auth;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCards: builder.query({
      query: (columnId) => ({
        url: `/card/`,
        params: {
          column: columnId,
        },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "cards", id })), { type: "cards", id: "LIST" }]
          : [{ type: "cards", id: "LIST" }],
    }),
    getOneCard: builder.query({
      query: (cardId) => ({
        url: `/card/${cardId}/`,
      }),
      providesTags: ["cards"],
    }),
    updateCardDetail: builder.mutation({
      query: ({ cardId, cardObj }) => ({
        url: `/card/${cardId}/`,
        method: "PATCH",
        body: { ...cardObj },
      }),
      invalidatesTags: [{ type: "cards", id: "LIST" }],
    }),
    updateCardInColumn: builder.mutation({
      query: ({source_column_id, target_column_id, cards }) => ({
        url: `/card/update-positions/`,
        method: "POST",
        body: { target_column_id, cards },
      }),
      invalidatesTags: [{ type: "cards", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCardsQuery,
  useUpdateCardDetailMutation,
  useUpdateCardInColumnMutation,
  useGetOneCardQuery,
} = cardsApi;
