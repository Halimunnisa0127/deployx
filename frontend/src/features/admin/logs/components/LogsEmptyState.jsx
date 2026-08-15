
export function LogsEmptyState({ onRefresh }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <span className="text-3xl">📋</span>
      </div>
      <h3 className="text-lg font-semibold text-theme-body mb-2">No logs found</h3>
      <p className="text-theme-muted text-sm mb-6">There are no log entries matching the current filters.</p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm transition-colors"
        >
          Refresh
        </button>
      )}
    </div>
  );
}
