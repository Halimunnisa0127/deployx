import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDeployments } from '../data/mockDeployments';
import DeploymentDetailsHeader from '../components/DeploymentDetailsHeader';
import DeploymentSummaryGrid from '../components/DeploymentSummaryGrid';
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

  if (!deployment) {
    return (
      <div className="py-20 text-center space-y-4">
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
    <div className="space-y-8 pb-12 text-left">
      {/* Action Notification Toast (Simulated Action Feedback) */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="hover:underline">Dismiss</button>
        </div>
      )}

      {/* 1. Header Section with Back Button & Actions */}
      <DeploymentDetailsHeader
        deployment={deployment}
        onRedeploy={handleRedeploy}
        onRollback={handleRollback}
      />

      {/* 2. Structured Deployment Overview Grid */}
      <DeploymentSummaryGrid deployment={deployment} />

      {/* 3. Deployment Progress Timeline */}
      <DeploymentTimeline status={deployment.status} />

      {/* 4. Build Logs Terminal Window */}
      <BuildLogsTerminal />
    </div>
  );
}
