import { Plus, GitBranch, ShieldCheck, Globe, Users } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function DashboardHero() {
  const { user } = useAuth();
  const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'Developer');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800/80 p-6 md:p-8 shadow-xl">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{userName}</span> 👋
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-400 font-normal leading-relaxed">
            Monitor your projects, deployments, and infrastructure from one place.
          </p>

          {/* SaaS Workspace Metadata Pill Indicators */}
          <div className="flex items-center gap-3 pt-1 flex-wrap text-xs text-slate-300">
            <Badge variant="primary" className="flex items-center gap-1.5 px-3 py-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pro Plan</span>
            </Badge>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 font-medium">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Region: Singapore</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 font-medium">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Team Members: 5</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            to="/dashboard/projects/import"
            iconLeft={<GitBranch className="w-4 h-4" />}
          >
            Import Repository
          </Button>

          <Button
            variant="primary"
            size="md"
            to="/dashboard/projects/new"
            iconLeft={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-indigo-500/20"
          >
            New Project
          </Button>
        </div>
      </div>
    </div>
  );
}

