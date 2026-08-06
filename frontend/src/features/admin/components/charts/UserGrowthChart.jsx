import React from "react";
import Card from "../../../../components/ui/Card";
import { AreaChart } from "../../../../components/charts";

export default function UserGrowthChart({ data = [] }) {
  if (!data.length) return null;

  return (
    <Card className="p-5 sm:p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-theme-heading tracking-tight">
          User Growth
        </h3>
        <p className="text-sm text-slate-400">Past 30 days</p>
      </div>
      <div className="h-[250px] w-full">
        <AreaChart
          data={data}
          xKey="date"
          yKey="users"
          color="#38bdf8"
          height="100%"
        />
      </div>
    </Card>
  );
}
