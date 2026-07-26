import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { 
  ArrowLeft, 
  RotateCcw, 
  History, 
  Layers, 
  Globe 
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

export default function DeploymentDetailsHeader({ deployment, onRedeploy, onRollback }) {
  const navigate = useNavigate();

  const {
    deploymentNumber,
    projectName,
    environment,
    status,
    isLive,
    rollbackAvailable,
    redeployAvailable,
  } = deployment;

  const statusVariant = STATUS_VARIANT_MAP[status] || 'neutral';
  const envVariant = ENV_VARIANT_MAP[environment] || 'neutral';

  return (
    <div className="space-y-4 pb-6 border-b border-slate-800/60">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/deployments')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Deployments</span>
      </button>

      {/* Main Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">
            <Layers className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {projectName}
              </h1>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">
                #{deploymentNumber}
              </span>
              <Badge variant={envVariant} dot={false}>
                {environment}
              </Badge>
              <Badge variant={statusVariant}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {isLive && (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Production
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deployment details, real-time build logs, and environment metadata.
            </p>
          </div>
        </div>

        {/* Action Buttons: Redeploy & Rollback */}
        <div className="flex items-center gap-3">
          {redeployAvailable && (
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onRedeploy}
            >
              Redeploy
            </Button>
          )}

          {rollbackAvailable && (
            <Button
              variant="danger"
              size="sm"
              iconLeft={<History className="w-3.5 h-3.5" />}
              onClick={onRollback}
            >
              Rollback
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
