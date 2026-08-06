import React from "react";
import { BarChart } from "../../../../../components/charts";

export default function RegionDistributionChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm dark:shadow-lg h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Region Distribution</h3>
        <p className="text-sm text-muted-foreground">By deployment origin</p>
      </div>
      <div className="flex-1 min-h-0">
        <BarChart
          data={data}
          xKey="region"
          yKey="deployments"
          color="#8b5cf6"
          layout="vertical"
          hideXAxis={true}
          yAxisWidth={100}
          height="100%"
        />
      </div>
    </div>
  );
}
