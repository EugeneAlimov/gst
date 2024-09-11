import React from "react";

//import MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

//import application components
import CardChip from "../CardChipsSection/CardChip";

//import MUI icons
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

//import styles
import * as Style from "./styleConst";
import { chipColor } from "../../../constants/colorsConst";
import { chipStyleCreateNewChip } from "../../../constants/chipContainerStyle";

export default function Cheeps() {
  return (
    <Box sx={Style.cheepsBox}>
      <Typography sx={Style.text}>Метки</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((index) => {
          const labelId = `checkbox-list-label-${index}`;
          return (
            <CardChip
              key={index}
              color={chipColor[index]}
              labelId={labelId}
              chipStyle={chipStyleCreateNewChip}
            />
          );
        })}
        <IconButton size="small" sx={Style.addIconButton}>
          <AddOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
