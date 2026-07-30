import React, { useState } from 'react';
import {
  ShieldCheck, HardDrive, Wifi, Clock, Cpu,
  CheckCircle2, AlertTriangle, AlertCircle, CalendarClock,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import ResourceProgressBar from './ResourceProgressBar';

/* ─── icon map ──────────────────────────────────────────────── */
const QUOTA_ICONS = {
  q1: Wifi,   bandwidth:           Wifi,
  q2: HardDrive, storage:          HardDrive,
  q3: Clock,  build_minutes:       Clock,
  q4: Cpu,    function_executions: Cpu,
};

/* ─── per-resource colour theme ─────────────────────────────── */
const THEME_CONFIG = {
  bandwidth: {
    badgeBg:  'bg-blue-500/10 border-blue-500/20',
    iconColor:'text-blue-500 dark:text-blue-400',
    barColor: 'bg-gradient-to-r from-blue-600 to-indigo-500',
    ring:     'hover:border-blue-400/40 dark:hover:border-blue-400/30',
  },
  storage: {
    badgeBg:  'bg-purple-500/10 border-purple-500/20',
    iconColor:'text-purple-500 dark:text-purple-400',
    barColor: 'bg-gradient-to-r from-purple-600 to-pink-500',
    ring:     'hover:border-purple-400/40 dark:hover:border-purple-400/30',
  },
  build_minutes: {
    badgeBg:  'bg-orange-500/10 border-orange-500/20',
    iconColor:'text-orange-500 dark:text-orange-400',
    barColor: 'bg-gradient-to-r from-orange-500 to-amber-500',
    ring:     'hover:border-orange-400/40 dark:hover:border-orange-400/30',
  },
  function_executions: {
    badgeBg:  'bg-emerald-500/10 border-emerald-500/20',
    iconColor:'text-emerald-500 dark:text-emerald-400',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    ring:     'hover:border-emerald-400/40 dark:hover:border-emerald-400/30',
  },
};

/* ─── status config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
  Healthy:  { label: 'Healthy',  icon: CheckCircle2,  css: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25' },
  Warning:  { label: 'Warning',  icon: AlertTriangle, css: 'bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/25'  },
  Critical: { label: 'Critical', icon: AlertCircle,   css: 'bg-rose-500/10   text-rose-600   dark:text-rose-400   border-rose-500/25'   },
};

/* ─── helpers ───────────────────────────────────────────────── */
function resolveThemeKey(item) {
  if (item.theme && THEME_CONFIG[item.theme]) return item.theme;
  const map = { q1: 'bandwidth', q2: 'storage', q3: 'build_minutes', q4: 'function_executions' };
  return map[item.id] || item.id || 'bandwidth';
}

function resolveStatus(item) {
  if (item.status && STATUS_CONFIG[item.status]) return item.status;
  if (item.percent >= 85) return 'Critical';
  if (item.percent >= 70) return 'Warning';
  return 'Healthy';
}

/* ─── single quota row ──────────────────────────────────────── */
function QuotaRow({ item }) {
  const [hovered, setHovered] = useState(false);

  const key        = resolveThemeKey(item);
  const theme      = THEME_CONFIG[key] || THEME_CONFIG.bandwidth;
  const statusKey  = resolveStatus(item);
  const statusInfo = STATUS_CONFIG[statusKey];
  const StatusIcon = statusInfo.icon;
  const ResourceIcon = QUOTA_ICONS[item.id] || QUOTA_ICONS[key] || ShieldCheck;

  return (
    <div
      className={`relative group p-3.5 rounded-xl
                  bg-slate-50/80 dark:bg-slate-800/40
                  border border-slate-200/80 dark:border-slate-700/60
                  transition-all duration-200 ${theme.ring}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Row: icon + name ··· status badge ────────────────── */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded-lg border shrink-0 ${theme.badgeBg}`}>
            <ResourceIcon className={`w-3.5 h-3.5 ${theme.iconColor}`} />
          </div>
          <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate">
            {item.name}
          </span>
        </div>

        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                         text-[10px] font-bold border shrink-0 ${statusInfo.css}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* ── Remaining capacity (primary stat) ────────────────── */}
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
          {item.remaining}
        </span>
        <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
          {item.percent}%
        </span>
      </div>

      {/* ── Progress bar ─────────────────────────────────────── */}
      <ResourceProgressBar
        percent={item.percent}
        color={item.color || theme.barColor}
        showLabels={false}
        height="h-1.5"
      />

      {/* ── Hover tooltip: secondary stats ───────────────────── */}
      <div
        className={`absolute left-0 right-0 -bottom-px z-20
                    transition-all duration-200 ease-out ${
          hovered
            ? 'opacity-100 translate-y-full pointer-events-auto'
            : 'opacity-0 translate-y-[calc(100%-6px)] pointer-events-none'
        }`}
      >
        <div className="mx-0.5 mt-1 rounded-xl
                        bg-white/98 dark:bg-slate-900/98
                        border border-slate-200 dark:border-slate-700
                        backdrop-blur-md shadow-xl px-4 py-3">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase font-semibold tracking-wider
                               text-slate-400 dark:text-slate-500">
                Used
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {item.used}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase font-semibold tracking-wider
                               text-slate-400 dark:text-slate-500">
                Limit
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {item.limit}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-[9px] uppercase font-semibold tracking-wider
                               text-slate-400 dark:text-slate-500">
                Consumed
              </span>
              <span className="font-black text-slate-900 dark:text-white">
                {item.percent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── main card ─────────────────────────────────────────────── */
export default function MonthlyQuotaCard({ quotas = [] }) {
  return (
    <Card
      style={{ maxWidth: '100%', padding: '14px 16px 16px' }}
      className="border border-slate-200/80 dark:border-white/10 rounded-2xl
                 backdrop-blur-xl bg-white/80 dark:bg-slate-900/70
                 shadow-sm dark:shadow-xl transition-colors duration-300
                 hover:border-slate-300 dark:hover:border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20
                          border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-none">
              Monthly Quotas
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Plan limits &amp; remaining capacity
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full
                         bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                         border border-emerald-500/20">
          Pro Plan
        </span>
      </div>

      {/* Quota rows */}
      <div className="space-y-2">
        {quotas.map((item) => (
          <QuotaRow key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}
