import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // columns: [],
  // id: null,
  // name: "",
  // created: null,
  // updated: null,
  // users: [],
  column: {},
  columnsLength: 0,
};

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    storeOneColumn: (state, actions) => {
      state.column = actions.payload
    },
    storeColumnsLength: (state, actions) => {
      state.columnsLength = actions.payload
    }
  },
  extraReducers(builder) {

  },
});

export default columnSlice.reducer;
export const { storeOneColumn, storeColumnsLength } = columnSlice.actions;

export const columnData = (state) => state.column;
