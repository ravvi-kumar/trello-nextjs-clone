"use client";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { Draggable } from "react-beautiful-dnd";

import { useBoardStore } from "@/store/BoardStore";
import { Todo } from "@/typings";

type Props = {
  todo: Todo;
  index: number;
};

function TodoCard({ todo, index }: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-md space-y-2 shadow-md"
        >
          <div className="flex justify-between items-center p-5">
            <p>{todo.title}</p>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => deleteTask(index, todo, todo.status)}
            >
              <XCircleIcon className="ml-5 h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TodoCard;
