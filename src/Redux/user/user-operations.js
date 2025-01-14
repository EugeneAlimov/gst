import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["user"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}`,
    prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    providesTags: (result) =>
      result
        ? [...result.map(({ id }) => ({ type: "user", id })), { type: "user", id: "LIST" }]
        : [{ type: "user", id: "LIST" }],
    getUsers: builder.query({
      query: () => ({
        url: `/user/`,
      }),
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
    updateActiveBoard: builder.mutation({
      query: (id) => ({
        url: `/update-active-board/`,
        method: "PATCH",
        body: { active_board: `${id}` },
      }),
      invalidatesTags: [{ type: "user", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailQuery,
  useUpdateUserMutation,
  useUpdateActiveBoardMutation,
} = userApi;
