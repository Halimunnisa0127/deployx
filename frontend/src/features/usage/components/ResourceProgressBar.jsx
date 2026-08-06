import { Progress } from '../../../components/ui';

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

      <Progress percent={safePercent} color={color} height={height} />
    </div>
  );
}

