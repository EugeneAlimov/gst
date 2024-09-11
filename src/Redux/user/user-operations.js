import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["user"],
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
    getUsers: builder.query({
      query: () => ({
        url: `/user/`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "user", id })),
              { type: "user", id: "LIST" }
            ]
          : [{ type: "user", id: "LIST" }],
    }),
    getUserDetail: builder.query({
      query: (id) => ({
        url: `/user/${id}/`,
      }),
      providesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}/`,
        method: "PATCH",
        body: { is_active: "true" },
      }),
      invalidatesTags: [{ type: "user", id: "LIST" }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserDetailQuery, useUpdateUserMutation } = userApi;
