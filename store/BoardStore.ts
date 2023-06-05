import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { Board, Todo, TypedColumn } from "@/typings";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;

  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>(

    (set, get) => ({
      board: {
        columns: new Map<TypedColumn, Column>(),
      },

      getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
      },

      setBoardState: (board) => set({ board }),

      addTask: async (todo, columnId, image) => {
        set({ newTaskInput: "" });

        set((state) => {
          const updatedColumns = new Map(state.board.columns);

          const newTodo: Todo = {
            id: Math.random().toString().slice(2, 8),
            createdAt: new Date().toISOString(),
            title: todo,
            status: columnId,
          };

          const column = updatedColumns.get(columnId);

          if (!column) {
            updatedColumns.set(columnId, { id: columnId, todos: [newTodo] });
          } else {
            updatedColumns.get(columnId)?.todos.push(newTodo);
          }

          return { board: { columns: updatedColumns } };
        });
      },

      deleteTask: async (taskIndex, todo, id) => {
        const updatedColumns = new Map(get().board.columns);
        updatedColumns.get(id)?.todos.splice(taskIndex, 1);
        set({ board: { columns: updatedColumns } });
      },

      searchString: "",

      setSearchString: (searchString) => set({ searchString }),

      newTaskInput: "",

      setNewTaskInput: (input) => set({ newTaskInput: input }),

      newTaskType: "todo",

      setNewTaskType: (columnId) => set({ newTaskType: columnId }),

      image: null,

      setImage: (image) => set({ image }),
    })
    
      

);
