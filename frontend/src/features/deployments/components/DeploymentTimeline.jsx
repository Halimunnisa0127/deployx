import React from 'react';
import { 
  CheckCircle2, 
  Hourglass, 
  XCircle, 
  GitBranch, 
  Cpu, 
  UploadCloud, 
  Globe 
} from 'lucide-react';

export default function DeploymentTimeline({ status = 'success' }) {
  const isFailed = status === 'failed';
  const isBuilding = status === 'building';
  const isQueued = status === 'queued';

  const timelineSteps = [
    {
      id: 1,
      title: 'Queued',
      description: 'Build request placed in deployment queue',
      timestamp: '00:00:00',
      status: 'completed',
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: 'Cloning Repository',
      description: 'Cloned branch main @ #a4b9c1d from GitHub',
      timestamp: '00:00:02',
      status: 'completed',
      icon: GitBranch,
    },
    {
      id: 3,
      title: 'Building Project',
      description: isFailed ? 'Failed during npm run build step' : 'Executed npm run build successfully',
      timestamp: '00:00:14',
      status: isFailed ? 'failed' : isBuilding ? 'in_progress' : isQueued ? 'pending' : 'completed',
      icon: Cpu,
    },
    {
      id: 4,
      title: 'Uploading Artifacts',
      description: isFailed ? 'Skipped artifact upload due to build failure' : 'Uploaded 42 static files & edge bundles',
      timestamp: '00:00:28',
      status: isFailed ? 'failed' : isBuilding || isQueued ? 'pending' : 'completed',
      icon: UploadCloud,
    },
    {
      id: 5,
      title: 'Live Production',
      description: isFailed ? 'Deployment aborted' : 'Global edge DNS routed & TLS 1.3 certificate active',
      timestamp: '00:00:34',
      status: isFailed ? 'failed' : isBuilding || isQueued ? 'pending' : 'completed',
      icon: Globe,
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6 text-left">
      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/60 pb-3">
        Deployment Progress Timeline
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timelineSteps.map((step) => {
          let stepBg = 'bg-slate-900 border-slate-700 text-slate-400';
          let iconColor = 'text-slate-400';

          if (step.status === 'completed') {
            stepBg = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
            iconColor = 'text-emerald-400';
          } else if (step.status === 'in_progress') {
            stepBg = 'bg-amber-500/10 border-amber-500/40 text-amber-400';
            iconColor = 'text-amber-400 animate-spin';
          } else if (step.status === 'failed') {
            stepBg = 'bg-red-500/10 border-red-500/40 text-red-400';
            iconColor = 'text-red-400';
          }

          const StepIcon = step.status === 'in_progress' ? Hourglass : step.status === 'failed' ? XCircle : step.icon;

          return (
            <div key={step.id} className="relative flex items-start gap-4 group">
              {/* Step Circle Marker */}
              <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-slate-950 ${stepBg}`}>
                <StepIcon className={`w-3.5 h-3.5 ${iconColor}`} />
              </div>

              {/* Step Content */}
              <div className="flex-1 p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 group-hover:border-slate-700/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {step.description}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500 shrink-0">
                  {step.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
