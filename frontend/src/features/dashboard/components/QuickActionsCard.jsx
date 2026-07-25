import { Link } from 'react-router-dom';
import { FolderPlus, GitBranch, Terminal, Globe, ArrowUpRight, Zap } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_QUICK_ACTIONS } from '../data/mockDashboardData';

const ACTION_ICON_MAP = {
  FolderPlus: <FolderPlus className="w-5 h-5 text-indigo-400" />,
  GitBranch: <GitBranch className="w-5 h-5 text-emerald-400" />,
  Terminal: <Terminal className="w-5 h-5 text-amber-400" />,
  Globe: <Globe className="w-5 h-5 text-sky-400" />,
};

const ACCENT_BG = {
  FolderPlus: 'bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20',
  GitBranch: 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20',
  Terminal: 'bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20',
  Globe: 'bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-500/20',
};

export default function QuickActionsCard({ actions = MOCK_QUICK_ACTIONS }) {
  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Card Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80 mb-4">
        <Zap className="w-5 h-5 text-amber-400" />
        <h2 className="text-base font-bold text-slate-100 tracking-tight">
          Quick Actions
        </h2>
      </div>

      {/* Grid of Clickable Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className="group relative flex flex-col justify-between p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className={`p-2.5 rounded-lg border ${ACCENT_BG[action.icon] || 'bg-slate-800 border-slate-700'} transition-colors`}>
                {ACTION_ICON_MAP[action.icon] || <Zap className="w-5 h-5 text-slate-400" />}
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                {action.title}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
