import { useCallback, useEffect, useMemo, useState } from "react";
import type { Task, TaskCategory, TaskStatus } from "../types/task";

const SEARCH_DEBOUNCE_MS = 300;

export type PriorityFilter = "all" | 1 | 2 | 3;

export interface TaskFilterState {
  searchInput: string;
  debouncedSearch: string;
  category: TaskCategory | "all";
  status: TaskStatus | "all";
  priority: PriorityFilter;
}

export interface UseTaskFiltersResult extends TaskFilterState {
  filteredTasks: Task[];
  hasActiveFilters: boolean;
  setSearchInput: (value: string) => void;
  setCategory: (value: TaskCategory | "all") => void;
  setStatus: (value: TaskStatus | "all") => void;
  setPriority: (value: PriorityFilter) => void;
  clearFilters: () => void;
}

function matchesSearch(task: Task, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q)
  );
}

function applyFilters(tasks: Task[], state: TaskFilterState): Task[] {
  return tasks.filter((task) => {
    if (!matchesSearch(task, state.debouncedSearch)) return false;
    if (state.category !== "all" && task.category !== state.category) {
      return false;
    }
    if (state.status !== "all" && task.status !== state.status) {
      return false;
    }
    if (state.priority !== "all" && task.priority !== state.priority) {
      return false;
    }
    return true;
  });
}

function stateHasActiveFilters(state: TaskFilterState): boolean {
  return (
    state.searchInput.trim() !== "" ||
    state.category !== "all" ||
    state.status !== "all" ||
    state.priority !== "all"
  );
}

/**
 * Single place for search + filter logic (multi-parameter, debounced text).
 */
export function useTaskFilters(tasks: Task[]): UseTaskFiltersResult {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<TaskCategory | "all">("all");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const filterState: TaskFilterState = useMemo(
    () => ({
      searchInput,
      debouncedSearch,
      category,
      status,
      priority,
    }),
    [searchInput, debouncedSearch, category, status, priority],
  );

  const filteredTasks = useMemo(
    () => applyFilters(tasks, filterState),
    [tasks, filterState],
  );

  const hasActiveFilters = useMemo(
    () => stateHasActiveFilters(filterState),
    [filterState],
  );

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategory("all");
    setStatus("all");
    setPriority("all");
  }, []);

  return {
    searchInput,
    debouncedSearch,
    category,
    status,
    priority,
    filteredTasks,
    hasActiveFilters,
    setSearchInput,
    setCategory,
    setStatus,
    setPriority,
    clearFilters,
  };
}
