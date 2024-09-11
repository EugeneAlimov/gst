import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  targetChipId: null,
  targetChipText: "",
  targetChipColor: {},
  isEdit: null,
  popUpType: 0,
};

const chipSlice = createSlice({
  name: "chip",
  initialState,
  reducers: {
    targetChipData: (state, actions) => {
      state.targetChipId = actions.payload.targetChipId;
      state.targetChipText = actions.payload.targetChipText;
      state.targetChipColor = actions.payload.targetChipColor;
      state.isEdit = actions.payload.isEdit;
    },
    popUpToOpen: (state, actions) => {
      state.popUpType = actions.payload;
    },
  },
});

export default chipSlice.reducer;
export const { targetChipData, popUpToOpen } = chipSlice.actions;
export const chipData = (state) => state.chip;
  