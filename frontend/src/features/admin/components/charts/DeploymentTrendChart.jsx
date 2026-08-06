import Card from "../../../../components/ui/Card";
import { LineChart } from "../../../../components/charts";

export default function DeploymentTrendChart({ data = [] }) {
  if (!data.length) return null;

  return (
    <Card className="p-5 sm:p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-theme-heading tracking-tight">
          Deployment Trend
        </h3>
        <p className="text-sm text-slate-400">Past 7 days</p>
      </div>
      <div className="h-[250px] w-full">
        <LineChart
          data={data}
          xKey="date"
          yKey="deployments"
          color="#818cf8"
          height="100%"
        />
      </div>
    </Card>
  );
}
