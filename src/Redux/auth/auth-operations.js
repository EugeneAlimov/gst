import axios from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from "../axiosDefaults";
// axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1";
axios.defaults.baseURL = baseURL; //"http://ec2-16-170-220-252.eu-north-1.compute.amazonaws.com/api/v1";
axios.defaults.timeout = 1500;

const accessToken = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = "";
  },
};

const refreshToken = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = "";
  },
};

// регистрация пользователя
export const register = createAsyncThunk("auth/register", async (credentials) => {
  try {
    const { data } = await axios.post("users/signup/", credentials);

    return data;
  } catch (error) {
    //добавить обработку ошибки
  }
});

//логин пользователя
export const logIn = createAsyncThunk("auth/login", async (credentials) => {
  console.log("credentials ", credentials);
  try {
    const { data } = await axios.post("/token/", credentials);

    accessToken.set(data.access);
    refreshToken.set(data.refresh);

    return data;
  } catch (error) {
    //добавить обработку ошибки
  }
});

//логаут пользователя
export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const refreshToken = state.auth.refreshToken;
  try {
    await axios.post("/token/blacklist/", {
      refresh: refreshToken,
    });

    accessToken.unset();
    accessToken.unset();

    return;
  } catch (error) {
    //добавить обработку ошибки
  }
});

export const refreshUser = createAsyncThunk("auth/refreshUser", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.accessToken;
  const refreshToken = state.auth.refreshToken;

  if (persistedToken === null) {
    return thunkAPI.rejectWithValue("No valid token");
  }

  try {
    const { data } = await axios.post("/token/refresh/", {
      refresh: refreshToken,
    });
    return data;
  } catch (error) {
    console.log("error ", error);
    //добавить обработку ошибки
  }
});

// const authOperations = { register, logIn };

// export default authOperations;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "token/",
        method: "POST",
        body: credentials,
      }),
    }),
    logOut: builder.mutation({
      query: (refresh) => ({
        url: "token/blacklist/",
        method: "POST",
        body: { refresh },
      }),
    }),
    refreshToken: builder.mutation({
      query: (refresh) => ({
        url: "token/refresh/",
        method: "POST",
        body: { refresh },
      }),
    }),
    verifyToken: builder.mutation({
      query: (token) => ({
        url: "token/verify/",
        method: "POST",
        body: { token },
      }),
    }),
  }),
});

export const { useLoginMutation, useLogOutMutation, useRefreshTokenMutation, useVerifyTokenMutation } = authApi;
