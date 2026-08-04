import { useState } from 'react';
import { Terminal, Search, Copy, Check, Filter, RefreshCw, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import Button from '../../../components/ui/Button';

const MOCK_PROJECT_LOGS = [
  { id: 1, timestamp: '18:48:12', level: 'info', type: 'system', message: 'DeployX Edge Runtime container initialized for us-east-1.' },
  { id: 2, timestamp: '18:48:15', level: 'info', type: 'build', message: 'Git clone completed successfully for commit #8f7a9c2.' },
  { id: 3, timestamp: '18:48:19', level: 'info', type: 'build', message: 'Installing node_modules via npm (cached)... 482 packages added.' },
  { id: 4, timestamp: '18:48:24', level: 'info', type: 'build', message: 'vite v5.2.0 building for production... dist/ index.html generated.' },
  { id: 5, timestamp: '18:48:29', level: 'info', type: 'system', message: 'Static bundle uploaded to 120+ POP edge cache nodes.' },
  { id: 6, timestamp: '18:48:32', level: 'info', type: 'system', message: 'SSL Certificate provisioned via Let\'s Encrypt for https://my-awesome-app.deployx.app.' },
  { id: 7, timestamp: '18:48:35', level: 'success', type: 'system', message: '🎉 Deployment live on production edge network.' },
  { id: 8, timestamp: '18:50:01', level: 'info', type: 'runtime', message: 'GET / 200 OK - 142ms - Edge POP: sfo1' },
  { id: 9, timestamp: '18:50:04', level: 'info', type: 'runtime', message: 'GET /assets/index-D7s8a9f.js 200 OK - 12ms - Cache status: HIT' },
  { id: 10, timestamp: '18:51:10', level: 'warn', type: 'runtime', message: 'API request latency spike detected: 320ms on POST /api/v1/telemetry' },
  { id: 11, timestamp: '18:52:45', level: 'info', type: 'runtime', message: 'GET /dashboard 200 OK - 45ms - Edge POP: iad1' },
];

export default function ProjectLogsTab({ project, onAction }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all'); // 'all' | 'info' | 'warn' | 'error'
  const [copied, setCopied] = useState(false);

  const filteredLogs = MOCK_PROJECT_LOGS.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || log.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCopyLogs = () => {
    const logText = filteredLogs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.type}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project logs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/80 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 transition-colors"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800 text-xs">
            {['all', 'info', 'warn', 'error'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFilterLevel(level)}
                className={`px-2.5 py-1 rounded-lg capitalize text-xs font-semibold transition-all ${
                  filterLevel === level
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopyLogs}
            iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Real-time Logs Terminal Panel */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl font-mono text-xs">
        {/* Log Viewer Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-slate-200 font-semibold text-xs">Runtime & Build Logs</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Live Stream
            </span>
          </div>
          <span className="text-sm text-slate-500">{filteredLogs.length} events logged</span>
        </div>

        {/* Log Lines Content */}
        <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">No logs match your filter criteria.</div>
          ) : (
            filteredLogs.map((log) => {
              let badgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
              if (log.level === 'warn') badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              if (log.level === 'error') badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
              if (log.level === 'success') badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              return (
                <div key={log.id} className="flex items-start gap-3 p-1.5 rounded hover:bg-slate-900/50 transition-colors">
                  <span className="text-slate-600 text-sm flex-shrink-0 pt-0.5">[{log.timestamp}]</span>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold border flex-shrink-0 ${badgeStyle}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-500 text-xs font-semibold flex-shrink-0">[{log.type}]</span>
                  <span className="text-slate-200 break-all">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
