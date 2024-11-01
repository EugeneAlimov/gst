import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// import MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";

import { useGetUsersQuery } from "../../Redux/user/user-operations";
import { logOut } from "../../Redux/auth/auth-operations";
import { setActiveBoardToDefault } from "../../Redux/board/board-slice";

export default function UserNav({ userName }) {
  const dispatch = useDispatch();

  const { data: users } = useGetUsersQuery();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!users) return;
    const w = users.find((element) => element.username === userName);

    setUser(w);
  }, [userName, users]);

  const { username: name, photo } = user;
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClose = () => {
    setAnchorElUser(null);
    dispatch(logOut());
    dispatch(setActiveBoardToDefault())
  };
  
  const avatarSimbol = userName.substring(0, 1).toUpperCase()

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title={name}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar src={photo}>{avatarSimbol}</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key={1} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{"Настройки профиля"}</Typography>
          </MenuItem>
          <MenuItem key={2} onClick={handleClose}>
            <Typography textAlign="center">{"Выйти"}</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
