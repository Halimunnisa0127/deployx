import Badge from '../../../components/ui/Badge';
import { 
  GitBranch, 
  Clock, 
  User, 
  Cpu, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Hourglass,
  ArrowUpRight
} from 'lucide-react';

const STATUS_ICON_MAP = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  building: <Hourglass className="w-4 h-4 text-amber-400 animate-spin" />,
  failed: <XCircle className="w-4 h-4 text-red-400" />,
  queued: <AlertTriangle className="w-4 h-4 text-slate-400" />,
};

const STATUS_VARIANT_MAP = {
  success: 'success',
  building: 'warning',
  failed: 'danger',
  queued: 'neutral',
};

const ENV_VARIANT_MAP = {
  Production: 'info',
  Preview: 'warning',
  Development: 'neutral',
};

export default function DeploymentSummaryGrid({ deployment }) {
  const {
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
  } = deployment;

  const statusVariant = STATUS_VARIANT_MAP[status] || 'neutral';
  const envVariant = ENV_VARIANT_MAP[environment] || 'neutral';
  const statusIcon = STATUS_ICON_MAP[status] || STATUS_ICON_MAP.queued;

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
      <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
        Deployment Overview
      </h3>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        
        {/* Item 1: Status */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <div className="flex items-center gap-2 pt-0.5">
            {statusIcon}
            <Badge variant={statusVariant}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Item 2: Git Branch & Commit Hash */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Git Branch & Commit</span>
          <div className="flex items-center gap-2 pt-0.5 font-mono text-xs">
            <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              {branch}
            </span>
            <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
              {commitHash}
            </span>
          </div>
        </div>

        {/* Item 3: Environment & Framework */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Environment & Framework</span>
          <div className="flex items-center gap-2 pt-0.5">
            <Badge variant={envVariant} dot={false}>
              {environment}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              {framework}
            </span>
          </div>
        </div>

        {/* Item 4: Build Duration */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Build Duration</span>
          <div className="text-sm font-semibold text-foreground flex items-center gap-1.5 pt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {duration}
          </div>
        </div>

        {/* Item 5: Deployment URL */}
        <div className="space-y-1 sm:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Deployment URL</span>
          <div className="pt-0.5">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
            >
              <Globe className="w-4 h-4" />
              <span>{url}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Item 6: Triggered By */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Triggered By</span>
          <div className="text-sm font-medium text-foreground flex items-center gap-1.5 pt-0.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {triggeredBy}
          </div>
        </div>

        {/* Item 7: Deployed At */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Deployment Time</span>
          <div className="text-sm font-medium text-foreground pt-0.5">
            {deployedAt}
          </div>
        </div>

      </div>

      {/* Commit Message Box */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-border text-left space-y-1">
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Commit Message</span>
        <p className="text-sm font-mono text-foreground leading-relaxed">
          {commitMessage}
        </p>
      </div>
    </div>
  );
}
