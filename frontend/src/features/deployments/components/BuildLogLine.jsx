import React from 'react';

/** Helper to syntax-highlight log text tokens */
function renderHighlightedText(text, logType) {
  if (!text) return null;

  // Split line into tokens using regex for file sizes, checkmarks, file paths, URLs, and keywords
  const regex = /(✓|DONE|SUCCESS|ERROR|FATAL|WARN|Warning|https?:\/\/[^\s]+|[a-zA-Z0-9_\-\/]+\.[a-zA-Z0-9]+|\d+(?:\.\d+)?\s*(?:kB|MB|B|GB|ms|s))/g;
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
      style = 'text-emerald-600 dark:text-emerald-400 font-bold';
    } else if (val.toUpperCase().includes('ERROR') || val === 'FATAL') {
      style = 'text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-950/60 px-1 rounded';
    } else if (val.toUpperCase().includes('WARN')) {
      style = 'text-amber-600 dark:text-amber-400 font-semibold';
    } else if (val.startsWith('http')) {
      style = 'text-sky-600 dark:text-sky-400 underline hover:text-sky-500 dark:hover:text-sky-300';
    } else if (val.match(/\.(js|html|css|json|zip|png|svg|ts|jsx|tsx)$/)) {
      style = 'text-purple-600 dark:text-purple-300 font-medium font-mono';
    } else if (val.match(/\d+(?:\.\d+)?\s*(?:kB|MB|B|GB|ms|s)/)) {
      style = 'text-amber-600 dark:text-amber-300 font-mono font-medium';
    }

    parts.push({ text: val, style });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), style: '' });
  }

  let baseColor = 'text-slate-700 dark:text-slate-300';
  if (logType === 'success') baseColor = 'text-emerald-700 dark:text-emerald-300 font-medium';
  if (logType === 'warning') baseColor = 'text-amber-700 dark:text-amber-300 font-medium';
  if (logType === 'error') baseColor = 'text-rose-700 dark:text-rose-300 font-semibold';
  if (logType === 'debug') baseColor = 'text-slate-500 dark:text-slate-400';

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
  const { id, time, type, text } = log;

  return (
    <div className={`flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/60 py-1 px-2 rounded font-mono text-xs leading-relaxed transition-colors ${isWordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'}`}>
      {time && (
        <span className="text-slate-500 shrink-0 select-none text-sm font-mono">
          [{time}]
        </span>
      )}
      <div className="flex-1">
        {renderHighlightedText(text, type)}
      </div>
    </div>
  );
}
