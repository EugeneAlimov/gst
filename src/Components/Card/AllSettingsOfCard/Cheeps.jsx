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

export default function Cheeps({ chipsArr, chipText }) {
  return (
    <Box sx={Style.cheepsBox}>
      <Typography sx={Style.text}>Метки</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {chipsArr.map((chip) => {
          const labelId = `checkbox-list-label-${chip.text}`;
          return (
            <CardChip
              key={chip.id}
              color={chipColor[chip.color_number]}
              labelId={labelId}
              chipStyle={chipStyleCreateNewChip}
              chipText={chip.text}
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
