import { LayoutGrid, Layers, CheckCircle2, PlayCircle, AlertTriangle, Archive } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { MOCK_PROJECT_OVERVIEW } from '../data/mockDashboardData';

export default function ProjectOverviewCard({ overview = MOCK_PROJECT_OVERVIEW }) {
  const {
    total = 15,
    liveCount = 9,
    previewCount = 3,
    buildingCount = 0,
    failedCount = 1,
    archivedCount = 2,
  } = overview;

  // Handle previewCount fallback if buildingCount exists
  const effectivePreview = previewCount || buildingCount || 3;
  const effectiveTotal = total || (liveCount + effectivePreview + failedCount + archivedCount);

  const categories = [
    {
      id: 'total',
      label: 'Total Projects',
      count: effectiveTotal,
      color: 'bg-indigo-500',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      percent: 100,
    },
    {
      id: 'live',
      label: 'Live Projects',
      count: liveCount,
      color: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      percent: Math.round((liveCount / effectiveTotal) * 100),
    },
    {
      id: 'preview',
      label: 'Preview Projects',
      count: effectivePreview,
      color: 'bg-sky-500',
      icon: <PlayCircle className="w-4 h-4 text-sky-400" />,
      percent: Math.round((effectivePreview / effectiveTotal) * 100),
    },
    {
      id: 'failed',
      label: 'Failed Projects',
      count: failedCount,
      color: 'bg-rose-500',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      percent: Math.round((failedCount / effectiveTotal) * 100),
    },
    {
      id: 'archived',
      label: 'Archived Projects',
      count: archivedCount,
      color: 'bg-slate-500',
      icon: <Archive className="w-4 h-4 text-slate-400" />,
      percent: Math.round((archivedCount / effectiveTotal) * 100),
    },
  ];

  return (
    <Card style={{ maxWidth: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Project Overview
          </h2>
        </div>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full font-mono">
          {effectiveTotal} Total
        </span>
      </div>

      {/* Progress Breakdown */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2 group-hover:text-white transition-colors">
                <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                {cat.label}
              </span>
              <span className="font-mono font-semibold text-slate-200">
                {cat.count}{' '}
                <span className="text-slate-400 font-normal">({cat.percent}%)</span>
              </span>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className={`h-full ${cat.color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${cat.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

