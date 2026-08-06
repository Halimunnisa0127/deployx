import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  RotateCcw,
  Hourglass,
  Clock
} from 'lucide-react';

export default function DeploymentStatusBanner({
  deployment,
  onRedeploy,
  onViewLogs,
  onCopyUrl
}) {
  const [copied, setCopied] = useState(false);
  const status = deployment?.status || 'success';
  const url = deployment?.url || '';

  const handleCopy = () => {
    if (onCopyUrl) {
      onCopyUrl(url);
    } else if (url) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenApp = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 1. BUILDING / IN PROGRESS BANNER
  if (status === 'building' || status === 'in_progress') {
    return (
      <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 shadow-xl space-y-3 font-sans text-left animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Hourglass className="w-5 h-5 text-amber-400 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <h3 className="text-sm font-bold text-amber-300">
                  Deployment in Progress
                </h3>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5 font-mono">
                Building Deployment... Step 4 of 9 &bull; <strong className="text-amber-300">63%</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/20 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Estimated 12s remaining</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-amber-950/80 h-2 rounded-full overflow-hidden border border-amber-500/20">
          <div className="bg-amber-400 h-full w-[63%] transition-all duration-500 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  // 2. SUCCESS BANNER
  if (status === 'success') {
    return (
      <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 shadow-xl font-sans text-left animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-emerald-300">
                  Deployment Successful
                </h3>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Deployment is live and serving traffic globally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<ExternalLink className="w-3.5 h-3.5 text-sky-400" />}
              onClick={handleOpenApp}
            >
              Open Application
            </Button>

            <Button
              variant="secondary"
              size="sm"
              iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy URL'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. FAILED BANNER
  if (status === 'failed') {
    return (
      <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 shadow-xl font-sans text-left animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-300">
                Deployment Failed
              </h3>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Deployment stopped because of build errors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Terminal className="w-3.5 h-3.5 text-slate-300" />}
              onClick={onViewLogs}
            >
              View Logs
            </Button>

            <Button
              variant="primary"
              size="sm"
              iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onRedeploy}
            >
              Redeploy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
