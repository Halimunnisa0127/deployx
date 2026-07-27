import { useState } from 'react';
import { TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_DEPLOYMENT_TRENDS } from '../data/mockDashboardData';

export default function DeploymentTrendsCard({ data = MOCK_DEPLOYMENT_TRENDS }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const totalSuccess = data.reduce((acc, curr) => acc + curr.success, 0);
  const totalFailed = data.reduce((acc, curr) => acc + curr.failed, 0);
  const maxVal = Math.max(...data.map((d) => d.success + d.failed), 35);

  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100 tracking-tight">
              Deployment Trends
            </h2>
            <p className="text-xs text-slate-400">
              Daily deployment activity over the last 7 days
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Successful ({totalSuccess})</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Failed ({totalFailed})</span>
          </div>
        </div>
      </div>

      {/* Lightweight SVG Bar & Trend Chart */}
      <div className="space-y-4 pt-2">
        <div className="relative h-44 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
          {data.map((item, index) => {
            const successHeight = Math.round((item.success / maxVal) * 100);
            const failedHeight = Math.round((item.failed / maxVal) * 100);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.day}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Tooltip Overlay */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 shadow-xl text-[11px] font-mono text-slate-200 whitespace-nowrap pointer-events-none transition-all">
                    <div className="font-bold text-slate-100 border-b border-slate-800 pb-0.5 mb-0.5">
                      {item.day}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {item.success}
                      </span>
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> {item.failed}
                      </span>
                    </div>
                  </div>
                )}

                {/* Stacked Vertical Bars */}
                <div className="w-full max-w-[36px] bg-slate-800/40 rounded-t-lg overflow-hidden flex flex-col justify-end gap-0.5 p-0.5 group-hover:bg-slate-800/80 transition-colors">
                  {/* Failed Bar (Top) */}
                  {item.failed > 0 && (
                    <div
                      className="w-full bg-rose-500/90 rounded-t transition-all duration-300 group-hover:bg-rose-400"
                      style={{ height: `${Math.max(failedHeight, 6)}%` }}
                    />
                  )}

                  {/* Success Bar (Bottom) */}
                  <div
                    className="w-full bg-emerald-500/90 rounded transition-all duration-300 group-hover:bg-emerald-400"
                    style={{ height: `${Math.max(successHeight, 8)}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className="text-xs font-mono text-slate-400 mt-2 group-hover:text-slate-200 transition-colors">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
