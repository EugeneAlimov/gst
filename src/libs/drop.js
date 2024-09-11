// import React, { useRef, useEffect, useState, useCallback } from "react";
// import Draggable from "react-draggable";
// // import { useSortable } from '@dnd-kit/sortable';
// // import { CSS } from '@dnd-kit/utilities';
// // import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
// // import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
//   // createHorizontalStrength,
// import { useDrag, useDrop, DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import withScrolling, {
//   createHorizontalStrength,
//   createVerticalStrength,
// } from "react-dnd-scrollzone";
// import { useDispatch, useSelector } from "react-redux";

// import "@fontsource/roboto/400.css";

// //import MIU components
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import IconButton from "@mui/material/IconButton";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Paper from "@mui/material/Paper";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListSubheader from "@mui/material/ListSubheader";
// import { Stack } from "@mui/material";

// //import MIU icons
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// //import RTK QUERY
// import { useGetAllChipsQuery } from "../Redux/chip/chip-operations";
// import { useGetCardsQuery, useUpdateCardInColumnMutation } from "../Redux/cards/cards-operations";
// import { useGetColumnsQuery } from "../Redux/columns/column-operations";
// import { popUpToOpen } from "../Redux/chip/chip-slice";
// import { boardData } from "../Redux/board/board-slice";

// // import components
// import AllSettingsOfCard from "../Components/Card/AllSettingsOfCard/AllSettingsOfCard";
// import EditButtonsGroup from "../Components/Card/EditButtonsGroup/EditButtonsGroup";
// import CardImage from "../Components/Card/CardImageSection/CardImage";
// import CardChipContainer from "../Components/Card/CardChipsSection/CardChipContainer";
// import CardStatistic from "../Components/Card/CardStatisticIconsSection/CardStatistic";
// import CardDescription from "../Components/Card/CardDescriptionSection/CardDescription";
// import CardAvatarSection from "../Components/Card/Avatar/CardAvatarSection";

// //import styles
// import * as style from "../constants/ColumnViewStyles";

// import useWindowDimensions from "./useWindowDimentions";

// const ScrollZone = withScrolling(List);
// const verticalStrength = createVerticalStrength(150);
// const horizontalStrength = createHorizontalStrength(150);

// const DropPlaceholder = ({ height }) => {
//   console.log("placeholder");
//   return (
//     <div
//       style={{
//         height: `${height}px`,
//         width: "100%",
//         backgroundColor: "#f0f0f0",
//         border: "1px dashed #ccc",
//         margin: "4px 0",
//       }}
//     />
//   );
// };

// const PaperComponent = (props) => {
//   return (
//     <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
//       <Paper sx={style.draggablePaper} {...props} />
//     </Draggable>
//   );
// };

// const TaskCard = ({
//   columnId,
//   // board,
//   checklist_how_many,
//   // column,
//   comments_how_many,
//   // created,
//   date_time_finish,
//   date_time_start,
//   // header_color,
//   // header_image,
//   id,
//   in_process,
//   // is_archived,
//   is_subscribed,
//   is_have_description,
//   // name,
//   // position_in_column,
//   text,
//   status,
//   // updated,
//   moveCardListItem,
//   index,
//   columnIndex,
//   setPlaceholderHeight,
//   setHoverIndex,
//   // setDraggingIndex,
// }) => {
//   const dispatch = useDispatch();

//   const { data: allChips } = useGetAllChipsQuery();

//   const [showEditIcon, setShowEditIcon] = useState(false);
//   const [openPop, setOpenPop] = useState(false);
//   const [popupType, setPopupType] = useState(0);
//   const [chipsArr, setChipsArr] = useState([]);

//   useEffect(() => {
//     if (ref.current) {
//       const height = ref.current.getBoundingClientRect().height;
//       setPlaceholderHeight(height);
//     }
//   }, [setPlaceholderHeight]);

//   // useDrag - the list item is draggable
//   const [{ isDragging }, dragRef] = useDrag({
//     type: "card",
//     item: { type: "card", index, columnIndex, columnId, id },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//     end: () => {
//       console.log("end");
//       setHoverIndex(null); // Очищаем состояние после завершения перетаскивания
//     },
//   });

//   const [, dropRef] = useDrop({
//     accept: "card",
//     hover: (card, monitor) => {
//       if (!ref.current) return;

