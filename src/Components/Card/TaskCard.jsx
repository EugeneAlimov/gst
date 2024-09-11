import React, { useRef, useEffect, useState } from "react";
// import Draggable from "react-draggable";
import { useDispatch } from "react-redux";

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

//import MIU icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

//import RTK QUERY
import { useGetAllChipsQuery } from "../../Redux/chip/chip-operations";
import { popUpToOpen } from "../../Redux/chip/chip-slice";

// import components
import AllSettingsOfCard from "../../Components/Card/AllSettingsOfCard/AllSettingsOfCard";
import EditButtonsGroup from "../../Components/Card/EditButtonsGroup/EditButtonsGroup";
import CardImage from "../../Components/Card/CardImageSection/CardImage";
import CardChipContainer from "../../Components/Card/CardChipsSection/CardChipContainer";
import CardStatistic from "../../Components/Card/CardStatisticIconsSection/CardStatistic";
import CardDescription from "../../Components/Card/CardDescriptionSection/CardDescription";
import CardAvatarSection from "../../Components/Card/Avatar/CardAvatarSection";
import DropIndicator from "../UI/DropIndicator";

//import styles
import * as style from "../../constants/ColumnViewStyles";

import { createPortal } from "react-dom";

const PaperComponent = (props) => {
  return <Paper sx={style.draggablePaper} {...props} />;
};

export default function TaskCard({
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
}) {
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
  const [isEditable, setIsEditable] = useState(false); // Управляем режимом редактирования

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

  const handleBlockClick = () => {
    setIsEditable(true); // Разблокируем поле при клике на блок
  };

  const handleBlur = () => {
    setIsEditable(false); // Блокируем поле при потере фокуса
  };
  console.log('isEditable ', isEditable);

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
        <Box 
        // onClick={() => handleAllSettingsOfCardOpen(1)}
        >
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
                onClick={handleBlockClick} // При клике разблокируем текстовое поле
              />
            )}
            <CardDescription cardText={text} handleBlur={handleBlur} isEditable={isEditable} />
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
}
