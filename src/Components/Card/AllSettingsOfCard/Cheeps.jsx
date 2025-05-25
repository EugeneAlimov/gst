import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

//import MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

//import application components
import CardChip from "../CardChipsSection/CardChip";

//import MUI icons
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

//import Redux actions
import { popUpToOpen, chipData } from "../../../Redux/chip/chip-slice";

//import styles
import * as Style from "./styleConst";
import { chipStyleCreateNewChip } from "../../../constants/chipContainerStyle";

export default function Cheeps({ chipsArr, cardChips, cardId }) {
  const dispatch = useDispatch();
  const { popUpType } = useSelector(chipData);

  // Фильтруем только метки, привязанные к карточке
  const cardChipsData = useMemo(() => {
    if (!chipsArr || !cardChips) {
      return [];
    }

    // Находим только те чипы, которые привязаны к карточке
    const result = chipsArr.filter((chip) => cardChips.includes(chip.id));

    return result;
  }, [chipsArr, cardChips]);

  // Обработчик клика по кнопке добавления метки
  const handleAddChip = () => {
    // Открываем окно управления метками
    dispatch(popUpToOpen(1)); // 1 = ChangeChipsPallet
  };

  return (
    <Box sx={Style.cheepsBox}>
      <Typography sx={Style.text}>Метки</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {cardChipsData.map((chip) => {
          const labelId = `checkbox-list-label-${chip.text || chip.name}`;
          return (
            <CardChip
              key={chip.id}
              color={chip.color} // Убираем fallback на chipColor - теперь только данные из БД
              labelId={labelId}
              chipStyle={chipStyleCreateNewChip}
              chipText={chip.text || chip.name}
              chip={chip} // Передаем полный объект чипа
            />
          );
        })}
        <IconButton
          size="small"
          sx={Style.addIconButton}
          onClick={handleAddChip}
          aria-label="Добавить метку"
        >
          <AddOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
