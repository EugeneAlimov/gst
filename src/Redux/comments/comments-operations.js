import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const commentsApi = createApi({
  reducerPath: "ccommentsApi",
  tagTypes: ["comment"],
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://127.0.0.1:8000/api/v1",
    baseUrl: `${baseURL}`,
    prepareHeaders: (headers, { getState }) => {
      // const { accessToken } = getState().auth;
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getComments: builder.query({
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "comment", id })), { type: "comment", id: "LIST" }]
          : [{ type: "comment", id: "LIST" }],
      query: (id) => ({
        url: `/comment/`,
        params: {
          card: id,
        },
      }),
    }),
    getColumnDetail: builder.mutation({
      query: (id) => ({
        url: `/comment/${id}/`,
        method: "PATCH",
        body: { is_active: "true" },
      }),
      invalidatesTags: ["comment"],
    }),
  }),
});

export const { useGetCommentsQuery, useGetCommentDetailMutation } = commentsApi;
