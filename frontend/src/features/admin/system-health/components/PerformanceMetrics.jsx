import { AreaChart } from "../../../../components/charts";

function MetricChart({ title, data, color, current, unit }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-lg h-[250px] flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
          <div className="text-2xl font-bold text-foreground mt-1">
            {current}
            <span className="text-sm text-muted-foreground font-normal ml-1">
              {unit}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 mt-4">
        <AreaChart
          data={data}
          xKey="time"
          yKey="value"
          color={color}
          height="100%"
        />
      </div>
    </div>
  );
}

export default function PerformanceMetrics({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-foreground mb-4">Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricChart
          title="CPU Usage"
          data={metrics.cpu.data}
          current={metrics.cpu.current}
          unit="%"
          color="#3b82f6"
        />

        <MetricChart
          title="Memory Usage"
          data={metrics.memory.data}
          current={metrics.memory.current}
          unit="%"
          color="#10b981"
        />

        <MetricChart
          title="Disk Usage"
          data={metrics.disk.data}
          current={metrics.disk.current}
          unit="%"
          color="#f59e0b"
        />

        <MetricChart
          title="Network Traffic"
          data={metrics.network.data}
          current={metrics.network.current}
          unit="Mbps"
          color="#8b5cf6"
        />

        <MetricChart
          title="Active Connections"
          data={metrics.connections.data}
          current={metrics.connections.current}
          unit=""
          color="#ec4899"
        />

        <MetricChart
          title="Requests Per Minute"
          data={metrics.requests.data}
          current={metrics.requests.current}
          unit="rpm"
          color="#0ea5e9"
        />
      </div>
    </div>
  );
}
