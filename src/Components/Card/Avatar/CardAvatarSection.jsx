import React from "react";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserAvatar from "./UserAvatar";

const userNameArr = ["R", "B", "C", "T", "K", "S", "O", "W", "M", "X", "P"];
export default function CardAvatarSection() {
  return (
    <AvatarGroup max={9}>
      {userNameArr.map((userName) => {
        return <UserAvatar key={userName} userName={userName} />;
      })}
    </AvatarGroup>
  );
}
