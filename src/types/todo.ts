export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'not-started' | 'in-progress' | 'completed' | 'cancelled';
export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  category: string;
  tags: string[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  comments: Comment[];
  assignee: string;
  estimatedHours: number | null;
  completedAt: string | null;
}

export interface TodoFilter {
  searchText: string;
  statuses: Status[];
  priorities: Priority[];
  categories: string[];
  tags: string[];
  assignees: string[];
  dueDateFrom: string | null;
  dueDateTo: string | null;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_SUBTASK'; payload: { todoId: string; subtaskId: string } }
  | { type: 'ADD_SUBTASK'; payload: { todoId: string; subtask: Subtask } }
  | { type: 'DELETE_SUBTASK'; payload: { todoId: string; subtaskId: string } }
  | { type: 'ADD_COMMENT'; payload: { todoId: string; comment: Comment } }
  | { type: 'DELETE_COMMENT'; payload: { todoId: string; commentId: string } }
  | { type: 'SET_FILTER'; payload: Partial<TodoFilter> }
  | { type: 'RESET_FILTER' }
  | { type: 'BULK_DELETE'; payload: string[] }
  | { type: 'BULK_UPDATE_STATUS'; payload: { ids: string[]; status: Status } };

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const DEFAULT_FILTER: TodoFilter = {
  searchText: '',
  statuses: [],
  priorities: [],
  categories: [],
  tags: [],
  assignees: [],
  dueDateFrom: null,
  dueDateTo: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};
