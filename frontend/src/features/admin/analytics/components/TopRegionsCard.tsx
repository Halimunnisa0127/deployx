import React from 'react';
import { Globe, Activity, Server } from 'lucide-react';

export default function TopRegionsCard({ regions = [] }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 shadow-lg h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Top Regions</h3>
        <p className="text-sm text-slate-400">By deployment volume</p>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="space-y-4">
          {regions.map((region, idx) => (
            <div key={idx} className="flex items-center justify-between group p-2 hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {region.region}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Server className="w-3 h-3" /> {region.percentage}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-300">{region.deployments.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Deployments</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
