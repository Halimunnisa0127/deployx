import { Link } from 'react-router-dom';
import { GitBranch, Clock, ArrowUpRight, Rocket, Timer, ExternalLink } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import GithubIcon from '../../../components/ui/GithubIcon';
import { MOCK_RECENT_DEPLOYMENTS } from '../data/mockDashboardData';

const STATUS_VARIANT_MAP = {
  success: 'success',
  building: 'info',
  failed: 'danger',
  queued: 'neutral',
};

const ENV_VARIANT_MAP = {
  Production: 'primary',
  Preview: 'info',
  Development: 'neutral',
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
            const envVariant = ENV_VARIANT_MAP[item.environment] || 'neutral';

            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:bg-slate-800/40 -mx-2 px-3 rounded-xl transition-all duration-200"
              >
                {/* Left: Repository Icon, Project Info & Badges */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex-shrink-0 group-hover:border-indigo-500/30 transition-colors">
                    <GithubIcon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-200 group-hover:text-white truncate">
                        {item.projectName}
                      </span>

                      {/* Status Badge */}
                      <Badge variant={variant} dot>
                        {item.statusLabel}
                      </Badge>

                      {/* Environment Badge */}
                      {item.environment && (
                        <Badge variant={envVariant}>
                          {item.environment}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-md font-mono">
                        <GitBranch className="w-3 h-3 text-slate-400" />
                        {item.branch}
                      </span>

                      <span className="font-mono text-slate-400">
                        #{item.commitHash}
                      </span>

                      <span className="hidden lg:inline text-slate-400 truncate max-w-[180px]">
                        {item.commitMessage}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Build Duration, Time & View Deployment Button */}
                <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0 justify-between md:justify-end">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    {item.duration && (
                      <span className="flex items-center gap-1 bg-slate-900/50 border border-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                        <Timer className="w-3 h-3 text-indigo-400" />
                        {item.duration}
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.timeAgo}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    to={`/dashboard/deployments/${item.id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/80 font-medium"
                  >
                    View Details →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

