import React, { useState, useEffect, useCallback } from "react";
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

import {
  getSystemOverview,
  getInfrastructureStatus,
  getPerformanceMetrics,
  getIncidentTimeline,
  restartService,
  toggleMaintenanceMode,
  exportHealthReport,
} from "../services/systemHealth.service";

export default function SystemHealthPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState("off");

  // Data states
  const [overview, setOverview] = useState(null);
  const [infrastructure, setInfrastructure] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [incidents, setIncidents] = useState([]);

  // Drawer state
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [overviewRes, infraRes, metricsRes, incidentsRes] =
        await Promise.all([
          getSystemOverview(),
          getInfrastructureStatus(),
          getPerformanceMetrics(),
          getIncidentTimeline(),
        ]);

      setOverview(overviewRes);
      setInfrastructure(infraRes);
      setMetrics(metricsRes);
      setIncidents(incidentsRes);
      setHasData(true);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      setHasData(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh mechanism
  useEffect(() => {
    if (autoRefresh === "off") return;
    const interval = parseInt(autoRefresh) * 1000;
    const timer = setInterval(() => fetchData(true), interval);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchData]);

  const handleExport = async () => {
    try {
      await exportHealthReport();
      alert(`Exporting system health report...`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service.id);
    setIsDrawerOpen(true);
  };

  const handleRestartService = async (service) => {
    try {
      await restartService(service.id);
      fetchData(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMaintenance = async (service, enable) => {
    try {
      await toggleMaintenanceMode(service.id, enable);
      fetchData(true);
      if (isDrawerOpen && selectedService === service.id) {
        setIsDrawerOpen(false); // Close drawer to refresh state easily for now
      }
    } catch (err) {
      console.error(err);
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
              onServiceClick={handleServiceClick}
              onRestart={handleRestartService}
              onToggleMaintenance={handleToggleMaintenance}
            />
          )}

          {loading && !refreshing ? (
            <MetricSkeleton />
          ) : (
            <PerformanceMetrics metrics={metrics} />
          )}

          {loading && !refreshing ? (
            <div className="h-48 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 animate-pulse"></div>
          ) : (
            <IncidentTimeline events={incidents} />
          )}
        </>
      )}

      <ServiceDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        serviceId={selectedService}
        onRestart={handleRestartService}
        onToggleMaintenance={handleToggleMaintenance}
      />
    </div>
  );
}
