import Card from "../../../../components/ui/Card";
import { AreaChart } from "../../../../components/charts";

export default function UserGrowthChart({ data = [] }) {
  return (
    <Card className="p-5 sm:p-6 shadow-sm border border-border">
      <div className="mb-4">
        <h3 className="text-base font-bold text-theme-heading tracking-tight">
          User Growth
        </h3>
        <p className="text-xs text-muted-foreground">Account registration metrics</p>
      </div>
      <div className="h-[240px] w-full">
        {data && data.length > 0 ? (
          <AreaChart
            data={data}
            xKey="date"
            yKey="users"
            color="#38bdf8"
            height="100%"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
            <span className="text-xs">No user registration telemetry recorded for this period</span>
          </div>
        )}
      </div>
    </Card>
  );
}
