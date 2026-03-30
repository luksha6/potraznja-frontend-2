import { useState } from 'react';
import type { Todo, Status } from '../types/todo';
import { useTodos } from '../context/TodoContext';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

export default function TodoList() {
  const { filteredTodos, bulkDelete, bulkUpdateStatus } = useTodos();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [bulkStatus, setBulkStatus] = useState<Status>('completed');

  function toggleSelect(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filteredTodos.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredTodos.map((t) => t.id)));
    }
  }

  function handleBulkDelete() {
    if (selected.size === 0) return;
    if (confirm(`Delete ${selected.size} selected todos?`)) {
      bulkDelete([...selected]);
      setSelected(new Set());
    }
  }

  function handleBulkStatusUpdate() {
    if (selected.size === 0) return;
    bulkUpdateStatus([...selected], bulkStatus);
    setSelected(new Set());
  }

  return (
    <>
      {editingTodo && (
        <TodoForm todo={editingTodo} onClose={() => setEditingTodo(null)} />
      )}

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No todos found. Try adjusting filters or add a new todo!</p>
        </div>
      ) : (
        <>
          <div className="bulk-actions">
            <label className="select-all-label">
              <input
                type="checkbox"
                checked={selected.size === filteredTodos.length && filteredTodos.length > 0}
                onChange={toggleSelectAll}
              />
              <span>Select all ({filteredTodos.length})</span>
            </label>
            {selected.size > 0 && (
              <div className="bulk-controls">
                <span className="selected-count">{selected.size} selected</span>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as Status)}
                  className="bulk-status-select"
                >
                  <option value="not-started">⬜ Not Started</option>
                  <option value="in-progress">🔵 In Progress</option>
                  <option value="completed">✅ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
                <button className="btn btn-sm btn-secondary" onClick={handleBulkStatusUpdate}>
                  Set Status
                </button>
                <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                selected={selected.has(todo.id)}
                onSelect={toggleSelect}
                onEdit={(t) => setEditingTodo(t)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
