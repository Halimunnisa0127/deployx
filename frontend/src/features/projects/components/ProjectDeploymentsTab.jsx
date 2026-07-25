import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { STATUS_VARIANT_MAP } from '../utils/projectMockData';

export default function ProjectDeploymentsTab({ deployments = [] }) {
  return (
    <Card style={{ padding: '24px', maxWidth: '100%' }}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        All Deployments
      </h3>
      <div className="space-y-3">
        {deployments.map((dep) => (
          <div
            key={dep.id}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
          >
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_VARIANT_MAP[dep.status] ?? 'neutral'}>
                {dep.status}
              </Badge>
              <div>
                <span className="text-slate-200 font-semibold block">{dep.commit}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {dep.hash} on {dep.branch}
                </span>
              </div>
            </div>
            <span className="text-slate-400 text-[11px]">{dep.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
