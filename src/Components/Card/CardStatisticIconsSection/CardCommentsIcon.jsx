import React from "react";

import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { useGetCommentsQuery } from "../../../Redux/comments/comments-operations";
import { List, ListItem } from "@mui/material";

export default function CardCommentsIcon({
  boxStyle,
  iconStyle,
  typographyStyle,
  comments_how_many,
  cardId,
}) {
  const extTypographyStyle = { ...typographyStyle };
  const { data: commentData } = useGetCommentsQuery(cardId);

  return (
    <Tooltip
      title={
        !!commentData && (
          <List>
            {commentData.map((comment) => {
              const { id, text } = comment;
              return (
                <ListItem key={id} sx={{ paddingY: "0px" }}>
                  <Typography variant="caption" color="#fff" sx={{ fontSize: "14px" }}>
                    {"- "}
                    {text}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        )
      }
      placement="bottom"
    >
      <Box sx={boxStyle}>
        <Typography variant="caption" sx={{ lineHeight: "1.3" }}>
          <Icon>
            <TextsmsOutlinedIcon sx={iconStyle} />
          </Icon>
        </Typography>
        <Typography variant="caption" color="#172b4d" sx={extTypographyStyle}>
          {!!commentData ? commentData.length : 0}
        </Typography>
      </Box>
    </Tooltip>
  );
}
