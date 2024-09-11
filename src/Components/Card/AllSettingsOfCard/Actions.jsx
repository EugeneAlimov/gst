import React, { useState } from "react";

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

export default function Actions({ date_time_finish, date_time_start, status }) {
  const [complited, setComplited] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleComplitedChange = (event) => {
    setComplited(event.target.checked);
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
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: "14px",
                color: "#172b4d",
                marginRight: "10px",
              }}
            >
              Поставить отметку о выполнении
            </Typography>
          }
          labelPlacement="start"
        />
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
      </Box>
    </Box>
  );
}
