import { createSlice } from "@reduxjs/toolkit";

const initialState = {
};

const dateTimeSlice = createSlice({
  name: "dateTime",
  initialState,
  reducers: {
    // targetChipData: (state, actions) => {
    //   state.targetChipId = actions.payload.targetChipId;
    //   state.targetChipText = actions.payload.targetChipText;
    //   state.targetChipColor = actions.payload.targetChipColor;
    //   state.isEdit = actions.payload.isEdit;
    // },
    // popUpToOpen: (state, actions) => {
    //   state.popUpType = actions.payload;
    // },
  },
});

export default dateTimeSlice.reducer;
export const { targetChipData, popUpToOpen } = dateTimeSlice.actions;
export const dateTimeData = (state) => state.chip;
  