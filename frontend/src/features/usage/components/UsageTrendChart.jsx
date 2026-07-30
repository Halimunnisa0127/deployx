import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, HardDrive, Clock, Cpu, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import Card from '../../../components/ui/Card';

const RESOURCE_TABS = [
  { id: 'bandwidth',           label: 'Bandwidth',     icon: Wifi,      unit: 'GB',   color: '#3b82f6' },
  { id: 'storage',             label: 'Storage',       icon: HardDrive, unit: 'GB',   color: '#a855f7' },
  { id: 'build_minutes',       label: 'Build Mins',    icon: Clock,     unit: 'Mins', color: '#f97316' },
  { id: 'function_executions', label: 'Functions',     icon: Cpu,       unit: 'K',    color: '#10b981' },
];

export default function UsageTrendChart({
  dailyData   = [],
  weeklyData  = [],
  monthlyData = [],
  activeTab   = 'bandwidth',
  setActiveTab,
  chartPeriod    = 'daily',
  setChartPeriod,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [zoomLevel,    setZoomLevel]    = useState(1);

  const currentTab = RESOURCE_TABS.find((t) => t.id === activeTab) || RESOURCE_TABS[0];

  /* ── data selection ─────────────────────────────────────── */
  let rawData = dailyData;
  if (chartPeriod === 'weekly')  rawData = weeklyData.length  > 0 ? weeklyData  : dailyData.slice(0, 4);
  if (chartPeriod === 'monthly') rawData = monthlyData;

  let chartData = rawData;
  if (zoomLevel === 1.5 && rawData.length > 4) chartData = rawData.slice(Math.floor(rawData.length * 0.3));
  if (zoomLevel === 2   && rawData.length > 4) chartData = rawData.slice(Math.floor(rawData.length * 0.5));

  const getVal  = (item) => item[currentTab.id] || 0;
  const values  = chartData.map(getVal);
  const maxVal  = Math.max(...values, 10);
  const avgVal  = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const peakVal = values.length > 0 ? Math.max(...values) : 0;

  /* ── SVG geometry ───────────────────────────────────────── */
  // paddingX is small so the line reaches edge-to-edge inside the card.
  // paddingTop / paddingBottom are kept tight — labels live within the
  // allocated viewBox height so no external spacing is needed.
  const svgWidth      = 600;
  const svgHeight     = 150;
  const paddingX      = 28;   // tighter left/right → more graph width
  const paddingTop    = 14;
  const paddingBottom = 24;   // room for x-axis labels
  const chartWidth    = svgWidth  - paddingX * 2;
  const chartHeight   = svgHeight - paddingTop - paddingBottom;
  const bottomY       = svgHeight - paddingBottom;

  const points = chartData.map((d, i) => {
    const x     = paddingX + i * (chartWidth / Math.max(chartData.length - 1, 1));
    const val   = getVal(d);
    const y     = bottomY - (val / maxVal) * chartHeight;
    const label = d.day || d.week || d.month || `P${i + 1}`;
    return { x, y, val, label, raw: d, isPeak: val === peakVal && val > 0 };
  });

  const avgY = bottomY - (avgVal / maxVal) * chartHeight;

  const smoothPath = (pts) => {
    if (!pts?.length) return '';
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cpx  = prev.x + (pt.x - prev.x) / 2;
      return `${acc} C ${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}`;
    }, '');
  };

  const linePath = smoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points.at(-1).x},${bottomY} L ${points[0].x},${bottomY} Z`
    : '';

  const gridLines = [0, 0.33, 0.66, 1];

  /* ── zoom handlers ──────────────────────────────────────── */
  const zoomIn    = () => setZoomLevel((z) => z === 1 ? 1.5 : z === 1.5 ? 2 : z);
  const zoomOut   = () => setZoomLevel((z) => z === 2 ? 1.5 : z === 1.5 ? 1 : z);
  const zoomReset = () => setZoomLevel(1);

  /* ── render ─────────────────────────────────────────────── */
  return (
    <Card
      style={{ maxWidth: '100%', padding: '14px 16px 12px' }}
      className="border border-slate-200/80 dark:border-white/10 rounded-2xl backdrop-blur-xl
                 bg-white/80 dark:bg-slate-900/70 shadow-sm dark:shadow-xl
                 transition-colors duration-300 hover:border-slate-300 dark:hover:border-white/20"
    >

      {/* ── Row 1: Title + Period toggle + Zoom ─────────────── */}
      <div className="flex items-center justify-between gap-2 mb-2">

        {/* Left: icon + title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30
                          text-indigo-600 dark:text-indigo-400 shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight truncate">
            Usage Trends
          </span>
        </div>

        {/* Right: period + zoom */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Period toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg
                          border border-slate-200 dark:border-slate-700/80 p-0.5">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setChartPeriod?.(p)}
                className={`px-3 py-1 rounded-md text-xs font-bold capitalize
                            transition-all cursor-pointer ${
                  chartPeriod === p
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Zoom */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg
                          border border-slate-200 dark:border-slate-700/80 p-0.5">
            <button
               type="button" onClick={zoomIn} disabled={zoomLevel >= 2} title="Zoom In"
               className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
               type="button" onClick={zoomOut} disabled={zoomLevel <= 1} title="Zoom Out"
               className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button" onClick={zoomReset} title="Reset"
                className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs font-mono font-bold px-1 text-slate-400 dark:text-slate-500">
              {zoomLevel}x
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Metric tabs (left) + Avg / Peak badges (right) ── */}
      <div className="flex items-center justify-between gap-2 mb-1.5">

        {/* Metric tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {RESOURCE_TABS.map(({ id, label, icon: TabIcon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab?.(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                            border whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Avg + Peak badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold
                          bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                          text-slate-600 dark:text-slate-300">
            <span className="w-3 border-t border-dashed border-indigo-500 shrink-0" />
            <span>Avg&nbsp;<strong className="text-slate-900 dark:text-white">{avgVal.toFixed(1)}&nbsp;{currentTab.unit}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold
                          bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>Peak&nbsp;<strong>{peakVal}&nbsp;{currentTab.unit}</strong></span>
          </div>
        </div>
      </div>

      {/* ── SVG chart ───────────────────────────────────────── */}
      <div className="relative w-full overflow-x-auto snap-x snap-mandatory scrollbar-none">
        <div className="min-w-[480px] sm:min-w-0 relative h-[180px] sm:h-[210px] lg:h-[230px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible select-none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="utGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={currentTab.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={currentTab.color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {gridLines.map((ratio) => {
              const y   = bottomY - ratio * chartHeight;
              const lbl = Math.round(ratio * maxVal);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y}
                    strokeWidth="0.7" strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-700/60"
                  />
                  <text
                    x={paddingX - 6} y={y + 3}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 font-mono text-[8px]"
                  >
                    {lbl}&nbsp;{currentTab.unit}
                  </text>
                </g>
              );
            })}

            {/* Avg line */}
            {avgY >= paddingTop && avgY <= bottomY && (
              <g>
                <line
                  x1={paddingX} y1={avgY} x2={svgWidth - paddingX} y2={avgY}
                  stroke={currentTab.color} strokeWidth="0.9"
                  strokeDasharray="4 3" opacity="0.55"
                />
                <text
                  x={svgWidth - paddingX + 3} y={avgY + 3}
                  className="fill-slate-400 dark:fill-slate-500 font-mono text-[7.5px] font-bold"
                >
                  AVG
                </text>
              </g>
            )}

            {/* Area */}
            <motion.path
              key={`${currentTab.id}-${chartPeriod}-${zoomLevel}-area`}
              d={areaPath} fill="url(#utGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />

            {/* Line */}
            <motion.path
              key={`${currentTab.id}-${chartPeriod}-${zoomLevel}-line`}
              d={linePath} fill="none"
              stroke={currentTab.color} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />

            {/* Hover cursor */}
            {hoveredIndex !== null && points[hoveredIndex] && (
              <line
                x1={points[hoveredIndex].x} y1={paddingTop}
                x2={points[hoveredIndex].x} y2={bottomY}
                strokeWidth="1" strokeDasharray="3 3"
                className="stroke-indigo-400 dark:stroke-indigo-500"
              />
            )}

            {/* Points + labels */}
            {points.map((pt, index) => {
              const isHov = hoveredIndex === index;
              return (
                <g
                  key={pt.label}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Hit area */}
                  <rect
                    x={pt.x - chartWidth / Math.max(points.length - 1, 1) / 2}
                    y={paddingTop}
                    width={chartWidth / Math.max(points.length - 1, 1)}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Peak ring + pill */}
                  {pt.isPeak && (
                    <g>
                      <motion.circle
                        cx={pt.x} cy={pt.y} r="6"
                        fill="#f59e0b" opacity="0.28"
                        animate={{ scale: [1, 1.35, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <g transform={`translate(${pt.x - 14}, ${pt.y - 17})`}>
                        <rect width="28" height="12" rx="3" fill="#f59e0b" />
                        <text
                          x="14" y="9" textAnchor="middle"
                          fill="#fff" className="font-mono text-[7px] font-black tracking-widest"
                        >
                          PEAK
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Dot */}
                  <motion.circle
                    cx={pt.x} cy={pt.y}
                    r={isHov ? 5 : pt.isPeak ? 3.5 : 2.5}
                    fill="#fff"
                    stroke={pt.isPeak ? '#f59e0b' : currentTab.color}
                    strokeWidth={isHov ? 2.2 : 1.6}
                    animate={{ scale: isHov ? 1.15 : 1 }}
                    transition={{ duration: 0.12 }}
                  />

                  {/* X label */}
                  <text
                    x={pt.x} y={svgHeight - 7}
                    textAnchor="middle"
                    className={`font-mono text-[8.5px] ${
                      isHov
                        ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold'
                        : 'fill-slate-400 dark:fill-slate-500 font-semibold'
                    }`}
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredIndex !== null && points[hoveredIndex] && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 3, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute -top-12 z-30 px-2.5 py-1.5 rounded-lg
                           bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                           shadow-xl backdrop-blur-md pointer-events-none text-sm
                           space-y-0.5 max-w-[160px]"
                style={{
                  left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="flex items-center justify-between gap-2 font-bold
                                text-slate-900 dark:text-white pb-0.5
                                border-b border-slate-100 dark:border-slate-800 font-mono">
                  <span>{points[hoveredIndex].label}</span>
                  {points[hoveredIndex].isPeak && (
                    <span className="px-1 text-[8px] font-black rounded bg-amber-500 text-white">PEAK</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 font-mono font-extrabold
                                text-indigo-600 dark:text-indigo-400">
                  <span>{currentTab.label}:</span>
                  <span>{points[hoveredIndex].val}&nbsp;{currentTab.unit}</span>
                </div>
                {avgVal > 0 && (
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    {points[hoveredIndex].val >= avgVal
                      ? `+${(((points[hoveredIndex].val - avgVal) / avgVal) * 100).toFixed(0)}% vs avg`
                      : `-${(((avgVal - points[hoveredIndex].val) / avgVal) * 100).toFixed(0)}% vs avg`
                    }
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile swipe hint — minimal, below chart */}
      <div className="sm:hidden flex justify-end mt-1">
        <span className="text-xs font-mono text-indigo-500/70 dark:text-indigo-400/60">
          ← swipe →
        </span>
      </div>

    </Card>
  );
}
