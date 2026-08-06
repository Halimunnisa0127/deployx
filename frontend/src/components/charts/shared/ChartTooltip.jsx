import React from 'react';

/**
 * ChartTooltip
 * A custom Recharts tooltip that automatically supports light and dark themes
 * using Tailwind CSS, removing the need for hardcoded Recharts styles.
 */
export default function ChartTooltip({ active, payload, label, formatter }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {entry.name}:{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
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
