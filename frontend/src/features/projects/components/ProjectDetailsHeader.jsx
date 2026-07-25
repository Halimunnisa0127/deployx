import { Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, ExternalLink, RefreshCw, RotateCcw } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { STATUS_VARIANT_MAP } from '../utils/projectMockData';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectDetailsHeader({ project, defaultUrl, onAction }) {
  const badgeVariant = STATUS_VARIANT_MAP[project?.status] ?? 'neutral';

  return (
    <div className="space-y-4">
      {/* Back Navigation Link */}
      <Link
        to="/dashboard/projects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors select-none"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Header Main Info Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight truncate">
              {project.name}
            </h1>
            <Badge variant={badgeVariant}>
              {project.status}
            </Badge>
          </div>

          {/* Repository & Metadata Info */}
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <GithubIcon className="text-slate-400" />
              <span className="text-slate-300 font-medium">github.com/deployx/{project.name}</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-slate-300">{project.branch || 'main'}</span>
            </span>
            <span className="text-slate-700">•</span>
            <a
              href={`https://${defaultUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>{defaultUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<RotateCcw className="w-3.5 h-3.5 text-slate-300" />}
            onClick={() => onAction && onAction('Rollback')}
          >
            Rollback
          </Button>

          <Button
            variant="primary"
            size="sm"
            iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => onAction && onAction('Redeploy')}
          >
            Redeploy
          </Button>
        </div>
      </div>
    </div>
  );
}
