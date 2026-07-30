import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/common/SearchBar';
import StatusFilterTabs from '../components/StatusFilterTabs';
import DomainCard from '../components/DomainCard';
import DomainCardSkeleton from '../components/DomainCardSkeleton';
import DomainsEmptyState from '../components/DomainsEmptyState';
import AddDomainModal from '../components/AddDomainModal';
import { mockDomains } from '../data/mockDomains';
import { Globe, Plus, Link as LinkIcon, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function Domains() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute status counts for filter tabs
  const statusCounts = useMemo(() => {
    const counts = {
      all: mockDomains.length,
      verified: 0,
      pending: 0,
      failed: 0,
      production: 0,
      preview: 0,
    };

    mockDomains.forEach((domain) => {
      if (counts[domain.status] !== undefined) {
        counts[domain.status] += 1;
      }
      if (domain.environment.toLowerCase() === 'production') {
        counts.production += 1;
      }
      if (domain.environment.toLowerCase() === 'preview') {
        counts.preview += 1;
      }
    });

    return counts;
  }, []);

  // Filter domains by search query & status tab
  const filteredDomains = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockDomains.filter((domain) => {
      // Status filter
      if (activeTab !== 'all') {
        if (activeTab === 'production' || activeTab === 'preview') {
          if (domain.environment.toLowerCase() !== activeTab) return false;
        } else {
          if (domain.status !== activeTab) return false;
        }
      }

      // Search filter
      if (query) {
        const matchName = domain.name.toLowerCase().includes(query);
        const matchProject = domain.projectName.toLowerCase().includes(query);
        const matchEnvironment = domain.environment.toLowerCase().includes(query);

        return matchName || matchProject || matchEnvironment;
      }

      return true;
    });
  }, [searchQuery, activeTab]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
  };

  const handleCardClick = (domain) => {
    navigate(`/dashboard/domains/${domain.id}`);
  };

  const handleOpenDomain = (domain) => {
    setNotification({
      type: 'success',
      message: `Opening ${domain.name} in a new tab...`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const hasActiveFilter = searchQuery.trim().length > 0 || activeTab !== 'all';

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      {/* Toast notification feedback */}
      {notification && (
        <div className="p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 bg-emerald-950/80 border-emerald-500/40 text-emerald-300">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="hover:underline text-xs">Dismiss</button>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Domains
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Manage every custom domain across your projects in real time.
          </p>
        </div>

        {/* Top Active Summary Badge & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Total Domains: <strong className="text-slate-900 dark:text-white font-semibold">{mockDomains.length}</strong></span>
          </div>
          
          <Button
            variant="primary"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Domain
          </Button>
        </div>
      </div>

      {/* 2. Controls Bar: Search & Status Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <StatusFilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={statusCounts}
          />

          {/* SearchBar Component */}
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search domains..."
            shortcut="⌘K"
            size="md"
            className="w-full sm:w-72 shrink-0"
          />
        </div>
      </div>

      {/* 3. Main Domains List / Loading / Empty State */}
      {isLoading ? (
        <div className="space-y-4">
          <DomainCardSkeleton />
          <DomainCardSkeleton />
          <DomainCardSkeleton />
        </div>
      ) : filteredDomains.length > 0 ? (
        <div className="space-y-4">
          {filteredDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              onClick={handleCardClick}
              onOpenDomain={handleOpenDomain}
            />
          ))}
        </div>
      ) : (
        <DomainsEmptyState
          hasFilter={hasActiveFilter}
          onResetFilter={handleResetFilters}
          onAddDomain={() => setIsModalOpen(true)}
        />
      )}

      <AddDomainModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
