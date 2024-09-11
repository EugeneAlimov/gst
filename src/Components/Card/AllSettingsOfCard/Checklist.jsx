import React, { useState, useEffect } from "react";

//import MUI components
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

//import MUI icons
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

//import mettods
import {
  checkedRowsCounter,
  ChkListCboxToggle,
  ChkListTextEditToggle,
  HandleRemoveRowFromCheckList,
  HandleAddNewRowToCheckList,
} from "./methods";

//import styles
// import * as Style from "./styleConst";
import { TextareaChkListText } from "./styleConst";

//import constants
import { checkListArr } from "./constatns";

export default function Checklist() {
  const [hideChecked, setHideChecked] = useState(false);
  const [addNewRowToCheckListTrig, setAddNewRowToCheckListTrig] = useState(false);
  const [checkListItems, setCheckListItems] = useState(checkListArr);
  const [checkListItemText, setCheckListItemText] = useState("");
  const [progress, setProgress] = useState(0);
  const [IDofTheLastCreatedCheckListRow, setIDofTheLastCreatedCheckListRow] = useState(0);

  useEffect(() => {
    console.log("dsadasd");
    checkedRowsCounter(checkListItems, setProgress);
  }, [checkListItems]);

  const handleHideCheckedChange = (event) => {
    setHideChecked(event.target.checked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        padding: "5px",
      }}
    >
      {/* чекбоксы */}
      <Icon
        sx={{
          marginTop: "4px",
          position: "absolute",
          left: "20px",
        }}
      >
        <CheckBoxOutlinedIcon />
      </Icon>
      <Typography
        sx={{
          cursor: "default",
          fontSize: "20px",
          color: "#172b4d",
          width: "100px",
          padding: "3px",
        }}
      >
        Чек-лист
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "350px",
          borderRadius: "3px",
          paddingX: "10px",
          paddingBottom: "5px",
          marginBottom: "15px",
          boxShadow: "1",
        }}
      >
        <FormControlLabel
          sx={{
            width: "284px",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
          value="top"
          control={
            <Switch
              checked={hideChecked}
              onChange={handleHideCheckedChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: "14px",
                color: "#172b4d",
              }}
            >
              Скрывать отмеченные пункты
            </Typography>
          }
          labelPlacement="start"
        />
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            width: "240px",
            height: "32px",
            fontSize: "14px",
            marginBottom: "10px",
            backgroundColor: "#d7d7d7",
            color: "black",
            "&:hover": {
              backgroundColor: "#e3e3e3",
            },
          }}
        >
          Удалить чек-лист
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <LinearProgress variant="determinate" value={progress} sx={{ width: "90%" }} />
        <Typography
          sx={{
            cursor: "default",
            fontSize: "14px",
            color: "#172b4d",
            marginRight: "10px",
          }}
        >
          {progress}%
        </Typography>
      </Box>
      <List>
        {checkListItems.map((item) => {
          const LabelID = `checkbox-list-label-${item.id}`;

          return (
            <ListItem
              sx={{
                display: item.isChecked && hideChecked ? "none" : "flex",
                padding: "0px",
                margin: "0px",
              }}
              key={item.id}
            >
              <Checkbox
                disabled={item.isSelected}
                checked={item.isChecked}
                onChange={ChkListCboxToggle(
                  item.id,
                  checkListItems,
                  setProgress,
                  setCheckListItems
                )}
                inputProps={{ "aria-labelledby": LabelID }}
              />
              <ListItemText
                id={LabelID}
                primary={
                  item.isSelected ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "nowrap",
                        padding: "6px",
                        boxShadow: "1",
                        borderRadius: "4px",
                      }}
                    >
                      <TextareaChkListText
                        defaultValue={item.text}
                        autoFocus
                        disabled={false}
                        aria-label={`${LabelID}`}
                        placeholder="Это поле нужно заполнить"
                        required
                        value={checkListItemText}
                        onChange={(event) => {
                          setCheckListItemText(event.target.value);
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          alignContent: "center",
                          alignItems: "center",
                          marginTop: "6px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "nowrap",
                            alignContent: "center",
                            alignItems: "center",
                            marginTop: "6px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                              width: "110px",
                              height: "26px",
                              marginTop: "4px",
                              marginRight: "10px",
                            }}
                            onClick={ChkListTextEditToggle(
                              item.id,
                              "save",
                              IDofTheLastCreatedCheckListRow,
                              addNewRowToCheckListTrig,
                              checkListItems,
                              setCheckListItemText,
                              checkListItemText,
                              setCheckListItems,
                              setAddNewRowToCheckListTrig
                            )}
                          >
                            Сохранить
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                              width: "90px",
                              height: "26px",
                              marginTop: "4px",
                              marginRight: "10px",
                            }}
                            onClick={ChkListTextEditToggle(
                              item.id,
                              "cancel",
                              IDofTheLastCreatedCheckListRow,
                              addNewRowToCheckListTrig,
                              checkListItems,
                              setCheckListItemText,
                              checkListItemText,
                              setCheckListItems,
                              setAddNewRowToCheckListTrig
                            )}
                          >
                            Отмена
                          </Button>
                        </Box>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          sx={{
                            display: addNewRowToCheckListTrig ? "none" : "inherit",
                            width: "90px",
                            height: "26px",
                            fontSize: "14px",
                            marginTop: "10px",
                            backgroundColor: "#d7d7d7",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "#e3e3e3",
                            },
                          }}
                          onClick={() =>
                            HandleRemoveRowFromCheckList(item.id, checkListItems, setCheckListItems)
                          }
                        >
                          Удалить
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        alignContent: "center",
                        alignItems: "center",
                        paddingX: "6px",
                        borderRadius: "6px",
                        width: "100%",
                        minHeight: "36px",
                        "&:hover": { backgroundColor: "#e1e1e1" },
                      }}
                      onClick={ChkListTextEditToggle(
                        item.id,
                        "open",
                        IDofTheLastCreatedCheckListRow,
                        addNewRowToCheckListTrig,
                        checkListItems,
                        setCheckListItemText,
                        checkListItemText,
                        setCheckListItems,
                        setAddNewRowToCheckListTrig
                      )}
                    >
                      <Typography
                        sx={{
                          cursor: "pointer",
                          fontSize: "14px",
                          color: item.isChecked ? "#525863" : "#172b4d",
                          textDecoration: item.isChecked && "line-through",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  )
                }
              />
            </ListItem>
          );
        })}
      </List>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{
          display: addNewRowToCheckListTrig ? "none" : "inherit",
          width: "290px",
          height: "32px",
          fontSize: "14px",
          lineHeight: "1.5",
          marginBottom: "10px",
          backgroundColor: "#d7d7d7",
          color: "black",
          "&:hover": {
            backgroundColor: "#e3e3e3",
          },
        }}
        onClick={() =>
          HandleAddNewRowToCheckList(
            setIDofTheLastCreatedCheckListRow,
            setAddNewRowToCheckListTrig,
            setCheckListItems,
            checkListItems
          )
        }
      >
        Добавить еще один пункт
      </Button>
    </Box>
  );
}
