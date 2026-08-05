import { useState, useEffect, useMemo, useCallback } from 'react';
import { domainsApi } from '../api/domainsApi';
import { domainsService } from '../services/domainsService';

export function useDomains() {
  const [domains, setDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDomains = async () => {
      try {
        setIsLoading(true);
        const data = await domainsApi.getDomains();
        if (mounted) setDomains(data);
      } catch (err) {
        console.error("Failed to fetch domains", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchDomains();
    return () => { mounted = false; };
  }, []);

  const statusCounts = useMemo(() => {
    return domainsService.getDomainCounts(domains);
  }, [domains]);

  const filteredDomains = useMemo(() => {
    return domainsService.filterDomains(domains, { activeTab, searchQuery });
  }, [domains, activeTab, searchQuery]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
  }, []);

  const handleOpenDomain = useCallback((domain) => {
    setNotification({
      type: 'success',
      message: `Opening ${domain.name} in a new tab...`,
    });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  return {
    domains: filteredDomains,
    totalDomains: domains.length,
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
  };
}
