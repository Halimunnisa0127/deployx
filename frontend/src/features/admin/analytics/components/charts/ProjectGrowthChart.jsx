import React from "react";
import Card from "../../../../../components/ui/Card";
import { BarChart } from "../../../../../components/charts";

export default function ProjectGrowthChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <Card className="h-[350px] flex flex-col" style={{ padding: '1.25rem' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-theme-heading">Project Growth</h3>
        <p className="text-sm text-theme-muted">Cumulative active projects</p>
      </div>
      <div className="flex-1 min-h-0">
        <BarChart
          data={data}
          xKey="month"
          yKey="projects"
          color="#0ea5e9"
          height="100%"
        />
      </div>
    </Card>
  );
}
