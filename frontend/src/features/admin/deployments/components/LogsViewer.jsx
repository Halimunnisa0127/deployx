import { useRef, useEffect, useState } from "react";
import { Copy, Check, TerminalSquare } from "lucide-react";

export default function LogsViewer({ logs = "" }) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950 overflow-hidden relative group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <TerminalSquare className="w-4 h-4 text-slate-500" />
          Build Logs
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Copy Logs"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <div
        ref={containerRef}
        className="p-4 h-64 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300"
      >
        <pre className="whitespace-pre-wrap break-words">
          {logs || "Waiting for logs..."}
        </pre>
      </div>
    </div>
  );
}
