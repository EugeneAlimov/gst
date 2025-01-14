import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { chipData, popUpToOpen } from "../../../Redux/chip/chip-slice";

//import MIU components
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TaskCard from "../TaskCard";
import Box from "@mui/material/Box";

//import components
import ChangeChipsPallet from "../../ChangeChips/ChangeChipsPallet";
import ChangeUsers from "../ChangeUsers/ChangeUsers";
import DatesAndTimePallet from "../../DateAndTime/DatesAndTimePallet";
import CreateNewChip from "../../ChangeChips/CreateNewChip";
import AllSettingsOfCard from "../AllSettingsOfCard/AllSettingsOfCard";

import { useGetOneCardQuery } from "../../../Redux/cards/cards-operations";

const buttonStyle = {
  height: "32px",
  fontSize: "14px",
  lineHeight: "1.5",
  marginBottom: "10px",
  backgroundColor: "#d7d7d7",
  color: "black",
  "&:hover": {
    backgroundColor: "#e3e3e3",
  },
};

export default function EditButtonsGroup({ cardId, chipsArr }) {
  const { data } = useGetOneCardQuery(cardId);
  const dispatch = useDispatch();

  const popUpTypeFromState = useSelector(chipData);
  const popUpType = popUpTypeFromState.popUpType;

  function Pop(type) {
    let pop = null;

    switch (type) {
      case 10:
        pop = <AllSettingsOfCard chipsArr={chipsArr} cardId={cardId} {...data} />;
        break;
      case 1:
        pop = <ChangeChipsPallet cardId={cardId} chipsArr={chipsArr} />;
        break;
      case 2:
        pop = <ChangeUsers cardId={cardId} />;
        break;
      case 3:
        pop = <CreateNewChip id={cardId} />;
        break;
      case 4:
        pop = <DatesAndTimePallet cardId={cardId} />;
        break;

      default:
        break;
    }
    return <Box sx={{ marginLeft: "10px" }}>{pop}</Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "flex-start",
        margin: "10px",
      }}
    >
      {!!data && popUpType !== 10 && <TaskCard {...data} allChips={chipsArr} inPopup={true} />}
      {popUpType === 0 ? (
        <Box sx={{ margin: "10px" }}>
          <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              onClick={() => dispatch(popUpToOpen(10))}
            >
              Открыть карточку
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              onClick={() => dispatch(popUpToOpen(1))}
            >
              Изменить метки
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              onClick={() => dispatch(popUpToOpen(2))}
            >
              Изменить участников
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              // onClick={() => dispatch(popUpToOpen(3))}
            >
              Сменить обложку
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              onClick={() => dispatch(popUpToOpen(4))}
            >
              Изменить даты
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              // onClick={HandleAddNewRowToCheckList}
            >
              Переместить
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              // onClick={HandleAddNewRowToCheckList}
            >
              Архивировать
            </Button>
          </Stack>
        </Box>
      ) : null}

      {Pop(popUpType)}
    </Box>
  );
}
