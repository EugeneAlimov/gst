import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function DateAndTimeButtonsGroup({
  startDayChecked,
  completitionDayChecked,
  saveChanges,
  remove,
}) {
  const disabledBtns = !startDayChecked && !completitionDayChecked;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: "100%",
          height: "32px",
          fontSize: "14px",
          marginBottom: "10px",
        }}
        disabled={disabledBtns}
        onClick={saveChanges}
      >
        Сохранить
      </Button>
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
        }}
        disabled={disabledBtns}
        onClick={remove}
      >
        Удалить
      </Button>
    </Box>
  );
}
