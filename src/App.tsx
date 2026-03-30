import { useState } from 'react';
import { TodoProvider } from './context/TodoContext';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import TodoStats from './components/TodoStats';
import TodoForm from './components/TodoForm';
import './App.css';

function AppContent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📝 TodoPro</h1>
            <span className="header-subtitle">Complex Task Manager</span>
          </div>
          <button className="btn btn-primary btn-add" onClick={() => setShowForm(true)}>
            + New Todo
          </button>
        </div>
      </header>

      {showForm && <TodoForm onClose={() => setShowForm(false)} />}

      <main className="app-main">
        <aside className="sidebar">
          <TodoStats />
          <TodoFilter />
        </aside>
        <section className="content">
          <TodoList />
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}
