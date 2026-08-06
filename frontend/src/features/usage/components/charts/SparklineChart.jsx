import { useId } from 'react';

/**
 * Lightweight pure SVG Sparkline chart component for metric cards
 */
export default function SparklineChart({
  data = [10, 20, 15, 25, 30, 22, 40],
  color = '#3b82f6',
  height = 36,
  width = 120,
}) {
  const generatedId = useId();
  const gradientId = `sparkline-grad-${generatedId.replace(/:/g, '')}`;

  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const padding = 4;
  const chartHeight = height - padding * 2;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - padding - ((val - min) / (max - min || 1)) * chartHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const lastPoint = points[points.length - 1];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill area under curve */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Sparkline stroke path */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-[2.8]"
        />

        {/* Glowing tip point */}
        {lastPoint && (
          <g>
            <circle cx={lastPoint.x} cy={lastPoint.y} r="3" fill={color} />
            <circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill={color} opacity="0.4" className="animate-ping" />
          </g>
        )}
      </svg>
    </div>
  );
}

