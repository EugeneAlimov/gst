import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

//atlaskit/pragmatic-drag-and-drop
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

//import MUI components
import Box from "@mui/material/Box";

import ColumnsView from "./ColumnsView";

//import utilites
import useWindowDimensions from "../libs/useWindowDimentions";
import { useGetAllChipsQuery } from "../Redux/chip/chip-operations";

export default function BoardView() {
  const boardLoaded = useSelector((state) => state.userApi.queries["getUsers(undefined)"]?.status);
  const { data: allChips } = useGetAllChipsQuery();

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
      {boardLoaded === "fulfilled" && <ColumnsView allChips={allChips} boardHeight={boardHeight} />}
    </Box>
  );
}
