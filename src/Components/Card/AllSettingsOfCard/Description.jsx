import React from "react";

//import MUI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//import application components
import TextEditor from "../../UI/TextEditor";

export default function Description() {
  return (
    <Box
      sx={{
        marginBottom: "15px",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        padding: "5px",
      }}
    >
      <Typography
        sx={{
          cursor: "default",
          fontSize: "20px",
          color: "#172b4d",
          width: "100%",
          padding: "3px",
          marginTop: "15px",
        }}
      >
        Описание карточки
      </Typography>
      <TextEditor />
    </Box>
  );
}
