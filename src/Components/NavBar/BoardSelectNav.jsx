import { useEffect, useState } from "react";
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
  const [currentBoard, setCurrentBoard] = useState(""); // ✅ ИСПРАВЛЕНИЕ: Пустая строка вместо null

  const [updateBoardDetail] = useUpdateActiveBoardMutation();
  const { data: userBoards, refetch: userBoardsRefetch } = useGetUserBoardsQuery();
  const { refetch: userRefetch } = useGetUsersQuery();

  const [columnCreator] = useCreateNewColumnMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeBoard || !activeBoard[0]) return;

    const activeBoardId = activeBoard[0].active_board;

    // ✅ ИСПРАВЛЕНИЕ: Проверяем что доска существует в списке доступных досок
    if (userBoards && activeBoardId) {
      const boardExists = userBoards.find((board) => board.id === activeBoardId);
      if (boardExists) {
        setCurrentBoard(activeBoardId);
      } else {
        // Если активная доска не найдена в списке, сбрасываем на пустое значение
        setCurrentBoard("");
      }
    } else {
      setCurrentBoard(""); // ✅ Пустая строка для корректной работы Select
    }
  }, [activeBoard, userBoards]);

  useEffect(() => {
    if (isLoggedIn) userBoardsRefetch();
  }, [isLoggedIn, userBoardsRefetch]);

  const getBoard = async (event) => {
    try {
      const tempCurrentBoard = event.target.value;

      // ✅ ИСПРАВЛЕНИЕ: Проверяем что значение не пустое
      if (!tempCurrentBoard) {
        console.log("Empty board selected");
        return;
      }

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
    // ✅ ИСПРАВЛЕНИЕ: Проверяем что доска выбрана
    if (!currentBoard) {
      console.log("No board selected for column creation");
      return;
    }

    const column = {
      board: currentBoard,
      name: "",
      position_on_board: columnsLength.columnsLength,
    };
    try {
      const newColumn = await columnCreator(column).unwrap();

      // ✅ ИСПРАВЛЕНИЕ: Проверяем что activeBoard существует
      if (activeBoard && activeBoard[0] && activeBoard[0].active_board) {
        dispatch(
          columnsApi.util.updateQueryData("getColumns", activeBoard[0].active_board, (draft) => {
            draft.push(newColumn);
          })
        );
      }
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
          value={currentBoard} // ✅ ИСПРАВЛЕНИЕ: Используем пустую строку по умолчанию
          label="Рабочая доска"
          onChange={getBoard}
          displayEmpty // ✅ ИСПРАВЛЕНИЕ: Позволяем отображать пустое значение
        >
          {/* ✅ ИСПРАВЛЕНИЕ: Добавляем пустой элемент */}
          <MenuItem value="">
            <em>Доска не выбрана</em>
          </MenuItem>

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

      <GreyButtonCreateColumn
        variant="outlined"
        onClick={newColumnCreater}
        disabled={!currentBoard} // ✅ ИСПРАВЛЕНИЕ: Отключаем кнопку если доска не выбрана
      >
        {"Новая колонка"}
      </GreyButtonCreateColumn>
    </Box>
  );
}
