export const logsService = {
  filterLogs: (logs = [], { selectedProject = 'all', selectedLevel = 'all', searchQuery = '' } = {}) => {
    if (!Array.isArray(logs)) return [];
    const query = typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : '';

    return logs.filter((log) => {
      if (!log || typeof log !== 'object') return false;

      const matchesProject =
        selectedProject === 'all' ||
        log.project === selectedProject;

      const matchesLevel =
        selectedLevel === 'all' ||
        log.level === selectedLevel;

      if (!matchesProject || !matchesLevel) return false;

      if (!query) return true;

      const message = typeof log.message === 'string' ? log.message.toLowerCase() : '';
      const project = typeof log.project === 'string' ? log.project.toLowerCase() : '';
      const timestamp = typeof log.timestamp === 'string' ? log.timestamp.toLowerCase() : String(log.timestamp || '').toLowerCase();

      return (
        message.includes(query) ||
        project.includes(query) ||
        timestamp.includes(query)
      );
    });
  },

  getLogCounts: (logs = []) => {
    if (!Array.isArray(logs)) {
      return { errorCount: 0, warningCount: 0, successCount: 0 };
    }

    return {
      errorCount: logs.filter((l) => l?.level === 'error').length,
      warningCount: logs.filter((l) => l?.level === 'warning').length,
      successCount: logs.filter((l) => l?.level === 'success').length,
    };
  },

  formatLogsForExport: (logs = []) => {
    if (!Array.isArray(logs)) return '';

    return logs
      .filter((l) => l && typeof l === 'object')
      .map((l) => {
        const timestamp = l.timestamp || '';
        const project = l.project || 'unknown';
        const level = typeof l.level === 'string' ? l.level.toUpperCase() : 'INFO';
        const message = l.message || '';
        return `[${timestamp}] [${project}] [${level}] ${message}`;
      })
      .join('\n');
  }
};
