import React, { useState, useEffect } from "react";
import Drawer from "../../../../components/ui/Drawer";
import {
  Rocket,
  Box,
  Database,
  HardDrive,
  Cpu,
  GitBranch,
  Terminal,
  Globe,
  User,
  ExternalLink,
  RefreshCcw,
  XCircle,
  Trash2,
} from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import EnvironmentBadge from "./EnvironmentBadge";
import FrameworkBadge from "./FrameworkBadge";
import Button from "../../../../components/ui/Button";
import DeploymentTimeline from "./DeploymentTimeline";
import LogsViewer from "./LogsViewer";
import { DrawerSkeleton } from "./DeploymentsSkeleton";
import {
  getDeploymentLogs,
  getDeploymentTimeline,
  getDeploymentArtifacts,
} from "../services/deployments.service";

export default function DeploymentDetailsDrawer({
  isOpen,
  onClose,
  deployment,
  onRedeploy,
  onCancel,
  onDelete,
}) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [artifacts, setArtifacts] = useState(null);

  useEffect(() => {
    if (isOpen && deployment) {
      fetchDetails(deployment.id);
    }
  }, [isOpen, deployment]);

  const fetchDetails = async (id) => {
    try {
      setLoading(true);
      const [fetchedLogs, fetchedTimeline, fetchedArtifacts] =
        await Promise.all([
          getDeploymentLogs(id),
          getDeploymentTimeline(id),
          getDeploymentArtifacts(id),
        ]);
      setLogs(fetchedLogs);
      setTimeline(fetchedTimeline);
      setArtifacts(fetchedArtifacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!deployment) return null;
  const isRunning =
    deployment.status === "running" || deployment.status === "queued";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Deployment Details"
      width="w-full md:w-[600px] xl:w-[700px]"
    >
      {loading ? (
        <DrawerSkeleton />
      ) : (
        <div className="p-6 space-y-8 animate-in fade-in duration-300">
          {/* Overview */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <Rocket className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-white">
                  {deployment.project}
                </h2>
                <Badge status={deployment.status} />
              </div>
              <p className="text-slate-400 text-sm font-mono mt-1 flex items-center gap-2">
                {deployment.id} • {deployment.latestCommit}
              </p>
              {deployment.domain && (
                <a
                  href={`https://${deployment.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {deployment.domain} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Framework
              </span>
              <div>
                <FrameworkBadge framework={deployment.framework} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Environment
              </span>
              <div>
                <EnvironmentBadge environment={deployment.environment} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Duration
              </span>
              <span className="text-sm font-medium text-slate-300 font-mono">
                {deployment.duration}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Owner
              </span>
              <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5" /> {deployment.owner}
              </span>
            </div>
          </div>

          {/* Timeline & Logs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" /> Build Pipeline
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 border border-slate-800/80 rounded-xl bg-slate-900/40 p-4">
                <DeploymentTimeline timeline={timeline} />
              </div>
              <div className="lg:col-span-2">
                <LogsViewer logs={logs} />
              </div>
            </div>
          </div>

          {/* Metadata & Artifacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-indigo-400" /> Source
              </h3>
              <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Repository</span>
                  <span className="text-slate-200 truncate max-w-[150px]">
                    {deployment.repository.split("/")[2]}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Trigger</span>
                  <span className="text-slate-200">
                    {deployment.triggeredBy}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Commit</span>
                  <span className="text-slate-200 font-mono">
                    {deployment.latestCommit}
                  </span>
                </div>
              </div>
            </div>

            {artifacts && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-indigo-400" /> Artifacts
                </h3>
                <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" /> Total Size
                    </span>
                    <span className="text-slate-200 font-mono">
                      {artifacts.buildSize}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" /> Static
                    </span>
                    <span className="text-slate-200 font-mono">
                      {artifacts.staticAssets}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> Server
                    </span>
                    <span className="text-slate-200 font-mono">
                      {artifacts.serverBundle}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="secondary"
              iconLeft={<RefreshCcw className="w-4 h-4" />}
              onClick={() => onRedeploy(deployment)}
            >
              Redeploy
            </Button>
            <Button
              variant="secondary"
              iconLeft={<XCircle className="w-4 h-4" />}
              onClick={() => onCancel(deployment)}
              disabled={!isRunning}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              iconLeft={<Trash2 className="w-4 h-4" />}
              onClick={() => onDelete(deployment)}
              className="text-rose-400 hover:text-rose-300 border-rose-500/20 hover:bg-rose-500/10"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
