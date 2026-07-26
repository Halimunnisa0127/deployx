import React from 'react';
import Badge from '../../../components/ui/Badge';
import { 
  GitBranch, 
  Clock, 
  ExternalLink, 
  User, 
  Layers, 
  Cpu,
  ArrowUpRight,
  Terminal,
  RotateCcw
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

export default function DeploymentCard({ deployment, onClick }) {
  const {
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

  const handleUrlClick = (e) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative p-5 sm:p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(79,70,229,0.12)] hover:-translate-y-0.5 space-y-4"
    >
      {/* Top Row: Project Name, Deployment Number, Environment, Framework, & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {projectName}
              </h3>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                #{deploymentNumber}
              </span>
              <Badge variant={envVariant} dot={false}>
                {environment}
              </Badge>
            </div>
            
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                {framework}
              </span>
              <span>&bull;</span>
              <span>Deployed {deployedAt}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Status Badge & Live Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isLive && (
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}
          <Badge variant={statusVariant}>
            {STATUS_LABEL_MAP[status] || status}
          </Badge>
        </div>
      </div>

      {/* Middle Row: Commit Info & Branch */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
          <span className="inline-flex items-center gap-1 font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
            <GitBranch className="w-3.5 h-3.5" />
            {branch}
          </span>
          <span className="font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700/60">
            {commitHash}
          </span>
        </div>

        <p className="text-sm text-slate-300 font-medium leading-relaxed line-clamp-1">
          {commitMessage}
        </p>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/40">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" />
            {triggeredBy}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Duration: <strong className="text-slate-300 font-medium">{duration}</strong>
          </span>
        </div>

        {/* URL Link Action */}
        <button
          type="button"
          onClick={handleUrlClick}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium hover:underline focus:outline-none"
        >
          <span>{url.replace('https://', '')}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
