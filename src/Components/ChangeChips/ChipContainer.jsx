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
import { boxStylehipContainer, chipStyleChipContainer } from "../../constants/chipContainerStyle";
import { popUpToOpen, targetChipData } from "../../Redux/chip/chip-slice";

export default function ChipContainer({
  checked,
  chipRelateToCardUpdate,
  color_number,
  text: chipText,
  name: chipName,
  color,
  labelId,
  id: chipId,
}) {
  const dispatch = useDispatch();

  // Используем цвет из объекта или fallback на старую логику
  const chipColor = color || (color_number !== undefined ? chipColor[color_number] : null);
  const displayText = chipName || chipText;

  const editChipHangler = () => {
    dispatch(popUpToOpen(3));

    // Формируем полные данные о цвете для редактирования
    const colorData = color
      ? {
          id: color.id,
          colorNumber: color.color_number || color.colorNumber,
          normal: color.normal_color || color.normal,
          hover: color.hover_color || color.hover,
          colorName: color.color_name || color.colorName,
          normal_color: color.normal_color || color.normal,
          hover_color: color.hover_color || color.hover,
          color_name: color.color_name || color.colorName,
        }
      : null;

    const targrtChipParameters = {
      targetChipId: chipId,
      targetChipText: displayText,
      targetChipColor: colorData,
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
          chip={{
            name: displayText,
            color: chipColor,
          }}
          chipStyle={chipStyleChipContainer}
        />
      </ListItemButton>
      <IconButton aria-label="settings" onClick={editChipHangler}>
        <EditOutlinedIcon sx={{ fontSize: "18px" }} />
      </IconButton>
    </Box>
  );
}
