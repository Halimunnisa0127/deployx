import { RefreshCw, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { STATUS_VARIANT_MAP } from '../utils/projectMockData';

export default function ProjectOverviewTab({ project, deployments = [], onAction }) {
  const badgeVariant = STATUS_VARIANT_MAP[project?.status] ?? 'neutral';

  return (
    <div className="space-y-6">
      {/* Latest Deployment Card */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Latest Deployment
          </span>
          <Badge variant={badgeVariant}>
            {project?.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Commit</span>
            <span className="text-slate-200 font-medium block truncate">
              {deployments[0]?.commit || 'Initial commit'}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {deployments[0]?.hash || '7a8f9c2'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Branch</span>
            <span className="font-mono text-slate-200 font-medium block">
              {deployments[0]?.branch || project?.branch || 'main'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Deployed</span>
            <span className="text-slate-200 font-medium block">
              {deployments[0]?.time || '2 hours ago'} ({deployments[0]?.duration || '42s'})
            </span>
          </div>
        </div>
      </Card>

      {/* Quick Actions Panel */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => onAction && onAction('Trigger Redeploy')}
          >
            Trigger Redeploy
          </Button>
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => onAction && onAction('Rollback to Previous Version')}
          >
            Rollback to Previous Version
          </Button>
        </div>
      </Card>

      {/* Recent Deployment History Timeline */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Deployment History
        </h3>
        <div className="space-y-3">
          {deployments.map((dep) => (
            <div
              key={dep.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                {dep.status === 'live' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : dep.status === 'failed' ? (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-slate-200 font-semibold truncate block">
                    {dep.commit}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {dep.hash} • {dep.branch}
                  </span>
                </div>
              </div>
              <span className="text-slate-400 text-[11px] flex-shrink-0 ml-2">
                {dep.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
