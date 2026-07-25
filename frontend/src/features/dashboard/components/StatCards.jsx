import { FolderPlus, Layers, Globe, Zap } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_STAT_METRICS } from '../data/mockDashboardData';

const ICON_MAP = {
  FolderPlus: <FolderPlus className="w-5 h-5 text-indigo-400" />,
  Layers: <Layers className="w-5 h-5 text-purple-400" />,
  Globe: <Globe className="w-5 h-5 text-sky-400" />,
  Zap: <Zap className="w-5 h-5 text-emerald-400" />,
};

const ACCENT_BG_MAP = {
  FolderPlus: 'bg-indigo-500/10 border-indigo-500/20',
  Layers: 'bg-purple-500/10 border-purple-500/20',
  Globe: 'bg-sky-500/10 border-sky-500/20',
  Zap: 'bg-emerald-500/10 border-emerald-500/20',
};

export default function StatCards({ metrics = MOCK_STAT_METRICS }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((item) => (
        <Card
          key={item.id}
          style={{ maxWidth: '100%', padding: '20px 24px' }}
          className="hover:border-slate-700/80 transition-all duration-200"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {item.title}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {item.value}
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${ACCENT_BG_MAP[item.iconName] || 'bg-slate-800 border-slate-700'} flex-shrink-0`}>
              {ICON_MAP[item.iconName] || <FolderPlus className="w-5 h-5 text-slate-400" />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
