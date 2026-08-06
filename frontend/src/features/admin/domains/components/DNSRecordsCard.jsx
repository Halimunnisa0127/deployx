import { useState } from "react";
import { Copy, Check, Server } from "lucide-react";

export default function DNSRecordsCard({ records = [] }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (value, idx) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!records.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Server className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> DNS Records
      </h3>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Value</th>
              <th className="px-4 py-2 font-medium text-right">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((rec, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                  {rec.type}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">
                  {rec.name}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]"
                  title={rec.value}
                >
                  {rec.value}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleCopy(rec.value, idx)}
                    className="p-1 rounded text-theme-muted hover:text-theme-heading hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
