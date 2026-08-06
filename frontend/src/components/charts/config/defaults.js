/**
 * Default Recharts configuration objects.
 * Keeps standard visual elements (like axes and grids) completely DRY
 * without over-engineering them into separate React components.
 */

export const defaultGridProps = {
  strokeDasharray: '3 3',
  vertical: false,
  stroke: 'currentColor',
  className: 'text-slate-200 dark:text-slate-800'
};

export const defaultXAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fontSize: 12, fill: '#64748b' }, // slate-500 works on both themes
  dy: 10
};

export const defaultYAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fontSize: 12, fill: '#64748b' },
  dx: -10
};

/**
 * Standard array of colors for Pie/Donut charts
 */
export const defaultCategoricalColors = [
  '#6366f1', // indigo-500
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#8b5cf6', // violet-500
];
