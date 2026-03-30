import { useTodos } from '../context/TodoContext';

export default function TodoStats() {
  const { state } = useTodos();
  const { todos } = state;

  const total = todos.length;
  const completed = todos.filter((t) => t.status === 'completed').length;
  const inProgress = todos.filter((t) => t.status === 'in-progress').length;
  const notStarted = todos.filter((t) => t.status === 'not-started').length;
  const cancelled = todos.filter((t) => t.status === 'cancelled').length;

  const urgent = todos.filter(
    (t) => t.priority === 'urgent' && t.status !== 'completed' && t.status !== 'cancelled'
  ).length;

  const overdue = todos.filter((t) => {
    if (!t.dueDate) return false;
    if (t.status === 'completed' || t.status === 'cancelled') return false;
    return new Date(t.dueDate) < new Date(new Date().toDateString());
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const totalSubtasks = todos.reduce((sum, t) => sum + t.subtasks.length, 0);
  const doneSubtasks = todos.reduce(
    (sum, t) => sum + t.subtasks.filter((s) => s.completed).length,
    0
  );

  const topCategories = Object.entries(
    todos.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (total === 0) return null;

  return (
    <div className="stats-panel">
      <h3>Overview</h3>
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-value">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card stat-in-progress">
          <div className="stat-value">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-not-started">
          <div className="stat-value">{notStarted}</div>
          <div className="stat-label">Not Started</div>
        </div>
        {cancelled > 0 && (
          <div className="stat-card stat-cancelled">
            <div className="stat-value">{cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        )}
        {urgent > 0 && (
          <div className="stat-card stat-urgent">
            <div className="stat-value">{urgent}</div>
            <div className="stat-label">Urgent</div>
          </div>
        )}
        {overdue > 0 && (
          <div className="stat-card stat-overdue">
            <div className="stat-value">{overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        )}
      </div>

      {/* Completion rate bar */}
      <div className="completion-bar-wrap">
        <div className="completion-bar-label">
          <span>Completion rate</span>
          <strong>{completionRate}%</strong>
        </div>
        <div className="completion-bar">
          <div className="completion-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {totalSubtasks > 0 && (
        <div className="completion-bar-wrap">
          <div className="completion-bar-label">
            <span>Subtasks</span>
            <strong>{doneSubtasks}/{totalSubtasks}</strong>
          </div>
          <div className="completion-bar">
            <div
              className="completion-fill subtask-fill"
              style={{ width: `${Math.round((doneSubtasks / totalSubtasks) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {topCategories.length > 0 && (
        <div className="top-categories">
          <h4>Top Categories</h4>
          {topCategories.map(([cat, count]) => (
            <div key={cat} className="category-row">
              <span>{cat}</span>
              <div className="category-bar">
                <div
                  className="category-fill"
                  style={{ width: `${Math.round((count / total) * 100)}%` }}
                />
              </div>
              <span className="category-count">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
