import React from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

export default function CardChip({ setNewChipColorHandle, color, chipStyle }) {
  return (
    <Tooltip
      title={
        <Typography
          sx={{
            ...chipStyle.typographyStyle,
            color: "#fff",
            width: "fit-content",
          }}
          paragraph={true}
        >
          Цвет: {color.colorName}
        </Typography>
      }
      followCursor
      placement="bottom"
    >
      <IconButton
        size="small"
        sx={{
          width: "48px",
          height: "32px",
          borderRadius: "4px",
          transition: "all .05s ease-in-out",
          backgroundColor: color.normal,
          "&:hover": {
            backgroundColor: color.hover,
            transform: "scale(1.005)",
          },
        }}
        onClick={() => setNewChipColorHandle(color) }
      ></IconButton>
    </Tooltip>
  );
}
