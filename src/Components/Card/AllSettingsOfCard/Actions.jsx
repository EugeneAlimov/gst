import React, { useState, useEffect } from "react";

//import MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";

//import application components
import TaskTerminIcon from "../CardStatisticIconsSection/TaskTerminIcon";

//import styles
import * as Style from "./styleConst";

// RTK Query для обновления карточки
import { useUpdateCardDetailMutation } from "../../../Redux/cards/cards-operations";

export default function Actions({
  date_time_finish,
  date_time_start,
  status,
  cardId, // НОВЫЙ: Нужен для сохранения изменений
  is_completed = false, // НОВЫЙ: Текущий статус выполнения
  reminder_offset_minutes, // НОВЫЙ: Текущее напоминание
}) {
  const [complited, setComplited] = useState(is_completed);
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // RTK Query мутация для обновления карточки
  const [updateCard] = useUpdateCardDetailMutation();

  // Синхронизация с пропсами
  useEffect(() => {
    setComplited(is_completed);
  }, [is_completed]);

  const handleComplitedChange = async (event) => {
    const newCompletedState = event.target.checked;

    if (!cardId) {
      console.error("❌ Нет cardId для сохранения изменений");
      return;
    }

    setIsLoading(true);

    try {
      // Подготавливаем данные для сохранения
      const updateData = {
        is_completed: newCompletedState,
      };

      // НОВАЯ ЛОГИКА: Автоматически отключаем напоминания при выполнении
      if (newCompletedState && reminder_offset_minutes && reminder_offset_minutes !== -10) {
        updateData.reminder_offset_minutes = null; // Отключаем напоминания
        console.log("🔕 Автоматически отключаем напоминания при выполнении задачи");
      }

      // Сохраняем изменения
      console.log("💾 Сохраняем статус выполнения:", updateData);
      const result = await updateCard({ id: cardId, ...updateData }).unwrap();

      console.log("✅ Статус выполнения обновлен:", result);
      setComplited(newCompletedState);

      // Показываем уведомление пользователю
      if (newCompletedState) {
        console.log("🎉 Задача отмечена как выполненная");
        if (reminder_offset_minutes && reminder_offset_minutes !== -10) {
          console.log("🔔 Напоминания автоматически отключены");
        }
      } else {
        console.log("🔄 Задача снова активна");
      }
    } catch (error) {
      console.error("❌ Ошибка при обновлении статуса выполнения:", error);

      // Откатываем изменения в UI
      setComplited(!newCompletedState);

      // Показываем ошибку пользователю
      const errorMessage = error.data?.detail || error.message || "Неизвестная ошибка";
      alert(`❌ Не удалось обновить статус: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribeChange = (event) => {
    setSubscribed(event.target.checked);
  };

  return (
    <Box sx={Style.cardActionsMainContainer}>
      <Typography sx={Style.text}>Действия с карточкой:</Typography>

      <Box sx={Style.cardActionsContainer}>
        <Box sx={Style.cardSubscrContainer}>
          <FormControlLabel
            sx={{ marginX: "0px", width: "284px", justifyContent: "space-between" }}
            value="top"
            control={
              <Switch
                checked={subscribed}
                onChange={handleSubscribeChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={
              <Typography sx={{ cursor: "pointer", fontSize: "14px", color: "#172b4d" }}>
                Подписаться на уведомления
              </Typography>
            }
            labelPlacement="start"
          />
        </Box>

        <Box sx={Style.cardSubscrContainer}>
          <Typography
            sx={{
              cursor: "default",
              fontSize: "14px",
              color: "#172b4d",
              marginRight: "10px",
            }}
          >
            Статус задания:
          </Typography>
          <TaskTerminIcon
            status={status}
            date_time_finish={date_time_finish}
            date_time_start={date_time_start}
            boxStyle={Style.boxStyle}
            iconStyle={Style.iconStyle}
            typographyStyle={Style.typographyStyle}
          />
        </Box>
      </Box>

      <Divider orientation="horizontal" variant="middle" sx={{ marginBottom: "15px" }} />

      <Box sx={Style.cardComplContainer}>
        <FormControlLabel
          sx={{ marginX: "0px", width: "284px", justifyContent: "space-between" }}
          value="top"
          control={
            <Checkbox
              checked={complited}
              onChange={handleComplitedChange}
              disabled={isLoading}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: "14px",
                color: complited ? "#2e7d32" : "#172b4d",
                fontWeight: complited ? "500" : "400",
                marginRight: "10px",
              }}
            >
              {isLoading ? "Сохранение..." : "Поставить отметку о выполнении"}
            </Typography>
          }
          labelPlacement="start"
        />

        {/* Статус выполнения */}
        {complited && (
          <Typography
            sx={{
              cursor: "default",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#4caf50",
              paddingX: "8px",
              paddingY: "2px",
              borderRadius: "4px",
              fontWeight: "500",
            }}
          >
            ✅ Выполнено
          </Typography>
        )}

        {/* Показываем статус с опозданием только если не выполнено */}
        {!complited && status === 3 && (
          <Typography
            sx={{
              cursor: "default",
              fontSize: "14px",
              color: "#172b4d",
              backgroundColor: "#ffd5d2",
              paddingX: "5px",
              borderRadius: "4px",
            }}
          >
            Выполнено с опозданием
          </Typography>
        )}
      </Box>

      {/* Информация об автоматическом отключении напоминаний */}
      {complited && reminder_offset_minutes && reminder_offset_minutes !== -10 && (
        <Box
          sx={{
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "#e8f5e8",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#2e7d32",
            border: "1px solid #c8e6c9",
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            🔔 Напоминания автоматически отключены при выполнении задачи
          </div>
          <div style={{ fontSize: "11px", color: "#1b5e20" }}>
            Для повторного включения снимите отметку о выполнении и настройте напоминания в
            календаре
          </div>
        </Box>
      )}

      {/* Предупреждение при снятии отметки выполнения */}
      {!complited && reminder_offset_minutes === null && (
        <Box
          sx={{
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "#fff3e0",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#e65100",
            border: "1px solid #ffcc02",
          }}
        >
          💡 Напоминания отключены. Настройте их в календаре, если нужно
        </Box>
      )}
    </Box>
  );
}
