import React from 'react';

export default function BuildLogLine({ log }) {
  const { id, time, type, text } = log;

  let textColor = 'text-slate-200';
  let badgeStyle = '';

  switch (type) {
    case 'success':
      textColor = 'text-emerald-400 font-semibold';
      break;
    case 'warning':
      textColor = 'text-amber-400 font-medium';
      break;
    case 'error':
      textColor = 'text-red-400 font-bold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/20';
      break;
    case 'debug':
      textColor = 'text-slate-400 font-mono';
      break;
    case 'info':
    default:
      textColor = 'text-slate-200';
      break;
  }

  return (
    <div className="flex items-start gap-3 hover:bg-slate-900/60 py-1 px-2 rounded font-mono text-xs leading-relaxed transition-colors">
      {time && (
        <span className="text-slate-500 shrink-0 select-none text-[11px]">
          [{time}]
        </span>
      )}
      <span className={`break-all ${textColor}`}>
        {text}
      </span>
    </div>
  );
}
