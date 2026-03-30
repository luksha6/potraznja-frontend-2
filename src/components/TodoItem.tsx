import React, { useState } from 'react';
import type { Todo, Priority, Status } from '../types/todo';
import { useTodos } from '../context/TodoContext';

const PRIORITY_LABELS: Record<Priority, string> = {
  low: '🟢 Low',
  medium: '🟡 Medium',
  high: '🟠 High',
  urgent: '🔴 Urgent',
};

const STATUS_LABELS: Record<Status, string> = {
  'not-started': '⬜ Not Started',
  'in-progress': '🔵 In Progress',
  completed: '✅ Completed',
  cancelled: '❌ Cancelled',
};

const PRIORITY_CLASS: Record<Priority, string> = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high',
  urgent: 'priority-urgent',
};

const STATUS_CLASS: Record<Status, string> = {
  'not-started': 'status-not-started',
  'in-progress': 'status-in-progress',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
};

interface TodoItemProps {
  todo: Todo;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (todo: Todo) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function isOverdue(dueDate: string | null, status: Status): boolean {
  if (!dueDate || status === 'completed' || status === 'cancelled') return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TodoItem({ todo, selected, onSelect, onEdit }: TodoItemProps) {
  const { deleteTodo, toggleSubtask, addSubtask, deleteSubtask, addComment, deleteComment } =
    useTodos();
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;
  const subtaskProgress =
    todo.subtasks.length > 0 ? (completedSubtasks / todo.subtasks.length) * 100 : 0;

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (newSubtask.trim()) {
      addSubtask(todo.id, newSubtask.trim());
      setNewSubtask('');
    }
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(todo.id, newComment.trim(), commentAuthor.trim() || 'Anonymous');
      setNewComment('');
      setCommentAuthor('');
    }
  }

  const overdue = isOverdue(todo.dueDate, todo.status);

  return (
    <div
      className={`todo-item ${todo.status === 'completed' ? 'todo-completed' : ''} ${
        todo.status === 'cancelled' ? 'todo-cancelled' : ''
      }`}
    >
      <div className="todo-item-header">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(todo.id, e.target.checked)}
          className="todo-checkbox"
          title="Select"
        />

        <div className="todo-item-main" onClick={() => setExpanded((v) => !v)}>
          <div className="todo-title-row">
            <span className="todo-title">{todo.title}</span>
            <span className={`badge priority-badge ${PRIORITY_CLASS[todo.priority]}`}>
              {PRIORITY_LABELS[todo.priority]}
            </span>
            <span className={`badge status-badge ${STATUS_CLASS[todo.status]}`}>
              {STATUS_LABELS[todo.status]}
            </span>
          </div>

          <div className="todo-meta">
            <span className="todo-category">📁 {todo.category}</span>
            {todo.assignee && <span className="todo-assignee">👤 {todo.assignee}</span>}
            {todo.dueDate && (
              <span className={`todo-due ${overdue ? 'overdue' : ''}`}>
                📅 {overdue ? '⚠️ ' : ''}{formatDate(todo.dueDate)}
              </span>
            )}
            {todo.estimatedHours != null && (
              <span className="todo-hours">⏱ {todo.estimatedHours}h</span>
            )}
            {todo.subtasks.length > 0 && (
              <span className="todo-subtasks-count">
                ✓ {completedSubtasks}/{todo.subtasks.length}
              </span>
            )}
            {todo.tags.length > 0 && (
              <span className="todo-tags-preview">
                {todo.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
                {todo.tags.length > 3 && <span className="tag">+{todo.tags.length - 3}</span>}
              </span>
            )}
          </div>

          {todo.subtasks.length > 0 && (
            <div className="subtask-progress-bar">
              <div
                className="subtask-progress-fill"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>
          )}
        </div>

        <div className="todo-actions">
          <button
            className="btn-icon"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▲' : '▼'}
          </button>
          <button className="btn-icon" onClick={() => onEdit(todo)} title="Edit">
            ✏️
          </button>
          <button
            className="btn-icon btn-danger"
            onClick={() => {
              if (confirm(`Delete "${todo.title}"?`)) deleteTodo(todo.id);
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {expanded && (
        <div className="todo-item-body">
          {todo.description && (
            <div className="todo-description">
              <p>{todo.description}</p>
            </div>
          )}

          {todo.tags.length > 0 && (
            <div className="todo-tags">
              {todo.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="todo-timestamps">
            <span>Created: {formatDate(todo.createdAt)}</span>
            <span>Updated: {formatDate(todo.updatedAt)}</span>
            {todo.completedAt && <span>Completed: {formatDate(todo.completedAt)}</span>}
          </div>

          {/* Subtasks */}
          <div className="todo-section">
            <h4>Subtasks ({completedSubtasks}/{todo.subtasks.length})</h4>
            <ul className="subtask-list">
              {todo.subtasks.map((s) => (
                <li key={s.id} className="subtask-item">
                  <input
                    type="checkbox"
                    checked={s.completed}
                    onChange={() => toggleSubtask(todo.id, s.id)}
                  />
                  <span className={s.completed ? 'subtask-done' : ''}>{s.title}</span>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => deleteSubtask(todo.id, s.id)}
                    title="Remove subtask"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddSubtask} className="inline-form">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask…"
              />
              <button type="submit" className="btn btn-sm btn-primary">Add</button>
            </form>
          </div>

          {/* Comments */}
          <div className="todo-section">
            <h4>Comments ({todo.comments.length})</h4>
            <ul className="comment-list">
              {todo.comments.map((c) => (
                <li key={c.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{c.author}</strong>
                    <span className="comment-date">{formatDate(c.createdAt)}</span>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => deleteComment(todo.id, c.id)}
                      title="Delete comment"
                    >
                      ✕
                    </button>
                  </div>
                  <p>{c.text}</p>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddComment} className="inline-form comment-form">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Your name (optional)"
                className="comment-author-input"
              />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment…"
                className="comment-text-input"
              />
              <button type="submit" className="btn btn-sm btn-primary">Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
