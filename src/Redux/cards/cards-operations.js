import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const cardsApi = createApi({
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
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
    createNewCard: builder.mutation({
      query: (cardTemplate) => ({
        url: `/card/`,
        method: "POST",
        body: { ...cardTemplate },
      }),
      invalidatesTags: [{ type: "cards", id: "LIST" }],
    }),

    getOneCard: builder.query({
      query: (cardId) => ({
        url: `/card/${cardId}/`,
      }),
      providesTags: ["cards"],
    }),
    updateCardDetail: builder.mutation({
      query: ({ cardId, ...patchData }) => ({
        url: `/card/${cardId}/`,
        method: "PATCH",
        body: { ...patchData },
      }),
      invalidatesTags: [{ type: "cards", id: "LIST" }],
    }),
    updateCardInColumn: builder.mutation({
      query: ({target_column_id, cards }) => ({
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
  useCreateNewCardMutation,
  useUpdateCardDetailMutation,
  useUpdateCardInColumnMutation,
  useGetOneCardQuery,
} = cardsApi;
