import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/auth";
import { register, logIn, refreshUser, logOut } from "./auth-operations";

const initialState: AuthState = {
  user: { name: null, email: null },
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isRefreshing: false,
};

interface UserCredentials {
  username: string;
  password: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<UserCredentials>) => {
      state.user.name = action.payload.username;
      state.isLoggedIn = true;
    },
    clearUserState: (state) => {
      state.user.name = null;
      state.isLoggedIn = false;
    },
  },
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
export const { setUserState, clearUserState } = authSlice.actions;
export const userData = (state: { auth: AuthState }) => state.auth;