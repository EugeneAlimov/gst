import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { popUpToOpen } from "../../Redux/chip/chip-slice";
import { sub, formatISO, differenceInMinutes, isValid } from "date-fns";

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
const EMPTY_DATE = "1970-01-01T00:00:00.000Z";
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

// Кастомный хук для управления датами и временем
const useDateTimeState = () => {
  const [startDate, setStartDate] = useState(defaultValue);
  const [finishDate, setFinishDate] = useState(defaultValue);
  const [finishTime, setFinishTime] = useState(defaultValue);
  const [isStartEnabled, setIsStartEnabled] = useState(false);
  const [isFinishEnabled, setIsFinishEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(-10);

  // Утилитарные функции
  const isEmptyDate = useCallback((date) => {
    if (!date) {
      console.log("🔍 Дата пустая (null/undefined):", date);
      return true;
    }

    const dateTime = new Date(date).getTime();
    const emptyDateTime = new Date(EMPTY_DATE).getTime();
    const isEmpty = dateTime === emptyDateTime;

    console.log("🔍 Проверка даты:", {
      date,
      dateTime,
      emptyDateTime,
      isEmpty,
    });

    return isEmpty;
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
      if (!data) {
        console.log("⚠️ Нет данных для инициализации");
        return;
      }

      console.log("🔄 Инициализация с данными из БД:", data);

      const { date_time_start, date_time_finish, date_time_reminder } = data;

      console.log("📅 Сырые даты из БД:", {
        start: date_time_start,
        finish: date_time_finish,
        reminder: date_time_reminder,
      });

      const isStartEmpty = isEmptyDate(date_time_start);
      const isFinishEmpty = isEmptyDate(date_time_finish);
      const isReminderEmpty = isEmptyDate(date_time_reminder);

      console.log("🔍 Проверка пустых дат:", {
        startEmpty: isStartEmpty,
        finishEmpty: isFinishEmpty,
        reminderEmpty: isReminderEmpty,
      });

      // Устанавливаем даты
      const parsedStartDate = isStartEmpty ? defaultValue : new Date(date_time_start);
      setStartDate(parsedStartDate);
      console.log("📅 Установлена дата начала:", parsedStartDate);

      if (!isFinishEmpty) {
        const finishDateTime = new Date(date_time_finish);
        setFinishDate(finishDateTime);
        setFinishTime(finishDateTime);
        console.log("📅 Установлена дата завершения:", finishDateTime);
      } else {
        setFinishDate(defaultValue);
        setFinishTime(defaultValue);
        console.log("📅 Сброс дат завершения на умолчания");
      }

      // Устанавливаем флаги
      setIsStartEnabled(!isStartEmpty);
      setIsFinishEnabled(!isFinishEmpty);

      console.log("🏁 Установлены флаги:", {
        startEnabled: !isStartEmpty,
        finishEnabled: !isFinishEmpty,
      });

      // Вычисляем интервал напоминания
      if (!isReminderEmpty && !isFinishEmpty) {
        const finishDateTime = new Date(date_time_finish);
        const reminderDateTime = new Date(date_time_reminder);
        const difference = differenceInMinutes(finishDateTime, reminderDateTime);
        setReminderMinutes(difference);
        console.log("🔔 Установлено напоминание:", difference, "минут");
      } else {
        setReminderMinutes(-10);
        console.log("🔔 Напоминание отключено");
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

// Кастомный хук для валидации
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

export default function DatesAndTimePallet({ cardId }) {
  // Улучшенная валидация cardId
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

  // RTK Query с правильным skip
  const {
    data: periodData,
    isLoading,
    error,
    refetch,
  } = useGetOneCardQuery(cardId, {
    skip: !isValidCardId,
  });

  // Используем кастомные хуки
  const dateTimeState = useDateTimeState();
  const validation = useDateValidation(
    dateTimeState.startDate,
    dateTimeState.finishDate,
    dateTimeState.isStartEnabled,
    dateTimeState.isFinishEnabled
  );

  const hasData = periodData && !isLoading && !error && isValidCardId;

  // Инициализация данных (запускается только при изменении данных)
  useEffect(() => {
    if (hasData) {
      console.log("🔄 Инициализация компонента с данными:", periodData);
      dateTimeState.initializeFromData(periodData);
    }
  }, [hasData, periodData]); // Добавляем periodData для отслеживания изменений

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
      console.log(
        "📅 Calendar changed:",
        calendarValue,
        "startEnabled:",
        dateTimeState.isStartEnabled,
        "finishEnabled:",
        dateTimeState.isFinishEnabled
      );

      if (dateTimeState.isStartEnabled && dateTimeState.isFinishEnabled) {
        // Интервал дат
        if (Array.isArray(calendarValue) && calendarValue.length === 2) {
          console.log("📅 Setting date range:", calendarValue);
          dateTimeState.setStartDate(calendarValue[0]);
          dateTimeState.setFinishDate(calendarValue[1]);
        }
      } else if (dateTimeState.isStartEnabled) {
        // Только дата начала
        console.log("📅 Setting start date:", calendarValue);
        dateTimeState.setStartDate(calendarValue);
      } else if (dateTimeState.isFinishEnabled) {
        // Только дата завершения
        console.log("📅 Setting finish date:", calendarValue);
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
        "🔔 Установлено напоминание:",
        minutes === -10 ? "без напоминания" : `за ${minutes} минут`
      );
    },
    [dateTimeState]
  );

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
    console.log("💾 Подготовка к сохранению дат в БД:", saveObject);

    // Проверим, что объект содержит правильные поля
    const requiredFields = ["date_time_start", "date_time_finish", "date_time_reminder"];
    const missingFields = requiredFields.filter((field) => !(field in saveObject));

    if (missingFields.length > 0) {
      console.error("❌ Отсутствуют обязательные поля:", missingFields);
      alert(`❌ Ошибка: отсутствуют поля ${missingFields.join(", ")}`);
      return;
    }

    try {
      console.log("🚀 Отправка запроса на сервер...");
      const result = await cardTimeUpdate({ id: cardId, ...saveObject }).unwrap();
      console.log("✅ Сервер вернул результат:", result);

      // Проверим, что сервер вернул обновленные данные
      if (result && typeof result === "object") {
        console.log("📅 Проверяем обновленные даты на сервере:");
        console.log("- date_time_start:", result.date_time_start);
        console.log("- date_time_finish:", result.date_time_finish);
        console.log("- date_time_reminder:", result.date_time_reminder);
      }

      // Показываем уведомление пользователю
      alert("✅ Даты успешно сохранены в базе данных!");

      // Принудительно обновляем данные из API
      if (refetch) {
        console.log("🔄 Принудительное обновление данных после сохранения...");
        setTimeout(() => {
          refetch();
        }, 500); // Небольшая задержка для того чтобы сервер успел сохранить
      }

      // Закрываем попап после успешного сохранения
      dispatch(popUpToOpen(0));
    } catch (error) {
      console.error("❌ Детальная ошибка сохранения:", error);

      // Попробуем извлечь максимально полезную информацию об ошибке
      let errorMessage = "Неизвестная ошибка сервера";

      if (error.data) {
        if (typeof error.data === "string") {
          errorMessage = error.data;
        } else if (error.data.detail) {
          errorMessage = error.data.detail;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        } else {
          errorMessage = JSON.stringify(error.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("❌ Обработанное сообщение об ошибке:", errorMessage);
      alert(`❌ Ошибка сохранения: ${errorMessage}`);
    }
  }, [validation, isValidCardId, cardId, dateTimeState, cardTimeUpdate, dispatch, refetch]);

  const handleRemove = useCallback(async () => {
    if (!isValidCardId) {
      console.error("❌ Невалидный cardId:", cardId);
      return;
    }

    const emptyObject = {
      date_time_start: EMPTY_DATE,
      date_time_finish: EMPTY_DATE,
      date_time_reminder: EMPTY_DATE,
    };

    console.log("🗑️ Удаляем даты из БД");

    try {
      const result = await cardTimeUpdate({ id: cardId, ...emptyObject }).unwrap();
      console.log("✅ Даты успешно удалены из БД:", result);

      // Сбрасываем локальное состояние
      dateTimeState.setIsStartEnabled(false);
      dateTimeState.setIsFinishEnabled(false);
      dateTimeState.setReminderMinutes(-10);

      // Показываем уведомление пользователю
      alert("✅ Даты успешно удалены!");

      // Закрываем попап после успешного удаления
      dispatch(popUpToOpen(0));
    } catch (error) {
      console.error("❌ Ошибка удаления дат из БД:", error);

      // Показываем ошибку пользователю
      const errorMessage = error.data?.detail || error.message || "Неизвестная ошибка";
      alert(`❌ Ошибка удаления: ${errorMessage}`);
    }
  }, [isValidCardId, cardId, cardTimeUpdate, dispatch, dateTimeState]);

  // Условный рендеринг
  const renderContent = () => {
    // Проверка валидности cardId
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

    // Состояние загрузки
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

    // Ошибки API
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
            {error.message || error.data?.detail || "Неизвестная ошибка"}
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

    // Отсутствие данных
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
          getstartDayCheckedHandler={(checked) => {
            console.log("Setting start enabled:", checked);
            dateTimeState.setIsStartEnabled(checked);
          }}
          getcompletitionDayCheckedHandler={(checked) => {
            console.log("Setting finish enabled:", checked);
            dateTimeState.setIsFinishEnabled(checked);
          }}
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
