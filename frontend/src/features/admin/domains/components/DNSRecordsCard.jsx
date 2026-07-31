import React, { useState } from "react";
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
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <Server className="w-4 h-4 text-indigo-400" /> DNS Records
      </h3>
      <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/50 border-b border-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Value</th>
              <th className="px-4 py-2 font-medium text-right">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {records.map((rec, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-indigo-400">
                  {rec.type}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-300">
                  {rec.name}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs text-slate-400 truncate max-w-[150px] sm:max-w-[200px]"
                  title={rec.value}
                >
                  {rec.value}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleCopy(rec.value, idx)}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
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
