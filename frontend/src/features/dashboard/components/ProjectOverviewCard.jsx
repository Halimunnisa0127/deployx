import { LayoutGrid } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_PROJECT_OVERVIEW } from '../data/mockDashboardData';

export default function ProjectOverviewCard({ overview = MOCK_PROJECT_OVERVIEW }) {
  const { total = 12, liveCount = 9, buildingCount = 2, failedCount = 1 } = overview;

  const livePercent = Math.round((liveCount / total) * 100);
  const buildingPercent = Math.round((buildingCount / total) * 100);
  const failedPercent = Math.round((failedCount / total) * 100);

  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Project Overview
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-400 font-mono">
          {total} Total
        </span>
      </div>

      {/* Progress Breakdown */}
      <div className="space-y-4">
        {/* Live Projects */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live Projects
            </span>
            <span className="font-mono font-semibold text-slate-200">
              {liveCount} <span className="text-slate-400 font-normal">({livePercent}%)</span>
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${livePercent}%` }}
            />
          </div>
        </div>

        {/* Building Projects */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Building Projects
            </span>
            <span className="font-mono font-semibold text-slate-200">
              {buildingCount} <span className="text-slate-400 font-normal">({buildingPercent}%)</span>
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${buildingPercent}%` }}
            />
          </div>
        </div>

        {/* Failed Projects */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Failed Projects
            </span>
            <span className="font-mono font-semibold text-slate-200">
              {failedCount} <span className="text-slate-400 font-normal">({failedPercent}%)</span>
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${failedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
