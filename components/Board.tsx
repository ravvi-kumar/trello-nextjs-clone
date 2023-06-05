"use client";

import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

import { useBoardStore } from "@/store/BoardStore";
import Column from "./Column";
import { Column as ColumnType } from "@/typings";

function Board() {
  const [board, getBoard, setBoardState] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      const columns = Array.from(board.columns);

      const [movedColumn] = columns.splice(source.index, 1);
      columns.splice(destination.index, 0, movedColumn);

      const updatedColumns = new Map(columns);
      setBoardState({ ...board, columns: updatedColumns });
    }

    if (type === "CARD") {
      const columns = Array.from(board.columns);

      const sourceColumn = columns.find(
        (column) => column[0] === source.droppableId
      );
      const destinationColumn = columns.find(
        (column) => column[0] === destination.droppableId
      );

      if (!sourceColumn || !destinationColumn) return;

      if (
        sourceColumn === destinationColumn &&
        source.index === destination.index
      )
        return;

      const updatedSourceColumn: ColumnType = {
        id: sourceColumn[1].id,
        todos: [...sourceColumn[1].todos],
      };
      const [movedCard] = updatedSourceColumn.todos.splice(source.index, 1);

      if (sourceColumn === destinationColumn) {
        updatedSourceColumn.todos.splice(destination.index, 0, movedCard);

        const updatedColumns = new Map(columns);
        updatedColumns.set(updatedSourceColumn.id, updatedSourceColumn);

        setBoardState({ ...board, columns: updatedColumns });
      } else {
        const updatedDestinationColumn: ColumnType = {
          id: destinationColumn[1].id,
          todos: [...destinationColumn[1].todos],
        };
        updatedDestinationColumn.todos.splice(destination.index, 0, movedCard);

        const updatedColumns = new Map(columns);
        updatedColumns.set(updatedSourceColumn.id, updatedSourceColumn);
        updatedColumns.set(
          updatedDestinationColumn.id,
          updatedDestinationColumn
        );

        setBoardState({ ...board, columns: updatedColumns });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
          >
            {Array.from(board?.columns)?.map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
