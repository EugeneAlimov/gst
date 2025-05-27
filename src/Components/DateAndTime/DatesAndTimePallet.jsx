import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { popUpToOpen } from "../../Redux/chip/chip-slice";

// MUI components
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// Local components
import Dates from "./Calendar";
import Period from "./Period";
import Remainder from "./Reminder";
import DateAndTimeButtonsGroup from "./DateAndTimeButtonsGroup";

// RTK Query
import {
  useGetOneCardQuery,
  useUpdateCardDetailMutation,
} from "../../Redux/cards/cards-operations";

// Constants
const defaultValue = new Date();

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "10px",
  width: "304px",
  height: "fit-content",
  padding: "12px",
  backgroundColor: "#fff",
};

const iconButtonStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  right: "8px",
  backgroundColor: "rgba(0, 0, 0, 0.14)",
};

// Кастомный хук для управления датами и временем (УПРОЩЕННЫЙ для UTC)
const useDateTimeState = () => {
  const [startDate, setStartDate] = useState(defaultValue);
  const [finishDate, setFinishDate] = useState(defaultValue);
  const [finishTime, setFinishTime] = useState(defaultValue);
  const [isStartEnabled, setIsStartEnabled] = useState(false);
  const [isFinishEnabled, setIsFinishEnabled] = useState(false);
  const [reminderOffsetMinutes, setReminderOffsetMinutes] = useState(-10);

  // Утилитарные функции
  const isEmptyDate = useCallback((date) => {
    if (!date) return true;
    // Проверяем на null или пустые значения, убираем проверку на эпоху
    return false;
  }, []);

  // Инициализация данных
  const initializeFromData = useCallback(
    (data) => {
      if (!data) return;

      const { date_time_start, date_time_finish, reminder_offset_minutes } = data;

      // Упрощенная инициализация без проверки на EMPTY_DATE
      const isStartEmpty = !date_time_start;
      const isFinishEmpty = !date_time_finish;

      // Устанавливаем даты
      const parsedStartDate = isStartEmpty ? defaultValue : new Date(date_time_start);
      setStartDate(parsedStartDate);

      if (!isFinishEmpty) {
        const finishDateTime = new Date(date_time_finish);
        setFinishDate(finishDateTime);
        setFinishTime(finishDateTime);
      } else {
        setFinishDate(defaultValue);
        setFinishTime(defaultValue);
      }

      // Устанавливаем флаги
      setIsStartEnabled(!isStartEmpty);
      setIsFinishEnabled(!isFinishEmpty);

      // Устанавливаем смещение напоминания
      const offsetMinutes = reminder_offset_minutes || -10;
      setReminderOffsetMinutes(offsetMinutes);
    },
    [isEmptyDate]
  );

  // УПРОЩЕННЫЙ объект для сохранения (правильная работа с UTC)
  const getSaveObject = useCallback(() => {
    let finalFinishDateTime = null;

    if (isFinishEnabled && finishDate && finishTime) {
      // Создаем UTC дату правильно
      const date = new Date(finishDate);
      const time = new Date(finishTime);

      // Создаем UTC время
      finalFinishDateTime = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          time.getUTCHours(),
          time.getUTCMinutes(),
          0,
          0
        )
      );
    }

    return {
      date_time_start: isStartEnabled ? startDate.toISOString() : null,
      date_time_finish: finalFinishDateTime ? finalFinishDateTime.toISOString() : null,
      reminder_offset_minutes: reminderOffsetMinutes === -10 ? null : reminderOffsetMinutes,
      // НЕ отправляем reminder_calculated_time - это делает сервер автоматически
    };
  }, [isStartEnabled, isFinishEnabled, startDate, finishDate, finishTime, reminderOffsetMinutes]);

  // Вычисляемые значения для календаря
  const calendarValue = useMemo(() => {
    if (isStartEnabled && isFinishEnabled) {
      return [startDate, finishDate];
    }
    if (isStartEnabled && !isFinishEnabled) {
      return startDate;
    }
    if (!isStartEnabled && isFinishEnabled) {
      return finishDate;
    }
    return null;
  }, [isStartEnabled, isFinishEnabled, startDate, finishDate]);

  return {
    // Состояние
    startDate,
    finishDate,
    finishTime,
    isStartEnabled,
    isFinishEnabled,
    reminderOffsetMinutes,
    calendarValue,

    // Сеттеры
    setStartDate,
    setFinishDate,
    setFinishTime,
    setIsStartEnabled,
    setIsFinishEnabled,
    setReminderOffsetMinutes,

    // Утилиты
    initializeFromData,
    getSaveObject,
  };
};

