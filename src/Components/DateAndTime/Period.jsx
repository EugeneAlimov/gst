/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";
import { popUpToOpen } from "../../Redux/chip/chip-slice";

import { sub, formatISO, differenceInMinutes, isValid } from "date-fns";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import Dates from "./Calendar";
import Period from "./Period";

import Remainder from "./Reminder";
import DateAndTimeButtonsGroup from "./DateAndTimeButtonsGroup";
import {
  useGetOneCardQuery,
  useUpdateCardDetailMutation,
} from "../../Redux/cards/cards-operations";

const EMPTY_DATE = "1970-01-01T00:00:00.000Z";
const defaultValue = new Date();

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  aligneItems: "center",
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

// ✅ ИСПРАВЛЕНИЕ: Кастомный хук для управления датами
const useDateTimeState = (initialData) => {
  const [startDate, setStartDate] = useState(defaultValue);
  const [finishDate, setFinishDate] = useState(defaultValue);
  const [finishTime, setFinishTime] = useState(defaultValue);
  const [isStartEnabled, setIsStartEnabled] = useState(false);
  const [isFinishEnabled, setIsFinishEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(-10);

  // Утилитарные функции
  const isEmptyDate = useCallback((date) => {
    if (!date) return true;
    return new Date(date).getTime() === new Date(EMPTY_DATE).getTime();
  }, []);

  const createFinishDateTime = useCallback(() => {
    const finishDateTime = new Date(finishDate);
    const timeSource = new Date(finishTime);

    finishDateTime.setHours(
      timeSource.getHours(),
      timeSource.getMinutes(),
      timeSource.getSeconds(),
      timeSource.getMilliseconds()
    );

    return finishDateTime;
  }, [finishDate, finishTime]);

  const getReminderDateTime = useCallback(() => {
    if (!isFinishEnabled || reminderMinutes === -10) {
      return EMPTY_DATE;
    }

    const finishDateTime = createFinishDateTime();
    const reminderDateTime = sub(finishDateTime, { minutes: reminderMinutes });
    return reminderDateTime.toISOString();
  }, [isFinishEnabled, reminderMinutes, createFinishDateTime]);

  // Инициализация данных
  const initializeFromData = useCallback(
    (data) => {
      if (!data) return;

      const { date_time_start, date_time_finish, date_time_reminder } = data;

      const isStartEmpty = isEmptyDate(date_time_start);
      const isFinishEmpty = isEmptyDate(date_time_finish);
      const isReminderEmpty = isEmptyDate(date_time_reminder);

      // Устанавливаем даты
      setStartDate(isStartEmpty ? defaultValue : new Date(date_time_start));

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

      // Вычисляем интервал напоминания
      if (!isReminderEmpty && !isFinishEmpty) {
        const finishDateTime = new Date(date_time_finish);
        const reminderDateTime = new Date(date_time_reminder);
        const difference = differenceInMinutes(finishDateTime, reminderDateTime);
        setReminderMinutes(difference);
      } else {
        setReminderMinutes(-10);
      }
    },
    [isEmptyDate]
  );

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

  // Объект для сохранения
  const getSaveObject = useCallback(() => {
    const finishDateTime = createFinishDateTime();

    return {
      date_time_start: isStartEnabled ? startDate.toISOString() : EMPTY_DATE,
      date_time_finish: isFinishEnabled ? finishDateTime.toISOString() : EMPTY_DATE,
      date_time_reminder: getReminderDateTime(),
    };
  }, [isStartEnabled, isFinishEnabled, startDate, createFinishDateTime, getReminderDateTime]);

  return {
    // Состояние
    startDate,
    finishDate,
    finishTime,
    isStartEnabled,
    isFinishEnabled,
    reminderMinutes,
    calendarValue,

    // Сеттеры
    setStartDate,
    setFinishDate,
    setFinishTime,
    setIsStartEnabled,
    setIsFinishEnabled,
    setReminderMinutes,

    // Утилиты
    initializeFromData,
    getSaveObject,
    createFinishDateTime,
    getReminderDateTime,
  };
};

// ✅ ИСПРАВЛЕНИЕ: Кастомный хук для валидации
const useDateValidation = (startDate, finishDate, isStartEnabled, isFinishEnabled) => {
  const validationErrors = useMemo(() => {
    const errors = [];

    if (isStartEnabled && isFinishEnabled) {
      if (startDate >= finishDate) {
        errors.push("Дата начала не может быть позже даты завершения");
      }
    }

    if (isStartEnabled && !isValid(startDate)) {
      errors.push("Неверная дата начала");
    }

    if (isFinishEnabled && !isValid(finishDate)) {
      errors.push("Неверная дата завершения");
    }

    return errors;
  }, [startDate, finishDate, isStartEnabled, isFinishEnabled]);

  const isValidState = validationErrors.length === 0;

  return { validationErrors, isValid: isValidState };
};

export default function DatesAndTimeHandler({ cardId }) {
  // ✅ ИСПРАВЛЕНИЕ: Добавляем проверку cardId сразу
  const isValidCardId =
    cardId && cardId !== "undefined" && typeof cardId !== "undefined" && cardId !== null;

  console.log("DatesAndTimePallet received cardId:", cardId, "isValid:", isValidCardId);

  const dispatch = useDispatch();
  const [cardTimeUpdate] = useUpdateCardDetailMutation();

  // ✅ ИСПРАВЛЕНИЕ: Используем skip для предотвращения лишних запросов
  const {
    data: periodData,
    isLoading,
    error,
    refetch,
  } = useGetOneCardQuery(cardId, {
    skip: !isValidCardId, // Пропускаем запрос если cardId невалидный
  });

  // ✅ Используем кастомные хуки
  const dateTimeState = useDateTimeState();
  const validation = useDateValidation(
    dateTimeState.startDate,
    dateTimeState.finishDate,
    dateTimeState.isStartEnabled,
    dateTimeState.isFinishEnabled
  );

  const hasData = periodData && !isLoading && !error && isValidCardId;

  // Инициализация данных
  useEffect(() => {
    if (hasData) {
      dateTimeState.initializeFromData(periodData);
    }
  }, [hasData, periodData]);

  // ✅ ИСПРАВЛЕНИЕ: Добавляем эффект для повторного запроса при изменении cardId
  useEffect(() => {
    if (isValidCardId && refetch) {
      refetch();
    }
  }, [cardId, isValidCardId, refetch]);

  // ✅ Упрощенные обработчики событий
  const handleCalendarChange = useCallback(
    (calendarValue) => {
      if (dateTimeState.isStartEnabled && dateTimeState.isFinishEnabled) {
        // Интервал дат
        if (Array.isArray(calendarValue) && calendarValue.length === 2) {
          dateTimeState.setStartDate(calendarValue[0]);
          dateTimeState.setFinishDate(calendarValue[1]);
        }
      } else if (dateTimeState.isStartEnabled) {
        // Только дата начала
        dateTimeState.setStartDate(calendarValue);
      } else if (dateTimeState.isFinishEnabled) {
        // Только дата завершения
        dateTimeState.setFinishDate(calendarValue);
      }
    },
    [dateTimeState]
  );

  const handleReminderChange = useCallback(
    (minutes) => {
      if (!dateTimeState.isFinishEnabled) {
        console.log("⚠️ Дата завершения не установлена, напоминание недоступно");
        return;
      }

      dateTimeState.setReminderMinutes(minutes);
      console.log(
        "✅ Установлено напоминание:",
        minutes === -10 ? "без напоминания" : `за ${minutes} минут`
      );
    },
    [dateTimeState]
  );

  const handleSave = async () => {
    if (!validation.isValid) {
      console.error("❌ Ошибки валидации:", validation.validationErrors);
      return;
    }

    if (!isValidCardId) {
      console.error("❌ Невалидный cardId:", cardId);
      return;
    }

    const saveObject = dateTimeState.getSaveObject();

    console.log("✅ Сохраняем оптимизированный объект:", saveObject);

    try {
      await cardTimeUpdate({ id: cardId, ...saveObject });
      console.log("✅ Данные успешно сохранены");
    } catch (error) {
      console.error("❌ Ошибка сохранения:", error);
    }
  };

  const handleRemove = async () => {
    if (!isValidCardId) {
      console.error("❌ Невалидный cardId:", cardId);
      return;
    }

    const emptyObject = {
      date_time_start: EMPTY_DATE,
      date_time_finish: EMPTY_DATE,
      date_time_reminder: EMPTY_DATE,
    };

    try {
      await cardTimeUpdate({ id: cardId, ...emptyObject });
      console.log("✅ Даты успешно очищены");
    } catch (error) {
      console.error("❌ Ошибка очистки:", error);
    }
  };

  // ✅ ИСПРАВЛЕНИЕ: Улучшенный условный рендеринг
  const renderContent = () => {
    // Первый приоритет - проверка валидности cardId
    if (!isValidCardId) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#c62828",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          ❌ Ошибка: Не указан корректный ID карточки
          <div style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>
            Получен: {JSON.stringify(cardId)}
          </div>
        </div>
      );
    }

    // Второй приоритет - состояние загрузки
    if (isLoading) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#1976d2",
          }}
        >
          ⏳ Загрузка данных карточки...
        </div>
      );
    }

    // Третий приоритет - ошибки API
    if (error) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#c62828",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          ❌ Ошибка загрузки карточки
          <div style={{ fontSize: "12px", marginTop: "5px" }}>
            {error.message || error.detail || "Неизвестная ошибка"}
          </div>
          <button
            onClick={() => refetch()}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              fontSize: "12px",
              border: "1px solid #c62828",
              background: "transparent",
              color: "#c62828",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Повторить
          </button>
        </div>
      );
    }

    // Четвертый приоритет - отсутствие данных
    if (!periodData) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#666",
          }}
        >
          ℹ️ Нет данных карточки...
          <button
            onClick={() => refetch()}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              fontSize: "12px",
              border: "1px solid #666",
              background: "transparent",
              color: "#666",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Обновить
          </button>
        </div>
      );
    }

    // Нормальный рендеринг компонента
    return (
      <>
        <CardHeader
          sx={{
            padding: "10px",
            marginBottom: "10px",
          }}
          titleTypographyProps={{ textAlign: "center", fontSize: "20px", color: "#172b4d" }}
          title="Даты и время"
          action={
            <IconButton
              onClick={() => dispatch(popUpToOpen(0))}
              aria-label="Change-Chips-Pallet"
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
            }}
          >
            {validation.validationErrors.map((error, index) => (
              <div key={index}>⚠️ {error}</div>
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
          defaultValue={dateTimeState.reminderMinutes}
          remaindeBefore={handleReminderChange}
        />

        <DateAndTimeButtonsGroup
          startDayChecked={dateTimeState.isStartEnabled}
          completitionDayChecked={dateTimeState.isFinishEnabled}
          saveChanges={handleSave}
          remove={handleRemove}
          disabled={!validation.isValid}
        />
      </>
    );
  };

  return <Card sx={cardStyle}>{renderContent()}</Card>;
}
