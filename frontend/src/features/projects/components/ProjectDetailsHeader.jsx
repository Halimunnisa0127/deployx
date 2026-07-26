import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  GitBranch,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  Copy,
  Check,
  Globe,
} from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  const badgeVariant = STATUS_VARIANT_MAP[project?.status] ?? 'neutral';

  const repoName = project?.name
    ? project.name.toLowerCase().replace(/[^a-z0-9-]/g, '')
    : 'app';
  const repoPath = `github.com/deployx/${repoName}`;
  const repoUrl = `https://${repoPath}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${defaultUrl}`);
    setCopied(true);
    if (onAction) onAction('Copy Production URL');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans select-none">
      {/* Back Navigation Link */}
      <Link
        to="/dashboard/projects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pb-2 border-b border-slate-800/60">
        {/* Left Column: Title, Badges & Metadata */}
        <div className="space-y-2.5 min-w-0 flex-1">
          {/* Title & Badges Row */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight truncate">
              {project?.name || 'DeployX Application'}
            </h1>

            {/* Status Badge */}
            <Badge variant={badgeVariant}>
              {project?.status || 'live'}
            </Badge>

            {/* Environment Badge */}
            <Badge variant="info" dot={true}>
              Production
            </Badge>

            {/* Framework Badge */}
            <Badge variant="neutral" dot={false}>
              {project?.framework || 'Vite / React'}
            </Badge>

            {/* Region Badge */}
            <Badge variant="neutral" dot={false}>
              {project?.region || 'us-east-1'}
            </Badge>

            {/* Node Version Badge */}
            <Badge variant="neutral" dot={false}>
              Node v20.x
            </Badge>
          </div>

          {/* Repository & Link Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <GithubIcon className="text-slate-400" />
              <span className="font-medium">{repoPath}</span>
            </a>

            <span className="text-slate-700">•</span>

            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-slate-300">{project?.branch || 'main'}</span>
            </span>

            <span className="text-slate-700">•</span>

            <a
              href={`https://${defaultUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{defaultUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Column: Complete Quick Actions Toolbar */}
        <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopyUrl}
          >
            {copied ? 'Copied URL' : 'Copy URL'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            iconLeft={<GithubIcon />}
          >
            Open GitHub
          </Button>

          <Button
            variant="secondary"
            size="sm"
            href={`https://${defaultUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            iconLeft={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Open Production
          </Button>

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

