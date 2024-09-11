import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkBoxItemsArr: [],
};

const sliceAllSettingsOfCard = createSlice({
  name: "allSettingsOfCard",
  initialState,
  reducers: {
  },
});

export default sliceAllSettingsOfCard.reducer;
export const { isChecked } = sliceAllSettingsOfCard.actions;
