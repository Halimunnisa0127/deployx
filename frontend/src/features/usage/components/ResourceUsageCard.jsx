import { useState } from 'react';
import { Wifi, HardDrive, Clock, Cpu, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import ResourceProgressBar from './ResourceProgressBar';
import SparklineChart from './SparklineChart';

const METRIC_ICONS = {
  bandwidth: Wifi,
  storage: HardDrive,
  build_minutes: Clock,
  function_executions: Cpu,
};

const METRIC_CONFIG = {
  bandwidth: {
    colorName: 'Blue',
    hexColor: '#3b82f6',
    badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-500 dark:text-blue-400',
    barColor: 'bg-gradient-to-r from-blue-600 to-indigo-500',
    glowBorder: 'hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-blue-500/10',
    sparklineData: [15, 22, 18, 30, 28, 38, 42.5],
  },
  storage: {
    colorName: 'Purple',
    hexColor: '#a855f7',
    badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    iconColor: 'text-purple-500 dark:text-purple-400',
    barColor: 'bg-gradient-to-r from-purple-600 to-pink-500',
    glowBorder: 'hover:border-purple-500/40 dark:hover:border-purple-400/40 hover:shadow-purple-500/10',
    sparklineData: [8.5, 9.2, 9.8, 10.5, 11.2, 12.0, 12.8],
  },
  build_minutes: {
    colorName: 'Orange',
    hexColor: '#f97316',
    badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
    iconColor: 'text-orange-500 dark:text-orange-400',
    barColor: 'bg-gradient-to-r from-orange-500 to-amber-500',
    glowBorder: 'hover:border-orange-500/40 dark:hover:border-orange-400/40 hover:shadow-orange-500/10',
    sparklineData: [210, 240, 195, 260, 285, 310, 320],
  },
  function_executions: {
    colorName: 'Green',
    hexColor: '#10b981',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    glowBorder: 'hover:border-emerald-500/40 dark:hover:border-emerald-400/40 hover:shadow-emerald-500/10',
    sparklineData: [280, 310, 290, 340, 390, 410, 450],
  },
};

export default function ResourceUsageCard({ item }) {
  if (!item) return null;

  const Icon = METRIC_ICONS[item.id] || Wifi;
  const config = METRIC_CONFIG[item.id] || METRIC_CONFIG.bandwidth;
  const TrendIcon = item.isUp ? TrendingUp : TrendingDown;

  // Goal Tracking Logic
  const goalLimit = Math.floor(item.limit * 0.7);
  const forecastVal = Math.floor(item.forecastUsed || 0);

  const isCritical = forecastVal > item.limit;
  const isWarning = forecastVal > goalLimit && !isCritical;

  let statusKey = 'On Track';
  let StatusIcon = ShieldCheck;
  let statusCss = 'text-emerald-600 dark:text-emerald-400';

  if (isCritical) {
    statusKey = 'Critical';
    StatusIcon = AlertCircle;
    statusCss = 'text-rose-600 dark:text-rose-400';
  } else if (isWarning) {
    statusKey = 'Warning';
    StatusIcon = AlertTriangle;
    statusCss = 'text-amber-600 dark:text-amber-400';
  }

  return (
    <Card
      style={{ maxWidth: '100%', padding: '20px 24px' }}
      className={`relative h-full flex flex-col overflow-hidden border border-border/80 rounded-2xl backdrop-blur-xl bg-card/80 shadow-sm dark:shadow-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${config.glowBorder}`}
    >
      <div className="flex flex-col h-full gap-5">
        {/* Header: Icon + Name + Trend Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`shrink-0 p-2 rounded-xl border ${config.badgeBg} transition-transform duration-300 group-hover:scale-105`}>
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <span className="text-sm font-semibold text-foreground leading-tight whitespace-normal">
              {item.title}
            </span>
          </div>

          {/* Trend Badge */}
          <div className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
              item.isUp
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}>
            <TrendIcon className="w-3 h-3" />
            <span>{item.trend}</span>
          </div>
        </div>

        {/* Large Usage Value + Sparkline */}
        <div className="flex items-end justify-between gap-2 flex-1">
          <div>
            <div className="text-4xl font-bold text-foreground tracking-tight leading-none whitespace-nowrap">
              {item.used}
              <span className="text-base font-semibold text-muted-foreground ml-1.5">
                {item.unit}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-2 whitespace-nowrap">
              {item.percent}% of {item.limit} {item.unit} limit
            </div>
          </div>

          {/* Sparkline */}
          <div className="w-[56px] shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <SparklineChart
              data={item.sparkline || config.sparklineData}
              color={config.hexColor}
              height={28}
              width={56}
            />
          </div>
        </div>

        {/* Progress Bar & Bottom Stats Section */}
        <div className="space-y-4 mt-auto">
          {/* Progress Bar */}
          <ResourceProgressBar
            percent={item.percent}
            color={config.barColor}
            showLabels={false}
            height="h-1.5"
          />

          {/* Detailed Metrics Block */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">Remaining</span>
              <span className="text-xs font-bold text-foreground">{item.remaining} {item.unit}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">Forecast</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{item.forecastUsed} {item.unit}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">Status</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${statusCss}`}>
                <StatusIcon className="w-3 h-3 shrink-0" />
                <span>{statusKey}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
