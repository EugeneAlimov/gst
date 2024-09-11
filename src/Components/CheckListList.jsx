import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

export default function CheckListList({checkListArr}) {
  
  const [checked, setChecked] = useState([0]);
  
  const handleToggle = (CheckboxID) => () => {
    const currentIndex = checked.indexOf(CheckboxID);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(CheckboxID);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List>
      {checkListArr.map((CheckboxID) => {
        const LabelID = `checkbox-list-label-${CheckboxID}`;

        return (
          <ListItem key={LabelID}>
            <Checkbox
              checked={checked.indexOf(LabelID) !== -1}
              onChange={handleToggle(LabelID)}
              inputProps={{ "aria-labelledby": LabelID }}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
