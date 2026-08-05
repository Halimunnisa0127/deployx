import React from "react";
import { Globe, Server } from "lucide-react";

export default function TopRegionsCard({ regions = [] }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm dark:shadow-lg h-[350px] flex flex-col">

      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Top Regions</h3>
        <p className="text-sm text-muted-foreground">By deployment volume</p>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="space-y-4">
          {regions.map((region, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between group p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {region.region}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Server className="w-3 h-3" /> {region.percentage}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-muted-foreground">
                  {region.deployments.toLocaleString()}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-500">{region.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

