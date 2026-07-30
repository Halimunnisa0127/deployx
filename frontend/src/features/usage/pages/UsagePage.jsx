import { useState } from 'react';
import { useUsage } from '../hooks/useUsage';
import UsageHeader          from '../components/UsageHeader';
import UsageSummaryCards    from '../components/UsageSummaryCards';
import InfrastructureEfficiency from '../components/InfrastructureEfficiency';
import UsageTrendChart      from '../components/UsageTrendChart';
import UsageSpikes          from '../components/UsageSpikes';
import UsageBreakdown       from '../components/UsageBreakdown';
import UsageForecast        from '../components/UsageForecast';
import UsageGoals           from '../components/UsageGoals';
import UsageHistoryTable    from '../components/UsageHistoryTable';
import UsageAlerts          from '../components/UsageAlerts';
import OptimizationTips     from '../components/OptimizationTips';
import UsageSkeleton        from '../components/UsageSkeleton';
import EmptyUsageState      from '../components/EmptyUsageState';

/* ─── Tiny section divider label ─────────────────────────────── */
function SectionLabel({ children, muted = false }) {
  return (
    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 select-none ${
      muted
        ? 'text-slate-300 dark:text-slate-600'
        : 'text-slate-400 dark:text-slate-500'
    }`}>
      {children}
    </p>
  );
}

export default function UsagePage() {
  const {
    dateRange, setDateRange,
    activeTab, setActiveTab,
    chartPeriod, setChartPeriod,
    isLoading, isExporting,
    data, handleExport, refetch,
  } = useUsage();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated,  setLastUpdated]  = useState('Updated 2 mins ago');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refetch) await refetch();
    setLastUpdated('Updated just now');
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading)               return <UsageSkeleton />;
  if (!data || !data.summary)  return <EmptyUsageState onRefresh={handleRefresh} isRefreshing={isRefreshing} />;

  return (
    <div className="pb-10">

      {/* ── 1. Header ─────────────────────────────────────────── */}
      <UsageHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExport={handleExport}
        isExporting={isExporting}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* ── 2. Overview cards ─────────────────────────────────── */}
      {/* Prominent — full opacity, generous gap below */}
      <div className="mt-6 md:mt-8">
        <UsageSummaryCards summary={data.summary} />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PRIMARY FOCUS ZONE  ·  Trends + Monthly Quotas + Goals
          Larger top gap, full ring, no opacity reduction.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-8 md:mt-10 space-y-5">
        <SectionLabel>Analytics & Tracking</SectionLabel>

        {/* Infrastructure Efficiency */}
        <InfrastructureEfficiency score={88} tipsCount={data.optimizationTips?.length || 0} />

        {/* Usage Goals — brand new tracker */}
        <UsageGoals goals={data.forecastUsage} />

        {/* Usage Trends — hero card: ring + shadow lifted */}
        <div className="ring-1 ring-slate-200/80 dark:ring-white/10 rounded-2xl
                        shadow-md dark:shadow-2xl">
          <UsageTrendChart
            dailyData={data.dailyConsumption}
            weeklyData={data.weeklyConsumption}
            monthlyData={data.monthlyConsumption}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            chartPeriod={chartPeriod}
            setChartPeriod={setChartPeriod}
          />
        </div>

        {/* Usage Spikes — immediately below trends */}
        <div className="ring-1 ring-slate-200/60 dark:ring-white/8 rounded-2xl
                        shadow-sm dark:shadow-xl">
          <UsageSpikes spikes={data.spikes} />
        </div>

        {/* Monthly Quotas — co-primary */}
        <div className="ring-1 ring-slate-200/60 dark:ring-white/8 rounded-2xl
                        shadow-sm dark:shadow-xl">
          <UsageBreakdown
            consumers={data.topConsumers}
            quotas={data.monthlyQuotas}
          />
        </div>

        {/* Forecast Usage — below quotas, same primary zone */}
        <UsageForecast forecasts={data.forecastUsage} />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECONDARY ZONE  ·  History table
          Smaller gap from primary, muted label, reduced card opacity.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-6 md:mt-7">
        <SectionLabel muted>History</SectionLabel>
        <div className="opacity-90">
          <UsageHistoryTable history={data.history} />
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TERTIARY ZONE  ·  Alerts + Recommendations
          Smallest gap, most muted label, lowest opacity.
          Visually recedes — users who need it can still find it.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-5 md:mt-6 space-y-4">
        <SectionLabel muted>Alerts &amp; Recommendations</SectionLabel>
        <div className="opacity-85">
          <UsageAlerts alerts={data.alerts} />
        </div>
        <div className="opacity-85">
          <OptimizationTips tips={data.optimizationTips} />
        </div>
      </div>

    </div>
  );
}