//       const dragCardIndex = card.index;
//       const sourceCardId = card.id;
//       const hoverCardIndex = index;
//       const hoverCardId = id;

//       const sourceColumnId = card.columnId;
//       const targetColumnId = columnId;

//       if (sourceCardId === hoverCardId) return;
//       if (dragCardIndex === hoverCardIndex) return;

//       const hoverBoundingRect = ref.current?.getBoundingClientRect();
//       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY = clientOffset.y - hoverBoundingRect.top;

//       const isMovingDown = dragCardIndex < hoverCardIndex && hoverClientY > hoverMiddleY;
//       const isMovingUp = dragCardIndex > hoverCardIndex && hoverClientY < hoverMiddleY;

//       if (isMovingDown || isMovingUp) {
//         moveCardListItem(
//           dragCardIndex,
//           hoverCardIndex,
//           sourceColumnId,
//           targetColumnId,
//           sourceCardId,
//           hoverCardId
//         );
//         // setDraggingIndex(dragCardIndex)
//         setHoverIndex(hoverCardIndex);
//         card.index = hoverCardIndex;
//       }
//     },
//   });

//   // Join the 2 refs together into one (both draggable and can be dropped on)
//   const ref = useRef(null);
//   const dragDropRef = dragRef(dropRef(ref));

//   function Pop(type, handleClickOpen, id, date_time_finish, date_time_start, status) {
//     let pop = null;

//     switch (type) {
//       case 1:
//         pop = (
//           <AllSettingsOfCard
//             date_time_finish={date_time_finish}
//             date_time_start={date_time_start}
//             status={status}
//             cardId={id}
//           />
//         );
//         break;
//       case 2:
//         pop = (
//           <EditButtonsGroup columnId={columnId} handleClickOpen={handleClickOpen} cardId={id} />
//         );
//         break;

//       default:
//         break;
//     }
//     return pop;
//   }

//   const handleAllSettingsOfCardOpen = (type) => {
//     setOpenPop(true);
//     switch (type) {
//       case 1:
//         setPopupType(type);
//         break;
//       case 2:
//         setPopupType(type);
//         break;
//       default:
//         setPopupType(0);
//     }
//   };

//   const handleAllSettingsOfCardClose = () => {
//     setOpenPop(false);
//     setPopupType(0);
//     dispatch(popUpToOpen(0));
//   };

//   useEffect(() => {
//     if (!!!allChips) return;
//     const cardChips = allChips.filter((chip) => chip.card.includes(id));
//     setChipsArr(cardChips);
//   }, [allChips, id]);

//   if (isDragging) {
//     return null; // Скрываем карточку при перетаскивании
//   }

//   return (
//     <>
//       <Card
//         sx={{ ...style.cardStyle }}
//         onMouseOver={() => setShowEditIcon(true)}
//         onMouseOut={() => setShowEditIcon(false)}
//         ref={dragDropRef}
//       >
//         {showEditIcon && (
//           <Box sx={style.boxEditOutlinedIconStyle}>
//             <IconButton onClick={() => handleAllSettingsOfCardOpen(2)} aria-label="edit">
//               <EditOutlinedIcon />
//             </IconButton>
//           </Box>
//         )}
//         <Box onClick={() => handleAllSettingsOfCardOpen(1)}>
//           <CardImage />
//           <CardContent sx={style.CardContentStyle}>
//             <CardChipContainer chips={chipsArr} cardId={id} />
//             <CardDescription cardText={text} />
//             <CardStatistic
//               cardId={id}
//               is_subscribed={is_subscribed}
//               in_process={in_process}
//               comments_how_many={comments_how_many}
//               checklist_how_many={checklist_how_many}
//               is_have_description={is_have_description}
//               date_time_finish={date_time_finish}
//               date_time_start={date_time_start}
//               status={status}
//             />
//             <CardAvatarSection />
//           </CardContent>
//         </Box>
//       </Card>

