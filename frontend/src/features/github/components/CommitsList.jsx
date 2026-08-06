import { GitCommit } from 'lucide-react';

export default function CommitsList({ commits }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {commits.map((commit, index) => (
        <div key={commit.id} className="relative flex items-start gap-4 p-4 rounded-xl hover:bg-muted transition-colors group">
          {/* Vertical Timeline Line */}
          {index !== commits.length - 1 && (
            <div className="absolute left-8 top-12 bottom-0 w-px bg-border group-hover:bg-indigo-500/30 transition-colors" />
          )}

          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-muted shrink-0">
              <img src={commit.authorAvatar} alt={commit.author} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                  {commit.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">{commit.author}</span>
                  <span className="text-muted-foreground text-xs">&bull;</span>
                  <span className="text-xs text-muted-foreground">{formatDate(commit.timestamp)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md shrink-0 border border-indigo-500/20">
                <GitCommit className="w-3 h-3 text-indigo-500" />
                {commit.shortHash}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
