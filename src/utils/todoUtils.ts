import type { Todo, TodoFilter, TodoState, TodoAction } from '../types/todo';
import { PRIORITY_ORDER, DEFAULT_FILTER } from '../types/todo';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createTodo(partial: Partial<Todo>): Todo {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
    category: 'General',
    tags: [],
    dueDate: null,
    createdAt: now,
    updatedAt: now,
    subtasks: [],
    comments: [],
    assignee: '',
    estimatedHours: null,
    completedAt: null,
    ...partial,
  };
}

export function filterAndSortTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  let result = [...todos];

  if (filter.searchText.trim()) {
    const q = filter.searchText.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filter.statuses.length > 0) {
    result = result.filter((t) => filter.statuses.includes(t.status));
  }

  if (filter.priorities.length > 0) {
    result = result.filter((t) => filter.priorities.includes(t.priority));
  }

  if (filter.categories.length > 0) {
    result = result.filter((t) => filter.categories.includes(t.category));
  }

  if (filter.tags.length > 0) {
    result = result.filter((t) => t.tags.some((tag) => filter.tags.includes(tag)));
  }

  if (filter.assignees.length > 0) {
    result = result.filter((t) => filter.assignees.includes(t.assignee));
  }

  if (filter.dueDateFrom) {
    result = result.filter(
      (t) => t.dueDate && t.dueDate >= filter.dueDateFrom!
    );
  }

  if (filter.dueDateTo) {
    result = result.filter(
      (t) => t.dueDate && t.dueDate <= filter.dueDateTo!
    );
  }

  result.sort((a, b) => {
    let cmp = 0;
    switch (filter.sortBy) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'priority':
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'dueDate':
        cmp =
          (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31');
        break;
      case 'status': {
        const statusOrder = ['not-started', 'in-progress', 'completed', 'cancelled'];
        cmp = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        break;
      }
      case 'createdAt':
      default:
        cmp = a.createdAt.localeCompare(b.createdAt);
        break;
    }
    return filter.sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? { ...action.payload, updatedAt: new Date().toISOString() }
            : t
        ),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
      };

    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.todoId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                subtasks: t.subtasks.map((s) =>
                  s.id === action.payload.subtaskId
                    ? { ...s, completed: !s.completed }
                    : s
                ),
              }
            : t
        ),
      };

    case 'ADD_SUBTASK':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.todoId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                subtasks: [...t.subtasks, action.payload.subtask],
              }
            : t
        ),
      };

    case 'DELETE_SUBTASK':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.todoId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                subtasks: t.subtasks.filter((s) => s.id !== action.payload.subtaskId),
              }
            : t
        ),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.todoId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                comments: [...t.comments, action.payload.comment],
              }
            : t
        ),
      };

    case 'DELETE_COMMENT':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.todoId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                comments: t.comments.filter((c) => c.id !== action.payload.commentId),
              }
            : t
        ),
      };

    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload } };

    case 'RESET_FILTER':
      return { ...state, filter: DEFAULT_FILTER };

    case 'BULK_DELETE':
      return {
        ...state,
        todos: state.todos.filter((t) => !action.payload.includes(t.id)),
      };

    case 'BULK_UPDATE_STATUS':
      return {
        ...state,
        todos: state.todos.map((t) =>
          action.payload.ids.includes(t.id)
            ? {
                ...t,
                status: action.payload.status,
                updatedAt: new Date().toISOString(),
                completedAt:
                  action.payload.status === 'completed'
                    ? new Date().toISOString()
                    : t.completedAt,
              }
            : t
        ),
      };

    default:
      return state;
  }
}
