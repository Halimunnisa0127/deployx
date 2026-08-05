import React from 'react';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'success', label: 'Success' },
  { id: 'building', label: 'Building' },
  { id: 'failed', label: 'Failed' },
  { id: 'queued', label: 'Queued' },
];

export default function StatusFilterTabs({ activeTab, onTabChange, counts = {} }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-border">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${
                isActive
                  ? 'bg-white/20 text-white font-bold'
                  : 'bg-muted text-muted-foreground border border-border/50'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
