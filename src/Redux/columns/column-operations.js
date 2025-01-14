import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../axiosDefaults";

export const columnsApi = createApi({
  reducerPath: "columnsApi",
  tagTypes: ["columns"],
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
      query: ({ id, columns }) => ({
        url: `/columns-on-board/${id}/`,
        method: "PATCH",
        body: { columns },
      }),
      invalidatesTags: [{ type: "columns", id: "LIST" }],
    }),
    UpdateColumnDetails: builder.mutation({
      query: ({ id, field }) => ({
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
  useUpdateColumnDetailsMutation,
} = columnsApi;
