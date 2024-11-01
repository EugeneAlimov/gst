import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const columnsApi = createApi({
  reducerPath: "columnsApi",
  tagTypes: ["columns"],
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
    getColumns: builder.query({
      query: (id) => ({
        url: `/column/`,
        params: {
          board: id,
        },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "columns", id })), { type: "columns", id: "LIST" }]
          : [{ type: "columns", id: "LIST" }],
    }),
    createNewColumn: builder.mutation({
      query: (newColumn) => ({
        url: `/column/`,
        method: "POST",
        body: { ...newColumn },
      }),
      invalidatesTags: [{ type: "columns", id: "LIST" }],
    }),
    getColumnDetail: builder.mutation({
      query: (id) => ({
        url: `/column/${id}/`,
        method: "PATCH",
        body: { is_active: "true" },
      }),
      invalidatesTags: [{ type: "columns", id: "LIST" }],
    }),
    UpdateColumnsPositions: builder.mutation({
      query: ({id, columns }) => ({
        url: `/columns-on-board/${id}/`,
        method: "PATCH",
        body: { columns },
      }),
      invalidatesTags: [{ type: "columns", id: "LIST" }],
    }),
    UpdateColumnDetails: builder.mutation({
      query: ({id, field }) => ({
        url: `/column/${id}/`,
        method: "PATCH",
        body: { ...field },
      }),
      invalidatesTags: [{ type: "columns", id: "LIST" }],
    }),
  }),
});

export const {
  useGetColumnsQuery,
  useGetColumnDetailMutation,
  useCreateNewColumnMutation,
  useUpdateColumnsPositionsMutation,
  useUpdateColumnDetailsMutation
} = columnsApi;
