import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
  id: 0,
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
    setActiveBoardToDefault: (state) => {
      state.boards = [];
      state.id = 0
      state.name = ""
      state.created = null
      state.updated = null
      state.users = []
    },
  },
});

export default boardSlice.reducer;
export const { getActiveBoardId, setActiveBoardToDefault } = boardSlice.actions;
export const boardData = (state) => state.board;
