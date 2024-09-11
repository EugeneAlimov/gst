import React, { useState } from "react";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { List, ListItem } from "@mui/material";

// import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { useGetChecklistQuery } from "../../../Redux/checklist/checklist-operations";

export default function CardCheckListIcon({ cardId, boxStyle, iconStyle, typographyStyle }) {
  const { data: checklistData } = useGetChecklistQuery(cardId);

  const getChecked = () => {
    let checked = 0;
    let total = 0;
    if (checklistData) {
      total = checklistData.length;
      checklistData.forEach((element) => {
        if (element.is_checked) {
          checked += 1;
        }
      });
    }

    return { total, checked };
  };

  return (
    <Tooltip
      title={
        !!checklistData && (
          <List>
            {checklistData.map((checklist) => {
              const { id, text, is_checked } = checklist;
              return (
                is_checked && (
                  <ListItem key={id} sx={{ paddingY: "0px" }}>
                    <Typography variant="caption" color="#fff" sx={{ fontSize: "14px" }}>
                      {"- "}
                      {text}
                    </Typography>
                  </ListItem>
                )
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
            <CheckBoxOutlinedIcon sx={iconStyle} />
          </Icon>
        </Typography>
        <Typography variant="caption" color="#172b4d" sx={typographyStyle}>
          {getChecked().checked}/{getChecked().total}
        </Typography>
      </Box>
    </Tooltip>
  );
}
