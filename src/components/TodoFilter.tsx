import type { Priority, Status, SortField, SortOrder } from '../types/todo';
import { useTodos } from '../context/TodoContext';

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high', label: '🟠 High' },
  { value: 'urgent', label: '🔴 Urgent' },
];

const STATUSES: { value: Status; label: string }[] = [
  { value: 'not-started', label: '⬜ Not Started' },
  { value: 'in-progress', label: '🔵 In Progress' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'cancelled', label: '❌ Cancelled' },
];

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
];

export default function TodoFilter() {
  const { state, setFilter, resetFilter, allCategories, allTags, allAssignees, filteredTodos } =
    useTodos();
  const { filter } = state;

  function toggleMulti<T extends string>(
    current: T[],
    value: T,
    field: string
  ) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilter({ [field]: next } as never);
  }

  const activeFilterCount =
    (filter.searchText ? 1 : 0) +
    filter.statuses.length +
    filter.priorities.length +
    filter.categories.length +
    filter.tags.length +
    filter.assignees.length +
    (filter.dueDateFrom ? 1 : 0) +
    (filter.dueDateTo ? 1 : 0);

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <h3>Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}</h3>
        {activeFilterCount > 0 && (
          <button className="btn btn-sm btn-secondary" onClick={resetFilter}>
            Clear
          </button>
        )}
      </div>

      <div className="filter-results">
        Showing <strong>{filteredTodos.length}</strong> of <strong>{state.todos.length}</strong>
      </div>

      {/* Search */}
      <div className="filter-section">
        <input
          type="search"
          placeholder="Search todos…"
          value={filter.searchText}
          onChange={(e) => setFilter({ searchText: e.target.value })}
          className="filter-search"
        />
      </div>

      {/* Sort */}
      <div className="filter-section">
        <label className="filter-label">Sort By</label>
        <div className="sort-controls">
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ sortBy: e.target.value as SortField })}
          >
            {SORT_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() =>
              setFilter({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' as SortOrder })
            }
            title="Toggle sort order"
          >
            {filter.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="filter-section">
        <label className="filter-label">Status</label>
        <div className="filter-chips">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              className={`chip ${filter.statuses.includes(s.value) ? 'chip-active' : ''}`}
              onClick={() => toggleMulti(filter.statuses, s.value, 'statuses')}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="filter-section">
        <label className="filter-label">Priority</label>
        <div className="filter-chips">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              className={`chip ${filter.priorities.includes(p.value) ? 'chip-active' : ''}`}
              onClick={() => toggleMulti(filter.priorities, p.value, 'priorities')}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      {allCategories.length > 0 && (
        <div className="filter-section">
          <label className="filter-label">Category</label>
          <div className="filter-chips">
            {allCategories.map((c) => (
              <button
                key={c}
                className={`chip ${filter.categories.includes(c) ? 'chip-active' : ''}`}
                onClick={() => toggleMulti(filter.categories, c, 'categories')}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="filter-section">
          <label className="filter-label">Tags</label>
          <div className="filter-chips">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`chip tag-chip ${filter.tags.includes(tag) ? 'chip-active' : ''}`}
                onClick={() => toggleMulti(filter.tags, tag, 'tags')}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Assignee */}
      {allAssignees.length > 0 && (
        <div className="filter-section">
          <label className="filter-label">Assignee</label>
          <div className="filter-chips">
            {allAssignees.map((a) => (
              <button
                key={a}
                className={`chip ${filter.assignees.includes(a) ? 'chip-active' : ''}`}
                onClick={() => toggleMulti(filter.assignees, a, 'assignees')}
              >
                👤 {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Due Date Range */}
      <div className="filter-section">
        <label className="filter-label">Due Date Range</label>
        <div className="date-range">
          <input
            type="date"
            value={filter.dueDateFrom ?? ''}
            onChange={(e) => setFilter({ dueDateFrom: e.target.value || null })}
            title="From"
          />
          <span>–</span>
          <input
            type="date"
            value={filter.dueDateTo ?? ''}
            onChange={(e) => setFilter({ dueDateTo: e.target.value || null })}
            title="To"
          />
        </div>
      </div>
    </aside>
  );
}
