import React from "react";
import Card from "../../../../../components/ui/Card";
import { BarChart } from "../../../../../components/charts";

export default function DeploymentSuccessChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <Card className="h-[350px] flex flex-col" style={{ padding: '1.25rem' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-theme-heading">Success vs Failed</h3>
        <p className="text-sm text-theme-muted">Deployments health</p>
      </div>
      <div className="flex-1 min-h-0">
        <BarChart
          data={data}
          xKey="date"
          series={[
            { key: "deployments", name: "Successful", color: "#10b981", stackId: "a" },
            { key: "failures", name: "Failed", color: "#ef4444", stackId: "a" }
          ]}
          height="100%"
        />
      </div>
    </Card>
  );
}
