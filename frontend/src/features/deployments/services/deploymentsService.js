export const deploymentsService = {
  getDeploymentCounts: (deployments) => {
    const counts = {
      all: deployments.length,
      success: 0,
      building: 0,
      failed: 0,
      queued: 0,
    };

    deployments.forEach((dep) => {
      if (counts[dep.status] !== undefined) {
        counts[dep.status] += 1;
      }
    });

    return counts;
  },

  filterDeployments: (deployments, { activeTab, searchQuery }) => {
    const query = searchQuery.trim().toLowerCase();

    return deployments.filter((dep) => {
      // Status filter
      if (activeTab !== 'all' && dep.status !== activeTab) {
        return false;
      }

      // Search filter
      if (query) {
        const matchProject = dep.projectName.toLowerCase().includes(query);
        const matchBranch = dep.branch.toLowerCase().includes(query);
        const matchCommitHash = dep.commitHash.toLowerCase().includes(query);
        const matchCommitMessage = dep.commitMessage.toLowerCase().includes(query);
        const matchEnvironment = dep.environment.toLowerCase().includes(query);
        const matchFramework = dep.framework?.toLowerCase().includes(query);

        return matchProject || matchBranch || matchCommitHash || matchCommitMessage || matchEnvironment || matchFramework;
      }

      return true;
    });
  }
};
