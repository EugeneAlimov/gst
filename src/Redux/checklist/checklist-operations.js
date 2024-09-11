import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const checklistApi = createApi({
  reducerPath: "checklistApi",
  tagTypes: ["checklist"],
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
    getChecklist: builder.query({
      query: (id) => ({
        url: `/checklist-item/`,
        params: {
          card: id,
        },
      }),
      providesTags: (result) => result
          ? [
              ...result.map(({ id }) => ({ type: 'checklist', id })),
              { type: 'checklist', id: 'LIST' },
            ]
          : [{ type: 'checklist', id: 'LIST' }],
    }),
    getColumnDetail: builder.mutation({
      query: (id) => ({
        url: `/checklist-item/${id}/`,
        method: "PATCH",
        body: { is_active: "true" },
      }),
      invalidatesTags: ["checklist"],
    }),
  }),
});

export const { useGetChecklistQuery, useGetChecklistDetailMutation } = checklistApi;