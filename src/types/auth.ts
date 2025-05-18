// Типы для входящих данных логина
export interface LoginCredentials {
  username: string;
  password: string;
}

// Типы для ответа от сервера после логина
export interface LoginResponse {
  access: string;
  refresh: string;
}

// Типы для токенов
export interface TokenPayload {
  token: string;
}

// Состояние авторизации в Redux
export interface AuthState {
  user: {
    name: string | null;
    email: string | null;
  };
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
}