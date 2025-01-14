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

//import static
import { useGetUserBoardsQuery } from "../../Redux/board/board-operations";
import { getActiveBoardId } from "../../Redux/board/board-slice";
import { columnsApi, useCreateNewColumnMutation } from "../../Redux/columns/column-operations";
import { columnData } from "../../Redux/columns/column-slice";
import { useGetUsersQuery, useUpdateActiveBoardMutation } from "../../Redux/user/user-operations";

const BoardSelect = styled(Select)(() => ({
  fieldset: {
    borderColor: "#fff",
  },
  svg: { color: "#fff" },
}));

export default function BoardSelectNav({ isLoggedIn }) {
  const activeBoard = useSelector((state) => state.userApi.queries["getUsers(undefined)"]?.data);

  const columnsLength = useSelector(columnData);
  const [currentBoard, setCurrentBoard] = useState(null);

  const [updateBoardDetail] = useUpdateActiveBoardMutation();
  const { data: userBoards, refetch: userBoardsRefetch } = useGetUserBoardsQuery();
  const { refetch: userRefetch } = useGetUsersQuery();

  const [columnCreator] = useCreateNewColumnMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeBoard) return;

    setCurrentBoard(activeBoard[0].active_board);
  }, [activeBoard]);

  useEffect(() => {
    if (isLoggedIn) userBoardsRefetch();
  }, [isLoggedIn, userBoardsRefetch]);

  const getBoard = async (event) => {
    try {
      const tempCurrentBoard = event.target.value;

      dispatch(getActiveBoardId(tempCurrentBoard));
      setCurrentBoard(tempCurrentBoard);

      await updateBoardDetail(tempCurrentBoard);
    } catch (error) {
      console.log(error);
    }
    try {
      await userRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const newColumnCreater = async () => {
    const column = {
      board: currentBoard,
      name: "",
      position_on_board: columnsLength.columnsLength,
    };
    try {
      const newColumn = await columnCreator(column).unwrap(); //При помощи unwrap() мы распаковываем ответ от сервера в переменную newColumn
      dispatch(
        columnsApi.util.updateQueryData("getColumns", activeBoard[0].active_board, (draft) => {
          draft.push(newColumn); // Добавляем новую колонку в кэш из распакованного ответа
        })
      );
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
          sx={{ color: "#fff" }}
          labelId="board-simple-select-helper-label"
          id="board-simple-select-helper"
          value={currentBoard || "Доска не выбрана"}
          label="Рабочая доска"
          onChange={getBoard}
        >
          {!!userBoards &&
            userBoards.map((board) => {
              const { id, name } = board;
              return (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              );
            })}
        </BoardSelect>
      </FormControl>
      <GreyButtonCreateColumn variant="outlined" onClick={newColumnCreater}>
        {"Новая колонка"}
      </GreyButtonCreateColumn>
    </Box>
  );
}
