import React from "react";
import { Layers, Bell, User as UserIcon, Search } from "lucide-react";

export default function DashboardHeader({ stats, dateRange, setDateRange, refreshData, refreshing }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-theme-muted mb-4">
          <span className="hover:text-theme-body cursor-pointer transition-colors">
            Home
          </span>
          <span>&gt;</span>
          <span className="hover:text-theme-body cursor-pointer transition-colors">
            Admin
          </span>
          <span>&gt;</span>
          <span className="text-theme-body font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-sm text-theme-secondary mt-1.5 leading-relaxed">
          Monitor users, projects, deployments and overall platform health from
          one centralized dashboard.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={dateRange || '7d'}
          onChange={(e) => setDateRange && setDateRange(e.target.value)}
          className="bg-card border border-border text-sm rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
        <button 
          onClick={refreshData}
          disabled={refreshing}
          className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={refreshing ? "animate-spin" : ""}
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21v-5h5" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative shadow-sm">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
        </button>
        <button className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <UserIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

