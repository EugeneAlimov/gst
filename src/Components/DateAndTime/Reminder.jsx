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
  { value: 360, label: "За 6 часов" },
  { value: 720, label: "За 12 часов" },
  { value: 1440, label: "За 1 день" },
  { value: 2880, label: "За 2 дня" },
  { value: 10080, label: "За 1 неделю" },
];

export default function Reminder({
  defaultValue = -10,
  remaindeBefore,
  isFinishEnabled = true, // Есть ли дата завершения
  isCompleted = false, // НОВЫЙ: Выполнена ли задача
  onReminderDisabled, // НОВЫЙ: Callback при автоматическом отключении
}) {
  const [remainder, setRemainder] = useState(defaultValue);
  const [lastActiveReminder, setLastActiveReminder] = useState(-10); // Сохраняем последнее активное напоминание

  // Синхронизация с внешним значением
  useEffect(() => {
    if (defaultValue !== remainder) {
      setRemainder(defaultValue);
      // Сохраняем активное напоминание только если оно не "без напоминания"
      if (defaultValue !== -10) {
        setLastActiveReminder(defaultValue);
      }
    }
  }, [defaultValue]);

  // НОВАЯ ЛОГИКА: Автоматическое отключение при выполнении задачи
  useEffect(() => {
    if (isCompleted && remainder !== -10) {
      console.log("🏁 Задача выполнена, отключаем напоминания");

      // Сохраняем текущее напоминание перед отключением
      setLastActiveReminder(remainder);
      setRemainder(-10);

      // Уведомляем родительский компонент
      if (remaindeBefore && typeof remaindeBefore === "function") {
        remaindeBefore(-10);
      }

      // Уведомляем о автоматическом отключении
      if (onReminderDisabled && typeof onReminderDisabled === "function") {
        onReminderDisabled("task_completed", remainder);
      }
    }
  }, [isCompleted, remainder, remaindeBefore, onReminderDisabled]);

  // НОВАЯ ЛОГИКА: Восстановление напоминания при снятии "выполнено"
  useEffect(() => {
    if (!isCompleted && remainder === -10 && lastActiveReminder !== -10) {
      console.log("🔄 Задача снова активна, предлагаем восстановить напоминание");
      // Не восстанавливаем автоматически, но сохраняем возможность
    }
  }, [isCompleted, remainder, lastActiveReminder]);

  // Обработчик изменения значения
  const handleChange = (event) => {
    const newValue = event.target.value;

    // Если дата завершения не установлена и пользователь пытается установить напоминание
    if (!isFinishEnabled && newValue !== -10) {
      console.log("⚠️ Попытка установить напоминание без даты завершения");
      return;
    }

    // Если задача выполнена, не разрешаем включать напоминания
    if (isCompleted && newValue !== -10) {
      console.log("⚠️ Попытка установить напоминание для выполненной задачи");
      return;
    }

    // Сохраняем активное напоминание
    if (newValue !== -10) {
      setLastActiveReminder(newValue);
    }

    setRemainder(newValue);

    // Вызываем callback
    if (remaindeBefore && typeof remaindeBefore === "function") {
      remaindeBefore(newValue);
    }
  };

  // Получаем текст для выбранного значения
  const getSelectedLabel = () => {
    const option = reminderOptions.find((opt) => opt.value === remainder);
    return option ? option.label : "Неизвестное значение";
  };

  // Функция для получения человекочитаемого текста времени
  const getTimeText = (minutes) => {
    if (minutes < 60) {
      return minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут";
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return hours === 1 ? "час" : hours < 5 ? "часа" : "часов";
    } else if (minutes < 10080) {
      const days = Math.floor(minutes / 1440);
      return days === 1 ? "день" : days < 5 ? "дня" : "дней";
    } else {
      const weeks = Math.floor(minutes / 10080);
      return weeks === 1 ? "неделю" : "недель";
    }
  };

  // Функция восстановления напоминания
  const handleRestoreReminder = () => {
    if (lastActiveReminder !== -10 && !isCompleted && isFinishEnabled) {
      setRemainder(lastActiveReminder);
      if (remaindeBefore && typeof remaindeBefore === "function") {
        remaindeBefore(lastActiveReminder);
      }
    }
  };

  // Определяем причину блокировки
  const getDisableReason = () => {
    if (isCompleted) return "completed";
    if (!isFinishEnabled) return "no_finish_date";
    return null;
  };

  const disableReason = getDisableReason();
  const isDisabled = disableReason !== null;

  // Определяем лейбл в зависимости от причины блокировки
  const getInputLabel = () => {
    if (disableReason === "completed") return "Задача выполнена";
    if (disableReason === "no_finish_date") return "Сначала установите дату завершения";
    return "Установить напоминание";
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
      <FormControl fullWidth size="small" disabled={isDisabled}>
        <InputLabel id="remainder-label">{getInputLabel()}</InputLabel>
        <Select
          labelId="remainder-label"
          id="remainder-select"
          value={remainder}
          label={getInputLabel()}
          onChange={handleChange}
          sx={{
            marginBottom: "10px",
            height: "38px",
            fontSize: "14px",
            opacity: isDisabled ? 0.6 : 1,
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
        {disableReason === "completed"
          ? "Напоминания отключены для выполненных задач."
          : disableReason === "no_finish_date"
          ? "Для установки напоминания необходимо сначала указать дату завершения задачи."
          : remainder === -10
          ? "Напоминания отключены для этой карточки."
          : "Участники и подписчики этой карточки получат напоминания."}
      </Typography>

      {/* Кнопка восстановления напоминания */}
      {disableReason === "completed" && lastActiveReminder !== -10 && (
        <Box
          sx={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#fff3e0",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#e65100",
            border: "1px solid #ffcc02",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            ℹ️ Последнее напоминание было установлено "За {lastActiveReminder}{" "}
            {getTimeText(lastActiveReminder)}"
          </div>
          <button
            onClick={handleRestoreReminder}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={isCompleted || !isFinishEnabled}
          >
            Восстановить напоминание
          </button>
        </Box>
      )}

      {/* Дополнительная информация о выбранном напоминании */}
      {!isDisabled && remainder !== -10 && (
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
              Напоминание будет отправлено за {remainder} {getTimeText(remainder)} до срока
              завершения.
            </div>
          )}
          {remainder === 0 && (
            <div style={{ marginTop: "4px" }}>
              Напоминание будет отправлено точно в момент наступления срока завершения.
            </div>
          )}
        </Box>
      )}

      {/* Предупреждение при отключенном состоянии */}
      {disableReason === "no_finish_date" && (
        <Box
          sx={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#fff3e0",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#e65100",
            border: "1px solid #ffcc02",
          }}
        >
          ⚠️ Установите дату завершения задачи, чтобы включить напоминания
        </Box>
      )}

      {/* Информация о автоматическом отключении */}
      {disableReason === "completed" && (
        <Box
          sx={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#e8f5e8",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#2e7d32",
            border: "1px solid #c8e6c9",
          }}
        >
          ✅ Напоминания автоматически отключены при выполнении задачи
        </Box>
      )}
    </Box>
  );
}
