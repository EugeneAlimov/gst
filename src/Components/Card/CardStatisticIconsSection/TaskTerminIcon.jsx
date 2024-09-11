import React, { useState } from "react";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
// import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
// import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { format } from "date-fns";
import { chipColor } from "../../../constants/colorsConst";

export default function TaskTerminIcon({
  boxStyle,
  iconStyle,
  typographyStyle,
  date_time_finish,
  date_time_start,
  status,
}) {
  const [inBlock, setInBlock] = useState(false);
  const dateTimeStartFormated = format(new Date(`${date_time_start}`), "k:mm d MMM");
  const dateTimeFinishFormated = format(new Date(`${date_time_finish}`), "k:mm d MMM");

  const color = (value) => {
    let tempColor = 0;
    switch (value) {
      case 1:
        tempColor = 6;
        break;
      case 3:
        tempColor = 9;
        break;
      default:
        tempColor = 0;
        break;
    }
    return tempColor;
  };

  const extBoxStyle = {
    ...boxStyle,
    paddingRight: "6px",
    borderRadius: "6px",
    backgroundColor: chipColor[color(status)],//"#ffd5d2",
    "&:hover": {
      backgroundColor: "#e7c8c6",
    },
  };
  const extIconStyle = { ...iconStyle, color: "#953827" };
  const extTypographyStyle = { ...typographyStyle, color: "#953827" };

  return (
    <Tooltip title="Задание просрочено." placement="bottom">
      <Box
        sx={{
          ...extBoxStyle,
        }}
        onMouseOver={() => setInBlock(true)}
        onMouseOut={() => setInBlock(false)}
      >
        <Typography variant="caption" sx={{ lineHeight: "1.3" }}>
          <Icon sx={{ marginRight: "3px" }}>
            {inBlock ? (
              <CancelOutlinedIcon sx={extIconStyle} />
            ) : (
              <AccessTimeOutlinedIcon sx={extIconStyle} />
            )}
          </Icon>
        </Typography>
        <Typography variant="caption" color="#172b4d" sx={extTypographyStyle}>
          {dateTimeStartFormated} - {dateTimeFinishFormated}
        </Typography>
      </Box>
    </Tooltip>
  );
}
