
export function LogsFilters({ activeFilter, onFilterChange }) {
  const filters = ['all', 'info', 'warn', 'error', 'debug'];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onFilterChange(f === 'all' ? '' : f)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
            (activeFilter || 'all') === f
              ? 'bg-violet-600 text-white'
              : 'bg-muted text-theme-muted hover:bg-slate-700'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
