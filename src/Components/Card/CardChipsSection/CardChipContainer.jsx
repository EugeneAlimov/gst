import React from "react";
import Box from "@mui/material/Box";

import CardChip from "./CardChip";

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
        const {color_number, text, id, color, name} = value

        const labelId = `checkbox-list-label-${value}`;

        return (
          <CardChip
            key={id}
            color={color} // Теперь используем объект color из БД вместо chipColor[color_number]
            labelId={labelId}
            chipText={text || name} // Поддерживаем и text и name
            chipStyle={chipStyleCardChipContainer}
          />
        );
      })}
    </Box>
  );
}