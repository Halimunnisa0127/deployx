import React, { memo } from 'react';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/common/EmptyState';
import { 
  CheckCircle2, 
  Hourglass, 
  XCircle, 
  GitBranch, 
  Cpu, 
  UploadCloud, 
  Globe,
  Database,
  Server,
  Activity,
  ShieldCheck,
  Timer,
  Clock
} from 'lucide-react';

const STATUS_CONFIG_MAP = {
  completed: {
    variant: 'success',
    label: 'Completed',
    dotBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
    iconColor: 'text-emerald-400',
    anim: 'animate-in fade-in duration-300',
  },
  running: {
    variant: 'info',
    label: 'Running',
    dotBg: 'bg-sky-500/10 border-sky-500/40 text-sky-400',
    iconColor: 'text-sky-400 animate-pulse',
    anim: 'animate-pulse',
  },
  failed: {
    variant: 'danger',
    label: 'Failed',
    dotBg: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
    iconColor: 'text-rose-400',
    anim: '',
  },
  pending: {
    variant: 'neutral',
    label: 'Pending',
    dotBg: 'bg-muted border-border text-slate-500',
    iconColor: 'text-slate-500',
    anim: '',
  },
};

function DeploymentTimeline({ status = 'success' }) {
  if (status === 'unstarted' || status === 'uninitialized') {
    return (
      <EmptyState
        card={true}
        icon={<Activity className="w-6 h-6 text-slate-400" />}
        title="Timeline unavailable"
        description="Deployment has not started yet."
      />
    );
  }

  const isFailed = status === 'failed';
  const isBuilding = status === 'building';
  const isQueued = status === 'queued';

  const getStepStatus = (stepIndex) => {
    if (isQueued) {
      return stepIndex === 1 ? 'completed' : 'pending';
    }
    if (isBuilding) {
      if (stepIndex <= 3) return 'completed';
      if (stepIndex === 4) return 'running';
      return 'pending';
    }
    if (isFailed) {
      if (stepIndex <= 3) return 'completed';
      if (stepIndex === 4) return 'failed';
      return 'pending';
    }
    return 'completed';
  };

  const timelineSteps = [
    {
      id: 1,
      title: 'Queued',
      description: 'Build request placed in deployment queue',
      timestamp: '16:40:00',
      duration: '0.4s',
      status: getStepStatus(1),
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: 'Cloning Repository',
      description: 'Cloned branch main @ #a4b9c1d from GitHub',
      timestamp: '16:40:01',
      duration: '1.8s',
      status: getStepStatus(2),
      icon: GitBranch,
    },
    {
      id: 3,
      title: 'Restore Cache',
      description: 'Restored build cache & cached node_modules layer (142 MB saved)',
      timestamp: '16:40:03',
      duration: '2.4s',
      status: getStepStatus(3),
      icon: Database,
    },
    {
      id: 4,
      title: 'Building Project',
      description: isFailed ? 'Build failed during npm run build step' : 'Executed npm run build successfully',
      timestamp: '16:40:06',
      duration: '14.2s',
      status: getStepStatus(4),
      icon: Cpu,
    },
    {
      id: 5,
      title: 'Uploading Artifacts',
      description: isFailed ? 'Skipped artifact upload due to build failure' : 'Uploaded 42 static build files & assets to edge CDN',
      timestamp: '16:40:20',
      duration: '4.5s',
      status: getStepStatus(5),
      icon: UploadCloud,
    },
    {
      id: 6,
      title: 'Container Started',
      description: isFailed ? 'Container launch skipped' : 'Runtime container initialized & listening on port 3000',
      timestamp: '16:40:25',
      duration: '3.1s',
      status: getStepStatus(6),
      icon: Server,
    },
    {
      id: 7,
      title: 'Health Check',
      description: isFailed ? 'Health check omitted' : 'HTTP GET /healthz returned 200 OK (24ms latency)',
      timestamp: '16:40:28',
      duration: '1.2s',
      status: getStepStatus(7),
      icon: Activity,
    },
    {
      id: 8,
      title: 'SSL Verified',
      description: isFailed ? 'TLS verification aborted' : 'SSL/TLS 1.3 certificate generated & verified by Let\'s Encrypt',
      timestamp: '16:40:30',
      duration: '1.8s',
      status: getStepStatus(8),
      icon: ShieldCheck,
    },
    {
      id: 9,
      title: 'Live Production',
      description: isFailed ? 'Deployment workflow terminated with errors' : 'Global edge DNS routed & production traffic live',
      timestamp: '16:40:32',
      duration: '0.9s',
      status: getStepStatus(9),
      icon: Globe,
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          Deployment Progress Timeline
        </h3>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
          9 Pipeline Steps
        </span>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-7 space-y-5 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {timelineSteps.map((step) => {
          const cfg = STATUS_CONFIG_MAP[step.status] || STATUS_CONFIG_MAP.pending;
          const StepIcon = step.status === 'running' ? Hourglass : step.status === 'failed' ? XCircle : step.icon;

          return (
            <div key={step.id} className={`relative flex items-start gap-4 group ${cfg.anim}`}>
              {/* Step Circle Marker */}
              <div className={`absolute -left-7 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-background z-10 ${cfg.dotBg}`}>
                <StepIcon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
              </div>

              {/* Step Card Content */}
              <div className="flex-1 p-4 rounded-xl bg-background hover:bg-muted border border-border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {step.title}
                    </h4>

                    <Badge variant={cfg.variant} pulse={step.status === 'running'}>
                      {cfg.label}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Metadata: Duration & Timestamp */}
                <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                  <span className="inline-flex items-center gap-1 text-muted-foreground bg-muted px-2.5 py-1 rounded border border-border text-sm">
                    <Timer className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                    {step.duration}
                  </span>

                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {step.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(DeploymentTimeline);
