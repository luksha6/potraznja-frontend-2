import { SearchProvider, useSearch } from "./context/SearchProvider";
import { Sidebar } from "./components/Sidebar";
import { TaskBoard } from "./components/TaskBoard";

function Header() {
  const { filteredTasks, tasks } = useSearch();
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Todo Task Manager
          </h1>
          <p className="text-sm text-slate-600">
            Advanced search and filtering demo
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredTasks.length}
          </span>{" "}
          of {tasks.length} tasks
        </p>
      </div>
    </header>
  );
}

function Shell() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <Sidebar />
        <main className="flex min-h-0 flex-1 flex-col lg:overflow-auto">
          <TaskBoard />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SearchProvider>
      <Shell />
    </SearchProvider>
  );
}
