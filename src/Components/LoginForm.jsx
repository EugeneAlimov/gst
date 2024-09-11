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

//import auth operations
import { logIn } from "../Redux/auth/auth-operations";

//import states from Redux

export default function InputAdornments() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginSubmit = (event) => {
    event.preventDefault();

    dispatch(logIn({ username, password }));
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
      <form onSubmit={loginSubmit}>
        <Box
          sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}
        >
          <FormControl sx={{ m: 1, width: "24ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-login">Login</InputLabel>
            <OutlinedInput
              id="outlined-adornment-login"
              label="Login"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "24ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              value={password}
              onChange={(event) => {
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
    </Paper>
  );
}
