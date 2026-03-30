export type TaskCategory = "Work" | "Personal" | "Urgent";

export type TaskStatus = "Todo" | "In Progress" | "Completed";

export type TaskPriority = 1 | 2 | 3;

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
}
