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
          <span className="text-foreground">{usedLabel || `${safePercent}% used`}</span>
          <span className="text-muted-foreground">{remainingLabel || `${100 - safePercent}% remaining`}</span>
        </div>
      )}

      <div className={`${height} w-full bg-muted rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color} rounded-full transition-all duration-[250ms] ease-out`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
