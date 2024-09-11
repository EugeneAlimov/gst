import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const boardsApi = createApi({
  reducerPath: "boardsApi",
  tagTypes: ["boards"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}`,
    // baseUrl: "http://127.0.0.1:8000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = getState().auth;
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBoards: builder.query({
      query: () => ({
        url: `/board/`,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "boards", id })), { type: "boards", id: "LIST" }]
          : [{ type: "boards", id: "LIST" }],
    }),
    getBoardDetail: builder.query({
      query: (id) => ({
        url: `/board/${id}/`,
      }),
      providesTags: ["boards"],
    }),
    getActiveBoard: builder.mutation({
      query: (id) => ({
        url: `/board/${id}/`,
        method: "PATCH",
        body: { is_active: "true" },
      }),
      invalidatesTags: ["boards"],
    }),
  }),
});

export const { useGetBoardsQuery, useGetBoardDetailQuery, useGetActiveBoardMutation } = boardsApi;
