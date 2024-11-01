import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export const handleBlockClick = (setIsEditable, setTextBuffer, text) => {
  setIsEditable(true); // Разблокируем поле при клике на блок
  setTextBuffer(text); // сохраняем текст перед изменением
};

export const handleBlur = async (
  setIsEditable,
  setTextBuffer,
  text,
  textBuffer,
  textUpdater,
  id,
  field
) => {
  setIsEditable(false); // Блокируем поле при потере фокуса
  if (text !== textBuffer) {
    try {
      await textUpdater({ id, field });
    } catch (error) {
      console.log(error);
    }
  }
  setTextBuffer("");
};

export const cardOnDragStart = (args, cards, dispatch, storeOneCard, setCards) => {
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

export const cardOnDrop = async (args, cards, setCards, cardPositionUpdate, storedCard) => {
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

export const newCardCreater = async (cardCreater, cardTemplate, activeBoardId, columnId, CARDS) => {
  try {
    cardTemplate.board_id = activeBoardId;
    cardTemplate.column_id = columnId;
    cardTemplate.position_in_column = CARDS.length;
    await cardCreater(cardTemplate);
  } catch (error) {
    console.log(error);
  }
};

export const columnDragStart = (args, columns, dispatch, storeOneColumn, setColumns) => {
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

export const columnOnDrop = async (
  args,
  columns,
  setColumns,
  columnPositionUpdate,
  acitiveBoardId,
  storedColumn
) => {
  let data;
  let dropIndex;
  let targetColumnDropPlace;
  const targetLenght = args.location.current.dropTargets.length;
  const newColumns = Array.from(columns);

  if (targetLenght > 0) {
    data =
      targetLenght === 1
        ? args.location.current.dropTargets[0].data
        : args.location.current.dropTargets[1].data;

    targetColumnDropPlace = data.columnId;
    const closestEdge = extractClosestEdge(data);

    dropIndex = columns.findIndex((column) => column.id === targetColumnDropPlace);

    if (closestEdge === "right") dropIndex = dropIndex + 1;
  } else {
    dropIndex = args.source.data.columnIndex;
  }

  dropIndex !== -1 && newColumns.splice(dropIndex, 0, storedColumn.column);
  dropIndex !== -1 && setColumns(newColumns);

  try {
    const columnsArr = newColumns.map((column, index) => {
      return { id: column.id, index };
    });

    columnPositionUpdate({ id: acitiveBoardId, columns: columnsArr });
  } catch (error) {
    console.log(error);
  }
};

// export function Pop(
//   popupType,
//   handleAllSettingsOfCardOpen,
//   id,
//   date_time_finish,
//   date_time_start,
//   status,
//   AllSettingsOfCard,
//   EditButtonsGroup,
//   columnId
// ) {
//   let pop = null;

//   switch (popupType) {
//     case 1:
//       pop = (
//         <AllSettingsOfCard
//           date_time_finish={date_time_finish}
//           date_time_start={date_time_start}
//           status={status}
//           cardId={id}
//         />
//       );
//       break;
//     case 2:
//       pop = <EditButtonsGroup columnId={columnId} handleClickOpen={handleAllSettingsOfCardOpen} cardId={id} />;
//       break;
//     default:
//       break;
//   }
//   return pop;
// }
