import React from "react";
import { TextareaCardDescription } from "../AllSettingsOfCard/styleConst";
import { Box } from "@mui/material";

export default function CardDescription({cardText}) {
  return (
    <Box>
      <TextareaCardDescription
        aria-label="empty textarea"
        placeholder="Задайте текст карточке..."
        value={cardText}
      />
    </Box>
  );
}
