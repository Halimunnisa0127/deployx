import { useState, useRef, useEffect } from "react";
import { Layers, RefreshCw, Calendar, ChevronDown, Check } from "lucide-react";

const TIME_RANGES = [
  { id: "24h", label: "Last 24 Hours" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "all", label: "All Time" },
];

export default function DashboardHeader({ dateRange = "7d", setDateRange, refreshData, refreshing }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedItem = TIME_RANGES.find((r) => r.id === dateRange) || TIME_RANGES[1];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-sm text-theme-secondary mt-1.5 leading-relaxed">
          Monitor platform metrics, user accounts, projects, and active deployments from one centralized console.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Sleek Custom Time Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 h-9 px-3 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span>{selectedItem.label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-1 space-y-0.5">
                {TIME_RANGES.map((range) => {
                  const isSelected = dateRange === range.id;
                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => {
                        setDateRange?.(range.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                          : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-foreground"
                      }`}
                    >
                      <span>{range.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={refreshData}
          disabled={refreshing}
          title="Refresh Data"
          className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-sm disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`} />
        </button>
      </div>
    </div>
  );
}

