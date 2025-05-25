import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columns: [],
  id: null,
  name: "",
  created: null,
  updated: null,
  users: [],
};

const checklistSlice = createSlice({
  name: "checklist",
  initialState,
  reducers: {},
  extraReducers(builder) {},
});

export default checklistSlice.reducer;

export const columnData = (state) => state.checklist;
