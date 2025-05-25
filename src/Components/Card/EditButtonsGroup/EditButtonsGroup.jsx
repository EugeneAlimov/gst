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

// ✅ ИСПРАВЛЕНИЕ: Переименовываем параметр для избежания конфликта имен
export default function EditButtonsGroup({ cardId: originalCardId, chipsArr, ...cardData }) {
  const dispatch = useDispatch();
  const popUpTypeFromState = useSelector(chipData);
  const popUpType = popUpTypeFromState.popUpType;

  // ✅ ИСПРАВЛЕНИЕ: Сохраняем оригинальный cardId в состоянии
  const [currentCardId] = useState(originalCardId);

  // ✅ Валидация cardId
  const isValidCardId =
    currentCardId &&
    currentCardId !== "undefined" &&
    typeof currentCardId !== "undefined" &&
    currentCardId !== null;

  console.log("EditButtonsGroup received cardId:", currentCardId, "isValid:", isValidCardId);

  // Состояния для принудительного обновления
  const [cardDataState, setCardDataState] = useState(null);
  const [allChips, setAllChips] = useState(chipsArr || []);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Функция для загрузки данных карточки
  const fetchCardData = useCallback(async () => {
    if (!isValidCardId) {
      console.error("EditButtonsGroup: Invalid cardId, skipping fetch");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/v1/card/${currentCardId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCardDataState(data);
      } else {
        console.error("Failed to fetch card data:", response.status);
      }
    } catch (error) {
      console.error("Network error fetching card data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentCardId, isValidCardId]);

  // Функция для загрузки всех чипов
  const fetchAllChips = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/v1/chip/`,
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
        console.error("Failed to fetch chips");
      }
    } catch (error) {
      console.error("Network error fetching chips:", error);
    }
  }, []);

  // Обновляем изначальные чипы при изменении chipsArr
  useEffect(() => {
    setAllChips(chipsArr || []);
  }, [chipsArr]);

  // Загружаем данные при монтировании и при изменении refreshTrigger
  useEffect(() => {
    if (isValidCardId) {
      Promise.all([fetchCardData(), fetchAllChips()]);
    }
  }, [fetchCardData, fetchAllChips, refreshTrigger, isValidCardId]);

  // Функция для принудительного обновления
  const forceRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Обновляем при возврате к главному меню
  useEffect(() => {
    if (popUpType === 0 && isValidCardId) {
      setTimeout(() => {
        forceRefresh();
        dispatch(cardsApi.util.invalidateTags([{ type: "cards", id: currentCardId }]));
      }, 100);
    }
  }, [popUpType, forceRefresh, dispatch, currentCardId, isValidCardId]);

  // ✅ ИСПРАВЛЕНИЕ: Функция для рендеринга попапов с гарантированной передачей cardId
  const renderPopup = () => {
    if (!isValidCardId) {
      return (
        <Box
          sx={{
            padding: "20px",
            textAlign: "center",
            color: "#c62828",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          ❌ Ошибка: Некорректный ID карточки
          <div style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>
            Получен: {JSON.stringify(currentCardId)}
          </div>
        </Box>
      );
    }

    // ✅ ИСПРАВЛЕНИЕ: Явно передаем currentCardId во все компоненты
    console.log(`Rendering popup type ${popUpType} with cardId:`, currentCardId);

    switch (popUpType) {
      case 10:
        return <AllSettingsOfCard chipsArr={allChips} cardId={currentCardId} {...cardDataState} />;
      case 1:
        return (
          <ChangeChipsPallet
            cardId={currentCardId}
            chipsArr={allChips}
            onChipsUpdate={forceRefresh}
          />
        );
      case 2:
        return <ChangeUsers cardId={currentCardId} />;
      case 3:
        return <CreateNewChip id={currentCardId} onChipCreated={forceRefresh} />;
      case 4:
        // ✅ ИСПРАВЛЕНИЕ: Убеждаемся что cardId передается корректно
        console.log(
          "Opening DatesAndTimePallet with cardId:",
          currentCardId,
          "type:",
          typeof currentCardId
        );
        return <DatesAndTimePallet cardId={currentCardId} />;
      default:
        return null;
    }
  };

  if (!isValidCardId) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", margin: "10px" }}>
        <Box
          sx={{
            margin: "10px",
            padding: "20px",
            color: "#c62828",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          ❌ Ошибка: Некорректный ID карточки
        </Box>
      </Box>
    );
  }

  if (isLoading && !cardDataState) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", margin: "10px" }}>
        <Box sx={{ margin: "10px", padding: "20px", color: "#1976d2" }}>⏳ Загрузка...</Box>
      </Box>
    );
  }

  // Используем либо загруженные данные, либо переданные пропсы
  const currentCardData = cardDataState || cardData;

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
      {currentCardData && popUpType !== 10 && (
        <TaskCard
          {...currentCardData}
          allChips={allChips}
          inPopup={true}
          key={`card-preview-${currentCardId}-${refreshTrigger}-${allChips.length}`}
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
              onClick={() => {
                console.log(
                  "Opening dates popup for cardId:",
                  currentCardId,
                  "type:",
                  typeof currentCardId
                );
                dispatch(popUpToOpen(4));
              }}
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
