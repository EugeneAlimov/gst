import React from "react";
import {
  format,
  isAfter,
  isBefore,
  isPast,
  isValid,
  startOfDay,
  isToday,
  isBefore as isBeforeDate,
} from "date-fns";

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
  originalStartDate, // Исходная дата начала из БД
  originalEndDate, // Исходная дата завершения из БД
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

  // Проверка является ли дата "исходной" (уже была в БД)
  const isOriginalDate = (newDate, originalDate) => {
    if (!originalDate || !newDate) return false;

    try {
      const original = startOfDay(new Date(originalDate));
      const current = startOfDay(new Date(newDate));
      return original.getTime() === current.getTime();
    } catch {
      return false;
    }
  };

  // Валидация дат - проверяем что дата начала не позже даты окончания + проверка прошедших дат
  const validateDates = () => {
    const errors = [];

    console.log("🔧 Period валидация. Входные данные:", {
      startDayChecked,
      completitionDayChecked,
      startDayValue,
      completitionDayValue,
      originalStartDate,
      originalEndDate,
    });

    // Проверка даты начала на прошедшее время
    if (startDayChecked && startDayValue) {
      try {
        const startDate = new Date(startDayValue);

        if (!isValid(startDate)) {
          errors.push("Неверная дата начала");
        } else {
          // Проверяем только если это новая дата (не из БД)
          if (!isOriginalDate(startDate, originalStartDate)) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const startOfDayDate = new Date(startDate);
            startOfDayDate.setHours(0, 0, 0, 0);

            if (startOfDayDate < today) {
              errors.push("Дата начала не может быть в прошлом");
            }
          }
        }
      } catch (error) {
        errors.push("Ошибка обработки даты начала");
      }
    }

    // Проверка даты завершения на прошедшее время
    if (completitionDayChecked && completitionDayValue) {
      try {
        const endDate = new Date(completitionDayValue);

        if (!isValid(endDate)) {
          errors.push("Неверная дата завершения");
        } else {
          // Проверяем только если это новая дата (не из БД)
          if (!isOriginalDate(endDate, originalEndDate)) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const endOfDayDate = new Date(endDate);
            endOfDayDate.setHours(0, 0, 0, 0);

            // Если дата завершения до сегодняшнего дня - ошибка
            if (endOfDayDate < today) {
              errors.push("Дата завершения не может быть в прошлом");
            }
            // Если дата сегодня, но время уже прошло - тоже ошибка
            else if (endOfDayDate.getTime() === today.getTime() && completitionTimeValue) {
              const timeSource = new Date(completitionTimeValue);
              const endDateTime = new Date(endDate);
              endDateTime.setHours(
                timeSource.getHours(),
                timeSource.getMinutes(),
                timeSource.getSeconds()
              );

              const now = new Date();
              if (endDateTime <= now) {
                errors.push("Время завершения не может быть в прошлом");
              }
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

  // Обработчики изменения дат с валидацией
  const handleStartDayChange = (newValue) => {
    if (newValue && getStartDayHandler) {
      const today = startOfDay(new Date());
      const newDate = startOfDay(new Date(newValue));

      console.log("📅 Выбрана дата начала:", {
        newValue,
        newDate,
        today,
        isOriginal: isOriginalDate(newValue, originalStartDate),
        isPastDate: newDate < today,
      });

      getStartDayHandler(newValue);
    }
  };

  const handleCompletitionDayChange = (newValue) => {
    if (newValue && getCompletitionDayHandler) {
      const today = startOfDay(new Date());
      const newDate = startOfDay(new Date(newValue));

      console.log("📅 Выбрана дата завершения:", {
        newValue,
        newDate,
        today,
        isOriginal: isOriginalDate(newValue, originalEndDate),
        isPastDate: newDate < today,
      });

      getCompletitionDayHandler(newValue);
    }
  };

  const handleCompletitionTimeChange = (newValue) => {
    if (newValue && getCompletitionTimeHandler) {
      // Проверка времени с учетом даты
      if (completitionDayValue) {
        const endDate = new Date(completitionDayValue);
        const timeSource = new Date(newValue);
        const endDateTime = new Date(endDate);
        endDateTime.setHours(
          timeSource.getHours(),
          timeSource.getMinutes(),
          timeSource.getSeconds()
        );

        const now = new Date();
        if (!isOriginalDate(endDate, originalEndDate) && endDateTime <= now) {
          console.log("⚠️ Попытка установить время завершения в прошлом");
        }
      }

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
                shouldDisableDate={(date) => {
                  // Разрешаем исходную дату, даже если она в прошлом
                  if (isOriginalDate(date, originalStartDate)) {
                    return false;
                  }

                  // Получаем начало сегодняшнего дня
                  const today = startOfDay(new Date());
                  const dateToCheck = startOfDay(date);

                  // Блокируем только даты ДО сегодняшнего дня
                  return dateToCheck < today;
                }}
                slotProps={{
                  textField: {
                    id: "task-start-day",
                    size: "small",
                    fullWidth: true,
                    helperText: "Выберите дату начала задачи",
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
                shouldDisableDate={(date) => {
                  // Разрешаем исходную дату, даже если она в прошлом
                  if (isOriginalDate(date, originalEndDate)) {
                    return false;
                  }

                  // Получаем начало сегодняшнего дня
                  const today = startOfDay(new Date());
                  const dateToCheck = startOfDay(date);

                  // Блокируем только даты ДО сегодняшнего дня
                  return dateToCheck < today;
                }}
                slotProps={{
                  textField: {
                    id: "task-completition-day",
                    size: "small",
                    fullWidth: true,
                    helperText: "Выберите дату завершения",
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
                    helperText: "Установите время завершения",
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

        {/* Отладочная информация - показываем в development */}
        {process.env.NODE_ENV === "development" && (
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
            🔧 Debug:
            <div>
              startChecked={String(startDayChecked)}, finishChecked={String(completitionDayChecked)}
            </div>
            <div>datesValid={String(dateValidation.isValid)}</div>
            <div>Today: {new Date().toLocaleDateString()}</div>
            <div>
              StartDate:{" "}
              {startDayChecked && startDayValue
                ? new Date(startDayValue).toLocaleDateString()
                : "not set"}
            </div>
            <div>
              FinishDate:{" "}
              {completitionDayChecked && completitionDayValue
                ? new Date(completitionDayValue).toLocaleDateString()
                : "not set"}
            </div>
            <div>Original start: {originalStartDate || "null"}</div>
            <div>Original end: {originalEndDate || "null"}</div>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}
