import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const boardsApi = createApi({
  reducerPath: "boardsApi",
  tagTypes: ["boards"],
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
    getUserBoards: builder.query({
      query: () => ({
        url: `/user-boards/`,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "boards", id })), { type: "boards", id: "LIST" }]
          : [{ type: "boards", id: "LIST" }],
    }),
    getBoards: builder.query({
      query: () => ({
        url: `/board/`,
      }),
      providesTags: ["boards"],
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

export const {
  useGetUserBoardsQuery,
  useGetBoardsQuery,
  useGetBoardDetailQuery,
  useGetActiveBoardMutation,
} = boardsApi;
