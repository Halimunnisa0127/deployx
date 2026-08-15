
const levelColors = {
  info:  'text-blue-400 bg-blue-400/10',
  warn:  'text-yellow-400 bg-yellow-400/10',
  error: 'text-red-400 bg-red-400/10',
  debug: 'text-theme-muted bg-slate-400/10',
};

export function LogRow({ log, onClick }) {
  return (
    <tr 
      onClick={onClick}
      className="hover:bg-muted transition-colors cursor-pointer"
    >
      <td className="px-4 py-3 text-theme-muted font-mono text-xs whitespace-nowrap">{log.timestamp}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase ${levelColors[log.level] ?? levelColors.debug}`}>
          {log.level}
        </span>
      </td>
      <td className="px-4 py-3 text-theme-secondary font-mono text-xs">{log.source}</td>
      <td className="px-4 py-3 text-theme-body truncate max-w-xs">{log.message}</td>
    </tr>
  );
}
