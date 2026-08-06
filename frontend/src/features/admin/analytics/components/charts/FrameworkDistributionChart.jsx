import React from "react";
import Card from "../../../../../components/ui/Card";
import { PieChart } from "../../../../../components/charts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#0ea5e9", "#ec4899"];

export default function FrameworkDistributionChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <Card className="h-[350px] flex flex-col" style={{ padding: '1.25rem' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-theme-heading">Framework Distribution</h3>
        <p className="text-sm text-theme-muted">By active projects</p>
      </div>
      <div className="flex-1 min-h-0 relative">
        <PieChart
          data={data}
          dataKey="value"
          nameKey="name"
          colors={COLORS}
          innerRadius={60}
          outerRadius={90}
          showLegend={true}
          height="100%"
        />
      </div>
    </Card>
  );
}
