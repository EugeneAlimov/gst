import React from "react";

//import MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import IconButton from "@mui/material/IconButton";

//import application components
import UserAvatar from "../Avatar/UserAvatar";

//import constants
import { userNameArr } from "./constatns";

//import MUI icons
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

//import styles
import * as Style from "./styleConst";

export default function Users() {
  return (
    <Box sx={{ marginBottom: "15px" }}>
      <Typography sx={{ cursor: "default", fontSize: "20px", color: "#172b4d", width: "100%" }}>
        Участники
      </Typography>
      <Box sx={Style.avatarBox}>
        <AvatarGroup max={15}>
          {userNameArr.map((userName) => {
            return <UserAvatar key={userName} userName={userName} />;
          })}
        </AvatarGroup>
        <IconButton>
          <GroupAddOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
