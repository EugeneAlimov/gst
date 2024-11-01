import React from "react";
import { useDispatch } from "react-redux";

// import components
import CardChip from "../Card/CardChipsSection/CardChip";

// import MUI components
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";

//import constants
import { chipColor } from "../../constants/colorsConst";
import { boxStylehipContainer, chipStyleChipContainer } from "../../constants/chipContainerStyle";
import { popUpToOpen, targetChipData } from "../../Redux/chip/chip-slice";

export default function ChipContainer({
  checked,
  chipRelateToCardUpdate,
  color_number,
  text: chipText,
  labelId,
  id: chipId,
  cardId,
}) {
  const dispatch = useDispatch();
  const color = chipColor[color_number];

  const editChipHangler = () => {

    dispatch(popUpToOpen(3));

    const targrtChipParameters = {
      targetChipId: chipId,
      targetChipText: chipText,
      targetChipColor: color,
      isEdit: true,
    };
    dispatch(targetChipData(targrtChipParameters));
  };

  return (
    <Box sx={boxStylehipContainer}>
      <ListItemButton
        onClick={() => chipRelateToCardUpdate(chipId)}
        sx={{
          padding: "0px",
          height: "32px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0)",
          },
        }}
        role={undefined}
        dense
      >
        <Checkbox
          edge="start"
          tabIndex={-1}
          disableRipple
          inputProps={{ "aria-labelledby": labelId }}
          checked={checked}
        />
        <CardChip
          chipId={chipId}
          color={color}
          chipText={chipText}
          chipStyle={chipStyleChipContainer}
        />
      </ListItemButton>
      <IconButton aria-label="settings" onClick={editChipHangler}>
        <EditOutlinedIcon sx={{ fontSize: "18px" }} />
      </IconButton>
    </Box>
  );
}
