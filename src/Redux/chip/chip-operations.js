// // src/Redux/chip/chip-operations.js
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { baseURL } from "../axiosDefaults";
// import { cardsApi } from "../cards/cards-operations";

// export const chipsApi = createApi({
//   reducerPath: "chipsApi",
//   tagTypes: ["chips"],
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${baseURL}`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth?.accessToken || localStorage.getItem("access_token");
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getChips: builder.query({
//       query: (cardId) => ({
//         url: `/chip/`,
//         params: cardId ? { card: cardId } : undefined,
//       }),
//       providesTags: (result) =>
//         result
//           ? [...result.map(({ id }) => ({ type: "chips", id })), { type: "chips", id: "LIST" }]
//           : [{ type: "chips", id: "LIST" }],
//     }),

//     getAllChips: builder.query({
//       query: () => ({
//         url: `/chip/`,
//       }),
//       providesTags: (result) =>
//         result
//           ? [...result.map(({ id }) => ({ type: "chips", id })), { type: "chips", id: "LIST" }]
//           : [{ type: "chips", id: "LIST" }],
//     }),

//     createNewChip: builder.mutation({
//       query: (newChip) => ({
//         url: `/chip/`,
//         method: "POST",
//         body: {
//           name: newChip.text || newChip.name,
//           color_id: newChip.color_id,
//           text: newChip.text || newChip.name,
//           color_number: newChip.color_number,
//         },
//       }),
//       invalidatesTags: [{ type: "chips", id: "LIST" }],
//     }),

//     updateChip: builder.mutation({
//       query: ({ chipId, updateChipObj }) => ({
//         url: `/chip/${chipId}/`,
//         method: "PATCH",
//         body: {
//           name: updateChipObj.name || updateChipObj.text,
//           text: updateChipObj.name || updateChipObj.text,
//           color_id: updateChipObj.color_id,
//         },
//       }),
//       // Полная инвалидация - заставляем RTK Query перезагрузить все данные
//       invalidatesTags: [
//         { type: "chips", id: "LIST" },
//         "chips", // Инвалидируем весь кэш чипов
//       ],
//       // И дополнительно принудительное обновление
//       async onQueryStarted({ chipId }, { dispatch, queryFulfilled }) {
//         try {
//           await queryFulfilled;

//           // Принудительно перезагружаем getAllChips через небольшую задержку
//           setTimeout(() => {
//             dispatch(
//               chipsApi.endpoints.getAllChips.initiate(undefined, {
//                 forceRefetch: true,
//               })
//             );
//           }, 100);
//         } catch (error) {
//           console.error("Ошибка при обновлении чипа:", error);
//         }
//       },
//     }),

//     deleteChip: builder.mutation({
//       query: (chipId) => ({
//         url: `/chip/${chipId}/`,
//         method: "DELETE",
//       }),
//       invalidatesTags: [{ type: "chips", id: "LIST" }],
//     }),
//   }),
// });

// // Создаем отдельный API для цветов
// export const colorsApi = createApi({
//   reducerPath: "colorsApi",
//   tagTypes: ["colors"],
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${baseURL}`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth?.accessToken || localStorage.getItem("access_token");
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getColors: builder.query({
//       query: () => ({
//         url: `/color/`,
//       }),
//       providesTags: ["colors"],
//     }),

//     getColorPalette: builder.query({
//       query: () => ({
//         url: `/color/palette/`,
//       }),
//       providesTags: ["colors"],
//     }),
//   }),
// });

// export const {
//   useGetChipsQuery,
//   useCreateNewChipMutation,
//   useUpdateChipMutation,
//   useDeleteChipMutation,
//   useGetAllChipsQuery,
// } = chipsApi;

// export const { useGetColorsQuery, useGetColorPaletteQuery } = colorsApi;


// src/Redux/chip/chip-operations.js
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
    getChips: builder.query({
      query: (cardId) => ({
        url: `/chip/`,
        params: cardId ? { card: cardId } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "chips", id })), { type: "chips", id: "LIST" }]
          : [{ type: "chips", id: "LIST" }],
    }),

    getAllChips: builder.query({
      query: () => ({
        url: `/chip/`,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "chips", id })), { type: "chips", id: "LIST" }]
          : [{ type: "chips", id: "LIST" }],
    }),

    createNewChip: builder.mutation({
      query: (newChip) => ({
        url: `/chip/`,
        method: "POST",
        body: {
          name: newChip.text || newChip.name,
          color_id: newChip.color_id,
          text: newChip.text || newChip.name,
          color_number: newChip.color_number,
        },
      }),
      invalidatesTags: [{ type: "chips", id: "LIST" }],
    }),

    updateChip: builder.mutation({
      query: ({ chipId, updateChipObj }) => ({
        url: `/chip/${chipId}/`,
        method: "PATCH",
        body: {
          name: updateChipObj.name || updateChipObj.text,
          text: updateChipObj.name || updateChipObj.text,
          color_id: updateChipObj.color_id,
        },
      }),
      // Консервативная инвалидация - гарантированно работает
      invalidatesTags: (result, error, { chipId }) => [
        { type: "chips", id: chipId },
        { type: "chips", id: "LIST" },
        "chips" // Оставляем полную инвалидацию для гарантии
      ],
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

// Создаем отдельный API для цветов
export const colorsApi = createApi({
  reducerPath: "colorsApi",
  tagTypes: ["colors"],
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
    getColors: builder.query({
      query: () => ({
        url: `/color/`,
      }),
      providesTags: ["colors"],
    }),

    getColorPalette: builder.query({
      query: () => ({
        url: `/color/palette/`,
      }),
      providesTags: ["colors"],
    }),
  }),
});

export const {
  useGetChipsQuery,
  useCreateNewChipMutation,
  useUpdateChipMutation,
  useDeleteChipMutation,
  useGetAllChipsQuery,
} = chipsApi;

export const { useGetColorsQuery, useGetColorPaletteQuery } = colorsApi;