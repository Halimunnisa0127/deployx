
/** Helper to syntax-highlight log text tokens */
function renderHighlightedText(text, logType) {
  if (!text) return null;

  // Split line into tokens using regex for file sizes, checkmarks, file paths, URLs, and keywords
  const regex = new RegExp("(✓|DONE|SUCCESS|ERROR|FATAL|WARN|Warning|https?://[^\\s]+|[a-zA-Z0-9_/-]+\\.[a-zA-Z0-9]+|\\d+(?:\\.\\d+)?\\s*(?:kB|MB|B|GB|ms|s))", "g");
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), style: '' });
    }

    const val = match[0];
    let style = '';

    if (val === '✓' || val === 'DONE' || val === 'SUCCESS') {
      style = 'text-emerald-500 font-bold';
    } else if (val.toUpperCase().includes('ERROR') || val === 'FATAL') {
      style = 'text-rose-500 font-bold bg-rose-500/10 px-1 rounded';
    } else if (val.toUpperCase().includes('WARN')) {
      style = 'text-amber-500 font-semibold';
    } else if (val.startsWith('http')) {
      style = 'text-sky-500 underline hover:text-sky-600 dark:hover:text-sky-400';
    } else if (val.match(/\.(js|html|css|json|zip|png|svg|ts|jsx|tsx)$/)) {
      style = 'text-purple-500 font-medium font-mono';
    } else if (val.match(/\d+(?:\.\d+)?\s*(?:kB|MB|B|GB|ms|s)/)) {
      style = 'text-amber-500 font-mono font-medium';
    }

    parts.push({ text: val, style });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), style: '' });
  }

  let baseColor = 'text-foreground';
  if (logType === 'success') baseColor = 'text-emerald-500 font-medium';
  if (logType === 'warning') baseColor = 'text-amber-500 font-medium';
  if (logType === 'error') baseColor = 'text-rose-500 font-semibold';
  if (logType === 'debug') baseColor = 'text-muted-foreground';

  return (
    <span className={baseColor}>
      {parts.map((p, i) => (
        <span key={i} className={p.style || undefined}>
          {p.text}
        </span>
      ))}
    </span>
  );
}

export default function BuildLogLine({ log, isWordWrap = true }) {
  const { time, type, text } = log;

  return (
    <div className={`flex items-start gap-3 hover:bg-muted py-1 px-2 rounded font-mono text-xs leading-relaxed transition-colors ${isWordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'}`}>
      {time && (
        <span className="text-muted-foreground shrink-0 select-none text-sm font-mono">
          [{time}]
        </span>
      )}
      <div className="flex-1">
        {renderHighlightedText(text, type)}
      </div>
    </div>
  );
}
