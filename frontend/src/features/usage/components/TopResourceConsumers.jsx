import { FolderGit2, Layers, Cpu, Radio, ArrowUpRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Progress } from '../../../components/ui';

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
      className="border-border rounded-[18px] backdrop-blur-xl bg-card shadow-sm dark:shadow-xl transition-all duration-300 hover:border-border"
    >
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-sm">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
              Top Resource Consumers
            </h2>
            <p className="text-xs text-muted-foreground">
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
              className="p-3.5 rounded-xl bg-muted border border-border space-y-2.5 group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-card border border-border shrink-0">
                    <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mt-0.5">
                      <span>BW: {item.bandwidth}</span>
                      <span>•</span>
                      <span>ST: {item.storage}</span>
                      <span>•</span>
                      <span>FN: {item.functionExecutions}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-extrabold font-mono text-foreground">
                    {item.sharePercent}%
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Total Share
                  </div>
                </div>
              </div>

              <Progress 
                percent={item.sharePercent} 
                color={item.color || 'bg-indigo-500'} 
                height="h-2" 
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
