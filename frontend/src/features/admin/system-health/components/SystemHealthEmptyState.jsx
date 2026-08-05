import React from "react";
import { Activity, ShieldCheck, ServerCrash } from "lucide-react";
import Button from "../../../../components/ui/Button";

export function NoMetricsEmptyState({ onRefresh }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-10 flex flex-col items-center justify-center text-center col-span-full h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">No Metrics Data</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Performance metrics are currently unavailable.
      </p>
      <Button variant="secondary" onClick={onRefresh}>
        Retry Connection
      </Button>
    </div>
  );
}

export function NoIncidentsEmptyState() {
  return (
    <div className="bg-card rounded-2xl border border-border p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
        <ShieldCheck className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        All Systems Operational
      </h3>
      <p className="text-muted-foreground max-w-sm">
        No recent incidents or outages to report. The platform is running
        smoothly.
      </p>
    </div>
  );
}

export function NoInfrastructureEmptyState({ onRefresh }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-10 flex flex-col items-center justify-center text-center col-span-full h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
        <ServerCrash className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        Infrastructure Unreachable
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Cannot retrieve status of infrastructure services.
      </p>
      <Button variant="primary" onClick={onRefresh}>
        Refresh Data
      </Button>
    </div>
  );
}
