import React, { memo } from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Tooltip from '../../../components/ui/Tooltip';
import { 
  GitBranch, 
  GitCommit,
  Clock, 
  Calendar,
  ExternalLink, 
  User, 
  Cpu, 
  RefreshCw,
  Eye,
  Timer
} from 'lucide-react';

const STATUS_VARIANT_MAP = {
  success: 'success',
  building: 'warning',
  failed: 'danger',
  queued: 'neutral',
};

const STATUS_LABEL_MAP = {
  success: 'Success',
  building: 'Building',
  failed: 'Failed',
  queued: 'Queued',
};

const ENV_VARIANT_MAP = {
  Production: 'info',
  Preview: 'warning',
  Development: 'neutral',
};

/** Framework Icon helper */
const FrameworkIcon = ({ framework, className = "w-4 h-4" }) => {
  const fw = (framework || '').toLowerCase();
  
  if (fw.includes('react')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="2" fill="#38bdf8" />
      </svg>
    );
  }
  if (fw.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#f8fafc" strokeWidth="2">
        <circle cx="12" cy="12" r="9" stroke="#94a3b8" />
        <path d="M15 16L9.5 9v7H8V8h1.8l5.4 7.5V8H17v8h-2z" fill="#f8fafc" stroke="none" />
      </svg>
    );
  }
  if (fw.includes('node')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }
  if (fw.includes('vite')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#facc15" fillOpacity="0.25" />
      </svg>
    );
  }

  return <Cpu className={`${className} text-indigo-400`} />;
};

function DeploymentCard({ deployment, onClick, onRedeploy }) {
  const {
    id,
    deploymentNumber,
    projectName,
    environment,
    framework,
    branch,
    commitHash,
    commitMessage,
    status,
    duration,
    triggeredBy,
    deployedAt,
    url,
    isLive,
  } = deployment;

  const statusVariant = STATUS_VARIANT_MAP[status] || 'neutral';
  const envVariant = ENV_VARIANT_MAP[environment] || 'neutral';

  const handleCardClick = () => {
    if (onClick) {
      onClick(deployment);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleUrlClick = (e) => {
    e.stopPropagation();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRedeployClick = (e) => {
    e.stopPropagation();
    if (onRedeploy) {
      onRedeploy(deployment);
    }
  };

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`Deployment ${projectName} #${deploymentNumber} ${status}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group relative p-5 sm:p-6 rounded-2xl bg-card hover:bg-slate-50 dark:hover:bg-slate-900/90 border border-border hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_12px_36px_rgba(79,70,229,0.18)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 space-y-4 overflow-hidden text-left"
    >
      {/* Top Row: Framework Icon Avatar, Project Name, Deployment ID, Environment Badge & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border">
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
          {/* Framework Icon Avatar */}
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 shadow-inner group-hover:border-indigo-300 dark:group-hover:border-indigo-500/40 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
            <FrameworkIcon framework={framework} className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                {projectName}
              </h3>

              {/* Deployment ID badge */}
              <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-medium">
                {id}
              </span>

              {/* Deployment Number */}
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                #{deploymentNumber}
              </span>

              {/* Environment Badge */}
              <Badge variant={envVariant} dot={false}>
                {environment}
              </Badge>
            </div>
            
            {/* Subtitle: Framework Name & Created Time */}
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <FrameworkIcon framework={framework} className="w-3.5 h-3.5" />
                {framework}
              </span>
              <span className="text-slate-400 dark:text-slate-600">&bull;</span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Created {deployedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status Badge & Live Pulse */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {isLive && (
            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}
          <Badge variant={statusVariant}>
            {STATUS_LABEL_MAP[status] || status}
          </Badge>
        </div>
      </div>

      {/* Middle Row: Branch, Commit Hash, Build Duration & Commit Message */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
          {/* Branch */}
          <span className="inline-flex items-center gap-1.5 font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-200 dark:border-indigo-500/20 font-medium">
            <GitBranch className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            {branch}
          </span>

          {/* Commit Hash */}
          <span className="inline-flex items-center gap-1.5 font-mono text-foreground bg-muted px-2.5 py-1 rounded border border-border font-medium">
            <GitCommit className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {commitHash}
          </span>

          {/* Build Duration */}
          <span className="inline-flex items-center gap-1.5 text-foreground bg-muted px-2.5 py-1 rounded border border-border font-mono text-sm">
            <Timer className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            Duration: <strong className="text-foreground font-semibold">{duration}</strong>
          </span>
        </div>

        {/* Commit Message */}
        <p className="text-sm text-foreground font-medium leading-relaxed line-clamp-1 group-hover:text-foreground transition-colors">
          {commitMessage}
        </p>
      </div>

      {/* Bottom Row: Triggered By, Created Time & Hover Action Buttons with Tooltips */}
      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            Triggered by: <strong className="text-foreground font-medium">{triggeredBy}</strong>
          </span>

          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            Created: <strong className="text-foreground font-medium">{deployedAt}</strong>
          </span>
        </div>

        {/* Hover Actions Toolbar with Section 6 Tooltips */}
        <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* View Details Tooltip */}
          <Tooltip content="View Details" position="top">
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Eye className="w-3.5 h-3.5 text-indigo-400" />}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="View Details"
            >
              View Details
            </Button>
          </Tooltip>

          {/* Open Deployment Tooltip */}
          <Tooltip content="Open Deployment" position="top">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<ExternalLink className="w-3.5 h-3.5 text-sky-400" />}
              onClick={handleUrlClick}
              className="text-xs"
              aria-label="Open Deployment"
            >
              Open Deployment
            </Button>
          </Tooltip>

          {/* Redeploy Tooltip */}
          <Tooltip content="Redeploy" position="top">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<RefreshCw className="w-3.5 h-3.5 text-emerald-400" />}
              onClick={handleRedeployClick}
              className="text-xs"
              aria-label="Redeploy"
            >
              Redeploy
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default memo(DeploymentCard);
