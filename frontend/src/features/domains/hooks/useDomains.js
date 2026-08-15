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
      const userProjects = await projectsService.fetchProjects();
      setProjects(userProjects);
      
      const allDomains = [];
      for (const proj of userProjects) {
        const response = await domainsApi.getProjectDomains(proj._id);
        const projectDomains = response.data?.domains || [];
        projectDomains.forEach(d => {
          allDomains.push({
            id: d._id,
            name: d.hostname,
            projectName: proj.name,
            framework: proj.framework || 'auto',
            environment: d.targetType === 'production' ? 'Production' : 'Preview',
            status: d.verificationStatus, // 'verified', 'pending', 'failed'
            sslStatus: d.sslStatus === 'active' ? 'active' : 'pending',
            dnsStatus: d.verificationStatus === 'verified' ? 'verified' : 'pending',
            createdAt: new Date(d.createdAt).toLocaleDateString(),
            url: `https://${d.hostname}`,
            isLive: d.status === 'active',
          });
        });
      }
      setDomains(allDomains);
    } catch (err) {
      console.error("Failed to fetch domains", err);
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
