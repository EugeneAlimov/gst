import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

export default function DateAndTimeButtonsGroup({
  startDayChecked,
  completitionDayChecked,
  saveChanges,
  remove,
  disabled = false,
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
        Сохранить изменения
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
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          width: "100%",
          textAlign: "center",
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

        {disabled && (
          <Box sx={{ fontSize: "11px", color: "#d32f2f", marginTop: "4px" }}>
            ⚠️ Исправьте ошибки валидации
          </Box>
        )}
      </Box>
    </Box>
  );
}
