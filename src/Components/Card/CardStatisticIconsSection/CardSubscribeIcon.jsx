import React from "react";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function CardSubscribeIcon({ boxStyle, iconStyle }) {
  return (
    <Tooltip title="Вы подписаны на эту катрочку." placement="bottom">
      <Box sx={boxStyle}>
        <Typography sx={{ lineHeight: "1.4" }}>
          <Icon>
            <VisibilityOutlinedIcon sx={iconStyle} />
          </Icon>
        </Typography>
      </Box>
    </Tooltip>
  );
}
