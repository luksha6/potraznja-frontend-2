# ptoraznja-frontend-2

> **Note:** This project is a technical demonstration and testing of Free/Lightweight Cursor AI models for end-to-end rapid prototyping.

## Todo Task Manager

A React + Vite + Tailwind CSS demo focused on **advanced search and filtering**: multi-parameter filters, debounced text search (300ms), and a centralized `useTaskFilters` hook plus `SearchProvider` for app-wide access.

### Stack

- **React 18** with TypeScript
- **Tailwind CSS** for layout and styling
- **MirageJS** mock API (`GET /api/tasks`) with 20 seeded tasks
- **Vite** for dev and production builds

### Features

| Area | Details |
|------|---------|
| Mock API | Mirage serves `tasks` from `src/mock/seedTasks.ts` (20 items: id, title, description, category, status, priority) |
| Filters | Text search (title + description), category, status, priority — combined with AND logic |
| Debounce | Search input debounced by **300ms** in `src/hooks/useTaskFilters.ts` |
| Empty state | “No results found” with **Clear filters** when any filter is active |
| Layout | Sidebar (filters) + main task grid; responsive breakpoints |

### Scripts

```bash
npm install
npm run dev      # Mirage runs in development; open the printed URL
npm run build
npm run preview  # Production build (no Mirage — use dev for full mock)
```

### Project layout

- `src/hooks/useTaskFilters.ts` — **all filter/search logic** in one module
- `src/context/SearchProvider.tsx` — loads tasks, wraps `useTaskFilters`, exposes `useSearch()`
- `src/mock/server.ts` — Mirage route definitions
- `src/components/` — `Sidebar`, `TaskBoard`, `TaskCard`