//       <Dialog
//         sx={{ height: "100%", backgroundColor: "rgba(0, 0, 0, 0.55)" }}
//         // scroll="body"
//         maxWidth={"xl"}
//         open={openPop}
//         onClose={handleAllSettingsOfCardClose}
//         PaperComponent={PaperComponent}
//         aria-labelledby="draggable-dialog-title"
//       >
//         <DialogTitle style={style.dialogTitle} id="draggable-dialog-title">
//           <IconButton
//             aria-label="close"
//             sx={{ backgroundColor: "#777", "&:hover": { backgroundColor: "#ccc" } }}
//             onClick={handleAllSettingsOfCardClose}
//           >
//             <CloseOutlinedIcon sx={{ color: "#fff" }} />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={style.dialogContent}>
//           {Pop(
//             popupType,
//             handleAllSettingsOfCardOpen,
//             id,
//             date_time_finish,
//             date_time_start,
//             status
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// const Column = ({ height, columnId, moveColumn, columnIndex, updateColumns }) => {
//   const { data: CARDS } = useGetCardsQuery(columnId);
//   const [cardPositionUpdate] = useUpdateCardInColumnMutation();

//   const [cards, setCards] = useState(CARDS);
//   const [placeholderHeight, setPlaceholderHeight] = useState(0);
//   const [draggingIndex, setDraggingIndex] = useState(null);
//   const [hoverIndex, setHoverIndex] = useState(null);

//   const ScrollZone = withScrolling(List);
//   const verticalStrength = createVerticalStrength(150);
//   const horizontalStrength = createHorizontalStrength(150);

//   const ref = useRef(null);

//   useEffect(() => {
//     if (!CARDS) return;
//     setCards(CARDS);
//   }, [CARDS]);

//   const cardPositionUpdater = useCallback(
//     async (request) => {
//       try {
//         await cardPositionUpdate(request);
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     [cardPositionUpdate]
//   );

//   const moveCardListItem = useCallback(
//     (dragCardIndex, hoverCardIndex, sourceColumnId, targetColumnId, sourceCardId, hoverCardId) => {
//       const dragCardItem = cards[dragCardIndex];
//       const hoverCardItem = cards[hoverCardIndex];
//       const dragCartItemPosition = dragCardItem.card_in_columns;
//       const HoverCartItemPosition = hoverCardItem.card_in_columns;

//       //не map, a reduce и вернуть объект карточки
//       const draggedCardObj = dragCartItemPosition.reduce((accumulator, item) => {
//         const cardId = item.card_id;
//         const obj = { ...item };
//         if (sourceCardId === cardId) {
//           obj.position_in_column = hoverCardIndex;
//           obj.card_id = sourceCardId;
//           obj.column_id = targetColumnId;
//         }
//         accumulator = obj;
//         return accumulator;
//       }, {});

//       const hoveredCardObj = HoverCartItemPosition.reduce((accumulator, item) => {
//         const cardId = item.card_id;
//         const obj = { ...item };
//         if (hoverCardId === cardId) {
//           obj.position_in_column = dragCardIndex;
//           obj.card_id = hoverCardId;
//           obj.column_id = targetColumnId;
//         }
//         accumulator = obj;
//         return accumulator;
//       }, {});

//       const request = [draggedCardObj, hoveredCardObj];

//       cardPositionUpdater(request);
//       // Swap places of dragItem and hoverItem in the pets array
//       setCards((cards) => {
//         const updatedCards = [...cards];
//         updatedCards[dragCardIndex] = hoverCardItem;
//         updatedCards[hoverCardIndex] = dragCardItem;

//         return updatedCards;
//       });
//       setHoverIndex(null);
//       setDraggingIndex(null); // Сбрасываем индекс перетаскиваемой карточки при дропе
//     },
//     [cardPositionUpdater, cards]
//   );

//   const [{ isDragging }, dragRef] = useDrag({
//     type: "column",
//     item: { type: "column", columnIndex },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, dropRef] = useDrop({
//     accept: ["card", "column"],
//     drop: (column, monitor) => {
//       if (column.type === "column") {
//         const dragIndex = column.columnIndex;
//         const hoverIndex = columnIndex;

//         // Если карточка перемещается ниже себя
//         if (dragIndex < hoverIndex && monitor.getItem().id === columnId) {
//           return;
//         }

//         // Если карточка перемещается над собой
//         if (dragIndex > hoverIndex && monitor.getItem().id === columnId) {
//           return;
//         }

//         moveColumn(dragIndex, hoverIndex);
//         // column.columnIndex = hoverIndex;
//       }
//     },
//   });
//   const dragColumnDropRef = dragRef(dropRef(ref));

