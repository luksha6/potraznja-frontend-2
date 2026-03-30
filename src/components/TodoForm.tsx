import React, { useState } from 'react';
import type { Todo, Priority, Status } from '../types/todo';
import { useTodos } from '../context/TodoContext';

interface TodoFormProps {
  todo?: Todo;
  onClose: () => void;
}

const CATEGORIES = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Learning', 'Other'];

export default function TodoForm({ todo, onClose }: TodoFormProps) {
  const { addTodo, updateTodo, allCategories, allTags } = useTodos();
  const isEdit = !!todo;

  const [title, setTitle] = useState(todo?.title ?? '');
  const [description, setDescription] = useState(todo?.description ?? '');
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? 'medium');
  const [status, setStatus] = useState<Status>(todo?.status ?? 'not-started');
  const [category, setCategory] = useState(todo?.category ?? 'General');
  const [customCategory, setCustomCategory] = useState('');
  const [tagsInput, setTagsInput] = useState(todo?.tags.join(', ') ?? '');
  const [dueDate, setDueDate] = useState(todo?.dueDate ?? '');
  const [assignee, setAssignee] = useState(todo?.assignee ?? '');
  const [estimatedHours, setEstimatedHours] = useState<string>(
    todo?.estimatedHours != null ? String(todo.estimatedHours) : ''
  );
  const [error, setError] = useState('');

  const mergedCategories = [...new Set([...CATEGORIES, ...allCategories])];
  const existingTags = allTags;

  function parseTags(input: string): string[] {
    return input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const finalCategory = category === '__custom__' ? customCategory.trim() || 'General' : category;
    const tags = parseTags(tagsInput);
    const hours = estimatedHours ? parseFloat(estimatedHours) : null;

    const data: Partial<Todo> = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category: finalCategory,
      tags,
      dueDate: dueDate || null,
      assignee: assignee.trim(),
      estimatedHours: hours,
    };

    if (isEdit && todo) {
      updateTodo({
        ...todo,
        ...data,
        completedAt:
          status === 'completed' && todo.status !== 'completed'
            ? new Date().toISOString()
            : status !== 'completed'
            ? null
            : todo.completedAt,
      } as Todo);
    } else {
      addTodo(data);
    }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Todo' : 'New Todo'}</h2>
          <button className="btn-icon" onClick={onClose} title="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="todo-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add more details..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                <option value="not-started">⬜ Not Started</option>
                <option value="in-progress">🔵 In Progress</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {mergedCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__custom__">+ Custom…</option>
              </select>
              {category === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                  style={{ marginTop: '0.4rem' }}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignee">Assignee</label>
              <input
                id="assignee"
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Who is responsible?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="estimatedHours">Estimated Hours</label>
              <input
                id="estimatedHours"
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g. 2.5"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. frontend, urgent, bug"
            />
            {existingTags.length > 0 && (
              <div className="tag-suggestions">
                {existingTags.slice(0, 12).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="tag tag-btn"
                    onClick={() => {
                      const current = parseTags(tagsInput);
                      if (!current.includes(tag)) {
                        setTagsInput([...current, tag].join(', '));
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
