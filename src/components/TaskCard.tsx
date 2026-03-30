import type { Task } from "../types/task";

const categoryStyles: Record<Task["category"], string> = {
  Work: "bg-blue-50 text-blue-800 ring-blue-600/10",
  Personal: "bg-emerald-50 text-emerald-800 ring-emerald-600/10",
  Urgent: "bg-rose-50 text-rose-800 ring-rose-600/10",
};

const statusStyles: Record<Task["status"], string> = {
  Todo: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-50 text-amber-800",
  Completed: "bg-green-50 text-green-800",
};

export function TaskCard({ task }: { task: Task }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{task.title}</h3>
        <span
          className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${categoryStyles[task.category]}`}
        >
          {task.category}
        </span>
      </div>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
        {task.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}
        >
          {task.status}
        </span>
        <span className="text-xs text-slate-500">
          Priority{" "}
          <span className="font-semibold text-slate-800">{task.priority}</span>
        </span>
      </div>
    </article>
  );
}
