import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import Tabs from '../../../components/ui/Tabs';

import {
  ProjectDetailsHeader,
  ProjectOverviewTab,
  ProjectDeploymentsTab,
  ProjectEnvTab,
  ProjectDomainsTab,
  ProjectSettingsTab,
} from '../components';

import { PROJECT_DETAILS_TABS, getMockDeployments } from '../utils/projectMockData';

/**
 * ProjectDetails
 * Page-level orchestrator for project management details view.
 */
export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [actionFeedback, setActionFeedback] = useState('');

  const projects = useSelector((state) => state.projects.items);
  const projectsStatus = useSelector((state) => state.projects.status);

  const project = useMemo(() => {
    return projects.find((p) => p.id === id);
  }, [projects, id]);

  const mockDeployments = useMemo(() => {
    return getMockDeployments(project);
  }, [project]);

  const handleAction = (actionName) => {
    setActionFeedback(`${actionName} triggered successfully.`);
    setTimeout(() => setActionFeedback(''), 4000);
  };

  // 1. Loading Skeleton State
  if (projectsStatus === 'loading') {
    return (
      <div className="w-full space-y-6 select-none font-sans">
        <Skeleton width="140px" height="20px" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton width="220px" height="32px" />
            <Skeleton width="300px" height="18px" />
          </div>
          <div className="flex gap-3">
            <Skeleton width="100px" height="40px" borderRadius="8px" />
            <Skeleton width="110px" height="40px" borderRadius="8px" />
          </div>
        </div>
        <Skeleton width="100%" height="48px" borderRadius="10px" />
        <Skeleton width="100%" height="280px" borderRadius="16px" />
      </div>
    );
  }

  // 2. Project Not Found State
  if (!project) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center select-none font-sans">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <AlertCircle className="w-7 h-7 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Project Not Found</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          The requested project does not exist or has been removed from this workspace.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/dashboard/projects')}>
          ← Return to Projects
        </Button>
      </div>
    );
  }

  const defaultUrl = project.url || `${project.name.toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Action Notification Banner */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{actionFeedback}</span>
          <button
            onClick={() => setActionFeedback('')}
            className="text-indigo-400 hover:text-white"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <ProjectDetailsHeader
        project={project}
        defaultUrl={defaultUrl}
        onAction={handleAction}
      />

      {/* Reusable Navigation Tabs */}
      <Tabs
        tabs={PROJECT_DETAILS_TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="line"
      />

      {/* Dynamic Tab Sub-Views */}
      <div>
        {activeTab === 'overview' && (
          <ProjectOverviewTab
            project={project}
            deployments={mockDeployments}
            onAction={handleAction}
          />
        )}

        {activeTab === 'deployments' && (
          <ProjectDeploymentsTab
            project={project}
            deployments={mockDeployments}
            onAction={handleAction}
          />
        )}

        {activeTab === 'env' && (
          <ProjectEnvTab project={project} onAction={handleAction} />
        )}

        {activeTab === 'domains' && (
          <ProjectDomainsTab project={project} defaultUrl={defaultUrl} onAction={handleAction} />
        )}

        {activeTab === 'settings' && (
          <ProjectSettingsTab project={project} onAction={handleAction} />
        )}
      </div>
    </div>
  );
}
