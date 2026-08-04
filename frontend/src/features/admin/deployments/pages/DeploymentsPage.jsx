import React, { useState } from "react";
import DeploymentsHeader from "../components/DeploymentsHeader";
import AnalyticsCards from "../components/AnalyticsCards";
import DeploymentFilters from "../components/DeploymentFilters";
import DeploymentsTable from "../components/DeploymentsTable";
import DeploymentDetailsDrawer from "../components/DeploymentDetailsDrawer";
import ConfirmationDialog from "../../../../components/ui/ConfirmationDialog";
import {
  DeploymentsTableSkeleton,
  DeploymentsStatisticsSkeleton as AnalyticsSkeleton,
} from "../components/DeploymentsSkeleton";
import {
  NoDeploymentsEmptyState,
  NoSearchResultsEmptyState,
  NoActiveDeploymentsEmptyState,
  NoFailedDeploymentsEmptyState,
} from "../components/DeploymentsEmptyState";
import SearchBar from "../../../../components/common/SearchBar";
import { useDeployments } from "../hooks/useDeployments";

export default function DeploymentsPage() {
  const {
    loading,
    refreshing,
    deployments,
    filteredDeployments,
    counts,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    fetchData,
    handleExport,
    handleRedeploy: hookHandleRedeploy,
    cancelDeployment,
    deleteDeployment,
  } = useDeployments();

  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null); // { type, deployment }

  const handleRowClick = (deployment) => {
    setSelectedDeployment(deployment);
    setIsDrawerOpen(true);
  };

  const handleOpenProject = (deployment) => {
    console.log("Open project for", deployment.project);
  };

  const handleRedeploy = async (deployment) => {
    await hookHandleRedeploy(deployment.id);
  };

  const confirmAction = (type, deployment) => {
    setModalConfig({ type, deployment });
    setIsModalOpen(true);
  };

  const executeConfirmedAction = async () => {
    if (!modalConfig) return;
    const { type, deployment } = modalConfig;
    if (type === "cancel") {
      await cancelDeployment(deployment.id);
    } else if (type === "delete") {
      await deleteDeployment(deployment.id);
      if (selectedDeployment?.id === deployment.id) setIsDrawerOpen(false);
    }
    setIsModalOpen(false);
    setModalConfig(null);
  };

  const actionHandlers = {
    onViewDetails: handleRowClick,
    onOpenProject: handleOpenProject,
    onRedeploy: handleRedeploy,
    onCancel: (dep) => confirmAction("cancel", dep),
    onDelete: (dep) => confirmAction("delete", dep),
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
          onClear={() => setSearchQuery("")}
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
        activeFilter === "running" ? (
          <NoActiveDeploymentsEmptyState
            onClear={() => setActiveFilter("all")}
          />
        ) : activeFilter === "failed" ? (
          <NoFailedDeploymentsEmptyState
            onClear={() => setActiveFilter("all")}
          />
        ) : (
          <NoSearchResultsEmptyState
            onClear={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
          />
        )
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
        title={
          modalConfig?.type === "cancel"
            ? "Cancel Deployment"
            : "Delete Deployment"
        }
        message={`Are you sure you want to ${modalConfig?.type} ${modalConfig?.deployment?.project}? ${modalConfig?.type === "delete" ? "This action cannot be undone." : ""}`}
        confirmText={
          modalConfig?.type === "cancel"
            ? "Cancel Deployment"
            : "Delete Deployment"
        }
        isDanger={true}
      />
    </div>
  );
}
