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
    // builder.addCase(getColumns.fulfilled, (state, action) => {
    //   state.columns = action.payload;
    // });
    // builder.addCase(getColumnDetail.fulfilled, (state, action) => {
    //   console.log("action ", action.payload);
    //   state.columns = action.payload
    //   state.name = action.payload.name;
    //   state.created = action.payload.created
    //   state.updated = action.payload.updated
    //   state.users = action.payload.user
    // });
  },
});

export default columnSlice.reducer;
export const { storeOneColumn, storeColumnsLength } = columnSlice.actions;

export const columnData = (state) => state.column;
