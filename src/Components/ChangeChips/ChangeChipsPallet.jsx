import { useState, useCallback, useMemo } from "react";
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

import { useGetAllChipsQuery } from "../../Redux/chip/chip-operations";

export default function ChangeChipsPallet({ cardId, chipsArr, onChipsUpdate }) {
  const { data: chips } = useGetAllChipsQuery();
  const dispatch = useDispatch();

  const [buttonsState, setButtonsState] = useState(1);
  const [searchText, setSearchText] = useState("");

  // Мемоизируем обработку списка чипов
  const chipList = useMemo(() => {
    if (!chips) return [];

    let arr = JSON.parse(JSON.stringify(chips));

    return arr.reduce((accumulator, item) => {
      item.checked = false;
      chipsArr.forEach((el) => {
        if (el.id === item.id) item.checked = true;
      });

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
      } else {
        if (item.name?.includes(searchText) || item.text?.includes(searchText)) {
          accumulator.push(item);
        }
      }
      return accumulator;
    }, []);
  }, [buttonsState, chipsArr, chips, searchText]);

  //функция обновления чипов
  const chipRelateToCardUpdate = useCallback(
    async (chipId) => {
      let updatedChipsArr = [...chipsArr];

      const targetChip = chipList.find((element) => element.id === chipId);
      if (!targetChip) return;

      if (targetChip.checked) {
        updatedChipsArr = updatedChipsArr.filter((el) => el.id !== chipId);
      } else {
        const chipToAdd = chips.find((el) => el.id === chipId);
        if (chipToAdd) updatedChipsArr.push(chipToAdd);
      }

      const finalChipsIds = updatedChipsArr.map((el) => el.id);

      console.log("Updating card chips:", { cardId, finalChipsIds });

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/card/${cardId}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chips: finalChipsIds }),
          }
        );

        if (response.ok) {
          const updatedCard = await response.json();
          console.log("Card updated successfully:", updatedCard);

          // Уведомляем о успешном обновлении
          if (onChipsUpdate) {
            setTimeout(onChipsUpdate, 300);
          }
        } else {
          console.error("Failed to update card:", response.status);
        }
      } catch (error) {
        console.error("Error updating card:", error);
      }
    },
    [chipsArr, chipList, chips, cardId, onChipsUpdate]
  );

  // Обработчики событий
  const handleSearchChange = useCallback((e) => {
    setSearchText(e.currentTarget.value);
  }, []);

  const handleButtonState1 = useCallback(() => setButtonsState(1), []);
  const handleButtonState2 = useCallback(() => setButtonsState(2), []);
  const handleButtonState3 = useCallback(() => setButtonsState(3), []);
  const handleCreateNewChip = useCallback(() => dispatch(popUpToOpen(3)), [dispatch]);
  const handleClose = useCallback(() => dispatch(popUpToOpen(0)), [dispatch]);

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
        sx={{ padding: "5px", marginBottom: "10px" }}
        titleTypographyProps={{ fontSize: "20px", color: "#172b4d" }}
        title="Метки"
        action={
          <IconButton
            onClick={handleClose}
            aria-label="Change-Chips-Pallet"
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", right: "-86px" }}
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
        onChange={handleSearchChange}
        sx={{ width: "260px", marginBottom: "10px" }}
      />

      <CardContent sx={{ padding: "0px" }}>
        <List sx={{ height: "430px", overflowY: "auto", overflowX: "hidden" }}>
          {chipList.map((chip) => {
            const { name, text, id } = chip;
            const chipText = name || text;
            const labelId = `checkbox-list-label-${chipText}`;
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
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
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
            "&:hover": { backgroundColor: "#e3e3e3" },
          }}
          onClick={handleCreateNewChip}
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
            "&:hover": { backgroundColor: "#e3e3e3" },
          }}
          onClick={handleButtonState1}
        >
          Показать все
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
            "&:hover": { backgroundColor: "#e3e3e3" },
          }}
          onClick={handleButtonState2}
        >
          Показать которых нет на карточке
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
            "&:hover": { backgroundColor: "#e3e3e3" },
          }}
          onClick={handleButtonState3}
        >
          Показать которые есть на карточке
        </Button>
      </CardActions>
    </Card>
  );
}
