import React from "react";
import Box from "@mui/material/Box";

import CardCommentsIcon from "./CardCommentsIcon";
import TaskTerminIcon from "./TaskTerminIcon";
import CardCheckListIcon from "./CardCheckListIcon";
import CardDescriptionIcon from "./CardDescriptionIcon";
import CardSubscribeIcon from "./CardSubscribeIcon";

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
  paddingBottom: "6px",
};

const boxStyle = {
  minWidth: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  aligneContent: "center",
  justifyContent: "space-between",
  marginRight: "6px",
  marginBottom: "6px",
};

const typographyStyle = {
  verticalAligne: "top",
  overflow: "visible",
  fontSize: "12px",
  fontWeight: "400",
  lineHeight: "1.4",
};

const iconStyle = {
  overflow: "visible",
  fontSize: "18px",
};

export default function CardStatistic({
  cardId,
  is_subscribed,
  in_process,
  comments_how_many,
  is_have_description,
  checklist_how_many,
  date_time_finish,
  date_time_start,
  status
}) {

  return (
    <Box sx={containerStyle}>
      {in_process && (
        <TaskTerminIcon
          status={status}
          date_time_finish={date_time_finish}
          date_time_start={date_time_start}
          boxStyle={boxStyle}
          iconStyle={iconStyle}
          typographyStyle={typographyStyle}
        />
      )}
      {is_subscribed && (
        <CardSubscribeIcon
          is_subscribed={is_subscribed}
          boxStyle={boxStyle}
          iconStyle={iconStyle}
        />
      )}
      {is_have_description > 0 && (
        <CardDescriptionIcon
          boxStyle={boxStyle}
          iconStyle={iconStyle}
          typographyStyle={typographyStyle}
        />
      )}
      {comments_how_many > 0 && (
        <CardCommentsIcon
          cardId={cardId}
          comments_how_many={comments_how_many}
          boxStyle={boxStyle}
          iconStyle={iconStyle}
          typographyStyle={typographyStyle}
        />
      )}
      {checklist_how_many > 0 && (
        <CardCheckListIcon
        cardId={cardId}
          boxStyle={boxStyle}
          iconStyle={iconStyle}
          typographyStyle={typographyStyle}
        />
      )}
    </Box>
  );
}
