import React, { useState } from "react";
import { useDispatch } from "react-redux";

// import MUI components
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { ThunkDispatch } from '@reduxjs/toolkit';

import useAuth from "../libs/useAuth";
import { setUserState } from "../Redux/auth/auth-slice";
import { wrapperLogout } from "../libs/wrapperLogOut";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loginUser, refreshAccessToken, logoutUser } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Тип для dispatch должен быть более конкретным в реальном приложении
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      setError(null);

      dispatch(setUserState({ username, password }));
      // перенаправление на защищенную страницу
    } catch (err) {
      setError("Ошибка входа. Проверьте логин и пароль.");
    }
  };

  const handleProtectedAction = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem("access_token");

      // Проверяем, если токен истек, то обновляем его
      if (accessToken) {
        await refreshAccessToken();
      }
      // Здесь вы можете сделать защищенный запрос
    } catch (error) {
      console.error("Не удалось выполнить защищенное действие:", error);
      setError("Сессия истекла, пожалуйста, войдите снова.");
      wrapperLogout(dispatch, logoutUser);
    }
  };

  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  return (
    <Paper
      sx={{
        margin: "auto",
        display: "flex",
        flexWrap: "wrap",
        padding: "16px",
        flexDirection: "row",
        height: "150px",
        width: "509px",
        backgroundColor: "#fff",
        boxShadow: "10",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}
        >
          <FormControl sx={{ m: 1, width: "24ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-login">Login</InputLabel>
            <OutlinedInput
              id="outlined-adornment-login"
              label="Login"
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(event.target.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "24ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value);
              }}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button
            sx={{ margin: "8px", width: "461px" }}
            fullWidth
            variant="contained"
            type="submit"
          >
            Войти
          </Button>
        </Box>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => wrapperLogout(dispatch, logoutUser)}>Выйти</button>
      <button onClick={handleProtectedAction}>Выполнить защищенное действие</button>
    </Paper>
  );
};

export default LoginForm;