import { useState } from 'react';
import { useLogs } from '../hooks/useLogs';
import { LogsHeader } from '../components/LogsHeader';
import { LogsToolbar } from '../components/LogsToolbar';
import { LogsStatistics } from '../components/LogsStatistics';
import { LogsTable } from '../components/LogsTable';
import { LogsEmptyState } from '../components/LogsEmptyState';
import { LogsSkeleton } from '../components/LogsSkeleton';
import { LogViewer } from '../components/LogViewer';

export default function PlatformLogsPage() {
  const { loading, refreshing, fetchData, table } = useLogs();
  const [selectedLog, setSelectedLog] = useState(null);

  const handleExport = () => {
    alert('Exporting platform logs…');
  };

  const activeFilter = table.filters.state.level || 'all';

  const handleFilterChange = (level) => {
    table.filters.update('level', level);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <LogsHeader
        onRefresh={() => fetchData(true)}
        onExport={handleExport}
        isRefreshing={refreshing}
      />

      <LogsStatistics logs={table.tableData} />

      <LogsToolbar 
        filterState={activeFilter}
        onFilterChange={handleFilterChange}
        searchQuery={table.search.query}
        onSearchChange={table.search.setQuery}
      />

      {loading ? (
        <LogsSkeleton />
      ) : table.tableData.length === 0 ? (
        <LogsEmptyState onRefresh={() => fetchData(true)} />
      ) : (
        <LogsTable logs={table.tableData} onRowClick={setSelectedLog} />
      )}

      {selectedLog && (
        <div className="mt-6">
          <LogViewer log={selectedLog} onClose={() => setSelectedLog(null)} />
        </div>
      )}
    </div>
  );
}