// ПРАВИЛЬНАЯ валидация (включая проверку смещения напоминания)
const useDateValidation = (
  startDate,
  finishDate,
  isStartEnabled,
  isFinishEnabled,
  reminderOffsetMinutes,
  finishTime
) => {
  const validationErrors = useMemo(() => {
    const errors = [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Валидация дат
    if (isStartEnabled && startDate) {
      try {
        const start = new Date(startDate);
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (startDay < today) {
          errors.push("Дата начала не может быть в прошлом");
        }
      } catch (error) {
        errors.push("Ошибка обработки даты начала");
      }
    }

    if (isFinishEnabled && finishDate) {
      try {
        const end = new Date(finishDate);
        const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

        if (endDay < today) {
          errors.push("Дата завершения не может быть в прошлом");
        }

        // Если дата завершения сегодня, проверяем время
        if (endDay.getTime() === today.getTime() && finishTime) {
          const timeSource = new Date(finishTime);
          const endDateTime = new Date(end);
          endDateTime.setHours(
            timeSource.getHours(),
            timeSource.getMinutes(),
            timeSource.getSeconds()
          );

          if (endDateTime <= now) {
            errors.push("Время завершения не может быть в прошлом");
          }

          // ВАЖНО: Проверяем смещение напоминания
          if (reminderOffsetMinutes > 0) {
            const reminderTime = new Date(
              endDateTime.getTime() - reminderOffsetMinutes * 60 * 1000
            );
            if (reminderTime <= now) {
              const hoursLeft =
                Math.round(((endDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)) * 10) / 10;
              const offsetHours = Math.round((reminderOffsetMinutes / 60) * 10) / 10;
              errors.push(
                `Нельзя установить напоминание за ${offsetHours}ч до завершения. До окончания осталось ${hoursLeft}ч`
              );
            }
          }
        }
      } catch (error) {
        errors.push("Ошибка обработки даты завершения");
      }
    }

    // Проверка что начало не позже окончания
    if (isStartEnabled && isFinishEnabled && startDate && finishDate) {
      try {
        const start = new Date(startDate);
        const end = new Date(finishDate);

        if (start >= end) {
          errors.push("Дата начала не может быть позже даты завершения");
        }
      } catch (error) {
        errors.push("Ошибка сравнения дат");
      }
    }

    return errors;
  }, [startDate, finishDate, isStartEnabled, isFinishEnabled, reminderOffsetMinutes, finishTime]);

  const isValidState = validationErrors.length === 0;
  return { validationErrors, isValid: isValidState };
};

export default function DatesAndTimePallet({ cardId }) {
  // валидация cardId
  const isValidCardId = useMemo(() => {
    return (
      cardId &&
      cardId !== "undefined" &&
      cardId !== null &&
      cardId !== undefined &&
      (typeof cardId === "number" || (typeof cardId === "string" && cardId !== ""))
    );
  }, [cardId]);

  console.log("DatesAndTimePallet mounted with cardId:", cardId, "isValid:", isValidCardId);

  const dispatch = useDispatch();
  const [cardTimeUpdate] = useUpdateCardDetailMutation();

  // RTK Query
  const {
    data: periodData,
    isLoading,
    error,
    refetch,
  } = useGetOneCardQuery(cardId, {
    skip: !isValidCardId,
    refetchOnMountOrArgChange: true,
  });

  // Используем кастомные хуки
  const dateTimeState = useDateTimeState();
  const validation = useDateValidation(
    dateTimeState.startDate,
    dateTimeState.finishDate,
    dateTimeState.isStartEnabled,
    dateTimeState.isFinishEnabled,
    dateTimeState.reminderOffsetMinutes,
    dateTimeState.finishTime
  );

  const hasData = periodData && !isLoading && !error && isValidCardId;

  // Получаем статус выполнения задачи
  const isTaskCompleted = periodData?.is_completed || false;

  // Инициализация данных
  useEffect(() => {
    if (hasData) {
      console.log("🔄 Инициализация компонента с данными:", periodData);
      dateTimeState.initializeFromData(periodData);
    }
  }, [hasData, periodData]);

  // Принудительное обновление при изменении cardId
  useEffect(() => {
    if (isValidCardId && refetch) {
      console.log("🔄 Принудительное обновление данных для cardId:", cardId);
      refetch();
    }
  }, [cardId, isValidCardId, refetch]);

  // Обработчики событий
  const handleCalendarChange = useCallback(
    (calendarValue) => {
      console.log("📅 Calendar changed:", calendarValue);

      if (dateTimeState.isStartEnabled && dateTimeState.isFinishEnabled) {
        if (Array.isArray(calendarValue) && calendarValue.length === 2) {
          dateTimeState.setStartDate(calendarValue[0]);
          dateTimeState.setFinishDate(calendarValue[1]);
        }
      } else if (dateTimeState.isStartEnabled) {
        dateTimeState.setStartDate(calendarValue);
      } else if (dateTimeState.isFinishEnabled) {
        dateTimeState.setFinishDate(calendarValue);
      }
    },
    [dateTimeState]
  );

  // Обработчик смещения напоминания
  const handleReminderChange = useCallback(
    (offsetMinutes) => {
      if (!dateTimeState.isFinishEnabled && offsetMinutes !== -10) {
        console.log("⚠️ Дата завершения не установлена, напоминание недоступно");
        return;
      }

      if (isTaskCompleted && offsetMinutes !== -10) {
        console.log("⚠️ Задача выполнена, напоминания недоступны");
        return;
      }

      dateTimeState.setReminderOffsetMinutes(offsetMinutes);
      console.log(
        "🔔 Установлено смещение напоминания:",
        offsetMinutes === -10 ? "без напоминания" : `за ${offsetMinutes} минут`
      );
    },
    [dateTimeState, isTaskCompleted]
  );

  // Обработчик автоматического отключения напоминаний
  const handleReminderDisabled = useCallback((reason, previousValue) => {
    console.log(
      `🔕 Напоминание автоматически отключено. Причина: ${reason}, было: ${previousValue}`
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!validation.isValid) {
      console.error("❌ Ошибки валидации:", validation.validationErrors);
      alert(`❌ Ошибки валидации:\n${validation.validationErrors.join("\n")}`);
      return;
    }

    if (!isValidCardId) {
      console.error("❌ Невалидный cardId:", cardId);
      alert("❌ Ошибка: неверный ID карточки");
      return;
    }

    const saveObject = dateTimeState.getSaveObject();
    console.log("💾 Подготовка к сохранению дат в БД (UTC время):", saveObject);

    try {
      const result = await cardTimeUpdate({
        id: cardId,
        ...saveObject,
      }).unwrap();

      console.log("✅ Сервер вернул результат:", result);

      alert("✅ Даты успешно сохранены (время в UTC)!");
      dispatch(popUpToOpen(0));
    } catch (error) {
      console.error("❌ Детальная ошибка сохранения:", error);

      // УЛУЧШЕННАЯ обработка серверных ошибок валидации
      let errorMessage = "Неизвестная ошибка сервера";

      if (error.data) {
        // Специальная обработка ошибок валидации напоминаний
        if (error.data.reminder_offset_minutes) {
          errorMessage = "Напоминание нельзя установить на уже прошедшее время (UTC)";
          // Сбрасываем локальное состояние напоминания
          dateTimeState.setReminderOffsetMinutes(-10);
        } else if (typeof error.data === "string") {
          errorMessage = error.data;
        } else if (error.data.detail) {
          errorMessage = error.data.detail;
        } else {
          errorMessage = JSON.stringify(error.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`❌ Ошибка сохранения: ${errorMessage}`);
    }
  }, [validation, isValidCardId, cardId, dateTimeState, cardTimeUpdate, dispatch]);

  const handleRemove = useCallback(async () => {
    if (!isValidCardId) {
      console.error("❌ Невалидный cardId:", cardId);
      return;
    }

    // УПРОЩЕННАЯ логика удаления
    const emptyObject = {
      date_time_start: null,
      date_time_finish: null,
      reminder_offset_minutes: null,
    };

    console.log("🗑️ Удаляем даты из БД");

    try {
      const result = await cardTimeUpdate({ id: cardId, ...emptyObject }).unwrap();
      console.log("✅ Даты успешно удалены из БД:", result);

      // Сбрасываем локальное состояние
      dateTimeState.setIsStartEnabled(false);
      dateTimeState.setIsFinishEnabled(false);
      dateTimeState.setReminderOffsetMinutes(-10);

      alert("✅ Даты успешно удалены!");
      dispatch(popUpToOpen(0));
    } catch (error) {
      console.error("❌ Ошибка удаления дат из БД:", error);
      const errorMessage = error.data?.detail || error.message || "Неизвестная ошибка";
      alert(`❌ Ошибка удаления: ${errorMessage}`);
    }
  }, [isValidCardId, cardId, cardTimeUpdate, dispatch, dateTimeState]);

  // Условный рендеринг
  const renderContent = () => {
    if (!isValidCardId) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#c62828" }}>
          ❌ Ошибка: Не указан корректный ID карточки
        </div>
      );
    }

    if (isLoading) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#1976d2" }}>
          ⏳ Загрузка данных карточки...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#c62828" }}>
          ❌ Ошибка загрузки карточки
          <button onClick={() => refetch()} style={{ marginTop: "10px" }}>
            Повторить
          </button>
        </div>
      );
    }

    if (!periodData) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          ℹ️ Нет данных карточки...
        </div>
      );
    }

    return (
      <>
        <CardHeader
          sx={{ padding: "10px", marginBottom: "10px" }}
          titleTypographyProps={{ textAlign: "center", fontSize: "20px", color: "#172b4d" }}
          title="Даты и время (UTC)"
          action={
            <IconButton
              onClick={() => dispatch(popUpToOpen(0))}
              aria-label="Close dates and time pallet"
              sx={iconButtonStyle}
            >
              <CloseOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          }
        />

        {/* Показываем ошибки валидации */}
        {validation.validationErrors.length > 0 && (
          <div
            style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#ffebee",
              borderRadius: "4px",
              color: "#c62828",
              border: "1px solid #ffcdd2",
            }}
          >
            <div style={{ fontWeight: "500", marginBottom: "4px" }}>⚠️ Ошибки валидации:</div>
            {validation.validationErrors.map((error, index) => (
              <div key={index} style={{ marginTop: index > 0 ? "4px" : "0" }}>
                • {error}
              </div>
            ))}
          </div>
        )}

        <Dates
          getDayHandler={handleCalendarChange}
          calendarValue={dateTimeState.calendarValue}
          startDayChecked={dateTimeState.isStartEnabled}
          completitionDayChecked={dateTimeState.isFinishEnabled}
        />

        <Period
          startDayValue={dateTimeState.startDate}
          completitionDayValue={dateTimeState.finishDate}
          completitionTimeValue={dateTimeState.finishTime}
          getStartDayHandler={dateTimeState.setStartDate}
          getCompletitionDayHandler={dateTimeState.setFinishDate}
          getCompletitionTimeHandler={dateTimeState.setFinishTime}
          getstartDayCheckedHandler={dateTimeState.setIsStartEnabled}
          getcompletitionDayCheckedHandler={dateTimeState.setIsFinishEnabled}
          startDayChecked={dateTimeState.isStartEnabled}
          completitionDayChecked={dateTimeState.isFinishEnabled}
          defaultValue={defaultValue}
        />

        <Remainder
          defaultValue={dateTimeState.reminderOffsetMinutes}
          remaindeBefore={handleReminderChange}
          isFinishEnabled={dateTimeState.isFinishEnabled}
          isCompleted={isTaskCompleted}
          onReminderDisabled={handleReminderDisabled}
        />

        <DateAndTimeButtonsGroup
          startDayChecked={dateTimeState.isStartEnabled}
          completitionDayChecked={dateTimeState.isFinishEnabled}
          saveChanges={handleSave}
          remove={handleRemove}
          disabled={!validation.isValid}
          validationErrors={validation.validationErrors}
        />
      </>
    );
  };

  return <Card sx={cardStyle}>{renderContent()}</Card>;
}
