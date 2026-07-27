import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Rocket, Globe, Key, User, ArrowUpRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import GithubIcon from '../../../components/ui/GithubIcon';
import { MOCK_RECENT_ACTIVITIES } from '../data/mockDashboardData';

const ACTIVITY_ICON_MAP = {
  deployment: <Rocket className="w-3.5 h-3.5 text-indigo-400" />,
  domain: <Globe className="w-3.5 h-3.5 text-sky-400" />,
  github: <GithubIcon className="w-3.5 h-3.5 text-emerald-400" />,
  env: <Key className="w-3.5 h-3.5 text-amber-400" />,
  user: <User className="w-3.5 h-3.5 text-rose-400" />,

  // Backward compatibility keys
  success: <Rocket className="w-3.5 h-3.5 text-emerald-400" />,
  building: <Rocket className="w-3.5 h-3.5 text-indigo-400" />,
  failed: <Rocket className="w-3.5 h-3.5 text-rose-400" />,
};

const ACTIVITY_DOT_BG = {
  deployment: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  domain: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
  github: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  env: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  user: 'bg-rose-500/10 border-rose-500/30 text-rose-400',

  // Backward compatibility keys
  success: 'bg-emerald-500/10 border-emerald-500/30',
  building: 'bg-indigo-500/10 border-indigo-500/30',
  failed: 'bg-rose-500/10 border-rose-500/30',
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This Week' },
];

export default function RecentActivityTimeline({ activities = MOCK_RECENT_ACTIVITIES }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredActivities = activeFilter === 'all'
    ? activities
    : activities.filter((act) => act.filter === activeFilter);

  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Recent Activity
          </h2>
        </div>

        {/* View All Link */}
        <Link
          to="/dashboard/activity"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors self-end sm:self-auto"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs">
        {FILTERS.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Timeline List */}
      {filteredActivities.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">
          No activity found for this period.
        </div>
      ) : (
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-800/80">
          {filteredActivities.map((act) => (
            <Link
              key={act.id}
              to="/dashboard/activity"
              className="relative flex items-start gap-3 group -mx-2 px-2 py-1.5 rounded-xl hover:bg-slate-800/40 transition-colors block"
            >
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-6 top-1.5 p-1 rounded-full border ${
                  ACTIVITY_DOT_BG[act.type] || 'bg-slate-800 border-slate-700'
                } flex-shrink-0 z-10 bg-[#0c121e] group-hover:scale-110 transition-transform`}
              >
                {ACTIVITY_ICON_MAP[act.type] || <Activity className="w-3.5 h-3.5 text-slate-400" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
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
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}


