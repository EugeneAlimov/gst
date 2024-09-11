import React from "react";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";

export default function CardDescriptionIcon({ boxStyle, iconStyle, typographyStyle }) {
  return (
    <Box sx={boxStyle}>
      <Tooltip
        title="Эта карточка с описанием."
        placement="bottom"
      >
        <Typography sx={{ lineHeight: "1.4" }}>
          <Icon>
            <SubjectOutlinedIcon sx={iconStyle} />
          </Icon>
        </Typography>
      </Tooltip>
    </Box>
  );
}
