import { useEffect, useState, useCallback } from "react";
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
import { cardsApi } from "../../../Redux/cards/cards-operations";

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
  const dispatch = useDispatch();
  const popUpTypeFromState = useSelector(chipData);
  const popUpType = popUpTypeFromState.popUpType;

  // Состояния для принудительного обновления
  const [cardData, setCardData] = useState(null);
  const [allChips, setAllChips] = useState(chipsArr || []);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Функция для загрузки данных карточки
  const fetchCardData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/card/${cardId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCardData(data);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  // Функция для загрузки всех чипов
  const fetchAllChips = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/chip/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const chips = await response.json();
        setAllChips(chips);
      } else {
      }
    } catch (error) {}
  }, []);

  // Обновляем изначальные чипы при изменении chipsArr
  useEffect(() => {
    setAllChips(chipsArr || []);
  }, [chipsArr]);

  // Загружаем данные при монтировании и при изменении refreshTrigger
  useEffect(() => {
    Promise.all([fetchCardData(), fetchAllChips()]);
  }, [fetchCardData, fetchAllChips, refreshTrigger]);

  // Функция для принудительного обновления
  const forceRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Обновляем при возврате к главному меню
  useEffect(() => {
    if (popUpType === 0) {
      // Добавляем небольшую задержку для гарантии обновления
      setTimeout(() => {
        forceRefresh();
        // Дополнительно инвалидируем кэш карточек
        dispatch(cardsApi.util.invalidateTags([{ type: "cards", id: cardId }]));
      }, 100);
    }
  }, [popUpType, forceRefresh, dispatch, cardId]);

  useEffect(() => {}, [allChips]);

  // Функция для рендеринга попапов
  const renderPopup = () => {
    switch (popUpType) {
      case 10:
        return <AllSettingsOfCard chipsArr={allChips} cardId={cardId} {...cardData} />;
      case 1:
        return (
          <ChangeChipsPallet
            cardId={cardId}
            chipsArr={allChips} // Используем обновленные чипы
            onChipsUpdate={forceRefresh}
          />
        );
      case 2:
        return <ChangeUsers cardId={cardId} />;
      case 3:
        return <CreateNewChip id={cardId} onChipCreated={forceRefresh} />;
      case 4:
        return <DatesAndTimePallet cardId={cardId} />;
      default:
        return null;
    }
  };

  if (isLoading && !cardData) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", margin: "10px" }}>
        <Box sx={{ margin: "10px", padding: "20px" }}>Загрузка...</Box>
      </Box>
    );
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
      {/* Превью карточки с обновленными чипами */}
      {cardData && popUpType !== 10 && (
        <TaskCard
          {...cardData}
          allChips={allChips} // Передаем обновленные чипы
          inPopup={true}
          key={`card-preview-${cardId}-${refreshTrigger}-${allChips.length}`} // Ключ зависит и от чипов
        />
      )}

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
            <Button variant="contained" color="secondary" size="large" sx={buttonStyle}>
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
            <Button variant="contained" color="secondary" size="large" sx={buttonStyle}>
              Переместить
            </Button>
            <Button variant="contained" color="secondary" size="large" sx={buttonStyle}>
              Архивировать
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ marginLeft: "10px" }}>{renderPopup()}</Box>
      )}
    </Box>
  );
}
