import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  targetChipId: null,
  targetChipText: "",
  targetChipColor: {},
  isEdit: null,
  popUpType: 0,
  sourcePopUp: 0, // Откуда пришли
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
      // Сохраняем откуда пришли
      state.sourcePopUp = state.popUpType;
      state.popUpType = actions.payload;
    },
    // Новый экшен для умного возврата
    popUpSmartClose: (state) => {
      // Возвращаемся туда, откуда пришли
      state.popUpType = state.sourcePopUp;
      state.sourcePopUp = 0;
    },
  },
});

export default chipSlice.reducer;
export const { targetChipData, popUpToOpen, popUpSmartClose } = chipSlice.actions;
export const chipData = (state) => state.chip;
