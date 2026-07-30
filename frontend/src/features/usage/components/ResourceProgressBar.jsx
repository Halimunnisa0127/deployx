export default function ResourceProgressBar({
  percent = 0,
  color = 'bg-indigo-500',
  usedLabel,
  remainingLabel,
  height = 'h-2.5',
  showLabels = true,
  className = '',
}) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabels && (usedLabel || remainingLabel) && (
        <div className="flex items-center justify-between text-xs font-mono font-semibold">
          <span className="text-slate-800 dark:text-slate-200">{usedLabel || `${safePercent}% used`}</span>
          <span className="text-slate-600 dark:text-slate-400">{remainingLabel || `${100 - safePercent}% remaining`}</span>
        </div>
      )}

      <div className={`${height} w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color} rounded-full transition-all duration-[250ms] ease-out`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
