import React, { useState, useRef, useEffect } from "react";
// import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { TextareaCardDescription } from "../AllSettingsOfCard/styleConst";
import { Box } from "@mui/material";

// const preventDefault = (event) => event.preventDefault();

export default function CardDescription({ cardText, handleBlur, isEditable }) {
  const inputRef = useRef(null);
  const [textAreaText, setTextAreaText] = useState(cardText);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        isEditable && inputRef.current.focus(); // Устанавливаем фокус на текстовое поле
      }
    }, 0); // Задержка в 0 мс, чтобы блок успел удалиться
  }, [isEditable]);

  return (
    <Box>
      <TextareaCardDescription
        ref={inputRef}
        onBlur={handleBlur} // Блокируем текстовое поле при потере фокуса
        aria-label="empty textarea"
        placeholder="Дайте имя колонке..."
        value={textAreaText}
        onChange={(event) => {
          setTextAreaText(event.target.value);
        }}
      />
    </Box>
  );
}
