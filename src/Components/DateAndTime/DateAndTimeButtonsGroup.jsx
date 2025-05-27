import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

export default function DateAndTimeButtonsGroup({
  startDayChecked,
  completitionDayChecked,
  saveChanges,
  remove,
  disabled = false,
  validationErrors = [], // Детальные ошибки от клиента
}) {
  // Логика определения состояния кнопок
  const noDateSelected = !startDayChecked && !completitionDayChecked;
  const saveDisabled = noDateSelected || disabled;
  const removeDisabled = noDateSelected;

  // Компонент кнопки с тултипом для отключенного состояния
  const ButtonWithTooltip = ({ children, disabled, tooltipText, ...props }) => {
    if (disabled && tooltipText) {
      return (
        <Tooltip title={tooltipText} placement="top">
          <span style={{ width: "100%" }}>
            <Button {...props} disabled fullWidth>
              {children}
            </Button>
          </span>
        </Tooltip>
      );
    }

    return (
      <Button {...props} disabled={disabled} fullWidth>
        {children}
      </Button>
    );
  };

  // Определяем тексты для тултипов
  const getSaveTooltip = () => {
    if (noDateSelected) {
      return "Выберите хотя бы одну дату для сохранения";
    }
    if (disabled) {
      // Если есть конкретные ошибки валидации, показываем их
      if (validationErrors.length > 0) {
        return validationErrors.join("; ");
      }
      return "Исправьте ошибки валидации перед сохранением";
    }
    return "";
  };

  const getRemoveTooltip = () => {
    if (noDateSelected) {
      return "Нет дат для удаления";
    }
    return "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: 1,
      }}
    >
      {/* Кнопка сохранения */}
      <ButtonWithTooltip
        variant="contained"
        color="primary"
        sx={{
          height: "40px",
          fontSize: "14px",
          fontWeight: "500",
        }}
        disabled={saveDisabled}
        onClick={saveChanges}
        tooltipText={getSaveTooltip()}
      >
        Сохранить изменения (UTC)
      </ButtonWithTooltip>

      {/* Кнопка удаления */}
      <ButtonWithTooltip
        variant="outlined"
        color="error"
        sx={{
          height: "36px",
          fontSize: "14px",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(211, 47, 47, 0.04)",
          },
          "&:disabled": {
            backgroundColor: "transparent",
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "rgba(0, 0, 0, 0.26)",
          },
        }}
        disabled={removeDisabled}
        onClick={remove}
        tooltipText={getRemoveTooltip()}
      >
        Удалить даты
      </ButtonWithTooltip>

      {/* Информационный блок */}
      <Box
        sx={{
          marginTop: "8px",
          padding: "8px",
          backgroundColor: disabled ? "#ffebee" : "#f5f5f5",
          borderRadius: "4px",
          width: "100%",
          textAlign: "center",
          border: disabled ? "1px solid #ffcdd2" : "none",
        }}
      >
        <Box sx={{ fontSize: "12px", color: "#666", lineHeight: 1.4 }}>
          {noDateSelected && <span>📅 Выберите дату начала и/или завершения</span>}

          {startDayChecked && !completitionDayChecked && (
            <span>📅 Установлена только дата начала</span>
          )}

          {!startDayChecked && completitionDayChecked && (
            <span>📅 Установлена только дата завершения</span>
          )}

          {startDayChecked && completitionDayChecked && (
            <span>📅 Установлен период от начала до завершения</span>
          )}
        </Box>

        {/* Детальные ошибки валидации */}
        {disabled && validationErrors.length > 0 && (
          <Box sx={{ marginTop: "8px" }}>
            {validationErrors.map((error, index) => (
              <Box
                key={index}
                sx={{
                  fontSize: "11px",
                  color: "#d32f2f",
                  marginTop: index > 0 ? "4px" : "0",
                  lineHeight: 1.3,
                }}
              >
                ⚠️ {error}
              </Box>
            ))}
          </Box>
        )}

        {/* Общее сообщение об ошибках */}
        {disabled && validationErrors.length === 0 && (
          <Box sx={{ fontSize: "11px", color: "#d32f2f", marginTop: "4px" }}>
            ⚠️ Исправьте ошибки валидации
          </Box>
        )}
      </Box>

      {/* UTC информация */}
      <Box
        sx={{
          marginTop: "4px",
          padding: "6px",
          backgroundColor: "#e8f5e8",
          borderRadius: "4px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #c8e6c9",
        }}
      >
        <Box sx={{ fontSize: "11px", color: "#2e7d32", lineHeight: 1.3 }}>
          🌍 Время сохраняется в UTC. Сервер автоматически рассчитает напоминания.
        </Box>
      </Box>

      {/* Подсказка для серверной валидации */}
      {!disabled && (startDayChecked || completitionDayChecked) && (
        <Box
          sx={{
            marginTop: "4px",
            padding: "6px",
            backgroundColor: "#e3f2fd",
            borderRadius: "4px",
            width: "100%",
            textAlign: "center",
            border: "1px solid #bbdefb",
          }}
        >
          <Box sx={{ fontSize: "11px", color: "#1565c0", lineHeight: 1.3 }}>
            💡 Валидация времени напоминаний происходит на сервере с учетом UTC
          </Box>
        </Box>
      )}
    </Box>
  );
}
