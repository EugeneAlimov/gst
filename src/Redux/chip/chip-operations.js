import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const chipsApi = createApi({
  reducerPath: "chipsApi",
  tagTypes: ["chips"],
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
    // providesTags: (result) =>
    //   result
    //     ? [...result.map(({ id }) => ({ type: "chips", id })), { type: "chips", id: "LIST" }]
    //     : [{ type: "chips", id: "LIST" }],
    getChips: builder.query({
      query: (id) => ({
        url: `/chip/`,
        params: {
          card: id,
        },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "chips", id })), { type: "chips", id: "LIST" }]
          : [{ type: "chips", id: "LIST" }],
      // providesTags: ["chips"],
    }),
    getAllChips: builder.query({
      query: () => ({
        url: `/chip/`,
      }),
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
} = chipsApi;