//   return (
//     <List
//       className="scroll-container"
//       ref={dragColumnDropRef}
//       sx={{ ...style.list, maxHeight: `${height - 90}px` }}
//       subheader={
//         <ListSubheader
//           sx={{
//             width: "100%",
//             height: "40px",
//             textAlign: "center",
//           }}
//           titletypographyprops={{
//             fontSize: "20px",
//             color: "#172b4d",
//           }}
//         >
//           {"В работе"}
//         </ListSubheader>
//       }
//     >
//       {!!cards &&
//         cards.map((card, index) => {
//           const { id, name, position_on_board } = card;
//           return (
//             <ListItem key={id}>
//               {hoverIndex === index && <DropPlaceholder height={placeholderHeight} />}
//               <TaskCard
//                 columnId={columnId}
//                 {...card}
//                 index={index}
//                 moveCardListItem={moveCardListItem}
//                 columnIndex={columnIndex}
//                 sourceColumnIndex={columnIndex}
//                 setPlaceholderHeight={setPlaceholderHeight}
//                 // setDraggingIndex={setDraggingIndex}
//                 setHoverIndex={setHoverIndex}
//               />
//             </ListItem>
//           );
//         })}
//     </List  >
//   );
// };

// const ColumnsView = () => {
//   const boardDataFromState = useSelector(boardData);
//   const acitiveBoardId = boardDataFromState.id;

//   const { data: COLUMNS } = useGetColumnsQuery(acitiveBoardId);
//   const [columns, setColumns] = useState(COLUMNS);
//   const [width, height] = useWindowDimensions();

//   useEffect(() => {
//     if (!COLUMNS) return;
//     setColumns(COLUMNS);
//   }, [COLUMNS]);

//   const moveColumn = useCallback(
//     (dragIndex, hoverIndex) => {
//       const dragColumn = columns[dragIndex];
//       const hoverItem = columns[hoverIndex];

//       setColumns((columns) => {
//         const updatedColumns = [...columns];
//         updatedColumns[dragIndex] = hoverItem;
//         updatedColumns[hoverIndex] = dragColumn;

//         return updatedColumns;
//       });
//     },
//     [columns]
//   );

//   return (
//     <DndProvider backend={HTML5Backend}>

//     <Stack
//       sx={{ height: `${height - 64}` }}
//       mt={2}
//       mx={2}
//       direction="row"
//       justifyContent="flex-start"
//       alignItems="flex-start"
//       spacing={3}
//     >
//       {!!columns &&
//         columns.map((column, index) => {
//           const { id: columnId, name, position_on_board } = column;
//           return (
//             <Column
//               key={columnId}
//               height={height}
//               columnId={columnId}
//               columnIndex={index}
//               moveColumn={moveColumn}
//             />
//           );
//         })}
//     </Stack>
//     </DndProvider>
//   );
// };

// export default ColumnsView;



// **********************************************************************

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import Draggable from "react-draggable";
// import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
// import { CSS } from '@dnd-kit/utilities';
// import {useSortable, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
// //   createHorizontalStrength,
// // import { useDrag, useDrop, DndProvider } from "react-dnd";
// // import { HTML5Backend } from "react-dnd-html5-backend";
// // import withScrolling, {
// //   createHorizontalStrength,
// //   createVerticalStrength,
// // } from "react-dnd-scrollzone";
// import { useDispatch, useSelector } from "react-redux";

// import "@fontsource/roboto/400.css";

// //import MIU components
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import IconButton from "@mui/material/IconButton";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Paper from "@mui/material/Paper";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListSubheader from "@mui/material/ListSubheader";
// import { Stack } from "@mui/material";

// //import MIU icons
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// //import RTK QUERY
// import { useGetAllChipsQuery } from "../Redux/chip/chip-operations";
// import { useGetCardsQuery, useUpdateCardInColumnMutation } from "../Redux/cards/cards-operations";
// import { useGetColumnsQuery } from "../Redux/columns/column-operations";
// import { popUpToOpen } from "../Redux/chip/chip-slice";
// import { boardData } from "../Redux/board/board-slice";

