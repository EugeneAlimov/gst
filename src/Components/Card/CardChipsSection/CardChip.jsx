// console.log('cardId ', cardId);
// console.log('newDragCartItemPosition ',newDragCartItemPosition);
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

export default function CardChip({ chipText, color, chipStyle }) {

  const boxStyle = { ...chipStyle.boxStyle, backgroundColor: color.normal };

  return (
    <Tooltip
      title={
        <Typography
          sx={{ ...chipStyle.typographyStyle, color: "#fff", width: "300px" }}
          paragraph={true}
        >
          Цвет: {color.colorName}
          <br />
          {chipText}
        </Typography>
      }
      followCursor
      placement="bottom"
    >
      <Box
        sx={{
          ...boxStyle,
          "&:hover": {
            backgroundColor: color.hover,
            transform: "scale(1.005)",
          },
        }}
      >
        <Typography noWrap sx={{ ...chipStyle.typographyStyle }} variant="body1">
          {chipText}
        </Typography>
      </Box>
    </Tooltip>
  );
}
