import React, { useState, useEffect, useMemo } from 'react';
import DeploymentsHeader from '../components/DeploymentsHeader';
import AnalyticsCards from '../components/AnalyticsCards';
import DeploymentFilters from '../components/DeploymentFilters';
import DeploymentsTable from '../components/DeploymentsTable';
import DeploymentDetailsDrawer from '../components/DeploymentDetailsDrawer';
import ConfirmationDialog from '../../../../components/ui/ConfirmationDialog';
import { DeploymentsTableSkeleton, AnalyticsSkeleton } from '../components/DeploymentsSkeleton';
import { 
  NoDeploymentsEmptyState, 
  NoSearchResultsEmptyState, 
  NoRunningDeploymentsEmptyState, 
  NoFailedDeploymentsEmptyState 
} from '../components/DeploymentsEmptyState';
import SearchBar from '../../../../components/common/SearchBar';
import { 
  getDeployments, 
  redeployDeployment, 
  cancelDeployment, 
  deleteDeployment, 
  exportDeployments 
} from '../services/deployments.service';

export default function DeploymentsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deployments, setDeployments] = useState([]);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null); // { type, deployment }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const data = await getDeployments();
      setDeployments(data);
    } catch (error) {
      console.error("Failed to load deployments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const counts = useMemo(() => {
    const res = { all: deployments.length, running: 0, queued: 0, success: 0, failed: 0, cancelled: 0 };
    deployments.forEach(d => {
      if (res[d.status] !== undefined) res[d.status]++;
    });
    return res;
  }, [deployments]);

  const filteredDeployments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return deployments.filter(d => {
      if (activeFilter !== 'all' && d.status !== activeFilter) return false;
      
      if (query) {
        return d.project.toLowerCase().includes(query) || 
               d.owner.toLowerCase().includes(query) || 
               d.id.toLowerCase().includes(query) ||
               d.latestCommit.toLowerCase().includes(query);
      }
      return true;
    });
  }, [deployments, activeFilter, searchQuery]);

  const handleExport = async () => {
    try {
      await exportDeployments();
      alert("Deployments exported successfully!");
    } catch (error) {
      console.error("Failed to export deployments", error);
    }
  };

  const handleRowClick = (deployment) => {
    setSelectedDeployment(deployment);
    setIsDrawerOpen(true);
  };

  const handleOpenProject = (deployment) => {
    console.log("Open project for", deployment.project);
  };

  const handleRedeploy = async (deployment) => {
    await redeployDeployment(deployment.id);
    fetchData(true);
  };

  const confirmAction = (type, deployment) => {
    setModalConfig({ type, deployment });
    setIsModalOpen(true);
  };

  const executeConfirmedAction = async () => {
    if (!modalConfig) return;
    const { type, deployment } = modalConfig;
    
    if (type === 'cancel') {
      await cancelDeployment(deployment.id);
    } else if (type === 'delete') {
      await deleteDeployment(deployment.id);
      if (selectedDeployment?.id === deployment.id) setIsDrawerOpen(false);
    }
    
    setIsModalOpen(false);
    setModalConfig(null);
    fetchData(true);
  };

  const actionHandlers = {
    onViewDetails: handleRowClick,
    onOpenProject: handleOpenProject,
    onRedeploy: handleRedeploy,
    onCancel: (dep) => confirmAction('cancel', dep),
    onDelete: (dep) => confirmAction('delete', dep)
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <DeploymentsHeader 
        onExport={handleExport} 
        onRefresh={() => fetchData(true)} 
        isRefreshing={refreshing} 
      />

      {/* Top Statistics */}
      {loading && !refreshing ? (
        <AnalyticsSkeleton />
      ) : (
        <AnalyticsCards deployments={deployments} />
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DeploymentFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          counts={counts} 
        />
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search by ID, project, or commit..."
          shortcut="⌘K"
          size="md"
          className="w-full sm:w-80 shrink-0"
        />
      </div>

      {/* Table / Empty States */}
      {loading && !refreshing ? (
        <DeploymentsTableSkeleton />
      ) : deployments.length === 0 ? (
        <NoDeploymentsEmptyState />
      ) : filteredDeployments.length === 0 ? (
        activeFilter === 'running' ? <NoRunningDeploymentsEmptyState onClear={() => setActiveFilter('all')} /> :
        activeFilter === 'failed' ? <NoFailedDeploymentsEmptyState onClear={() => setActiveFilter('all')} /> :
        <NoSearchResultsEmptyState onClear={() => { setSearchQuery(''); setActiveFilter('all'); }} />
      ) : (
        <DeploymentsTable 
          deployments={filteredDeployments} 
          onRowClick={handleRowClick}
          actionHandlers={actionHandlers}
        />
      )}

      {/* Deep Dive Drawer */}
      <DeploymentDetailsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        deployment={selectedDeployment} 
        {...actionHandlers}
      />

      {/* Destructive Action Modal */}
      <ConfirmationDialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeConfirmedAction}
        title={modalConfig?.type === 'cancel' ? "Cancel Deployment" : "Delete Deployment"}
        message={`Are you sure you want to ${modalConfig?.type} ${modalConfig?.deployment?.project}? ${modalConfig?.type === 'delete' ? 'This action cannot be undone.' : ''}`}
        confirmText={modalConfig?.type === 'cancel' ? "Cancel Deployment" : "Delete Deployment"}
        isDanger={true}
      />
    </div>
  );
}
