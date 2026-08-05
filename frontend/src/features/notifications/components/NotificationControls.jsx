import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import { FILTER_TABS } from '../utils/constants';

export default function NotificationControls({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-border backdrop-blur-lg">
      {/* Reusable Search Bar */}
      <SearchBar
        placeholder="Search notifications..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
        className="w-full md:w-80"
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-white/60 dark:bg-slate-900/60 text-muted-foreground hover:text-slate-900 dark:hover:text-slate-200 border border-border hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
