import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/common/SearchBar';
import RepositoryCard from '../components/RepositoryCard';
import RepositoryCardSkeleton from '../components/RepositoryCardSkeleton';
import GithubEmptyState from '../components/GithubEmptyState';
import { mockRepositories } from '../data/mockGithub';
import { Plus, BookOpen, RefreshCw } from 'lucide-react';
import GithubIcon from '../../../components/ui/GithubIcon';
import Button from '../../../components/ui/Button';

export default function Github() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Filter repos by search query
  const filteredRepos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockRepositories.filter((repo) => {
      if (query) {
        return repo.name.toLowerCase().includes(query) || repo.owner.toLowerCase().includes(query);
      }
      return true;
    });
  }, [searchQuery]);

  const handleCardClick = (repo) => {
    navigate(`/dashboard/github/${repo.id}`);
  };

  const handleAction = (action, repo) => {
    if (action === 'open') {
      window.open(repo.url, '_blank', 'noopener,noreferrer');
    } else if (action === 'sync') {
      setNotification({
        type: 'success',
        message: `Syncing repository ${repo.owner}/${repo.name}...`,
      });
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification({
        type: 'info',
        message: `Opened options for ${repo.name}`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const hasActiveFilter = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      {/* Toast notification feedback */}
      {notification && (
        <div className="p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 bg-emerald-950/80 border-emerald-500/40 text-emerald-300 fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${notification.type === 'success' ? 'animate-spin' : ''}`} />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="hover:underline text-xs ml-4">Dismiss</button>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <GithubIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              GitHub Integration
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Manage connected repositories and monitor GitHub activity across every project.
          </p>
        </div>

        {/* Top Active Summary Badge & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Connected Repositories: <strong className="text-slate-900 dark:text-white font-semibold">{mockRepositories.length}</strong></span>
          </div>
          
          <Button
            variant="primary"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => console.log('Connect Repository')}
          >
            Connect
          </Button>
        </div>
      </div>

      {/* 2. Controls Bar: Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
          {/* SearchBar Component */}
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search repositories..."
            shortcut="⌘K"
            size="md"
            className="w-full sm:w-80 shrink-0"
          />
        </div>
      </div>

      {/* 3. Main Repositories List / Loading / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RepositoryCardSkeleton />
          <RepositoryCardSkeleton />
          <RepositoryCardSkeleton />
        </div>
      ) : filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onClick={handleCardClick}
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <GithubEmptyState
          hasFilter={hasActiveFilter}
          onResetFilter={() => setSearchQuery('')}
          onConnect={() => console.log('Connect Repository')}
        />
      )}
    </div>
  );
}
