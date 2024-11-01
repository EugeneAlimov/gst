import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";

const ColumnPreview = ({
  style,
  boardHeight,
  headerText,
  cards,
  columnId,
  TextareaColumnName,
  TaskCard,
}) => {
  return (
    <List
      className="scroll-container"
      sx={{ ...style.list, maxHeight: `${boardHeight - 90}px` }}
      subheader={
        <ListSubheader
          sx={{
            width: "100%",
            height: "40px",
            textAlign: "center",
          }}
          titletypographyprops={{
            fontSize: "20px",
            color: "#172b4d",
          }}
        >
          <TextareaColumnName
            disabled={false}
            aria-label="empty textarea"
            placeholder="Дайте имя колонке..."
            value={headerText}
          />
        </ListSubheader>
      }
    >
      {!!cards &&
        cards.map((card, index) => {
          const { id } = card;
          return (
            <ListItem key={id}>
              <TaskCard columnId={columnId} {...card} index={index} />
            </ListItem>
          );
        })}
    </List>
  );
};

export default ColumnPreview;
