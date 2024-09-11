import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//import MUI components
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";

import { styled } from "@mui/material/styles";

//import UI components
import GreyButtonCreateColumn from "../UI/GreyButtonCreateColumn";
//import states from Redux
import { boardData } from "../../Redux/board/board-slice";

// import static
import { useGetBoardsQuery, useGetActiveBoardMutation } from "../../Redux/board/board-operations";
import { getActiveBoardId } from "../../Redux/board/board-slice";
import { useCreateNewColumnMutation } from "../../Redux/columns/column-operations";

const BoardSelect = styled(Select)(() => ({
  fieldset: {
    borderColor: "#fff",
  },
  svg: { color: "#fff" },
}));

export default function BoardSelectNav({ isLoggedIn }) {
  const boardDataFromState = useSelector(boardData);
  const id = boardDataFromState.id;

  const [currentBoard, seCurrentBoard] = useState(id);

  const [updateBoardDetail] = useGetActiveBoardMutation();
  const { data: boards, refetch } = useGetBoardsQuery();
  const [columnCreator] = useCreateNewColumnMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) refetch();
  }, [isLoggedIn, refetch]);

  const getBoard = async (event) => {
    try {
      const tempCurrentBoard = event.target.value;

      dispatch(getActiveBoardId(tempCurrentBoard));
      seCurrentBoard(tempCurrentBoard);
      await updateBoardDetail(tempCurrentBoard);
    } catch (error) {
      console.log(error);
    }
  };

  const newColumnCreater = async () => {
    const column = {
      board: id,
      name: "",
      position_onBoard: '',
    }
    try {
      await columnCreator(column);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: "20px",
        width: "inherit",
      }}
    >
      <FormControl sx={{ color: "#fff", m: 1, width: 200 }} size="small">
        <InputLabel sx={{ color: "#fff" }} id="demo-simple-select-helper-label">
          Рабочая доска
        </InputLabel>
        <BoardSelect
          defaultValue={""}
          sx={{ color: "#fff" }}
          labelId="board-simple-select-helper-label"
          id="board-simple-select-helper"
          value={currentBoard || "Доска не выбрана"}
          label="Рабочая доска"
          onChange={getBoard}
        >
          {!!boards &&
            boards.map((board) => {
              const { id, name } = board;

              return (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              );
            })}
        </BoardSelect>
      </FormControl>
      <GreyButtonCreateColumn
        // variant="contained"
        variant="outlined"
        onClick={newColumnCreater}
      >
        {"Новая колонка"}
      </GreyButtonCreateColumn>
    </Box>
  );
}
