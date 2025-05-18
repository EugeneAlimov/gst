import { useCallback } from "react";
import { LoginCredentials, LoginResponse } from "../types/auth";
import {
  useLoginMutation,
  useVerifyTokenMutation,
  useLogOutMutation,
  useRefreshTokenMutation,
} from "../Redux/auth/auth-operations";

const useAuth = () => {
  const [login] = useLoginMutation();
  const [verifyToken] = useVerifyTokenMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const [logOut] = useLogOutMutation();

  const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await login({ username, password }).unwrap();
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      return response;
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  };

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        await verifyToken(refresh).unwrap();
        const response = await refreshToken(refresh).unwrap();
        localStorage.setItem("access_token", response.access);
        return response.access;
      } catch (error) {
        console.error("Ошибка при проверке или обновлении токена:", error);
        logoutUser();
        throw error;
      }
    } else {
      logoutUser();
      return null;
    }
  }, [refreshToken, verifyToken]);

  const logoutUser = async (): Promise<void> => {
    const refresh = localStorage.getItem("refresh_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    try {
      if (refresh) {
        await logOut(refresh).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { loginUser, refreshAccessToken, logoutUser };
};

export default useAuth;