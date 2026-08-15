
export function LogsHeader({ onRefresh, onExport, isRefreshing }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-theme-heading">Platform Logs</h1>
        <p className="text-theme-muted mt-1 text-sm">Monitor all system and deployment activity in real time.</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-slate-700 text-theme-secondary text-sm transition-colors disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm transition-colors"
        >
          Export Logs
        </button>
      </div>
    </div>
  );
}
