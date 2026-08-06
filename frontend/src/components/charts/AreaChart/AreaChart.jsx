import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip } from '../shared';
import { defaultGridProps, defaultXAxisProps, defaultYAxisProps } from '../config';

/**
 * AreaChart Primitive
 * A highly reusable, generic area chart component.
 * It is completely presentation-only.
 */
export default function AreaChart({
  data = [],
  xKey = 'name',
  yKey = 'value',
  color = '#6366f1', // default indigo-500
  series, // Array of { key, name, color } for multi-series
  xAxisProps = {},
  yAxisProps = {},
  formatter,
  height = 300,
  isLoading = false,
  isError = false,
  isEmpty = false,
  emptyMessage,
  errorMessage,
}) {
  const chartSeries = series || [{ key: yKey, color }];

  return (
    <ChartContainer
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty || data.length === 0}
      height={height}
      emptyMessage={emptyMessage}
      errorMessage={errorMessage}
    >
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {chartSeries.map((s) => (
            <linearGradient key={`gradient-${s.key}`} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...defaultGridProps} />
        <XAxis dataKey={xKey} {...defaultXAxisProps} {...xAxisProps} />
        <YAxis tickFormatter={formatter} {...defaultYAxisProps} {...yAxisProps} />
        <Tooltip 
          content={<ChartTooltip formatter={formatter} />} 
          cursor={{ fill: 'transparent' }}
        />
        {chartSeries.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#gradient-${s.key})`}
            activeDot={{ r: 6, strokeWidth: 0, fill: s.color }}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
}
