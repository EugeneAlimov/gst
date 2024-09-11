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
import { cardData, storeOneCard } from "../Redux/cards/card-slice";
import { columnData, storeOneColumn } from "../Redux/columns/column-slice";

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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import { Stack } from "@mui/material";

//import MIU icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

//import RTK QUERY
import { useGetAllChipsQuery } from "../Redux/chip/chip-operations";
import { useGetCardsQuery, useUpdateCardInColumnMutation } from "../Redux/cards/cards-operations";
import { useGetColumnsQuery } from "../Redux/columns/column-operations";
import { popUpToOpen } from "../Redux/chip/chip-slice";
import { boardData } from "../Redux/board/board-slice";

// import components
import AllSettingsOfCard from "../Components/Card/AllSettingsOfCard/AllSettingsOfCard";
import EditButtonsGroup from "../Components/Card/EditButtonsGroup/EditButtonsGroup";
import CardImage from "../Components/Card/CardImageSection/CardImage";
import CardChipContainer from "../Components/Card/CardChipsSection/CardChipContainer";
import CardStatistic from "../Components/Card/CardStatisticIconsSection/CardStatistic";
import CardDescription from "../Components/Card/CardDescriptionSection/CardDescription";
import CardAvatarSection from "../Components/Card/Avatar/CardAvatarSection";

//import styles
import * as style from "../constants/ColumnViewStyles";

import useWindowDimensions from "./useWindowDimentions";
import invariant from "tiny-invariant";
import { createPortal } from "react-dom";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper sx={style.draggablePaper} {...props} />
    </Draggable>
  );
};

const DropIndicator = ({ height }) => {
  return (
    <Box
      sx={{
        display: "block",
        position: "relative",
        width: "256px",
        height: `${height}px`, //"30px",
        backgroundColor: "green",
        marginY: "10px",
      }}
    />
  );
};

const TaskCard = ({
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
  // columnIndex,
}) => {
  const dispatch = useDispatch();

  const { data: allChips } = useGetAllChipsQuery();
  const cardRef = useRef(null);

  const [showEditIcon, setShowEditIcon] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [popupType, setPopupType] = useState(0);
  const [chipsArr, setChipsArr] = useState([]);
  const [cardDragging, setCardDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [closestEdge, setClosestEdge] = useState(null);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);

  function Pop(type, handleClickOpen, id, date_time_finish, date_time_start, status) {
    let pop = null;

    switch (type) {
      case 1:
        pop = (
          <AllSettingsOfCard
            date_time_finish={date_time_finish}
            date_time_start={date_time_start}
            status={status}
            cardId={id}
          />
        );
        break;
      case 2:
        pop = (
          <EditButtonsGroup columnId={columnId} handleClickOpen={handleClickOpen} cardId={id} />
        );
        break;

      default:
        break;
    }
    return pop;
  }

  const CardPreview = () => {
    return (
      <Card sx={{ ...style.cardStyle }}>
        <CardImage />
        <CardContent sx={style.CardContentStyle}>
          <CardChipContainer chips={chipsArr} cardId={id} />
          <CardDescription cardText={text} />
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
      </Card>
    );
  };

  const handleAllSettingsOfCardOpen = (type) => {
    setOpenPop(true);
    switch (type) {
      case 1:
        setPopupType(type);
        break;
      case 2:
        setPopupType(type);
        break;
      default:
        setPopupType(0);
    }
  };

  const handleAllSettingsOfCardClose = () => {
    setOpenPop(false);
    setPopupType(0);
    dispatch(popUpToOpen(0));
  };

  useEffect(() => {
    if (!!!allChips) return;
    const cardChips = allChips.filter((chip) => chip.card.includes(id));
    setChipsArr(cardChips);
  }, [allChips, id]);

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

  return (
    <Box
      ref={cardRef}
      sx={{
        display: "flex",
        flexDirection: closestEdge === "top" ? "column-reverse" : "column",
      }}
    >
      <Card
        sx={{ ...style.cardStyle }}
        style={cardDragging ? { opacity: 0.5 } : {}}
        onMouseOver={() => setShowEditIcon(true)}
        onMouseOut={() => setShowEditIcon(false)}
      >
        {showEditIcon && (
          <Box sx={style.boxEditOutlinedIconStyle}>
            <IconButton onClick={() => handleAllSettingsOfCardOpen(2)} aria-label="edit">
              <EditOutlinedIcon />
            </IconButton>
          </Box>
        )}
        <Box onClick={() => handleAllSettingsOfCardOpen(1)}>
          <CardImage />
          <CardContent sx={style.CardContentStyle}>
            <CardChipContainer chips={chipsArr} cardId={id} />
            <CardDescription cardText={text} />
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
        onClose={handleAllSettingsOfCardClose}
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
            onClick={handleAllSettingsOfCardClose}
          >
            <CloseOutlinedIcon sx={{ color: "#fff" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={style.dialogContent}>
          {Pop(
            popupType,
            handleAllSettingsOfCardOpen,
            id,
            date_time_finish,
            date_time_start,
            status
          )}
        </DialogContent>
      </Dialog>
      {closestEdge && <DropIndicator height={placeholderHeight} />}
      {preview && createPortal(<CardPreview />, preview)}
    </Box>
  );
};

const Column = ({ height, columnId, columnIndex }) => {
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

  const columnInnerRef = useRef(null);
  const columnRef = useRef(null);

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
            {"В работе"}
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
    if (CARDS) setCards(CARDS);
  }, [CARDS]);

  useEffect(() => {
    const element = columnInnerRef.current;
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
          cardOnDragStart(args);
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
  }, [cards]);

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

  const cardOnDrop = (args) => {
    const targetCardDropPlace = args.location.current.dropTargets[0].data.cardId;
    const sourceCardIndex = args.source.data.cardIndex;

    const closestEdge = extractClosestEdge(args.location.current.dropTargets[0].data);

    let dropIndex = cards.findIndex((card) => card.id === targetCardDropPlace);

    const newCards = Array.from(cards);

    if (closestEdge === "bottom") dropIndex = dropIndex + 1;
    if (args.location.current.dropTargets.length === 1) dropIndex = sourceCardIndex;

    dropIndex !== -1 && newCards.splice(dropIndex, 0, storedCard.card);
    dropIndex !== -1 && setCards(newCards);
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
                width: "100%",
                height: "40px",
                textAlign: "center",
              }}
              titletypographyprops={{
                fontSize: "20px",
                color: "#172b4d",
              }}
            >
              {"В работе"}
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
};

