import { useState } from 'react';
import {
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Key,
  Layers,
  ExternalLink,
  Copy,
  Check,
  GitBranch,
  Calendar,
  Server,
  Code2,
  Activity,
  ArrowUpRight,
  User,
} from 'lucide-react';

import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

import {
  STATUS_VARIANT_MAP,
  getMockProjectStats,
  getMockProjectActivities,
} from '../utils/projectMockData';

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

const STAT_ICON_MAP = {
  Layers: <Layers className="w-5 h-5 text-indigo-400" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  Globe: <Globe className="w-5 h-5 text-sky-400" />,
  Key: <Key className="w-5 h-5 text-amber-400" />,
};

const STAT_ACCENT_MAP = {
  Layers: 'bg-indigo-500/10 border-indigo-500/20',
  CheckCircle2: 'bg-emerald-500/10 border-emerald-500/20',
  Globe: 'bg-sky-500/10 border-sky-500/20',
  Key: 'bg-amber-500/10 border-amber-500/20',
};

const TIMELINE_ICON_MAP = {
  success: <Check className="w-3.5 h-3.5 text-emerald-400" />,
  env: <Key className="w-3.5 h-3.5 text-amber-400" />,
  domain: <Globe className="w-3.5 h-3.5 text-sky-400" />,
  rollback: <RotateCcw className="w-3.5 h-3.5 text-rose-400" />,
};

const TIMELINE_DOT_BG = {
  success: 'bg-emerald-500/10 border-emerald-500/30',
  env: 'bg-amber-500/10 border-amber-500/30',
  domain: 'bg-sky-500/10 border-sky-500/30',
  rollback: 'bg-rose-500/10 border-rose-500/30',
};

export default function ProjectOverviewTab({ project, deployments = [], onAction }) {
  const [copied, setCopied] = useState(false);

  const badgeVariant = STATUS_VARIANT_MAP[project?.status] ?? 'neutral';

  const defaultUrl =
    project?.url ||
    `${(project?.name || 'app').toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

  const repoName = project?.name
    ? project.name.toLowerCase().replace(/[^a-z0-9-]/g, '')
    : 'app';
  const repoPath = `github.com/deployx/${repoName}`;
  const repoUrl = `https://${repoPath}`;

  const stats = getMockProjectStats(project);
  const activities = getMockProjectActivities(project);

  const latestDeployment = deployments[0] || {
    id: 'dep-101',
    commit: 'Update landing page hero section',
    hash: '7a8f9c2',
    branch: project?.branch || 'main',
    status: project?.status || 'live',
    time: '2 hours ago',
    duration: '42s',
    triggeredBy: 'GitHub Push by @alex-dev',
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${defaultUrl}`);
    setCopied(true);
    if (onAction) onAction('Copy Production URL');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION 1 — Project Information */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            Project Details & Environment
          </h3>
          <Badge variant="info" dot={true}>
            Production
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">
              Project Name
            </span>
            <span className="text-slate-100 font-semibold text-sm block">
              {project?.name || 'DeployX Application'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">
              Framework
            </span>
            <span className="text-slate-100 font-semibold text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              {project?.framework || 'Vite / React'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">
              Environment
            </span>
            <div>
              <Badge variant="info" dot={true}>
                Production
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">
              Region
            </span>
            <span className="text-slate-200 font-medium block">
              {project?.region || 'us-east-1 (N. Virginia)'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">
              Repository
            </span>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-medium transition-colors group"
            >
              <GithubIcon className="text-slate-400 group-hover:text-white transition-colors" />
              <span className="truncate">{repoPath}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
            </a>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">
              Production URL
            </span>
            <a
              href={`https://${defaultUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors truncate"
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{defaultUrl}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>

          <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Created Date:
            </span>
            <span className="text-slate-300 font-medium text-[11px]">
              {project?.createdAt || 'Jul 12, 2026'}
            </span>
          </div>
        </div>
      </Card>

      {/* SECTION 2 — Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card
            key={item.id}
            style={{ maxWidth: '100%', padding: '20px 24px' }}
            className="hover:border-slate-700/80 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  {item.title}
                </span>
                <div className="text-2xl font-extrabold text-slate-100 tracking-tight">
                  {item.value}
                </div>
                <span className="text-[11px] font-medium text-slate-400 block">
                  {item.subtitle}
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  STAT_ACCENT_MAP[item.iconName] || 'bg-slate-800 border-slate-700'
                } flex-shrink-0`}
              >
                {STAT_ICON_MAP[item.iconName] || (
                  <Layers className="w-5 h-5 text-indigo-400" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* SECTION 3 — Latest Deployment Summary Card (Primary Highlight) */}
      <Card
        style={{
          padding: '24px',
          maxWidth: '100%',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.12)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Latest Deployment Summary
            </h3>
          </div>
          <Badge variant={badgeVariant}>
            {latestDeployment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mb-5">
          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">
              Commit Hash & Message
            </span>
            <span className="text-slate-200 font-semibold block truncate">
              {latestDeployment.commit}
            </span>
            <span className="font-mono text-indigo-400 text-[11px] bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block">
              {latestDeployment.hash}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">
              Branch
            </span>
            <span className="font-mono text-slate-200 font-semibold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {latestDeployment.branch}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">
              Triggered By
            </span>
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {latestDeployment.triggeredBy || 'GitHub Push by @alex-dev'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">
              Duration & Timestamp
            </span>
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {latestDeployment.time} ({latestDeployment.duration})
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Deployment ID: {latestDeployment.id || 'dep-101'}
          </span>
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => onAction && onAction('View Deployment')}
          >
            View Deployment
          </Button>
        </div>
      </Card>

      {/* SECTION 4 — Recent Activity Timeline */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recent Activity Timeline
            </h3>
          </div>
        </div>

        <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start gap-3 group">
              <div
                className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full border ${
                  TIMELINE_DOT_BG[act.type] || 'bg-slate-800 border-slate-700'
                } flex items-center justify-center flex-shrink-0 z-10 bg-[#0c121e]`}
              >
                {TIMELINE_ICON_MAP[act.type] || (
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                    {act.timeAgo}
                  </span>
                </div>
                <p className="text-[12px] text-slate-400 mt-0.5 truncate">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION 5 — Quick Actions */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="sm"
            iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => onAction && onAction('Trigger Redeploy')}
          >
            Redeploy
          </Button>

          <Button
            variant="secondary"
            size="sm"
            href={`https://${defaultUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            iconLeft={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Open App
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
            iconLeft={
              copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )
            }
            onClick={handleCopyUrl}
          >
            {copied ? 'Copied URL' : 'Copy URL'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

