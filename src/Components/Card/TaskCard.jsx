import { useRef, useEffect, useState, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";

//atlaskit/pragmatic-drag-and-drop
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";

import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

import "@fontsource/roboto/400.css";

//import MIU components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import CardPreview from "../UI/CardPreview";

//import MIU icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

//import RTK QUERY
import { useGetAllChipsQuery } from "../../Redux/chip/chip-operations";
import { useUpdateCardDetailMutation } from "../../Redux/cards/cards-operations";

// import components
import EditButtonsGroup from "../../Components/Card/EditButtonsGroup/EditButtonsGroup";
import CardImage from "../../Components/Card/CardImageSection/CardImage";
import CardChipContainer from "../../Components/Card/CardChipsSection/CardChipContainer";
import CardStatistic from "../../Components/Card/CardStatisticIconsSection/CardStatistic";
import CardDescription from "../../Components/Card/CardDescriptionSection/CardDescription";
import CardAvatarSection from "../../Components/Card/Avatar/CardAvatarSection";
import DropIndicator from "../UI/DropIndicator";
import { TextareaCardDescription } from "./AllSettingsOfCard/styleConst";

//import styles
import * as style from "../../constants/ColumnViewStyles";

import { handleBlockClick, handleBlur } from "../../libs/libs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { popUpToOpen } from "../../Redux/chip/chip-slice";

const PaperComponent = (props) => {
  return <Paper sx={style.draggablePaper} {...props} />;
};

function TaskCard({
  columnId,
  checklist_how_many,
  comments_how_many,
  date_time_finish,
  date_time_start,
  id,
  in_process,
  is_subscribed,
  is_have_description,
  text,
  status,
  index,
  chips,
  inPopup,
  allChips,
}) {
  const [cardTextUpdater] = useUpdateCardDetailMutation();

  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const inputRef = useRef(null);

  const cardKey = `card-${id}-${chips?.length || 0}-${Date.now()}`;

  const processedChips = useMemo(() => {
    if (!allChips || !chips) {
      console.log(`Card ${id}: No chips data available`, { allChips: !!allChips, chips: !!chips });
      return [];
    }

    console.log(`Card ${id}: Processing chips`, {
      chipsCount: chips.length,
      allChipsCount: allChips.length,
      chipIds: chips,
      sampleAllChip: allChips[0],
    });

    const result = chips
      .map((chip) => {
        const foundChip = allChips.find((el) => el.id === chip);
        if (!foundChip) {
          console.log(`Card ${id}: Chip with id ${chip} not found in allChips`);
        }
        return foundChip;
      })
      .filter(Boolean);

    console.log(`Card ${id}: Processed ${result.length} chips from ${chips.length} chip IDs`);
    return result;
  }, [allChips, chips, id]);

  const [showEditIcon, setShowEditIcon] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [chipsArr, setChipsArr] = useState(processedChips);
  const [cardDragging, setCardDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [closestEdge, setClosestEdge] = useState(null);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [isEditable, setIsEditable] = useState(false); // Управляем режимом редактирования
  const [cardText, setCardText] = useState(text);
  const [cardTextBuffer, setCardTextBuffer] = useState("");

  useEffect(() => {
    console.log(`Card ${id}: Updating chips array`, {
      oldCount: chipsArr.length,
      newCount: processedChips.length,
      inPopup,
    });
    setChipsArr(processedChips);
  }, [processedChips, id, inPopup]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        isEditable && inputRef.current.focus(); // Устанавливаем фокус на текстовое поле
      }
    }, 0); // Задержка в 0 мс, чтобы блок успел удалиться
  }, [isEditable]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({
          cardIndex: index,
          cardId: id,
          columnId,
          type: "card",
          cardHeight: element.clientHeight,
        }),
        onDragStart() {
          setCardDragging(true);
        },
        onDrop() {
          setCardDragging(false);
          setPreview(null);
          setPlaceholderHeight(0);
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            render({ container }) {
              setPreview(container);
            },
          });
        },
      }),
      dropTargetForElements({
        element,
        getData: ({ input, element }) => {
          const data = { type: "card", cardId: id, columnId };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDrag: (args) => {
          const cardId = args.source.data.cardId;
          const type = args.source.data.type;

          if (cardId !== id && type === "card") {
            setClosestEdge(extractClosestEdge(args.self.data));
            setPlaceholderHeight(args.source.data.cardHeight);
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
          setPlaceholderHeight(0);
        },
        onDrop: () => {
          setClosestEdge(null);
          setPlaceholderHeight(0);
        },
        getIsSticky: () => true,
      })
    );
  }, [setPreview, setClosestEdge, setCardDragging]);

  const handleMouseOver = useCallback(() => setShowEditIcon(true), []);
  const handleMouseOut = useCallback(() => setShowEditIcon(false), []);
  const handleEditClick = useCallback(() => setOpenPop(true), []);

  const popClose = () => {
    setOpenPop(false);
    dispatch(popUpToOpen(0));
  };

  return (
    <Box
      ref={cardRef}
      key={inPopup ? cardKey : undefined} // Используем key только в попапе
      sx={{
        display: "flex",
        flexDirection: closestEdge === "top" ? "column-reverse" : "column",
      }}
    >
      <Card
        sx={{ ...style.cardStyle }}
        style={cardDragging ? { opacity: 0.5 } : {}}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {showEditIcon && !inPopup && (
          <Box sx={style.boxEditOutlinedIconStyle}>
            <IconButton onClick={handleEditClick} aria-label="edit">
              <EditOutlinedIcon />
            </IconButton>
          </Box>
        )}
        <Box>
          <CardImage />
          <CardContent sx={style.CardContentStyle}>
            <CardChipContainer chips={chipsArr} cardId={id} />
            {!isEditable && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  zIndex: 2,
                  cursor: "move",
                }}
                onClick={() => handleBlockClick(setIsEditable, setCardTextBuffer, cardText)}
              />
            )}
            <TextareaCardDescription
              ref={inputRef}
              onBlur={() =>
                handleBlur(
                  setIsEditable,
                  setCardTextBuffer,
                  cardText,
                  cardTextBuffer,
                  cardTextUpdater,
                  id,
                  { text: cardText }
                )
              } // Блокируем текстовое поле при потере фокуса
              aria-label="empty textarea"
              placeholder="Задайте текст карточке..."
              value={cardText}
              onChange={(event) => {
                setCardText(event.target.value);
              }}
            />
            <CardStatistic
              cardId={id}
              is_subscribed={is_subscribed}
              in_process={in_process}
              comments_how_many={comments_how_many}
              checklist_how_many={checklist_how_many}
              is_have_description={is_have_description}
              date_time_finish={date_time_finish}
              date_time_start={date_time_start}
              status={status}
            />
            <CardAvatarSection />
          </CardContent>
        </Box>
      </Card>
      <Dialog
        sx={{ height: "100%", backgroundColor: "rgba(0, 0, 0, 0.55)" }}
        maxWidth={"xl"}
        open={openPop}
        onClose={() => popClose()}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={style.dialogTitle} id="draggable-dialog-title">
          <IconButton
            aria-label="close"
            sx={{
              backgroundColor: "#777",
              "&:hover": { backgroundColor: "#ccc" },
            }}
            onClick={() => popClose()}
          >
            <CloseOutlinedIcon sx={{ color: "#fff" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={style.dialogContent}>
          {
            <EditButtonsGroup
              chipsArr={chipsArr}
              cardId={id}
              p={{ date_time_finish, date_time_start, status }}
            />
          }
        </DialogContent>
      </Dialog>
      {closestEdge && <DropIndicator height={placeholderHeight} />}
      {preview &&
        createPortal(
          <CardPreview
            CardImage={CardImage}
            CardContent={CardContent}
            CardChipContainer={CardChipContainer}
            CardDescription={CardDescription}
            CardStatistic={CardStatistic}
            CardAvatarSection={CardAvatarSection}
            chipsArr={chipsArr}
            cardText={cardText}
            id={id}
            is_subscribed={is_subscribed}
            in_process={in_process}
            comments_how_many={comments_how_many}
            checklist_how_many={checklist_how_many}
            is_have_description={is_have_description}
            date_time_finish={date_time_finish}
            date_time_start={date_time_start}
            status={status}
            style={style}
          />,
          preview
        )}
    </Box>
  );
}

export default memo(TaskCard, (prevProps, nextProps) => {
  // Кастомная функция сравнения для избежания лишних перерендеров
  return (
    prevProps.id === nextProps.id &&
    prevProps.text === nextProps.text &&
    prevProps.chips?.length === nextProps.chips?.length &&
    prevProps.allChips?.length === nextProps.allChips?.length &&
    JSON.stringify(prevProps.chips) === JSON.stringify(nextProps.chips)
  );
});
