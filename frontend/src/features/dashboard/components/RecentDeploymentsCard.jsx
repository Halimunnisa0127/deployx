import { Link } from 'react-router-dom';
import { GitBranch, Clock, ArrowUpRight, Rocket } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { MOCK_RECENT_DEPLOYMENTS } from '../data/mockDashboardData';

const STATUS_VARIANT_MAP = {
  success: 'success',
  building: 'info',
  failed: 'danger',
  queued: 'neutral',
};

export default function RecentDeploymentsCard({ deployments = MOCK_RECENT_DEPLOYMENTS }) {
  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }} className="flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Recent Deployments
          </h2>
        </div>
        <Link
          to="/dashboard/deployments"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Deployment List */}
      {deployments.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No deployments found.
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {deployments.slice(0, 5).map((item) => {
            const variant = STATUS_VARIANT_MAP[item.status] || 'neutral';

            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-800/30 -mx-2 px-2 rounded-xl transition-colors"
              >
                {/* Left: Project Info & Branch */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                      {item.projectName}
                    </span>
                    <Badge variant={variant} dot>
                      {item.statusLabel}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-md font-mono">
                      <GitBranch className="w-3 h-3 text-slate-400" />
                      {item.branch}
                    </span>

                    <span className="font-mono text-slate-400">
                      #{item.commitHash}
                    </span>

                    <span className="hidden md:inline text-slate-400 truncate max-w-[200px]">
                      {item.commitMessage}
                    </span>
                  </div>
                </div>

                {/* Right: Time */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.timeAgo}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
