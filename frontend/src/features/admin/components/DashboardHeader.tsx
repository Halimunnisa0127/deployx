import React from 'react';
import { Layers, Activity, Bell, User as UserIcon, Search } from 'lucide-react';
import { mockDeployments } from '../../deployments/data/mockDeployments';

export default function DashboardHeader({ stats }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span className="hover:text-slate-300 cursor-pointer transition-colors">Home</span>
          <span>&gt;</span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">Admin</span>
          <span>&gt;</span>
          <span className="text-slate-200">Dashboard</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          Monitor users, projects, deployments and overall platform health from one centralized dashboard.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
        </button>
        <button className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <UserIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
