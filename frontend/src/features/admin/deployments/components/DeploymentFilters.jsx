
const TABS = [
  { id: "all", label: "All Deployments" },
  { id: "running", label: "Running" },
  { id: "queued", label: "Queued" },
  { id: "success", label: "Success" },
  { id: "failed", label: "Failed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function DeploymentFilters({
  activeFilter,
  onFilterChange,
  counts = {},
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-border">
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
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isActive
                  ? "bg-white/20 text-white font-bold"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
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
