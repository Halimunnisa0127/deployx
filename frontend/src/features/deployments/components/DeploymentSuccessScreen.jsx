import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Globe,
  ExternalLink,
  Copy,
  Check,
  GitBranch,
  Clock,
  Hash,
  Folder,
  Plus,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import GithubIcon from '../../../components/ui/GithubIcon';

// Confetti canvas component
function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ['#3b82f6', '#10b981', '#6366f1', '#ec4899', '#f59e0b', '#06b6d4', '#8b5cf6'];
    const particles = Array.from({ length: 110 }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 120,
      y: height / 3 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.22,
      friction: 0.98,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.vx *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        if (p.opacity > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (particles.some((p) => p.opacity > 0)) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}

export default function DeploymentSuccessScreen({
  projectName = 'my-awesome-app',
  productionUrl = 'https://my-awesome-app.deployx.app',
  previewUrl = 'https://my-awesome-app-git-main-acme.deployx.app',
  repository = 'acme-corp/deployx-web-app',
  branch = 'main',
  deploymentId = 'dpl_9a8f7b6c5d4e',
  commitHash = '8f7a9c2',
  commitMessage = 'feat: initial production deployment setup',
  deploymentDuration = '42s',
  onCreateAnother,
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(productionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in font-sans selection:bg-blue-500 selection:text-white relative">
      {/* Confetti Animation Effect */}
      <ConfettiCanvas />

      {/* Main Success Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8 relative overflow-hidden text-center">
        {/* Glow Accent Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Success Illustration */}
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400 stroke-[2.2]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-md">
              <Rocket className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Deployment Success
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Congratulations! Your project is live.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your application <span className="text-foreground font-bold">{projectName}</span> has been deployed successfully to DeployX global edge network.
            </p>
          </div>
        </div>

        {/* 2. Production & Preview URLs Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-border text-left space-y-4 shadow-inner relative z-10">
          {/* Production URL Row */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
                <Globe className="w-3.5 h-3.5" />
                Production URL
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">Active</span>
            </label>

            <div className="flex items-center gap-2 bg-card p-2.5 rounded-xl border border-border">
              <a
                href={productionUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold truncate flex-1 flex items-center gap-1.5"
              >
                {productionUrl}
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </a>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopyUrl}
                iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                className="text-xs flex-shrink-0"
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
            </div>
          </div>

          {/* Preview URL Row */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Preview Branch Domain</span>
            </label>
            <div className="bg-muted px-3 py-2 rounded-lg border border-border flex items-center justify-between text-xs">
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-muted-foreground hover:text-slate-900 dark:hover:text-white truncate"
              >
                {previewUrl}
              </a>
              <span className="text-xs text-muted-foreground font-mono">Immutable</span>
            </div>
          </div>
        </div>

        {/* 3. Deployment Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left relative z-10">
          {/* GitHub Repository */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-border flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-slate-400 dark:text-slate-300" />
              Repository:
            </span>
            <span className="font-mono text-foreground font-semibold">{repository}</span>
          </div>

          {/* Deployment ID */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-border flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Folder className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Deployment ID:
            </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{deploymentId}</span>
          </div>

          {/* Commit Hash */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-border flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Commit Hash:
            </span>
            <span className="font-mono text-foreground font-semibold flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-muted-foreground" />
              {commitHash}
            </span>
          </div>

          {/* Deployment Duration */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-border flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Build Duration:
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{deploymentDuration}</span>
          </div>
        </div>

        {/* 4. Action Buttons Footer */}
        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => navigate('/dashboard/projects')}
            iconLeft={<Folder className="w-4 h-4" />}
            className="shadow-lg shadow-blue-500/20"
          >
            Open Project
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => navigate(`/dashboard/deployments/${deploymentId}`)}
            iconLeft={<ExternalLink className="w-4 h-4" />}
          >
            View Deployment
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleCopyUrl}
            iconLeft={copied ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied!' : 'Copy URL'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              if (onCreateAnother) {
                onCreateAnother();
              } else {
                navigate('/dashboard/projects/new');
              }
            }}
            iconLeft={<Plus className="w-4 h-4" />}
            className="text-muted-foreground hover:text-slate-900 dark:hover:text-white"
          >
            Create Another
          </Button>
        </div>
      </div>
    </div>
  );
}
