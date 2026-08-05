import { Link } from 'react-router-dom';
import { FolderPlus, GitBranch, Terminal, Globe, Key, PlusCircle, Users, ArrowUpRight, Zap } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_QUICK_ACTIONS } from '../data/mockDashboardData';

const ACTION_ICON_MAP = {
  FolderPlus: <FolderPlus className="w-5 h-5 text-indigo-400" />,
  GitBranch: <GitBranch className="w-5 h-5 text-emerald-400" />,
  Terminal: <Terminal className="w-5 h-5 text-amber-400" />,
  Globe: <Globe className="w-5 h-5 text-sky-400" />,
  Key: <Key className="w-5 h-5 text-purple-400" />,
  PlusCircle: <PlusCircle className="w-5 h-5 text-cyan-400" />,
  Users: <Users className="w-5 h-5 text-rose-400" />,
};

const ACCENT_BG = {
  FolderPlus: 'bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20',
  GitBranch: 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20',
  Terminal: 'bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20',
  Globe: 'bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-500/20',
  Key: 'bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20',
  PlusCircle: 'bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20',
  Users: 'bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/20',
};

export default function QuickActionsCard({ actions = MOCK_QUICK_ACTIONS }) {
  return (
    <Card
      style={{ maxWidth: '100%', padding: '24px' }}
      className="relative overflow-hidden hover:-translate-y-[3px] hover:border-amber-500/40 dark:hover:border-amber-500/30 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-amber-500 before:to-indigo-500"
    >
      {/* Card Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-white/5 mb-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 shadow-sm shadow-amber-500/20">
          <Zap className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Quick Actions
        </h2>
      </div>

      {/* Grid of Clickable Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className="group relative flex flex-col justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-500/5 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 group-hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className={`p-2.5 rounded-lg border ${ACCENT_BG[action.icon] || 'bg-muted border-border'} transition-colors`}>
                {ACTION_ICON_MAP[action.icon] || <Zap className="w-5 h-5 text-slate-400" />}
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

