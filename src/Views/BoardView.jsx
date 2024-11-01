import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

//atlaskit/pragmatic-drag-and-drop
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

//import MUI components
import Box from "@mui/material/Box";

import ColumnsView from "./ColumnsView";

//import utilites
import useWindowDimensions from "../libs/useWindowDimentions";

//import states from Redux
import { boardData } from "../Redux/board/board-slice";
import { useGetUserBoardsQuery } from "../Redux/board/board-operations";

export default function BoardView() {
  useGetUserBoardsQuery();
  
  const boardDataFromState = useSelector(boardData);
  const activeBoardId = boardDataFromState.id;

  const [width, height] = useWindowDimensions();
  const [boardHeight, setBoardHeight] = useState(0);

  const ref = useRef(null);

  useEffect(() => {
    if (!ref) return;
    setBoardHeight(ref.current.clientHeight);
  });

  useEffect(() => {
    const element = ref.current;
    return autoScrollForElements({
      element,
    });
  });

  return (
    <Box
      ref={ref}
      className="board"
      sx={{
        marginTop: "64px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        height: `${height - 64}px`,
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      {activeBoardId && <ColumnsView activeBoardId={activeBoardId} boardHeight={boardHeight} />}
    </Box>
  );
}
