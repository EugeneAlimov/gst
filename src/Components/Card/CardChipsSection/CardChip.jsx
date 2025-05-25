import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

function CardChip({ chipText, chip, color, chipStyle }) {
  // Поддерживаем разные варианты передачи данных
  let chipData = {};

  if (chip) {
    // Новый формат с объектом chip
    chipData = {
      text: chip.name || chip.text || chipText || "", // Разрешаем пустое имя
      backgroundColor:
        chip.color?.normal || chip.color?.backgroundColor || chip.color?.normal_color || "#f0f0f0",
      hoverColor:
        chip.color?.hover || chip.color?.hoverColor || chip.color?.hover_color || "#e0e0e0",
      colorName: chip.color?.colorName || chip.color?.color_name || "Неизвестный цвет",
    };
  } else if (color) {
    // Старый формат с отдельными параметрами
    chipData = {
      text: chipText || "", // Разрешаем пустое имя
      backgroundColor: color.normal || color.backgroundColor || "#f0f0f0",
      hoverColor: color.hover || color.hoverColor || "#e0e0e0",
      colorName: color.colorName || color.color_name || "Неизвестный цвет",
    };
  } else {
    // Резервный вариант
    chipData = {
      text: chipText || "", // Разрешаем пустое имя
      backgroundColor: "#f0f0f0",
      hoverColor: "#e0e0e0",
      colorName: "Цвет по умолчанию",
    };
  }

  const boxStyle = {
    ...chipStyle?.boxStyle,
    backgroundColor: chipData.backgroundColor,
    // Минимальная ширина для чипов без текста
    minWidth: chipData.text ? "auto" : "20px",
  };

  return (
    <Tooltip
      title={
        <Typography
          sx={{
            ...chipStyle?.typographyStyle,
            color: "#fff",
            width: "300px",
          }}
          paragraph={true}
        >
          Цвет: {chipData.colorName}
          {chipData.text && (
            <>
              <br />
              {chipData.text}
            </>
          )}
        </Typography>
      }
      followCursor
      placement="bottom"
    >
      <Box
        sx={{
          ...boxStyle,
          "&:hover": {
            backgroundColor: chipData.hoverColor,
            transform: "scale(1.005)",
          },
        }}
      >
        {chipData.text && ( // Показываем текст только если он есть
          <Typography noWrap sx={{ ...chipStyle?.typographyStyle }} variant="body1">
            {chipData.text}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

export default memo(CardChip, (prevProps, nextProps) => {
  return (
    prevProps.chipText === nextProps.chipText &&
    JSON.stringify(prevProps.color) === JSON.stringify(nextProps.color) &&
    JSON.stringify(prevProps.chip) === JSON.stringify(nextProps.chip)
  );
});
