import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltip } from '../shared';
import { defaultCategoricalColors } from '../config';

/**
 * PieChart Primitive
 */
export default function PieChart({
  data = [],
  nameKey = 'name',
  dataKey = 'value',
  colors = defaultCategoricalColors,
  showLegend = false,
  formatter,
  height = 300,
  isLoading = false,
  isError = false,
  isEmpty = false,
  emptyMessage,
  errorMessage,
  innerRadius = 60, // set > 0 for a Donut chart
  outerRadius = 90,
}) {
  return (
    <ChartContainer
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty || data.length === 0}
      height={height}
      emptyMessage={emptyMessage}
      errorMessage={errorMessage}
    >
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: showLegend ? 20 : 10 }}>
        <Pie
          data={data}
          nameKey={nameKey}
          dataKey={dataKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={5}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          content={<ChartTooltip formatter={formatter} />} 
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
          />
        )}
      </RechartsPieChart>
    </ChartContainer>
  );
}
