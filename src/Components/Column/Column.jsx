import React, { useRef, useEffect, useState, useCallback } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";

//atlaskit/pragmatic-drag-and-drop
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";

import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

//redux states
import { cardData, storeOneCard } from "../../Redux/cards/card-slice";

import "@fontsource/roboto/400.css";

//import MIU components
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";

//import RTK QUERY
import {
  useGetCardsQuery,
  useUpdateCardInColumnMutation,
} from "../../Redux/cards/cards-operations";

// import components
import TaskCard from "../Card/TaskCard";
import DropIndicator from "../UI/DropIndicator";

//import styles
import * as style from "../../constants/ColumnViewStyles";

import { createPortal } from "react-dom";
import { TextareaColumnName } from "../Card/AllSettingsOfCard/styleConst";

export default function Column({ height, columnName, columnId, columnIndex, columnOnDrop }) {
  const { data: CARDS } = useGetCardsQuery(columnId);

  const [cardPositionUpdate] = useUpdateCardInColumnMutation();

  const dispatch = useDispatch();
  const storedCard = useSelector(cardData);

  const [cards, setCards] = useState(CARDS);
  const [columnDragging, setColumnDragging] = useState(false);
  const [showDropIndicatorForEmptyColumn, setShowDropIndicatorForEmptyColumn] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [preview, setPreview] = useState(null);
  const [textAreaText, setTextAreaText] = useState(columnName);
  const [isEditable, setIsEditable] = useState(false);  // Управляем режимом редактирования

  const columnInnerRef = useRef(null);
  const columnRef = useRef(null);
  const columnHeaderRef = useRef(null)

  const ColumnPreview = () => {
    return (
      <List
        className="scroll-container"
        sx={{ ...style.list, maxHeight: `${height - 90}px` }}
        subheader={
          <ListSubheader
            sx={{
              width: "100%",
              height: "40px",
              textAlign: "center",
            }}
            titletypographyprops={{
              fontSize: "20px",
              color: "#172b4d",
            }}
          >
              <TextareaColumnName
                disabled={false}
                aria-label="empty textarea"
                placeholder="Дайте имя колонке..."
                value={textAreaText}
                onChange={(event) => {
                  setTextAreaText(event.target.value);
                }}
              />
          </ListSubheader>
        }
      >
        {!!cards &&
          cards.map((card, index) => {
            const { id } = card;
            return (
              <ListItem key={id}>
                <TaskCard columnId={columnId} {...card} index={index} columnIndex={columnIndex} />
              </ListItem>
            );
          })}
      </List>
    );
  };

  useEffect(() => {
    if (CARDS) {
      const newCards = Array.from(CARDS);
      newCards.sort((a, b) => {
        a.card_in_columns[0].position_in_column > b.card_in_columns[0].position_in_column ? 1 : -1;
      });

      setCards(newCards);
    }
  }, [CARDS]);

  useEffect(() => {
    const element = columnRef.current;
    return combine(
      draggable({
        element,
        getInitialData: () => ({
          columnIndex,
          columnId,
          type: "column",
          columnHeight: element.clientHeight,
        }),
        onDragStart() {
          setColumnDragging(true);
        },
        onDrop() {
          setColumnDragging(false);
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
          const data = { columnId, type: "column" };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          const targetColumn = args.location.current.dropTargets[0].data.columnId;
          const targetType = args.location.current.dropTargets[0].data.type;
          const sourceType = args.location.initial.dropTargets[0].data.type;
          const dropTargetsLength = args.location.current.dropTargets.length;

          if (
            targetColumn === columnId &&
            cards.length === 0 &&
            sourceType === "card" &&
            targetType === "column" &&
            dropTargetsLength === 1
          ) {
            setShowDropIndicatorForEmptyColumn(true);
          }
        },
        onDrag: (args) => {
          const targetColumnId = args.source.data.columnId;
          const type = args.source.data.type;

          if (targetColumnId !== columnId && type === "column") {
            setClosestEdge(extractClosestEdge(args.self.data));
            setPlaceholderHeight(args.source.data.columnHeight);
          }
        },
        onDragLeave: () => {
          setShowDropIndicatorForEmptyColumn(false);
          setClosestEdge(null);
          setPlaceholderHeight(0);
        },
        onDrop: (args) => {
          setClosestEdge(null);
          setPlaceholderHeight(0);
          if (args.source.data.type === "column") columnOnDrop(args);
        },
        getIsSticky: () => true,
      }),
      monitorForElements({
        element,
        onDragStart: (args) => {
          cardOnDragStart(args);
        },
        onDrag: (args) => {
          if (args.location.current.dropTargets.length === 0) return;
          const targetColumnId = args.location.current.dropTargets[0].data.columnId;
          const sourceType = args.location.initial.dropTargets[0].data.type;

          if (targetColumnId !== columnId && sourceType === "card") {
            setPlaceholderHeight(args.source.data.cardHeight);
          }
        },
        onDrop: (args) => {
          if (args.location.current.dropTargets.length === 0) return;
          const sourceType = args.location.initial.dropTargets[0].data.type;
          const targetColumnId = args.location.current.dropTargets[0].data.columnId;

          if (targetColumnId === columnId && sourceType === "card") {
            cardOnDrop(args);
          }
          setShowDropIndicatorForEmptyColumn(false);
        },
      }),
      autoScrollForElements({
        element: columnInnerRef.current,
      })
    );
  }, [cards])

  useEffect(() => {
    setTimeout(() => {
      if (columnHeaderRef.current) {
        isEditable && columnHeaderRef.current.focus(); // Устанавливаем фокус на текстовое поле
      }
    }, 0); // Задержка в 0 мс, чтобы блок успел удалиться

  },[isEditable])

  const cardOnDragStart = (args) => {
    const sourceCardId = args.source.data.cardId;
    const newCards = Array.from(cards);
    let removeCardIndex = -1;

    cards.forEach((card, index) => {
      if (card.id === sourceCardId) {
        removeCardIndex = index;
      }
    });

    const oneCard = cards[removeCardIndex];
    removeCardIndex !== -1 && dispatch(storeOneCard(oneCard));
    removeCardIndex !== -1 && newCards.splice(removeCardIndex, 1);
    setCards(newCards);
  };

  const cardOnDrop = async (args) => {
    const targetCardDropPlace = args.location.current.dropTargets[0].data.cardId;
    const sourceCardIndex = args.source.data.cardIndex;

    const closestEdge = extractClosestEdge(args.location.current.dropTargets[0].data);

    let dropIndex = cards.findIndex((card) => card.id === targetCardDropPlace);

    const newCards = Array.from(cards);

    if (closestEdge === "bottom") dropIndex = dropIndex + 1;
    if (args.location.current.dropTargets.length === 1) dropIndex = sourceCardIndex;

    dropIndex !== -1 && newCards.splice(dropIndex, 0, storedCard.card);
    dropIndex !== -1 && setCards(newCards);

    try {
      const newCardsArr = newCards.map((card, index) => {
        return { card_id: card.id, index };
      });
      const target_column_id = args.location.current.dropTargets[0].data.columnId;
      cardPositionUpdate({ target_column_id, cards: newCardsArr });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockClick = () => {
    setIsEditable(true);  // Разблокируем поле при клике на блок
};

const handleBlur = () => {
    setIsEditable(false);  // Блокируем поле при потере фокуса
};

  return (
    <Box
      ref={columnRef}
      sx={{
        display: "flex",
        flexDirection: closestEdge === "left" ? "row-reverse" : "row",
      }}
    >
      <div
        id={`column-${columnId}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          width: "290px",
          opacity: columnDragging ? "0.5" : "1",
        }}
        // style={style}
        className="column-container"
      >
        <List
          ref={columnInnerRef}
          className="scroll-container"
          sx={{ ...style.list, maxHeight: `${height - 90}px` }}
          subheader={
            <ListSubheader
              sx={{
                readOnly: 'false',
                display: 'flex',
                flexDirection:"column",
                alignItems:"center",
                padding:"5px",
                width: "100%",
                height: 'fitcontent',//"40px",
                textAlign: "center",
              }}
              titletypographyprops={{
                ":readOnly": 'false',

                fontSize: "20px",
                color: "#172b4d",
              }}
            >
              {!isEditable && (
                <div
                    style={{

                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0)',  // Прозрачный блок
                        zIndex: 1,
                        cursor: 'move',  // Указатель для перетаскивания
                    }}
                    onClick={handleBlockClick}  // При клике разблокируем текстовое поле
                />
            )}
              <TextareaColumnName
                ref={columnHeaderRef}
                onBlur={handleBlur}  // Блокируем текстовое поле при потере фокуса
                aria-label="empty textarea"
                placeholder="Дайте имя колонке..."
                value={textAreaText}
                onChange={(event) => {
                  setTextAreaText(event.target.value);
                }}
              />
            </ListSubheader>
          }
        >
          {showDropIndicatorForEmptyColumn && <DropIndicator height={placeholderHeight} />}
          {!!cards &&
            cards.map((card, index) => {
              const { id } = card;
              return (
                <ListItem key={id}>
                  <TaskCard columnId={columnId} {...card} index={index} columnIndex={columnIndex} />
                </ListItem>
              );
            })}
        </List>
      </div>
      {closestEdge && <DropIndicator height={placeholderHeight} />}
      {preview && createPortal(<ColumnPreview />, preview)}
    </Box>
  );
}
