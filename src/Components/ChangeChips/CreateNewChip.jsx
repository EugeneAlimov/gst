import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chipData, popUpToOpen, targetChipData } from "../../Redux/chip/chip-slice";

//import MUI components
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

//import MUI icons
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

//import components
import ChangeChip from "./ChangeChip";
import CardChip from "../Card/CardChipsSection/CardChip";

//import API hooks
import {
  chipsApi,
  useCreateNewChipMutation,
  useDeleteChipMutation,
  useUpdateChipMutation,
} from "../../Redux/chip/chip-operations";
import { useGetColorPaletteQuery } from "../../Redux/chip/chip-operations";

//import styles
import { chipStyleCreateNewChip, chipStyleChipContainer } from "../../constants/chipContainerStyle";
import { cardsApi } from "../../Redux/cards/cards-operations";

export default function CreateNewChip({ id, onChipCreated }) {
  const [chipUpdate] = useUpdateChipMutation();
  const [chipDelete] = useDeleteChipMutation();
  const [createNewChip] = useCreateNewChipMutation();

  // Загружаем палитру цветов с сервера
  const {
    data: colorPalette,
    isLoading: colorsLoading,
    error: colorsError,
  } = useGetColorPaletteQuery();

  const chipDataFromState = useSelector(chipData);
  const { targetChipId, targetChipText, targetChipColor, isEdit } = chipDataFromState;

  const dispatch = useDispatch();

  const [newChipColor, setNewChipColor] = useState(null);
  const [newChipText, setNewChipText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Инициализация при загрузке компонента
  useEffect(() => {
    if (colorPalette && colorPalette.length > 0) {
      if (isEdit && targetChipColor && targetChipColor.id) {
        console.log("Editing chip, target color:", targetChipColor); // Для отладки

        // Ищем цвет в палитре по ID
        const existingColor = colorPalette.find((color) => color.id === targetChipColor.id);

        if (existingColor) {
          setNewChipColor(existingColor);
        } else {
          // Если не нашли по ID, ищем по номеру цвета
          const colorByNumber = colorPalette.find(
            (color) => color.colorNumber === targetChipColor.colorNumber
          );
          setNewChipColor(colorByNumber || colorPalette[0]);
        }

        setNewChipText(targetChipText || "");
      } else {
        // Если создаем новый, берем первый цвет
        setNewChipColor(colorPalette[0]);
        setNewChipText("");
      }
    }
  }, [colorPalette, isEdit, targetChipColor, targetChipText]);

  // Сброс состояния при изменении режима (создание/редактирование)
  useEffect(() => {
    if (!isEdit) {
      setNewChipText("");
      if (colorPalette && colorPalette.length > 0) {
        setNewChipColor(colorPalette[0]);
      }
    }
  }, [isEdit, colorPalette]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const goToChangeChipPallet = () => {
    // Сброс состояния и возврат к списку
    dispatch(targetChipData({ isEdit: false }));
    dispatch(popUpToOpen(1));
  };

  const chipHandler = async () => {
    if (!newChipText.trim() || !newChipColor) {
      console.error("Необходимо указать название и цвет чипа");
      return;
    }

    const chipData = {
      name: newChipText.trim(),
      text: newChipText.trim(),
      color_id: newChipColor.id,
    };

    const updateChipData = {
      name: newChipText.trim(),
      text: newChipText.trim(),
      color_id: newChipColor.id,
    };

    try {
      if (!isEdit) {
        await createNewChip(chipData).unwrap();
        console.log("Chip created successfully");
      } else {
        const updatedChip = await chipUpdate({
          chipId: targetChipId,
          updateChipObj: updateChipData,
        }).unwrap();

        console.log("Chip updated successfully", updatedChip);

        // РАБОЧЕЕ РЕШЕНИЕ - полная очистка кэша
        setTimeout(() => {
          console.log("Clearing all RTK Query cache...");
          dispatch(chipsApi.util.resetApiState());

          setTimeout(() => {
            console.log("Reloading chips data...");
            dispatch(
              chipsApi.endpoints.getAllChips.initiate(undefined, {
                forceRefetch: true,
              })
            );
          }, 50);
        }, 20);
      }

      // Сброс формы и возврат к списку
      dispatch(targetChipData({ isEdit: false }));
      dispatch(popUpToOpen(1));

      // Уведомляем о завершении операции
      if (onChipCreated) {
        setTimeout(onChipCreated, 500);
      }
    } catch (error) {
      console.error("Ошибка при сохранении чипа:", error);
    }
  };

  const chipDeleter = async () => {
    handleDialogClose();
    try {
      await chipDelete(targetChipId).unwrap();
    } catch (error) {
      console.error("Ошибка при удалении чипа:", error);
    } finally {
      dispatch(targetChipData({ isEdit: false }));
      dispatch(popUpToOpen(1));
    }
  };

  const setNewChipColorHandle = (color) => {
    console.log("Color selected:", color); // Для отладки
    setNewChipColor(color);
  };

  // Показываем ошибку
  if (colorsError) {
    return (
      <Card
        sx={{
          display: "block",
          position: "relative",
          width: "300px",
          height: "200px",
          paddingX: "12px",
        }}
      >
        <Typography sx={{ padding: "20px", textAlign: "center", color: "red" }}>
          Ошибка загрузки палитры цветов
        </Typography>
      </Card>
    );
  }

  // Показываем загрузку
  if (colorsLoading || !colorPalette) {
    return (
      <Card
        sx={{
          display: "block",
          position: "relative",
          width: "300px",
          height: "200px",
          paddingX: "12px",
        }}
      >
        <Typography sx={{ padding: "20px", textAlign: "center" }}>
          Загружаем палитру цветов...
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <Card
        sx={{
          display: "block",
          position: "relative",
          width: "300px",
          height: "fit-content",
          paddingX: "12px",
        }}
      >
        <CardHeader
          sx={{
            display: "flex",
            flexDirection: "Column",
            alignItems: "center",
            padding: "5px",
            marginTop: "5px",
            marginBottom: "10px",
          }}
          titleTypographyProps={{
            fontSize: "20px",
            color: "#172b4d",
          }}
          title={isEdit ? "Изменить метку" : "Создать новую метку"}
          action={
            <IconButton
              aria-label="back-to-list"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "13px",
                left: "4px",
                width: "40px",
                height: "40px",
              }}
              onClick={goToChangeChipPallet}
            >
              <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          }
        />

        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Divider variant="middle" sx={{ width: "250px", marginY: "10px" }} />

          {/* Предпросмотр чипа */}
          {newChipColor && (
            <CardChip
              chip={{
                name: newChipText || "Предпросмотр",
                color: {
                  normal: newChipColor.normal || newChipColor.normal_color,
                  hover: newChipColor.hover || newChipColor.hover_color,
                  colorName: newChipColor.colorName || newChipColor.color_name,
                },
              }}
              chipStyle={chipStyleChipContainer}
            />
          )}

          <Divider variant="middle" sx={{ width: "250px", marginY: "10px" }} />

          {/* Поле ввода названия */}
          <TextField
            label="Название"
            id="new-name-chip"
            size="small"
            autoFocus={true}
            sx={{ width: "260px", marginBottom: "15px" }}
            value={newChipText}
            onChange={(event) => setNewChipText(event.target.value)}
          />

          <Typography>Цвет</Typography>

          {/* Палитра цветов */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              alignContent: "space-between",
              width: "100%",
              height: "208px",
              marginBottom: "16px",
            }}
          >
            {colorPalette.map((color) => (
              <ChangeChip
                key={color.id}
                setNewChipColorHandle={setNewChipColorHandle}
                color={color}
                chipStyle={chipStyleCreateNewChip}
                isSelected={newChipColor?.id === color.id}
              />
            ))}
          </Box>

          {/* Кнопки действий */}
          <Button
            disabled={!newChipText.trim() || !newChipColor}
            variant="contained"
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
              "&:disabled": {
                backgroundColor: "#f5f5f5",
                color: "#999",
              },
            }}
            onClick={chipHandler}
          >
            {isEdit ? "Изменить метку" : "Создать метку"}
          </Button>

          {isEdit && (
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "32px",
                fontSize: "14px",
                marginBottom: "10px",
                color: "#172b4d",
                "&:hover": {
                  backgroundColor: "#e3e3e3",
                },
              }}
              onClick={handleDialogOpen}
            >
              Удалить метку
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          aria-label="close-dialog"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "13px",
            left: "4px",
            width: "40px",
            height: "40px",
          }}
          onClick={handleDialogClose}
        >
          <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "18px" }} />
        </IconButton>

        <DialogTitle marginLeft={5} id="alert-dialog-title">
          {"Удалить эту метку?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Метка будет удалена со всех карточек. Это действие необратимо."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={chipDeleter} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
