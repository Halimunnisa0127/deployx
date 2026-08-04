import React from "react";
import { motion } from "framer-motion";
import Card from "../../../../components/ui/Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DeploymentTrendChart({ data }) {
  if (!data || !data.length) return null;

  return (
<<<<<<< HEAD
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-lg h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Deployment Trend</h3>
        <p className="text-sm text-slate-400">
          Total deployments across all projects
        </p>
=======
    <Card className="h-[350px] flex flex-col" style={{ padding: '1.25rem' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-theme-heading">Deployments Trend</h3>
        <p className="text-sm text-theme-muted">Daily deployment volume</p>
>>>>>>> e9bb4d3fc0ed5658293b72b9fb68775ffae8e7f0
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDeployments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              itemStyle={{ color: "#818cf8" }}
            />

            <Area
              type="monotone"
              dataKey="deployments"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDeployments)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

