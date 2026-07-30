import { Activity, Server, Database, Cpu, Layers, HardDrive, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { MOCK_SYSTEM_SERVICES } from '../data/mockDashboardData';

const SERVICE_ICON_MAP = {
  api: <Server className="w-4 h-4 text-indigo-400" />,
  database: <Database className="w-4 h-4 text-emerald-400" />,
  docker: <Cpu className="w-4 h-4 text-sky-400" />,
  queue_worker: <Layers className="w-4 h-4 text-amber-400" />,
  storage: <HardDrive className="w-4 h-4 text-purple-400" />,

  // Backward compatibility keys
  api_server: <Server className="w-4 h-4 text-indigo-400" />,
  docker_engine: <Cpu className="w-4 h-4 text-sky-400" />,
  build_queue: <Layers className="w-4 h-4 text-amber-400" />,
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
    <Card
      style={{ maxWidth: '100%', padding: '24px' }}
      className="border-slate-200 dark:border-white/5 rounded-[18px] backdrop-blur-xl shadow-sm dark:shadow-xl transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md hover:border-slate-300 dark:hover:border-white/10"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 shadow-sm shadow-emerald-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
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
          <Link
            key={service.id}
            to="/dashboard/settings/infrastructure"
            className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors cursor-pointer group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:outline-none"
          >
            <div className="flex items-center gap-2.5 min-w-0 group-hover:translate-x-0.5 transition-transform">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
                {SERVICE_ICON_MAP[service.id] || <Server className="w-4 h-4 text-slate-500 dark:text-slate-300" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                  {service.name}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 font-mono">
                  <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{service.responseTime || service.detail}</span>
                </div>
              </div>
            </div>

            <Badge variant={service.status === 'offline' || service.status === 'danger' ? 'danger' : service.status === 'warning' ? 'warning' : 'success'} dot>
              {service.status === 'offline' || service.status === 'danger' ? 'Critical' : service.status === 'warning' ? 'Warning' : 'Healthy'}
            </Badge>
          </Link>
        ))}
      </div>
    </Card>
  );
}

