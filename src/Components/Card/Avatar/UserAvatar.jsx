import React from "react";
import Avatar from "@mui/material/Avatar";
import red from "@mui/material/colors/red";

const avatarPictStyle = {
  width: "28px",
  height: "28px",
  marginRight: "0px",
  bgcolor: red[500],
  transition: "all .2s ease-in-out",
  "&:hover": {
    transform: "scale(1.5)",
  },
};

export default function UserAvatar({ userName }) {
  return (
    <Avatar sx={avatarPictStyle} aria-label={`${userName}-avatar-label`}>
      {userName}
    </Avatar>
  );
}
