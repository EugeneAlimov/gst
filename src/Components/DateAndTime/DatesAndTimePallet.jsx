/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";

import { useDispatch } from "react-redux";
import { popUpToOpen } from "../../Redux/chip/chip-slice";

import { sub, formatISO, differenceInMinutes } from "date-fns";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import Dates from "./Calendar";
import Period from "./Period";
import Remainder from "./Reminder";
import DateAndTimeButtonsGroup from "./DateAndTimeButtonsGroup";
import {
  useGetOneCardQuery,
  useUpdateCardDetailMutation,
} from "../../Redux/cards/cards-operations";

const defaultValue = new Date();

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  aligneItems: "center",
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

export default function DatesAndTimePallet({ cardId }) {
  const [cardTimeUpdate] = useUpdateCardDetailMutation();

  const { data: periodData } = useGetOneCardQuery(cardId);
  const { date_time_start, date_time_finish, date_time_reminder } = periodData;

  const [startDayValue, setStartDayValue] = useState(defaultValue);
  const [completitionDayValue, setCompletitiontDayValue] = useState(defaultValue);
  const [completitionTimeValue, setCompletitiontTimeValue] = useState(defaultValue);
  const [startDayChecked, setStartDayChecked] = useState(false);
  const [completitionDayChecked, setCompletitionDayChecked] = useState(false);
  const [calendarValue, setCalendarValue] = useState();
  const [bufferCalendarValue, setBufferCalendarValue] = useState([defaultValue, defaultValue]);

  const [selectValue, setSelectValue] = useState(-10);
  const [reminder, setReminder] = useState();

  // первый рендеринг компонента
  useEffect(() => {
    const compareValue = JSON.stringify(new Date("1970-01-01T00:00:00.000Z"));
    const startDayDefaultCheck = JSON.stringify(new Date(date_time_start));
    const completitionDefaultCheck = JSON.stringify(new Date(date_time_finish));

    const startDayDefault =
      startDayDefaultCheck === compareValue
        ?
      defaultValue
        :
      new Date(date_time_start);
    const completitionDefault =
      completitionDefaultCheck === compareValue
        ?
      defaultValue
        :
      new Date(date_time_finish);
    const reminderDefault = new Date(date_time_reminder);

    setStartDayValue(startDayDefault);
    setCompletitiontDayValue(completitionDefault);
    setCompletitiontTimeValue(completitionDefault);
    setReminder(reminderDefault);

    const isStartDate = JSON.stringify(startDayDefault) === compareValue;
    const isCompletition = JSON.stringify(completitionDefault) === compareValue;
    const isRemind = JSON.stringify(reminderDefault) === compareValue;

    let calendarDefault = [startDayValue, completitionDayValue];

    if (!isStartDate && isCompletition) calendarDefault = startDayDefault;
    if (!isCompletition && isStartDate) calendarDefault = completitionDefault;
    if (!isStartDate && !isCompletition) calendarDefault = [startDayDefault, completitionDefault];

    setBufferCalendarValue(calendarDefault);

    let startDayCheckedTmp = false;
    if (!isStartDate) startDayCheckedTmp = true;
    setStartDayChecked(startDayCheckedTmp);

    let completitionDayCheckedTmp = false;
    if (!isCompletition) completitionDayCheckedTmp = true;
    setCompletitionDayChecked(completitionDayCheckedTmp);

    if (!isRemind) {
      let difference = differenceInMinutes(completitionDefault, reminderDefault);

      if (isCompletition || isRemind) {
        difference = -10;
      }
      setSelectValue(difference);
    }
  }, [periodData]);

  const dispatch = useDispatch();

  // обновлене календаря (когда меняются статусы checkbox старт и конец - значения берутся из буфера)
  useEffect(() => {
    if (bufferCalendarValue === undefined) return;
    const start = bufferCalendarValue[0];
    const end = bufferCalendarValue[1];

    const startOnly = startDayChecked && !completitionDayChecked;
    const endOnly = !startDayChecked && completitionDayChecked;
    const startANDend = startDayChecked && completitionDayChecked;

    if (startANDend) {
      setCalendarValue([start, end]);
    }
    if (startOnly) {
      setCalendarValue(start);
    }
    if (endOnly) {
      setCalendarValue(end);
    }
  }, [bufferCalendarValue, completitionDayChecked, startDayChecked]);

  // обновление буфера календаря (когда меняются значения в полях даты и времени старт и конец)
  const getDayHandler = (calendarValue) => {
    const startOnly = startDayChecked && !completitionDayChecked;
    const endOnly = !startDayChecked && completitionDayChecked;
    const startANDend = startDayChecked && completitionDayChecked;

    const newCaleddarBuffer = bufferCalendarValue.map((item, index) => {
      let newItem = item;
      if (startANDend) {
        newItem = calendarValue[index];
      }
      if (startOnly & (index === 0)) {
        newItem = calendarValue;
      }
      if (endOnly & (index === 1)) {
        newItem = calendarValue;
      }

      return newItem;
    });
    setBufferCalendarValue(newCaleddarBuffer);
    setStartDayValue(newCaleddarBuffer[0]);
    setCompletitiontDayValue(newCaleddarBuffer[1]);
  };

  const getStartDayHandler = (startDayValue) => {
    const newCaleddarBuffer = bufferCalendarValue.map((item, index) => {
      let newItem = item;
      if (index === 0) {
        newItem = startDayValue;
      }
      return newItem;
    });
    setBufferCalendarValue(newCaleddarBuffer);
    setStartDayValue(startDayValue);
  };

  const getCompletitionDayHandler = (completitionDayValue) => {
    const newCaleddarBuffer = bufferCalendarValue.map((item, index) => {
      let newItem = item;
      if (index === 1) {
        newItem = completitionDayValue;
      }
      return newItem;
    });
    setBufferCalendarValue(newCaleddarBuffer);
    setCompletitiontDayValue(completitionDayValue);
  };

  const getCompletitionTimeHandler = (completitionTimeValue) => {
    const newCaleddarBuffer = bufferCalendarValue.map((item, index) => {
      let newItem = item;
      if (index === 1) {
        newItem = completitionTimeValue;
      }
      return newItem;
    });
    setBufferCalendarValue(newCaleddarBuffer);

    setCompletitiontTimeValue(completitionTimeValue);
  };

  const getstartDayCheckedHandler = (startDayChecked) => {
    setStartDayChecked(startDayChecked);
  };

  const getcompletitionDayCheckedHandler = (completitionDayChecked) => {
    setCompletitionDayChecked(completitionDayChecked);
  };

  const saveChanges = async () => {
    const day = formatISO(new Date(completitionDayValue), { representation: "date" });
    const time = formatISO(new Date(completitionTimeValue), { representation: "time" });
    const dateTime = `${day}T${time}`;

    const cardObj = {
      date_time_reminder: "1970-01-01T00:00:00.000Z",
      date_time_finish: "1970-01-01T00:00:00.000Z",
      date_time_start: "1970-01-01T00:00:00.000Z",
    };

    startDayChecked
      ? (cardObj.date_time_reminder = reminder)
      : (cardObj.date_time_reminder = "1970-01-01T00:00:00.000Z");
    completitionDayChecked
      ? (cardObj.date_time_finish = dateTime)
      : (cardObj.date_time_finish = "1970-01-01T00:00:00.000Z");
    startDayChecked
      ? (cardObj.date_time_start = startDayValue)
      : (cardObj.date_time_start = "1970-01-01T00:00:00.000Z");
    try {
      await cardTimeUpdate({ cardId, cardObj });
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async () => {
    const periodObj = {
      date_time_reminder: "1970-01-01T00:00:00.000Z",
      date_time_finish: "1970-01-01T00:00:00.000Z",
      date_time_start: "1970-01-01T00:00:00.000Z",
    };
    try {
      await cardTimeUpdate({ cardId, periodObj });
    } catch (error) {
      console.log(error);
    }
  };

  const remaindeBefore = useCallback(
    (value) => {
      const day = formatISO(new Date(completitionDayValue), { representation: "date" });
      const time = formatISO(new Date(completitionTimeValue), { representation: "time" });
      const dateTime = `${day}T${time}`;
      const remind =
        value === -10 ? "1970-01-01T00:00:00.000Z" : sub(new Date(dateTime), { minutes: value });

      setReminder(remind);
    },
    [completitionDayValue, completitionTimeValue]
  );

  return (
    <Card sx={cardStyle}>
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
            aria-label="Change-Chips-Pallet"
            sx={iconButtonStyle}
          >
            <CloseOutlinedIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        }
      />
      <Dates
        getDayHandler={getDayHandler}
        calendarValue={calendarValue}
        startDayChecked={startDayChecked}
        completitionDayChecked={completitionDayChecked}
      />
      <Period
        startDayValue={startDayValue}
        completitionDayValue={completitionDayValue}
        completitionTimeValue={completitionTimeValue}
        getStartDayHandler={getStartDayHandler}
        getCompletitionDayHandler={getCompletitionDayHandler}
        getCompletitionTimeHandler={getCompletitionTimeHandler}
        getstartDayCheckedHandler={getstartDayCheckedHandler}
        getcompletitionDayCheckedHandler={getcompletitionDayCheckedHandler}
        startDayChecked={startDayChecked}
        completitionDayChecked={completitionDayChecked}
        defaultValue={defaultValue}
      />
      <Remainder defaultValue={selectValue} remaindeBefore={remaindeBefore} />
      <DateAndTimeButtonsGroup
        startDayChecked={startDayChecked}
        completitionDayChecked={completitionDayChecked}
        saveChanges={saveChanges}
        remove={remove}
      />
    </Card>
  );
}
