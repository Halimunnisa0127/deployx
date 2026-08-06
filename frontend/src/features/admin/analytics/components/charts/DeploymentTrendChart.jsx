import Card from "../../../../../components/ui/Card";
import { AreaChart } from "../../../../../components/charts";

export default function DeploymentTrendChart({ data }) {
  if (!data || !data.length) return null;

  return (
    <Card className="h-[350px] flex flex-col" style={{ padding: '1.25rem' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-theme-heading">Deployments Trend</h3>
        <p className="text-sm text-theme-muted">Daily deployment volume</p>
      </div>
      <div className="flex-1 min-h-0">
        <AreaChart
          data={data}
          xKey="date"
          yKey="deployments"
          color="#6366f1"
          height="100%"
        />
      </div>
    </Card>
  );
}
