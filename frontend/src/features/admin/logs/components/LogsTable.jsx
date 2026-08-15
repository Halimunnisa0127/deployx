import { LogRow } from './LogRow';

export function LogsTable({ logs, onRowClick }) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-card">
          <tr>
            {['Timestamp', 'Level', 'Source', 'Message'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {logs.map((log, i) => (
            <LogRow key={log.id ?? i} log={log} onClick={() => onRowClick?.(log)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
