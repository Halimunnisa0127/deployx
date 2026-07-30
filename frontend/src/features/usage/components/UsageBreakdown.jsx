import TopResourceConsumers from './TopResourceConsumers';

export default function UsageBreakdown({ consumers = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Top Resource Consumers
        </h2>
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          Resource distribution
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 items-start">
        {/* Left: Top Resource Consumers */}
        <TopResourceConsumers consumers={consumers} />
      </div>
    </div>
  );
}
