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
  const [reminderOffsetMinutes, setReminderOffsetMinutes] = useState(-10);

  // Утилитарные функции
  const isEmptyDate = useCallback((date) => {
    if (!date) return true;
    const dateTime = new Date(date).getTime();
    const emptyDateTime = new Date(EMPTY_DATE).getTime();
    return dateTime === emptyDateTime;
  }, []);

  // Инициализация данных
  const initializeFromData = useCallback(
    (data) => {
      if (!data) return;

      const { date_time_start, date_time_finish, reminder_offset_minutes } = data;

      const isStartEmpty = isEmptyDate(date_time_start);
      const isFinishEmpty = isEmptyDate(date_time_finish);

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

  // УПРОЩЕННЫЙ объект для сохранения (БЕЗ клиентского расчета времени)
  const getSaveObject = useCallback(() => {
    // Создаем финальную дату с учетом времени (только для отправки на сервер)
    let finalFinishDateTime = null;
    if (isFinishEnabled) {
      finalFinishDateTime = new Date(finishDate);
      const timeSource = new Date(finishTime);
      finalFinishDateTime.setHours(
        timeSource.getHours(),
        timeSource.getMinutes(),
        timeSource.getSeconds(),
        timeSource.getMilliseconds()
      );
    }

    return {
      date_time_start: isStartEnabled ? startDate.toISOString() : EMPTY_DATE,
      date_time_finish: isFinishEnabled ? finalFinishDateTime.toISOString() : EMPTY_DATE,
      reminder_offset_minutes: reminderOffsetMinutes === -10 ? null : reminderOffsetMinutes,
      // НЕ отправляем reminder_calculated_time - это делает сервер автоматически
    };
  }, [isStartEnabled, isFinishEnabled, startDate, finishDate, finishTime, reminderOffsetMinutes]);

  // Вычисляемые значения для календаря (без изменений)
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
    // Убираем createFinishDateTime и getTimeToFinishInMinutes
  };
};

// Кастомный хук для валидации
const useDateValidation = (
  startDate,
  finishDate,
  isStartEnabled,
  isFinishEnabled,
  originalStartDate,
  originalEndDate
) => {
  const validationErrors = useMemo(() => {
    const errors = [];

    // Проверка является ли дата "исходной" (уже была в БД)
    const isOriginalDate = (newDate, originalDate) => {
      if (!originalDate || !newDate) return false;
      try {
        const original = new Date(originalDate).toDateString();
        const current = new Date(newDate).toDateString();
        return original === current;
      } catch {
        return false;
      }
    };

    // Валидация дат на прошедшее время
    const now = new Date();

    if (isStartEnabled && startDate) {
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

    if (isFinishEnabled && finishDate) {
      if (!isOriginalDate(finishDate, originalEndDate)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const finishDay = new Date(finishDate);
        finishDay.setHours(0, 0, 0, 0);

        if (finishDay < today) {
          errors.push("Дата завершения не может быть в прошлом");
        }
      }
    }

    // Проверка что начало не позже окончания
    if (isStartEnabled && isFinishEnabled) {
      if (startDate >= finishDate) {
        errors.push("Дата начала не может быть позже даты завершения");
      }
    }

    // УБИРАЕМ валидацию смещения напоминания - теперь это делает сервер

    return errors;
  }, [startDate, finishDate, isStartEnabled, isFinishEnabled, originalStartDate, originalEndDate]);

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

  // RTK Query с правильным skip
  const {
    data: periodData,
    isLoading,
    error,
    refetch,
  } = useGetOneCardQuery(cardId, {
    skip: !isValidCardId,
    refetchOnMountOrArgChange: true, //принудительное обновление при изменении cardId
  });

  // Используем кастомные хуки
  const dateTimeState = useDateTimeState();
  const validation = useDateValidation(
    dateTimeState.startDate,
    dateTimeState.finishDate,
    dateTimeState.isStartEnabled,
    dateTimeState.isFinishEnabled,
    periodData?.date_time_start,
    periodData?.date_time_finish
  );

  const hasData = periodData && !isLoading && !error && isValidCardId;

  // Получаем статус выполнения задачи
  const isTaskCompleted = periodData?.is_completed || false;

  // Инициализация данных (запускается только при изменении данных)
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

  // работаем со смещением и учитывает статус выполнения
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

  // НОВЫЙ: Обработчик автоматического отключения напоминаний
  const handleReminderDisabled = useCallback((reason, previousValue) => {
    console.log(
      `🔕 Напоминание автоматически отключено. Причина: ${reason}, было: ${previousValue}`
    );

    // Здесь можно добавить дополнительную логику, например:
    // - Показать уведомление пользователю
    // - Сохранить в истории изменений
    // - Отправить аналитику
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
    console.log("💾 Подготовка к сохранению дат в БД (со смещением):", saveObject);

    // ОТЛАДКА: проверяем что отправляем
    console.log("🔍 ОТЛАДКА отправляемых данных:");
    console.log("- cardId:", cardId);
    console.log("- date_time_start:", saveObject.date_time_start);
    console.log("- date_time_finish:", saveObject.date_time_finish);
    console.log("- reminder_offset_minutes:", saveObject.reminder_offset_minutes);

    try {
      const result = await cardTimeUpdate({
        id: cardId,
        ...saveObject,
      }).unwrap();

      console.log("✅ Сервер вернул результат:", result);

      // Показываем уведомление пользователю
      alert("✅ Даты успешно сохранены в базе данных!");

      // Закрываем попап после успешного сохранения
      dispatch(popUpToOpen(0));
    } catch (error) {
      console.error("❌ Детальная ошибка сохранения:", error);

      // ОТЛАДКА ошибки
      console.log("🔍 ОТЛАДКА ошибки:");
      console.log("- error.status:", error.status);
      console.log("- error.data:", error.data);
      console.log("- error.message:", error.message);

      // Извлекаем полезную информацию об ошибке
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

    // ОБНОВЛЕНО: очищаем смещение вместо времени напоминания
    const emptyObject = {
      date_time_start: EMPTY_DATE,
      date_time_finish: EMPTY_DATE,
      reminder_offset_minutes: null, // Изменено
    };

    console.log("🗑️ Удаляем даты из БД");

    try {
      const result = await cardTimeUpdate({ id: cardId, ...emptyObject }).unwrap();
      console.log("✅ Даты успешно удалены из БД:", result);

      // Сбрасываем локальное состояние
      dateTimeState.setIsStartEnabled(false);
      dateTimeState.setIsFinishEnabled(false);
      dateTimeState.setReminderOffsetMinutes(-10); // Обновлено

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
          originalStartDate={periodData?.date_time_start} // НОВЫЙ: Исходная дата начала
          originalEndDate={periodData?.date_time_finish} // НОВЫЙ: Исходная дата завершения
        />

        <Remainder
          defaultValue={dateTimeState.reminderOffsetMinutes} // Обновлено
          remaindeBefore={handleReminderChange}
          isFinishEnabled={dateTimeState.isFinishEnabled} // Новый проп
          isCompleted={isTaskCompleted} // НОВЫЙ: Передаем статус выполнения
          onReminderDisabled={handleReminderDisabled} // НОВЫЙ: Callback отключения
        />

        <DateAndTimeButtonsGroup
          startDayChecked={dateTimeState.isStartEnabled}
          completitionDayChecked={dateTimeState.isFinishEnabled}
          saveChanges={handleSave}
          remove={handleRemove}
          disabled={!validation.isValid}
          validationErrors={validation.validationErrors} // Передаем детальные ошибки
        />
      </>
    );
  };

  return <Card sx={cardStyle}>{renderContent()}</Card>;
}
