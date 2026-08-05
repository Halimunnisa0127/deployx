import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/common/SearchBar';
import StatusFilterTabs from '../components/StatusFilterTabs';
import DomainCard from '../components/DomainCard';
import DomainCardSkeleton from '../components/DomainCardSkeleton';
import DomainsEmptyState from '../components/DomainsEmptyState';
import AddDomainModal from '../components/AddDomainModal';
import { Globe, Plus, Link as LinkIcon, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useDomains } from '../hooks/useDomains';

export default function Domains() {
  const navigate = useNavigate();
  const {
    domains: filteredDomains,
    totalDomains,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading,
    notification,
    setNotification,
    isModalOpen,
    setIsModalOpen,
    statusCounts,
    handleResetFilters,
    handleOpenDomain
  } = useDomains();

  const handleCardClick = (domain) => {
    navigate(`/dashboard/domains/${domain.id}`);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Domains
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Manage every custom domain across your projects in real time.
          </p>
        </div>

        {/* Top Active Summary Badge & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-medium text-foreground flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Total Domains: <strong className="text-foreground font-semibold">{totalDomains}</strong></span>
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
