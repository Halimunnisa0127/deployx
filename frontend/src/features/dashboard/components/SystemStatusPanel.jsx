import { Activity, Server, Database, Cpu, Layers } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { MOCK_SYSTEM_SERVICES } from '../data/mockDashboardData';

const SERVICE_ICON_MAP = {
  api_server: <Server className="w-4 h-4 text-slate-300" />,
  database: <Database className="w-4 h-4 text-slate-300" />,
  docker_engine: <Cpu className="w-4 h-4 text-slate-300" />,
  build_queue: <Layers className="w-4 h-4 text-slate-300" />,
};

export default function SystemStatusPanel({ services = MOCK_SYSTEM_SERVICES }) {
  const hasWarning = services.some((s) => s.status === 'warning');
  const hasOffline = services.some((s) => s.status === 'danger' || s.status === 'offline');

  const overallBadgeVariant = hasOffline ? 'danger' : hasWarning ? 'warning' : 'success';
  const overallLabel = hasOffline
    ? 'System Issues'
    : hasWarning
    ? 'Degraded Performance'
    : 'All Systems Operational';

  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Panel Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            System Status
          </h2>
        </div>
        <Badge variant={overallBadgeVariant} dot>
          {overallLabel}
        </Badge>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex-shrink-0">
                {SERVICE_ICON_MAP[service.id] || <Server className="w-4 h-4 text-slate-300" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {service.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {service.detail}
                </div>
              </div>
            </div>

            <Badge variant={service.status} dot>
              {service.statusLabel}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
