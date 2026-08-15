import { LogsFilters } from './LogsFilters';

export function LogsToolbar({ filterState, onFilterChange, searchQuery, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <LogsFilters activeFilter={filterState} onFilterChange={onFilterChange} />
      <input
        type="text"
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search messages or sources…"
        className="w-full sm:w-72 px-3 py-2 rounded-xl bg-muted border border-border text-theme-body text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  );
}
