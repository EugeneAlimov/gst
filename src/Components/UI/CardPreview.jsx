import React from "react";
import Card from "@mui/material/Card";

const CardPreview = ({
  CardImage,
  CardContent,
  CardChipContainer,
  CardDescription,
  CardStatistic,
  CardAvatarSection,
  chipsArr,
  cardText,
  id,
  is_subscribed,
  in_process,
  comments_how_many,
  checklist_how_many,
  is_have_description,
  date_time_finish,
  date_time_start,
  status,
  style,
}) => {
  return (
    <Card sx={{ ...style.cardStyle }}>
      <CardImage />
      <CardContent sx={style.CardContentStyle}>
        <CardChipContainer chips={chipsArr} cardId={id} />
        <CardDescription cardText={cardText} />
        <CardStatistic
          cardId={id}
          is_subscribed={is_subscribed}
          in_process={in_process}
          comments_how_many={comments_how_many}
          checklist_how_many={checklist_how_many}
          is_have_description={is_have_description}
          date_time_finish={date_time_finish}
          date_time_start={date_time_start}
          status={status}
        />
        <CardAvatarSection />
      </CardContent>
    </Card>
  );
};

export default CardPreview;
