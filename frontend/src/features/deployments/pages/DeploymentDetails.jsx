import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDeployments } from '../data/mockDeployments';
import DeploymentDetailsHeader from '../components/DeploymentDetailsHeader';
import DeploymentStatusBanner from '../components/DeploymentStatusBanner';
import DeploymentSummaryGrid from '../components/DeploymentSummaryGrid';
import BuildMetadataCard from '../components/BuildMetadataCard';
import BuildArtifactsCard from '../components/BuildArtifactsCard';
import DeploymentTimeline from '../components/DeploymentTimeline';
import BuildLogsTerminal from '../components/BuildLogsTerminal';
import Button from '../../../components/ui/Button';
import { ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export default function DeploymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  // Find target deployment record from mock dataset
  const deployment = useMemo(() => {
    return mockDeployments.find((d) => d.id === id) || mockDeployments[0];
  }, [id]);

  const handleRedeploy = () => {
    setNotification({
      type: 'success',
      message: `Triggered redeploy for #${deployment.deploymentNumber} (${deployment.projectName})`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRollback = () => {
    setNotification({
      type: 'warning',
      message: `Initiated rollback to build #${deployment.deploymentNumber}`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyUrl = (url) => {
    if (url) navigator.clipboard.writeText(url);
    setNotification({
      type: 'success',
      message: 'Deployment URL copied to clipboard!',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadLogs = () => {
    const defaultLogs = [
      `[00:00:01] Initializing DeployX Build Environment (v20.11.0 node)`,
      `[00:00:02] Cloning repository for ${deployment.projectName}`,
      `[00:00:12] Running build command: ${deployment.buildCommand || 'npm run build'}`,
      `[00:00:34] ✓ Deployment successful! Production URL live: ${deployment.url}`,
    ].join('\n');

    const blob = new Blob([defaultLogs], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `build-logs-${deployment.id || 'dep-001'}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification({
      type: 'success',
      message: `Downloaded build log file build-logs-${deployment.id}.log`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShare = (url) => {
    if (url) navigator.clipboard.writeText(url);
    setNotification({
      type: 'success',
      message: 'Share link copied to clipboard!',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewLogs = () => {
    const el = document.getElementById('build-logs-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!deployment) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <div className="text-lg font-bold text-white">Deployment Not Found</div>
        <p className="text-sm text-slate-400">The requested deployment ID "{id}" does not exist.</p>
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/deployments')}
        >
          Back to Deployments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 text-left font-sans animate-in fade-in duration-300">
      {/* Action Notification Toast */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/90 border-amber-500/40 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="hover:underline text-xs">Dismiss</button>
        </div>
      )}

      {/* 1. Header Section with Back Button & Actions */}
      <DeploymentDetailsHeader
        deployment={deployment}
        onRedeploy={handleRedeploy}
        onRollback={handleRollback}
        onCopyUrl={handleCopyUrl}
        onDownloadLogs={handleDownloadLogs}
        onShare={handleShare}
      />

      {/* 2. Contextual Deployment Status Banner (Section 1) */}
      <DeploymentStatusBanner
        deployment={deployment}
        onRedeploy={handleRedeploy}
        onViewLogs={handleViewLogs}
        onCopyUrl={handleCopyUrl}
      />

      {/* 3. Structured Deployment Overview Grid */}
      <DeploymentSummaryGrid deployment={deployment} />

      {/* 4. Build Metadata Section */}
      <BuildMetadataCard deployment={deployment} />

      {/* 5. Build Artifacts Section */}
      <BuildArtifactsCard deployment={deployment} />

      {/* 6. Deployment Progress Timeline */}
      <DeploymentTimeline status={deployment.status} />

      {/* 7. Build Logs Terminal Window */}
      <BuildLogsTerminal deploymentId={deployment.id} status={deployment.status} />
    </div>
  );
}
