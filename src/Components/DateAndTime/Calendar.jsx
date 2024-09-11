import React from "react";
import "./Calendar.css";
import Calendar from "react-calendar";

import Box from "@mui/material/Box";

export default function Dates({
  getDayHandler,
  calendarValue,
  startDayChecked,
  completitionDayChecked,
}) {
  return (
    <Box
      sx={{
        marginBottom: "45px",
      }}
    >
      <Calendar
        selectRange={startDayChecked && completitionDayChecked}
        onChange={(calendarValue) => getDayHandler(calendarValue)}
        value={calendarValue}
      />
    </Box>
  );
}
