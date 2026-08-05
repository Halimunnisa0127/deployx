import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { 
  ArrowLeft, 
  RotateCcw, 
  History, 
  Layers, 
  ExternalLink,
  Copy,
  Download,
  Share2,
  Check
} from 'lucide-react';

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

export default function DeploymentDetailsHeader({ 
  deployment, 
  onRedeploy, 
  onRollback,
  onCopyUrl,
  onDownloadLogs,
  onShare
}) {
  const navigate = useNavigate();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [shared, setShared] = useState(false);

  const {
    id,
    deploymentNumber,
    projectName,
    environment,
    status,
    isLive,
    url,
    rollbackAvailable,
    redeployAvailable,
  } = deployment;

  const statusVariant = STATUS_VARIANT_MAP[status] || 'neutral';
  const envVariant = ENV_VARIANT_MAP[environment] || 'neutral';
  const isFailed = status === 'failed';

  const handleOpenApp = () => {
    if (!isFailed && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyUrlClick = () => {
    if (onCopyUrl) {
      onCopyUrl(url);
    } else if (url) {
      navigator.clipboard.writeText(url);
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare(url);
    } else if (url) {
      navigator.clipboard.writeText(url);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800/60 font-sans text-left">
      {/* Back Navigation Button */}
      <button
        onClick={() => navigate('/dashboard/deployments')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
        aria-label="Back to deployments list"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Deployments</span>
      </button>

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Title, Badges & Metadata */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 font-bold text-lg shrink-0 shadow-lg shadow-indigo-500/10">
            <Layers className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {projectName}
              </h1>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20 font-medium">
                {id}
              </span>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/60">
                #{deploymentNumber}
              </span>
              <Badge variant={envVariant} dot={false}>
                {environment}
              </Badge>
              <Badge variant={statusVariant}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {isLive && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  Live Production
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Deployment details, real-time build logs, and environment metadata.
            </p>
          </div>
        </div>

        {/* Header Actions Bar */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Secondary Action 1: Open App (Disabled if failed) */}
          <Button
            variant="secondary"
            size="sm"
            disabled={isFailed}
            iconLeft={<ExternalLink className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />}
            onClick={handleOpenApp}
            title={isFailed ? 'App unavailable due to build failure' : 'Open deployed application'}
            aria-label="Open App"
          >
            Open App
          </Button>

          {/* Secondary Action 2: Copy URL */}
          <Button
            variant="secondary"
            size="sm"
            iconLeft={copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />}
            onClick={handleCopyUrlClick}
            aria-label="Copy URL"
          >
            {copiedUrl ? 'Copied' : 'Copy URL'}
          </Button>

          {/* Secondary Action 3: Download Logs */}
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<Download className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
            onClick={onDownloadLogs}
            aria-label="Download Logs"
          >
            Download Logs
          </Button>

          {/* Secondary Action 4: Share */}
          <Button
            variant="secondary"
            size="sm"
            iconLeft={shared ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />}
            onClick={handleShareClick}
            aria-label="Share deployment link"
          >
            {shared ? 'Shared' : 'Share'}
          </Button>

          {/* Danger Action: Rollback */}
          {rollbackAvailable && (
            <Button
              variant="danger"
              size="sm"
              iconLeft={<History className="w-3.5 h-3.5" />}
              onClick={onRollback}
              aria-label="Rollback deployment"
            >
              Rollback
            </Button>
          )}

          {/* Primary Action: Redeploy */}
          {redeployAvailable && (
            <Button
              variant="primary"
              size="sm"
              iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onRedeploy}
              aria-label="Redeploy application"
            >
              Redeploy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
