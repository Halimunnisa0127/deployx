import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockRepositories, mockBranches, mockCommits } from '../data/mockGithub';
import Button from '../../../components/ui/Button';
import { ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle, RefreshCw, GitBranch, Clock, GitCommit } from 'lucide-react';
import Github from '../../../components/ui/GithubIcon';
import Badge from '../../../components/ui/Badge';
import BranchesTable from '../components/BranchesTable';
import CommitsList from '../components/CommitsList';

export default function RepositoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  // Find target repo from mock dataset
  const repo = useMemo(() => {
    return mockRepositories.find((r) => r.id === id) || mockRepositories[0];
  }, [id]);

  const branches = useMemo(() => mockBranches.filter(b => b.repoId === repo.id), [repo.id]);
  const commits = useMemo(() => mockCommits.filter(c => c.repoId === repo.id), [repo.id]);

  const handleRefresh = () => {
    setNotification({
      type: 'success',
      message: `Syncing repository ${repo.name}...`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeploy = (branch) => {
    setNotification({
      type: 'success',
      message: `Triggered deployment for branch: ${branch.name}`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  if (!repo) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <div className="text-lg font-bold text-white">Repository Not Found</div>
        <p className="text-sm text-slate-400">The requested repository ID "{id}" does not exist.</p>
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/github')}
        >
          Back to GitHub Integration
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 text-left font-sans animate-in fade-in duration-300">
      {/* Action Notification Toast */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/90 border-amber-500/40 text-amber-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800/60">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={() => navigate('/dashboard/github')}
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 text-slate-300 shadow-inner">
                <Github className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{repo.name}</h1>
              <Badge variant={repo.status === 'connected' ? 'success' : 'warning'}>
                {repo.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 ml-11">
              Owned by <strong className="text-slate-300">{repo.owner}</strong> • {repo.visibility} • {repo.language}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" iconLeft={<RefreshCw className="w-4 h-4" />} onClick={handleRefresh}>
            Sync Repository
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.open(repo.url, '_blank')}>
            Open in GitHub
          </Button>
        </div>
      </div>

      {/* 2. Branches Table Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/70 bg-slate-800/30 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" /> Repository Branches
            </h3>
            <p className="text-xs text-slate-400 mt-1">Manage and deploy specific branches.</p>
          </div>
        </div>
        
        <div className="p-0">
          <BranchesTable branches={branches} onDeploy={handleDeploy} />
        </div>
      </div>

      {/* 3. Recent Commits Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/70 bg-slate-800/30">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-indigo-400" /> Recent Commits
          </h3>
          <p className="text-xs text-slate-400 mt-1">Timeline of the latest code changes pushed to this repository.</p>
        </div>
        
        <div className="p-4">
          <CommitsList commits={commits} />
        </div>
      </div>

    </div>
  );
}
