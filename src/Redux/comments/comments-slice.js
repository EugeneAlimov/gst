import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columns: [],
  id: null,
  name: "",
  created: null,
  updated: null,
  users: [],
};

const commentsSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {

  },
});

export default commentsSlice.reducer;

export const commentsData = (state) => state.comment;
