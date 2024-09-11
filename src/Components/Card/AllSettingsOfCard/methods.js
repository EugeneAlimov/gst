export function checkedRowsCounter(checkListItems, setProgress) {
  const newCheckListItems = [...checkListItems];
  let checked = 0;

  newCheckListItems.forEach((element) => {
    if (element.isChecked) {
      checked += 1;
    }
  });

  let length = checkListItems.length;
  let progress = Math.round((100 / length) * checked);

  if (!!!length) {
    progress = 0;
  }

  setProgress(progress);
}

export const ChkListCboxToggle =
  (CheckboxID, checkListItems, setProgress, setCheckListItems) => () => {
    const newCheckListItems = [...checkListItems];

    newCheckListItems.forEach((element) => {
      if (element.id === CheckboxID) {
        element.isChecked = !element.isChecked;
      }
    });

    checkedRowsCounter(checkListItems, setProgress, CheckboxID);
    setCheckListItems(checkListItems);
  };

export const ChkListTextEditToggle =
  (
    CheckboxID,
    type,
    IDofTheLastCreatedCheckListRow,
    addNewRowToCheckListTrig,
    checkListItems,
    setCheckListItemText,
    checkListItemText,
    setCheckListItems,
    setAddNewRowToCheckListTrig
  ) =>
  () => {
    let newCheckListItems = [...checkListItems];
    let isCancel = false;

    newCheckListItems.forEach((element) => {
      switch (type) {
        case "open":
          element.isSelected = false;
          if (element.id === CheckboxID) {
            element.isSelected = true;
          }
          break;

        case "cancel":
          element.isSelected = false;
          isCancel = true;
          setAddNewRowToCheckListTrig(false);

          break;

        case "save":
          if (checkListItemText.length > 0) {
            element.isSelected = false;

            if (element.id === CheckboxID) {
              element.text = checkListItemText;
            }
            setCheckListItemText("");

            if (addNewRowToCheckListTrig) {
              setAddNewRowToCheckListTrig(false);
            }
          }
          setCheckListItemText("");

          break;

        default:
          break;
      }
    });

    if (isCancel) {
      const newArr = checkListItems.filter((el) => el.id !== IDofTheLastCreatedCheckListRow);
      newCheckListItems = [...newArr];
      setCheckListItemText("");
    }
    isCancel = false;

    setCheckListItems(newCheckListItems);
  };

export const HandleRemoveRowFromCheckList = (CheckboxID, checkListItems, setCheckListItems) => {
  const newCheckListItems = checkListItems.filter((el) => el.id !== CheckboxID);

  setCheckListItems(newCheckListItems);
};

export const HandleAddNewRowToCheckList = (
  setIDofTheLastCreatedCheckListRow,
  setAddNewRowToCheckListTrig,
  setCheckListItems,
  checkListItems
) => {
  const checkListArrLength = checkListItems.length;
  const IDofTheLastCreatedCheckListRow = checkListArrLength + 1;

  const newRowObj = {
    id: IDofTheLastCreatedCheckListRow,
    isChecked: false,
    text: "",
    isSelected: true,
  };

  setIDofTheLastCreatedCheckListRow(IDofTheLastCreatedCheckListRow);
  setAddNewRowToCheckListTrig(true);
  setCheckListItems([...checkListItems, newRowObj]);
};

export const handleComplitedChange = (event, setComplited) => {
  setComplited(event.target.checked);
};
