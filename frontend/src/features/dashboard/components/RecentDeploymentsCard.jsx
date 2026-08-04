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
    <Card
      style={{ maxWidth: '100%', padding: '24px' }}
      className="relative overflow-hidden flex flex-col h-full hover:-translate-y-[3px] hover:border-indigo-500/40 dark:hover:border-indigo-500/30 before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-sky-500"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 shadow-sm shadow-indigo-500/20">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
                Recent Deployments
              </h2>
            </div>
          </div>
        </div>
        <Link
          to="/dashboard/deployments"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40"
        >
          <span>View all</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Deployment List */}
      {deployments.length === 0 ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          No deployments found.
        </div>
      ) : (
        <div className="divide-y divide-slate-200/80 dark:divide-slate-800/60 flex flex-col gap-4">
          {deployments.slice(0, 5).map((item) => {
            const variant = STATUS_VARIANT_MAP[item.status] || 'neutral';
            const envVariant = ENV_VARIANT_MAP[item.environment] || 'neutral';

            return (
              <Link
                key={item.id}
                to={`/dashboard/deployments/${item.id}`}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:bg-indigo-500/5 dark:hover:bg-slate-800/50 -mx-2 px-3 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              >
                {/* Left: Repository Icon, Project Info & Badges */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex-shrink-0 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                    <GithubIcon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 truncate">
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

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md font-mono">
                        <GitBranch className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        {item.branch}
                      </span>

                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        #{item.commitHash}
                      </span>

                      <span className="text-slate-600 dark:text-slate-400 max-w-[180px] line-clamp-1">
                        {item.commitMessage}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Build Duration, Time & View Deployment Button */}
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 flex-shrink-0 justify-between md:justify-end">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    {item.duration && (
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        <Timer className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        {item.duration}
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      {item.timeAgo}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}

