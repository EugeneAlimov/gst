import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  tagTypes: ["cards"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.accessToken || localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
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
      providesTags: (result, error, cardId) => [{ type: "cards", id: cardId }],
    }),

    updateCardDetail: builder.mutation({
      query: ({ id, ...patchData }) => ({
        url: `/card/${id}/`,
        method: "PATCH",
        body: { ...patchData },
      }),
      // Инвалидируем теги сразу после успешного обновления
      invalidatesTags: (result, error, { id }) => [
        { type: "cards", id },
        { type: "cards", id: "LIST" },
      ],
    }),

    updateCardInColumn: builder.mutation({
      query: ({ target_column_id, cards }) => ({
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