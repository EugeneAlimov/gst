import * as React from "react";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";

export default function EmptyTextarea({ value, handler }) {
  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    () => `
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    padding: 0px 6px;
    border-radius: 4px;
    color: #172b4d;
    background-color: #f5f5f5;
    
    border: 0px;
    resize: none;
    &:hover {
      border-color: #3399FF;
    }
    &:focus {
        background: #fff;
      outline: 0;
      border-color: #3399FF;
      box-shadow: 0 0 0 3px #b6daff;
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  return (
    <Textarea
    sx={{
      textDecoration:"line-through"
    }}
      defaultValue={value}
      disabled={false}
      aria-label="empty textarea"
      placeholder="Имя карточки"
      // value={value}
      // onChange={(event) => {
        // handler(event.target.value);
      // }}
    />
  );
}
