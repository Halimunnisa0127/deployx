import { LayoutGrid, Layers, CheckCircle2, PlayCircle, AlertTriangle, Archive } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
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
      badgeText: null,
    },
    {
      id: 'live',
      label: 'Live Projects',
      count: liveCount,
      color: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      percent: Math.round((liveCount / effectiveTotal) * 100),
      badgeText: 'Healthy',
      badgeVariant: 'success',
    },
    {
      id: 'preview',
      label: 'Preview Projects',
      count: effectivePreview,
      color: 'bg-sky-500',
      icon: <PlayCircle className="w-4 h-4 text-sky-400" />,
      percent: Math.round((effectivePreview / effectiveTotal) * 100),
      badgeText: 'Preview',
      badgeVariant: 'info',
    },
    {
      id: 'failed',
      label: 'Failed Projects',
      count: failedCount,
      color: 'bg-rose-500',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      percent: Math.round((failedCount / effectiveTotal) * 100),
      badgeText: 'Critical',
      badgeVariant: 'danger',
    },
    {
      id: 'archived',
      label: 'Archived Projects',
      count: archivedCount,
      color: 'bg-slate-500',
      icon: <Archive className="w-4 h-4 text-slate-400" />,
      percent: Math.round((archivedCount / effectiveTotal) * 100),
      badgeText: 'Archived',
      badgeVariant: 'neutral',
    },
  ];

  return (
    <Card
      style={{ maxWidth: '100%', padding: '24px' }}
      className="relative overflow-hidden border-slate-200 dark:border-white/5 rounded-[18px] backdrop-blur-xl shadow-sm dark:shadow-xl bg-gradient-to-b from-white/90 via-white/80 to-purple-50/10 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-purple-950/10 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md dark:hover:shadow-purple-500/10 hover:border-purple-500/40 dark:hover:border-purple-500/30 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:to-indigo-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-500 dark:text-purple-400 shadow-sm shadow-purple-500/20">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Project Health
          </h2>
        </div>
        <span className="text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full font-mono">
          {effectiveTotal} Total
        </span>
      </div>

      {/* Progress Breakdown */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/dashboard/projects?status=${cat.id}`}
            className="block space-y-1.5 group p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                {cat.label}
              </span>
              <div className="flex items-center gap-3">
                {cat.badgeText && (
                  <Badge variant={cat.badgeVariant} className="text-[10px] py-0 px-1.5">
                    {cat.badgeText}
                  </Badge>
                )}
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 min-w-[60px] text-right">
                  {cat.count}{' '}
                  <span className="text-slate-600 dark:text-slate-400 font-normal">({cat.percent}%)</span>
                </span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className={`h-full ${cat.color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${cat.percent}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

