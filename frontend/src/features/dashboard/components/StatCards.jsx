import { Link } from 'react-router-dom';
import { FolderPlus, Layers, Globe, Zap, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_STAT_METRICS } from '../data/mockDashboardData';

const ICON_MAP = {
  FolderPlus: <FolderPlus className="w-5 h-5 text-indigo-400" />,
  Layers: <Layers className="w-5 h-5 text-purple-400" />,
  Globe: <Globe className="w-5 h-5 text-sky-400" />,
  Zap: <Zap className="w-5 h-5 text-emerald-400" />,
};

const ACCENT_BG_MAP = {
  FolderPlus: 'bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20',
  Layers: 'bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20',
  Globe: 'bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-500/20',
  Zap: 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20',
};

export default function StatCards({ metrics = MOCK_STAT_METRICS }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((item) => {
        const isUp = item.trend !== 'down';
        const TrendIcon = isUp ? TrendingUp : TrendingDown;

        return (
          <Link
            key={item.id}
            to={item.link || '#'}
            className="block group focus:outline-none focus:ring-2 focus:ring-indigo-500/80 rounded-2xl transition-all"
            aria-label={`${item.title}: ${item.value}, ${item.change} ${item.period}`}
          >
            <Card
              style={{ maxWidth: '100%', padding: '16px 20px' }}
              className="relative overflow-hidden group-hover:border-indigo-500/40 dark:group-hover:border-indigo-500/30 group-hover:shadow-lg dark:group-hover:shadow-indigo-500/20"
            >
              {/* Subtle Ambient Hover Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative space-y-2.5">
                {/* Header: Title & Icon */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors">
                    {item.title}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <div className={`p-2.5 rounded-xl border ${ACCENT_BG_MAP[item.iconName] || 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'} flex-shrink-0 transition-colors duration-200`}>
                      {ICON_MAP[item.iconName] || <FolderPlus className="w-5 h-5 text-slate-400" />}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </div>
                </div>

                {/* Main Metric Value */}
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                  {item.value}
                </div>

                {/* Footer: Trend Indicator & Comparison */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800/60 text-xs">
                  <div className={`flex items-center gap-1 font-semibold ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{item.change}</span>
                  </div>

                  <span className="text-sm text-slate-500 truncate">
                    {item.period || 'Compared to last 7 days'}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

