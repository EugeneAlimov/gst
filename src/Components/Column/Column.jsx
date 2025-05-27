import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";

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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

//import RTK QUERY
import {
  useGetCardsQuery,
  useUpdateCardInColumnMutation,
  useCreateNewCardMutation,
} from "../../Redux/cards/cards-operations";
import { useUpdateColumnDetailsMutation } from "../../Redux/columns/column-operations";

// import components
import TaskCard from "../Card/TaskCard";
import DropIndicator from "../UI/DropIndicator";
import ColumnPreview from "../UI/ColumnPreview";

//import styles
import * as style from "../../constants/ColumnViewStyles";

//import constants
import { cardTemplate } from "../../constants/objects";
import { TextareaColumnName } from "../Card/AllSettingsOfCard/styleConst";
import { IconButton, Typography } from "@mui/material";

import {
  newCardCreater,
  cardOnDrop,
  cardOnDragStart,
  handleBlockClick,
  handleBlur,
} from "../../libs/libs";

export default function Column({
  columnName,
  columnId,
  columnIndex,
  boardHeight,
  activeBoardId,
  allChips,
}) {
  const { data: CARDS } = useGetCardsQuery(columnId);

  const [cardPositionUpdate] = useUpdateCardInColumnMutation();
  const [cardCreater] = useCreateNewCardMutation();
  const [headerTextUpdater] = useUpdateColumnDetailsMutation();

  const dispatch = useDispatch();
  const storedCard = useSelector(cardData);

  const [cards, setCards] = useState(CARDS);
  const [columnDragging, setColumnDragging] = useState(false);
  const [showDropIndicatorForEmptyColumn, setShowDropIndicatorForEmptyColumn] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [preview, setPreview] = useState(null);
  const [headerText, setHeaderText] = useState(columnName);
  const [headerTextBuffer, setHeaderTextBuffer] = useState("");

  const [isEditable, setIsEditable] = useState(false); // Управляем режимом редактирования
  const [anchorElUser, setAnchorElUser] = useState(null);

  const columnInnerRef = useRef(null);
  const columnRef = useRef(null);
  const columnHeaderRef = useRef(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (CARDS && Array.isArray(CARDS)) {
      const newCards = Array.from(CARDS);

      // Правильная сортировка
      newCards.sort((a, b) => {
        const posA = a.card_in_columns?.[0]?.position_in_column || 0;
        const posB = b.card_in_columns?.[0]?.position_in_column || 0;
        return posA - posB;
      });

      setCards(newCards);
    } else {
      setCards([]);
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
        onDrop: () => {
          setClosestEdge(null);
          setPlaceholderHeight(0);
        },
        getIsSticky: () => true,
      }),
      monitorForElements({
        element,
        onDragStart: (args) => {
          cardOnDragStart(args, cards, dispatch, storeOneCard, setCards);
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
            cardOnDrop(args, cards, setCards, cardPositionUpdate, storedCard);
          }
          setShowDropIndicatorForEmptyColumn(false);
        },
      }),
      autoScrollForElements({
        element: columnInnerRef.current,
      })
    );
  }, [cards]);

  useEffect(() => {
    setTimeout(() => {
      if (columnHeaderRef.current) {
        isEditable && columnHeaderRef.current.focus(); // Устанавливаем фокус на текстовое поле
      }
    }, 0); // Задержка в 0 мс, чтобы блок успел удалиться
  }, [isEditable]);

  return (
    <Box
      ref={columnRef}
      sx={{
        display: "flex",
        flexDirection: closestEdge === "left" ? "row-reverse" : "row",
      }}
    >
      <Box
        id={`column-${columnId}`}
        sx={{
          maxHeight: `${boardHeight - 30}px`,
          borderRadius: "4px",
          boxShadow: "10",
          marginLeft: "5px",
          marginRight: "5px",
          backgroundColor: "#d5d2d2",
          display: "flex",
          flexDirection: "column",
          opacity: columnDragging ? "0.5" : "1",
        }}
        className="column-container"
      >
        <List
          ref={columnInnerRef}
          className="scroll-container"
          sx={{ ...style.list }}
          subheader={
            <ListSubheader
              sx={{
                borderTopRightRadius: "4px",
                borderTopLeftRadius: "4px",
                readOnly: "false",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                paddingY: "5px",
                width: "100%",
                height: "fitcontent",
                textAlign: "center",
              }}
              titletypographyprops={{
                ":readOnly": "false",
                fontSize: "20px",
                color: "#172b4d",
              }}
            >
              {!isEditable && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "85%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0)", // Прозрачный блок
                    zIndex: 1,
                    cursor: "move", // Указатель для перетаскивания
                  }}
                  onClick={() => handleBlockClick(setIsEditable, setHeaderTextBuffer, headerText)} // При клике разблокируем текстовое поле
                />
              )}
              <TextareaColumnName
                ref={columnHeaderRef}
                onBlur={() =>
                  handleBlur(
                    setIsEditable,
                    setHeaderTextBuffer,
                    headerText,
                    headerTextBuffer,
                    headerTextUpdater,
                    columnId,
                    { name: headerText }
                  )
                } // Блокируем текстовое поле при потере фокуса
                aria-label="empty textarea"
                placeholder="Дайте имя колонке..."
                value={headerText}
                onChange={(event) => {
                  setHeaderText(event.target.value);
                }}
              />
              <IconButton onClick={handleOpenUserMenu} sx={{ padding: "2px", borderRadius: "4px" }}>
                <DehazeOutlinedIcon />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={1} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{"Архивировать"}</Typography>
                </MenuItem>{" "}
                <MenuItem key={2} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{"Сменить доску"}</Typography>
                </MenuItem>
              </Menu>
            </ListSubheader>
          }
        >
          {showDropIndicatorForEmptyColumn && <DropIndicator height={placeholderHeight} />}
          {!!cards &&
            cards.map((card, index) => {
              const { id } = card;
              return (
                <ListItem
                  key={id}
                  sx={{
                    flexDirection: "column",
                    paddingBottom: "0px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                  }}
                >
                  <TaskCard columnId={columnId} {...card} index={index} allChips={allChips} />
                </ListItem>
              );
            })}
        </List>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingX: "10px",
            width: "100%",
            height: "40px",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            cursor: "pointer",
            boxShadow: "10",
            backgroundColor: "#e1e0e0",
            "&:hover": {
              backgroundColor: "#ebeaea",
            },
          }}
          onClick={() => newCardCreater(cardCreater, cardTemplate, activeBoardId, columnId, CARDS)}
        >
          <AddOutlinedIcon sx={{ marginX: "5px" }} />
          <Typography>{"Добавить новую карточку"}</Typography>
        </Box>
      </Box>
      {closestEdge && <DropIndicator height={placeholderHeight} />}
      {preview &&
        createPortal(
          <ColumnPreview
            style={style}
            boardHeight={boardHeight}
            headerText={headerText}
            cards={cards}
            columnId={columnId}
            columnIndex={columnIndex}
            TextareaColumnName={TextareaColumnName}
            TaskCard={TaskCard}
          />,
          preview
        )}
    </Box>
  );
}
