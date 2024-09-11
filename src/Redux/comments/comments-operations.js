import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const commentsApi = createApi({
  reducerPath: "ccommentsApi",
  tagTypes: ["comment"],
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
    getComments: builder.query({
      query: (id) => ({
        url: `/comment/`,
        params: {
          card: id,
        },
      }),
      providesTags: (result) => result
          ? [
              ...result.map(({ id }) => ({ type: 'comment', id })),
              { type: 'comment', id: 'LIST' },
            ]
          : [{ type: 'comment', id: 'LIST' }],
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
