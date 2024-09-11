import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { popUpToOpen } from "../../Redux/chip/chip-slice";

//import MUI components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

//import components
import ChipContainer from "./ChipContainer";

// import constants
// import { chipColor } from "../../constants/colorsConst";
import { useGetAllChipsQuery, useUpdateChipMutation } from "../../Redux/chip/chip-operations";

export default function ChangeChipsPallet({ cardId }) {
  const { data: chips } = useGetAllChipsQuery();
  const [updateChip] = useUpdateChipMutation();

  const dispatch = useDispatch();

  const [buttonsState, setButtonsState] = useState(1);
  const [chipList, setChipList] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let arr = JSON.parse(JSON.stringify(chips));

    const newArr = arr.reduce((accumulator, item) => {
      item.checked = false;
      if (item.card.includes(cardId)) item.checked = true;

      if (searchText === "") {
        switch (buttonsState) {
          case 1:
            accumulator.push(item);
            break;
          case 2:
            !item.checked && accumulator.push(item);
            break;
          case 3:
            item.checked && accumulator.push(item);
            break;
          default:
            break;
        }
      }
      if (searchText !== "") {
        item.text.includes(searchText) && accumulator.push(item);
      }
      return accumulator;
    }, []);

    setChipList(newArr);
  }, [buttonsState, cardId, chips, searchText]);

  const chipRelateToCardUpdate = async (id, chipId) => {
    let arr = JSON.parse(JSON.stringify(chipList));
    let newArr = [];

    arr.forEach((element) => {
      if (element.id === chipId) {
        if (element.checked) newArr = [...element.card.filter((el) => el !== id)];
        if (!element.checked) {
          element.card.push(id);
          newArr = [...element.card];
        }
      }
    });

    const updateChipObj = { card: newArr };

    try {
      updateChip({ chipId, updateChipObj });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "Column",
        alignItems: "center",
        height: "fit-content",
        paddingX: "12px",
      }}
    >
      <CardHeader
        sx={{
          padding: "5px",
          marginBottom: "10px",
        }}
        titleTypographyProps={{
          fontSize: "20px",
          color: "#172b4d",
        }}
        title="Метки"
        action={
          <IconButton
            onClick={() => dispatch(popUpToOpen(0))}
            aria-label="Change-Chips-Pallet"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              right: "-86px",
            }}
          >
            <CloseOutlinedIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        }
      />
      <TextField
        label="Искать метки"
        id="search-chip"
        size="small"
        autoFocus={true}
        value={searchText}
        onChange={(e) => setSearchText(e.currentTarget.value)}
        sx={{
          width: "260px",
          marginBottom: "10px",
        }}
      />

      <CardContent
        sx={{
          padding: "0px",
        }}
      >
        <List
          sx={{
            height: "430px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {chipList &&
            chipList.map((chip) => {
              const { text, id } = chip;
              const labelId = `checkbox-list-label-${text}`;
              return (
                <ListItem key={id} disablePadding>
                  <ChipContainer
                    {...chip}
                    chipRelateToCardUpdate={chipRelateToCardUpdate}
                    cardId={cardId}
                    labelId={labelId}
                  />
                </ListItem>
              );
            })}
        </List>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: "100%",
            height: "32px",
            fontSize: "14px",
            marginBottom: "10px",
            backgroundColor: "blue",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#e3e3e3",
            },
          }}
          onClick={() => dispatch(popUpToOpen(3))}
        >
          Создать новую метку
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={buttonsState === 1}
          sx={{
            width: "100%",
            height: "32px",
            fontSize: "14px",
            marginBottom: "10px",
            backgroundColor: "#d7d7d7",
            color: "#172b4d",
            "&:hover": {
              backgroundColor: "#e3e3e3",
            },
          }}
          onClick={() => setButtonsState(1)}
        >
          {"Показать все"}
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={buttonsState === 2}
          sx={{
            width: "100%",
            height: "32px",
            fontSize: "14px",
            marginBottom: "10px",
            backgroundColor: "#d7d7d7",
            color: "#172b4d",
            "&:hover": {
              backgroundColor: "#e3e3e3",
            },
          }}
          onClick={() => setButtonsState(2)}
        >
          {"Показать которых нет на карточке"}
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={buttonsState === 3}
          sx={{
            width: "100%",
            height: "32px",
            fontSize: "14px",
            marginBottom: "10px",
            backgroundColor: "#d7d7d7",
            color: "#172b4d",
            "&:hover": {
              backgroundColor: "#e3e3e3",
            },
          }}
          onClick={() => setButtonsState(3)}
        >
          {"Показать которые есть на карточке"}
        </Button>
      </CardActions>
    </Card>
  );
}
