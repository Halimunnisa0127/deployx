import { useState, useMemo } from 'react';
import {
  GitBranch,
  ExternalLink,
  RefreshCw,
  Clock,
  User,
  ArrowRight,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/common/EmptyState';
import { STATUS_VARIANT_MAP, getMockDeployments } from '../utils/projectMockData';

export default function ProjectDeploymentsTab({ project, deployments = [], onAction }) {
  const [filterEnv, setFilterEnv] = useState('All');

  // Fallback to mock data if empty
  const deploymentList = useMemo(() => {
    const list = deployments.length > 0 ? deployments : getMockDeployments(project);
    if (filterEnv === 'All') return list;
    return list.filter(
      (dep) => (dep.environment || 'Production').toLowerCase() === filterEnv.toLowerCase()
    );
  }, [deployments, project, filterEnv]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Toolbar */}
      <Card style={{ padding: '20px 24px', maxWidth: '100%' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                Deployments
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                  {deploymentList.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage and view historical deployment builds for this project.
              </p>
            </div>
          </div>

          {/* Environment Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 self-start sm:self-auto">
            {['All', 'Production', 'Preview'].map((env) => (
              <button
                key={env}
                onClick={() => setFilterEnv(env)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterEnv === env
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Deployment Cards List or Empty State */}
      {deploymentList.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-6 h-6 text-indigo-400" />}
          title="No deployments found"
          description={`No deployment builds match your filter "${filterEnv}". Trigger a build to get started.`}
          actionLabel="Trigger First Build"
          actionIcon={<RefreshCw className="w-4 h-4" />}
          onActionClick={() => onAction && onAction('Trigger First Build')}
        />
      ) : (
        <div className="space-y-4">
        {deploymentList.map((dep) => {
          const statusVariant = STATUS_VARIANT_MAP[dep.status] ?? 'neutral';
          const envVariant = (dep.environment || 'Production').toLowerCase() === 'production' ? 'info' : 'neutral';
          const mockUrl = dep.url || `https://${dep.id}.${(project?.name || 'app').toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

          return (
            <Card
              key={dep.id}
              style={{ padding: '24px', maxWidth: '100%' }}
              className="hover:border-slate-300 dark:hover:border-slate-700/90 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="space-y-4">
                {/* Header Row: Status, Environment, ID, Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/60">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant={statusVariant} dot={true} style={{ fontSize: '13px', padding: '4px 12px' }}>
                      {dep.status.toUpperCase()}
                    </Badge>
                    <Badge variant={envVariant} dot={false}>
                      {dep.environment || 'Production'}
                    </Badge>
                    <span className="font-mono text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 dark:text-slate-400 dark:bg-slate-800/80 dark:border-slate-700/60">
                      {dep.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dep.time}</span>
                  </div>
                </div>

                {/* Main Content Grid: Commit, Branch, Trigger, Duration */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Commit Message & Hash (Cols 1-6) */}
                  <div className="md:col-span-6 space-y-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex-shrink-0">
                        {dep.hash}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-white transition-colors truncate">
                        {dep.commit}
                      </span>
                    </div>
                  </div>

                  {/* Branch & Trigger (Cols 7-9) */}
                  <div className="md:col-span-3 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium truncate">
                      <GitBranch className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <span className="font-mono truncate">{dep.branch || 'main'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-sm truncate">
                      <User className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{dep.triggeredBy || 'GitHub Push'}</span>
                    </div>
                  </div>

                  {/* Build Duration (Cols 10-12) */}
                  <div className="md:col-span-3 text-xs md:text-right space-y-1">
                    <span className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider block font-medium">
                      Build Duration
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold font-mono">
                      {dep.duration || '42s'}
                    </span>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {dep.status === 'live' && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Live in Production
                      </span>
                    )}
                    {dep.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                        <XCircle className="w-3 h-3" /> Build Failed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
                      onClick={() => onAction && onAction(`Redeploy triggered for ${dep.id}`)}
                    >
                      Redeploy
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      href={mockUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      iconLeft={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      Open URL
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      to={`/dashboard/deployments/${dep.id}`}
                      iconLeft={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}

