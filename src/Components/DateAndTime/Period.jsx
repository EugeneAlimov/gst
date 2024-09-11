import React from "react";
import "./Period.css";
import Box from "@mui/material/Box";

import { DateField } from "@mui/x-date-pickers/DateField";
import { TimeField } from "@mui/x-date-pickers/TimeField/";

import Checkbox from "@mui/material/Checkbox";

export default function Period({
  startDayValue,
  completitionDayValue,
  completitionTimeValue,
  getStartDayHandler,
  getCompletitionDayHandler,
  getCompletitionTimeHandler,
  getstartDayCheckedHandler,
  getcompletitionDayCheckedHandler,
  startDayChecked,
  completitionDayChecked,
  defaultValue,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "25px",
        }}
      >
        <Checkbox
          checked={startDayChecked}
          onChange={(event) => getstartDayCheckedHandler(event.target.checked)}
        />
        <DateField
          control={"control"}
          label="Начало"
          size="small"
          disabled={!startDayChecked}
          format="d:M:yyyy"
          timezone="UTC"
          defaultValue={defaultValue}
          value={startDayValue}
          onChange={(startDayValue) => getStartDayHandler(startDayValue)}

          id={"task-start-day"}
          sx={{
            width: "115px",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "30px",
        }}
      >
        <Checkbox
          checked={completitionDayChecked}
          onChange={(event) => getcompletitionDayCheckedHandler(event.target.checked)}
        />
        <DateField
          control={"control"}
          label="Завершение"
          size="small"
          disabled={!completitionDayChecked}
          format="dd:MM:yyyy"
          timezone="UTC"
          defaultValue={defaultValue}
          value={completitionDayValue}
          onChange={(completitionDayValue) => getCompletitionDayHandler(completitionDayValue)}
          id={"task-completition-day"}
          sx={{
            width: "115px",
            marginRight: "20px",
          }}
        />
        <TimeField
          label="Время"
          size="small"
          disabled={!completitionDayChecked}
          ampm={false}
          defaultValue={defaultValue}
          value={completitionTimeValue}
          onChange={(completitionTimeValue) => getCompletitionTimeHandler(completitionTimeValue)}
          id={"task-completition-time"}
          sx={{
            width: "80px",
          }}
        />
      </Box>
    </Box>
  );
}
