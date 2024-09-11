import { createSlice } from "@reduxjs/toolkit";
// import authOperations from "./auth-operations";
import { register, logIn, refreshUser, logOut } from "./auth-operations";

const initialState = {
  user: { name: null, email: null },
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user.name = action.meta.arg.username;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isLoggedIn = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user.name = action.meta.arg.username;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isLoggedIn = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
        // state.refreshToken = action.payload.refresh;
        state.isRefreshing = true;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user.name = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
      });
  },
});

export default authSlice.reducer;
// export const {} = authSlice.actions;

export const userData = (state) => state.auth;
