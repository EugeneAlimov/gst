import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

const typographyStyle = {
  verticalAlign: "top",
  overflow: "visible",
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "1.4",
  color: "#172b4d",
};

const reminderOptions = [
  { value: -10, label: "Без напоминания" },
  { value: 0, label: "Когда настанет дата завершения" },
  { value: 5, label: "За 5 минут" },
  { value: 10, label: "За 10 минут" },
  { value: 15, label: "За 15 минут" },
  { value: 30, label: "За 30 минут" },
  { value: 60, label: "За 1 час" },
  { value: 120, label: "За 2 часа" },
  { value: 1440, label: "За 1 день" },
  { value: 2880, label: "За 2 дня" },
  { value: 10080, label: "За 1 неделю" },
];

export default function Reminder({ defaultValue = -10, remaindeBefore }) {
  const [remainder, setRemainder] = useState(defaultValue);

  // Синхронизация с внешним значением
  useEffect(() => {
    if (defaultValue !== remainder) {
      setRemainder(defaultValue);
    }
  }, [defaultValue]);

  // Обработчик изменения значения
  const handleChange = (event) => {
    const newValue = event.target.value;
    setRemainder(newValue);

    // Вызываем callback если он передан
    if (remaindeBefore && typeof remaindeBefore === "function") {
      remaindeBefore(newValue);
    }
  };

  // Получаем текст для выбранного значения
  const getSelectedLabel = () => {
    const option = reminderOptions.find((opt) => opt.value === remainder);
    return option ? option.label : "Неизвестное значение";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: "15px",
      }}
    >
      <FormControl fullWidth size="small">
        <InputLabel id="remainder-label">Установить напоминание</InputLabel>
        <Select
          labelId="remainder-label"
          id="remainder-select"
          value={remainder}
          label="Установить напоминание"
          onChange={handleChange}
          sx={{
            marginBottom: "10px",
            height: "38px",
            fontSize: "14px",
          }}
        >
          {reminderOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Информационный текст */}
      <Typography sx={typographyStyle}>
        {remainder === -10
          ? "Напоминания отключены для этой карточки."
          : "Участники и подписчики этой карточки получат напоминания."}
      </Typography>

      {/* Дополнительная информация о выбранном напоминании */}
      {remainder !== -10 && (
        <Box
          sx={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#e3f2fd",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#1565c0",
          }}
        >
          ℹ️ Выбрано: {getSelectedLabel()}
          {remainder > 0 && (
            <div style={{ marginTop: "4px" }}>
              Напоминание будет отправлено за {remainder}{" "}
              {remainder === 1
                ? "минуту"
                : remainder < 5
                ? "минуты"
                : remainder < 60
                ? "минут"
                : remainder === 60
                ? "час"
                : remainder < 120
                ? "часа"
                : remainder < 1440
                ? "часов"
                : remainder === 1440
                ? "день"
                : remainder < 2880
                ? "дня"
                : remainder < 10080
                ? "дней"
                : "неделю"}{" "}
              до срока завершения.
            </div>
          )}
        </Box>
      )}
    </Box>
  );
}
