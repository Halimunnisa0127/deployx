import { Activity, CheckCircle2, PlayCircle, Globe, Key, AlertCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_RECENT_ACTIVITIES } from '../data/mockDashboardData';

const ACTIVITY_ICON_MAP = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  building: <PlayCircle className="w-4 h-4 text-indigo-400" />,
  domain: <Globe className="w-4 h-4 text-sky-400" />,
  env: <Key className="w-4 h-4 text-amber-400" />,
  failed: <AlertCircle className="w-4 h-4 text-rose-400" />,
};

const ACTIVITY_DOT_BG = {
  success: 'bg-emerald-500/10 border-emerald-500/30',
  building: 'bg-indigo-500/10 border-indigo-500/30',
  domain: 'bg-sky-500/10 border-sky-500/30',
  env: 'bg-amber-500/10 border-amber-500/30',
  failed: 'bg-rose-500/10 border-rose-500/30',
};

export default function RecentActivityTimeline({ activities = MOCK_RECENT_ACTIVITIES }) {
  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Recent Activity
          </h2>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start gap-3 group">
            {/* Timeline Icon Node */}
            <div
              className={`absolute -left-6 top-0.5 p-1 rounded-full border ${
                ACTIVITY_DOT_BG[act.type] || 'bg-slate-800 border-slate-700'
              } flex-shrink-0 z-10 bg-[#0c121e]`}
            >
              {ACTIVITY_ICON_MAP[act.type] || <Activity className="w-4 h-4 text-slate-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                {act.title}
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5 text-[11px] text-slate-400">
                <span className="font-mono text-slate-400 truncate">
                  {act.projectName}
                </span>
                <span className="flex-shrink-0 text-slate-400">
                  {act.timeAgo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
