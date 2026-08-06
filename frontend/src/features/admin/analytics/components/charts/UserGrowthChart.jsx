import React from "react";
import { AreaChart } from "../../../../../components/charts";

export default function UserGrowthChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm dark:shadow-lg h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">User Growth</h3>
        <p className="text-sm text-muted-foreground">
          Total and active users over time
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <AreaChart
          data={data}
          xKey="date"
          series={[
            { key: "users", name: "Total Users", color: "#10b981" },
            { key: "active", name: "Active Users", color: "#f59e0b" }
          ]}
          height="100%"
        />
      </div>
    </div>
  );
}
