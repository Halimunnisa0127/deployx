const normalizeStatus = (status) => {
  if (!status) return '';
  const s = String(status).toLowerCase();
  if (s === 'ready' || s === 'success') return 'success';
  if (s === 'building' || s === 'deploying' || s === 'running') return 'building';
  return s;
};

export const deploymentsService = {
  getDeploymentCounts: (deployments = []) => {
    const counts = {
      all: (deployments || []).length,
      success: 0,
      building: 0,
      failed: 0,
      queued: 0,
    };

    (deployments || []).forEach((dep) => {
      const norm = normalizeStatus(dep.status);
      if (counts[norm] !== undefined) {
        counts[norm] += 1;
      }
    });

    return counts;
  },

  filterDeployments: (deployments = [], { activeTab, searchQuery } = {}) => {
    const query = (searchQuery || '').trim().toLowerCase();

    return (deployments || []).filter((dep) => {
      // Status filter
      if (activeTab && activeTab !== 'all') {
        const norm = normalizeStatus(dep.status);
        if (norm !== activeTab && String(dep.status).toLowerCase() !== activeTab) {
          return false;
        }
      }

      // Search filter
      if (query) {
        const matchProject = String(dep.projectName || dep.project?.name || '').toLowerCase().includes(query);
        const matchBranch = String(dep.branch || '').toLowerCase().includes(query);
        const matchCommitHash = String(dep.commitHash || '').toLowerCase().includes(query);
        const matchCommitMessage = String(dep.commitMessage || '').toLowerCase().includes(query);
        const matchEnvironment = String(dep.environment || '').toLowerCase().includes(query);
        const matchFramework = String(dep.framework || '').toLowerCase().includes(query);
        const matchId = String(dep.id || dep._id || dep.deploymentNumber || '').toLowerCase().includes(query);

        return matchProject || matchBranch || matchCommitHash || matchCommitMessage || matchEnvironment || matchFramework || matchId;
      }

      return true;
    });
  }
};

