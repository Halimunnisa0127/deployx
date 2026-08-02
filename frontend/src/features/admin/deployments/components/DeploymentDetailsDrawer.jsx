import React, { useState } from "react";
import Drawer from "../../../../components/ui/Drawer";
import {
  Rocket,
  Calendar,
  Globe,
  GitBranch,
  Clock,
  Cpu,
  Database,
  Terminal,
  ExternalLink,
  RotateCcw,
  StopCircle,
} from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import Button from "../../../../components/ui/Button";
import LogsViewer from "./LogsViewer";
import DeploymentTimeline from "./DeploymentTimeline";

export default function DeploymentDetailsDrawer({
  isOpen,
  onClose,
  deployment,
  onRollback,
  onCancel,
  onViewLogs,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!deployment) return null;

  const isRunning =
    deployment.status === "running" || deployment.status === "queued";
  const isFailed = deployment.status === "failed";
  const isCompleted = deployment.status === "completed";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Deployment Details"
      width="w-full md:w-[600px] lg:w-[700px]"
    >
      <div className="flex flex-col h-full bg-white dark:bg-[#0b0f19]">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                <Rocket
                  className={`w-8 h-8 ${
                    isRunning
                      ? "text-amber-500 dark:text-amber-400"
                      : isFailed
                        ? "text-rose-500 dark:text-rose-400"
                        : "text-emerald-500 dark:text-emerald-400"
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {deployment.project}
                  </h2>
                  <Badge status={deployment.status} type="deployment" />
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4" />
                    {deployment.branch}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    {deployment.commit ? deployment.commit.substring(0, 7) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={<StopCircle className="w-4 h-4" />}
                  onClick={() => onCancel(deployment)}
                  className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
                >
                  Cancel
                </Button>
              ) : isCompleted ? (
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={<ExternalLink className="w-4 h-4" />}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  onClick={() =>
                    window.open(`https://${deployment.url}`, "_blank")
                  }
                >
                  Visit
                </Button>
              ) : null}
              {isFailed && (
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<RotateCcw className="w-4 h-4" />}
                  onClick={() => onRollback(deployment)}
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-200 dark:border-slate-800/80">
          <button
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "logs"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
            onClick={() => setActiveTab("logs")}
          >
            Build Logs
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "overview" ? (
            <div className="p-6 space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Region
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {deployment.region}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </span>
                  <span className="text-sm font-mono text-slate-900 dark:text-white">
                    {deployment.duration}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> Compute
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white uppercase">
                    {deployment.compute}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Deployed
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(deployment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Commit Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Database className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Commit
                  Details
                </h3>
                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                        {deployment.commitMessage}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>by {deployment.author}</span>
                        <span>•</span>
                        <span className="font-mono">{deployment.commit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {deployment.timeline && deployment.timeline.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <Terminal className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />{" "}
                    Execution Timeline
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4">
                    <DeploymentTimeline timeline={deployment.timeline} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Terminal className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Build
                  Output
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconLeft={<ExternalLink className="w-4 h-4" />}
                  onClick={() => onViewLogs(deployment)}
                >
                  Full Screen
                </Button>
              </div>
              <div className="flex-1 min-h-[400px]">
                <LogsViewer
                  logs={deployment.logs}
                  status={deployment.status}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isRunning && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/30">
            <Button
              variant="secondary"
              iconLeft={<RotateCcw className="w-4 h-4" />}
              onClick={() => onRollback(deployment)}
              className="w-full"
            >
              Rollback to this version
            </Button>
            {isCompleted && (
              <Button
                variant="secondary"
                iconLeft={<Globe className="w-4 h-4" />}
                onClick={() =>
                  window.open(`https://${deployment.url}`, "_blank")
                }
                className="w-full"
              >
                Open Deployment URL
              </Button>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}
