import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MetricChart({ title, data, color, current, unit }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 shadow-lg h-[250px] flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
          <div className="text-2xl font-bold text-white mt-1">
            {current}
            <span className="text-sm text-slate-500 font-normal ml-1">
              {unit}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "0.75rem",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              itemStyle={{ color }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function PerformanceMetrics({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4">Performance Metrics</h2>
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
