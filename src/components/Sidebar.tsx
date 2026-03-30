import { useSearch } from "../context/SearchProvider";
import type { TaskCategory, TaskStatus } from "../types/task";
import type { PriorityFilter } from "../hooks/useTaskFilters";

const categories: Array<TaskCategory | "all"> = [
  "all",
  "Work",
  "Personal",
  "Urgent",
];

const statuses: Array<TaskStatus | "all"> = [
  "all",
  "Todo",
  "In Progress",
  "Completed",
];

const priorities: Array<{ value: PriorityFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: 1, label: "1 — Low" },
  { value: 2, label: "2 — Medium" },
  { value: 3, label: "3 — High" },
];

export function Sidebar() {
  const {
    searchInput,
    setSearchInput,
    category,
    setCategory,
    status,
    setStatus,
    priority,
    setPriority,
  } = useSearch();

  return (
    <aside className="flex w-full flex-col gap-6 border-b border-slate-200 bg-white p-6 lg:min-h-0 lg:w-72 lg:border-b-0 lg:border-r">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Search
        </h2>
        <label htmlFor="task-search" className="sr-only">
          Search tasks by title or description
        </label>
        <input
          id="task-search"
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Title or description…"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <p className="mt-1 text-xs text-slate-400">Debounced 300ms</p>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Category
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                category === c
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Status
        </h2>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as TaskStatus | "all")
          }
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Priority
        </h2>
        <div className="mt-2 flex flex-col gap-1">
          {priorities.map(({ value, label }) => (
            <label
              key={String(value)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <input
                type="radio"
                name="priority"
                checked={priority === value}
                onChange={() => setPriority(value)}
                className="border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
