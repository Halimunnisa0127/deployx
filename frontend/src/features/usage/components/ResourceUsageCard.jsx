import { useState } from 'react';
import { Wifi, HardDrive, Clock, Cpu, TrendingUp, TrendingDown } from 'lucide-react';
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

  const [hovered, setHovered] = useState(false);

  const Icon = METRIC_ICONS[item.id] || Wifi;
  const config = METRIC_CONFIG[item.id] || METRIC_CONFIG.bandwidth;
  const TrendIcon = item.isUp ? TrendingUp : TrendingDown;

  return (
    <Card
      style={{ maxWidth: '100%', padding: '22px 24px' }}
      className={`relative overflow-visible border border-slate-200/80 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/70 shadow-sm dark:shadow-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${config.glowBorder}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="space-y-5">

        {/* Header: Icon + Name + Trend Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl border ${config.badgeBg} transition-transform duration-300 group-hover:scale-105`}
            >
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {item.title}
            </span>
          </div>

          {/* Trend Badge */}
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
              item.isUp
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}
          >
            <TrendIcon className="w-3 h-3" />
            <span>{item.trend}</span>
          </div>
        </div>

        {/* Large Usage Value + Sparkline */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {item.used}
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 ml-1.5">
                {item.unit}
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1.5">
              of {item.limit} {item.unit} limit
            </div>
          </div>

          {/* Sparkline */}
          <div className="w-20 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <SparklineChart
              data={item.sparkline || config.sparklineData}
              color={config.hexColor}
              height={30}
              width={80}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <ResourceProgressBar
          percent={item.percent}
          color={config.barColor}
          showLabels={false}
          height="h-1.5"
        />

      </div>

      {/* Hover Tooltip — Used / Remaining / Percentage */}
      <div
        className={`absolute left-0 right-0 -bottom-[1px] z-20 transition-all duration-200 ease-out ${
          hovered
            ? 'opacity-100 translate-y-full pointer-events-auto'
            : 'opacity-0 translate-y-[calc(100%-4px)] pointer-events-none'
        }`}
      >
        <div className="mx-1 mt-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl px-4 py-3">
          <div className="grid grid-cols-3 gap-3 text-xs">
            {/* Used */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                Used
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {item.used} {item.unit}
              </span>
            </div>

            {/* Remaining */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                Remaining
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {item.remaining} {item.unit}
              </span>
            </div>

            {/* Percentage */}
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-[10px] uppercase font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                Usage
              </span>
              <span className="font-black text-slate-900 dark:text-white">
                {item.percent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
