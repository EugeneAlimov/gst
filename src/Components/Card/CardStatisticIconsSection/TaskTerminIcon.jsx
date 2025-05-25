import React, { useState } from "react";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { format, isValid } from "date-fns";

// Константы цветов для статусов задач (независимо от цветовой палитры меток)
const STATUS_COLORS = {
  0: "#baf3db", // нормальный статус - светло-зеленый
  1: "#f5cd47", // в работе - желтый
  3: "#ffd5d2", // просрочено - светло-красный
};

export default function TaskTerminIcon({
  boxStyle,
  iconStyle,
  typographyStyle,
  date_time_finish,
  date_time_start,
  status = 0,
}) {
  const [inBlock, setInBlock] = useState(false);

  // Функция для безопасного форматирования даты
  const formatSafeDate = (dateValue, formatString) => {
    if (!dateValue || dateValue === null) {
      return "Не указано";
    }

    try {
      const date = new Date(dateValue);
      if (!isValid(date)) {
        return "Неверная дата";
      }
      return format(date, formatString);
    } catch (error) {
      return "Ошибка даты";
    }
  };

  const dateTimeStartFormated = formatSafeDate(date_time_start, "k:mm d MMM");
  const dateTimeFinishFormated = formatSafeDate(date_time_finish, "k:mm d MMM");

  // Если нет валидных дат - не рендерим компонент
  if (!date_time_start && !date_time_finish) {
    return null;
  }

  // Функция для получения цвета по статусу
  const getStatusColor = (statusValue) => {
    return STATUS_COLORS[statusValue] || STATUS_COLORS[0];
  };

  const extBoxStyle = {
    ...boxStyle,
    paddingRight: "6px",
    borderRadius: "6px",
    backgroundColor: getStatusColor(status),
    "&:hover": {
      backgroundColor: "#e7c8c6",
    },
  };
  
  const extIconStyle = { ...iconStyle, color: "#953827" };
  const extTypographyStyle = { ...typographyStyle, color: "#953827" };

  return (
    <Tooltip title="Задание просрочено." placement="bottom">
      <Box
        sx={{
          ...extBoxStyle,
        }}
        onMouseOver={() => setInBlock(true)}
        onMouseOut={() => setInBlock(false)}
      >
        <Typography variant="caption" sx={{ lineHeight: "1.3" }}>
          <Icon sx={{ marginRight: "3px" }}>
            {inBlock ? (
              <CancelOutlinedIcon sx={extIconStyle} />
            ) : (
              <AccessTimeOutlinedIcon sx={extIconStyle} />
            )}
          </Icon>
        </Typography>
        <Typography variant="caption" color="#172b4d" sx={extTypographyStyle}>
          {dateTimeStartFormated} - {dateTimeFinishFormated}
        </Typography>
      </Box>
    </Tooltip>
  );
}