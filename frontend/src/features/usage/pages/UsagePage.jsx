import { useState } from 'react';
import { useUsage } from '../hooks/useUsage';
import UsageHeader          from '../components/UsageHeader';
import UsageSummaryCards    from '../components/UsageSummaryCards';
import InfrastructureEfficiency from '../components/InfrastructureEfficiency';
import UsageTrendChart      from '../components/UsageTrendChart';
import UsageBreakdown       from '../components/UsageBreakdown';

import UsageHistoryTable    from '../components/UsageHistoryTable';
import UsageAlerts          from '../components/UsageAlerts';
import OptimizationTips     from '../components/OptimizationTips';
import UsageSkeleton        from '../components/UsageSkeleton';
import EmptyUsageState      from '../components/EmptyUsageState';

/* ─── Tiny section divider label ─────────────────────────────── */
function SectionLabel({ children, muted = false }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-widest mb-1 select-none ${
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
        <UsageSummaryCards summary={data.summary} forecasts={data.forecastUsage} />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PRIMARY FOCUS ZONE  ·  Trends + Monthly Quotas + Goals
          Larger top gap, full ring, no opacity reduction.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-8 md:mt-10 space-y-5">
        <SectionLabel>Analytics & Tracking</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Infrastructure Efficiency */}
          <InfrastructureEfficiency score={88} tipsCount={data.optimizationTips?.length || 0} />
          
          {/* Recent Usage Alerts */}
          <UsageAlerts alerts={data.alerts} />
        </div>

        {/* Usage Trends & History — Grouped tightly */}
        <div className="flex flex-col gap-3">
          <div className="ring-1 ring-slate-200/80 dark:ring-white/10 rounded-2xl shadow-md dark:shadow-2xl">
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
          <div className="ring-1 ring-slate-200/80 dark:ring-white/10 rounded-2xl shadow-sm dark:shadow-xl">
            <UsageHistoryTable history={data.history} activeTab={activeTab} />
          </div>
        </div>

        {/* Top Resource Consumers */}
        <div className="ring-1 ring-slate-200/60 dark:ring-white/8 rounded-2xl
                        shadow-sm dark:shadow-xl">
          <UsageBreakdown
            consumers={data.topConsumers}
          />
        </div>


      </div>



      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TERTIARY ZONE  ·  Alerts + Recommendations
          Smallest gap, most muted label, lowest opacity.
          Visually recedes — users who need it can still find it.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-5 md:mt-6 space-y-4">
        <SectionLabel muted>Recommendations &amp; Optimization</SectionLabel>
        <div className="opacity-85">
          <OptimizationTips tips={data.optimizationTips} />
        </div>
      </div>

    </div>
  );
}
