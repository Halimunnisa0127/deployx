export const domainsService = {
  getDomainCounts: (domains) => {
    const counts = {
      all: domains.length,
      verified: 0,
      pending: 0,
      failed: 0,
      production: 0,
      preview: 0,
    };

    domains.forEach((domain) => {
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
  },

  filterDomains: (domains = [], { activeTab, searchQuery } = {}) => {
    const query = (searchQuery || '').trim().toLowerCase();

    return (domains || []).filter((domain) => {
      // Status filter
      if (activeTab && activeTab !== 'all') {
        if (activeTab === 'production' || activeTab === 'preview') {
          if (String(domain.environment || '').toLowerCase() !== activeTab) return false;
        } else {
          if (String(domain.status || '').toLowerCase() !== activeTab.toLowerCase()) return false;
        }
      }

      // Search filter
      if (query) {
        const matchName = String(domain.name || domain.hostname || '').toLowerCase().includes(query);
        const matchProject = String(domain.projectName || domain.project?.name || '').toLowerCase().includes(query);
        const matchEnvironment = String(domain.environment || '').toLowerCase().includes(query);

        return matchName || matchProject || matchEnvironment;
      }

      return true;
    });
  }
};
