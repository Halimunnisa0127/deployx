import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeploymentDetailsHeader from '../components/DeploymentDetailsHeader';
import DeploymentStatusBanner from '../components/DeploymentStatusBanner';
import DeploymentSummaryGrid from '../components/DeploymentSummaryGrid';
import BuildMetadataCard from '../components/BuildMetadataCard';
import BuildArtifactsCard from '../components/BuildArtifactsCard';
import DeploymentTimeline from '../components/DeploymentTimeline';
import BuildLogsTerminal from '../components/BuildLogsTerminal';
import Button from '../../../components/ui/Button';
import { ArrowLeft, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useDeploymentDetails } from '../hooks/useDeploymentDetails';
import { useDeploymentMutations } from '../hooks/useDeploymentMutations';
import { useDeploymentLogs } from '../hooks/useDeploymentLogs';

export default function DeploymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  const { deployment: rawDeployment, isLoading, error, refetch } = useDeploymentDetails(id);
  const { createDeployment, cancelDeployment, isCreating, isCancelling } = useDeploymentMutations();
  const deployment = rawDeployment ? { ...rawDeployment, id: rawDeployment._id || rawDeployment.id } : null;
  const { logs: deploymentLogs, isLoading: isLoadingLogs } = useDeploymentLogs(id, deployment?.status);

  const handleRedeploy = async () => {
    try {
      if (!deployment?.project) return;
      const projectId = typeof deployment.project === 'object' ? deployment.project._id : deployment.project;
      
      const newDeployment = await createDeployment({
        projectId,
        environment: deployment.environment,
        branch: deployment.branch,
        commitHash: deployment.commitHash,
      });
      
      setNotification({
        type: 'success',
        message: `Triggered redeploy. New deployment ID: ${newDeployment.deploymentNumber}`,
      });
      setTimeout(() => {
        setNotification(null);
        navigate(`/dashboard/deployments/${newDeployment._id}`);
      }, 3000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to trigger redeploy',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleRollback = () => {
    // Rollback UI remains but functionality is out of scope for Phase 1
    setNotification({
      type: 'warning',
      message: `Rollback functionality is coming in a future CI/CD phase.`,
    });
    setTimeout(() => setNotification(null), 4000);
  };
  
  const handleCancel = async () => {
    try {
      await cancelDeployment(id);
      setNotification({
        type: 'success',
        message: 'Deployment cancelled successfully',
      });
      refetch();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to cancel deployment',
      });
      setTimeout(() => setNotification(null), 4000);
    }
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
    const logText = deploymentLogs && deploymentLogs.length > 0
      ? deploymentLogs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.text}`).join('\n')
      : 'No logs found for this deployment.';

    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
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

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <div className="text-sm text-slate-400">Loading deployment details...</div>
      </div>
    );
  }

  if (!deployment || error) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <div className="text-lg font-bold text-white">Deployment Not Found</div>
        <p className="text-sm text-slate-400">{error || `The requested deployment ID "${id}" does not exist.`}</p>
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
      <BuildLogsTerminal 
        deploymentId={deployment.id} 
        status={deployment.status} 
        logs={deploymentLogs} 
        isLoading={isLoadingLogs}
      />
    </div>
  );
}
