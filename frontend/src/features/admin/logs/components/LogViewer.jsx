
export function LogViewer({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="p-4 bg-muted border border-border rounded-xl text-foreground font-mono text-sm overflow-x-auto relative">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        ✕
      </button>
      <pre>{JSON.stringify(log, null, 2)}</pre>
    </div>
  );
}
