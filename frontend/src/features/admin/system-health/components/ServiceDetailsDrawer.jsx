import React, { useState, useEffect } from "react";
import Drawer from "../../../../components/ui/Drawer";
import {
  Server,
  Activity,
  HardDrive,
  Cpu,
  ShieldCheck,
  Box,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TerminalSquare,
} from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import Button from "../../../../components/ui/Button";
import { getServiceDetails } from "../services/systemHealth.service";

export default function ServiceDetailsDrawer({
  isOpen,
  onClose,
  serviceId,
  onRestart,
  onToggleMaintenance,
}) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (isOpen && serviceId) {
      setLoading(true);
      getServiceDetails(serviceId).then((data) => {
        setDetails(data);
        setLoading(false);
      });
    }
  }, [isOpen, serviceId]);

  if (!serviceId) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Service Details"
      width="w-full md:w-[550px] xl:w-[650px]"
    >
      {loading || !details ? (
        <div className="p-6 space-y-8 animate-pulse">
          <div className="h-20 bg-slate-800/50 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-slate-800/50 rounded-xl" />
            <div className="h-24 bg-slate-800/50 rounded-xl" />
          </div>
          <div className="h-40 bg-slate-800/50 rounded-xl" />
        </div>
      ) : (
        <div className="p-6 space-y-8 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <Server className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                {details.name}
              </h2>
              <div className="flex gap-2">
                <Badge status={details.status} />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-800/50 text-slate-300 border-slate-700">
                  {details.version}
                </span>
              </div>
            </div>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Environment
              </span>
              <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-slate-400" /> {details.environment}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Region
              </span>
              <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> {details.region}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Host
              </span>
              <span
                className="text-sm font-medium text-slate-300 font-mono truncate"
                title={details.host}
              >
                {details.host}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Uptime
              </span>
              <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> {details.uptime}
              </span>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Live Metrics
            </h3>
            <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-5">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> CPU Usage
                  </div>
                  <div className="text-lg text-slate-200 font-mono">
                    {details.metrics.cpu}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" /> Memory
                  </div>
                  <div className="text-lg text-slate-200 font-mono">
                    {details.metrics.memory}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Request Rate
                  </div>
                  <div className="text-lg text-slate-200 font-mono">
                    {details.metrics.requestRate} rpm
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                    <TerminalSquare className="w-3.5 h-3.5" /> Response Time
                  </div>
                  <div className="text-lg text-slate-200 font-mono">
                    {details.metrics.responseTime} ms
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Logs Summary */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-indigo-400" /> Recent
              Events
            </h3>
            <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
              {details.recentLogs.map((log, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 border-b border-slate-800/50 last:border-0 text-sm"
                >
                  {log.level === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-slate-300">{log.message}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(log.time).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              iconLeft={<Activity className="w-4 h-4" />}
            >
              View Logs
            </Button>
            <div className="flex-1"></div>
            {details.status === "maintenance" ? (
              <Button
                variant="secondary"
                onClick={() => onToggleMaintenance(details, false)}
              >
                Disable Maintenance
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => onToggleMaintenance(details, true)}
              >
                Enable Maintenance
              </Button>
            )}
            <Button variant="primary" onClick={() => onRestart(details)}>
              Restart Service
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
