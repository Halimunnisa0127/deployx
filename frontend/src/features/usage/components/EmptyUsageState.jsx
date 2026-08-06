import { useState } from 'react';
import { BarChart3, RefreshCw, Filter } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function EmptyUsageState({ onRefresh, onResetFilters, isRefreshing = false }) {
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setLocalRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => {
      setLocalRefreshing(false);
    }, 600);
  };

  const activeRefreshing = isRefreshing || localRefreshing;

  return (
    <div className="relative py-8 sm:py-12 flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl" />
        <div className="w-60 h-60 rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-2xl -ml-20" />
      </div>

      <Card
        style={{ maxWidth: '640px', width: '100%', padding: '48px 32px' }}
        className="border border-border/80 rounded-3xl backdrop-blur-2xl bg-card/80 shadow-xl dark:shadow-2xl text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden"
      >
        {/* Empty State Vector Illustration */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Decorative background dashed rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30 dark:border-indigo-400/20 animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full border border-border" />

          {/* SVG Custom Illustration */}
          <svg className="w-28 h-28 text-indigo-500/40 dark:text-indigo-400/30" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="25" width="80" height="70" rx="12" className="fill-muted stroke-indigo-500/30 dark:stroke-indigo-400/30" strokeWidth="2" />
            <path d="M35 75L50 60L65 70L85 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
            <circle cx="85" cy="45" r="4" className="fill-indigo-500 animate-ping" />
            <rect x="32" y="80" width="10" height="4" rx="2" className="fill-muted-foreground/30" />
            <rect x="47" y="80" width="10" height="4" rx="2" className="fill-muted-foreground/30" />
            <rect x="62" y="80" width="10" height="4" rx="2" className="fill-muted-foreground/30" />
            <rect x="77" y="80" width="10" height="4" rx="2" className="fill-muted-foreground/30" />
          </svg>

          {/* Floating Icon Badge */}
          <div className="absolute -bottom-1 -right-1 p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/40">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* Text Details */}
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-black text-foreground tracking-tight">
            No usage data available.
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We couldn't retrieve any resource consumption metrics for the selected timeframe or project environment. Try refreshing or reset your filters.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleRefreshClick}
            disabled={activeRefreshing}
            iconLeft={
              <RefreshCw
                className={`w-4 h-4 ${activeRefreshing ? 'animate-spin' : ''}`}
              />
            }
          >
            {activeRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>

          {onResetFilters && (
            <Button
              variant="secondary"
              size="md"
              onClick={onResetFilters}
              iconLeft={<Filter className="w-4 h-4" />}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

