import { useState } from "react";
import SystemHealthHeader from "../components/SystemHealthHeader";
import HealthOverviewCard from "../components/HealthOverviewCard";
import InfrastructureCards from "../components/InfrastructureCards";
import PerformanceMetrics from "../components/PerformanceMetrics";
import IncidentTimeline from "../components/IncidentTimeline";
import ServiceDetailsDrawer from "../components/ServiceDetailsDrawer";
import {
  OverviewSkeleton,
  InfraSkeleton,
  MetricSkeleton,
} from "../components/SystemHealthSkeleton";
import { NoInfrastructureEmptyState } from "../components/SystemHealthEmptyState";

import { useSystemHealth } from "../hooks/useSystemHealth";

export default function SystemHealthPage() {
  const {
    loading,
    refreshing,
    hasData,
    autoRefresh,
    setAutoRefresh,
    overview,
    infrastructure,
    metrics,
    incidents,
    fetchData,
    handleExport,
    handleRestartService,
    handleToggleMaintenance,
  } = useSystemHealth();

  // Drawer state
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onServiceClick = (service) => {
    setSelectedService(service.id);
    setIsDrawerOpen(true);
  };

  const onRestart = async (service) => {
    await handleRestartService(service.id);
  };

  const onToggleMaintenance = async (service, enable) => {
    const success = await handleToggleMaintenance(service.id, enable);
    if (success && isDrawerOpen && selectedService === service.id) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <SystemHealthHeader
        onRefresh={() => fetchData(true)}
        onExport={handleExport}
        isRefreshing={refreshing}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
      />

      {!hasData ? (
        <NoInfrastructureEmptyState onRefresh={() => fetchData(true)} />
      ) : (
        <>
          {loading && !refreshing ? (
            <OverviewSkeleton />
          ) : (
            <HealthOverviewCard data={overview} />
          )}

          {loading && !refreshing ? (
            <InfraSkeleton />
          ) : (
            <InfrastructureCards
              services={infrastructure}
              onServiceClick={onServiceClick}
              onRestart={onRestart}
              onToggleMaintenance={onToggleMaintenance}
            />
          )}

          {loading && !refreshing ? (
            <MetricSkeleton />
          ) : (
            <PerformanceMetrics metrics={metrics} />
          )}

          {loading && !refreshing ? (
            <div className="h-48 bg-card rounded-2xl border border-border animate-pulse"></div>
          ) : (
            <IncidentTimeline events={incidents} />
          )}
        </>
      )}

      <ServiceDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        serviceId={selectedService}
        onRestart={onRestart}
        onToggleMaintenance={onToggleMaintenance}
      />
    </div>
  );
}
