import React from "react";
import { format } from "date-fns";

// MUI components
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import "./Period.css";

export default function Period({
  startDayValue,
  completitionDayValue,
  completitionTimeValue,
  getStartDayHandler,
  getCompletitionDayHandler,
  getCompletitionTimeHandler,
  getstartDayCheckedHandler,
  getcompletitionDayCheckedHandler,
  startDayChecked,
  completitionDayChecked,
  defaultValue,
}) {
  // Безопасная обработка дат
  const formatSafeDate = (date, formatString = "dd.MM.yyyy") => {
    if (!date) return "";
    try {
      return format(new Date(date), formatString);
    } catch {
      return "";
    }
  };

  // Обработчики изменения чекбоксов
  const handleStartDayCheckChange = (event) => {
    const isChecked = event.target.checked;

    if (getstartDayCheckedHandler) {
      getstartDayCheckedHandler(isChecked);
    }
  };

  const handleCompletitionDayCheckChange = (event) => {
    const isChecked = event.target.checked;

    if (getcompletitionDayCheckedHandler) {
      getcompletitionDayCheckedHandler(isChecked);
    }
  };

  // Обработчики изменения дат
  const handleStartDayChange = (newValue) => {
    if (newValue && getStartDayHandler) {
      getStartDayHandler(newValue);
    }
  };

  const handleCompletitionDayChange = (newValue) => {
    if (newValue && getCompletitionDayHandler) {
      getCompletitionDayHandler(newValue);
    }
  };

  const handleCompletitionTimeChange = (newValue) => {
    if (newValue && getCompletitionTimeHandler) {
      getCompletitionTimeHandler(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "#fafafa",
          borderRadius: "8px",
        }}
      >
        {/* Секция даты начала */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: startDayChecked ? "2px solid #1976d2" : "1px solid #e0e0e0",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={startDayChecked || false}
                onChange={handleStartDayCheckChange}
                color="primary"
                sx={{ padding: "4px" }}
              />
            }
            label={
              <Box sx={{ fontSize: "16px", fontWeight: "500", color: "#1976d2" }}>Дата начала</Box>
            }
            sx={{ marginBottom: startDayChecked ? "10px" : "0" }}
          />

          {startDayChecked && (
            <Box sx={{ marginLeft: "32px" }}>
              <DatePicker
                value={startDayValue || defaultValue}
                onChange={handleStartDayChange}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    id: "task-start-day",
                    size: "small",
                    fullWidth: true,
                    helperText: "Выберите дату начала задачи",
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Секция даты завершения */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: completitionDayChecked ? "2px solid #1976d2" : "1px solid #e0e0e0",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={completitionDayChecked || false}
                onChange={handleCompletitionDayCheckChange}
                color="primary"
                sx={{ padding: "4px" }}
              />
            }
            label={
              <Box sx={{ fontSize: "16px", fontWeight: "500", color: "#1976d2" }}>
                Дата завершения
              </Box>
            }
            sx={{ marginBottom: completitionDayChecked ? "10px" : "0" }}
          />

          {completitionDayChecked && (
            <Box sx={{ marginLeft: "32px", display: "flex", flexDirection: "column", gap: 2 }}>
              <DatePicker
                value={completitionDayValue || defaultValue}
                onChange={handleCompletitionDayChange}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    id: "task-completition-day",
                    size: "small",
                    fullWidth: true,
                    helperText: "Выберите дату завершения",
                  },
                }}
              />

              <TimePicker
                value={completitionTimeValue || defaultValue}
                onChange={handleCompletitionTimeChange}
                format="HH:mm"
                slotProps={{
                  textField: {
                    id: "task-completition-time",
                    size: "small",
                    fullWidth: true,
                    helperText: "Установите время завершения",
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Информация о выбранном периоде */}
        {(startDayChecked || completitionDayChecked) && (
          <Box
            sx={{
              padding: "12px",
              backgroundColor: "#e3f2fd",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#1565c0",
              border: "1px solid #bbdefb",
            }}
          >
            <Box sx={{ fontWeight: "500", marginBottom: "4px" }}>📅 Выбранный период:</Box>

            {startDayChecked && completitionDayChecked && (
              <Box>
                От: {formatSafeDate(startDayValue, "dd.MM.yyyy")} <br />
                До: {formatSafeDate(completitionDayValue, "dd.MM.yyyy")} в{" "}
                {formatSafeDate(completitionTimeValue, "HH:mm")}
              </Box>
            )}

            {startDayChecked && !completitionDayChecked && (
              <Box>Начало: {formatSafeDate(startDayValue, "dd.MM.yyyy")}</Box>
            )}

            {!startDayChecked && completitionDayChecked && (
              <Box>
                Завершение: {formatSafeDate(completitionDayValue, "dd.MM.yyyy")} в{" "}
                {formatSafeDate(completitionTimeValue, "HH:mm")}
              </Box>
            )}
          </Box>
        )}

        {/* Отладочная информация - только в development */}
        {process.env.NODE_ENV === "development" && false && (
          <Box
            sx={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#fff3e0",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#e65100",
              fontFamily: "monospace",
            }}
          >
            🔧 Debug: startChecked={String(startDayChecked)}, completitionChecked=
            {String(completitionDayChecked)}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}
