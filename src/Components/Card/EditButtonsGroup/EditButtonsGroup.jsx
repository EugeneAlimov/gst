import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chipData, popUpToOpen } from "../../../Redux/chip/chip-slice";

// MUI components
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Components
import TaskCard from "../TaskCard";
import ChangeChipsPallet from "../../ChangeChips/ChangeChipsPallet";
import ChangeUsers from "../ChangeUsers/ChangeUsers";
import DatesAndTimePallet from "../../DateAndTime/DatesAndTimePallet";
import CreateNewChip from "../../ChangeChips/CreateNewChip";
import AllSettingsOfCard from "../AllSettingsOfCard/AllSettingsOfCard";

// Redux
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

export default function EditButtonsGroup({ cardId, chipsArr, ...cardData }) {
  const dispatch = useDispatch();
  const popUpTypeFromState = useSelector(chipData);
  const popUpType = popUpTypeFromState.popUpType;

  // Улучшенная валидация cardId
  const isValidCardId = useCallback(() => {
    return (
      cardId &&
      cardId !== "undefined" &&
      cardId !== null &&
      cardId !== undefined &&
      (typeof cardId === "number" || (typeof cardId === "string" && cardId !== ""))
    );
  }, [cardId]);

  console.log("EditButtonsGroup mounted with cardId:", cardId, "isValid:", isValidCardId());

  // Состояния для принудительного обновления
  const [cardDataState, setCardDataState] = useState(null);
  const [allChips, setAllChips] = useState(chipsArr || []);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState(null);

  // Функция для загрузки данных карточки
  const fetchCardData = useCallback(async () => {
    if (!isValidCardId()) {
      console.error("EditButtonsGroup: Invalid cardId, skipping fetch");
      setIsLoading(false);
      setError("Невалидный ID карточки");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/v1/card/${cardId}/`,
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
        const errorText = await response.text();
        console.error("Failed to fetch card data:", response.status, errorText);
        setError(`Ошибка загрузки: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error fetching card data:", error);
      setError("Ошибка сети при загрузке карточки");
    } finally {
      setIsLoading(false);
    }
  }, [cardId, isValidCardId]);

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
        console.error("Failed to fetch chips:", response.status);
      }
    } catch (error) {
      console.error("Network error fetching chips:", error);
    }
  }, []);

  // Обновляем изначальные чипы при изменении chipsArr
  useEffect(() => {
    if (chipsArr) {
      setAllChips(chipsArr);
    }
  }, [chipsArr]);

  // Загружаем данные при монтировании и при изменении refreshTrigger
  useEffect(() => {
    if (isValidCardId()) {
      Promise.all([fetchCardData(), fetchAllChips()]);
    } else {
      setIsLoading(false);
      setError("Невалидный ID карточки");
    }
  }, [fetchCardData, fetchAllChips, refreshTrigger]);

  // Функция для принудительного обновления
  const forceRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Обновляем при возврате к главному меню
  useEffect(() => {
    if (popUpType === 0 && isValidCardId()) {
      setTimeout(() => {
        forceRefresh();
        dispatch(cardsApi.util.invalidateTags([{ type: "cards", id: cardId }]));
      }, 100);
    }
  }, [popUpType, forceRefresh, dispatch, cardId, isValidCardId]);

  // Функция для рендеринга попапов
  const renderPopup = () => {
    if (!isValidCardId()) {
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
            Получен: {JSON.stringify(cardId)}
          </div>
        </Box>
      );
    }

    console.log(`Rendering popup type ${popUpType} for cardId:`, cardId);

    switch (popUpType) {
      case 10:
        return <AllSettingsOfCard chipsArr={allChips} cardId={cardId} {...cardDataState} />;
      case 1:
        return (
          <ChangeChipsPallet cardId={cardId} chipsArr={allChips} onChipsUpdate={forceRefresh} />
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

  // Обработчики кликов на кнопки
  const handleOpenCard = useCallback(() => dispatch(popUpToOpen(10)), [dispatch]);
  const handleChangeChips = useCallback(() => dispatch(popUpToOpen(1)), [dispatch]);
  const handleChangeUsers = useCallback(() => dispatch(popUpToOpen(2)), [dispatch]);
  const handleChangeDates = useCallback(() => {
    dispatch(popUpToOpen(4));
  }, [dispatch]);

  // Основной рендер с улучшенной обработкой ошибок
  if (!isValidCardId()) {
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
          <div style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>
            Получен: {JSON.stringify(cardId)}
          </div>
        </Box>
      </Box>
    );
  }

  if (isLoading && !cardDataState) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", margin: "10px" }}>
        <Box sx={{ margin: "10px", padding: "20px", color: "#1976d2" }}>
          ⏳ Загрузка данных карточки...
        </Box>
      </Box>
    );
  }

  if (error) {
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
          ❌ {error}
          <button
            onClick={forceRefresh}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              fontSize: "12px",
              border: "1px solid #c62828",
              background: "transparent",
              color: "#c62828",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Повторить
          </button>
        </Box>
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
          key={`card-preview-${cardId}-${refreshTrigger}-${allChips.length}`}
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
              onClick={handleOpenCard}
            >
              Открыть карточку
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              onClick={handleChangeChips}
            >
              Изменить метки
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={buttonStyle}
              onClick={handleChangeUsers}
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
              onClick={handleChangeDates}
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
