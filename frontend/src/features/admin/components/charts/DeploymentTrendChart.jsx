import Card from "../../../../components/ui/Card";
import { LineChart } from "../../../../components/charts";

export default function DeploymentTrendChart({ data = [] }) {
  return (
    <Card className="p-5 sm:p-6 shadow-sm border border-border">
      <div className="mb-4">
        <h3 className="text-base font-bold text-theme-heading tracking-tight">
          Deployment Trend
        </h3>
        <p className="text-xs text-muted-foreground">Historical deployment runs</p>
      </div>
      <div className="h-[240px] w-full">
        {data && data.length > 0 ? (
          <LineChart
            data={data}
            xKey="date"
            yKey="deployments"
            color="#818cf8"
            height="100%"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
            <span className="text-xs">No deployment telemetry recorded for this period</span>
          </div>
        )}
      </div>
    </Card>
  );
}
