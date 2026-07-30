import { FolderGit2, Layers, Cpu, Radio, ArrowUpRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const CONSUMER_ICONS = {
  Frontend: FolderGit2,
  Backend: Layers,
  Analytics: Radio,
  Worker: Cpu,
};

export default function TopResourceConsumers({ consumers = [] }) {
  return (
    <Card
      style={{ maxWidth: '100%', padding: '24px' }}
      className="border-slate-200 dark:border-white/5 rounded-[18px] backdrop-blur-xl bg-white/80 dark:bg-slate-900/60 shadow-sm dark:shadow-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-white/10"
    >
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/5 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-sm">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Top Resource Consumers
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Projects consuming the highest quota volume
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          {consumers.length} Active
        </span>
      </div>

      <div className="space-y-3.5">
        {consumers.map((item) => {
          const Icon = CONSUMER_ICONS[item.type] || FolderGit2;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5 group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                      <span>BW: {item.bandwidth}</span>
                      <span>•</span>
                      <span>ST: {item.storage}</span>
                      <span>•</span>
                      <span>FN: {item.functionExecutions}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-extrabold font-mono text-slate-900 dark:text-slate-100">
                    {item.sharePercent}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Total Share
                  </div>
                </div>
              </div>

              {/* Progress bar representing share */}
              <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color || 'bg-indigo-500'} rounded-full transition-all duration-500`}
                  style={{ width: `${item.sharePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
