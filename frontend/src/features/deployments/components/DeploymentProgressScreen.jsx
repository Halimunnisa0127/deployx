import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Terminal,
  Check,
  Loader2,
  XCircle,
  Globe,
  ExternalLink,
  Copy,
  CheckCircle2,
  GitBranch,
  Folder,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import DeploymentSuccessScreen from './DeploymentSuccessScreen';
import { completeDeployment } from '../../projects/slice/projectsSlice';

const DEPLOYMENT_STEPS = [
  { id: 1, name: 'Initializing', duration: 1200 },
  { id: 2, name: 'Cloning Repository', duration: 1500 },
  { id: 3, name: 'Installing Dependencies', duration: 2000 },
  { id: 4, name: 'Building Project', duration: 2500 },
  { id: 5, name: 'Uploading Build', duration: 1500 },
  { id: 6, name: 'Generating SSL', duration: 1200 },
  { id: 7, name: 'Assigning Domain', duration: 1000 },
  { id: 8, name: 'Deployment Complete', duration: 0 },
];

const STEP_LOGS = {
  1: [
    { type: 'info', text: 'Initializing DeployX build container (v2.4.0-edge)...' },
    { type: 'info', text: 'Allocating isolated micro-VM in region: us-east-1 (N. Virginia)' },
    { type: 'info', text: 'Environment check passed. System ready.' },
  ],
  2: [
    { type: 'git', text: 'Connecting to GitHub repository...' },
    { type: 'git', text: 'Fetching branch ref...' },
    { type: 'git', text: 'Cloned repository successfully (commit #8f7a9c2) in 0.45s' },
  ],
  3: [
    { type: 'deps', text: 'Detecting package manager: npm' },
    { type: 'deps', text: 'Running: npm install --frozen-lockfile' },
    { type: 'deps', text: 'Fetched 482 packages from registry.npmjs.org' },
    { type: 'deps', text: 'Dependencies installed successfully in 3.12s' },
  ],
  4: [
    { type: 'build', text: 'Executing build script: npm run build' },
    { type: 'build', text: 'vite v5.2.0 building for production...' },
    { type: 'build', text: 'transforming (428/428) modules' },
    { type: 'build', text: 'dist/index.html                     0.45 kB' },
    { type: 'build', text: 'dist/assets/index-D7s8a9f.js       248.12 kB' },
    { type: 'build', text: '✨ Build completed successfully in 4.85s' },
  ],
  5: [
    { type: 'upload', text: 'Compressing static bundle artifacts...' },
    { type: 'upload', text: 'Uploading 14 static assets to DeployX Edge Storage...' },
    { type: 'upload', text: 'Synced to 120+ global CDN edge nodes.' },
  ],
  6: [
    { type: 'ssl', text: 'Provisioning TLS/SSL certificate via Let\'s Encrypt...' },
    { type: 'ssl', text: 'SNI certificate issued & validated for HTTPS traffic.' },
  ],
  7: [
    { type: 'domain', text: 'Configuring edge routing tables...' },
    { type: 'domain', text: 'Health checks passed (200 OK across 4 edge clusters).' },
  ],
  8: [
    { type: 'success', text: '🎉 Deployment completed successfully!' },
  ],
};

