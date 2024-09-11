import React from "react";
import Box from "@mui/material/Box";

import CardChip from "./CardChip";

import { chipColor } from "../../../constants/colorsConst";
import {
  boxStyleardChipContainer,
  chipStyleCardChipContainer,
} from "../../../constants/chipContainerStyle";

export default function CardChipContainer({ chips }) {

  return (
    <Box sx={boxStyleardChipContainer}>
      {
      chips &&
      chips.map((value) => {
        const {color_number, text, id} = value

        const labelId = `checkbox-list-label-${value}`;

        return (
          <CardChip
            key={id}
            color={chipColor[color_number]}
            labelId={labelId}
            chipText={text}
            chipStyle={chipStyleCardChipContainer}
          />
        );
      })}
    </Box>
  );
}
