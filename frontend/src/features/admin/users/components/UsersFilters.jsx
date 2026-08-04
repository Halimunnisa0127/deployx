import React from "react";

const TABS = [
  { id: "all", label: "All Users" },
  { id: "active", label: "Active" },
  { id: "suspended", label: "Suspended" },
  { id: "admin", label: "Admin" },
  { id: "developer", label: "Developer" },
  { id: "viewer", label: "Viewer" },
];

export default function UsersFilters({
  activeFilter,
  onFilterChange,
  counts = {},
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800/60">
      {TABS.map((tab) => {
        const isActive = activeFilter === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm font-semibold"
                : "text-theme-muted hover:text-theme-heading hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isActive
                  ? "bg-white/20 text-white font-bold"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
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
