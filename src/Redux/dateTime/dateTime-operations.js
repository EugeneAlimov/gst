import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const dateTimeApi = createApi({
  reducerPath: "dateTimeApi",
  tagTypes: ["dateTime"],
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
    getChips: builder.query({
      query: (id) => ({
        url: `/chip/`,
        params: {
          card: id,
        },
      }),
      providesTags: ["chips"],
    }),
    getAllChips: builder.query({
      query: () => ({
        url: `/chip/`,
      }),

      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "chips", id })), { type: "chips", id: "LIST" }]
          : [{ type: "chips", id: "LIST" }],
    }),
    createNewChip: builder.mutation({
      query: (newChip) => ({
        url: `/chip/`,
        method: "POST",
        body: { ...newChip },
      }),
      invalidatesTags: [{ type: "chips", id: "LIST" }],
    }),
    updateChip: builder.mutation({
      query: ({ chipId, updateChipObj }) => ({
        url: `/chip/${chipId}/`,
        method: "PATCH",
        body: { ...updateChipObj },
      }),
      invalidatesTags: [{ type: "chips", id: "LIST" }],
    }),
    deleteChip: builder.mutation({
      query: (chipId) => ({
        url: `/chip/${chipId}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "chips", id: "LIST" }],
    }),
  }),
});

export const {
  useGetChipsQuery,
  useUpdateChipMutation,
  useCreateNewChipMutation,
  useGetAllChipsQuery,
  useDeleteChipMutation,
} = dateTimeApi;
