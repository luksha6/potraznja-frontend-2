import { useSearch } from "../context/SearchProvider";
import { TaskCard } from "./TaskCard";

export function TaskBoard() {
  const { filteredTasks, loading, error, hasActiveFilters, clearFilters } =
    useSearch();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-sm text-slate-500">Loading tasks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-12">
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <svg
            className="h-10 w-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            No results found
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-600">
            Try adjusting your search or filters to see more tasks.
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} />
          </li>
        ))}
      </ul>
    </div>
  );
}
