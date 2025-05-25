import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

export default function DateAndTimeButtonsGroup({
  startDayChecked,
  completitionDayChecked,
  saveChanges,
  remove,
  disabled = false, // ✅ Новый проп для валидации
}) {
  const disabledBtns = !startDayChecked && !completitionDayChecked;
  const saveDisabled = disabledBtns || disabled;

  const SaveButton = ({ children, ...props }) => {
    if (disabled) {
      return (
        <Tooltip title="Исправьте ошибки валидации перед сохранением">
          <span>
            <Button {...props} disabled>
              {children}
            </Button>
          </span>
        </Tooltip>
      );
    }

    return <Button {...props}>{children}</Button>;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <SaveButton
        variant="contained"
        color="primary"
        sx={{
          width: "100%",
          height: "32px",
          fontSize: "14px",
          marginBottom: "10px",
        }}
        disabled={saveDisabled}
        onClick={saveChanges}
      >
        Сохранить
      </SaveButton>

      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{
          width: "100%",
          height: "32px",
          fontSize: "14px",
          marginBottom: "10px",
          backgroundColor: "#d7d7d7",
          color: "black",
          "&:hover": {
            backgroundColor: "#e3e3e3",
          },
          "&:disabled": {
            backgroundColor: "#f5f5f5",
            color: "#999",
          },
        }}
        disabled={disabledBtns}
        onClick={remove}
      >
        Удалить
      </Button>
    </Box>
  );
}
