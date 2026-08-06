import { ResponsiveContainer } from 'recharts';
import { BarChart3, AlertCircle, Loader2 } from 'lucide-react';

/**
 * ChartContainer
 * A presentation-only wrapper for all Recharts visualizations.
 * Handles loading, error, and empty states globally.
 */
export default function ChartContainer({
  children,
  isLoading = false,
  isError = false,
  isEmpty = false,
  emptyMessage = "No data available",
  errorMessage = "Failed to load chart data",
  height = 300,
  minHeight,
  className = '',
}) {
  const baseClasses = `w-full flex flex-col items-center justify-center ${className}`;
  const containerStyle = { height, minHeight: minHeight || height };

  if (isLoading) {
    return (
      <div className={baseClasses} style={containerStyle}>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading chart data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={baseClasses} style={containerStyle}>
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 mb-3 shadow-sm border border-rose-100 dark:border-rose-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {errorMessage}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={baseClasses} style={containerStyle}>
        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
          <BarChart3 className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {emptyMessage}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          There is no data to display for the selected period
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={containerStyle}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
