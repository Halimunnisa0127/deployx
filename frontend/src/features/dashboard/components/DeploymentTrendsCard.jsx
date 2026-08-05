import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, CheckCircle2, XCircle, Activity, Info } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_DEPLOYMENT_TRENDS } from '../data/mockDashboardData';

export default function DeploymentTrendsCard({ data = MOCK_DEPLOYMENT_TRENDS }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [visibleSeries, setVisibleSeries] = useState({ success: true, failed: true });

  const totalSuccess = data.reduce((acc, curr) => acc + curr.success, 0);
  const totalFailed = data.reduce((acc, curr) => acc + curr.failed, 0);
  const totalDeployments = totalSuccess + totalFailed;
  const overallSuccessRate = totalDeployments > 0 ? Math.round((totalSuccess / totalDeployments) * 100) : 100;

  // SVG Chart Layout Metrics
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 35;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const bottomY = svgHeight - paddingBottom;

  const maxVal = Math.max(...data.map((d) => Math.max(d.success, d.failed)), 35);

  // Generate (x, y) coordinates for data points
  const getCoordinates = (key) => {
    return data.map((d, index) => {
      const x = paddingX + index * (chartWidth / (data.length - 1));
      const val = d[key] || 0;
      const y = bottomY - (val / maxVal) * chartHeight;
      return { x, y, val, day: d.day, raw: d };
    });
  };

  const successPoints = getCoordinates('success');
  const failedPoints = getCoordinates('failed');

  // Helper to create smooth Bezier cubic spline path string
  const createSmoothPath = (points) => {
    if (!points || points.length === 0) return '';
    return points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) / 2;
      const cp2y = point.y;
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
    }, '');
  };

  const successLinePath = createSmoothPath(successPoints);
  const failedLinePath = createSmoothPath(failedPoints);

  const successAreaPath = successPoints.length > 0
    ? `${successLinePath} L ${successPoints[successPoints.length - 1].x},${bottomY} L ${successPoints[0].x},${bottomY} Z`
    : '';

  const failedAreaPath = failedPoints.length > 0
    ? `${failedLinePath} L ${failedPoints[failedPoints.length - 1].x},${bottomY} L ${failedPoints[0].x},${bottomY} Z`
    : '';

  const toggleSeries = (seriesKey) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [seriesKey]: !prev[seriesKey] && !prev.success && !prev.failed ? true : !prev[seriesKey],
    }));
  };

  const gridLines = [0, 0.33, 0.66, 1];

  return (
    <Card
      style={{ maxWidth: '100%', padding: '24px' }}
      className="hover:-translate-y-[3px]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/5 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 shadow-sm shadow-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                Deployment Trends
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-extrabold">
                {overallSuccessRate}% Success
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
              Daily deployment activity over the last 7 days
            </p>
          </div>
        </div>

        {/* Interactive Legend Toggles */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => toggleSeries('success')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              visibleSeries.success
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold'
                : 'bg-muted text-slate-400 border-border line-through opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Successful ({totalSuccess})</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('failed')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              visibleSeries.failed
                ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold'
                : 'bg-muted text-slate-400 border-border line-through opacity-60'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span>Failed ({totalFailed})</span>
          </button>
        </div>
      </div>

      <div className="relative w-full pt-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Gradient Fill for Successful Series */}
            <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradient Fill for Failed Series */}
            <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* 1. Horizontal Grid Lines */}
          {gridLines.map((ratio) => {
            const y = bottomY - ratio * chartHeight;
            const valLabel = Math.round(ratio * maxVal);

            return (
              <g key={ratio} className="text-slate-400 dark:text-slate-600">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  className="stroke-slate-200 dark:stroke-slate-800/70"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 dark:fill-slate-500 font-mono text-xs"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* 2. Area Fills */}
          <AnimatePresence>
            {visibleSeries.success && (
              <motion.path
                key="success-area"
                d={successAreaPath}
                fill="url(#successGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
            {visibleSeries.failed && (
              <motion.path
                key="failed-area"
                d={failedAreaPath}
                fill="url(#failedGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>

          {/* 3. Animated Smooth Lines */}
          <AnimatePresence>
            {visibleSeries.failed && (
              <motion.path
                key="failed-line"
                d={failedLinePath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            )}
            {visibleSeries.success && (
              <motion.path
                key="success-line"
                d={successLinePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* 4. Active Hover Vertical Line & Data Points */}
          {hoveredIndex !== null && (
            <g>
              <line
                x1={successPoints[hoveredIndex].x}
                y1={paddingTop}
                x2={successPoints[hoveredIndex].x}
                y2={bottomY}
                className="stroke-indigo-400 dark:stroke-indigo-500/70"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* 5. Interactive Points & Data Circles */}
          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const succPt = successPoints[index];
            const failPt = failedPoints[index];

            return (
              <g
                key={item.day}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Hit target column rectangle */}
                <rect
                  x={succPt.x - (chartWidth / (data.length - 1)) / 2}
                  y={paddingTop}
                  width={chartWidth / (data.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Successful Data Point Circle */}
                {visibleSeries.success && (
                  <motion.circle
                    cx={succPt.x}
                    cy={succPt.y}
                    r={isHovered ? 6 : 3.5}
                    className="fill-white dark:fill-slate-900 stroke-emerald-500"
                    strokeWidth={isHovered ? 3 : 2}
                    animate={{ scale: isHovered ? 1.25 : 1 }}
                    transition={{ duration: 0.15 }}
                  />
                )}

                {/* Failed Data Point Circle */}
                {visibleSeries.failed && (
                  <motion.circle
                    cx={failPt.x}
                    cy={failPt.y}
                    r={isHovered ? 5.5 : 3}
                    className="fill-white dark:fill-slate-900 stroke-rose-500"
                    strokeWidth={isHovered ? 3 : 2}
                    animate={{ scale: isHovered ? 1.25 : 1 }}
                    transition={{ duration: 0.15 }}
                  />
                )}

                {/* X-Axis Day Labels */}
                <text
                  x={succPt.x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  className={`font-mono text-xs sm:text-sm transition-colors ${
                    isHovered
                      ? 'fill-indigo-600 dark:fill-white font-extrabold'
                      : 'fill-slate-700 dark:text-slate-300 font-bold'
                  }`}
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 6. Dynamic Floating Rich Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-14 z-30 px-3 py-2 rounded-xl bg-card border border-border shadow-2xl backdrop-blur-md pointer-events-none text-xs"
              style={{
                left: `${(successPoints[hoveredIndex].x / svgWidth) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex items-center justify-between gap-3 pb-1 border-b border-border mb-1.5 font-mono">
                <span className="font-bold text-foreground">
                  {data[hoveredIndex].day}
                </span>
                <span className="text-xs text-slate-400">
                  Total: {data[hoveredIndex].success + data[hoveredIndex].failed}
                </span>
              </div>

              <div className="space-y-1 font-mono text-sm">
                {visibleSeries.success && (
                  <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Successful
                    </span>
                    <span className="font-bold">{data[hoveredIndex].success}</span>
                  </div>
                )}

                {visibleSeries.failed && (
                  <div className="flex items-center justify-between gap-4 text-rose-600 dark:text-rose-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Failed
                    </span>
                    <span className="font-bold">{data[hoveredIndex].failed}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
