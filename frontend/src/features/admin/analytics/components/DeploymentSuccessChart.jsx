import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DeploymentSuccessChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-lg h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Success vs Failed</h3>
        <p className="text-sm text-slate-400">Deployments health</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "0.75rem",
                color: "#f8fafc",
              }}
              cursor={{ fill: "#1e293b", opacity: 0.4 }}
            />

            <Legend
              wrapperStyle={{
                fontSize: "12px",
                color: "#94a3b8",
                paddingTop: "10px",
              }}
            />
            <Bar
              dataKey="deployments"
              name="Successful"
              stackId="a"
              fill="#10b981"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="failures"
              name="Failed"
              stackId="a"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

