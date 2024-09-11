import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chipData, popUpToOpen, targetChipData } from "../../Redux/chip/chip-slice";

//import MIU components
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

//import MIU icons
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

//import components
import ChangeChip from "./ChangeChip";
import CardChip from "../Card/CardChipsSection/CardChip";

//import const
import { chipColor } from "../../constants/colorsConst";
import { chipStyleCreateNewChip, chipStyleChipContainer } from "../../constants/chipContainerStyle";
import {
  useCreateNewChipMutation,
  useDeleteChipMutation,
  useUpdateChipMutation,
} from "../../Redux/chip/chip-operations";

const defaultChipColor = {
  ...chipColor[0],
};

const arrowBackIconButtonStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "13px",
  left: "4px",
  width: "40px",
  height: "40px",
};

export default function CreateNewChip({ id }) {
  const [chipUpdate] = useUpdateChipMutation();
  const [chipDelete] = useDeleteChipMutation();

  const chipDataFromState = useSelector(chipData);
  const { targetChipId, targetChipText, targetChipColor, isEdit } = chipDataFromState;

  const dispatch = useDispatch();

  const innitialChipText = isEdit ? targetChipText : "";
  const innitialChipColor = isEdit ? targetChipColor : defaultChipColor;


  const [newChipColor, setNewChipColor] = useState(innitialChipColor);
  const [newChipText, setNewChipText] = useState(innitialChipText);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [createNewChip] = useCreateNewChipMutation();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const goToChangeChipPallet = () => {
    setNewChipColor(defaultChipColor);
    setNewChipText("");
    dispatch(popUpToOpen(1));
    dispatch(targetChipData({isEdit: false}));
}

  const chipHandler = async () => {
    const newChipObj = {
      text: newChipText,
      color_number: newChipColor.colorNumber,
      card: [id],
    };
    const updateChipObj = {
      text: newChipText,
      color_number: newChipColor.colorNumber,
    };
    try {
      !isEdit && (await createNewChip(newChipObj));
      isEdit && (await chipUpdate({ chipId: targetChipId, updateChipObj }));
    } catch (error) {
      console.log(error);
    } finally {
      setNewChipColor(defaultChipColor);
      setNewChipText("");
      dispatch(popUpToOpen(1));
      dispatch(targetChipData({isEdit: false}));
    }
  };

  const chipDeleter = async () => {
    handleDialogClose();
    try {
      chipDelete(targetChipId);
    } catch (error) {
      console.log(error);
    } finally {
      setNewChipColor(defaultChipColor);
      setNewChipText("");
      dispatch(popUpToOpen(1));
      dispatch(targetChipData({isEdit: false}));

    }
  };

  const setNewChipColorHandle = (value) => {
    setNewChipColor(value);
  };

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
            <>
              <IconButton
                aria-label="Create-new-Chips-Pallet"
                sx={arrowBackIconButtonStyle}
                onClick={goToChangeChipPallet}
              >
                <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "18px" }} />
              </IconButton>
            </>
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
          <Divider
            variant="middle"
            sx={{
              width: "250px",
              marginY: "10px",
            }}
            component="div"
          />
          <CardChip
            chipText={newChipText}
            color={newChipColor}
            chipStyle={chipStyleChipContainer}
          />
          <Divider
            variant="middle"
            sx={{
              width: "250px",
              marginY: "10px",
            }}
          />
          <TextField
            label="Название"
            id="new-name-chip"
            size="small"
            autoFocus={true}
            sx={{
              width: "260px",
              marginBottom: "15px",
            }}
            value={newChipText}
            onChange={(event) => setNewChipText(event.target.value)}
          />

          <Typography>Цвет</Typography>

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
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
              24, 25, 26, 27, 28, 29,
            ].map((value) => {
              return (
                <ChangeChip
                  setNewChipColorHandle={setNewChipColorHandle}
                  key={chipColor[value].colorNumber}
                  chipStyle={chipStyleCreateNewChip}
                  color={chipColor[value]}
                />
              );
            })}
          </Box>
          <Button
            disabled={newChipText.length === 0}
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
                // backgroundColor: "",
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
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          aria-label="Create-new-Chips-Pallet"
          sx={arrowBackIconButtonStyle}
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
