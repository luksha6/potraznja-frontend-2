import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { fetchTasks } from "../api/fetchTasks";
import {
  useTaskFilters,
  type UseTaskFiltersResult,
} from "../hooks/useTaskFilters";
import type { Task } from "../types/task";

const SearchContext = createContext<
  (UseTaskFiltersResult & {
    tasks: Task[];
    loading: boolean;
    error: string | null;
  }) | null
>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTasks()
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load tasks");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filters = useTaskFilters(tasks);

  const value = {
    ...filters,
    tasks,
    loading,
    error,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): UseTaskFiltersResult & {
  tasks: Task[];
  loading: boolean;
  error: string | null;
} {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return ctx;
}
