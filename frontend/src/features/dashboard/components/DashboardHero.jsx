import { useState, useEffect } from 'react';
import {
  Plus,
  GitBranch,
  ShieldCheck,
  Globe,
  Users,
  FolderGit2,
  RefreshCw,
  Clock,
  Calendar,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function DashboardHero() {
  const { user } = useAuth();
  const displayName = user?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Halimunnisa');

  // Live Local Time & Today's Date State
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  let greeting = 'Good Morning';
  if (hours >= 12 && hours < 17) {
    greeting = 'Good Afternoon';
  } else if (hours >= 17) {
    greeting = 'Good Evening';
  }

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });



  return (
    <div className="relative overflow-hidden rounded-[18px] bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 p-5 md:p-6 shadow-sm dark:shadow-xl backdrop-blur-xl transition-all duration-300 group hover:border-slate-300 dark:hover:border-white/10">
      {/* Light Mode: Very soft blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/60 via-blue-50/30 to-indigo-50/40 dark:opacity-0 pointer-events-none" />

      {/* Light Mode: Subtle mesh & dot pattern effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-30 dark:opacity-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f050_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f050_1px,transparent_1px)] [background-size:32px_32px] opacity-20 dark:opacity-0 pointer-events-none" />

      {/* Dark Mode: Radial gradient background */}
      <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900/90 to-slate-950 pointer-events-none" />

      {/* Dark Mode: Subtle grid pattern */}
      <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(to_right,#1e293b30_1px,transparent_1px),linear-gradient(to_bottom,#1e293b30_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      {/* Dark Mode: Soft purple glow radial ambient light */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-500/12 via-indigo-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-sky-500/10 via-purple-600/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        {/* Top Main Section: Left Header & Right Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          {/* Left Side: Greeting, Display Name, Date/Time, Subtitle & Compact Badges */}
          <div className="space-y-3 max-w-2xl">
            {/* Dynamic Time-based Greeting & Date/Time Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
                {greeting}
              </span>
              <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-mono">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white font-extrabold shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  {formattedTime}
                </span>
              </div>
            </div>

            {/* Welcome Heading with Display Name */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
              Welcome back,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-400">
                {displayName}
              </span> 👋
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-400 font-normal leading-relaxed">
              Monitor your projects, deployments and infrastructure from one place.
            </p>

            {/* Compact Workspace Metadata Badges */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-medium">
              <Badge variant="primary" className="flex items-center gap-1.5 px-3 py-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Pro Plan</span>
              </Badge>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors">
                <Globe className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                <span>Region: Singapore</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors">
                <Users className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Team Members: 5</span>
              </div>

            </div>
          </div>

          {/* Right Side: Action Buttons & Last Synced / Deployment Info */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Buttons Row */}
            <div className="flex items-center gap-3 flex-wrap">
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
                className="shadow-lg shadow-blue-500/20"
              >
                New Project
              </Button>
            </div>

            {/* Sync Metadata Details Below Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Last deployment: <span className="font-semibold text-slate-800 dark:text-slate-200">deployx-frontend</span> (2m ago)</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span>Synced 1 min ago</span>
              </div>
            </div>
          </div>

        </div>



      </div>
    </div>
  );
}

