import React from "react";
import { format, isAfter, isValid } from "date-fns";

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

  // Правильная валидация дат с учетом UTC
  const validateDates = () => {
    const errors = [];

    console.log("🔧 Period валидация для UTC:", {
      startDayChecked,
      completitionDayChecked,
      startDayValue,
      completitionDayValue,
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Валидация даты начала
    if (startDayChecked && startDayValue) {
      try {
        const startDate = new Date(startDayValue);
        if (!isValid(startDate)) {
          errors.push("Неверная дата начала");
        } else {
          const startDay = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );
          // Дата начала может быть сегодня или в будущем
          if (startDay < today) {
            errors.push("Дата начала не может быть в прошлом");
          }
        }
      } catch (error) {
        errors.push("Ошибка обработки даты начала");
      }
    }

    // Валидация даты завершения
    if (completitionDayChecked && completitionDayValue) {
      try {
        const endDate = new Date(completitionDayValue);
        if (!isValid(endDate)) {
          errors.push("Неверная дата завершения");
        } else {
          const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

          // Дата завершения может быть сегодня или в будущем
          if (endDay < today) {
            errors.push("Дата завершения не может быть в прошлом");
          }

          // Если дата завершения сегодня, проверяем время
          if (endDay.getTime() === today.getTime() && completitionTimeValue) {
            const timeSource = new Date(completitionTimeValue);
            const endDateTime = new Date(endDate);
            endDateTime.setHours(
              timeSource.getHours(),
              timeSource.getMinutes(),
              timeSource.getSeconds()
            );

            if (endDateTime <= now) {
              errors.push("Время завершения не может быть в прошлом");
            }
          }
        }
      } catch (error) {
        errors.push("Ошибка обработки даты завершения");
      }
    }

    // Проверка что начало не позже окончания
    if (startDayChecked && completitionDayChecked && startDayValue && completitionDayValue) {
      try {
        const startDate = new Date(startDayValue);
        const endDate = new Date(completitionDayValue);

        if (isValid(startDate) && isValid(endDate)) {
          if (isAfter(startDate, endDate)) {
            errors.push("Дата начала не может быть позже даты завершения");
          }

          // Если даты одинаковые, проверяем время
          if (startDate.toDateString() === endDate.toDateString() && completitionTimeValue) {
            const timeSource = new Date(completitionTimeValue);
            const endDateTime = new Date(endDate);
            endDateTime.setHours(
              timeSource.getHours(),
              timeSource.getMinutes(),
              timeSource.getSeconds()
            );

            if (isAfter(startDate, endDateTime)) {
              errors.push("Время начала не может быть позже времени завершения в тот же день");
            }
          }
        }
      } catch (error) {
        errors.push("Ошибка сравнения дат");
      }
    }

    console.log("🔧 Period валидация результат:", {
      errorsCount: errors.length,
      errors: errors,
      isValid: errors.length === 0,
    });

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  };

  const dateValidation = validateDates();

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

  // УПРОЩЕННЫЕ обработчики дат (убрали валидацию времени)
  const handleStartDayChange = (newValue) => {
    if (newValue && getStartDayHandler) {
      console.log("📅 Выбрана дата начала (UTC):", newValue);
      getStartDayHandler(newValue);
    }
  };

  const handleCompletitionDayChange = (newValue) => {
    if (newValue && getCompletitionDayHandler) {
      console.log("📅 Выбрана дата завершения (UTC):", newValue);
      getCompletitionDayHandler(newValue);
    }
  };

  const handleCompletitionTimeChange = (newValue) => {
    if (newValue && getCompletitionTimeHandler) {
      console.log("⏰ Выбрано время завершения (UTC):", newValue);
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
              <Box sx={{ fontSize: "16px", fontWeight: "500", color: "#1976d2" }}>
                Дата начала (UTC)
              </Box>
            }
            sx={{ marginBottom: startDayChecked ? "10px" : "0" }}
          />

          {startDayChecked && (
            <Box sx={{ marginLeft: "32px" }}>
              <DatePicker
                value={startDayValue || defaultValue}
                onChange={handleStartDayChange}
                format="dd/MM/yyyy"
                shouldDisableDate={(date) => {
                  // Блокируем только даты ДО сегодняшнего дня
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dateToCheck = new Date(date);
                  dateToCheck.setHours(0, 0, 0, 0);
                  return dateToCheck < today;
                }}
                slotProps={{
                  textField: {
                    id: "task-start-day",
                    size: "small",
                    fullWidth: true,
                    helperText: "Выберите дату начала задачи (UTC)",
                    error: !dateValidation.isValid && startDayChecked,
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
                Дата завершения (UTC)
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
                shouldDisableDate={(date) => {
                  // Блокируем только даты ДО сегодняшнего дня
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dateToCheck = new Date(date);
                  dateToCheck.setHours(0, 0, 0, 0);
                  return dateToCheck < today;
                }}
                slotProps={{
                  textField: {
                    id: "task-completition-day",
                    size: "small",
                    fullWidth: true,
                    helperText: "Выберите дату завершения (UTC)",
                    error: !dateValidation.isValid,
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
                    helperText: "Установите время завершения (UTC)",
                    error: !dateValidation.isValid && startDayChecked && completitionDayChecked,
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Ошибки валидации дат */}
        {!dateValidation.isValid && (
          <Box
            sx={{
              padding: "12px",
              backgroundColor: "#ffebee",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#c62828",
              border: "1px solid #ffcdd2",
              marginBottom: "10px",
            }}
          >
            <Box sx={{ fontWeight: "500", marginBottom: "4px" }}>⚠️ Ошибки в датах:</Box>
            {dateValidation.errors.map((error, index) => (
              <Box key={index} sx={{ marginTop: index > 0 ? "4px" : "0" }}>
                • {error}
              </Box>
            ))}
          </Box>
        )}

        {/* Информация о выбранном периоде */}
        {(startDayChecked || completitionDayChecked) && dateValidation.isValid && (
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
            <Box sx={{ fontWeight: "500", marginBottom: "4px" }}>📅 Выбранный период (UTC):</Box>

            {startDayChecked && completitionDayChecked && (
              <Box>
                От: {formatSafeDate(startDayValue, "dd.MM.yyyy")} <br />
                До: {formatSafeDate(completitionDayValue, "dd.MM.yyyy")} в{" "}
                {formatSafeDate(completitionTimeValue, "HH:mm")} UTC
              </Box>
            )}

            {startDayChecked && !completitionDayChecked && (
              <Box>Начало: {formatSafeDate(startDayValue, "dd.MM.yyyy")} UTC</Box>
            )}

            {!startDayChecked && completitionDayChecked && (
              <Box>
                Завершение: {formatSafeDate(completitionDayValue, "dd.MM.yyyy")} в{" "}
                {formatSafeDate(completitionTimeValue, "HH:mm")} UTC
              </Box>
            )}
          </Box>
        )}

        {/* UTC предупреждение */}
        <Box
          sx={{
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "#fff3e0",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#e65100",
            border: "1px solid #ffcc02",
            textAlign: "center",
          }}
        >
          🌍 Все время указывается в UTC. При установке напоминаний учитывается время до окончания
          задачи.
        </Box>

        {/* Отладочная информация - показываем в development */}
        {process.env.NODE_ENV === "development" && (
          <Box
            sx={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#666",
              fontFamily: "monospace",
            }}
          >
            🔧 Debug (UTC mode):
            <div>
              startChecked={String(startDayChecked)}, finishChecked={String(completitionDayChecked)}
            </div>
            <div>datesValid={String(dateValidation.isValid)}</div>
            <div>Current UTC: {new Date().toISOString()}</div>
            <div>
              StartDate:{" "}
              {startDayChecked && startDayValue ? new Date(startDayValue).toISOString() : "not set"}
            </div>
            <div>
              FinishDate:{" "}
              {completitionDayChecked && completitionDayValue
                ? new Date(completitionDayValue).toISOString()
                : "not set"}
            </div>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}