// // import components
// import AllSettingsOfCard from "../Components/Card/AllSettingsOfCard/AllSettingsOfCard";
// import EditButtonsGroup from "../Components/Card/EditButtonsGroup/EditButtonsGroup";
// import CardImage from "../Components/Card/CardImageSection/CardImage";
// import CardChipContainer from "../Components/Card/CardChipsSection/CardChipContainer";
// import CardStatistic from "../Components/Card/CardStatisticIconsSection/CardStatistic";
// import CardDescription from "../Components/Card/CardDescriptionSection/CardDescription";
// import CardAvatarSection from "../Components/Card/Avatar/CardAvatarSection";

// //import styles
// import * as style from "../constants/ColumnViewStyles";

// import useWindowDimensions from "./useWindowDimentions";

// // const ScrollZone = withScrolling(List);
// // const verticalStrength = createVerticalStrength(150);
// // const horizontalStrength = createHorizontalStrength(150);

// const DropPlaceholder = ({ height }) => {
//   console.log("placeholder");
//   return (
//     <div
//       style={{
//         height: `${height}px`,
//         width: "100%",
//         backgroundColor: "#f0f0f0",
//         border: "1px dashed #ccc",
//         margin: "4px 0",
//       }}
//     />
//   );
// };

// const PaperComponent = (props) => {
//   return (
//     <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
//       <Paper sx={style.draggablePaper} {...props} />
//     </Draggable>
//   );
// };

// const TaskCard = ({
//   columnId,
//   // board,
//   checklist_how_many,
//   // column,
//   comments_how_many,
//   // created,
//   date_time_finish,
//   date_time_start,
//   // header_color,
//   // header_image,
//   id,
//   in_process,
//   // is_archived,
//   is_subscribed,
//   is_have_description,
//   // name,
//   // position_in_column,
//   text,
//   status,
//   // updated,
//   moveCardListItem,
//   index,
//   columnIndex,
//   setPlaceholderHeight,
//   setHoverIndex,
//   // setDraggingIndex,
// }) => {
//   const dispatch = useDispatch();

//   const { data: allChips } = useGetAllChipsQuery();

//   const [showEditIcon, setShowEditIcon] = useState(false);
//   const [openPop, setOpenPop] = useState(false);
//   const [popupType, setPopupType] = useState(0);
//   const [chipsArr, setChipsArr] = useState([]);

//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   function Pop(type, handleClickOpen, id, date_time_finish, date_time_start, status) {
//     let pop = null;

//     switch (type) {
//       case 1:
//         pop = (
//           <AllSettingsOfCard
//             date_time_finish={date_time_finish}
//             date_time_start={date_time_start}
//             status={status}
//             cardId={id}
//           />
//         );
//         break;
//       case 2:
//         pop = (
//           <EditButtonsGroup columnId={columnId} handleClickOpen={handleClickOpen} cardId={id} />
//         );
//         break;

//       default:
//         break;
//     }
//     return pop;
//   }

//   const handleAllSettingsOfCardOpen = (type) => {
//     setOpenPop(true);
//     switch (type) {
//       case 1:
//         setPopupType(type);
//         break;
//       case 2:
//         setPopupType(type);
//         break;
//       default:
//         setPopupType(0);
//     }
//   };

//   const handleAllSettingsOfCardClose = () => {
//     setOpenPop(false);
//     setPopupType(0);
//     dispatch(popUpToOpen(0));
//   };

//   useEffect(() => {
//     if (!!!allChips) return;
//     const cardChips = allChips.filter((chip) => chip.card.includes(id));
//     setChipsArr(cardChips);
//   }, [allChips, id]);


//   return (
//     <>
//       <Card 
//       ref={setNodeRef} style={style} {...attributes} {...listeners}
//         sx={{ ...style.cardStyle }}
//         onMouseOver={() => setShowEditIcon(true)}
//         onMouseOut={() => setShowEditIcon(false)}
//       >
//         {showEditIcon && (
//           <Box sx={style.boxEditOutlinedIconStyle}>
//             <IconButton onClick={() => handleAllSettingsOfCardOpen(2)} aria-label="edit">
//               <EditOutlinedIcon />
//             </IconButton>
//           </Box>
//         )}
//         <Box onClick={() => handleAllSettingsOfCardOpen(1)}>
//           <CardImage />
//           <CardContent sx={style.CardContentStyle}>
//             <CardChipContainer chips={chipsArr} cardId={id} />
//             <CardDescription cardText={text} />
//             <CardStatistic
//               cardId={id}
//               is_subscribed={is_subscribed}
//               in_process={in_process}
//               comments_how_many={comments_how_many}
//               checklist_how_many={checklist_how_many}
//               is_have_description={is_have_description}
//               date_time_finish={date_time_finish}
//               date_time_start={date_time_start}
//               status={status}
//             />
//             <CardAvatarSection />
//           </CardContent>
//         </Box>
//       </Card>

