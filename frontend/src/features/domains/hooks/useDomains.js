import { useState, useEffect, useMemo, useCallback } from 'react';
import { domainsApi } from '../api/domainsApi';
import { domainsService } from '../services/domainsService';
import { projectsService } from '../../projects/services/projects.service';

export function useDomains() {
  const [domains, setDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchDomains = useCallback(async () => {
    try {
      setIsLoading(true);
      const [projectsRes, domainsRes] = await Promise.allSettled([
        projectsService.fetchProjects(),
        domainsApi.getUserDomains(),
      ]);

      const userProjects = projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value)
        ? projectsRes.value
        : [];
      setProjects(userProjects);

      const rawDomains = domainsRes.status === 'fulfilled' && domainsRes.value?.data?.domains
        ? domainsRes.value.data.domains
        : (domainsRes.status === 'fulfilled' && Array.isArray(domainsRes.value?.data) ? domainsRes.value.data : []);

      const formattedDomains = rawDomains.map((d) => ({
        id: d._id || d.id,
        name: d.hostname,
        projectName: d.project?.name || 'Project',
        projectId: d.project?._id || d.project,
        framework: d.project?.framework || 'auto',
        environment: d.targetType === 'production' ? 'Production' : 'Preview',
        status: d.verificationStatus || 'pending', // 'verified', 'pending', 'failed'
        sslStatus: d.sslStatus || 'pending',
        dnsStatus: d.verificationStatus === 'verified' ? 'verified' : 'pending',
        createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent',
        url: `https://${d.hostname}`,
        isLive: d.status === 'active',
      }));

      setDomains(formattedDomains);
    } catch (err) {
      console.error("Failed to fetch domains:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

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
    if (domain.url) {
      window.open(domain.url, '_blank', 'noopener,noreferrer');
    }
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
    handleOpenDomain,
    refetch: fetchDomains,
    projects
  };
}
