import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//atlaskit/pragmatic-drag-and-drop
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

//redux states
import { columnData, storeOneColumn, storeColumnsLength } from "../Redux/columns/column-slice";

import "@fontsource/roboto/400.css";

//import MIU components
import { Stack } from "@mui/material";

//import RTK QUERY
import {
  useGetColumnsQuery,
  useUpdateColumnsPositionsMutation,
} from "../Redux/columns/column-operations";

// import components
import Column from "../Components/Column/Column";

import useWindowDimensions from "../libs/useWindowDimentions";

import { columnDragStart, columnOnDrop } from "../libs/libs";
import { useGetAllChipsQuery } from "../Redux/chip/chip-operations";

export default function ColumnsView({ allChips, boardHeight }) {
  const activeBoardId = useSelector(
    (state) => state.userApi.queries["getUsers(undefined)"]?.data[0].active_board
  );

  const { data: COLUMNS } = useGetColumnsQuery(activeBoardId);

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
      dispatch(storeColumnsLength(newColumns.length));
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
            columnDragStart(args, columns, dispatch, storeOneColumn, setColumns);
          }
        },
        onDrop: (args) => {
          if (args.source.data.type === "card") return;
          if (args.source.data.type === "column")
            columnOnDrop(
              args,
              columns,
              setColumns,
              columnPositionUpdate,
              activeBoardId,
              storedColumn
            );
        },
      })
    );
  }, [columns]);

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
          const { id: columnId, name } = column;
          return (
            <Column
              key={columnId}
              columnName={name}
              columnId={columnId}
              columnIndex={index}
              columnOnDrop={columnOnDrop}
              activeBoardId={activeBoardId}
              boardHeight={boardHeight}
              allChips={allChips}
            />
          );
        })}
    </Stack>
  );
}
