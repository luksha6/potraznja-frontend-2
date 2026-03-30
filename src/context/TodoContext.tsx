import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type {
  Todo,
  TodoState,
  TodoAction,
  TodoFilter,
  Status,
  Subtask,
  Comment,
} from '../types/todo';
import { DEFAULT_FILTER } from '../types/todo';
import { todoReducer, filterAndSortTodos, generateId, createTodo } from '../utils/todoUtils';

const STORAGE_KEY = 'potraznja-todos';

function loadState(): TodoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as TodoState;
    }
  } catch {
    /* ignore */
  }
  return { todos: [], filter: DEFAULT_FILTER };
}

function saveState(state: TodoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos: state.todos, filter: DEFAULT_FILTER }));
  } catch {
    /* ignore */
  }
}

interface TodoContextValue {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  filteredTodos: Todo[];
  addTodo: (partial: Partial<Todo>) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  addSubtask: (todoId: string, title: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  addComment: (todoId: string, text: string, author: string) => void;
  deleteComment: (todoId: string, commentId: string) => void;
  setFilter: (partial: Partial<TodoFilter>) => void;
  resetFilter: () => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: Status) => void;
  allCategories: string[];
  allTags: string[];
  allAssignees: string[];
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const filteredTodos = useMemo(
    () => filterAndSortTodos(state.todos, state.filter),
    [state.todos, state.filter]
  );

  const allCategories = useMemo(
    () => [...new Set(state.todos.map((t) => t.category).filter(Boolean))].sort(),
    [state.todos]
  );

  const allTags = useMemo(
    () => [...new Set(state.todos.flatMap((t) => t.tags))].sort(),
    [state.todos]
  );

  const allAssignees = useMemo(
    () => [...new Set(state.todos.map((t) => t.assignee).filter(Boolean))].sort(),
    [state.todos]
  );

  const addTodo = useCallback((partial: Partial<Todo>) => {
    dispatch({ type: 'ADD_TODO', payload: createTodo(partial) });
  }, []);

  const updateTodo = useCallback((todo: Todo) => {
    dispatch({ type: 'UPDATE_TODO', payload: todo });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);

  const toggleSubtask = useCallback((todoId: string, subtaskId: string) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { todoId, subtaskId } });
  }, []);

  const addSubtask = useCallback((todoId: string, title: string) => {
    const subtask: Subtask = {
      id: generateId(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SUBTASK', payload: { todoId, subtask } });
  }, []);

  const deleteSubtask = useCallback((todoId: string, subtaskId: string) => {
    dispatch({ type: 'DELETE_SUBTASK', payload: { todoId, subtaskId } });
  }, []);

  const addComment = useCallback((todoId: string, text: string, author: string) => {
    const comment: Comment = {
      id: generateId(),
      text,
      author,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMMENT', payload: { todoId, comment } });
  }, []);

  const deleteComment = useCallback((todoId: string, commentId: string) => {
    dispatch({ type: 'DELETE_COMMENT', payload: { todoId, commentId } });
  }, []);

  const setFilter = useCallback((partial: Partial<TodoFilter>) => {
    dispatch({ type: 'SET_FILTER', payload: partial });
  }, []);

  const resetFilter = useCallback(() => {
    dispatch({ type: 'RESET_FILTER' });
  }, []);

  const bulkDelete = useCallback((ids: string[]) => {
    dispatch({ type: 'BULK_DELETE', payload: ids });
  }, []);

  const bulkUpdateStatus = useCallback((ids: string[], status: Status) => {
    dispatch({ type: 'BULK_UPDATE_STATUS', payload: { ids, status } });
  }, []);

  const value: TodoContextValue = {
    state,
    dispatch,
    filteredTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    addComment,
    deleteComment,
    setFilter,
    resetFilter,
    bulkDelete,
    bulkUpdateStatus,
    allCategories,
    allTags,
    allAssignees,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
