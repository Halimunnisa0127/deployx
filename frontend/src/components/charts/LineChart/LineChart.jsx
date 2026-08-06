import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip } from '../shared';
import { defaultGridProps, defaultXAxisProps, defaultYAxisProps } from '../config';

/**
 * LineChart Primitive
 */
export default function LineChart({
  data = [],
  xKey = 'name',
  yKey = 'value',
  color = '#6366f1',
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
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid {...defaultGridProps} />
        <XAxis dataKey={xKey} {...defaultXAxisProps} {...xAxisProps} />
        <YAxis tickFormatter={formatter} {...defaultYAxisProps} {...yAxisProps} />
        <Tooltip 
          content={<ChartTooltip formatter={formatter} />} 
          cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        {chartSeries.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: s.color }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
}
