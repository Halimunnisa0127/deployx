import { Plus } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import Button from '../../../components/ui/Button';

export default function DashboardHero() {
  const { user } = useAuth();
  const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'Developer');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800/80 p-6 md:p-8 shadow-xl">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{userName}</span> 👋
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-normal leading-relaxed">
            Monitor your projects, deployments, and infrastructure from one place.
          </p>
        </div>

        <div className="flex-shrink-0">
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
