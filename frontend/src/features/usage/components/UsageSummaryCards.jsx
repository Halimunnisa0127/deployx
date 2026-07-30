import ResourceUsageCard from './ResourceUsageCard';

export default function UsageSummaryCards({ summary = {} }) {
  const cards = Object.values(summary);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Usage Overview
        </h2>
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          Updated live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((item) => (
          <ResourceUsageCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
