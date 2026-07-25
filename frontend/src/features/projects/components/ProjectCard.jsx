import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

/** Maps project status string to Badge variant */
const STATUS_VARIANT = {
  live: 'success',
  building: 'warning',
  failed: 'danger',
  'not deployed': 'neutral',
};

function formatDate(iso) {
  if (!iso) return 'Never';
  const date = new Date(iso);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProjectCard({
  id,
  name,
  status = 'not deployed',
  lastDeployed,
  framework = 'React',
  branch = 'main',
  url,
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const badgeVariant = STATUS_VARIANT[status] ?? 'neutral';

  const defaultUrl = url || `${name.toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

  const handleCardClick = () => {
    if (id) {
      navigate(`/dashboard/projects/${id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col gap-3.5 p-5 max-w-full cursor-pointer transition-all duration-200 ease-out border rounded-xl ${isHovered ? 'bg-indigo-50 dark:bg-slate-900/75 border-indigo-200 dark:border-indigo-500/40 shadow-md dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.6),0_0_20px_0_rgba(99,102,241,0.12)] -translate-y-0.5' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_4px_12px_0_rgba(0,0,0,0.3)] translate-y-0'}`}
    >
      {/* Top row: name + status badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Framework icon badge */}
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0 transition-colors">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 font-inter transition-colors">{framework[0]}</span>
          </div>
          <span className="font-inter font-semibold text-[15px] text-slate-900 dark:text-slate-50 truncate transition-colors" title={name}>
            {name}
          </span>
        </div>

        <Badge variant={badgeVariant}>
          {status}
        </Badge>
      </div>

      {/* URL / Subtitle */}
      <div className="flex items-center">
        <a
          href={`https://${defaultUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[13px] text-slate-500 dark:text-slate-400 no-underline font-inter truncate transition-colors hover:text-slate-800 dark:hover:text-slate-200"
          title={`https://${defaultUrl}`}
        >
          {defaultUrl}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Footer info: branch + last deployed */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5 transition-colors">
        <div className="inline-flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono transition-colors">{branch}</span>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-inter transition-colors">
          {formatDate(lastDeployed)}
        </span>
      </div>
    </Card>
  );
}

