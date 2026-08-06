
/**
 * ChartTooltip
 * A custom Recharts tooltip that automatically supports light and dark themes
 * using Tailwind CSS, removing the need for hardcoded Recharts styles.
 */
export default function ChartTooltip({ active, payload, label, formatter }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}:{' '}
                <span className="font-semibold text-foreground">
                  {formatter ? formatter(entry.value, entry.name, entry) : entry.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
