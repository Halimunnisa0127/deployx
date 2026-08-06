import { useState, useMemo } from 'react';
import {
  Search, History, Calendar,
  ArrowUpDown, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight,
  Inbox, RotateCcw,
  Wifi, HardDrive, Clock, Cpu,
  FileText, FileSpreadsheet
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Progress } from '../../../components/ui';

/* ─── resource icon map ─────────────────────────────────────── */
const RESOURCE_ICONS = {
  bandwidth:      Wifi,
  storage:        HardDrive,
  'build minutes':Clock,
  functions:      Cpu,
};

/* ─── status badge ──────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase();
  let cls, dot;
  if (s.includes('healthy') || s.includes('normal')) {
    cls = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    dot = 'bg-emerald-500';
  } else if (s.includes('warning')) {
    cls = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    dot = 'bg-amber-500';
  } else if (s.includes('limit') || s.includes('critical')) {
    cls = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    dot = 'bg-rose-500';
  } else {
    cls = 'bg-slate-500/10 text-muted-foreground border-slate-500/20';
    dot = 'bg-slate-400';
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm font-bold border ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
      {status}
    </span>
  );
}

/* ─── sort header cell ──────────────────────────────────────── */
function SortTh({ field, label, alignRight = false, sortField, sortOrder, onSort }) {
  const active = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      className={`py-2 px-3 text-sm font-extrabold uppercase tracking-wider
                  cursor-pointer select-none whitespace-nowrap transition-colors
                  ${alignRight ? 'text-right' : 'text-left'}
                  ${active
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-500/10'
                    : 'text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
    >
      <span className={`inline-flex items-center gap-1 ${alignRight ? 'flex-row-reverse' : ''}`}>
        {label}
        {active ? (
          sortOrder === 'asc'
            ? <ChevronUp   className="w-3 h-3 text-indigo-500 shrink-0" />
            : <ChevronDown className="w-3 h-3 text-indigo-500 shrink-0" />
        ) : (
          <ArrowUpDown className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
        )}
      </span>
    </th>
  );
}

/* ─── mini inline bar ───────────────────────────────────────── */
function MiniBar({ pct }) {
  const color = pct >= 85 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-indigo-500';
  return (
    <div className="w-10 hidden sm:block shrink-0">
      <Progress percent={pct} color={color} height="h-1" />
    </div>
  );
}

/* ─── main component ────────────────────────────────────────── */
export default function UsageHistoryTable({ history = [], isLoading = false, activeTab = 'all' }) {
  const [search,          setSearch]         = useState('');
  const [filterStatus,    setFilterStatus]    = useState('all');
  const [sortField,       setSortField]       = useState('date');
  const [sortOrder,       setSortOrder]       = useState('desc');
  const [currentPage,     setCurrentPage]     = useState(1);
  const [pageSize,        setPageSize]        = useState(10);     // 10 by default for compact rows
  const [selectedRow,     setSelectedRow]     = useState(null);

  /* filter */
  const filtered = useMemo(() => history.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      item.resource.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.used.toLowerCase().includes(q) ||
      item.remaining.toLowerCase().includes(q);

    const tabMap = {
      bandwidth: 'bandwidth',
      storage: 'storage',
      build_minutes: 'buildminutes',
      function_executions: 'functions'
    };
    const mappedTab = tabMap[activeTab] || 'all';

    const matchResource =
      mappedTab === 'all' ||
      item.resource.toLowerCase().replace(/\s+/g, '') === mappedTab;

    const matchStatus =
      filterStatus === 'all' ||
      item.status.toLowerCase().replace(/\s+/g, '') === filterStatus.toLowerCase().replace(/\s+/g, '');

    return matchSearch && matchResource && matchStatus;
  }), [history, search, activeTab, filterStatus]);

  /* sort */
  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (sortField === 'percentage') {
      av = Number(a.percentage) || 0;
      bv = Number(b.percentage) || 0;
    } else if (['used', 'remaining', 'limit'].includes(sortField)) {
      av = parseFloat(String(av).replace(/[^0-9.]/g, '')) || 0;
      bv = parseFloat(String(bv).replace(/[^0-9.]/g, '')) || 0;
    } else {
      av = String(av || '').toLowerCase();
      bv = String(bv || '').toLowerCase();
    }
    if (av < bv) return sortOrder === 'asc' ? -1 : 1;
    if (av > bv) return sortOrder === 'asc' ?  1 : -1;
    return 0;
  }), [filtered, sortField, sortOrder]);

  /* pagination */
  const totalItems    = sorted.length;
  const totalPages    = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage     = Math.min(currentPage, totalPages);
  const paginated     = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, validPage, pageSize]);

  /* handlers */
  const handleSort = (field) => {
    if (sortField === field) setSortOrder((o) => o === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const handleReset = () => {
    setSearch(''); setFilterStatus('all'); setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (!sorted.length) return;
    const headers = ['Date', 'Resource', 'Used', 'Remaining', 'Limit', 'Usage %', 'Status'];
    const csvRows = sorted.map(row => [
      row.date, row.resource, row.used, row.remaining, row.limit, row.percentage, row.status
    ].map(v => `"${v}"`).join(','));
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usage_history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (!sorted.length) return;
    let tableHtml = `<table><thead><tr><th>Date</th><th>Resource</th><th>Used</th><th>Remaining</th><th>Limit</th><th>Usage %</th><th>Status</th></tr></thead><tbody>`;
    sorted.forEach(row => {
      tableHtml += `<tr><td>${row.date}</td><td>${row.resource}</td><td>${row.used}</td><td>${row.remaining}</td><td>${row.limit}</td><td>${row.percentage}</td><td>${row.status}</td></tr>`;
    });
    tableHtml += `</tbody></table>`;
    
    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usage_history.xls';
    a.click();
    URL.revokeObjectURL(url);
  };

  const thProps = { sortField, sortOrder, onSort: handleSort };

  /* ── render ───────────────────────────────────────────────── */
  return (
    <Card
      style={{ maxWidth: '100%', padding: '14px 16px 16px' }}
      className="border border-border rounded-2xl
                 backdrop-blur-xl bg-card
                 shadow-sm transition-colors duration-300
                 hover:border-border/80 space-y-3"
    >
      {/* ── Header toolbar ──────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20
                          border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-foreground leading-none">
              Usage History
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Historical consumption records &amp; quota percentages
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Exports */}
          <div className="flex items-center gap-1.5 border-r border-border pr-2 mr-1">
            <button
              onClick={handleExportCSV}
              title="Export CSV"
              className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportExcel}
              title="Export Excel"
              className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full sm:w-44">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              iconLeft={<Search className="w-3.5 h-3.5 text-muted-foreground" />}
              size="sm"
              style={{ padding: '6px 12px', fontSize: '13px' }}
            />
          </div>



          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 rounded-lg bg-card
                       border border-border
                       text-sm font-semibold text-foreground
                       outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="normal">Normal / Healthy</option>
            <option value="warning">Warning</option>
            <option value="nearinglimit">Nearing Limit / Critical</option>
          </select>

          {(search || filterStatus !== 'all') && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset Filters"
              className="p-1.5 rounded-lg bg-muted
                         text-muted-foreground
                         hover:bg-muted
                         cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border
                      overflow-x-auto overflow-y-auto max-h-[520px] scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[680px] text-xs">

          {/* Sticky header */}
          <thead className="sticky top-0 z-10 bg-muted/90
                            backdrop-blur-md border-b border-border">
            <tr>
              <SortTh field="date"       label="Date"       {...thProps} />
              <SortTh field="resource"   label="Resource"   {...thProps} />
              <SortTh field="used"       label="Used"       {...thProps} />
              <SortTh field="remaining"  label="Remaining"  {...thProps} />
              <SortTh field="limit"      label="Limit"      {...thProps} />
              <SortTh field="percentage" label="Usage"      {...thProps} />
              <SortTh field="status"     label="Status"     alignRight {...thProps} />
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading ? (
              /* Skeleton */
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[24, 28, 16, 16, 16, 20, 20].map((w, j) => (
                    <td key={j} className="py-2 px-3">
                      <div
                        className="h-3 bg-muted rounded"
                        style={{ width: `${w * 4}px`, marginLeft: j === 6 ? 'auto' : 0 }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              /* Empty */
              <tr>
                <td colSpan="7" className="py-8 text-center">
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="p-3 rounded-full bg-muted
                                    border border-border
                                    text-muted-foreground">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        No matching records
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Adjust your filters or clear the search.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleReset}
                            iconLeft={<RotateCcw className="w-3 h-3" />}>
                      Reset Filters
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              /* Data rows */
              paginated.map((row) => {
                const iconKey      = row.resource.toLowerCase();
                const ResourceIcon = RESOURCE_ICONS[iconKey] || Wifi;
                const isSelected   = selectedRow === row.id;

                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRow(isSelected ? null : row.id)}
                    className={`group cursor-pointer transition-all duration-100 border-l-2
                      ${isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-500/10 border-l-indigo-500'
                        : 'border-l-transparent hover:bg-muted/50 hover:border-l-indigo-300 dark:hover:border-l-indigo-600'
                      }`}
                  >
                    {/* Date */}
                    <td className="py-2 px-3 font-mono text-muted-foreground
                                   font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-indigo-400 shrink-0" />
                        {row.date}
                      </span>
                    </td>

                    {/* Resource */}
                    <td className="py-2 px-3 font-semibold text-foreground
                                   whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="p-0.5 rounded bg-muted
                                        border border-border shrink-0">
                          <ResourceIcon className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <span>{row.resource}</span>
                      </div>
                    </td>

                    {/* Used */}
                    <td className="py-2 px-3 font-mono font-bold text-foreground whitespace-nowrap">
                      {row.used}
                    </td>

                    {/* Remaining */}
                    <td className="py-2 px-3 font-mono text-muted-foreground
                                   whitespace-nowrap">
                      {row.remaining}
                    </td>

                    {/* Limit */}
                    <td className="py-2 px-3 font-mono text-muted-foreground
                                   whitespace-nowrap">
                      {row.limit}
                    </td>

                    {/* Usage % + mini bar */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold w-9 text-right shrink-0 ${
                          row.percentage >= 85
                            ? 'text-rose-600 dark:text-rose-400'
                            : row.percentage >= 70
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-foreground'
                        }`}>
                          {row.percentage}%
                        </span>
                        <MiniBar pct={row.percentage} />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ────────────────────────────────── */}
      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2
                        pt-1 text-sm font-semibold text-muted-foreground
                        border-t border-border">

          <span>
            Showing{' '}
            <strong className="text-foreground">
              {(validPage - 1) * pageSize + 1}
            </strong>{' '}
            –{' '}
            <strong className="text-foreground">
              {Math.min(validPage * pageSize, totalItems)}
            </strong>{' '}
            of{' '}
            <strong className="text-foreground">{totalItems}</strong>
          </span>

          <div className="flex items-center gap-2.5">
            {/* Rows per page */}
            <div className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-1.5 py-0.5 rounded-md bg-muted
                           border border-border
                           text-sm font-bold text-foreground
                           outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page nav */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validPage === 1}
                className="p-1 rounded-md border border-border
                           bg-card
                           hover:bg-muted
                           text-muted-foreground
                           disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer
                           transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 font-mono font-bold text-foreground">
                {validPage}/{totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validPage === totalPages}
                className="p-1 rounded-md border border-border
                           bg-card
                           hover:bg-muted
                           text-muted-foreground
                           disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer
                           transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
