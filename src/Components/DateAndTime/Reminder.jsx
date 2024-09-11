import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

const typographyStyle = {
  verticalAligne: "top",
  overflow: "visible",
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "1.4",
  clolr: "#172b4d",
};

export default function Remainder({ defaultValue, remaindeBefore }) {
  const [remainder, setRemainder] = useState(defaultValue);

  const handleChange = (event) => {
    setRemainder(event.target.value);
  };

  useEffect(() => {
    remaindeBefore(remainder);
  }, [remaindeBefore, remainder]);

  useEffect(() => {
    setRemainder(defaultValue);
  }, [defaultValue]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: "15px",
      }}
    >
      <InputLabel id="remainder-label">Установить напоминание</InputLabel>
      <Select
        labelId="remainder-label"
        id="remainder-select"
        value={remainder}
        label="Установить напоминание"
        onChange={handleChange}
        sx={{
          marginBottom: "10px",
          height: "38px",
          fontSize: "14px",
        }}
      >
        <MenuItem value={-10}>Без напоминания</MenuItem>
        <MenuItem value={0}>Когда настанет дата завершения</MenuItem>
        <MenuItem value={5}>За 5 минут</MenuItem>
        <MenuItem value={10}>За 10 минут</MenuItem>
        <MenuItem value={15}>За 15 минут</MenuItem>
        <MenuItem value={60}>За 1 час</MenuItem>
        <MenuItem value={120}>За 2 часа</MenuItem>
        <MenuItem value={1440}>За 1 день</MenuItem>
        <MenuItem value={2880}>За 2 дня</MenuItem>
      </Select>
      <Typography sx={typographyStyle}>
        Участники и подписчики этой карточки получат напомининия.
      </Typography>
    </Box>
  );
}