export default function DeploymentProgressScreen({
  projectName = 'my-awesome-app',
  repository = 'acme-corp/deployx-web-app',
  branch = 'main',
  url = 'https://my-awesome-app.deployx.app',
  onComplete,
  onCancel,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('in_progress'); // 'in_progress' | 'completed' | 'cancelled'
  const [copiedLogs, setCopiedLogs] = useState(false);

  const logsEndRef = useRef(null);

  // Auto-scroll logs terminal
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulate deployment progress
  useEffect(() => {
    if (status !== 'in_progress') return;

    if (currentStepIndex >= DEPLOYMENT_STEPS.length - 1) {
      setStatus('completed');
      dispatch(completeDeployment(projectName));
      if (onComplete) onComplete();

      // Automatically navigate to Project Dashboard after deployment completes
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard/projects');
      }, 3500);

      return () => clearTimeout(redirectTimer);
    }

    const currentStep = DEPLOYMENT_STEPS[currentStepIndex];
    const newLogLines = (STEP_LOGS[currentStep.id] || []).map((log) => ({
      ...log,
      timestamp: new Date().toLocaleTimeString(),
    }));

    setLogs((prev) => [...prev, ...newLogLines]);

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, status, onComplete, dispatch, navigate, projectName]);

  // Handle Cancel
  const handleCancelDeployment = () => {
    setStatus('cancelled');
    setLogs((prev) => [
      ...prev,
      {
        type: 'error',
        text: '❌ Deployment cancelled by user.',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    if (onCancel) onCancel();
  };

  // Handle Copy Logs
  const handleCopyLogs = () => {
    const textToCopy = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  // Handle Restart
  const handleRestartDeployment = () => {
    setCurrentStepIndex(0);
    setLogs([]);
    setStatus('in_progress');
  };

  // Progress percentage calculation
  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + 1) / DEPLOYMENT_STEPS.length) * 100)
  );

  const currentStepObj = DEPLOYMENT_STEPS[currentStepIndex];

  if (status === 'completed') {
    return (
      <DeploymentSuccessScreen
        projectName={projectName}
        repository={repository}
        branch={branch}
        productionUrl={url}
        previewUrl={url.replace('https://', 'https://git-main-')}
        deploymentId="dpl_9a8f7b6c5d4e"
        commitHash="8f7a9c2"
        deploymentDuration="42s"
        onCreateAnother={() => navigate('/dashboard/projects/new')}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Info Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              {projectName}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                status === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : status === 'cancelled'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}
            >
              {status === 'completed' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Deployed
                </>
              ) : status === 'cancelled' ? (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  Cancelled
                </>
              ) : (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Building & Deploying...
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              {repository}
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <GitBranch className="w-3.5 h-3.5 text-blue-400" />
              {branch}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {status === 'in_progress' && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleCancelDeployment}
            >
              Cancel Deployment
            </Button>
          )}

          {status === 'completed' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/dashboard/projects')}
              >
                Dashboard
              </Button>
              <Button
                variant="primary"
                size="sm"
                href={url}
                target="_blank"
                rel="noreferrer"
                iconRight={<ExternalLink className="w-4 h-4" />}
                className="shadow-lg shadow-blue-500/20"
              >
                Visit App
              </Button>
            </>
          )}

          {status === 'cancelled' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleRestartDeployment}
              iconLeft={<RotateCcw className="w-4 h-4" />}
            >
              Retry Deployment
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar & Steps Tracker */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Deployment Progress
            </span>
            <h3 className="text-base font-bold text-slate-100">
              {status === 'completed'
                ? 'Deployment Complete'
                : status === 'cancelled'
                ? 'Deployment Cancelled'
                : currentStepObj?.name}
            </h3>
          </div>

          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            {status === 'completed' ? '100%' : `${progressPercent}%`}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              status === 'completed'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : status === 'cancelled'
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 animate-pulse'
            }`}
            style={{ width: `${status === 'completed' ? 100 : progressPercent}%` }}
          />
        </div>

        {/* 8 Steps Grid List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {DEPLOYMENT_STEPS.map((step, idx) => {
            const isFinished = idx < currentStepIndex || status === 'completed';
            const isCurrent = idx === currentStepIndex && status === 'in_progress';
            const isFailed = status === 'cancelled' && idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                  isFinished
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-blue-500/15 border-blue-500 text-blue-300 font-semibold ring-1 ring-blue-500/30'
                    : isFailed
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isFinished
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white shadow-sm'
                      : isFailed
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isFinished ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : isFailed ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="truncate text-sm font-medium">{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Logs Terminal Panel */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>deployx-builder.log</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-500">
              {logs.length} lines
            </span>
            <button
              type="button"
              onClick={handleCopyLogs}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
              title="Copy Logs"
            >
              {copiedLogs ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Terminal Window Content */}
        <div className="p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 selection:bg-blue-500 selection:text-white">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic py-4 text-center">
              Waiting for build runner to start...
            </div>
          ) : (
            logs.map((log, index) => {
              let tagColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
              if (log.type === 'git') tagColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
              if (log.type === 'deps') tagColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              if (log.type === 'build') tagColor = 'text-sky-400 bg-sky-500/10 border-sky-500/20';
              if (log.type === 'ssl') tagColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
              if (log.type === 'success') tagColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              if (log.type === 'error') tagColor = 'text-red-400 bg-red-500/10 border-red-500/20';

              return (
                <div key={index} className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/40 p-0.5 rounded">
                  <span className="text-slate-600 text-xs select-none flex-shrink-0 pt-0.5">
                    [{log.timestamp}]
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-xs uppercase font-bold border flex-shrink-0 ${tagColor}`}
                  >
                    {log.type}
                  </span>
                  <span className="text-slate-200 break-all">{log.text}</span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
