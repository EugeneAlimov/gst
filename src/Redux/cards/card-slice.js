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

export default cardSlice.reducer;
export const { storeOneCard } = cardSlice.actions;

export const cardData = (state) => state.card;
