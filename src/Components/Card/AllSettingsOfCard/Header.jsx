import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

import * as Style from "./styleConst";

import { TextareaCardName } from "./styleConst";


export default function Header() {
    const [textAreaText, setTextAreaText] = useState("");

  return (
    <>
      <Typography sx={Style.typographyCardName}>Название карточки</Typography>
      <Icon sx={Style.icon}>
        <ArticleOutlinedIcon />
      </Icon>
      <TextareaCardName
        disabled={false}
        aria-label="empty textarea"
        placeholder="Здесь нужно указать имя карточки"
        value={textAreaText}
        onChange={(event) => {
          setTextAreaText(event.target.value);
        }}
      />
      <Typography sx={Style.typographyOnTheColumn}>
        В колонке:{" "}
        <Link href="#" sx={Style.linkOnTheColumn}>
          В работе
        </Link>
      </Typography>
    </>
  );
}
