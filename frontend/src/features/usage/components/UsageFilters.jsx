import { Search, Filter } from 'lucide-react';
import Input from '../../../components/ui/Input';

export default function UsageFilters({
  searchQuery = '',
  setSearchQuery,
  filterCategory = 'all',
  setFilterCategory,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-sm">
      <div className="w-full sm:w-72">
        <Input
          type="text"
          placeholder="Filter usage by resource..."
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          iconLeft={<Search className="w-4 h-4 text-slate-400" />}
          size="sm"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory && setFilterCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all">All Quota Categories</option>
          <option value="bandwidth">Bandwidth</option>
          <option value="storage">Storage</option>
          <option value="build_minutes">Build Minutes</option>
          <option value="function_executions">Function Executions</option>
        </select>
      </div>
    </div>
  );
}
