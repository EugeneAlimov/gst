import { useCallback } from "react";

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

  const loginUser = async (username, password) => {
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

  const refreshAccessToken = useCallback(async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        // Проверяем refresh_token на валидность
        await verifyToken(refresh).unwrap();

        // Если токен действителен, обновляем access_token
        const response = await refreshToken(refresh).unwrap();
        localStorage.setItem("access_token", response.access);
        return response.access;
      } catch (error) {
        console.error("Ошибка при проверке или обновлении токена:", error);
        logoutUser(); // Если токен недействителен, выходим
        throw error;
      }
    } else {
      logoutUser();
    }
  }, [refreshToken, verifyToken]);

  const logoutUser = async () => {
    const refresh = localStorage.getItem("refresh_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    try {
      const response = await logOut(refresh).unwrap();
      return response;
    } catch (error) {
      console.log(error);
    }
    // Тут можно сделать перенаправление или очистить состояние
  };

  return { loginUser, refreshAccessToken, logoutUser };
};

export default useAuth;