//       <Dialog
//         sx={{ height: "100%", backgroundColor: "rgba(0, 0, 0, 0.55)" }}
//         // scroll="body"
//         maxWidth={"xl"}
//         open={openPop}
//         onClose={handleAllSettingsOfCardClose}
//         PaperComponent={PaperComponent}
//         aria-labelledby="draggable-dialog-title"
//       >
//         <DialogTitle style={style.dialogTitle} id="draggable-dialog-title">
//           <IconButton
//             aria-label="close"
//             sx={{ backgroundColor: "#777", "&:hover": { backgroundColor: "#ccc" } }}
//             onClick={handleAllSettingsOfCardClose}
//           >
//             <CloseOutlinedIcon sx={{ color: "#fff" }} />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={style.dialogContent}>
//           {Pop(
//             popupType,
//             handleAllSettingsOfCardOpen,
//             id,
//             date_time_finish,
//             date_time_start,
//             status
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// const Column = ({ height, columnId, moveColumn, columnIndex, updateColumns }) => {
//   const { data: CARDS } = useGetCardsQuery(columnId);
//   const [cardPositionUpdate] = useUpdateCardInColumnMutation();

//   const [cards, setCards] = useState(CARDS);
//   const [placeholderHeight, setPlaceholderHeight] = useState(0);
//   const [draggingIndex, setDraggingIndex] = useState(null);
//   const [hoverIndex, setHoverIndex] = useState(null);

//   useEffect(() => {
//     if (!CARDS) return;
//     setCards(CARDS);
//   }, [CARDS]);

//   const cardPositionUpdater = useCallback(
//     async (request) => {
//       try {
//         await cardPositionUpdate(request);
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     [cardPositionUpdate]
//   );

//   const moveCardListItem = useCallback(
//     (dragCardIndex, hoverCardIndex, sourceColumnId, targetColumnId, sourceCardId, hoverCardId) => {
//       const dragCardItem = cards[dragCardIndex];
//       const hoverCardItem = cards[hoverCardIndex];
//       const dragCartItemPosition = dragCardItem.card_in_columns;
//       const HoverCartItemPosition = hoverCardItem.card_in_columns;

//       //не map, a reduce и вернуть объект карточки
//       const draggedCardObj = dragCartItemPosition.reduce((accumulator, item) => {
//         const cardId = item.card_id;
//         const obj = { ...item };
//         if (sourceCardId === cardId) {
//           obj.position_in_column = hoverCardIndex;
//           obj.card_id = sourceCardId;
//           obj.column_id = targetColumnId;
//         }
//         accumulator = obj;
//         return accumulator;
//       }, {});

//       const hoveredCardObj = HoverCartItemPosition.reduce((accumulator, item) => {
//         const cardId = item.card_id;
//         const obj = { ...item };
//         if (hoverCardId === cardId) {
//           obj.position_in_column = dragCardIndex;
//           obj.card_id = hoverCardId;
//           obj.column_id = targetColumnId;
//         }
//         accumulator = obj;
//         return accumulator;
//       }, {});

//       const request = [draggedCardObj, hoveredCardObj];

//       cardPositionUpdater(request);
//       // Swap places of dragItem and hoverItem in the pets array
//       setCards((cards) => {
//         const updatedCards = [...cards];
//         updatedCards[dragCardIndex] = hoverCardItem;
//         updatedCards[hoverCardIndex] = dragCardItem;

//         return updatedCards;
//       });
//       setHoverIndex(null);
//       setDraggingIndex(null); // Сбрасываем индекс перетаскиваемой карточки при дропе
//     },
//     [cardPositionUpdater, cards]
//   );


//   return (
//     <>
//     {!!cards && 
    
