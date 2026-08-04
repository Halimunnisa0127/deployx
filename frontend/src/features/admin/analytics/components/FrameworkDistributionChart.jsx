import React from "react";
import { motion } from "framer-motion";
import Card from "../../../../components/ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#0ea5e9", "#ec4899"];

export default function FrameworkDistributionChart({ data }) {
  if (!data || !data.length) return null;

  return (
<<<<<<< HEAD
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 p-5 shadow-lg h-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-white">Frameworks</h3>
        <p className="text-sm text-slate-400">Distribution by usage</p>
=======
    <Card className="h-[350px] flex flex-col" style={{ padding: '1.25rem' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-theme-heading">Framework Distribution</h3>
        <p className="text-sm text-theme-muted">By active projects</p>
>>>>>>> e9bb4d3fc0ed5658293b72b9fb68775ffae8e7f0
      </div>
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "0.75rem",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#e2e8f0" }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

