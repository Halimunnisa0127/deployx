import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip } from '../shared';
import { defaultGridProps, defaultXAxisProps, defaultYAxisProps } from '../config';

/**
 * BarChart Primitive
 */
export default function BarChart({
  data = [],
  xKey = 'name',
  yKey = 'value',
  color = '#6366f1',
  series, // Array of { key, name, color, stackId }
  layout = 'horizontal',
  xAxisProps = {},
  yAxisProps = {},
  hideXAxis, // Legacy for RegionDistributionChart
  yAxisWidth, // Legacy for RegionDistributionChart
  formatter,
  height = 300,
  isLoading = false,
  isError = false,
  isEmpty = false,
  emptyMessage,
  errorMessage,
}) {
  const isVertical = layout === 'vertical';
  const chartSeries = series || [{ key: yKey, color }];

  const mergedXAxisProps = {
    ...defaultXAxisProps,
    ...(hideXAxis !== undefined ? { hide: hideXAxis } : {}),
    ...xAxisProps
  };

  const mergedYAxisProps = {
    ...defaultYAxisProps,
    ...(yAxisWidth !== undefined ? { width: yAxisWidth } : {}),
    ...yAxisProps
  };

  return (
    <ChartContainer
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty || data.length === 0}
      height={height}
      emptyMessage={emptyMessage}
      errorMessage={errorMessage}
    >
      <RechartsBarChart data={data} layout={layout} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid {...defaultGridProps} horizontal={isVertical} vertical={!isVertical} />
        
        {isVertical ? (
          <>
            <XAxis type="number" {...mergedXAxisProps} />
            <YAxis dataKey={xKey} type="category" {...mergedYAxisProps} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...mergedXAxisProps} />
            <YAxis tickFormatter={formatter} {...mergedYAxisProps} />
          </>
        )}

        <Tooltip 
          content={<ChartTooltip formatter={formatter} />} 
          cursor={{ fill: 'currentColor', className: 'text-slate-100 dark:text-slate-800' }}
        />
        
        {chartSeries.map((s, index) => {
          // If stacked and multiple bars, only radius top for last item (index === length - 1)
          const isStacked = !!s.stackId;
          const isLast = index === chartSeries.length - 1;
          const isFirst = index === 0;
          
          let radius = isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0];
          if (isStacked && chartSeries.length > 1) {
             if (isVertical) {
                radius = isLast ? [0, 4, 4, 0] : [0, 0, 0, 0];
             } else {
                radius = isLast ? [4, 4, 0, 0] : [0, 0, 0, 0];
                if (isFirst) radius = [0, 0, 4, 4];
             }
          }

          return (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              stackId={s.stackId}
              radius={radius}
              maxBarSize={48}
            />
          );
        })}
      </RechartsBarChart>
    </ChartContainer>
  );
}
