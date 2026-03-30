import type { Task } from "../types/task";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) {
    throw new Error(`Failed to load tasks: ${res.status}`);
  }
  const data: { tasks: Task[] } = await res.json();
  return data.tasks;
}