//   <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
//     <List
//       className="scroll-container"
//       sx={{ ...style.list, maxHeight: `${height - 90}px` }}
//       subheader={
//         <ListSubheader
//           sx={{
//             width: "100%",
//             height: "40px",
//             textAlign: "center",
//           }}
//           titletypographyprops={{
//             fontSize: "20px",
//             color: "#172b4d",
//           }}
//         >
//           {"В работе"}
//         </ListSubheader>
//       }
//     >
//       {

//         cards.map((card, index) => {
//           const { id, name, position_on_board } = card;
//           return (
//             <ListItem key={id}>
//               {hoverIndex === index && <DropPlaceholder height={placeholderHeight} />}
//               <TaskCard
//                 columnId={columnId}
//                 {...card}
//                 index={index}
//                 move            CardListItem={moveCardListItem}
//                 columnIndex={columnIndex}
//                 sourceColumnIndex={columnIndex}
//                 setPlaceholderHeight={setPlaceholderHeight}
//                 // setDraggingIndex={setDraggingIndex}
//                 setHoverIndex={setHoverIndex}
//               />
//             </ListItem>
//           );
//         })}
//       </List  >
//         </SortableContext>      
//     }


//     </>
//   );
// };

// const ColumnsView = () => {
//   const boardDataFromState = useSelector(boardData);
//   const acitiveBoardId = boardDataFromState.id;

//   const { data: COLUMNS } = useGetColumnsQuery(acitiveBoardId);
//   const [columns, setColumns] = useState(COLUMNS);
//   const [width, height] = useWindowDimensions();

//   useEffect(() => {
//     if (!COLUMNS) return;
//     setColumns(COLUMNS);
//   }, [COLUMNS]);
  
//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 10,
//       },
//     })
//   );

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (!over) return;

//     if (active.id !== over.id) {
//       const activeColId = active.id.split('-')[0];
//       const overColId = over.id.split('-')[0];

//       if (activeColId === overColId) {
//         setColumns((columns) => {
//           const colIndex = columns.findIndex(col => col.id === activeColId);
//           const newCards = arrayMove(columns[colIndex].cards, active.index, over.index);
//           const newColumns = [...columns];
//           newColumns[colIndex].cards = newCards;
//           return newColumns;
//         });
//       } else {
//         setColumns((columns) => {
//           const activeColIndex = columns.findIndex(col => col.id === activeColId);
//           const overColIndex = columns.findIndex(col => col.id === overColId);

//           const activeCardIndex = columns[activeColIndex].cards.findIndex(card => card.id === active.id);
//           const overCardIndex = columns[overColIndex].cards.findIndex(card => card.id === over.id);

//           const activeCard = columns[activeColIndex].cards[activeCardIndex];
//           const newActiveCards = [...columns[activeColIndex].cards];
//           newActiveCards.splice(activeCardIndex, 1);

//           const newOverCards = [...columns[overColIndex].cards];
//           newOverCards.splice(overCardIndex, 0, activeCard);

//           const newColumns = [...columns];
//           newColumns[activeColIndex].cards = newActiveCards;
//           newColumns[overColIndex].cards = newOverCards;

//           return newColumns;
//         });
//       }
//     }
//   };


//   const moveColumn = useCallback(
//     (dragIndex, hoverIndex) => {
//       const dragColumn = columns[dragIndex];
//       const hoverItem = columns[hoverIndex];

//       setColumns((columns) => {
//         const updatedColumns = [...columns];
//         updatedColumns[dragIndex] = hoverItem;
//         updatedColumns[hoverIndex] = dragColumn;

//         return updatedColumns;
//       });
//     },
//     [columns]
//   );

//   return (
//     <>
// <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//     <Stack
//       sx={{ height: `${height - 64}` }}
//       mt={2}
//       mx={2}
//       direction="row"
//       justifyContent="flex-start"
//       alignItems="flex-start"
//       spacing={3}
//     >
//       {!!columns &&
//         columns.map((column, index) => {
//           const { id: columnId, name, position_on_board } = column;
//           return (
//             <Column
//               key={columnId}
//               height={height}
//               columnId={columnId}
//               columnIndex={index}
//               moveColumn={moveColumn}
//             />
//           );
//         })}
//     </Stack>
//     </DndContext>
// </>
//   );
// };

// export default ColumnsView;
