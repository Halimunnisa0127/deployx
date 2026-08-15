
export function LogsStatistics({ logs }) {
  const total = logs.length;
  const errors = logs.filter(l => l.level === 'error').length;
  const warnings = logs.filter(l => l.level === 'warn').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-theme-muted text-xs font-semibold uppercase">Total Logs</p>
        <p className="text-2xl font-bold text-theme-heading mt-1">{total}</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-theme-muted text-xs font-semibold uppercase">Errors</p>
        <p className="text-2xl font-bold text-red-500 mt-1">{errors}</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-theme-muted text-xs font-semibold uppercase">Warnings</p>
        <p className="text-2xl font-bold text-yellow-500 mt-1">{warnings}</p>
      </div>
    </div>
  );
}
