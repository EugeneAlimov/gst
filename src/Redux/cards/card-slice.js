import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // columns: [],
  // id: null,
  // name: "",
  // created: null,
  // updated: null,
  // users: [],
  card: {},
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    storeOneCard: (state, actions) => {
      state.card = actions.payload;
    },
  },
  extraReducers(builder) {},
});

export default cardSlice.reducer;
export const { storeOneCard } = cardSlice.actions;

export const cardData = (state) => state.card;
