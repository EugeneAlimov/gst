import React, { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

//atlaskit/pragmatic-drag-and-drop
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

//redux states
import { columnData, storeOneColumn } from "../Redux/columns/column-slice";

import "@fontsource/roboto/400.css";

//import MIU components
import { Stack } from "@mui/material";

//import RTK QUERY
import {
  useGetColumnsQuery,
  useUpdateColumnsPositionsMutation,
} from "../Redux/columns/column-operations";
import { boardData } from "../Redux/board/board-slice";

// import components
import Column from "../Components/Column/Column";

import useWindowDimensions from "../libs/useWindowDimentions";

export default function ColumnsView() {
  const boardDataFromState = useSelector(boardData);
  const acitiveBoardId = boardDataFromState.id;

  const { data: COLUMNS } = useGetColumnsQuery(acitiveBoardId);

  const [columnPositionUpdate] = useUpdateColumnsPositionsMutation();

  const [columns, setColumns] = useState(COLUMNS || []);

  const [width, height] = useWindowDimensions();

  const dispatch = useDispatch();
  const storedColumn = useSelector(columnData);

  const ref = useRef(null);

  useEffect(() => {
    if (COLUMNS) {
      const newColumns = Array.from(COLUMNS);

      newColumns.sort((a, b) => (a.position_on_board > b.position_on_board ? 1 : -1));

      setColumns(newColumns);
    }
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
          if (args.source.data.type === "card") return;
          // columnOnDrop(args);
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

  const columnOnDrop = async (args) => {
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
console.log('columns ', columns);

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
          return (
            <Column
              key={columnId}
              height={height}
              columnName={name}
              columnId={columnId}
              columnIndex={index}
              columnOnDrop={columnOnDrop}
            />
          );
        })}
    </Stack>
  );
}
