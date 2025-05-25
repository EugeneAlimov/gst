import React, { useEffect, useState } from "react";

//import MUI components
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

//import MUI icons
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

//import styles
import * as Style from "./styleConst";

//import components
import { TextareaCardName } from "./styleConst";

//import RTK QUERY
import { useSelector } from "react-redux";

export default function Header({ text, column_id }) {
  const columnsList = useSelector((state) => state.columnsApi.queries["getColumns(1)"]?.data);

  const [textAreaText, setTextAreaText] = useState(text);
  const [inColumn, setInColumn] = useState({});
  const [anchorInColumn, setAnchorInColumn] = useState(null);

  useEffect(() => {
    const col = columnsList.find((el) => el.id === column_id);
    setInColumn(col);
  }, [columnsList, columnsList]);

  const handleOpenInColumnMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseInColumnMenu = (event) => {
    !anchorInColumn ? setAnchorInColumn(null) : setAnchorInColumn(event.currentTarget);
  };

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
        {"В колонке: "}
        <Link href="#" sx={Style.linkOnTheColumn}>
          {inColumn.name}
        </Link>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorInColumn}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorInColumn)}
          onClose={handleCloseInColumnMenu}
          onClick={handleOpenInColumnMenu}
        >
          <MenuItem key={1} onClick={handleCloseInColumnMenu}>
            <Typography textAlign="center">{"Архивировать"}</Typography>
          </MenuItem>
          <MenuItem key={2} onClick={handleCloseInColumnMenu}>
            <Typography textAlign="center">{"Архивировать"}</Typography>
          </MenuItem>
        </Menu>
      </Typography>
    </>
  );
}
