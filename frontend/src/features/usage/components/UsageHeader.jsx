import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Calendar,
  ChevronDown,
  Check,
  RefreshCw,
  Clock,
  X,
  FileText,
  FileSpreadsheet,
  FileDown,
  Filter,
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function UsageHeader({
  dateRange = 'this_month',
  setDateRange,
  onExport,
  isExporting = false,
  onRefresh,
  isRefreshing = false,
  lastUpdated = 'Updated 2 mins ago',
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2026-07-01');
  const [customEndDate, setCustomEndDate] = useState('2026-07-29');

  const DATE_OPTIONS = [
    { id: 'today', label: 'Today' },
    { id: 'last_7_days', label: 'Last 7 Days' },
    { id: 'last_30_days', label: 'Last 30 Days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: 'custom_range', label: 'Custom Range' },
  ];

  const EXPORT_OPTIONS = [
    { id: 'csv', label: 'CSV Format', icon: FileText, desc: 'Comma-separated values (.csv)' },
    { id: 'excel', label: 'Excel Spreadsheet', icon: FileSpreadsheet, desc: 'Microsoft Excel format (.xls)' },
    { id: 'pdf', label: 'PDF Document', icon: FileDown, desc: 'Printable usage report (.pdf/.txt)' },
  ];

  const currentOption = DATE_OPTIONS.find((opt) => opt.id === dateRange);
  const currentLabel = currentOption ? currentOption.label : 'This Month';

  const activeFilterBadgeText =
    dateRange === 'custom_range' && customStartDate && customEndDate
      ? `${customStartDate} → ${customEndDate}`
      : currentLabel;

  const handleSelectOption = (optId) => {
    if (optId === 'custom_range') {
      setIsCustomModalOpen(true);
    }
    if (setDateRange) {
      setDateRange(optId);
    }
    setIsDropdownOpen(false);
  };

  const handleApplyCustomRange = (e) => {
    e.preventDefault();
    if (setDateRange) {
      setDateRange('custom_range');
    }
    setIsCustomModalOpen(false);
  };

  const handleSelectExport = async (format) => {
    setIsExportDropdownOpen(false);
    if (onExport) {
      await onExport(format);
    }
  };

  return (
    <div className="relative pb-6 border-b border-border space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        {/* Left: Title, Subtitle & Active Filter Badge */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Usage
            </h1>

            {/* Active Filter Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 shadow-xs">
              <Filter className="w-3 h-3 text-indigo-500" />
              <span>Filter: {activeFilterBadgeText}</span>
            </span>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed">
            Monitor infrastructure resource consumption, monthly quotas, and historical trends.
          </p>
        </div>

        {/* Right: Controls (Last Updated, Refresh, Date Range Dropdown, Export Dropdown) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Last Updated Status Display */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-muted-foreground shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{lastUpdated}</span>
          </div>

          {/* Refresh Button */}
          <Button
            variant="secondary"
            size="md"
            iconOnly={true}
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh usage data"
            aria-label="Refresh usage data"
            className="shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-foreground ${isRefreshing ? 'animate-spin text-indigo-500 dark:text-indigo-400' : ''}`} />
          </Button>

          {/* Date Range Dropdown with Framer Motion Animation */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsExportDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-card backdrop-blur-md border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted shadow-sm hover:shadow transition-all cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/70"
            >
              <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>
                {dateRange === 'custom_range' && customStartDate && customEndDate
                  ? `${customStartDate} to ${customEndDate}`
                  : currentLabel}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 z-30 py-1.5 rounded-xl bg-card border border-border shadow-2xl backdrop-blur-md"
                  >
                    {DATE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          dateRange === opt.id
                            ? 'bg-muted text-indigo-600 dark:text-indigo-400'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {dateRange === opt.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Export Report Dropdown with CSV, Excel, PDF & Framer Motion Animation */}
          <div className="relative">
            <Button
              variant="secondary"
              size="md"
              isLoading={isExporting}
              onClick={() => {
                setIsExportDropdownOpen(!isExportDropdownOpen);
                setIsDropdownOpen(false);
              }}
              iconLeft={<Download className="w-4 h-4 text-muted-foreground" />}
              iconRight={<ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />}
            >
              Export Report
            </Button>

            <AnimatePresence>
              {isExportDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsExportDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 z-30 p-1.5 rounded-xl bg-card border border-border shadow-2xl backdrop-blur-md space-y-1"
                  >
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Choose Export Format
                    </div>
                    {EXPORT_OPTIONS.map((exp) => {
                      const ExpIcon = exp.icon;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => handleSelectExport(exp.id)}
                          className="w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-colors hover:bg-muted cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                            <ExpIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {exp.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {exp.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Custom Range Selector Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Custom Date Range</h3>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleApplyCustomRange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCustomModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Apply Range
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

