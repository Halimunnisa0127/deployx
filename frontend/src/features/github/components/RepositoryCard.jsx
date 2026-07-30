import React from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { RefreshCw, GitBranch, Shield, Clock, Code, ExternalLink, MoreVertical, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import Github from '../../../components/ui/GithubIcon';

export default function RepositoryCard({ repo, onClick, onAction }) {
  const getStatusBadge = () => {
    switch (repo.status) {
      case 'connected': return <Badge variant="success">Connected</Badge>;
      case 'syncing': return <Badge variant="warning" pulse>Syncing</Badge>;
      case 'error': return <Badge variant="danger">Error</Badge>;
      default: return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  const getLanguageColor = (lang) => {
    switch(lang.toLowerCase()) {
      case 'typescript': return 'text-blue-400';
      case 'javascript': return 'text-yellow-400';
      case 'python': return 'text-emerald-400';
      case 'go': return 'text-cyan-400';
      case 'react': return 'text-sky-400';
      default: return 'text-slate-400';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      onClick={() => onClick(repo)}
      className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 hover:bg-slate-800/40 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg shadow-transparent hover:shadow-indigo-500/5"
    >
      {/* Top Row: Icon, Title, Status */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800/70">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 group-hover:scale-105 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all duration-300 shadow-inner">
            <Github className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors truncate max-w-[200px] sm:max-w-xs">
                {repo.name}
              </h3>
              <Badge variant="neutral" className="capitalize px-1.5 py-0 text-xs bg-slate-800/50">
                {repo.visibility}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              <span>{repo.owner}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Middle Row: Branch, Sync */}
      <div className="py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Default Branch</span>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span className="font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded-md text-xs">{repo.defaultBranch}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Last Sync</span>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
            <Clock className="w-4 h-4 text-slate-400" />
            {formatDate(repo.lastSync)}
          </div>
        </div>
      </div>

      {/* Bottom Row: Language & Actions */}
      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-800/50 mt-1">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Code className={`w-3.5 h-3.5 ${getLanguageColor(repo.language)}`} />
          <span>{repo.language}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => onAction('sync', repo)} iconLeft={<RefreshCw className="w-3.5 h-3.5" />}>
            Sync
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction('open', repo)} iconOnly title="Open Repository">
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction('options', repo)} iconOnly title="Options">
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