const ColumnsView = () => {
  const boardDataFromState = useSelector(boardData);
  const acitiveBoardId = boardDataFromState.id;

  const { data: COLUMNS } = useGetColumnsQuery(acitiveBoardId);
  const [columns, setColumns] = useState(COLUMNS || []);
  const [width, height] = useWindowDimensions();

  const dispatch = useDispatch();
  const storedColumn = useSelector(columnData);

  const ref = useRef(null);

  useEffect(() => {
    if (COLUMNS) setColumns(COLUMNS);
  }, [COLUMNS]);

  useEffect(() => {
    const element = ref.current;
    return combine(
      monitorForElements({
        element,
        onDragStart: (args) => {
          const type = args.source.data.type;
          if (type === "column") {
            columnDragStart(args);
          }
        },
        onDrop: (args) => {
          if (args.source.data.type === 'card') return
          columnOnDrop(args);
        },
      })
    );
  }, [columns]);

  const columnDragStart = (args) => {
    const sourcecolumnId = args.source.data.columnId;
    const newColumns = Array.from(columns);
    let removeColumnIndex = -1;

    columns.forEach((column, index) => {
      if (column.id === sourcecolumnId) {
        removeColumnIndex = index;
      }
    });

    const oneColumn = columns[removeColumnIndex];
    removeColumnIndex !== -1 && dispatch(storeOneColumn(oneColumn));
    removeColumnIndex !== -1 && newColumns.splice(removeColumnIndex, 1);
    setColumns(newColumns);
  };

  const columnOnDrop = (args) => {
    let data
    let dropIndex
    const targetLenght = args.location.current.dropTargets.length

    if (targetLenght > 0) {
      data = targetLenght === 1
        ? args.location.current.dropTargets[0].data
        : args.location.current.dropTargets[1].data;

      const targetColumnDropPlace = data.columnId;
      const closestEdge = extractClosestEdge(data);

      dropIndex = columns.findIndex((column) => column.id === targetColumnDropPlace);

      if (closestEdge === "right") dropIndex = dropIndex + 1;

    } else {
        dropIndex = args.source.data.columnIndex
    }
    const newColumns = Array.from(columns);

    dropIndex !== -1 && newColumns.splice(dropIndex, 0, storedColumn.column);
    dropIndex !== -1 && setColumns(newColumns);
  };

  return (
    <Stack
      ref={ref}
      sx={{ height: `${height - 64}` }}
      mt={2}
      mx={2}
      direction="row"
      alignItems="flex-start"
    >
      {!!COLUMNS &&
        columns.map((column, index) => {
          const { id: columnId, name, position_on_board } = column;
          return <Column key={columnId} height={height} columnId={columnId} columnIndex={index} />;
        })}
    </Stack>
  );
};

export default ColumnsView;
