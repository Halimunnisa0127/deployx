import ResourceUsageCard from './ResourceUsageCard';

export default function UsageSummaryCards({ summary = {}, forecasts = [] }) {
  const cards = Object.values(summary).map(item => {
    const forecast = forecasts.find(f => f.id === item.id) || {};
    return { ...item, forecastUsed: forecast.forecastUsed };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
          Usage Overview
        </h2>
        <span className="text-xs font-mono text-muted-foreground">
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
