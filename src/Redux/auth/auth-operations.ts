// src/Redux/auth/auth-operations.ts
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from "../axiosDefaults";
import { LoginCredentials, LoginResponse } from "../../types/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 1500;

interface AccessToken {
  set(token: string): void;
  unset(): void;
}

const accessToken: AccessToken = {
  set(token: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = "";
  },
};

const refreshToken: AccessToken = {
  set(token: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = "";
  },
};

// Тип для данных регистрации
interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// Регистрация пользователя
export const register = createAsyncThunk<LoginResponse, RegisterCredentials>(
  "auth/register",
  async (credentials) => {
    try {
      const { data } = await axios.post("users/signup/", credentials);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Логин пользователя
export const logIn = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/login",
  async (credentials) => {
    try {
      const { data } = await axios.post("/token/", credentials);

      accessToken.set(data.access);
      refreshToken.set(data.refresh);

      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Интерфейс для состояния Redux для thunkAPI
interface RootState {
  auth: {
    refreshToken: string | null;
    accessToken: string | null;
  };
}

// Логаут пользователя
export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const refreshTokenValue = state.auth.refreshToken;
  
  try {
    if (refreshTokenValue) {
      await axios.post("/token/blacklist/", {
        refresh: refreshTokenValue,
      });
    }

    accessToken.unset();
    refreshToken.unset();

    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

// Обновление пользователя
export const refreshUser = createAsyncThunk("auth/refreshUser", async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const persistedToken = state.auth.accessToken;
  const refreshTokenValue = state.auth.refreshToken;

  if (persistedToken === null) {
    return thunkAPI.rejectWithValue("No valid token");
  }

  try {
    const { data } = await axios.post("/token/refresh/", {
      refresh: refreshTokenValue,
    });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

// Остальная часть кода с RTK Query остается практически без изменений, 
// но также может быть типизирована по аналогии

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
