import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
  id: '',
  name: "",
  created: null,
  updated: null,
  users: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getActiveBoardId: (state, actions) => {
      state.id = actions.payload;
    },
  },
});

export default boardSlice.reducer;
export const { getActiveBoardId } = boardSlice.actions;
export const boardData = (state) => state.board;